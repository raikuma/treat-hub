const { v4: uuidv4 } = require('uuid');

class RandomGeneratorDevice {
    constructor(device) {
        this.id = device.id || uuidv4();
        this.name = 'Random Generator';
        this.type = 'random-generator';
    }

    config() {
        return {
            id: this.id,
            name: this.name,
            type: this.type,
        };
    }

    status() {
        return {
            id: this.id,
            name: this.name,
            type: this.type,
            random: Math.random(),
        };
    }
}

class CounterDevice {
    constructor(device) {
        this.id = device.id || uuidv4();
        this.name = 'Counter';
        this.type = 'counter';
        this.count = device.count || 0;
    }

    config() {
        return {
            id: this.id,
            name: this.name,
            type: this.type,
            count: this.count,
        };
    }

    status() {
        return {
            id: this.id,
            name: this.name,
            type: this.type,
            count: this.count,
        };
    }

    update() {
        this.count += 1;
    }
}

module.exports = {
    RandomGeneratorDevice,
    CounterDevice,
};