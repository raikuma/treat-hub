function apiFetchDeviceList(callback) {
    axios.get('http://localhost:3000/api/list')
        .then(function(response) {
            callback(response.data);
        })
        .catch(function(error) {
            console.log(error);
        }
    );
}

function apiFetchDeviceStatus(deviceId, callback) {
    axios.get('http://localhost:3000/api/status/' + deviceId)
        .then(function(response) {
            callback(response.data);
        })
        .catch(function(error) {
            console.log(error);
        });
}

function apiUpdateDeviceStatus(status, callback) {
    axios.post('http://localhost:3000/api/update', 
        status
    )
        .then(function(response) {
            console.log(response);
            callback();
        })
        .catch(function(error) {
            console.log(error);
        });
}

function apiAddDevice(deviceType, callback) {
    axios.post('http://localhost:3000/api/add', {
        type: deviceType,
    })
        .then(function(response) {
            console.log(response);
            callback();
        })
        .catch(function(error) {
            console.log(error);
        });
}

function apiRemoveDevice(deviceId, callback) {
    axios.post('http://localhost:3000/api/remove', {
        id: deviceId,
    })
        .then(function(response) {
            console.log(response);
            callback();
        })
        .catch(function(error) {
            console.log(error);
        });
}
