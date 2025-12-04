// Frontend entry point
import { initializeApp } from './appState.js';
import { setupEventHandlers } from './dom.js';

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  await initializeApp();
  setupEventHandlers();
});
