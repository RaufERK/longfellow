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
        'export NODE_ENV=production',
        'source ~/.nvm/nvm.sh && nvm use --lts',
        // только один симлинк
        'ln -sf /home/appuser/apps/longfellow/shared/.env /home/appuser/apps/longfellow/source/.env',
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
