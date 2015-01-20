var AMQPClient  = require('./amqp_client'),
    exceptions  = require('./lib/exceptions');

function sendCB(err, msg) {
    if (err) {
        console.log('ERROR: ');
        console.log(err);
    } else {
        console.log('Sent: ' + msg);
    }
}

function recvCB(err, payload, annotations) {
    if (err) {
        console.log('ERROR: ');
        console.log(err);
    } else {
        console.log('Recv: ');
        console.log(payload);
        if (annotations) {
            console.log('Annotations:');
            console.log(annotations);
        }
        console.log('');
    }
}

function sendRecv(settings, client, err) {
    var sendAddr = settings.hostname || 'localhost';
    var recvAddr = sendAddr;

    if (err) {
        console.log('ERROR: ');
        console.log(err);
    } else {
        //client.send(JSON.stringify({ "DataString": "From Node", "DataValue": 123 }), sendAddr, sendCB);
        client.receive(recvAddr, recvCB);
    }
}

var settingsFile = process.argv[2];
var settings = {};
if (settingsFile) settings = require('./' + settingsFile);
var protocol = settings.protocol || 'amqp';
var host = settings.hostname || 'localhost';
var user = settings.username;
var pass = settings.password;
var uri;
if (user) {
    uri = protocol + '://' + encodeURIComponent(user) + ':' + encodeURIComponent(pass) + '@' + host;
} else {
    uri = protocol + '://' + host;
}
var client = new AMQPClient();
client.connect(uri, sendRecv.bind(null, settings));

