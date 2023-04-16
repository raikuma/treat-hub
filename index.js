const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

const { deviceClasses } = require('./devices');

const devices = [];

function saveDevices() {
    console.log('Saving devices');
    const data = devices.map((device) => device.config());
    fs.writeFileSync('devices.json', JSON.stringify(data));
}

function loadDevices() {
    console.log('Loading devices');
    try {
        const data = fs.readFileSync('devices.json');
        const loadedDevices = JSON.parse(data);
        loadedDevices.forEach((device) => {
            const DeviceClass = deviceClasses[device.type];
            if (DeviceClass) {
                devices.push(new DeviceClass(device));
            }
        });
    } catch (e) {
        console.log('No devices file found');
        saveDevices();
    }
}

loadDevices();

app.use(express.json());
app.use('/viewer', express.static(path.join(__dirname, 'viewer')));

app.get('/', (req, res) => {
    res.redirect('/viewer');
});

app.get('/api/ping', (req, res) => {
    res.send('pong');
});

app.post('/api/add', (req, res) => {
    const { type } = req.body;
    DeviceClass = deviceClasses[type];
    if (DeviceClass) {
        devices.push(new DeviceClass(req.body));
    } else {
        res.status(400).send('Invalid type');
        return;
    }
    saveDevices();
    console.log('Added device', devices[devices.length - 1])
    res.send('ok');
});

app.get('/api/list', (req, res) => {
    const data = devices.map((device) => {
        return {
            id: device.id,
            name: device.name,
            type: device.type,
        };
    });
    res.send(data);
});

app.post('/api/remove', (req, res) => {
    const { id } = req.body;
    const index = devices.findIndex((device) => device.id === id);
    if (index !== -1) {
        devices.splice(index, 1);
        saveDevices();
        console.log('Removed device', id)
    }
    res.send('ok');
});

app.get('/api/status/:id', (req, res) => {
    const { id } = req.params;
    const device = devices.find((device) => device.id === id);
    if (device) {
        res.send(device.status());
    } else {
        res.status(404).send('Not found');
    }
});

app.post('/api/update', (req, res) => {
    const { id } = req.body;
    const device = devices.find((device) => device.id === id);
    if (device) {
        device.update(req.body);
        saveDevices();
        console.log('Updated device', device)
        res.send('ok');
    } else {
        res.status(404).send('Not found');
    }
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(3000, () => {
    console.log('App listening on port 3000');
});