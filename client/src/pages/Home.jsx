import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const features = [
  {
    icon: '🔍',
    title: 'Search Courses',
    description:
      'Browse every course offered at your university and filter by department to find exactly what you need.',
  },
  {
    icon: '📚',
    title: 'Share Resources',
    description:
      'Contribute videos, notes, textbooks, practice problems, and helpful websites for any course.',
  },
  {
    icon: '👍',
    title: 'Vote for Quality',
    description:
      'Upvote the most helpful resources so the best materials always rise to the top of the list.',
  },
  {
    icon: '💬',
    title: 'Student Tips',
    description:
      'Leave course advice and read what other students recommend to better prepare for exams.',
  },
  {
    icon: '👩‍🏫',
    title: 'Professor Info',
    description:
      'Quickly find professor contact details, office hours, and teaching assistant information.',
  },
  {
    icon: '🎓',
    title: 'Built for Students',
    description:
      'A community-driven platform that makes academic support resources accessible to everyone.',
  },
];

const stats = [
  { value: '15+', label: 'Courses Available' },
  { value: '6', label: 'Departments' },
  { value: '100%', label: 'Student Driven' },
];

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero">
        <div className="hero-content container">
          <span className="hero-eyebrow">Course Resource Hub</span>
          <h1 className="hero-title">
            Find Every Resource You Need to <span className="hero-highlight">Succeed</span>
          </h1>
          <p className="hero-subtitle">
            A central hub where university students discover academic support materials, connect with
            professor information, and share the resources that helped them most.
          </p>
          <div className="hero-actions">
            <Link to="/courses" className="btn btn-primary btn-lg">
              Browse Courses
            </Link>
            {!user && (
              <Link to="/register" className="btn btn-outline btn-lg">
                Sign Up Free
              </Link>
            )}
          </div>
        </div>
        <div className="hero-wave">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0 40 C360 80 1080 0 1440 40 L1440 80 L0 80 Z" fill="var(--bg)" />
          </svg>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-section container">
        {stats.map((s) => (
          <div key={s.label} className="stat-card">
            <span className="stat-value">{s.value}</span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </section>

      {/* Features */}
      <section className="features-section container">
        <h2 className="section-title">Everything You Need in One Place</h2>
        <p className="section-subtitle">
          Stop digging through course pages and group chats. Course Resource Hub puts every study
          tool right at your fingertips.
        </p>
        <div className="features-grid">
          {features.map((f) => (
            <div key={f.title} className="feature-card">
              <span className="feature-icon">{f.icon}</span>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-section">
        <div className="container">
          <h2 className="cta-title">Ready to help your classmates?</h2>
          <p className="cta-subtitle">
            Share the resources that made a difference in your courses and earn upvotes from grateful
            students.
          </p>
          {user ? (
            <Link to="/courses" className="btn btn-accent btn-lg">
              Browse Courses →
            </Link>
          ) : (
            <Link to="/register" className="btn btn-accent btn-lg">
              Create Your Free Account
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
