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
    sourcemap: false, // Disable in production for smaller files
    // CSS code splitting
    cssCodeSplit: true,
    // Enable code splitting
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Node modules chunking strategy
          if (id.includes('node_modules')) {
            // React core
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor';
            }
            
            // Charts - only load when needed
            if (id.includes('recharts') || id.includes('decimal.js')) {
              return 'charts';
            }
            
            // PDF - already lazy loaded
            if (id.includes('jspdf') || id.includes('pako') || id.includes('fast-png')) {
              return 'pdf';
            }
            
            // Excel
            if (id.includes('xlsx')) {
              return 'excel';
            }
            
            // Radix UI - split by component for better caching
            if (id.includes('@radix-ui')) {
              return 'ui-radix';
            }
            
            // Floating UI (used by Radix)
            if (id.includes('@floating-ui')) {
              return 'ui-radix';
            }
            
            // Motion/Framer Motion
            if (id.includes('motion') || id.includes('framer-motion')) {
              return 'proxy';
            }
            
            // Supabase
            if (id.includes('@supabase')) {
              return 'supabase';
            }
            
            // Stripe
            if (id.includes('@stripe')) {
              return 'stripe';
            }
            
            // Date libraries
            if (id.includes('date-fns')) {
              return 'dates';
            }
            
            // Icons
            if (id.includes('lucide-react')) {
              return 'icons';
            }
            
            // MUI
            if (id.includes('@mui') || id.includes('@emotion')) {
              return 'mui';
            }
            
            // Other large libraries
            if (id.includes('react-slick') || id.includes('slick-carousel')) {
              return 'libs';
            }
            
            if (id.includes('sonner')) {
              return 'libs';
            }
            
            // Tailwind merge
            if (id.includes('tailwind-merge')) {
              return 'utils';
            }
            
            // All other node_modules go into vendor chunk
            return 'vendor';
          }
        },
        // Optimize chunk naming for better caching
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    // Minification settings
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.trace'],
        passes: 2, // Multiple passes for better compression
        unsafe_arrows: true,
        unsafe_methods: true,
      },
      format: {
        comments: false,
      },
      mangle: {
        safari10: true,
      },
    },
    // Chunk size warnings
    chunkSizeWarningLimit: 600,
    // Optimize asset inlining
    assetsInlineLimit: 4096, // Inline assets smaller than 4kb
    // Target modern browsers for better optimization
    target: 'es2020',
    // Enable CSS minification
    cssMinify: true,
    // Report compressed size
    reportCompressedSize: true,
  },
})