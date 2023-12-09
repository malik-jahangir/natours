/* eslint-disable no-console */
const dotenv = require('dotnev');
const fs = require('fs');
const mongoose = require('mongoose');
const Tour = require('../models/tourModel');
const User = require('../models/userModel');

dotenv.config({ path: './config.env ' });

mongoose.connect(process.env.MONGO_CON_PROD).then(() => {
  console.log('Database connection successful');
});

// Read JSON file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));

// Import data into db
const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validatebeforesave: false });
    console.log('Data successfully added');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// Delete all data
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    console.log('Data successfully deleted');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
