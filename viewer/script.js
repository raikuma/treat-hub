var deviceList = []

window.onload = function() {
    refreshDeviceList();
    document.querySelector('#addDevice').addEventListener('click', addDevice);
};

function refreshDeviceList() {
    deviceList = [];
    document.querySelector('#deviceList').innerHTML = '';

    apiFetchDeviceList((deviceList) => {
        console.log(deviceList);
        // const listElement = document.querySelector('#deviceListInfo');
        // listElement.innerHTML = JSON.stringify(deviceList, null, "");
        deviceList.forEach((device) => {
            refreshDevice(device.id);
        });
    });
}

function refreshDevice(deviceId) {
    apiFetchDeviceStatus(deviceId, (status) => {
        console.log(status);
        parseDeviceStatus(status);
    });
}

function addDevice() {
    const deviceType = document.querySelector('#newDeviceType').value;
    apiAddDevice(deviceType, () => {
        refreshDeviceList();
    });
}

function removeDevice(deviceId) {
    apiRemoveDevice(deviceId, () => {
        refreshDeviceList();
    });
}

function parseDeviceStatus(status) {
    const domId = 'device-' + status.id;
    let html = `<div class="device" id="${domId}">`;
    html += `<h2>${status.name}</h2>`;
    if (status.type in parsers)
    {
        html += parsers[status.type](status);
    }
    html += `<button onclick="removeDevice('${status.id}')">Remove</button>`;
    html += '</div>';

    const device = deviceList.find((device) => {
        return device.id === status.id;
    });
    if (device) {
        deviceList[deviceList.indexOf(device)] = status;
        document.querySelector('#' + domId).innerHTML = html;
    } else {
        deviceList.push(status);
        document.querySelector('#deviceList').innerHTML += html;
    }
}
