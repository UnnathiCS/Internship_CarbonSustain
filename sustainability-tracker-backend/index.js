const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// Read data.json
const readData = () => {
    const data = fs.readFileSync('data.json');
    return JSON.parse(data);
};

// Write to data.json
const writeData = (data) => {
    fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
};

// GET /api/actions
app.get('/api/actions', (req, res) => {
    try {
        const actions = readData();
        res.status(200).json(actions);
    } catch (error) {
        res.status(500).json({ message: 'Error reading data.' });
    }
});

// POST /api/actions
app.post('/api/actions', (req, res) => {
    try {
        const newAction = req.body;

        if (!newAction.action || !newAction.date || typeof newAction.points !== 'number') {
            return res.status(400).json({ message: 'Invalid payload.' });
        }

        const actions = readData();
        newAction.id = actions.length ? actions[actions.length - 1].id + 1 : 1;
        actions.push(newAction);
        writeData(actions);

        res.status(201).json({ message: 'Action added successfully.', action: newAction });
    } catch (error) {
        res.status(500).json({ message: 'Error saving data.' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
