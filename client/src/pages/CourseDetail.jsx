import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import ResourceCard from '../components/ResourceCard';
import AddResourceModal from '../components/AddResourceModal';
import CommentSection from '../components/CommentSection';

const TYPE_FILTERS = [
  { value: '', label: 'All' },
  { value: 'video', label: '🎥 Videos' },
  { value: 'notes', label: '📝 Notes' },
  { value: 'textbook', label: '📚 Textbooks' },
  { value: 'website', label: '🌐 Websites' },
  { value: 'practice_problems', label: '💡 Practice' },
  { value: 'other', label: '📎 Other' },
];

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [resources, setResources] = useState([]);
  const [courseLoading, setCourseLoading] = useState(true);
  const [resourcesLoading, setResourcesLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [typeFilter, setTypeFilter] = useState('');

  const fetchCourse = useCallback(async () => {
    try {
      const { data } = await api.get(`/courses/${id}`);
      setCourse(data.course);
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Course not found.');
      } else {
        setError('Failed to load course details.');
      }
    } finally {
      setCourseLoading(false);
    }
  }, [id]);

  const fetchResources = useCallback(async () => {
    setResourcesLoading(true);
    try {
      const { data } = await api.get(`/courses/${id}/resources`);
      setResources(data.resources);
    } catch {
      // Non-fatal — just show empty state
    } finally {
      setResourcesLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCourse();
    fetchResources();
  }, [fetchCourse, fetchResources]);

  const handleVote = async (resourceId) => {
    if (!user) {
      navigate('/login', { state: { from: `/courses/${id}` } });
      return;
    }
    try {
      const { data } = await api.post(`/resources/${resourceId}/vote`);
      setResources((prev) =>
        prev
          .map((r) =>
            r._id === resourceId
              ? { ...r, votes: data.hasVoted ? [...r.votes, user.id] : r.votes.filter((v) => v !== user.id), _voteCount: data.voteCount }
              : r
          )
          .sort((a, b) => {
            const av = a._voteCount !== undefined ? a._voteCount : a.votes.length;
            const bv = b._voteCount !== undefined ? b._voteCount : b.votes.length;
            return bv - av;
          })
      );
    } catch {
      // Silently fail — let the user retry
    }
  };

  const handleDelete = async (resourceId) => {
    if (!window.confirm('Delete this resource?')) return;
    try {
      await api.delete(`/resources/${resourceId}`);
      setResources((prev) => prev.filter((r) => r._id !== resourceId));
    } catch {
      alert('Failed to delete resource.');
    }
  };

  const handleResourceAdded = (newResource) => {
    setResources((prev) => [newResource, ...prev]);
    setShowModal(false);
  };

  if (courseLoading) {
    return (
      <div className="loading-state container">
        <div className="spinner spinner--lg" />
        <p>Loading course…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ padding: '3rem 1rem' }}>
        <div className="alert alert-error">{error}</div>
      </div>
    );
  }

  const { professor, teachingAssistants } = course;

  const filteredResources = typeFilter
    ? resources.filter((r) => r.type === typeFilter)
    : resources;

  const voteCount = (r) => (r._voteCount !== undefined ? r._voteCount : r.votes.length);
  const hasVoted = (r) => r.votes.some((v) => v === user?.id || v?._id === user?.id);

  return (
    <div className="course-detail-page">
      <div className="container">
        {/* ── Course Header ──────────────────────────────────────── */}
        <div className="course-header">
          <div className="course-header-meta">
            <span className="course-code-badge">{course.code}</span>
            <span className="course-dept-badge">{course.department}</span>
            {course.credits && (
              <span className="course-credits-badge">{course.credits} credits</span>
            )}
          </div>
          <h1 className="course-title">{course.name}</h1>
          {course.semester && <p className="course-semester">{course.semester}</p>}
          {course.description && <p className="course-description">{course.description}</p>}
        </div>

        {/* ── Info Cards Row ─────────────────────────────────────── */}
        <div className="info-cards-row">
          {/* Professor card */}
          {professor?.name && (
            <div className="info-card">
              <h3 className="info-card-title">
                <span>👩‍🏫</span> Professor
              </h3>
              <p className="info-name">{professor.name}</p>
              {professor.email && (
                <a href={`mailto:${professor.email}`} className="info-email">
                  {professor.email}
                </a>
              )}
              {professor.officeHours && (
                <p className="info-detail">
                  <strong>Office Hours:</strong> {professor.officeHours}
                </p>
              )}
              {professor.officeLocation && (
                <p className="info-detail">
                  <strong>Location:</strong> {professor.officeLocation}
                </p>
              )}
            </div>
          )}

          {/* Teaching Assistants card */}
          {teachingAssistants?.length > 0 && (
            <div className="info-card">
              <h3 className="info-card-title">
                <span>🧑‍💻</span> Teaching Assistants
              </h3>
              {teachingAssistants.map((ta, i) => (
                <div key={i} className="ta-item">
                  <p className="info-name">{ta.name}</p>
                  {ta.email && (
                    <a href={`mailto:${ta.email}`} className="info-email">
                      {ta.email}
                    </a>
                  )}
                  {ta.officeHours && (
                    <p className="info-detail">
                      <strong>Hours:</strong> {ta.officeHours}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Resources Section ──────────────────────────────────── */}
        <section className="resources-section">
          <div className="section-header">
            <div>
              <h2 className="section-heading">Study Resources</h2>
              <p className="section-subheading">
                {resources.length} resource{resources.length !== 1 ? 's' : ''} shared by students
              </p>
            </div>
            {user ? (
              <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                + Add Resource
              </button>
            ) : (
              <button
                className="btn btn-outline"
                onClick={() => navigate('/login', { state: { from: `/courses/${id}` } })}
              >
                Sign in to add
              </button>
            )}
          </div>

          {/* Type filter tabs */}
          <div className="type-filter-bar">
            {TYPE_FILTERS.map((f) => (
              <button
                key={f.value}
                className={`filter-chip ${typeFilter === f.value ? 'filter-chip--active' : ''}`}
                onClick={() => setTypeFilter(f.value)}
              >
                {f.label}
              </button>
            ))}
          </div>

          {resourcesLoading ? (
            <div className="loading-state">
              <div className="spinner" />
            </div>
          ) : filteredResources.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">🗂️</span>
              <h3>{typeFilter ? 'No resources of this type yet' : 'No resources yet'}</h3>
              {user ? (
                <p>
                  Be the first to{' '}
                  <button className="link-btn" onClick={() => setShowModal(true)}>
                    add a resource
                  </button>{' '}
                  for this course!
                </p>
              ) : (
                <p>Sign in to be the first to add a resource!</p>
              )}
            </div>
          ) : (
            <div className="resources-list">
              {filteredResources.map((resource) => (
                <ResourceCard
                  key={resource._id}
                  resource={resource}
                  voteCount={voteCount(resource)}
                  hasVoted={hasVoted(resource)}
                  currentUserId={user?.id}
                  onVote={() => handleVote(resource._id)}
                  onDelete={() => handleDelete(resource._id)}
                />
              ))}
            </div>
          )}
        </section>

        {/* ── Comments Section ───────────────────────────────────── */}
        <CommentSection courseId={id} />
      </div>

      {/* Add Resource Modal */}
      {showModal && (
        <AddResourceModal
          courseId={id}
          onClose={() => setShowModal(false)}
          onSuccess={handleResourceAdded}
        />
      )}
    </div>
  );
}
