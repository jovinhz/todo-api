const db = require('../../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../../config/jwt');
const Validator = require('validatorjs');

const User = db.User;

const authController = {
  signup: async (req, res) => {
    let validation = new Validator(req.body, {
      name: 'required|min:3',
      email: 'required|email',
      password: 'required|min:4',
      password_confirmation: 'required|min:4'
    });

    validation.check();

    if (req.body.password !== req.body.password_confirmation) {
      validation.errors.add(
        'password_confirmation',
        'Password dan konfirmasi password tidak sesuai.'
      );
    }

    if (validation.fails() || validation.errors.has('password_confirmation')) {
      return res.status(422).send(validation.errors.all());
    }

    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 8);
      const user = await User.create({
        email: req.body.email,
        name: req.body.name,
        password: hashedPassword
      });

      res.status(201).send(user);
    } catch (err) {
      res.status(400).send({
        message: 'Kesalahan format data'
      });
    }
  },

  signin: async (req, res) => {
    try {
      const user = await User.findOne({
        where: {
          email: req.body.email
        }
      });

      if (!user) {
        throw new Error('User tidak ditemukan.');
      }

      const match = await bcrypt.compare(req.body.password, user.password);
      if (!match) {
        throw new Error('Email atau password salah.');
      }

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email
        },
        jwtConfig.secret,
        {
          expiresIn: jwtConfig.expired
        }
      );

      res.status(200).send({
        token,
        user
      });
    } catch (err) {
      res.status(400).send({
        message: err.message
      });
    }
  }
};

module.exports = authController;
