module.exports = {
  apps: [
    {
      name: 'longfellow',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/longfellow/current',
      interpreter: 'none',
      exec_mode: 'cluster',
      instances: 1,
      env: {
        NODE_ENV: 'production',
        PORT: '3011',
      },
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
    },
    {
      name: 'longfellow-fetch-legacy-once',
      script: 'npm',
      args: 'run fetch:legacy',
      cwd: __dirname,
      interpreter: 'none',
      autorestart: false,
      watch: false,
      env: {
        NODE_ENV: 'production',
        PREFETCH_BASE: 'http://localhost:3011',
      },
    },
  ],
  deploy: {
    production: {
      user: 'appuser',
      host: '89.111.172.86',
      ref: 'origin/main',
      repo: 'git@github.com:RaufERK/longfellow.git',
      path: '/var/www/longfellow',
      'post-deploy':
        'export NVM_DIR=$HOME/.nvm && [ -s $NVM_DIR/nvm.sh ] && . $NVM_DIR/nvm.sh && mkdir -p ../shared && ln -sf /var/www/longfellow/shared/.env ./.env && npm ci && npx prisma generate && npx prisma migrate deploy && npm run build && pm2 reload ecosystem.config.cjs --only longfellow',
      ssh_options: 'StrictHostKeyChecking=no',
    },
  },
}
