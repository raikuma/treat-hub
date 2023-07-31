const path = require('path');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

const { Manager } = require('./manager');

PORT = process.env.PORT || 3000;

const manager = new Manager('devices.json');

app.use(express.json());
app.use('/viewer', express.static(path.join(__dirname, 'viewer')));

app.get('/', (req, res) => {
    res.redirect('/viewer');
});

app.get('/api/ping', (req, res) => {
    res.send('pong');
});

app.post('/api/add', (req, res) => {
    try {
        manager.addDevice(req.body.type, req.body);
        res.send('ok');
    } catch (e) {
        res.status(400).send(e.message);
    }
});

app.get('/api/list', (req, res) => {
    res.send(manager.listDevices());
});

app.post('/api/remove', (req, res) => {
    try {
        manager.removeDevice(req.body.id);
        res.send('ok');
    } catch (e) {
        res.status(400).send(e.message);
    }
});

app.get('/api/status/:id', (req, res) => {
    const { id } = req.params;
    const status = manager.getDeviceStatus(id);
    if (status) {
        res.send(status);
    } else {
        res.status(404).send('Device not found');
    }
});

app.post('/api/update', (req, res) => {
    try {
        manager.updateDevice(req.body.id, req.body);
        res.send('ok');
    } catch (e) {
        res.status(400).send(e.message);
    }
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(PORT, () => {
    console.log('App listening on port ' + PORT);
});