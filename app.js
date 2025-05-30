require('dotenv').config()
const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const app = express();
const PORT = process.env.PORT || 3000;
const sequelize = require('./db');
const Profile = require('./models/Profile')(sequelize, Sequelize.DataTypes);
const Nanobot = require('./models/Nanobot')(sequelize, Sequelize.DataTypes);
const Simulation = require('./models/Simulation')(sequelize, Sequelize.DataTypes);


const { interactWithCell } = require('./nanobotLogic');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const JWT_SECRET = process.env.JWT_SECRET;
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

app.post('/login', async(req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        // 1. Find the user by email
        const user = await Profile.findOne({ where: { email } }); // Sequelize example
        // For Mongoose, it would be: const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // 2. Compare the provided password with the stored hash
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // 3. Generate a JWT or Session Token
        const token = jwt.sign({ userId: user.id, username: user.username, email: user.email },
            JWT_SECRET, { expiresIn: '1h' } // Set expiration time as needed
        );

        // 4. Return the token (or other user details) as a response
        res.status(200).json({
            message: 'Login successful',
            token, // Send token to the client
            user: {
                username: user.username,
                email: user.email,
                id: user.id
            },
        });

    } catch (err) {
        // console.error(err);
        res.status(500).json({ error: 'Something went wrong. Please try again later.' });
    }
});


// CRUD routes for Users
app.post('/users', async(req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await Profile.create({ username, email, password: hashedPassword });
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.get('/users/:id', async(req, res) => {
    const { id } = req.params;
    try {
        // Fetch user by ID
        const user = await Profile.findByPk(id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Return the user data
        res.json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// CRUD routes for Nanobots
app.post('/nanobots', async(req, res) => {
    const { name, userId, status } = req.body;
    console.log('userid', typeof userId, userId);
    try {
        const nanobot = await Nanobot.create({ name, userId, status });
        res.status(201).json(nanobot);
    } catch (err) {
        console.log('err', err.message);
        res.status(400).json({ error: err.message });
    }
});

app.get('/nanobots', async(req, res) => {
    // try {
    //     // Fetch all nanobots
    //     const nanobots = await Nanobot.findAll();
    //     if (nanobots.length === 0) {
    //         return res.status(404).json({ error: 'No nanobots found' });
    //     }
    //     res.json(nanobots);
    // } catch (err) {
    //     res.status(400).json({ error: err.message });
    // }

    // Fetch all nanobots
    let nanobots = await Nanobot.findAll();

    if (nanobots.length === 0) {
        // return res.status(404).json({ error: 'No nanobots found' });
        nanobots = [];
    }
    res.json(nanobots);

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
    console.log('results', results);
    const strResults = JSON.stringify(results);
    try {
        const simulation = await Simulation.create({
            simulationName,
            status,
            startTime,
            userId,
            nanobotId,
            results: strResults,
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
    // console.log('res', results, typeof results);
    console.log('req update sim payload', req.body)
        // const simulation = await Simulation.findByPk(id);
        // console.log('sim', typeof simulation.results, JSON.parse(simulation.results));

    try {
        const simulation = await Simulation.findByPk(id);
        if (!simulation) {
            return res.status(404).json({ error: 'Simulation not found' });
        }

        const nanobot = await Nanobot.findByPk(nanobotId);
        if (!nanobot) {
            return res.status(404).json({ error: 'Nanobot not found' });
        }
        console.log('results', simulation.results)
        const parsedResults = JSON.parse(simulation.results)
        console.log('parsed results', parsedResults);
        console.log('parsed results', parsedResults, typeof parsedResults);
        if (!parsedResults || !Array.isArray(parsedResults)) {
            return res.status(400).json({ error: 'Invalid cell data provided' });
        }

        const cellResults = parsedResults.map((cell) => {
            const cellResult = interactWithCell(cell, nanobot.name);
            return {...cell, cellResult };
        });


        simulation.simulationName = simulationName || simulation.simulationName;
        simulation.status = status || simulation.status;
        simulation.startTime = startTime || simulation.startTime;
        simulation.nanobotId = nanobotId || simulation.nanobotId;
        simulation.results = JSON.stringify(cellResults) || JSON.stringify(simulation.results);
        console.log('updated sim', simulation);
        await simulation.save();
        res.json(simulation);
    } catch (err) {
        console.log('err', err.message)
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