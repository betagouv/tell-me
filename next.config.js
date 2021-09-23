const withTranspileModules = require('next-transpile-modules')(['@mui/material', '@mui/system'])

module.exports = withTranspileModules({
  headers: async () => [
    {
      headers: [
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
      ],
      source: '/:any*',
    },
  ],
  reactStrictMode: true,
  rewrites: async () => [
    {
      destination: '/api/survey',
      source: '/api/survey/:id*',
    },
    {
      destination: '/api/user',
      source: '/api/user/:id*',
    },
    {
      destination: '/api/404',
      source: '/api/:any*',
    },
    {
      destination: '/public/survey',
      source: '/public/survey/:slug*',
    },
    {
      destination: '/',
      source: '/:any*',
    },
  ],
  webpack: config => {
    // eslint-disable-next-line no-param-reassign
    config.resolve.alias = {
      ...config.resolve.alias,
      '@mui/styled-engine': '@mui/styled-engine-sc',
    }

    return config
  },
})
