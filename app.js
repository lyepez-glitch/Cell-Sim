require('dotenv').config()
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const sequelize = require('./db');
const User = require('./models/User');
const Nanobot = require('./models/Nanobot');
const Simulation = require('./models/Simulation');
const { interactWithCell } = require('./nanobotLogic');
const cors = require('cors');
app.use(express.json());
app.use(cors());
// Sync models with the database
sequelize.sync({ force: false }) // Set force: true to drop and recreate tables (use with caution)
    .then(() => {
        console.log('Database synchronized');
    })
    .catch((error) => {
        console.error('Error synchronizing database:', error);
    });

const { createUser, createNanobot, createSimulation } = require('./userController');

app.get('/', (req, res) => {
    res.send('Welcome to the Nanobot Simulation API');
});

// CRUD routes for Users
app.post('/users', async(req, res) => {
    const { username, email, passwordHash } = req.body;
    try {
        const user = await User.create({ username, email, passwordHash });
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.get('/users/:id', async(req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// CRUD routes for Nanobots
app.post('/nanobots', async(req, res) => {
    const { name, userId, status } = req.body;
    try {
        const nanobot = await Nanobot.create({ name, userId, status });
        res.status(201).json(nanobot);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.get('/nanobots', async(req, res) => {
    try {
        // Fetch all nanobots
        const nanobots = await Nanobot.findAll();
        if (nanobots.length === 0) {
            return res.status(404).json({ error: 'No nanobots found' });
        }
        res.json(nanobots);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.get('/nanobots/:id', async(req, res) => {
    const { id } = req.params;
    try {
        const nanobot = await Nanobot.findByPk(id);
        if (!nanobot) {
            return res.status(404).json({ error: 'Nanobot not found' });
        }
        res.json(nanobot);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// CRUD routes for Simulations
app.post('/simulations', async(req, res) => {
    const { simulationName, status, startTime, userId, nanobotId, results } = req.body;
    try {
        const simulation = await Simulation.create({
            simulationName,
            status,
            startTime,
            userId,
            nanobotId,
            results,
        });
        res.status(201).json(simulation);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.get('/simulations/:id', async(req, res) => {
    const { id } = req.params;
    try {
        const simulation = await Simulation.findByPk(id);
        if (!simulation) {
            return res.status(404).json({ error: 'Simulation not found' });
        }
        res.json(simulation);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.put('/simulations/:id', async(req, res) => {
    const { id } = req.params;
    // const { simulationName, status, startTime, results } = req.body;
    const { simulationName, status, startTime, userId, nanobotId, results } = req.body;
    console.log('req update sim payload', req.body)

    try {
        const simulation = await Simulation.findByPk(id);
        if (!simulation) {
            return res.status(404).json({ error: 'Simulation not found' });
        }

        const nanobot = await Nanobot.findByPk(nanobotId);
        if (!nanobot) {
            return res.status(404).json({ error: 'Nanobot not found' });
        }

        if (!simulation.results || !Array.isArray(simulation.results)) {
            return res.status(400).json({ error: 'Invalid cell data provided' });
        }

        const cellResults = simulation.results.map((cell) => {
            const cellResult = interactWithCell(cell, nanobot.name);
            return {...cell, cellResult };
        });


        simulation.simulationName = simulationName || simulation.simulationName;
        simulation.status = status || simulation.status;
        simulation.startTime = startTime || simulation.startTime;
        simulation.nanobotId = nanobotId || simulation.nanobotId;
        simulation.results = cellResults || simulation.results;

        await simulation.save();
        res.json(simulation);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.delete('/simulations/:id', async(req, res) => {
    const { id } = req.params;
    try {
        const simulation = await Simulation.findByPk(id);
        if (!simulation) {
            return res.status(404).json({ error: 'Simulation not found' });
        }
        await simulation.destroy();
        res.json({ message: 'Simulation deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Example endpoint to simulate nanobot behavior
app.post('/simulate-nanobot', async(req, res) => {
    const { nanobotId, cells } = req.body; // Cells is an array of cell objects
    try {
        const nanobot = await Nanobot.findByPk(nanobotId);
        if (!nanobot) {
            return res.status(404).json({ error: 'Nanobot not found' });
        }

        if (!cells || !Array.isArray(cells)) {
            return res.status(400).json({ error: 'Invalid cell data provided' });
        }

        const results = cells.map((cell) => {
            const result = interactWithCell(cell, nanobot.name);
            return {...cell, result };
        });

        res.status(200).json({
            message: `Simulation for Nanobot ${nanobot.name} completed.`,
            results,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});