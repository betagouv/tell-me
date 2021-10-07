const withTranspileModules = require('next-transpile-modules')(['@mui/material', '@mui/system'])

module.exports = withTranspileModules({
  eslint: {
    // https://nextjs.org/docs/api-reference/next.config.js/ignoring-eslint
    ignoreDuringBuilds: true,
  },
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
      destination: '/api/survey/upload',
      source: '/api/survey/upload/:id*',
    },
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
