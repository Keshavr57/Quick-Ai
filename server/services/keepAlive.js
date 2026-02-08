import axios from 'axios';

const RENDER_URL = process.env.RENDER_URL || 'https://quick-ai-0baj.onrender.com';
const PING_INTERVAL = 14 * 60 * 1000; // 14 minutes

class KeepAliveService {
  constructor() {
    this.intervalId = null;
    this.isProduction = process.env.NODE_ENV === 'production';
    
    // Auto-start in production
    if (this.isProduction) {
      this.start();
    }
  }

  start() {
    if (!this.isProduction) {
      return;
    }

    console.log('🔄 Keep-alive service started');
    
    // Ping immediately
    this.ping();
    
    // Then ping every 14 minutes
    this.intervalId = setInterval(() => {
      this.ping();
    }, PING_INTERVAL);
  }

  async ping() {
    try {
      await axios.get(`${RENDER_URL}/api/health`, { timeout: 10000 });
      console.log('✅ Keep-alive ping successful');
    } catch (error) {
      console.log('❌ Keep-alive ping failed');
    }
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

// Auto-initialize
const keepAlive = new KeepAliveService();

export default keepAlive;
