import { defineConfig } from 'cypress';

export default defineConfig({
  projectId: 'm4jy5i',
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      // VSCode sekarang mengenali tipe 'on' dan 'config'
    },
  },
});
