const svc = require('./services/config');

svc.on('install', function () {
    svc.start();
});

// install
svc.install();