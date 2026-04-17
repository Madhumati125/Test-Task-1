const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.json());
app.use(express.static('public'));

// LOAD DATA
let zones = JSON.parse(fs.readFileSync('./data/zones.json'));
let alerts = JSON.parse(fs.readFileSync('./data/alerts.json'));

// GET ZONES
app.get('/api/zones', (req, res) => {
    res.json(zones);
});

// GET ALERTS
app.get('/api/alerts', (req, res) => {
    res.json(alerts);
});

// ACTION API (MAIN LOGIC)
app.post('/api/action', (req, res) => {
    const { zone, action } = req.body;

    let beforeData = {};
    let afterData = {};

    zones = zones.map(z => {
        if (z.name === zone) {

            beforeData = { ...z };

            if (action === "Waste") {
                z.waste = Math.max(0, z.waste - 20);
            }

            if (action === "Water") {
                z.water = Math.min(100, z.water + 20);
            }

            if (action === "Emergency") {
                z.status = "Yellow";
                z.water += 10;
                z.waste -= 10;
            }

            // STATUS LOGIC
            if (z.water < 30 || z.waste > 80) {
                z.status = "Red";
            } else if (z.water < 60 || z.waste > 50) {
                z.status = "Yellow";
            } else {
                z.status = "Green";
            }

            afterData = { ...z };
        }
        return z;
    });

    // ADD ALERT
    alerts.push({
        zone: zone,
        message: action + " action executed",
        severity: "HIGH",
        time: new Date()
    });

    res.json({ before: beforeData, after: afterData });
});

app.listen(3000, () => {
    console.log("🚀 Server running at http://localhost:3000");
});