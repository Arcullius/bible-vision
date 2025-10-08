const {defineConfig} = require('@playwright/test');
module.exports = defineConfig({
  testDir: './tests',
    // Match any .js file in the tests directory so existing tests are discovered
    testMatch: ['**/*.js'],
  outputDir: 'test-results/artifacts/',
  use: {
    baseURL: 'http://localhost:4004',
    headless: true,
    
  },
    webServer: {
    command: 'node server.js',
    url: 'http://localhost:4004',
    reuseExistingServer: true,
    timeout: 20000
  },
  reporter: [['list']],
});