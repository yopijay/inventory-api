// Imports
const express = require('express');
const cors = require('cors');
const routes = require('./src/routes/route');

// Variables
const app = express();
const port =process.env.PORT || 3001;

// Middleware
app.use(cors({ origin: ' https://kcic-inventory-api.herokuapp.com' }));
app.use(express.json());

// Routes
app.use('/api', routes);

app.listen(port, () => {
    console.log(`App running on port ${port}.`);
});