var deviceList = []

window.onload = function() {
    refreshDeviceList();
};

function refreshDeviceList() {
    axios.get('http://localhost:3000/api/list')
        .then(function(response) {
            const listElement = document.querySelector('#deviceListInfo');
            console.log(response.data);
            listElement.innerHTML = JSON.stringify(response.data, null, "");

            response.data.forEach((device) => {
                getDeviceStatus(device.id, (status) => {
                    console.log(status);
                    parseDeviceStatus(status);
                });
            });
        })
        .catch(function(error) {
            console.log(error);
        });
}

function getDeviceStatus(deviceId, callback) {
    axios.get('http://localhost:3000/api/status/' + deviceId)
        .then(function(response) {
            callback(response.data);
        })
        .catch(function(error) {
            console.log(error);
        });
}

function parseDeviceStatus(status) {
    let html = '<div class="device" id="' + status.id + '">';
    html += '<h2>' + status.name + '</h2>';
    if (status.type === 'counter') {
        html += '<h3>count: ' + status.count + '</h3>';
        html += '<button onclick="incrementCounter(\'' + status.id + '\')">Increment</button>';
    } else if (status.type === 'random-generator') {
        html += '<h3>random: ' + status.random + '</h3>';
        html += '<button onclick="getRandomNumber(\'' + status.id + '\')">Generate</button>';
    }
    html += '</div>';

    const device = deviceList.find((device) => {
        return device.id === status.id;
    });

    if (device) {
        deviceList[deviceList.indexOf(device)] = status;
        document.querySelector('#' + status.id).innerHTML = html;
    } else {
        deviceList.push(status);
        document.querySelector('#deviceList').innerHTML += html;
    }
}

function incrementCounter(deviceId) {
    axios.post('http://localhost:3000/api/update', {
        id: deviceId,
    })
        .then(function(response) {
            console.log(response);
            getDeviceStatus(deviceId, (status) => {
                console.log(status);
                parseDeviceStatus(status);
            });
        })
        .catch(function(error) {
            console.log(error);
        });
}

function getRandomNumber(deviceId) {
    getDeviceStatus(deviceId, (status) => {
        console.log(status);
        parseDeviceStatus(status);
    });
}