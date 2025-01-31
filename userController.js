// userController.js

const User = require('./models/user');
const Nanobot = require('./models/nanobot');
const Simulation = require('./models/simulation');

// Create a new User
const createUser = async() => {
    const user = await User.create({
        username: 'testuser',
        email: 'testuser@example.com',
        passwordHash: 'hashedpassword', // Ensure to hash passwords in real apps
    });
    return user;
};

// Create a Nanobot and link it to the User
const createNanobot = async(userId) => {
    const nanobot = await Nanobot.create({
        name: 'NanoBot-1',
        userId: userId,
        status: 'active',
    });
    return nanobot;
};

// Create a Simulation and link it to the User and Nanobot
const createSimulation = async(userId, nanobotId) => {
    const simulation = await Simulation.create({
        simulationName: 'Simulation-1',
        status: 'running',
        startTime: new Date(),
        userId: userId,
        nanobotId: nanobotId,
        results: { result: 'Success' },
    });
    return simulation;
};

// Export functions to be used in other files
module.exports = {
    createUser,
    createNanobot,
    createSimulation,
};