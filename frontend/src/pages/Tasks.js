import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import './Tasks.css';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'medium' });
  const [filter, setFilter] = useState('all');
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const res = await axios.get('/api/tasks');
      setTasks(res.data);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    try {
      await axios.post('/api/tasks', newTask);
      setNewTask({ title: '', description: '', priority: 'medium' });
      loadTasks();
    } catch (error) {
      alert('Failed to create task');
    }
  };

  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      await axios.put(`/api/tasks/${taskId}`, { status: newStatus });
      loadTasks();
    } catch (error) {
      alert('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      await axios.delete(`/api/tasks/${taskId}`);
      loadTasks();
    } catch (error) {
      alert('Failed to delete task');
    }
  };

  const handleEditTask = async (taskId, updates) => {
    try {
      await axios.put(`/api/tasks/${taskId}`, updates);
      setEditingTask(null);
      loadTasks();
    } catch (error) {
      alert('Failed to update task');
    }
  };

  const handleAddDemoTasks = async () => {
    if (window.confirm('Add 8 demo tasks?')) {
      try {
        const res = await axios.post('/api/tasks/demo');
        alert(`${res.data.count} demo tasks added!`);
        loadTasks();
      } catch (error) {
        alert('Error adding demo tasks: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const handleClearAllTasks = async () => {
    if (window.confirm('Are you sure you want to clear ALL tasks? This cannot be undone!')) {
      try {
        const res = await axios.delete('/api/tasks/clear');
        alert(`${res.data.count} tasks cleared!`);
        loadTasks();
      } catch (error) {
        alert('Error clearing tasks: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  const tasksByStatus = {
    pending: filteredTasks.filter(t => t.status === 'pending'),
    completed: filteredTasks.filter(t => t.status === 'completed')
  };

  return (
    <div>
      <Navbar />
      <main className="tasks-page">
        <div className="tasks-container">
          <h2 className="page-title">Task Management</h2>

          <div className="task-form-card">
            <h3>Create New Task</h3>
            <form onSubmit={handleCreateTask}>
              <div className="form-row">
                <input
                  type="text"
                  placeholder="Task title..."
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  required
                />
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
                <button type="submit" className="btn-add">+ Add Task</button>
              </div>
              <textarea
                placeholder="Description (optional)..."
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                rows="2"
              />
            </form>
          </div>

          <div className="tasks-filter">
            <button
              className={filter === 'all' ? 'active' : ''}
              onClick={() => setFilter('all')}
            >
              All ({tasks.length})
            </button>
            <button
              className={filter === 'pending' ? 'active' : ''}
              onClick={() => setFilter('pending')}
            >
              Pending
            </button>
            <button
              className={filter === 'completed' ? 'active' : ''}
              onClick={() => setFilter('completed')}
            >
              Completed
            </button>
          </div>

          <div className="tasks-board">
            {filter === 'all' ? (
              <>
                <div className="tasks-column">
                  <h3>📋 Pending</h3>
                  {tasksByStatus.pending.map(task => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onStatusChange={handleUpdateStatus}
                      onDelete={handleDeleteTask}
                      onEdit={handleEditTask}
                      editingTask={editingTask}
                      setEditingTask={setEditingTask}
                    />
                  ))}
                </div>
                <div className="tasks-column">
                  <h3>✅ Completed</h3>
                  {tasksByStatus.completed.map(task => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onStatusChange={handleUpdateStatus}
                      onDelete={handleDeleteTask}
                      onEdit={handleEditTask}
                      editingTask={editingTask}
                      setEditingTask={setEditingTask}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="tasks-list">
                {filteredTasks.map(task => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onStatusChange={handleUpdateStatus}
                    onDelete={handleDeleteTask}
                    onEdit={handleEditTask}
                    editingTask={editingTask}
                    setEditingTask={setEditingTask}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="tasks-bottom-actions">
            <button onClick={handleAddDemoTasks} className="btn-demo-tasks">Add Demo Tasks</button>
            <button onClick={handleClearAllTasks} className="btn-clear-tasks">Clear All Tasks</button>
          </div>
        </div>
      </main>
    </div>
  );
};

const TaskCard = ({ task, onStatusChange, onDelete, onEdit, editingTask, setEditingTask }) => {
  const [editForm, setEditForm] = useState({ title: task.title, description: task.description });

  const isEditing = editingTask === task._id;

  const handleSaveEdit = () => {
    onEdit(task._id, editForm);
  };

  return (
    <div className={`task-card priority-${task.priority}`}>
      {isEditing ? (
        <div className="task-edit-form">
          <input
            type="text"
            value={editForm.title}
            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
          />
          <textarea
            value={editForm.description}
            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
            rows="2"
          />
          <div className="task-edit-actions">
            <button onClick={handleSaveEdit} className="btn-save">Save</button>
            <button onClick={() => setEditingTask(null)} className="btn-cancel">Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <div className="task-header">
            <h4>{task.title}</h4>
            <span className={`priority-badge priority-${task.priority}`}>{task.priority}</span>
          </div>
          {task.description && <p className="task-description">{task.description}</p>}
          <div className="task-actions">
            <select
              value={task.status}
              onChange={(e) => onStatusChange(task._id, e.target.value)}
              className="status-select"
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
            <button onClick={() => setEditingTask(task._id)} className="btn-edit">Edit</button>
            <button onClick={() => onDelete(task._id)} className="btn-delete">Delete</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Tasks;
