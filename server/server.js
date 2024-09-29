const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Sequelize, where } = require('sequelize');
const TaskModel = require('./models/tasks'); // Importa o modelo da Task

const app = express();
const port = 3000; // Porta para seu servidor Express

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Configuração do Sequelize para o PostgreSQL
const sequelize = new Sequelize('db_42fukf3xg', 'user_42fukf3xg', 'p42fukf3xg', {
  host: 'ocdb.app',
  port: 5052,
  dialect: 'postgres',
});

// Inicializa o modelo de tarefa
const Task = TaskModel(sequelize);

// Conecta ao banco de dados e sincroniza o modelo
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Conectado ao banco de dados com sucesso.');
    await Task.sync(); // Sincroniza o modelo com o banco de dados
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
  }
})();

// Endpoint para obter dados de tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.findAll(); // Usa o Sequelize para buscar todas as tasks
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});
app.get('/api/tasks/naofinalizada', async (req, res) => {
  try {
    const tasks = await Task.findAll({
      where: {
        finalizada: false
      }
    }); // Usa o Sequelize para buscar todas as tasks
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/api/tasks/finalizada', async (req, res) => {
  try {
    const tasks = await Task.findAll({
      where: {
        finalizada: true
      }
    }); // Usa o Sequelize para buscar todas as tasks
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// Endpoint para criar uma nova task
app.post('/api/tasks', async (req, res) => {
    try {
      const { title, description, status } = req.body;
  
      // Valida os dados de entrada
      if (!title) {
        return res.status(400).json({ error: 'O título é obrigatório' });
      }
  
      // Cria a nova task usando Sequelize
      const newTask = await Task.create({
        title,
        description,
        status: status || 'pending', // Define o status como 'pending' por padrão, se não for fornecido
      });
  
      // Retorna a task criada
      res.status(201).json(newTask);
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });
// Endpoint PUT para atualizar todas as tarefas, definindo "finalizada" como true
app.put('/api/tasks', async (req, res) => {
    console.log('Requisição PUT recebida'); 
    try {
      const [updatedCount] = await Task.update(
        { finalizada: true }, // Atualiza o campo 'finalizada' para true
        { where: {} } // Condição vazia atualiza todas as tarefas
      );

      console.log(`${updatedCount} tarefas foram atualizadas.`); // Log para saber quantas tarefas foram atualizadas

      if (updatedCount === 0) {
        console.log('Nenhuma tarefa foi encontrada para atualizar.');
        return res.status(404).json({ message: 'Nenhuma tarefa encontrada para atualizar.' });
      }

      res.status(200).json({ message: 'Todas as tarefas foram atualizadas para finalizada: true' });
    } catch (err) {
      console.error('Erro ao atualizar tarefas:', err.message); // Log detalhado do erro
      res.status(500).json({ error: 'Ocorreu um erro ao atualizar todas as tarefas', details: err.message });
    }
});
app.put('/api/tasks/:id', async (req, res) => {
    const taskId = req.params.id; // Captura o ID da tarefa a partir dos parâmetros da URL
    const { finalizada } = req.body; // Captura o valor de finalizada do corpo da requisição

    console.log(`Requisição PUT recebida para a tarefa com ID: ${taskId} e finalizada: ${finalizada}`); 
    
    try {
        // Verifica se o valor de 'finalizada' foi fornecido
        if (finalizada === undefined) {
            return res.status(400).json({ error: 'O campo finalizada deve ser fornecido.' });
        }

        // Atualiza a tarefa específica, definindo o campo 'finalizada' com o valor fornecido
        const [updatedCount] = await Task.update(
            { finalizada: finalizada }, // Atualiza o campo 'finalizada' com o valor fornecido
            { where: { task_id: taskId } } // Condição para encontrar a tarefa pelo ID
        );

        console.log(`${updatedCount} tarefa(s) foram atualizadas.`); // Log para saber quantas tarefas foram atualizadas

        if (updatedCount === 0) {
            console.log('Nenhuma tarefa encontrada para atualizar.');
            return res.status(404).json({ message: 'Nenhuma tarefa encontrada para atualizar.' });
        }

        res.status(200).json({ message: `Tarefa atualizada para finalizada: ${finalizada}` });
    } catch (err) {
        console.error('Erro ao atualizar tarefa:', err.message); // Log detalhado do erro
        res.status(500).json({ error: 'Ocorreu um erro ao atualizar a tarefa', details: err.message });
    }
});


app.delete('/api/tasks/:id', async (req, res) => {
  const task_id = req.params.id; // Captura o ID da tarefa a partir dos parâmetros da URL
  
  console.log(`Requisição DELETE recebida para a tarefa com ID: ${task_id}`); 
  
  try {
    const result = await Task.destroy({
      where: { task_id: task_id } // Altere "id" para "task_id" ou o nome correto
    });

    if (result === 0) {
      return res.status(404).json({ message: 'Task não encontrada.' });
    }

    return res.status(200).json({ message: 'Task deletada com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar a task:', error); // Adicione um log para debug
    return res.status(500).json({ message: 'Erro ao deletar a task.', error });
  }
});



  
  

// Inicia o servidor
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
