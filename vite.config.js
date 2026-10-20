import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import ttsHandler from './api/tts.js'
import lessonStepsSplit from './build/lessonStepsSplit.js'

// লোকাল dev/preview সার্ভারে /api/tts — Vercel-এর একই api/tts.js ব্যবহার করে,
// যেন ল্যাপটপেও একই পুরুষ কণ্ঠ, শিশু কণ্ঠ ও ওয়াকফ-ছাড়া উচ্চারণ পাওয়া যায়
function localTtsPlugin() {
  const ttsMiddleware = async (req, res) => {
    const urlObj = new URL(req.url, 'http://localhost');
    const query = Object.fromEntries(urlObj.searchParams.entries());
    // Vercel-এর res (status/send/json) এর মতো ছোট আবরণ
    const vercelRes = {
      setHeader: (key, value) => res.setHeader(key, value),
      status(code) {
        res.statusCode = code;
        return vercelRes;
      },
      send(body) {
        res.end(body);
        return vercelRes;
      },
      json(obj) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(obj));
        return vercelRes;
      }
    };
    try {
      await ttsHandler({ query }, vercelRes);
    } catch (e) {
      console.error('Local TTS error:', e);
      res.statusCode = 500;
      res.end('Server error');
    }
  };

  return {
    name: 'local-tts-plugin',
    configureServer(server) {
      server.middlewares.use('/api/tts', ttsMiddleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api/tts', ttsMiddleware);
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [lessonStepsSplit(), react(), tailwindcss(), localTtsPlugin()],
  build: {
    chunkSizeWarningLimit: 3000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) return 'vendor-react';
            if (id.includes('lucide-react')) return 'vendor-icons';
            if (id.includes('canvas-confetti')) return 'vendor-confetti';
            return 'vendor';
          }
          if (id.includes('virtual:lessons-stripped')) return 'data-lessons';
          if (id.includes('vocabulary.json')) return 'data-vocabulary';
          if (id.includes('tamrinBook.json')) return 'data-tamrin';
        }
      }
    }
  }
})
