const Validator = require('validatorjs');
const bcrypt = require('bcryptjs');

const userController = {
  show: async (req, res) => {
    res.status(200).send({
      email: req.user.email,
      name: req.user.name
    });
  },
  updateProfile: async (req, res) => {
    try {
      const validator = new Validator(req.body, {
        name: 'min:3'
      });

      validator.check();

      if (validator.fails()) {
        return res.status(422).send(validator.errors.all());
      }

      const user = req.user;
      user.name = req.body.name;

      user.save();

      res.status(200).send({
        email: user.email,
        name: user.name
      });
    } catch (err) {
      return res.status(500).send(err);
    }
  },
  updatePassword: async (req, res) => {
    try {
      const validator = new Validator(req.body, {
        old_password: 'required',
        new_password: 'required|min:4'
      });

      validator.check();

      if (validator.fails()) {
        return res.status(422).send(validator.errors.all());
      }

      const user = req.user;
      const match = await bcrypt.compare(req.body.old_password, user.password);

      if (!match) {
        throw new Error('Password lama salah.');
      }

      user.password = await bcrypt.hash(req.body.new_password, 8);
      user.save();

      res.status(200).send();
    } catch (err) {
      return res
        .status(422)
        .send({ message: err.message || 'Kesalahan format data.' });
    }
  }
};

module.exports = userController;
