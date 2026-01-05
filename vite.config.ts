import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Ensure public directory is copied to dist
  publicDir: 'public',
  build: {
    // Optimize chunks for better loading
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // React core
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'react-core';
          }
          // React Router
          if (id.includes('node_modules/react-router')) {
            return 'react-router';
          }
          // Motion/Framer
          if (id.includes('node_modules/motion') || id.includes('node_modules/framer')) {
            return 'motion';
          }
          // Lucide icons
          if (id.includes('node_modules/lucide-react')) {
            return 'lucide';
          }
          // Stripe
          if (id.includes('@stripe')) {
            return 'stripe';
          }
          // Supabase
          if (id.includes('@supabase')) {
            return 'supabase';
          }
          // Charts
          if (id.includes('recharts')) {
            return 'recharts';
          }
          // Export libraries
          if (id.includes('jspdf') || id.includes('xlsx')) {
            return 'export-libs';
          }
          // Radix UI
          if (id.includes('@radix-ui')) {
            return 'radix';
          }
          // Other node_modules
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
    // Increase chunk size warning limit for production
    chunkSizeWarningLimit: 600,
    // Enable minification with esbuild (faster than terser, built into Vite)
    minify: 'esbuild',
    // Target modern browsers for better optimization
    target: 'es2020',
    // Drop console.log in production
    ...(mode === 'production' && {
      esbuild: {
        drop: ['console', 'debugger'],
      },
    }),
  },
  // Performance optimizations
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@supabase/supabase-js',
      'lucide-react',
      'sonner',
    ],
    exclude: [
      // Exclude heavy libraries from pre-bundling
      'motion',
      'recharts',
      'jspdf',
      'xlsx',
    ],
  },
}))