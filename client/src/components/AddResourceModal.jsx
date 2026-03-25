import { useState } from 'react';
import api from '../services/api';

const RESOURCE_TYPES = [
  { value: 'video', label: '🎥 Video' },
  { value: 'notes', label: '📝 Notes' },
  { value: 'textbook', label: '📚 Textbook' },
  { value: 'website', label: '🌐 Website' },
  { value: 'practice_problems', label: '💡 Practice Problems' },
  { value: 'other', label: '📎 Other' },
];

export default function AddResourceModal({ courseId, onClose, onSuccess }) {
  const [form, setForm] = useState({
    title: '',
    type: 'website',
    url: '',
    description: '',
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    setServerError('');
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    else if (form.title.length > 200) errs.title = 'Title cannot exceed 200 characters';

    if (!form.type) errs.type = 'Please select a resource type';

    if (form.url.trim()) {
      try {
        const u = new URL(form.url.trim());
        if (!['http:', 'https:'].includes(u.protocol)) {
          errs.url = 'URL must start with http:// or https://';
        }
      } catch {
        errs.url = 'Please enter a valid URL (e.g. https://example.com)';
      }
    }

    if (form.description.length > 500) errs.description = 'Description cannot exceed 500 characters';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    const fieldErrors = validate();
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title: form.title.trim(),
        type: form.type,
        description: form.description.trim() || undefined,
        url: form.url.trim() || undefined,
      };
      const { data } = await api.post(`/courses/${courseId}/resources`, payload);
      onSuccess(data.resource);
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.errors?.[0]?.msg ||
        'Failed to add resource. Please try again.';
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal-header">
          <h2 id="modal-title" className="modal-title">Add a Resource</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        {serverError && (
          <div className="alert alert-error" role="alert">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="modal-form" noValidate>
          <div className="form-group">
            <label htmlFor="res-type" className="form-label">
              Resource Type <span className="required">*</span>
            </label>
            <select
              id="res-type"
              name="type"
              value={form.type}
              onChange={handleChange}
              className={`form-input form-select ${errors.type ? 'form-input--error' : ''}`}
            >
              {RESOURCE_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            {errors.type && <p className="form-error">{errors.type}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="res-title" className="form-label">
              Title <span className="required">*</span>
            </label>
            <input
              id="res-title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              className={`form-input ${errors.title ? 'form-input--error' : ''}`}
              placeholder="e.g. MIT OpenCourseWare Lecture Notes"
              maxLength={200}
            />
            {errors.title && <p className="form-error">{errors.title}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="res-url" className="form-label">
              URL{' '}
              <span className="form-label-hint">(optional — link to access this resource)</span>
            </label>
            <input
              id="res-url"
              name="url"
              type="url"
              value={form.url}
              onChange={handleChange}
              className={`form-input ${errors.url ? 'form-input--error' : ''}`}
              placeholder="https://example.com/resource"
            />
            {errors.url && <p className="form-error">{errors.url}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="res-desc" className="form-label">
              Description{' '}
              <span className="form-label-hint">(optional — why is this helpful?)</span>
            </label>
            <textarea
              id="res-desc"
              name="description"
              value={form.description}
              onChange={handleChange}
              className={`form-input form-textarea ${errors.description ? 'form-input--error' : ''}`}
              placeholder="A brief description of what this resource covers and why it's useful…"
              rows={3}
              maxLength={500}
            />
            <p className="form-char-count">{form.description.length}/500</p>
            {errors.description && <p className="form-error">{errors.description}</p>}
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <span className="spinner" /> : 'Submit Resource'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
