import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://todo-app-backend-wa4v.onrender.com/api/todos';

export const fetchTodos = createAsyncThunk(
  'todos/fetchTodos',
  async (page = 1, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`${API_URL}?page=${page}`, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const createTodo = createAsyncThunk(
  'todos/createTodo',
  async (text, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(API_URL, { text }, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const deleteTodo = createAsyncThunk(
  'todos/deleteTodo',
  async (id, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.delete(`${API_URL}/${id}`, config);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const toggleTodoStatus = createAsyncThunk(
    'todos/toggleStatus',
    async (id, { getState, rejectWithValue }) => {
      try {
        const { token } = getState().auth;
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await axios.patch(`${API_URL}/${id}`, {}, config);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data.message);
      }
    }
  );


  const todoSlice = createSlice({
    name: 'todos',
    initialState: {
      todos: [],
      currentPage: 1,
      totalPages: 1,
      loading: false,
      error: null,
    },
    reducers: {
      clearError: (state) => {
        state.error = null;
      },
    },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.loading = false;
        state.todos = action.payload.todos;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createTodo.fulfilled, (state, action) => {
        state.todos.unshift(action.payload);
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.todos = state.todos.filter(todo => todo._id !== action.payload);
      })
      .addCase(toggleTodoStatus.fulfilled, (state, action) => {
        const index = state.todos.findIndex(todo => todo._id === action.payload._id);
        if (index !== -1) {
          state.todos[index] = action.payload;
        }
      })
      .addCase(deleteTodo.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearError } = todoSlice.actions;
export default todoSlice.reducer;
