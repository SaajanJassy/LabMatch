import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { glowMove } from '../utils/glow';
import styles from './Login.module.css';

export default function Login() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Set initial role based on query parameter (?role=landlord or ?role=startup)
  const initialRole = searchParams.get('role') === 'landlord' ? 'landlord' : 'startup';
  const [role, setRole] = useState(initialRole);
  const [isSignUp, setIsSignUp] = useState(true);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [organisation, setOrganisation] = useState('');
  
  // Role-specific states
  const [fundingStage, setFundingStage] = useState('Seed');
  const [reqSqft, setReqSqft] = useState('');
  const [propertyName, setPropertyName] = useState('');
  const [propertySqft, setPropertySqft] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Auth bypass: save user details locally and route to dashboard
    const userData = {
      name: isSignUp ? name : email.split('@')[0],
      email,
      organisation,
      role,
      details: role === 'startup' ? { fundingStage, reqSqft } : { propertyName, propertySqft }
    };
    
    localStorage.setItem('labmatch_user', JSON.stringify(userData));
    navigate('/dashboard');
  };

  return (
    <div className={styles.container}>
      <div className={styles.navbar}>
        <a href="/" className={styles.logo}>LabMatch.</a>
      </div>

      <div className={styles.wrapper}>
        <motion.div 
          className={`${styles.card} glow`}
          onMouseMove={glowMove}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className={styles.cardHeader}>
            <h2 className={styles.title}>{isSignUp ? 'Create your account' : 'Sign in to LabMatch'}</h2>
            <p className={styles.subtitle}>
              {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
              <button onClick={() => setIsSignUp(!isSignUp)} className={styles.toggleBtn}>
                {isSignUp ? 'Sign in' : 'Register'}
              </button>
            </p>
          </div>

          {/* Role Toggle Selector */}
          <div className={styles.roleToggleWrapper}>
            <button 
              type="button" 
              className={`${styles.roleBtn} ${role === 'startup' ? styles.roleBtnActive : ''}`}
              onClick={() => setRole('startup')}
            >
              Startup
            </button>
            <button 
              type="button" 
              className={`${styles.roleBtn} ${role === 'landlord' ? styles.roleBtnActive : ''}`}
              onClick={() => setRole('landlord')}
            >
              Landlord
            </button>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {isSignUp && (
              <>
                <div className={styles.inputGroup}>
                  <label htmlFor="name" className={styles.label}>Full Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="Dr. Sarah Jenkins"
                    required
                    className={styles.input}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="organisation" className={styles.label}>Organisation / Company</label>
                  <input 
                    type="text" 
                    id="organisation" 
                    value={organisation} 
                    onChange={(e) => setOrganisation(e.target.value)} 
                    placeholder="Astra Biosciences"
                    required
                    className={styles.input}
                  />
                </div>
              </>
            )}

            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>Email Address</label>
              <input 
                type="email" 
                id="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="sarah@astrabio.com"
                required
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>Password</label>
              <input 
                type="password" 
                id="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••"
                required
                className={styles.input}
              />
            </div>

            <button type="submit" className={styles.submitBtn}>
              {isSignUp ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          {/* Social OAuth Integration Dividers & Buttons */}
          <div className={styles.divider}>
            <span>or continue with</span>
          </div>

          <div className={styles.oauthContainer}>
            <button 
              type="button" 
              onClick={() => {
                localStorage.setItem('labmatch_user', JSON.stringify({ name: 'Google User', email: 'user@google.com', organisation: 'Google Labs', role }));
                navigate('/dashboard');
              }}
              className={styles.oauthBtn}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" className={styles.oauthIcon}>
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              Google
            </button>
            <button 
              type="button" 
              onClick={() => {
                localStorage.setItem('labmatch_user', JSON.stringify({ name: 'LinkedIn User', email: 'user@linkedin.com', organisation: 'BioCorp', role }));
                navigate('/dashboard');
              }}
              className={styles.oauthBtn}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" className={styles.oauthIcon} fill="#0A66C2">
                <path d="M20 2H4a2 2 0 00-2 2v16a2 2 0 002 2h16a2 2 0 002-2V4a2 2 0 00-2-2zM8 19H5V9h3v10zM6.5 7.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM19 19h-3v-4.5c0-1.1-.9-2-2-2s-2 .9-2 2V19H9V9h3v1.5c.5-.8 1.5-1.5 2.5-1.5 2.2 0 4 1.8 4 4V19z"/>
              </svg>
              LinkedIn
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
