const express = require('express');
const authRoutes = require('./routes/auth');
const todoRoutes = require('./routes/todo');

const app = express();

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Router
app.use('/api', [authRoutes, todoRoutes]);

module.exports = app;
