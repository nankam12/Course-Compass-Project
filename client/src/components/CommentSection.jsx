import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export default function CommentSection({ courseId }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [fieldError, setFieldError] = useState('');

  const fetchComments = useCallback(async () => {
    try {
      const { data } = await api.get(`/courses/${courseId}/comments`);
      setComments(data.comments);
    } catch {
      //  Non-fatal
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const trimmed = content.trim();
    if (!trimmed) {
      setFieldError('Please enter a comment before submitting.');
      return;
    }
    if (trimmed.length > 1000) {
      setFieldError('Comment cannot exceed 1000 characters.');
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await api.post(`/courses/${courseId}/comments`, { content: trimmed });
      setComments((prev) => [data.comment, ...prev]);
      setContent('');
      setFieldError('');
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.errors?.[0]?.msg ||
        'Failed to post comment.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await api.delete(`/comments/${commentId}`);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch {
      alert('Failed to delete comment.');
    }
  };

  return (
    <section className="comment-section">
      <h2 className="section-heading">
        Student Tips &amp; Advice
        {comments.length > 0 && (
          <span className="comment-count">{comments.length}</span>
        )}
      </h2>
      <p className="section-subheading">
        Share advice to help others prepare for exams, assignments, and the course overall.
      </p>

      {/* Add comment form */}
      {user ? (
        <form onSubmit={handleSubmit} className="comment-form">
          {error && (
            <div className="alert alert-error" role="alert">
              {error}
            </div>
          )}
          <textarea
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setFieldError('');
            }}
            className={`form-input form-textarea ${fieldError ? 'form-input--error' : ''}`}
            placeholder="e.g. Start the assignments early — the last one is much harder than it looks. Office hours with Dr. Smith are really helpful too."
            rows={3}
            maxLength={1000}
          />
          {fieldError && <p className="form-error">{fieldError}</p>}
          <div className="comment-form-footer">
            <span className="form-char-count">{content.length}/1000</span>
            <button type="submit" className="btn btn-primary btn-sm" disabled={submitting}>
              {submitting ? <span className="spinner" /> : 'Post Tip'}
            </button>
          </div>
        </form>
      ) : (
        <div className="comment-signin-prompt">
          <p>
            <button
              className="link-btn"
              onClick={() => navigate('/login', { state: { from: `/courses/${courseId}` } })}
            >
              Sign in
            </button>{' '}
            to share tips and advice with other students.
          </p>
        </div>
      )}

      {/* Comments list */}
      {loading ? (
        <div className="loading-state">
          <div className="spinner" />
        </div>
      ) : comments.length === 0 ? (
        <div className="empty-state empty-state--sm">
          <span className="empty-icon">💬</span>
          <p>No tips yet — be the first to leave advice for this course!</p>
        </div>
      ) : (
        <div className="comments-list">
          {comments.map((comment) => (
            <div key={comment._id} className="comment-item">
              <div className="comment-header">
                <span className="comment-author">
                  👤 {comment.author?.username || 'Unknown'}
                </span>
                <span className="comment-time">{timeAgo(comment.createdAt)}</span>
                {user && comment.author?._id === user.id && (
                  <button
                    className="delete-btn delete-btn--sm"
                    onClick={() => handleDelete(comment._id)}
                    aria-label="Delete comment"
                    title="Delete this comment"
                  >
                    🗑️
                  </button>
                )}
              </div>
              <p className="comment-content">{comment.content}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
