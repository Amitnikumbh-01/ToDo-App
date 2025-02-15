const express = require('express');
const router = express.Router();
const { getTodos, createTodo, deleteTodo, toggleTodoStatus } = require('../controllers/todoController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getTodos)
    .post(protect, createTodo);
router.route('/:id')
    .delete(protect, deleteTodo)
    .patch(protect, toggleTodoStatus); // Add this new route

module.exports = router;