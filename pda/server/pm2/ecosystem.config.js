module.exports = {
  apps: [{
    name: 'Server - Node.js',
    cwd: 'L:/Git/PDA/pda/server/dist/',
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
