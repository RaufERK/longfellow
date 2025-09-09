module.exports = {
  apps: [
    {
      name: 'longfellow',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3010',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      env: { NODE_ENV: 'production' },
      env_production: { NODE_ENV: 'production' },
    },
    {
      name: 'longfellow-fetch-legacy',
      script: 'npm',
      args: 'run fetch:legacy',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      autorestart: false,
      env: {
        NODE_ENV: 'production',
        PREFETCH_BASE: 'http://localhost:3010',
      },
      env_production: {
        NODE_ENV: 'production',
        PREFETCH_BASE: 'http://localhost:3010',
      },
    },
  ],

  deploy: {
    production: {
      user: 'appuser',
      host: 'amster_app',
      ref: 'origin/main',
      repo: 'git@github.com:RaufERK/longfellow.git',
      path: '/home/appuser/apps/longfellow',
      'pre-deploy-local': '',
      'post-deploy': [
        'source ~/.nvm/nvm.sh && nvm use --lts',
        'ln -sf /home/appuser/shared/longfellow/.env.production ./.env.production || true',
        'npm ci --include=dev',
        'npx prisma generate',
        'npx prisma migrate deploy',
        'npm run build',
        'pm2 startOrReload ecosystem.config.cjs --env production',
        'pm2 save',
      ].join(' && '),
      env: { NODE_ENV: 'production' },
    },
  },
}
