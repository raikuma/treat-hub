function apiRequest({url, method, data}, callback) {
    axios({
        url: url,
        method: method,
        data: data,
    })
        .then(function(response) {
            callback(response.data);
        })
        .catch(function(error) {
            console.log(error);
        });
}

function apiFetchDeviceList(callback) {
    apiRequest({
        url: '/api/list',
        method: 'get',
    }, callback);
}

function apiFetchDeviceStatus(deviceId, callback) {
    apiRequest({
        url: '/api/status/' + deviceId,
        method: 'get',
    }, callback);
}

function apiUpdateDeviceStatus(status, callback) {
    apiRequest({
        url: '/api/update',
        method: 'post',
        data: status,
    }, callback);
}

function apiAddDevice(deviceType, callback) {
    apiRequest({
        url: '/api/add',
        method: 'post',
        data: {
            type: deviceType,
        },
    }, callback);
}

function apiRemoveDevice(deviceId, callback) {
    apiRequest({
        url: '/api/remove',
        method: 'post',
        data: {
            id: deviceId,
        },
    }, callback);
}
