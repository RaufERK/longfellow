const NODE_VERSION = '24.14.1'
const NODE_BIN = `/home/appuser/.nvm/versions/node/v${NODE_VERSION}/bin/node`
const PM2_BIN = `/home/appuser/.nvm/versions/node/v${NODE_VERSION}/bin/pm2`

module.exports = {
  apps: [
    {
      name: 'longfellow',
      script: 'node_modules/next/dist/bin/next',
      interpreter: NODE_BIN,
      args: 'start -H 127.0.0.1 -p 3010',
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
      host: 'app',
      ref: 'origin/main',
      repo: 'https://github.com/RaufERK/longfellow.git',
      path: '/home/appuser/apps/longfellow',
      'pre-deploy-local': '',
      'post-deploy': [
        'export NODE_ENV=production',
        `source ~/.nvm/nvm.sh && nvm use ${NODE_VERSION}`,
        // симлинки для shared-директорий
        'ln -sf /home/appuser/apps/longfellow/shared/.env /home/appuser/apps/longfellow/source/.env',
        'mkdir -p /home/appuser/apps/longfellow/shared/uploads',
        'rm -rf /home/appuser/apps/longfellow/source/public/images/products/uploads',
        'ln -sf /home/appuser/apps/longfellow/shared/uploads /home/appuser/apps/longfellow/source/public/images/products/uploads',
        'npm ci --include=dev',
        'npx prisma generate',
        'npx prisma migrate deploy',
        'rm -rf .next', // очистка кэша перед билдом
        'npm run build',
        `${PM2_BIN} startOrReload ecosystem.config.cjs --env production`,
        `${PM2_BIN} save`,
      ].join(' && '),
      env: { NODE_ENV: 'production' },
    },
  },
}
