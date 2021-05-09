const express = require('express');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const taskRoutes = require('./routes/task');
const aboutRoutes = require('./routes/about');

const app = express();

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Router
app.use('/api', [authRoutes, userRoutes, taskRoutes, aboutRoutes]);

module.exports = app;
