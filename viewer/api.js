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

function apiFetchValue(source, callback) {
    const deviceId = source.split('.')[0];
    axios.get('http://localhost:3000/api/status/' + deviceId)
        .then(function(response) {
            let data = response.data;
            const keys = source.split('.');
            for (let i = 1; i < keys.length; i++) {
                try {
                    data = data[keys[i]];
                } catch (e) {
                    console.log(e);
                    return;
                }
            }
            callback(data);
        })
        .catch(function(error) {
            console.log(error);
        });
}