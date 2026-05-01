const Task = require('../models/Task');
const Project = require('../models/Project');

// @desc    Get all tasks for a project or all user tasks
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    const { projectId } = req.query;
    let query = {};

    if (projectId) {
      query.projectId = projectId;
    } else if (req.user.role !== 'Admin') {
      // Find all projects where the user is a member
      const userProjects = await Project.find({ members: req.user._id }).select('_id');
      const projectIds = userProjects.map(p => p._id);
      
      // Get tasks either assigned specifically to user OR belonging to projects they are members of
      query.$or = [
        { assignedTo: req.user._id },
        { projectId: { $in: projectIds } }
      ];
    }

    const tasks = await Task.find(query).populate('assignedTo', 'name email').populate('projectId', 'name');
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private/Admin
const createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, projectId, dueDate, priority } = req.body;

    if (!title || !description || !projectId) {
      return res.status(400).json({ message: 'Please add title, description, and project' });
    }

    // Verify project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const task = await Task.create({
      title,
      description,
      assignedTo,
      projectId,
      dueDate,
      priority
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check permissions: Admin can update anything, Member can only update status if assigned
    if (req.user.role !== 'Admin') {
      if (task.assignedTo && task.assignedTo.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to update this task' });
      }
      
      // Members can only update status
      const { status } = req.body;
      if (status) {
        task.status = status;
        await task.save();
        return res.status(200).json(task);
      } else {
         return res.status(400).json({ message: 'Members can only update task status' });
      }
    }

    // Admin update
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private/Admin
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await task.deleteOne();
    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask
};
