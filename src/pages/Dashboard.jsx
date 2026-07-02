import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('labmatch_user');
    if (!savedUser) {
      // Not logged in -> redirect to login
      navigate('/login');
      return;
    }
    setUser(JSON.parse(savedUser));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('labmatch_user');
    navigate('/');
  };

  if (!user) return <div className={styles.loading}>Verifying credentials...</div>;

  return (
    <div className={styles.container}>
      {/* Dashboard Top Navigation */}
      <nav className={styles.navbar}>
        <div className={styles.logo}>LabMatch.</div>
        <div className={styles.userNav}>
          <span className={styles.userGreeting}>
            Logged in as <strong className={styles.userName}>{user.name}</strong> ({user.organisation})
          </span>
          <span className={styles.badge}>{user.role === 'startup' ? 'Startup' : 'Landlord'}</span>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            Sign Out
          </button>
        </div>
      </nav>

      {/* Main Dashboard Layout */}
      <main className={styles.mainContent}>
        <div className={styles.headerSection}>
          <h1 className={styles.title}>
            {user.role === 'startup' ? 'Your Lab Matches' : 'Your Listed Properties'}
          </h1>
          <p className={styles.subtitle}>
            {user.role === 'startup' 
              ? 'Below are the compliance-checked, curated lab matches aligned with your science.'
              : 'Manage your science facilities, upload brochures, and view qualified leads.'}
          </p>
        </div>

        {/* Dashboard Workspace - Placeholder for future match cards grid */}
        <div className={styles.workspace}>
          <div className={styles.placeholderGrid}>
            <div className={styles.placeholderCard}>
              <div className={styles.cardOutline}>
                <div className={styles.dashedBox}>
                  <svg viewBox="0 0 24 24" width="32" height="32" className={styles.icon}>
                    <path fill="currentColor" d="M19 13H12V20H19V13M12 3H5V10H12V3M5 13H12V20H5V13M19 3H12V10H19V3Z"/>
                  </svg>
                  <h3>Active Match List</h3>
                  <p>Matches and compliance scores will appear here. Under development.</p>
                </div>
              </div>
            </div>
            
            <div className={styles.placeholderCard}>
              <div className={styles.cardOutline}>
                <div className={styles.dashedBox}>
                  <svg viewBox="0 0 24 24" width="32" height="32" className={styles.icon}>
                    <path fill="currentColor" d="M12 2A10 10 0 1 0 22 12A10 10 0 0 0 12 2M12 20A8 8 0 1 1 20 12A8 8 0 0 1 12 20M11 12H13V17H11ZM11 7H13V9H11Z"/>
                  </svg>
                  <h3>Analytics & Documents</h3>
                  <p>Parsed lab documents, layout options, and floor plan insights are loading.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
