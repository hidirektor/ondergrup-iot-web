const PROXY_HOST = 'http://ondergrup.hidirektor.com.tr:3000';

const PROXY_CONFIG = [
  {
    context: ['/api/v2'],
    target: PROXY_HOST,
    secure: false,
  },
];

module.exports = PROXY_CONFIG;