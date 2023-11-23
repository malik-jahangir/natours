/* eslint-disable no-console */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('Uncaught Exception! Shutting down...');
  process.exit(1);
});
dotenv.config({ path: './config.env' });
mongoose
  .connect(process.env.MONGO_CON_PROD)
  .then(() => {
    console.log('connected to database');
  });
const server = app.listen(3000, () => {
  console.log(`listening on port 3000. Env:${process.env.NODE_ENV}`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('Unhandled rejection! Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
