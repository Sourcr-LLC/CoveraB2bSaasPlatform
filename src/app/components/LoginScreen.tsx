import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { CheckCircle2, ArrowLeft } from 'lucide-react';
import { PremiumCheck } from './ui/PremiumCheck';
import { authApi } from '../lib/api';
import SEO, { SEO_CONFIGS } from './SEO';
import { analytics } from './GoogleAnalytics';

interface LoginScreenProps {
  onLogin: () => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [step, setStep] = useState<'initial' | 'verification'>('initial');
  const [verificationCode, setVerificationCode] = useState('');
  const [name, setName] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [error, setError] = useState('');
  const [isAdminSetupNeeded, setIsAdminSetupNeeded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsAdminSetupNeeded(false);
    setIsLoading(true);

    try {
      if (isSignUp) {
        // Direct signup without email verification (skipping step === 'initial' check)
        await authApi.signUp(email, password, name, organizationName);
        analytics.trackTrialSignup('standard');
        navigate('/dashboard');
        onLogin();
      } else {
        await authApi.signIn(email, password);
        analytics.trackLogin('email');
        onLogin();
        
        // Redirect admin to admin dashboard
        if (email === 'admin@covera.co') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      const errorMessage = err.message || 'Authentication failed. Please try again.';
      setError(errorMessage);
      
      // Check if this is the admin user trying to login but failing
      if (email === 'admin@covera.co' && !isSignUp && errorMessage.includes('Invalid login credentials')) {
        setIsAdminSetupNeeded(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminSetup = async () => {
    setIsLoading(true);
    try {
      // Import dynamically to avoid circular dependencies if any, though likely fine here
      const { adminApi } = await import('../lib/api');
      await adminApi.ensureAdminUser();
      setError('');
      setIsAdminSetupNeeded(false);
      // Auto login after setup
      await authApi.signIn(email, password);
      onLogin();
      navigate('/admin');
    } catch (err: any) {
      console.error('Admin setup failed:', err);
      setError('Failed to setup admin account: ' + (err.message || 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSignUp = () => {
    setIsSignUp(!isSignUp);
    setStep('initial');
    setError('');
    setVerificationCode('');
  };

  return (
    <>
      <SEO {...SEO_CONFIGS.login} />
      <div className="min-h-screen flex" style={{ backgroundColor: 'var(--background)' }}>
        {/* Go Back Button - Minimal */}
        <Link 
          to="/"
          className="fixed top-6 left-6 z-50 flex items-center gap-2 px-3 py-2 rounded-lg transition-all hover:opacity-70"
          style={{ color: 'var(--foreground-muted)', fontSize: '0.875rem' }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Back</span>
        </Link>

        {/* Left side - Login form */}
        <div 
          className="flex-1 flex items-center justify-center px-8 py-12"
        >
          <div className="w-full max-w-md">
            {/* Logo */}
            <div className="mb-12 mt-12 sm:mt-0">
              <svg width="150" height="31" viewBox="0 0 3000 630" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-3" style={{ color: 'var(--primary)' }}>
                <path d="M598.514 129.609L549.807 165.933C523.39 131.26 491.538 105.05 454.251 87.3005C416.965 69.5515 376.032 60.677 331.453 60.677C282.471 60.677 237.204 72.3721 195.652 95.7623C154.1 119.152 121.835 150.592 98.858 190.08C75.8805 229.568 64.3918 274.078 64.3918 323.61C64.3918 398.184 89.9834 458.242 141.167 503.784C192.35 549.326 256.879 572.097 334.755 572.097C420.611 572.097 492.295 538.525 549.807 471.381L598.514 508.118C567.969 546.918 529.857 576.913 484.177 598.101C438.497 619.29 387.589 629.884 331.453 629.884C224.133 629.884 139.516 594.249 77.6004 522.977C25.8668 462.713 0 394.469 0 318.244C0 228.811 31.4392 153.412 94.3175 92.0474C157.196 30.6825 235.828 6.10352e-05 330.215 6.10352e-05C387.452 6.10352e-05 439.117 11.3512 485.209 34.0534C531.302 56.7557 569.07 88.6077 598.514 129.609ZM925.014 150.248C994.634 150.248 1052.42 175.427 1098.38 225.784C1139.93 272.014 1160.7 326.637 1160.7 389.653C1160.7 452.669 1138.69 507.774 1094.66 554.967C1050.63 602.16 994.084 625.757 925.014 625.757C855.669 625.757 799.051 602.16 755.16 554.967C711.268 507.774 689.323 452.669 689.323 389.653C689.323 326.912 710.099 272.427 751.651 226.197C797.606 175.564 855.393 150.248 925.014 150.248ZM925.014 207.21C876.857 207.21 835.443 225.096 800.77 260.87C766.098 296.643 748.762 339.846 748.762 390.479C748.762 423.225 756.673 453.839 772.496 482.32C788.319 510.801 809.714 532.678 836.681 547.95C863.649 563.222 893.093 570.859 925.014 570.859C957.485 570.859 987.135 563.222 1013.97 547.95C1040.8 532.678 1062.05 510.801 1077.74 482.32C1093.42 453.839 1101.27 423.225 1101.27 390.479C1101.27 339.846 1083.93 296.643 1049.26 260.87C1014.58 225.096 973.17 207.21 925.014 207.21ZM1225.1 173.363H1287.01L1438.5 502.752L1588.75 173.363H1651.07L1443.86 626.17H1433.54L1225.1 173.363ZM2120.8 464.364L2169.51 490.369C2153.83 522.014 2135.39 547.468 2114.2 566.731C2093.01 585.993 2069.21 600.647 2042.79 610.691C2016.37 620.735 1986.52 625.757 1953.22 625.757C1879.47 625.757 1821.82 601.61 1780.27 553.316C1738.72 505.022 1717.94 450.468 1717.94 389.653C1717.94 332.141 1735.55 280.958 1770.78 236.104C1815.36 178.866 1875.21 150.248 1950.33 150.248C2027.11 150.248 2088.61 179.554 2134.84 238.167C2167.58 279.444 2184.09 330.903 2184.37 392.543H1777.79C1778.89 445.377 1795.68 488.649 1828.15 522.358C1860.62 556.068 1900.66 572.923 1948.27 572.923C1971.38 572.923 1993.81 568.864 2015.55 560.746C2037.29 552.628 2055.79 541.965 2071.07 528.756C2086.34 515.548 2102.92 494.084 2120.8 464.364ZM2120.8 342.598C2113.1 311.503 2101.82 286.668 2086.96 268.093C2072.1 249.518 2052.42 234.521 2027.93 223.101C2003.44 211.681 1977.71 205.971 1950.74 205.971C1906.44 205.971 1868.33 220.281 1836.41 248.899C1813.29 269.813 1795.82 301.046 1783.98 342.598H2120.8ZM2270.64 418.134V363.649C2275.04 336.406 2281.37 314.254 2289.63 297.193C2308.89 249.862 2334.76 215.19 2367.23 193.176C2399.7 171.161 2426.66 160.154 2448.13 160.154C2464.09 160.154 2481.15 165.383 2499.31 175.839L2469.18 224.546C2443.59 215.19 2418.2 222.757 2393.02 247.248C2367.85 271.739 2350.44 298.432 2340.81 327.325C2333.65 352.917 2330.08 400.936 2330.08 471.381V624.518H2270.64V418.134ZM2762.66 150.248C2832.28 150.248 2890.07 175.427 2936.02 225.784C2978.4 271.739 2999.59 326.362 2999.59 389.653C3000.14 545.955 3000.14 625.344 2999.59 627.821H2938.08V525.041C2905.89 585.03 2847.41 618.602 2762.66 625.757C2693.31 625.757 2636.7 602.16 2592.8 554.967C2548.91 507.774 2526.97 452.669 2526.97 389.653C2526.97 326.912 2547.74 272.427 2589.3 226.197C2635.25 175.564 2693.04 150.248 2762.66 150.248ZM2762.66 207.21C2714.5 207.21 2673.09 225.096 2638.42 260.87C2603.74 296.643 2586.41 339.846 2586.41 390.479C2586.41 423.225 2595.28 454.733 2613.03 485.003C2630.78 515.272 2660.84 540.864 2703.22 561.778C2809.44 585.443 2884.98 537.149 2929.83 416.896C2932.31 378.371 2928.18 341.497 2917.45 306.274C2909.74 290.314 2899.15 275.179 2885.66 260.87C2851.82 225.096 2810.81 207.21 2762.66 207.21Z" fill="currentColor"/>
              </svg>
              <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>
                Sign in to your organization
              </p>
            </div>

            {/* Login Card */}
            <div 
              className="rounded-2xl border border-slate-100 p-10"
              style={{ 
                backgroundColor: 'var(--card)',
              }}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                {isSignUp && step === 'verification' ? (
                  <div>
                    <div className="mb-6 text-center">
                      <h3 className="text-lg font-semibold mb-2">Check your email</h3>
                      <p className="text-sm text-slate-500">
                        We sent a verification code to <strong>{email}</strong>
                      </p>
                    </div>

                    <div className="mb-6">
                      <label htmlFor="code" className="block mb-2.5 text-sm">
                        Verification Code
                      </label>
                      <input
                        type="text"
                        id="code"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 text-center tracking-widest text-lg font-mono"
                        style={{ 
                          backgroundColor: 'var(--input-background)',
                          borderColor: 'var(--input-border)',
                          color: 'var(--foreground)'
                        }}
                        placeholder="123456"
                        required
                        maxLength={6}
                      />
                    </div>
                    
                    <button 
                      type="button" 
                      onClick={() => setStep('initial')}
                      className="text-sm text-center w-full mb-4 text-slate-500 hover:text-slate-700"
                    >
                      Incorrect email? Go back
                    </button>
                  </div>
                ) : (
                  <>
                    {isSignUp && (
                      <>
                        <div>
                          <label htmlFor="name" className="block mb-2.5 text-sm">
                            Full Name
                          </label>
                          <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
                            style={{ 
                              backgroundColor: 'var(--input-background)',
                              borderColor: 'var(--input-border)',
                              color: 'var(--foreground)'
                            }}
                            placeholder="John Doe"
                            required
                          />
                        </div>

                        <div>
                          <label htmlFor="organizationName" className="block mb-2.5 text-sm">
                            Organization Name
                          </label>
                          <input
                            type="text"
                            id="organizationName"
                            value={organizationName}
                            onChange={(e) => setOrganizationName(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
                            style={{ 
                              backgroundColor: 'var(--input-background)',
                              borderColor: 'var(--input-border)',
                              color: 'var(--foreground)'
                            }}
                            placeholder="Acme Corporation"
                            required
                          />
                        </div>
                      </>
                    )}

                    <div>
                      <label htmlFor="email" className="block mb-2.5 text-sm">
                        Email address
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
                        style={{ 
                          backgroundColor: 'var(--input-background)',
                          borderColor: 'var(--input-border)',
                          color: 'var(--foreground)'
                        }}
                        placeholder="your@company.com"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="password" className="block mb-2.5 text-sm">
                        Password
                      </label>
                      <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
                        style={{ 
                          backgroundColor: 'var(--input-background)',
                          borderColor: 'var(--input-border)',
                          color: 'var(--foreground)'
                        }}
                        placeholder="••••••••"
                        required
                        minLength={6}
                      />
                      {!isSignUp && (
                        <div className="mt-2 text-right">
                          <Link
                            to="/forgot-password"
                            className="text-xs"
                            style={{ color: 'var(--primary)', fontWeight: 500 }}
                          >
                            Forgot password?
                          </Link>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {error && (
                  <div 
                    className="p-4 rounded-lg text-sm"
                    style={{ 
                      backgroundColor: 'var(--status-high-risk-bg)',
                      color: 'var(--status-high-risk)',
                      border: '1px solid var(--status-high-risk-border)'
                    }}
                  >
                    {error}
                    {isAdminSetupNeeded && (
                      <div className="mt-3 pt-3 border-t border-red-200">
                        <p className="mb-2 font-medium">Admin account not found or password incorrect.</p>
                        <button
                          type="button"
                          onClick={handleAdminSetup}
                          className="text-xs px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors w-full"
                        >
                          Initialize Admin Account
                        </button>
                      </div>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-4 rounded-lg text-sm disabled:opacity-50"
                  style={{ 
                    backgroundColor: 'var(--primary)', 
                    color: 'var(--primary-foreground)',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  {isLoading ? 'Please wait...' : (
                    isSignUp ? (step === 'verification' ? 'Verify & Create Account' : 'Continue') : 'Sign in'
                  )}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t text-center text-sm" style={{ borderColor: 'var(--border-subtle)' }}>
                <button 
                  type="button"
                  onClick={toggleSignUp}
                  className="hover:underline"
                  style={{ color: 'var(--foreground-muted)' }}
                >
                  {isSignUp ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
                </button>
              </div>
            </div>

            {/* Trust indicator */}
            <div className="mt-8 text-center text-sm" style={{ color: 'var(--foreground-subtle)' }}>
              <p>Trusted by compliance teams across the USA</p>
            </div>
          </div>
        </div>

        {/* Right side - Trust messaging */}
        <div 
          className="hidden lg:flex flex-1 items-center justify-center px-16 py-12 border-l"
          style={{ 
            backgroundColor: 'var(--panel)',
            borderColor: 'var(--border-subtle)'
          }}
        >
          <div 
            className="max-w-lg"
          >
            <h2 className="mb-8 leading-tight">
              Compliance confidence<br />for operations teams
            </h2>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <PremiumCheck className="mt-1" />
                <div>
                  <h4 className="mb-2">Real-time tracking</h4>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>
                    Monitor all vendor certificates of insurance in one unified dashboard
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <PremiumCheck className="mt-1" />
                <div>
                  <h4 className="mb-2">Automated reminders</h4>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>
                    Never chase vendors again—automated email reminders handle follow-up
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <PremiumCheck className="mt-1" />
                <div>
                  <h4 className="mb-2">Audit-ready reports</h4>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>
                    Generate compliance documentation for auditors in seconds, not hours
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t" style={{ borderColor: 'var(--border)' }}>
              <p className="text-sm" style={{ color: 'var(--foreground-subtle)' }}>
                "Covera eliminated our compliance blind spots and gave us back 15 hours per week."
              </p>
              <p className="text-sm mt-3" style={{ color: 'var(--foreground-muted)' }}>
                — Director of Operations, National Property Group
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}