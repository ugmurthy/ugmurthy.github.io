
function onButtonClick() {
    let filters = [];

    let filterService = document.querySelector('#service').value;
    if (filterService.startsWith('0x')) {
        filterService = parseInt(filterService);
    }
    if (filterService) {
        filters.push({ services: [filterService] });
    }

    let filterName = document.querySelector('#name').value;
    if (filterName) {
        filters.push({ name: filterName });
    }

    let filterNamePrefix = document.querySelector('#namePrefix').value;
    if (filterNamePrefix) {
        filters.push({ namePrefix: filterNamePrefix });
    }

    let UARTService = "6e400001-b5a3-f393-e0a9-e50e24dcca9e"
    let UARTCharRX = "6e400002-b5a3-f393-e0a9-e50e24dcca9e"
    let UARTCharTX = "6e400003-b5a3-f393-e0a9-e50e24dcca9e"
    let options = {};

    //options.services = UARTService;

    if (document.querySelector('#allDevices').checked) {
        options.acceptAllDevices = true;
        options.optionalServices = [UARTService];
    } else {
        options.filters = filters;
    }

    console.log('Requesting Bluetooth Device.........');
    console.log('with ' + JSON.stringify(options));
    navigator.bluetooth.requestDevice(options)
        .then(device => {
            console.log('> Name:             ' + device.name);
            console.log('> Id:               ' + device.id);
            console.log('> Connected:        ' + device.gatt.connected);
            return device;

        }).then(device => {
            // Set up event listener for when device gets disconnected.
            device.addEventListener('gattserverdisconnected', onDisconnected);
            return device.gatt.connect();

        }).then(function (server) {
            console.log("Connected ?  " + server.connected);
            return server.getPrimaryService(UARTService);

        }).then(function (result) {
            console.log("Device information ", result);

        }).catch(error => {
            console.log('Argh! ' + error);
        });
}

function onDisconnected(event) {
    const device = event.target;
    console.log(`Device ${device.name} is disconnected.`);
}
