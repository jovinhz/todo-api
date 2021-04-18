const express = require('express');
const taskController = require('../controllers/taskController');
const authenticate = require('../middlewares/authenticate');

const router = express.Router();

router.get('/tasks', authenticate, taskController.index);
router.post('/tasks', authenticate, taskController.store);
router.get('/tasks/:id', authenticate, taskController.show);
router.put('/tasks/:id', authenticate, taskController.update);
router.delete('/tasks/:id', authenticate, taskController.destroy);

module.exports = router;
