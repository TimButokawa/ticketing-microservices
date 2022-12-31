module.exports = {
  webpack: (config) => {
    config.watchOptions.poll = 300;
    return config;
  },
  publicRuntimeConfig: {
    BASE_URL: process.env.BASE_URL
  }
};
