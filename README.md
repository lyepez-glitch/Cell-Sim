🧠 Nanobot Simulation API

This is the backend for the Nanobot Simulation App, a full-stack project where users can:

✅ Sign up and log in

🤖 Create nanobots

🧬 Run simulations where nanobots interact with cells

🔍 Look up users, simulations, and nanobots by ID

Built with Node.js, Express, MySQL, and Sequelize, and deployed using Render.

🌐 Live API Endpoint
Base URL: https://nanobot-backend.onrender.com

📦 Tech Stack
Backend: Node.js, Express

Database: MySQL

ORM: Sequelize

Auth: JWT + Bcrypt

Hosting: Render

🧪 Features
🔐 User authentication (JWT)

👤 CRUD operations for users

🤖 CRUD operations for nanobots

🧬 Simulate nanobot-cell interaction

📊 Store and retrieve simulation results

🔍 Look up users, nanobots, and simulations by ID

⚙️ Getting Started
1. Clone the repo

git clone https://github.com/your-username/nanobot-backend.git
cd nanobot-backend
2. Install dependencies

npm install
3. Set up your .env file
Create a .env file in the root directory and fill in your database and secret info:


DB_HOST=your_host
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=your_db_name
DB_PORT=3306
JWT_SECRET=your_jwt_secret


4. Start the server

npm start
Server will run on http://localhost:3000 by default.

🧱 API Endpoints
✅ Authentication
POST /login
Authenticate user and receive JWT token.

👤 Users
POST /users
Create a new user
Body: { username, email, password }

GET /users/:id
Fetch user by ID

🤖 Nanobots
POST /nanobots
Create a nanobot
Body: { name, userId, status }

GET /nanobots
Get all nanobots

GET /nanobots/:id
Get nanobot by ID

🧬 Simulations
POST /simulations
Create a simulation
Body: { simulationName, status, startTime, userId, nanobotId, results }

GET /simulations/:id
Get a simulation by ID

PUT /simulations/:id
Update a simulation

DELETE /simulations/:id
Delete a simulation

POST /simulate-nanobot
Run simulation logic without storing to DB
Body: { nanobotId, cells }

🧠 Logic
Simulation logic uses a function interactWithCell(cell, nanobotName) to simulate cell healing, damage, or analysis based on nanobot behavior.

🧰 Scripts

npm start            # Run the server
npm run db           # Test database connection
🗃 Database
Uses Sequelize ORM

MySQL DB hosted via FreeSQLDatabase.com or MySQL Workbench

Models:

Profile (users)

Nanobot

Simulation

To recreate the schema:

sequelize.sync({ force: false });
🛠 Future Improvements
Add token verification middleware

Role-based permissions (e.g., admin users)

Expand nanobot logic options

Paginate nanobot and simulation results

📄 License
MIT

