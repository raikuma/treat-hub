const { v4: uuidv4 } = require('uuid');

class Device {
    constructor(config) {
        if (this.constructor === Device) {
            throw new Error('Abstract class "Device" cannot be instantiated directly.');
        }
        config = config || {};
        this.id = config.id || uuidv4();
        this.name = config.name || this.constructor.defaultName || 'Device';
        if (this.constructor.type === undefined) {
            throw new Error('Device type is not defined.');
        }
        this.type = this.constructor.type;
    }

    // Device congifuration which needs when restoring device
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

    // Can update config or status
    update() { }

    // Called when device is removed
    remove() { }
}

class RandomGeneratorDevice extends Device {
    static type = 'random-generator';
    static defaultName = 'Random Generator';

    status() {
        return {
            ...super.status(),
            random: Math.random(),
        };
    }
}

class CounterDevice extends Device {
    static type = 'counter';
    static defaultName = 'Counter';

    constructor(config) {
        super(config);
        this.count = config.count || 0;
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
    static type = 'post-it';
    static defaultName = 'Post It';

    constructor(config) {
        super(config);
        this.text = config.text || '';
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
    static type = 'image-viewer';
    static defaultName = 'Image Viewer';

    constructor(config) {
        super(config);
        this.image = config.image || '';
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
    static type = 'value-monitor';
    static defaultName = 'Value Monitor';

    constructor(config) {
        super(config)
        this.source = config.source || '';
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
    static type = 'cron-curl';
    static defaultName = 'Cron Curl';

    constructor(config) {
        super(config);
        this.interval = config.interval || 10;
        this.url = config.url || '';
        this.method = config.method || 'GET';
        this.result = '';

        this.timer = null;
        this.start();
    }

    config() {
        return {
            ...super.config(),
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
        this.timer = setInterval(async () => {
            try {
                const response = await fetch(this.url, {
                    method: this.method,
                });
                const text = await response.text();
                this.result = text;
            } catch (e) {
                this.result = e.message;
            }
        }, this.interval * 1000);
    }

    stop() {
        console.log('stop')
        clearInterval(this.timer);
    }

    remove() {
        this.stop();
    }
}

const deviceClasses = {};
deviceClasses[RandomGeneratorDevice.type] = RandomGeneratorDevice;
deviceClasses[CounterDevice.type] = CounterDevice;
deviceClasses[PostItDevice.type] = PostItDevice;
deviceClasses[ImageViewerDevice.type] = ImageViewerDevice;
deviceClasses[ValueMonitorDevice.type] = ValueMonitorDevice;
deviceClasses[CronCurlDevice.type] = CronCurlDevice;

module.exports = {
    deviceClasses,
};
