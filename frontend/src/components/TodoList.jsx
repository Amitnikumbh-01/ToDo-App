import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTodos, createTodo, deleteTodo, toggleTodoStatus } from '../store/slices/todoSlice';
import { toast } from 'react-toastify';

function TodoList() {
  const [newTodo, setNewTodo] = useState('');
  const dispatch = useDispatch();
  const { todos, currentPage, totalPages, loading, error } = useSelector(
    (state) => state.todos
  );

  useEffect(() => {
    dispatch(fetchTodos(1));
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newTodo.trim()) {
      dispatch(createTodo(newTodo));
      setNewTodo('');
    }
  };

  const handleToggleStatus = (id) => {
    dispatch(toggleTodoStatus(id));
  };

  const handleDelete = async (id) => {
    const result = await dispatch(deleteTodo(id));
    if (result.error) {
      toast.error('Can only delete completed tasks');
    }
  };

  const handlePageChange = (page) => {
    dispatch(fetchTodos(page));
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            className="input-field flex-1"
            placeholder="Add a new task"
          />
          <button type="submit" className="btn-primary">
            Add Task
          </button>
        </div>
      </form>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <>
          <ul className="space-y-4">
            {todos.map((todo) => (
              <li
                key={todo._id}
                className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
              >
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggleStatus(todo._id)}
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                  <span className={todo.completed ? 'line-through text-gray-500' : ''}>
                    {todo.text}
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(todo._id)}
                  className={`px-3 py-1 rounded ${
                    todo.completed 
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  disabled={!todo.completed}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>

          {totalPages > 1 && (
            <div className="flex justify-center space-x-2 mt-8">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-3 py-1 rounded ${
                    currentPage === index + 1
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default TodoList;