import React, { useState } from 'react';
// ...existing code...

const MessageForm = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Reset error message

    try {
      // ...existing code to send message...
    } catch (err) {
      setError('Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* ...existing form fields... */}
      {error && <p className="error-message">{error}</p>}
      <button type="submit">Enviar</button>
    </form>
  );
};

export default MessageForm;
