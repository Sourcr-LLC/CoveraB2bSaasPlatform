import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
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
    // Enable source maps for better debugging
    sourcemap: true,
    // Enable code splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // React core libraries
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          
          // Radix UI components (grouped by functionality)
          'ui-radix': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-select',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toast',
            '@radix-ui/react-alert-dialog',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-label',
            '@radix-ui/react-popover',
            '@radix-ui/react-radio-group',
            '@radix-ui/react-slider',
            '@radix-ui/react-switch',
            '@radix-ui/react-tooltip',
          ],
          
          // Chart libraries
          'charts': ['recharts'],
          
          // Material UI (if used)
          'mui': ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
          
          // PDF generation
          'pdf': ['jspdf', 'jspdf-autotable'],
          
          // Excel generation
          'excel': ['xlsx'],
          
          // Date handling
          'dates': ['date-fns'],
          
          // Icons
          'icons': ['lucide-react'],
          
          // Supabase
          'supabase': ['@supabase/supabase-js'],
          
          // Stripe
          'stripe': ['@stripe/stripe-js', '@stripe/react-stripe-js'],
          
          // Other libraries
          'libs': ['sonner', 'react-slick', 'slick-carousel'],
        },
      },
    },
    // Minification settings
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // Chunk size warnings
    chunkSizeWarningLimit: 500,
  },
})