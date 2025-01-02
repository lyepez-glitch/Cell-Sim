// db.js
require('dotenv').config(); // Load environment variables from .env file
const { Sequelize } = require('sequelize');

// Set up the Sequelize instance with the RDS credentials
const sequelize = new Sequelize(
    process.env.DB_NAME, // Database name
    process.env.DB_USER, // Database username
    process.env.DB_PASSWORD, // Database password
    {
        host: process.env.DB_HOST, // RDS endpoint
        dialect: 'mysql', // Dialect for MySQL
        port: process.env.DB_PORT, // Port (3306 for MySQL)
        logging: false, // Set to true to log SQL queries
    }
);

module.exports = sequelize;