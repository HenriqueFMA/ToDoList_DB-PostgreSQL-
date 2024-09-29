import React, { useState } from 'react';
import axios from 'axios';

const PostTask = ({ onClose, onAddTask }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Função para enviar a nova tarefa
  const handlePostTask = () => {
    setLoading(true);

    const newTask = {
      title,
      description,
      finalizada: false, // Define a task como não finalizada por padrão
    };

    axios.post('http://localhost:3000/api/tasks', newTask)
      .then(response => {
        setLoading(false);
        onAddTask(response.data); // Adiciona a nova task na lista
        onClose(); // Fecha o pop-up automaticamente após a criação da tarefa
      })
      .catch(error => {
        setError('Erro ao criar a nova tarefa.');
        setLoading(false);
      });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-lg w-80 text-center">
        <h2 className="mb-4 text-lg font-bold">Criar nova tarefa</h2>

        <input
          type="text"
          placeholder="Título da tarefa"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full mb-4 p-2 border"
        />

        <textarea
          placeholder="Descrição da tarefa"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full mb-4 p-2 border"
        />

        {loading ? <p>Enviando...</p> : null}
        {error ? <p>{error}</p> : null}

        <button
          onClick={handlePostTask}
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
          disabled={loading || !title || !description} // Desabilita o botão se estiver carregando ou se os campos estiverem vazios
        >
          Criar tarefa
        </button>

        <button
          onClick={onClose}
          className="mt-4 bg-red-500 text-white py-2 px-4 rounded"
        >
          Fechar
        </button>
      </div>
    </div>
  );
};

export default PostTask;
