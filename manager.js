const fs = require('fs');

const { deviceClasses } = require('./devices');

class Manager {
    constructor(savePath) {
        this.devices = [];
        this.savePath = savePath;
        this.loadDevices();
    }

    saveDevices() {
        console.log('[Manager] Saving devices');
        const data = this.devices.map((device) => device.config());
        fs.writeFileSync(this.savePath, JSON.stringify(data));
    }

    loadDevices() {
        console.log('[Manager] Loading devices');
        try {
            const data = fs.readFileSync(this.savePath);
            const loadedDevices = JSON.parse(data);
            loadedDevices.forEach((device) => {
                const DeviceClass = deviceClasses[device.type];
                if (DeviceClass) {
                    this.devices.push(new DeviceClass(device));
                }
            });
        } catch (e) {
            console.log('[Manager] No devices file found, creating new one');
            this.saveDevices();
        }
    }

    addDevice(type, config) {
        console.log('[Manager] Adding device', type, config);
        const DeviceClass = deviceClasses[type];
        if (DeviceClass) {
            this.devices.push(new DeviceClass(config));
        } else {
            throw new Error('Invalid type');
        }
        this.saveDevices();
    }

    listDevices() {
        return this.devices.map((device) => {
            return {
                id: device.id,
                type: device.type,
                status: device.status(),
            };
        });
    }

    removeDevice(id) {
        const index = this.devices.findIndex((device) => device.id === id);
        if (index !== -1) {
            this.devices.splice(index, 1);
        } else {
            throw new Error('Device not found');
        }
        this.saveDevices();
    }

    getDeviceStatus(id) {
        const device = this.devices.find((device) => device.id === id);
        if (device) {
            return device.status(this.devices);
        }
        return null;
    }

    updateDevice(id, status) {
        const device = this.devices.find((device) => device.id === id);
        if (device) {
            device.update(status);
            this.saveDevices();
        } else {
            throw new Error('Device not found');
        }
    }
}

module.exports = {
    Manager,
};