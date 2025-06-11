import { defineConfig } from 'cypress';

export default defineConfig({
  projectId: 'k5hj4g',
  e2e: {
    baseUrl: process.env.FRONTEND_URL || 'https://hris.lithiaproject.com',
    setupNodeEvents(on, config) {
      // VSCode sekarang mengenali tipe 'on' dan 'config'
    },
  },
});
