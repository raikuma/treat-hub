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

    update(status) {
        if (status.count !== undefined) {
            this.count = status.count;
            return;
        }
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

class ImageViewerDevice {
    constructor(device) {
        this.id = device.id || uuidv4();
        this.name = 'Image Viewer';
        this.type = 'image-viewer';
        this.image = device.image || '';
    }

    config() {
        return {
            id: this.id,
            name: this.name,
            type: this.type,
            image: this.image,
        };
    }

    status() {
        return {
            id: this.id,
            name: this.name,
            type: this.type,
            image: this.image,
        };
    }
    
    update(status) {
        this.image = status.image;
    }
}

class ValueMonitorDevice {
    constructor(device) {
        this.id = device.id || uuidv4();
        this.name = 'Value Monitor';
        this.type = 'value-monitor';
        this.source = device.source || '';
    }

    config() {
        return {
            id: this.id,
            name: this.name,
            type: this.type,
            source: this.source,
        };
    }

    status(devices) {
        const tokens = this.source.split('.');
        let value;
        try {
            const deviceId = tokens[0];
            const device = devices.find(d => d.id === deviceId);
            for (let i = 1; i < tokens.length; i++) {
                value = device[tokens[i]];
            }
        } catch (e) {
            value = undefined;
        }
        return {
            id: this.id,
            name: this.name,
            type: this.type,
            source: this.source,
            value: value,
        };
    }

    update(status) {
        this.source = status.source;
    }
}

module.exports = {
    deviceClasses: {
        'random-generator': RandomGeneratorDevice,
        'counter': CounterDevice,
        'post-it': PostItDevice,
        'image-viewer': ImageViewerDevice,
        'value-monitor': ValueMonitorDevice,
    }
};