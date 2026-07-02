import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { glowMove } from '../utils/glow';
import styles from './Dashboard.module.css';

// Mock matches data matching screenshots
const mockMatches = [
  {
    id: 1,
    location: 'LONDON',
    price: '£900',
    score: '95%',
    insight: "This lab is an excellent fit for your dry lab needs! The price of £900/month is well within your budget, and the 500 sqft space comfortably exceeds your team's requirement of 437.5 sqft. Plus, it comes equipped with the PCR machine you requested.",
    status: 'Available',
    labType: 'Dry Lab',
    landlord: 'Pioneer Group',
    email: 'subjit@pioneergroup.co.uk',
    badge: 'GOOD EXAMPLE',
    imageType: 'mesh'
  },
  {
    id: 2,
    location: 'LONDON',
    price: '£900',
    score: '95%',
    insight: "This lab is a great fit for your \"Dry Lab\" needs! The £900/month price is well within your budget, and the 500 sqft space comfortably exceeds your 437.5 sqft requirement. Importantly, it comes equipped with a PCR machine, perfect for your technology development.",
    status: 'Available',
    labType: 'Dry Lab',
    landlord: 'Pioneer Group',
    email: 'subjit@pioneergroup.co.uk',
    badge: 'GOOD EXAMPLE',
    imageType: 'waves'
  },
  {
    id: 3,
    location: 'LONDON',
    price: '£1,000',
    score: '100%',
    insight: "This lab is an outstanding match for your needs! The £1000/month price fits your budget perfectly, and the generous 700 sqft space provides ample room, far exceeding your 437.5 sqft requirement. With two PCR machines available, your technology development will be well-supported.",
    status: 'Under Offer',
    labType: 'Dry Lab',
    landlord: 'Pioneer Group',
    email: 'subjit@pioneergroup.co.uk',
    badge: 'GOOD EXAMPLE 2',
    imageType: 'steps'
  },
  {
    id: 4,
    location: 'LEEDS',
    price: '£800',
    score: '95%',
    insight: "This Leeds lab is an excellent fit! The £800/month price is well within your budget, and the 500 sqft provides ample space for your 7-person team (requiring 437.5 sqft). Plus, it comes equipped with both the Mass Spec and PCR machine you need.",
    status: 'Available',
    labType: 'Wet Lab',
    landlord: 'Nexus Leeds',
    email: 'N.J.Berry@leeds.ac.uk',
    badge: 'GOOD EXAMPLE 1 LEEDS',
    imageType: 'leeds1'
  },
  {
    id: 5,
    location: 'LEEDS',
    price: '£800',
    score: '90%',
    insight: "This lab in Leeds is an excellent fit, providing the crucial Mass Spec equipment you require. With a price of £800/month, it is well within your budget, and the 500 sqft space is generous for your 7-person team (437.5 sqft minimum needed).",
    status: 'Available',
    labType: 'Wet Lab',
    landlord: 'Nexus Leeds',
    email: 'N.J.Berry@leeds.ac.uk',
    badge: 'GOOD EXAMPLE 2 LEEDS',
    imageType: 'leeds2'
  },
  {
    id: 6,
    location: 'LEEDS',
    price: '£800',
    score: '90%',
    insight: "This lab in Leeds is an excellent match! The £800/month price is well within your budget, and the 500 sqft space provides ample room for your team. Crucially, it has the Mass Spec equipment you need for your AI data analysis.",
    status: 'Available',
    labType: 'Wet Lab',
    landlord: 'Nexus Leeds',
    email: 'N.J.Berry@leeds.ac.uk',
    badge: 'GOOD EXAMPLE 1 LEEDS',
    imageType: 'leeds3'
  }
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Flow states
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const [showOnboardingForm, setShowOnboardingForm] = useState(false);
  const [matchingInProgress, setMatchingInProgress] = useState(false);
  const [matchingProgress, setMatchingProgress] = useState(0);

  // Onboarding Form values
  const [fundingStage, setFundingStage] = useState('Seed');
  const [targetSize, setTargetSize] = useState('');
  const [locationPreference, setLocationPreference] = useState('London');
  const [labType, setLabType] = useState('Dry Lab');
  const [pcrRequired, setPcrRequired] = useState(false);
  const [massSpecRequired, setMassSpecRequired] = useState(false);
  const [fumeHoodRequired, setFumeHoodRequired] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('labmatch_user');
    if (!savedUser) {
      navigate('/login');
      return;
    }
    const parsedUser = JSON.parse(savedUser);
    setUser(parsedUser);

    // Check if user already has onboarding details saved
    if (parsedUser.onboarding) {
      setOnboardingCompleted(true);
      // Retrieve values to pre-populate
      const specs = parsedUser.onboarding;
      setFundingStage(specs.fundingStage || 'Seed');
      setTargetSize(specs.targetSize || '');
      setLocationPreference(specs.locationPreference || 'London');
      setLabType(specs.labType || 'Dry Lab');
      setPcrRequired(specs.pcrRequired || false);
      setMassSpecRequired(specs.massSpecRequired || false);
      setFumeHoodRequired(specs.fumeHoodRequired || false);
    }
  }, [navigate]);

  // Simulate background matching calculations
  const startMatchingSimulation = (specs) => {
    setShowOnboardingForm(false);
    setMatchingInProgress(true);
    setMatchingProgress(0);

    const interval = setInterval(() => {
      setMatchingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setMatchingInProgress(false);
            setOnboardingCompleted(true);
            
            // Save specs to profile
            const updatedUser = { ...user, onboarding: specs };
            localStorage.setItem('labmatch_user', JSON.stringify(updatedUser));
            setUser(updatedUser);
          }, 600);
          return 100;
        }
        return prev + 5;
      });
    }, 120);
  };

  const handleOnboardingSubmit = (e) => {
    e.preventDefault();
    const specs = {
      fundingStage,
      targetSize,
      locationPreference,
      labType,
      pcrRequired,
      massSpecRequired,
      fumeHoodRequired
    };
    startMatchingSimulation(specs);
  };

  const handleLogout = () => {
    localStorage.removeItem('labmatch_user');
    navigate('/');
  };

  if (!user) return <div className={styles.loading}>Verifying credentials...</div>;

  // Render the appropriate top-right avatar / org details in the sleek nav bar
  const renderUserPill = () => (
    <div className={styles.accountCard}>
      <div className={styles.avatar}>
        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
      </div>
      <div className={styles.accountDetails}>
        <div className={styles.accountName}>{user.name}</div>
        <div className={styles.accountOrg}>{user.organisation}</div>
      </div>
      <span className={styles.roleBadge}>{user.role}</span>
    </div>
  );

  return (
    <div className={styles.container}>
      {/* Sleek, Modern Glassmorphism Navbar */}
      <nav className={styles.sleekNavbar}>
        <div className={styles.logo}>LabMatch.</div>
        <div className={styles.navActions}>
          {renderUserPill()}
          <button onClick={handleLogout} className={styles.logoutPill}>
            Sign Out
          </button>
        </div>
      </nav>

      <main className={styles.mainContent}>
        {/* State 1: Matching loading state in the background */}
        {matchingInProgress && (
          <div className={styles.loaderContainer}>
            <div className={styles.loaderSpinner}>
              <svg className={styles.spinnerSvg} viewBox="0 0 100 100">
                <circle className={styles.spinnerTrack} cx="50" cy="50" r="45" />
                <circle 
                  className={styles.spinnerFill} 
                  cx="50" 
                  cy="50" 
                  r="45" 
                  strokeDasharray="283"
                  strokeDashoffset={283 - (283 * matchingProgress) / 100}
                />
              </svg>
              <div className={styles.progressText}>{matchingProgress}%</div>
            </div>
            <h2>Running compliance matches...</h2>
            <p>Analyzing floor plans, price constraints, and containment requirements in {locationPreference}.</p>
          </div>
        )}

        {/* State 2: Empty/No Matches State */}
        {!onboardingCompleted && !matchingInProgress && (
          <div className={styles.emptyState}>
            <div className={styles.emptyCard}>
              <div className={styles.emptyIcon}>
                <svg viewBox="0 0 24 24" width="48" height="48">
                  <path fill="currentColor" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                </svg>
              </div>
              <h2 className={styles.emptyTitle}>Find Your Matches</h2>
              <p className={styles.emptyDescription}>
                Provide your funding stage, containment preferences, and lab details to scan available properties and find compliant matches instantly.
              </p>
              <button 
                onClick={() => setShowOnboardingForm(true)} 
                className={styles.primaryPill}
              >
                Find your matches
              </button>
            </div>
          </div>
        )}

        {/* State 3: Active Matches Grid */}
        {onboardingCompleted && !matchingInProgress && (
          <div className={styles.dashboardGrid}>
            <div className={styles.resultsHeader}>
              <div>
                <h1 className={styles.title}>Your Lab Matches</h1>
                <p className={styles.subtitle}>
                  Below are the compliance-checked, curated lab matches aligned with your science.
                </p>
              </div>
              <button 
                onClick={() => setShowOnboardingForm(true)} 
                className={styles.secondaryPill}
              >
                Edit Requirements
              </button>
            </div>

            {/* Curated Lab Matches Grid (High fidelity visual rendering from screenshots) */}
            <div className={styles.matchesGrid}>
              {mockMatches
                .filter(m => m.location.toLowerCase() === locationPreference.toLowerCase())
                .map((match) => (
                  <div key={match.id} className={`${styles.matchCard} glow`} onMouseMove={glowMove}>
                    {/* Visual Card Header */}
                    <div className={styles.matchVisualHeader}>
                      <span className={styles.matchBadge}>{match.badge}</span>
                      {match.imageType === 'mesh' && (
                        <div className={`${styles.pattern} ${styles.meshPattern}`} />
                      )}
                      {match.imageType === 'waves' && (
                        <div className={`${styles.pattern} ${styles.wavesPattern}`} />
                      )}
                      {match.imageType === 'steps' && (
                        <div className={`${styles.pattern} ${styles.stepsPattern}`} />
                      )}
                      {match.imageType === 'leeds1' && (
                        <div className={`${styles.pattern} ${styles.leeds1Pattern}`} />
                      )}
                      {match.imageType === 'leeds2' && (
                        <div className={`${styles.pattern} ${styles.leeds2Pattern}`} />
                      )}
                      {match.imageType === 'leeds3' && (
                        <div className={`${styles.pattern} ${styles.leeds3Pattern}`} />
                      )}
                    </div>

                    {/* Specifications List */}
                    <div className={styles.matchSpecs}>
                      <div className={styles.specRow}>
                        <div className={styles.specLabel}>Location</div>
                        <div className={styles.specVal}>{match.location}</div>
                      </div>
                      
                      <div className={styles.specRow}>
                        <div className={styles.specLabel}>Price Per Month</div>
                        <div className={styles.specVal}>{match.price}</div>
                      </div>

                      <div className={styles.specRow}>
                        <div className={styles.specLabel}>Match Score</div>
                        <div className={styles.specValScore}>{match.score}</div>
                      </div>

                      <div className={styles.specRowColumn}>
                        <div className={styles.specLabel}>
                          Match Insight 
                          <span className={styles.infoTooltip} title="Compliance calculation details">i</span>
                        </div>
                        <div className={styles.specValInsight}>{match.insight}</div>
                      </div>

                      <div className={styles.specRow}>
                        <div className={styles.specLabel}>Status</div>
                        <div className={`${styles.statusBadge} ${match.status === 'Available' ? styles.statusAvail : styles.statusOffer}`}>
                          {match.status}
                        </div>
                      </div>

                      <div className={styles.specRow}>
                        <div className={styles.specLabel}>Lab Type</div>
                        <div className={styles.specValBadge}>{match.labType}</div>
                      </div>

                      <div className={styles.specRow}>
                        <div className={styles.specLabel}>Landlord</div>
                        <div className={styles.specValBadge}>{match.landlord}</div>
                      </div>

                      <div className={styles.specRowColumn}>
                        <div className={styles.specLabel}>Email</div>
                        <a href={`mailto:${match.email}`} className={styles.specEmail}>
                          <svg viewBox="0 0 24 24" width="14" height="14">
                            <path fill="currentColor" d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z"/>
                          </svg>
                          {match.email}
                        </a>
                      </div>
                    </div>

                    <a href={`mailto:${match.email}?subject=LabMatch%20Booking%20Request`} className={styles.bookBtn}>
                      <svg viewBox="0 0 24 24" width="16" height="16">
                        <path fill="currentColor" d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                      </svg>
                      Book Call
                    </a>
                  </div>
                ))}
            </div>
          </div>
        )}
      </main>

      {/* Interactive Onboarding Form Modal */}
      <AnimatePresence>
        {showOnboardingForm && (
          <div className={styles.modalOverlay}>
            <motion.div 
              className={styles.modalCard}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              <div className={styles.modalHeader}>
                <h3 className={styles.modalTitle}>Lab Space Requirements</h3>
                <button 
                  onClick={() => setShowOnboardingForm(false)} 
                  className={styles.closeBtn}
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleOnboardingSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                  <label htmlFor="modalLocation" className={styles.label}>Location Preference</label>
                  <select 
                    id="modalLocation" 
                    value={locationPreference} 
                    onChange={(e) => setLocationPreference(e.target.value)}
                    className={styles.select}
                  >
                    <option value="London">London (Pioneer Suite)</option>
                    <option value="Leeds">Leeds (Nexus Hub)</option>
                  </select>
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="modalLabType" className={styles.label}>Lab Type Required</label>
                  <select 
                    id="modalLabType" 
                    value={labType} 
                    onChange={(e) => setLabType(e.target.value)}
                    className={styles.select}
                  >
                    <option value="Dry Lab">Dry Lab (Tech/Computing/E-phys)</option>
                    <option value="Wet Lab">Wet Lab (Chemical/Biological)</option>
                  </select>
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="modalFunding" className={styles.label}>Funding Stage</label>
                  <select 
                    id="modalFunding" 
                    value={fundingStage} 
                    onChange={(e) => setFundingStage(e.target.value)}
                    className={styles.select}
                  >
                    <option value="Seed">Pre-seed / Seed</option>
                    <option value="Series A">Series A</option>
                    <option value="Series B">Series B</option>
                    <option value="Spin-out">Academic Spin-out</option>
                  </select>
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="modalSize" className={styles.label}>Target Size (sqft)</label>
                  <input 
                    type="number" 
                    id="modalSize" 
                    value={targetSize} 
                    onChange={(e) => setTargetSize(e.target.value)} 
                    placeholder="e.g. 500" 
                    required 
                    className={styles.input}
                  />
                </div>

                <div className={styles.checkboxGroup}>
                  <div className={styles.checkboxLabel}>Containment & Equipment Needs</div>
                  <label className={styles.checkboxItem}>
                    <input 
                      type="checkbox" 
                      checked={pcrRequired} 
                      onChange={(e) => setPcrRequired(e.target.checked)} 
                    />
                    PCR Machine Required
                  </label>
                  <label className={styles.checkboxItem}>
                    <input 
                      type="checkbox" 
                      checked={massSpecRequired} 
                      onChange={(e) => setMassSpecRequired(e.target.checked)} 
                    />
                    Mass Spectrometer Required
                  </label>
                  <label className={styles.checkboxItem}>
                    <input 
                      type="checkbox" 
                      checked={fumeHoodRequired} 
                      onChange={(e) => setFumeHoodRequired(e.target.checked)} 
                    />
                    Fume Hood / Biosafety Cabinet
                  </label>
                </div>

                <button type="submit" className={styles.modalSubmitBtn}>
                  Match My Science
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
