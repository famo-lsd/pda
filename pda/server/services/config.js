const path = require('path'),
    Service = require('node-windows').Service;

var svc = new Service({
    name: 'Node.js',
    description: 'The Node.js server for new FAMO applications.',
    script: path.resolve('dist/app.js'),
    env: [{
        name: 'NODE_ENV',
        value: 'production'
    }]
});

module.exports = svc;