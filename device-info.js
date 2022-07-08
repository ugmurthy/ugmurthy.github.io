
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

    let ConFigService = "98ec1400-00e3-b74f-b2a8-d4e4a0c22036"
    let ConFigODR = "98ec1401-00e3-b74f-b2a8-d4e4a0c22036"
    let ConFigSampleDurationSecs = "98ec1402-00e3-b74f-b2a8-d4e4a0c22036"
    let ConFigGapDurationMinutes = "98ec1403-00e3-b74f-b2a8-d4e4a0c22036"
    let ConFigSampling = "98ec1407-00e3-b74f-b2a8-d4e4a0c22036"

    let options = {};

    //options.services = [UARTService];

    if (document.querySelector('#allDevices').checked) {
        options.acceptAllDevices = true;
        options.optionalServices = [UARTService, ConFigService, 0x180a, 0x1800, 0x1801, 0x180f, 0xfe59];
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
    console.log("Event :", event);


}
