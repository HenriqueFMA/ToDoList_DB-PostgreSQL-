import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PostTask from './Post'; // Certifique-se de que o nome do arquivo seja o correto
import { SlOptionsVertical } from "react-icons/sl";
import { GoCheck } from "react-icons/go";

const Card = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('pendentes');
  const [activeTaskId, setActiveTaskId] = useState(null); // Armazena o ID da tarefa ativa

  // Abre o pop-up
  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  // Fecha o pop-up
  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  // Função para buscar todas as tasks não finalizadas
  const fetchNotFinalizedTasks = () => {
    setLoading(true);
    setActiveTab('pendentes');
    axios.get('http://localhost:3000/api/tasks/naofinalizada')
      .then(response => {
        setTasks(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError('Erro ao buscar tasks não finalizadas.');
        setLoading(false);
      });
  };
  const fetchFinalizedTasks = () => {
    setLoading(true);
    setActiveTab('completas');
    axios.get('http://localhost:3000/api/tasks/finalizada')
      .then(response => {
        // Log dos dados recebidos
        console.log('Dados recebidos:', response.data);
        
        // Verifique se a resposta tem dados
        if (response.data && Array.isArray(response.data)) {
          setTasks(response.data);
        } else {
          throw new Error('Formato de resposta inesperado');
        }
      })
      .catch(error => {
        // Log do erro
        console.error('Erro ao buscar tasks finalizadas:', error.response || error.message);
        setError('Erro ao buscar tasks finalizadas.');
      })
      .finally(() => {
        setLoading(false); // Garanta que o loading seja definido como false após a requisição
      });
  };
  
  
  
  

  // Função para buscar todas as tasks
  const fetchAllTasks = () => {
    setLoading(true);
    setActiveTab('todas');
    axios.get('http://localhost:3000/api/tasks')
      .then(response => {
        setTasks(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError('Erro ao buscar todas as tasks.');
        setLoading(false);
      });
  };

  // Atualizar status de finalização de uma task
  const handleToggleFinalizada = (taskId, finalizada) => {
    
    axios.put(`http://localhost:3000/api/tasks/${taskId}`, { finalizada: !finalizada })
      .then(() => {
        setTasks(prevTasks =>
          prevTasks.map(task =>
            task.task_id === taskId ? { ...task, finalizada: !finalizada } : task
          )
        );
      })
      .catch(error => {
        setError('Erro ao atualizar a task.');
      });
  };
  const handleToggleFinalizadaAll = () => {
    axios.put(`http://localhost:3000/api/tasks`, { finalizada: true }) // Muda todas para finalizada
      .then(() => {
        setTasks(prevTasks =>
          prevTasks.map(task => ({ ...task, finalizada: true })) // Atualiza todas as tarefas para finalizadas
        );
      })
      .catch(error => {
        setError('Erro ao atualizar as tasks.');
      });
  };
  const handleToggleDelete = (taskId) => {
    // Usar axios.delete para remover a tarefa
    axios.delete(`http://localhost:3000/api/tasks/${taskId}`)
      .then(() => {
        // Atualiza a lista de tarefas removendo a tarefa deletada
        setTasks(prevTasks =>
          prevTasks.filter(task => task.task_id !== taskId) // Filtra a tarefa deletada
        );
      })
      .catch(error => {
        setError('Erro ao deletar a task.'); // Mensagem de erro
        console.error(error); // Log do erro para depuração
      });
  };


  // Função para adicionar uma nova task na lista
  const handleAddTask = (newTask) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
    handleClosePopup(); // Fecha o pop-up após adicionar a task
  };

  return (
    <>
      <div onClick={() => setActiveTaskId(null)} className='w-[70%] h-[70%]  top-[15%] left-[50%] translate-x-[-50%] absolute bg-zinc-800'>
        <div>
          
          <h1 className='text-7xl text-white ml-[30%] font-sans '> Lista de Tarefas</h1>
        </div>
        <div>
          <button
            onClick={fetchNotFinalizedTasks}
            className={`align-middle h-12 border-b-2 border-t-0 border-l-0 border-r-0 ml-[10%] mr-[4%] border-purple-400 text-purple-400 ${activeTab === 'pendentes' ? 'text-white border-white' : ''}`}
          >
            Pendentes
          </button>

          <button
            onClick={fetchFinalizedTasks}
            className={`align-middle h-12 border-b-2 border-t-0 border-l-0 border-r-0 border-purple-400 text-purple-400 ${activeTab === 'completas' ? 'border-white text-white' : ''}`}>
            Completas
          </button>
          <button
            onClick={fetchAllTasks}
            className={`align-middle h-12 border-b-2 border-t-0 border-l-0 border-r-0 border-purple-400 text-purple-400 ml-[4%] ${activeTab === 'todas' ? 'border-white text-white' : ''}`}>
            Todas
          </button>


          <button
            onClick={handleOpenPopup}
            className='align-middle text-purple-400 h-12 w-28 border-b-2 border-t-0 border-l-0 border-r-0 border-purple-400 ml-[30%]  '>
            Criar tarefa
          </button>
          {activeTab === 'pendentes' && (
            <button
              onClick={handleToggleFinalizadaAll}
              className='align-middle w-32 h-12 border-b-2 border-t-0 border-l-0 border-r-0 border-purple-400 text-purple-400 ml-[2%] mr-[5%]'
            >
              Finalizar Todas
            </button>
          )}
        </div>

        {error && <p>{error}</p>}
        <div className='bg-red-50 w-[80%] ml-[10%] mt-[2%] border h-[52%]'>
          <ul className='list-none h-[97%] overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200'>
            {tasks.length > 0 ? (
              tasks.map(task => (
                <li key={task.task_id} className='border-b-2 border-t-0 border-l-0 border-r-0 border-gray-300 p-2'>
                  <div className="flex justify-between items-center border-b-2 border-t-0 border-l-0 border-r-0">
                    <div className="flex items-center space-x-2">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only" // Oculta o checkbox padrão
                          checked={task.finalizada}
                          onChange={() => handleToggleFinalizada(task.task_id, task.finalizada)}
                        />
                        <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center transition-all duration-300">
                          {task.finalizada && (
                            <GoCheck className="w-4 h-4 text-white" /> // Use o GoCheck aqui
                          )}
                        </div>
                      </label>
                      <span>{task.title}</span>
                    </div>

                    {/* Ícone de opções para mostrar/ocultar botões */}
                    <SlOptionsVertical onClick={(e) => { e.stopPropagation(); setActiveTaskId(task.task_id); }} />
                  </div>

                  <br />
                  <p>{task.description}</p>

                  {/* Renderiza os botões de "Editar" e "Excluir" apenas para a task ativa */}
                  {activeTaskId === task.task_id && (
                    <div className="flex justify-end space-x-2 mt-2">
                      <button className="bg-blue-500 text-white py-1 px-3 rounded-md">Editar</button>
                      <button on onClick={() => handleToggleDelete(task.task_id)} className="bg-red-500 text-white py-1 px-3 rounded-md">Excluir</button>
                    </div>
                  )}
                </li>
              ))
            ) : (
              <p>Nenhuma task encontrada.</p>
            )}
          </ul>
        </div>
      </div>

      {/* Exibe o pop-up de criação de tarefa */}
      {isPopupOpen && (
        <PostTask onClose={handleClosePopup} onAddTask={handleAddTask} />
      )}
    </>
  );
};

export default Card;
