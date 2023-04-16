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

class PostItDevice {
    constructor(device) {
        this.id = device.id || uuidv4();
        this.name = 'Post It';
        this.type = 'post-it';
        this.text = device.text || '';
    }

    config() {
        return {
            id: this.id,
            name: this.name,
            type: this.type,
            text: this.text,
        };
    }

    status() {
        return {
            id: this.id,
            name: this.name,
            type: this.type,
            text: this.text,
        };
    }

    update(status) {
        this.text = status.text;
    }
}

module.exports = {
    RandomGeneratorDevice,
    CounterDevice,
    PostItDevice,
};