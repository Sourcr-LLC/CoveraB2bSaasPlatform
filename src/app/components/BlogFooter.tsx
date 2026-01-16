import { Link } from 'react-router';

export default function BlogFooter() {
  return (
    <footer className="border-t" style={{ borderColor: 'var(--border)' }}>
      <div className="max-w-6xl mx-auto px-4 md:px-12 py-10">
        <div className="flex flex-col sm:flex-row items-center sm:items-center justify-center sm:justify-between gap-4">
          <div className="text-xs" style={{ color: 'var(--foreground-subtle)', fontWeight: 500 }}>
            © 2026 Covera. All rights reserved.
          </div>
          <div className="flex items-center gap-6 md:gap-8 text-xs" style={{ color: 'var(--foreground-subtle)', fontWeight: 500 }}>
            <Link to="/privacy-policy" className="hover:opacity-70 transition-opacity">Privacy</Link>
            <Link to="/terms-of-service" className="hover:opacity-70 transition-opacity">Terms</Link>
            <Link to="/security" className="hover:opacity-70 transition-opacity">Security</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
