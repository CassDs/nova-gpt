
# Nova Assistant - FICO Blaze Advisor

Este projeto consiste em uma interface de chat (frontend) desenvolvida em React que se comunica com uma API FastAPI (backend) para fornecer assistência especializada em FICO Blaze Advisor.

## Estrutura do Projeto

- `api/` - Código backend FastAPI
- `src/` - Código frontend React

## Requisitos

### Backend (Python)
- Python 3.8+
- FastAPI
- Uvicorn
- Sentence Transformers
- FAISS
- OpenAI
- Dotenv

### Frontend (React)
- Node.js
- npm ou yarn

## Configuração do Backend

1. Crie um arquivo `.env` na raiz do projeto com sua chave de API OpenAI:
   ```
   OPENAI_API_KEY=sua_chave_aqui
   ```

2. Certifique-se de ter os arquivos FAISS necessários:
   - `./FAISS/faiss_index.bin`
   - `./FAISS/text_chunks.pkl`

3. Instale as dependências:
   ```bash
   pip install fastapi uvicorn sentence-transformers faiss-cpu openai python-dotenv
   ```

4. Execute o servidor:
   ```bash
   cd api
   python main.py
   ```

## Configuração do Frontend

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Execute o frontend:
   ```bash
   npm run dev
   ```

## Uso

1. Inicie o servidor backend e o frontend
2. Acesse a interface web e comece a fazer perguntas sobre FICO Blaze Advisor
3. O sistema irá buscar informações relevantes na base de conhecimento (via FAISS) e gerar respostas usando o modelo GPT da OpenAI

## Observações

- Certifique-se de que o backend esteja rodando na porta 8000, que é a porta padrão que o frontend tenta se conectar.
- Em produção, considere configurar adequadamente o CORS e usar variáveis de ambiente para URLs de API.
