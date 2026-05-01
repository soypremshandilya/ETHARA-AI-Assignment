const express = require('express');
const router = express.Router();
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask
} = require('../controllers/taskController');

const { protect, adminOnly } = require('../middleware/auth');

router.route('/')
  .get(protect, getTasks)
  .post(protect, adminOnly, createTask);

router.route('/:id')
  .put(protect, updateTask) // Members can update their own tasks' status
  .delete(protect, adminOnly, deleteTask);

module.exports = router;
