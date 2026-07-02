import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { glowMove } from '../utils/glow';
import styles from './Dashboard.module.css';

// Startup mock matches data
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

// Seed Landlord Listings data
const initialLandlordListings = [
  { id: 'rec5zhxbm', name: 'GOOD EXAMPLE', type: 'Dry Lab', status: 'Available', sqft: 500, landlord: 'Pioneer Group' },
  { id: 'recbDIP80', name: 'GOOD EXAMPLE 2', type: 'Wet Lab', status: 'Available', sqft: 500, landlord: 'Nexus Leeds' },
  { id: 'recc8GUeH', name: 'Demo Lab Space', type: 'Dry Lab', status: 'Let', sqft: 500, landlord: 'Pioneer Group' },
  { id: 'recfK6r7H', name: 'PERFECT LAB', type: 'Dry Lab', status: 'Under Offer', sqft: 1000, landlord: 'Pioneer Group' },
  { id: 'rechlQvjY', name: 'GOOD EXAMPLE 1', type: 'Wet Lab', status: 'Available', sqft: 500, landlord: 'Nexus Leeds' },
  { id: 'recl5FpAm', name: 'BAD EXAMPLE', type: 'Hybrid Lab', status: 'Available', sqft: 300, landlord: 'Nexus Leeds' },
  { id: 'recJgMMmx', name: 'MAKE TEST LAB', type: 'Dry Lab', status: 'Under Offer', sqft: 500, landlord: 'Pioneer Group' },
  { id: 'reckx0ald', name: 'SUNDAY 1st Test', type: 'Dry Lab', status: 'Let', sqft: 500, landlord: 'Pioneer Group' },
  { id: 'recM551gH', name: 'GOOD EXAMPLE 2', type: 'Dry Lab', status: 'Under Offer', sqft: 700, landlord: 'Pioneer Group' },
  { id: 'recTjwBiL', name: 'Wet Lab VH-001', type: 'Wet Lab', status: 'Let', sqft: 700, landlord: 'Pioneer Group' }
];

// Mock Enquiries (calls booked by startups)
const initialEnquiries = [
  { id: 'enq-1', startupName: 'Dr. Sarah Jenkins', company: 'Astra Biosciences', email: 'sarah@astrabio.com', targetLocation: 'London', labType: 'Dry Lab', listingId: 'rec5zhxbm', date: '2026-07-02', status: 'Call Booked' },
  { id: 'enq-2', startupName: 'Liam Carter', company: 'Helix Genomes', email: 'liam@helixgen.io', targetLocation: 'Leeds', labType: 'Wet Lab', listingId: 'rechlQvjY', date: '2026-07-01', status: 'Call Booked' }
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const userMenuRef = useRef(null);

  // Flow states
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const [showOnboardingForm, setShowOnboardingForm] = useState(false);
  const [matchingInProgress, setMatchingInProgress] = useState(false);
  const [matchingProgress, setMatchingProgress] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Startup Onboarding Form values
  const [fundingStage, setFundingStage] = useState('Seed');
  const [targetSize, setTargetSize] = useState('');
  const [locationPreference, setLocationPreference] = useState('London');
  const [labType, setLabType] = useState('Dry Lab');
  const [pcrRequired, setPcrRequired] = useState(false);
  const [massSpecRequired, setMassSpecRequired] = useState(false);
  const [fumeHoodRequired, setFumeHoodRequired] = useState(false);

  // Landlord Flow states
  const [landlordListings, setLandlordListings] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [landlordTab, setLandlordTab] = useState('hub'); // 'hub', 'listings', 'enquiries'
  const [showAddChoice, setShowAddChoice] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);
  const [showUploadLoader, setShowUploadLoader] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showPostAddMenu, setShowPostAddMenu] = useState(false);

  // Search and Filters (Landlord Dashboard)
  const [searchQuery, setSearchQuery] = useState('');
  const [landlordFilter, setLandlordFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Manual Add Form values
  const [newLabName, setNewLabName] = useState('');
  const [newLabType, setNewLabType] = useState('Dry Lab');
  const [newLabStatus, setNewLabStatus] = useState('Available');
  const [newLabSqft, setNewLabSqft] = useState('');

  // Inline edit cells state tracking (contains {rowId, colName})
  const [editingCell, setEditingCell] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('labmatch_user');
    if (!savedUser) {
      navigate('/login');
      return;
    }
    const parsedUser = JSON.parse(savedUser);
    setUser(parsedUser);

    if (parsedUser.role === 'startup') {
      if (parsedUser.onboarding) {
        setOnboardingCompleted(true);
        const specs = parsedUser.onboarding;
        setFundingStage(specs.fundingStage || 'Seed');
        setTargetSize(specs.targetSize || '');
        setLocationPreference(specs.locationPreference || 'London');
        setLabType(specs.labType || 'Dry Lab');
        setPcrRequired(specs.pcrRequired || false);
        setMassSpecRequired(specs.massSpecRequired || false);
        setFumeHoodRequired(specs.fumeHoodRequired || false);
      }
    } else if (parsedUser.role === 'landlord') {
      // Load landlord listings from localstorage or use seeded initial data
      const savedListings = localStorage.getItem('landlord_listings');
      if (savedListings) {
        setLandlordListings(JSON.parse(savedListings));
      } else {
        setLandlordListings(initialLandlordListings);
        localStorage.setItem('landlord_listings', JSON.stringify(initialLandlordListings));
      }

      // Load enquiries
      const savedEnquiries = localStorage.getItem('landlord_enquiries');
      if (savedEnquiries) {
        setEnquiries(JSON.parse(savedEnquiries));
      } else {
        setEnquiries(initialEnquiries);
        localStorage.setItem('landlord_enquiries', JSON.stringify(initialEnquiries));
      }
    }
  }, [navigate]);

  // Click outside to close profile card
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Simulate background matching calculations (Startup)
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

  // Landlord: Upload document simulation
  const handleFileUploadSimulate = (e) => {
    e.preventDefault();
    setShowAddChoice(false);
    setShowUploadLoader(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setShowUploadLoader(false);
            
            // Add a mock parsed listing to the table
            const randomId = 'rec' + Math.random().toString(36).substring(2, 8);
            const newParsedListing = {
              id: randomId,
              name: 'Parsed Lab Suite ' + (landlordListings.length + 1),
              type: 'Wet Lab',
              status: 'Available',
              sqft: 850,
              landlord: user.organisation || 'Pioneer Group'
            };
            
            const updatedListings = [newParsedListing, ...landlordListings];
            setLandlordListings(updatedListings);
            localStorage.setItem('landlord_listings', JSON.stringify(updatedListings));
            
            setShowPostAddMenu(true);
          }, 600);
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  // Landlord: Manual submission
  const handleManualListingSubmit = (e) => {
    e.preventDefault();
    const randomId = 'rec' + Math.random().toString(36).substring(2, 8);
    const newListing = {
      id: randomId,
      name: newLabName || 'Unnamed Facility',
      type: newLabType,
      status: newLabStatus,
      sqft: parseInt(newLabSqft) || 500,
      landlord: user.organisation || 'Pioneer Group'
    };

    const updatedListings = [newListing, ...landlordListings];
    setLandlordListings(updatedListings);
    localStorage.setItem('landlord_listings', JSON.stringify(updatedListings));

    // Clear form inputs
    setNewLabName('');
    setNewLabSqft('');
    
    setShowManualForm(false);
    setShowPostAddMenu(true);
  };

  // Update a cell's value directly inline
  const updateListingCell = (listingId, colName, newValue) => {
    const updated = landlordListings.map(item => {
      if (item.id === listingId) {
        return {
          ...item,
          [colName]: colName === 'sqft' ? parseInt(newValue) || 0 : newValue
        };
      }
      return item;
    });
    setLandlordListings(updated);
    localStorage.setItem('landlord_listings', JSON.stringify(updated));
  };

  const handleLogout = () => {
    localStorage.removeItem('labmatch_user');
    navigate('/');
  };

  if (!user) return <div className={styles.loading}>Verifying credentials...</div>;

  const renderUserPill = () => (
    <button 
      onClick={() => setDropdownOpen(!dropdownOpen)} 
      className={styles.accountCard}
      aria-expanded={dropdownOpen}
    >
      <div className={styles.avatar}>
        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
      </div>
      <span className={styles.accountName}>{user.name}</span>
      <svg 
        viewBox="0 0 24 24" 
        width="14" 
        height="14" 
        className={`${styles.chevron} ${dropdownOpen ? styles.chevronOpen : ''}`}
      >
        <path fill="currentColor" d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
      </svg>
    </button>
  );

  // Filter listings based on controls
  const filteredListings = landlordListings.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.landlord.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesLandlord = landlordFilter === 'All' || item.landlord === landlordFilter;
    const matchesType = typeFilter === 'All' || item.type === typeFilter;
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;

    return matchesSearch && matchesLandlord && matchesType && matchesStatus;
  });

  return (
    <div className={styles.container}>
      {/* Sleek, Modern Glassmorphism Navbar */}
      <nav className={styles.sleekNavbar}>
        <div className={styles.logo}>LabMatch.</div>
        <div className={styles.navActions}>
          <div ref={userMenuRef} className={styles.userMenuWrapper}>
            {renderUserPill()}
            
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div 
                  className={styles.dropdownCard}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                >
                  <div className={styles.dropdownHeader}>
                    <h4>Profile Details</h4>
                    <span className={styles.dropdownRole}>{user.role}</span>
                  </div>
                  <div className={styles.dropdownBody}>
                    <div className={styles.dropdownRow}>
                      <span className={styles.dropdownLabel}>Company</span>
                      <span className={styles.dropdownValue}>{user.organisation}</span>
                    </div>
                    <div className={styles.dropdownRow}>
                      <span className={styles.dropdownLabel}>Email</span>
                      <span className={styles.dropdownValue}>{user.email}</span>
                    </div>
                  </div>
                  <div className={styles.dropdownFooter}>
                    <button onClick={handleLogout} className={styles.logoutBtn}>
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </nav>

      {/* RENDER VIEW ACCORDING TO ROLE */}

      {/* ROLE: STARTUP */}
      {user.role === 'startup' && (
        <main className={styles.mainContent}>
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

              <div className={styles.matchesGrid}>
                {mockMatches
                  .filter(m => m.location.toLowerCase() === locationPreference.toLowerCase())
                  .map((match) => (
                    <div key={match.id} className={`${styles.matchCard} glow`} onMouseMove={glowMove}>
                      <div className={styles.matchVisualHeader}>
                        <span className={styles.matchBadge}>{match.badge}</span>
                        {match.imageType === 'mesh' && <div className={`${styles.pattern} ${styles.meshPattern}`} />}
                        {match.imageType === 'waves' && <div className={`${styles.pattern} ${styles.wavesPattern}`} />}
                        {match.imageType === 'steps' && <div className={`${styles.pattern} ${styles.stepsPattern}`} />}
                        {match.imageType === 'leeds1' && <div className={`${styles.pattern} ${styles.leeds1Pattern}`} />}
                        {match.imageType === 'leeds2' && <div className={`${styles.pattern} ${styles.leeds2Pattern}`} />}
                        {match.imageType === 'leeds3' && <div className={`${styles.pattern} ${styles.leeds3Pattern}`} />}
                      </div>

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
                          <div className={styles.specLabel}>Match Insight <span className={styles.infoTooltip} title="Compliance calculation details">i</span></div>
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
                          <a href={`mailto:${match.email}`} className={styles.specEmail}>{match.email}</a>
                        </div>
                      </div>
                      <a href={`mailto:${match.email}?subject=LabMatch%20Booking`} className={styles.bookBtn}>Book Call</a>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </main>
      )}

      {/* ROLE: LANDLORD */}
      {user.role === 'landlord' && (
        <main className={styles.mainContent}>
          
          {/* LANDLORD STATE 1: HUB VIEW (Dual Liquid Glass Cards) */}
          {landlordTab === 'hub' && (
            <div className={styles.hubWrapper}>
              <h1 className={styles.hubTitle}>Landlord Control Hub</h1>
              <p className={styles.hubSubtitle}>Select a section to manage listings or view booked enquiries</p>
              
              <div className={styles.hubGrid}>
                <button onClick={() => setLandlordTab('listings')} className={`${styles.hubCard} glow`} onMouseMove={glowMove}>
                  <div className={styles.hubCardContent}>
                    <h2>Listings</h2>
                    <p>Manage your facility details, available size capacities, and update statuses inline.</p>
                  </div>
                </button>

                <button onClick={() => setLandlordTab('enquiries')} className={`${styles.hubCard} glow`} onMouseMove={glowMove}>
                  <div className={styles.hubCardContent}>
                    <h2>Enquiries</h2>
                    <p>View science startups that have booked calls to tour your laboratory properties.</p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* LANDLORD STATE 2: LISTINGS VIEW (Table) */}
          {landlordTab === 'listings' && (
            <div className={styles.listingsViewWrapper}>
              <div className={styles.viewHeader}>
                <button onClick={() => setLandlordTab('hub')} className={styles.backBtn}>
                  &larr; Back to Hub
                </button>
                <h1 className={styles.viewTitle}>Manage Lab Listings</h1>
              </div>

              {/* Top Search bar, Filters and Add Listing pill */}
              <div className={styles.landlordFilterBar}>
                <div className={styles.searchAndFilters}>
                  <div className={styles.searchContainer}>
                    <svg viewBox="0 0 24 24" width="16" height="16" className={styles.searchIcon}>
                      <path fill="currentColor" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                    </svg>
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search listings..." 
                      className={styles.searchInput}
                    />
                  </div>

                  <div className={styles.dropdownFilters}>
                    <select 
                      value={landlordFilter} 
                      onChange={(e) => setLandlordFilter(e.target.value)}
                      className={styles.filterSelect}
                    >
                      <option value="All">Landlord: All</option>
                      <option value="Pioneer Group">Pioneer Group</option>
                      <option value="Nexus Leeds">Nexus Leeds</option>
                    </select>

                    <select 
                      value={typeFilter} 
                      onChange={(e) => setTypeFilter(e.target.value)}
                      className={styles.filterSelect}
                    >
                      <option value="All">Listing Type: All</option>
                      <option value="Dry Lab">Dry Lab</option>
                      <option value="Wet Lab">Wet Lab</option>
                      <option value="Hybrid Lab">Hybrid Lab</option>
                    </select>

                    <select 
                      value={statusFilter} 
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className={styles.filterSelect}
                    >
                      <option value="All">Status: All</option>
                      <option value="Available">Available</option>
                      <option value="Under Offer">Under Offer</option>
                      <option value="Let">Let</option>
                    </select>
                  </div>
                </div>

                <button onClick={() => setShowAddChoice(true)} className={styles.primaryPill}>
                  Add listing
                </button>
              </div>

              {/* Apple-Style Liquid Glass Table */}
              <div className={styles.tableWrapper}>
                <table className={styles.glassTable}>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Listing ID</th>
                      <th>Listing Type</th>
                      <th>Status</th>
                      <th># Sqft</th>
                      <th>Landlord</th>
                      <th>Floorplan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredListings.map((listing) => (
                      <tr key={listing.id}>
                        {/* Inline Editable cell: Name */}
                        <td 
                          onClick={() => setEditingCell({ id: listing.id, col: 'name' })}
                          className={styles.editableCell}
                        >
                          {editingCell?.id === listing.id && editingCell?.col === 'name' ? (
                            <input 
                              type="text" 
                              defaultValue={listing.name}
                              onBlur={(e) => {
                                updateListingCell(listing.id, 'name', e.target.value);
                                setEditingCell(null);
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  updateListingCell(listing.id, 'name', e.target.value);
                                  setEditingCell(null);
                                }
                              }}
                              autoFocus
                              className={styles.inlineInput}
                            />
                          ) : (
                            listing.name
                          )}
                        </td>

                        <td><span className={styles.listingIdCode}>{listing.id}</span></td>

                        {/* Inline Editable cell: Listing Type */}
                        <td 
                          onClick={() => setEditingCell({ id: listing.id, col: 'type' })}
                          className={styles.editableCell}
                        >
                          {editingCell?.id === listing.id && editingCell?.col === 'type' ? (
                            <select 
                              defaultValue={listing.type}
                              onBlur={(e) => {
                                updateListingCell(listing.id, 'type', e.target.value);
                                setEditingCell(null);
                              }}
                              onChange={(e) => {
                                updateListingCell(listing.id, 'type', e.target.value);
                                setEditingCell(null);
                              }}
                              autoFocus
                              className={styles.inlineSelect}
                            >
                              <option value="Dry Lab">Dry Lab</option>
                              <option value="Wet Lab">Wet Lab</option>
                              <option value="Hybrid Lab">Hybrid Lab</option>
                            </select>
                          ) : (
                            <span className={styles.typeBadge}>{listing.type}</span>
                          )}
                        </td>

                        {/* Inline Editable cell: Status */}
                        <td 
                          onClick={() => setEditingCell({ id: listing.id, col: 'status' })}
                          className={styles.editableCell}
                        >
                          {editingCell?.id === listing.id && editingCell?.col === 'status' ? (
                            <select 
                              defaultValue={listing.status}
                              onBlur={(e) => {
                                updateListingCell(listing.id, 'status', e.target.value);
                                setEditingCell(null);
                              }}
                              onChange={(e) => {
                                updateListingCell(listing.id, 'status', e.target.value);
                                setEditingCell(null);
                              }}
                              autoFocus
                              className={styles.inlineSelect}
                            >
                              <option value="Available">Available</option>
                              <option value="Under Offer">Under Offer</option>
                              <option value="Let">Let</option>
                            </select>
                          ) : (
                            <span className={`${styles.statusLabel} ${
                              listing.status === 'Available' ? styles.statusAvail : 
                              listing.status === 'Under Offer' ? styles.statusOffer : 
                              styles.statusLet
                            }`}>
                              {listing.status}
                            </span>
                          )}
                        </td>

                        {/* Inline Editable cell: Sqft */}
                        <td 
                          onClick={() => setEditingCell({ id: listing.id, col: 'sqft' })}
                          className={styles.editableCell}
                        >
                          {editingCell?.id === listing.id && editingCell?.col === 'sqft' ? (
                            <input 
                              type="number" 
                              defaultValue={listing.sqft}
                              onBlur={(e) => {
                                updateListingCell(listing.id, 'sqft', e.target.value);
                                setEditingCell(null);
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  updateListingCell(listing.id, 'sqft', e.target.value);
                                  setEditingCell(null);
                                }
                              }}
                              autoFocus
                              className={styles.inlineInput}
                            />
                          ) : (
                            listing.sqft.toLocaleString()
                          )}
                        </td>

                        <td><span className={styles.landlordBadge}>{listing.landlord}</span></td>

                        {/* Floorplan Upload Action Button */}
                        <td>
                          <button 
                            onClick={(e) => { e.stopPropagation(); alert('Floorplan upload dialogue incoming.'); }}
                            className={styles.uploadFloorplanPill}
                          >
                            <svg viewBox="0 0 24 24" width="12" height="12">
                              <path fill="currentColor" d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/>
                            </svg>
                            Upload
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* LANDLORD STATE 3: ENQUIRIES VIEW */}
          {landlordTab === 'enquiries' && (
            <div className={styles.listingsViewWrapper}>
              <div className={styles.viewHeader}>
                <button onClick={() => setLandlordTab('hub')} className={styles.backBtn}>
                  &larr; Back to Hub
                </button>
                <h1 className={styles.viewTitle}>Booked Call Enquiries</h1>
              </div>

              {/* Apple-Style Enquiries Table */}
              <div className={styles.tableWrapper}>
                <table className={styles.glassTable}>
                  <thead>
                    <tr>
                      <th>Startup Contact</th>
                      <th>Company</th>
                      <th>Email</th>
                      <th>Target Location</th>
                      <th>Lab Type Needed</th>
                      <th>Listing ID</th>
                      <th>Date Booked</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enquiries.map((enq) => (
                      <tr key={enq.id}>
                        <td><span className={styles.accountName}>{enq.startupName}</span></td>
                        <td><span className={styles.landlordBadge}>{enq.company}</span></td>
                        <td><a href={`mailto:${enq.email}`} className={styles.specEmail}>{enq.email}</a></td>
                        <td><span className={styles.typeBadge}>{enq.targetLocation}</span></td>
                        <td><span className={styles.typeBadge}>{enq.labType}</span></td>
                        <td><span className={styles.listingIdCode}>{enq.listingId}</span></td>
                        <td>{enq.date}</td>
                        <td>
                          <span className={`${styles.statusLabel} ${styles.statusAvail}`}>
                            {enq.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      )}

      {/* STARTUP ONBOARDING MODAL */}
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
                <button onClick={() => setShowOnboardingForm(false)} className={styles.closeBtn}>&times;</button>
              </div>

              <form onSubmit={handleOnboardingSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                  <label htmlFor="modalLocation" className={styles.label}>Location Preference</label>
                  <select id="modalLocation" value={locationPreference} onChange={(e) => setLocationPreference(e.target.value)} className={styles.select}>
                    <option value="London">London (Pioneer Suite)</option>
                    <option value="Leeds">Leeds (Nexus Hub)</option>
                  </select>
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="modalLabType" className={styles.label}>Lab Type Required</label>
                  <select id="modalLabType" value={labType} onChange={(e) => setLabType(e.target.value)} className={styles.select}>
                    <option value="Dry Lab">Dry Lab (Tech/Computing/E-phys)</option>
                    <option value="Wet Lab">Wet Lab (Chemical/Biological)</option>
                  </select>
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="modalFunding" className={styles.label}>Funding Stage</label>
                  <select id="modalFunding" value={fundingStage} onChange={(e) => setFundingStage(e.target.value)} className={styles.select}>
                    <option value="Seed">Pre-seed / Seed</option>
                    <option value="Series A">Series A</option>
                    <option value="Series B">Series B</option>
                    <option value="Spin-out">Academic Spin-out</option>
                  </select>
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="modalSize" className={styles.label}>Target Size (sqft)</label>
                  <input type="number" id="modalSize" value={targetSize} onChange={(e) => setTargetSize(e.target.value)} placeholder="e.g. 500" required className={styles.input} />
                </div>
                <div className={styles.checkboxGroup}>
                  <div className={styles.checkboxLabel}>Containment & Equipment Needs</div>
                  <label className={styles.checkboxItem}><input type="checkbox" checked={pcrRequired} onChange={(e) => setPcrRequired(e.target.checked)} />PCR Machine Required</label>
                  <label className={styles.checkboxItem}><input type="checkbox" checked={massSpecRequired} onChange={(e) => setMassSpecRequired(e.target.checked)} />Mass Spectrometer Required</label>
                  <label className={styles.checkboxItem}><input type="checkbox" checked={fumeHoodRequired} onChange={(e) => setFumeHoodRequired(e.target.checked)} />Fume Hood / Biosafety Cabinet</label>
                </div>
                <button type="submit" className={styles.modalSubmitBtn}>Match My Science</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* LANDLORD: ADD RECORD CHOICE MODAL */}
      <AnimatePresence>
        {showAddChoice && (
          <div className={styles.modalOverlay}>
            <motion.div 
              className={styles.modalCardChoice}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className={styles.modalHeader}>
                <h3 className={styles.modalTitle}>Add New Listing</h3>
                <button onClick={() => setShowAddChoice(false)} className={styles.closeBtn}>&times;</button>
              </div>
              
              <div className={styles.choiceButtons}>
                <div className={styles.uploadBtnWrapper}>
                  <button onClick={handleFileUploadSimulate} className={styles.choiceBtn}>
                    Upload Document
                  </button>
                  <div className={styles.infoIconWrapper}>
                    <span className={styles.infoIcon}>i</span>
                    <span className={styles.tooltipText}>
                      Upload any file containing your available lab data, we will parse it and pre-populate your listing fields automatically.
                    </span>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    setShowAddChoice(false);
                    setShowManualForm(true);
                  }} 
                  className={styles.choiceBtn}
                >
                  Manually Add Listing
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* LANDLORD: UPLOAD PARSE PROGRESS LOADER */}
      <AnimatePresence>
        {showUploadLoader && (
          <div className={styles.modalOverlay}>
            <motion.div className={styles.modalCardUpload} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className={styles.loaderSpinner}>
                <svg className={styles.spinnerSvg} viewBox="0 0 100 100">
                  <circle className={styles.spinnerTrack} cx="50" cy="50" r="45" />
                  <circle 
                    className={styles.spinnerFill} 
                    cx="50" 
                    cy="50" 
                    r="45" 
                    strokeDasharray="283"
                    strokeDashoffset={283 - (283 * uploadProgress) / 100}
                  />
                </svg>
                <div className={styles.progressText}>{uploadProgress}%</div>
              </div>
              <h2>Parsing lab specifications...</h2>
              <p>Analyzing floor layouts, equipment models, and space capacities.</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* LANDLORD: MANUAL ADD FORM MODAL */}
      <AnimatePresence>
        {showManualForm && (
          <div className={styles.modalOverlay}>
            <motion.div 
              className={styles.modalCardManual}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
            >
              <div className={styles.modalHeader}>
                <h3 className={styles.modalTitle}>Enter Listing Specifications</h3>
                <button onClick={() => setShowManualForm(false)} className={styles.closeBtn}>&times;</button>
              </div>

              <form onSubmit={handleManualListingSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                  <label htmlFor="manualName" className={styles.label}>Lab Name / Title</label>
                  <input 
                    type="text" 
                    id="manualName" 
                    value={newLabName} 
                    onChange={(e) => setNewLabName(e.target.value)} 
                    placeholder="e.g. Wet Lab VH-001" 
                    required 
                    className={styles.input} 
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="manualType" className={styles.label}>Listing Type</label>
                  <select 
                    id="manualType" 
                    value={newLabType} 
                    onChange={(e) => setNewLabType(e.target.value)} 
                    className={styles.select}
                  >
                    <option value="Dry Lab">Dry Lab</option>
                    <option value="Wet Lab">Wet Lab</option>
                    <option value="Hybrid Lab">Hybrid Lab</option>
                  </select>
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="manualStatus" className={styles.label}>Status</label>
                  <select 
                    id="manualStatus" 
                    value={newLabStatus} 
                    onChange={(e) => setNewLabStatus(e.target.value)} 
                    className={styles.select}
                  >
                    <option value="Available">Available</option>
                    <option value="Under Offer">Under Offer</option>
                    <option value="Let">Let</option>
                  </select>
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="manualSqft" className={styles.label}>Available Size (sqft)</label>
                  <input 
                    type="number" 
                    id="manualSqft" 
                    value={newLabSqft} 
                    onChange={(e) => setNewLabSqft(e.target.value)} 
                    placeholder="e.g. 500" 
                    required 
                    className={styles.input} 
                  />
                </div>

                <button type="submit" className={styles.modalSubmitBtn}>
                  Add Listing
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* LANDLORD: POST-ADD MENU OVERLAY */}
      <AnimatePresence>
        {showPostAddMenu && (
          <div className={styles.modalOverlay}>
            <motion.div className={styles.modalCardChoice} initial={{ opacity: 0, scale: 0.95 }}>
              <h3 className={styles.modalTitle} style={{ marginBottom: '16px', textAlign: 'center' }}>Listing Added Successfully!</h3>
              <div className={styles.postAddActions}>
                <button 
                  onClick={() => {
                    setShowPostAddMenu(false);
                    setShowAddChoice(true);
                  }}
                  className={styles.choiceBtn}
                >
                  Add Another Listing
                </button>
                <button 
                  onClick={() => setShowPostAddMenu(false)}
                  className={styles.primaryPill}
                >
                  Close & View Table
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
