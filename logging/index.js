const logging = require('logall');
logging.registerLogger({
    level: 'INFO',
    type: 'logstash',
    eventType: 'cartographer',
    codec: 'oldlogstashjson',
    output: {
        transport: 'udp',
        host: '10.44.35.21',
        port: 9999
    }
});

module.exports = logging;