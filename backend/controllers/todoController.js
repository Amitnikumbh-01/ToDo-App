const Todo = require('../models/Todo');

// Get todos with pagination
const getTodos = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        const todos = await Todo.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Todo.countDocuments({ user: req.user._id });

        res.json({
            todos,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            total
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create todo
const createTodo = async (req, res) => {
    try {
        const { text } = req.body;
        const todo = await Todo.create({
            text,
            user: req.user._id
        });
        res.status(201).json(todo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const toggleTodoStatus = async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        if (todo.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        todo.completed = !todo.completed;
        await todo.save();
        
        res.json(todo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete todo
const deleteTodo = async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        if (todo.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        if (!todo.completed) {
            return res.status(400).json({ message: 'Cannot delete uncompleted todo' });
        }

        await todo.deleteOne();
        res.json({ message: 'Todo removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { 
    getTodos, 
    createTodo, 
    deleteTodo, 
    toggleTodoStatus // Add this to exports
};