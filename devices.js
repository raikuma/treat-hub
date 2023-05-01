const { v4: uuidv4 } = require('uuid');

class Device {
    constructor(device) {
        this.id = device.id || uuidv4();
        this.name = 'Device';
        this.type = 'device';
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
        };
    }

    update() {
    }

    remove() {
    }
}

class RandomGeneratorDevice extends Device {
    constructor(device) {
        super(device);
        this.name = 'Random Generator';
        this.type = 'random-generator';
    }

    status() {
        return {
            ...super.status(),
            random: Math.random(),
        };
    }
}

class CounterDevice extends Device {
    constructor(device) {
        super(device);
        this.name = 'Counter';
        this.type = 'counter';
        this.count = device.count || 0;
    }

    config() {
        return {
            ...super.config(),
            count: this.count,
        };
    }

    status() {
        return {
            ...super.status(),
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

class PostItDevice extends Device {
    constructor(device) {
        super(device);
        this.name = 'Post It';
        this.type = 'post-it';
        this.text = device.text || '';
    }

    config() {
        return {
            ...super.config(),
            text: this.text,
        };
    }

    status() {
        return {
            ...super.status(),
            text: this.text,
        };
    }

    update(status) {
        this.text = status.text;
    }
}

class ImageViewerDevice extends Device {
    constructor(device) {
        super(device);
        this.name = 'Image Viewer';
        this.type = 'image-viewer';
        this.image = device.image || '';
    }

    config() {
        return {
            ...super.config(),
            image: this.image,
        };
    }

    status() {
        return {
            ...super.status(),
            image: this.image,
        };
    }
    
    update(status) {
        this.image = status.image;
    }
}

class ValueMonitorDevice extends Device {
    constructor(device) {
        super(device)
        this.name = 'Value Monitor';
        this.type = 'value-monitor';
        this.source = device.source || '';
    }

    config() {
        return {
            ...super.config(),
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
            ...super.status(),
            source: this.source,
            value: value,
        };
    }

    update(status) {
        this.source = status.source;
    }
}

class CronCurlDevice extends Device {
    constructor(device) {
        super(device);
        this.name = 'Cron Curl';
        this.type = 'cron-curl';
        this.interval = device.interval || 10;
        this.url = device.url || '';
        this.method = device.method || 'GET';
        this.result = '';

        this.timer = null;
        this.start();
    }

    config() {
        return {
            interval: this.interval,
            url: this.url,
            method: this.method,
        };
    }

    status() {
        return {
            ...super.status(),
            interval: this.interval,
            url: this.url,
            method: this.method,
            result: this.result,
        };
    }

    update(status) {
        this.interval = status.interval;
        this.url = status.url;
        this.method = status.method;

        this.stop();
        this.start();
    }

    start() {
        console.log('start')
        this.timer = setInterval(() => {
            this.fetch();
        }, this.interval * 1000);
    }

    stop() {
        console.log('stop')
        clearInterval(this.timer);
    }

    async fetch() {
        try {
            const response = await fetch(this.url, {
                method: this.method,
            });
            const text = await response.text();
            this.result = text;
        } catch (e) {
            this.result = e.message;
        }
    }

    remove() {
        this.stop();
    }
}

module.exports = {
    deviceClasses: {
        'random-generator': RandomGeneratorDevice,
        'counter': CounterDevice,
        'post-it': PostItDevice,
        'image-viewer': ImageViewerDevice,
        'value-monitor': ValueMonitorDevice,
        'cron-curl': CronCurlDevice,
    }
};