import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';

export default function ForgotPassword() {
  const [step, setStep] = useState<'email' | 'code' | 'success'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      console.log('Sending password reset request for:', email);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-be7827e3/auth/forgot-password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ email }),
        }
      );

      console.log('Password reset response status:', response.status);
      const data = await response.json();
      console.log('Password reset response data:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send verification code');
      }

      setStep('code');
    } catch (err: any) {
      console.error('Password reset error:', err);
      setError(err.message || 'Failed to send verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      console.log('Verifying code and resetting password...');
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-be7827e3/auth/verify-reset-code`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ email, code, password: newPassword }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reset password');
      }

      setStep('success');
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      console.error('Password reset error:', err);
      setError(err.message || 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12" style={{ backgroundColor: 'var(--background)' }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 sm:mb-12">
          <svg width="120" height="25" viewBox="0 0 3000 630" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-2 sm:mb-3 w-32 sm:w-40 h-auto">
            <path d="M598.514 129.609L549.807 165.933C523.39 131.26 491.538 105.05 454.251 87.3005C416.965 69.5515 376.032 60.677 331.453 60.677C282.471 60.677 237.204 72.3721 195.652 95.7623C154.1 119.152 121.835 150.592 98.858 190.08C75.8805 229.568 64.3918 274.078 64.3918 323.61C64.3918 398.184 89.9834 458.242 141.167 503.784C192.35 549.326 256.879 572.097 334.755 572.097C420.611 572.097 492.295 538.525 549.807 471.381L598.514 508.118C567.969 546.918 529.857 576.913 484.177 598.101C438.497 619.29 387.589 629.884 331.453 629.884C224.133 629.884 139.516 594.249 77.6004 522.977C25.8668 462.713 0 394.469 0 318.244C0 228.811 31.4392 153.412 94.3175 92.0474C157.196 30.6825 235.828 6.10352e-05 330.215 6.10352e-05C387.452 6.10352e-05 439.117 11.3512 485.209 34.0534C531.302 56.7557 569.07 88.6077 598.514 129.609ZM925.014 150.248C994.634 150.248 1052.42 175.427 1098.38 225.784C1139.93 272.014 1160.7 326.637 1160.7 389.653C1160.7 452.669 1138.69 507.774 1094.66 554.967C1050.63 602.16 994.084 625.757 925.014 625.757C855.669 625.757 799.051 602.16 755.16 554.967C711.268 507.774 689.323 452.669 689.323 389.653C689.323 326.912 710.099 272.427 751.651 226.197C797.606 175.564 855.393 150.248 925.014 150.248ZM925.014 207.21C876.857 207.21 835.443 225.096 800.77 260.87C766.098 296.643 748.762 339.846 748.762 390.479C748.762 423.225 756.673 453.839 772.496 482.32C788.319 510.801 809.714 532.678 836.681 547.95C863.649 563.222 893.093 570.859 925.014 570.859C957.485 570.859 987.135 563.222 1013.97 547.95C1040.8 532.678 1062.05 510.801 1077.74 482.32C1093.42 453.839 1101.27 423.225 1101.27 390.479C1101.27 339.846 1083.93 296.643 1049.26 260.87C1014.58 225.096 973.17 207.21 925.014 207.21ZM1225.1 173.363H1287.01L1438.5 502.752L1588.75 173.363H1651.07L1443.86 626.17H1433.54L1225.1 173.363ZM2120.8 464.364L2169.51 490.369C2153.83 522.014 2135.39 547.468 2114.2 566.731C2093.01 585.993 2069.21 600.647 2042.79 610.691C2016.37 620.735 1986.52 625.757 1953.22 625.757C1879.47 625.757 1821.82 601.61 1780.27 553.316C1738.72 505.022 1717.94 450.468 1717.94 389.653C1717.94 332.141 1735.55 280.958 1770.78 236.104C1815.36 178.866 1875.21 150.248 1950.33 150.248C2027.11 150.248 2088.61 179.554 2134.84 238.167C2167.58 279.444 2184.09 330.903 2184.37 392.543H1777.79C1778.89 445.377 1795.68 488.649 1828.15 522.358C1860.62 556.068 1900.66 572.923 1948.27 572.923C1971.38 572.923 1993.81 568.864 2015.55 560.746C2037.29 552.628 2055.79 541.965 2071.07 528.756C2086.34 515.548 2102.92 494.084 2120.8 464.364ZM2120.8 342.598C2113.1 311.503 2101.82 286.668 2086.96 268.093C2072.1 249.518 2052.42 234.521 2027.93 223.101C2003.44 211.681 1977.71 205.971 1950.74 205.971C1906.44 205.971 1868.33 220.281 1836.41 248.899C1813.29 269.813 1795.82 301.046 1783.98 342.598H2120.8ZM2270.64 418.134V363.649C2275.04 336.406 2281.37 314.254 2289.63 297.193C2308.89 249.862 2334.76 215.19 2367.23 193.176C2399.7 171.161 2426.66 160.154 2448.13 160.154C2464.09 160.154 2481.15 165.383 2499.31 175.839L2469.18 224.546C2443.59 215.19 2418.2 222.757 2393.02 247.248C2367.85 271.739 2350.44 298.432 2340.81 327.325C2333.65 352.917 2330.08 400.936 2330.08 471.381V624.518H2270.64V418.134ZM2762.66 150.248C2832.28 150.248 2890.07 175.427 2936.02 225.784C2978.4 271.739 2999.59 326.362 2999.59 389.653C3000.14 545.955 3000.14 625.344 2999.59 627.821H2938.08V525.041C2905.89 585.03 2847.41 618.602 2762.66 625.757C2693.31 625.757 2636.7 602.16 2592.8 554.967C2548.91 507.774 2526.97 452.669 2526.97 389.653C2526.97 326.912 2547.74 272.427 2589.3 226.197C2635.25 175.564 2693.04 150.248 2762.66 150.248ZM2762.66 207.21C2714.5 207.21 2673.09 225.096 2638.42 260.87C2603.74 296.643 2586.41 339.846 2586.41 390.479C2586.41 423.225 2595.28 454.733 2613.03 485.003C2630.78 515.272 2660.84 540.864 2703.22 561.778C2809.44 585.443 2884.98 537.149 2929.83 416.896C2932.31 378.371 2928.18 341.497 2917.45 306.274C2909.74 290.314 2899.15 275.179 2885.66 260.87C2851.82 225.096 2810.81 207.21 2762.66 207.21Z" fill="currentColor"/>
          </svg>
          <p className="text-xs sm:text-sm" style={{ color: 'var(--foreground-muted)' }}>
            Enterprise vendor compliance tracking
          </p>
        </div>

        {step === 'success' ? (
          // Success state
          <div
            className="rounded-xl border p-6 sm:p-8 text-center"
            style={{
              backgroundColor: 'var(--card)',
              borderColor: 'var(--border)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)' }}
            >
              <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8" style={{ color: 'var(--status-compliant)' }} />
            </div>
            <h2 className="text-lg sm:text-xl mb-3" style={{ fontWeight: 600, color: 'var(--foreground)' }}>
              Password reset successful
            </h2>
            <p className="text-sm mb-6" style={{ color: 'var(--foreground-muted)' }}>
              Your password has been updated. Redirecting to login...
            </p>
          </div>
        ) : step === 'code' ? (
          // Code verification & password reset step
          <>
            <div className="mb-6 sm:mb-8">
              <h1 className="text-xl sm:text-2xl mb-2" style={{ fontWeight: 600, color: 'var(--foreground)' }}>
                Enter verification code
              </h1>
              <p className="text-xs sm:text-sm" style={{ color: 'var(--foreground-muted)' }}>
                We sent a 6-digit code to <strong className="break-all">{email}</strong>. Enter it below to reset your password.
              </p>
            </div>

            <form onSubmit={handleCodeSubmit}>
              <div
                className="rounded-xl border p-5 sm:p-8"
                style={{
                  backgroundColor: 'var(--card)',
                  borderColor: 'var(--border)',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                {error && (
                  <div
                    className="mb-5 sm:mb-6 p-3 sm:p-4 rounded-lg text-xs sm:text-sm"
                    style={{
                      backgroundColor: 'rgba(239, 68, 68, 0.1)',
                      color: '#ef4444',
                    }}
                  >
                    {error}
                  </div>
                )}

                <div className="mb-5 sm:mb-6">
                  <label
                    htmlFor="code"
                    className="block text-xs sm:text-sm mb-2"
                    style={{ color: 'var(--foreground)', fontWeight: 500 }}
                  >
                    Verification code
                  </label>
                  <input
                    id="code"
                    type="text"
                    inputMode="numeric"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    required
                    maxLength={6}
                    className="w-full px-3 sm:px-4 py-3 sm:py-4 rounded-lg border text-center text-xl sm:text-2xl tracking-[0.3em] sm:tracking-widest font-mono outline-none transition-all focus:ring-2 focus:ring-offset-2"
                    style={{
                      backgroundColor: 'var(--background)',
                      borderColor: 'var(--border)',
                      color: 'var(--foreground)',
                    }}
                    placeholder="000000"
                    autoComplete="one-time-code"
                  />
                  <p className="text-xs mt-2 text-center" style={{ color: 'var(--foreground-muted)' }}>
                    Code expires in 10 minutes
                  </p>
                </div>

                <div className="mb-5 sm:mb-6">
                  <label
                    htmlFor="password"
                    className="block text-xs sm:text-sm mb-2"
                    style={{ color: 'var(--foreground)', fontWeight: 500 }}
                  >
                    New password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full px-3 sm:px-4 py-3 sm:py-3.5 rounded-lg border text-sm outline-none transition-all focus:ring-2 focus:ring-offset-2"
                    style={{
                      backgroundColor: 'var(--background)',
                      borderColor: 'var(--border)',
                      color: 'var(--foreground)',
                    }}
                    placeholder="Enter new password (min 6 characters)"
                    autoComplete="new-password"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading || code.length !== 6}
                  className="w-full py-3 sm:py-3.5 rounded-lg text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                  style={{
                    backgroundColor: 'var(--primary)',
                    color: 'var(--primary-foreground)',
                    fontWeight: 500,
                  }}
                >
                  {isLoading ? 'Resetting password...' : 'Reset password'}
                </button>

                <div className="mt-5 sm:mt-6 text-center">
                  <button
                    type="button"
                    onClick={() => setStep('email')}
                    className="inline-flex items-center gap-2 text-xs sm:text-sm touch-manipulation"
                    style={{ color: 'var(--primary)', fontWeight: 500 }}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                </div>
              </div>
            </form>
          </>
        ) : (
          // Email step
          <>
            <div className="mb-6 sm:mb-8">
              <h1 className="text-xl sm:text-2xl mb-2" style={{ fontWeight: 600, color: 'var(--foreground)' }}>
                Reset your password
              </h1>
              <p className="text-xs sm:text-sm" style={{ color: 'var(--foreground-muted)' }}>
                Enter your email address and we'll send you a verification code to reset your password.
              </p>
            </div>

            <form onSubmit={handleEmailSubmit}>
              <div
                className="rounded-xl border p-5 sm:p-8"
                style={{
                  backgroundColor: 'var(--card)',
                  borderColor: 'var(--border)',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                {error && (
                  <div
                    className="mb-5 sm:mb-6 p-3 sm:p-4 rounded-lg text-xs sm:text-sm"
                    style={{
                      backgroundColor: 'rgba(239, 68, 68, 0.1)',
                      color: '#ef4444',
                    }}
                  >
                    {error}
                  </div>
                )}

                <div className="mb-5 sm:mb-6">
                  <label
                    htmlFor="email"
                    className="block text-xs sm:text-sm mb-2"
                    style={{ color: 'var(--foreground)', fontWeight: 500 }}
                  >
                    Email address
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5"
                      style={{ color: 'var(--foreground-muted)' }}
                    />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-3.5 rounded-lg border text-sm outline-none transition-all focus:ring-2 focus:ring-offset-2"
                      style={{
                        backgroundColor: 'var(--background)',
                        borderColor: 'var(--border)',
                        color: 'var(--foreground)',
                      }}
                      placeholder="you@company.com"
                      autoComplete="email"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 sm:py-3.5 rounded-lg text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                  style={{
                    backgroundColor: 'var(--primary)',
                    color: 'var(--primary-foreground)',
                    fontWeight: 500,
                  }}
                >
                  {isLoading ? 'Sending code...' : 'Send verification code'}
                </button>

                <div className="mt-5 sm:mt-6 text-center">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 text-xs sm:text-sm touch-manipulation"
                    style={{ color: 'var(--primary)', fontWeight: 500 }}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to login
                  </Link>
                </div>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}