module.exports = {
  apps: [{
    name: 'Server - Node.js',
    cwd: 'C:/FAMO_NODE/Server/dist/',
    // cwd: 'L:/Git/PDA/pda/server/dist/',
    script: 'app.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }],
};
