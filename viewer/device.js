var parsers = {
    'counter': parseCounter,
    'random-generator': parseRandomGenerator,
    'post-it': parsePostIt,
    'image-viewer': parseImageViewer,
    'value-monitor': parseValueMonitor,
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
    html += `<h3>value: <span id="value-${status.id}"></span></h3>`
    html += `<input id="input-${status.id}" value="${status.source}">`;
    html += `<button onclick="refreshMonitor('${status.id}')">Refresh</button>`
    html += `<button onclick="updateValueMonitor('${status.id}')">Update</button>`;
    apiFetchValue(status.source, (value) => {
        document.querySelector('#value-' + status.id).innerHTML = value;
    });
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

function refreshMonitor(deviceId) {
    const source = document.querySelector('#input-' + deviceId).value;
    apiFetchValue(source, (value) => {
        document.querySelector('#value-' + deviceId).innerHTML = value;
    });
}