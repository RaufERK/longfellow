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
        'source ~/.nvm/nvm.sh && nvm use --lts',
        // кладём .env.production в корень (source/)
        'ln -sf /home/appuser/apps/longfellow/shared/.env.production ./source/.env.production',
        // работаем из source
        'cd source',
        'npm ci --include=dev',
        'npx prisma generate',
        'npx prisma migrate deploy',
        'npm run build',
        // стартуем
        'pm2 startOrReload ../ecosystem.config.cjs --env production',
        'pm2 save',
      ].join(' && '),
      env: { NODE_ENV: 'production' },
    },
  },
}
