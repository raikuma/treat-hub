var parsers = {
    'counter': parseCounter,
    'random-generator': parseRandomGenerator,
    'post-it': parsePostIt,
    'image-viewer': parseImageViewer,
    'value-monitor': parseValueMonitor,
    'cron-curl': parseCronCurl,
};

function parseCounter(status) {
    html = `<h3>count: ${status.count}</h3>`;
    html += `<button onclick="incrementCounter('${status.id}')">Increment</button>`;
    html += `<button onclick="initCounter('${status.id}')">Init</button>`
    return html;
}

function incrementCounter(deviceId) {
    apiUpdateDeviceStatus({
        id: deviceId,
    }, () => {
        refreshDevice(deviceId);
    });
}

function initCounter(deviceId) {
    apiUpdateDeviceStatus({
        id: deviceId,
        count: 0,
    }, () => {
        refreshDevice(deviceId);
    });
}

function parseRandomGenerator(status) {
    html = `<h3>random: ${status.random}</h3>`;
    html += `<button onclick="getRandomNumber('${status.id}')">Generate</button>`;
    return html
}

function getRandomNumber(deviceId) {
    refreshDevice(deviceId);
}

function parsePostIt(status) {
    html = `<h3>message: ${status.text}</h3>`;
    html += `<input id="input-${status.id}" value="${status.text}">`;
    html += `<button onclick="updatePostIt('${status.id}')">Update</button>`;
    return html;
}

function updatePostIt(deviceId) {
    const message = document.querySelector('#input-' + deviceId).value;
    apiUpdateDeviceStatus({
        id: deviceId,
        text: message,
    }, () => {
        refreshDevice(deviceId);
    });
}

function parseImageViewer(status) {
    html = `<img src="${status.image}" height="200px">`;
    html += `<input id="input-${status.id}" value="${status.image}">`;
    html += `<button onclick="updateImageViewer('${status.id}')">Update</button>`;
    return html;
}

function updateImageViewer(deviceId) {
    const image = document.querySelector('#input-' + deviceId).value;
    apiUpdateDeviceStatus({
        id: deviceId,
        image: image,
    }, () => {
        refreshDevice(deviceId);
    });
}

function parseValueMonitor(status) {
    html = `<h3>source: ${status.source}</h3>`;
    html += `<h3>value: ${status.value}</h3>`
    html += `<input id="input-${status.id}" value="${status.source}">`;
    html += `<button onclick="refreshDevice('${status.id}')">Refresh</button>`
    html += `<button onclick="updateValueMonitor('${status.id}')">Update</button>`;
    return html;
}

function updateValueMonitor(deviceId) {
    const source = document.querySelector('#input-' + deviceId).value;
    apiUpdateDeviceStatus({
        id: deviceId,
        source: source,
    }, () => {
        refreshDevice(deviceId);
    });
}


function parseCronCurl(status) {
    html = `<h3>url: ${status.url}</h3>`;
    html += `<h3>method: ${status.method}</h3>`
    html += `<h3>interval: ${status.interval}</h3>`
    html += `<h3>result: ${status.result}</h3>`
    html += `<input id="url-${status.id}" value="${status.url}">`;
    html += `<input id="method-${status.id}" value="${status.method}">`;
    html += `<input id="interval-${status.id}" value="${status.interval}">`;
    html += `<button onclick="updateCronCurl('${status.id}')">Update</button>`;
    return html;
}

function updateCronCurl(deviceId) {
    const url = document.querySelector('#url-' + deviceId).value;
    const method = document.querySelector('#method-' + deviceId).value;
    const interval = document.querySelector('#interval-' + deviceId).value;
    apiUpdateDeviceStatus({
        id: deviceId,
        url: url,
        method: method,
        interval: interval,
    }, () => {
        refreshDevice(deviceId);
    });
}