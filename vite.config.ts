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
        manualChunks: {
          // Split vendor code for better caching
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['lucide-react', 'sonner', 'motion'],
          'stripe-vendor': ['@stripe/stripe-js', '@stripe/react-stripe-js'],
          'supabase-vendor': ['@supabase/supabase-js'],
          'chart-vendor': ['recharts'],
          'export-vendor': ['jspdf', 'jspdf-autotable', 'xlsx'],
        },
      },
    },
    // Increase chunk size warning limit for production
    chunkSizeWarningLimit: 1000,
    // Enable minification with esbuild (faster than terser, built into Vite)
    minify: 'esbuild',
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
  },
}))