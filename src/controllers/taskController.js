const db = require('../../models');
const Validator = require('validatorjs');

const Task = db.Task;

const taskController = {
  index: async (req, res) => {},
  store: async (req, res) => {
    const validator = new Validator(req.body, {
      title: 'required',
      description: 'required'
    });

    if (validator.fails()) {
      return res.status(422).send(validator.errors.all());
    }

    try {
      const task = await Task.create(req.body);

      res.status(201).send(task);
    } catch (err) {
      res.status(500).send(err);
    }
  },
  show: async (req, res) => {},
  update: async (req, res) => {},
  destroy: async (req, res) => {}
};

module.exports = taskController;
