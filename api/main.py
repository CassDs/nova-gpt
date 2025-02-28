
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import faiss
import pickle
import numpy as np
import os
from sentence_transformers import SentenceTransformer
from openai import OpenAI
from dotenv import load_dotenv

# Carregar variáveis do .env
load_dotenv()

app = FastAPI(title="Nova Assistant API")

# Configurar CORS para permitir solicitações do frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, especifique os domínios permitidos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelo para as requisições de chat
class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None

# Modelo para a resposta
class ChatResponse(BaseModel):
    response: str
    conversation_id: str

# Armazenamento de conversas (em produção usaria um banco de dados)
conversations = {}

# Carregar FAISS e embeddings
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FAISS_INDEX_PATH = os.path.join(BASE_DIR, "FAISS/index.faiss")
METADATA_PATH = os.path.join(BASE_DIR, "FAISS/text_chunks.pkl")

def load_faiss_index(index_path, metadata_path):
    """Carrega o índice FAISS e os chunks de texto."""
    if not os.path.exists(index_path) or not os.path.exists(metadata_path):
        print(f"Erro: Arquivo {index_path} ou {metadata_path} não encontrado.")
        return None, []
    
    try:
        index = faiss.read_index(index_path)
        with open(metadata_path, "rb") as f:
            chunks = pickle.load(f)
        return index, chunks
    except Exception as e:
        print(f"Erro ao carregar o índice FAISS: {e}")
        return None, []

print(f"Verificando arquivos FAISS: {FAISS_INDEX_PATH} e {METADATA_PATH}")
index, chunks = load_faiss_index(FAISS_INDEX_PATH, METADATA_PATH)
print(f"Índice FAISS carregado: {index is not None}, Número de chunks: {len(chunks) if chunks else 0}")

# Carregar modelo de embeddings
try:
    print("Inicializando modelo de embeddings...")
    embedding_model = SentenceTransformer("BAAI/bge-m3")
    print("Modelo de embeddings carregado com sucesso")
except Exception as e:
    print(f"Erro ao carregar o modelo de embeddings: {e}")
    embedding_model = None

# Cliente OpenAI
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    print("AVISO: OPENAI_API_KEY não definida no arquivo .env!")
else:
    print("OPENAI_API_KEY encontrada")

openai_client = OpenAI(api_key=api_key)

def search_faiss(query, top_k=5):
    """Busca os chunks mais relevantes no FAISS."""
    if index is None or embedding_model is None:
        print("Índice FAISS ou modelo de embeddings não disponível")
        return []
    
    try:
        print(f"Gerando embedding para a consulta: '{query}'")
        query_embedding = embedding_model.encode([query], convert_to_numpy=True)
        D, I = index.search(query_embedding, top_k)
        results = [chunks[i] for i in I[0] if i != -1]
        print(f"Busca FAISS concluída: {len(results)} resultados encontrados")
        return results
    except Exception as e:
        print(f"Erro na busca FAISS: {e}")
        return []

def generate_response(query, retrieved_texts, conversation_id):
    """Gera uma resposta considerando o histórico da conversa."""
    print(f"Gerando resposta para: '{query}' (ID da conversa: {conversation_id})")
    
    if not retrieved_texts:
        print("Nenhum texto relevante encontrado")
        return "Não encontrei essa informação no material."

    context = "\n".join(retrieved_texts)

    # Obter histórico da conversa
    conversation_history = []
    if conversation_id in conversations:
        # Pegar os últimos 5 turnos
        conversation_history = conversations[conversation_id][-10:]
        print(f"Histórico da conversa encontrado: {len(conversation_history)} mensagens")
    else:
        print("Nenhum histórico de conversa encontrado")

    # Criar um histórico concatenado
    history_text = "\n".join(conversation_history)

    prompt = f"""
    Você é Nova, um especialista em FICO Blaze Advisor.
    
    **Histórico da Conversa:**
    {history_text}
    
    **Contexto relevante extraído da base de conhecimento:**
    {context}
    
    **Pergunta do usuário:**
    "{query}"
    
    **Instruções importantes**:
    - Se a solicitação for uma pergunta sobre o conteúdo, explique de forma clara e objetiva.
    - Se o usuário fornecer um código e solicitar uma melhoria, análise crítica ou refatoração, forneça uma versão otimizada seguindo as melhores práticas do Blaze Advisor.
    - Sempre explique as melhorias feitas ao código, se aplicável.
    - Se a solicitação do usuário não puder ser respondida com base no contexto, responda apenas: "Não encontrei essa informação no material."
    - Nunca invente informações que não estejam no contexto.

    **Resposta:**
    """

    try:
        print("Enviando solicitação para OpenAI")
        response = openai_client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "Você é Nova, um assistente especializado em FICO Blaze Advisor."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.1
        )
        
        response_text = response.choices[0].message.content
        print("Resposta gerada com sucesso")
        
        # Atualizar o histórico
        if conversation_id not in conversations:
            conversations[conversation_id] = []
        
        conversations[conversation_id].append(f"Usuário: {query}")
        conversations[conversation_id].append(f"Nova: {response_text}")
        
        return response_text
    except Exception as e:
        print(f"Erro ao gerar resposta com OpenAI: {e}")
        return "Desculpe, ocorreu um erro ao processar sua solicitação."

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        print(f"Recebida solicitação de chat: {request.message}, ID: {request.conversation_id}")
        # Gerar ID de conversa se não existir
        conversation_id = request.conversation_id or str(len(conversations) + 1)
        
        # Buscar no FAISS
        retrieved_texts = search_faiss(request.message)
        
        # Gerar resposta
        response = generate_response(request.message, retrieved_texts, conversation_id)
        
        print(f"Resposta enviada para o cliente, ID da conversa: {conversation_id}")
        return {
            "response": response,
            "conversation_id": conversation_id
        }
    except Exception as e:
        print(f"Erro no endpoint /api/chat: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/conversations/{conversation_id}")
async def get_conversation(conversation_id: str):
    print(f"Solicitação para obter conversa ID: {conversation_id}")
    if conversation_id not in conversations:
        print(f"Conversa não encontrada: {conversation_id}")
        raise HTTPException(status_code=404, detail="Conversa não encontrada")
    
    print(f"Devolvendo histórico com {len(conversations[conversation_id])} mensagens")
    return {"history": conversations[conversation_id]}

# Rota de verificação de saúde do serviço
@app.get("/health")
async def health_check():
    return {
        "status": "online",
        "faiss_index": index is not None,
        "embedding_model": embedding_model is not None,
        "openai_api_key": api_key is not None,
        "conversations_count": len(conversations)
    }

if __name__ == "__main__":
    import uvicorn
    print("Iniciando servidor FastAPI...")
    uvicorn.run(app, host="0.0.0.0", port=8000)
