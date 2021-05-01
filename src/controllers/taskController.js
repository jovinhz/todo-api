const db = require('../../models');
const Validator = require('validatorjs');

const Task = db.Task;
const User = db.User;

const taskController = {
  // Implementasi Req Query
  index: async (req, res) => {
    try {
      const sort = req.query.order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
      const columns = ['deadline', 'title'];

      const tasks = (
        await User.findByPk(req.user.id, {
          order: columns.includes(req.query.sortBy)
            ? [[Task, req.query.sortBy, sort]]
            : [],
          include: [Task]
        })
      ).Tasks;

      res.status(200).send(tasks);
    } catch (err) {
      res.status(500).send(err);
    }
  },
  store: async (req, res) => {
    const validator = new Validator(req.body, {
      title: 'required',
      description: 'required',
      deadline: 'date'
    });

    if (validator.fails()) {
      return res.status(422).send(validator.errors.all());
    }

    try {
      const task = await Task.create({ ...req.body, userId: req.user.id });

      res.status(201).send(task);
    } catch (err) {
      res.status(500).send(err);
    }
  },

  // Implementasi Params
  show: async (req, res) => {
    try {
      const _task = await User.findByPk(req.user.id, {
        include: [
          {
            model: Task,
            where: {
              id: req.params.id
            }
          }
        ]
      });

      if (!_task) {
        res.status(404).send({
          message: 'Data tidak ditemukan.'
        });
      }

      res.status(200).send(_task.Tasks[0]);
    } catch (err) {
      res.status(500).send(err);
    }
  },
  update: async (req, res) => {
    try {
      const validator = new Validator(req.body, {
        title: 'required',
        description: 'required',
        deadline: 'date'
      });

      if (validator.fails()) {
        return res.status(422).send(validator.errors.all());
      }

      const task = await Task.findOne({
        where: {
          userId: req.user.id,
          id: req.params.id
        }
      });

      if (!task) {
        return res.status(404).send({
          message: 'Data tidak ditemukan.'
        });
      }

      task.title = req.body.title;
      task.description = req.body.description;

      if (task.deadline) task.deadline = req.body.deadline;

      await task.save();

      res.status(200).send(task);
    } catch (err) {
      res.status(500).send(err);
    }
  },
  destroy: async (req, res) => {
    try {
      const task = await Task.findOne({
        where: {
          userId: req.user.id,
          id: req.params.id
        }
      });

      if (!task) {
        return res.status(404).send({ message: 'Data tidak ditemukan.' });
      }

      await task.destroy();

      res.status(200).send({ message: 'Data berhasil dihapus.' });
    } catch (err) {
      res.status(500).send(err);
    }
  }
};

module.exports = taskController;
