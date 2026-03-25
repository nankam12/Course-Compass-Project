import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import CourseCard from '../components/CourseCard';

export default function Courses() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const search = searchParams.get('search') || '';
  const department = searchParams.get('department') || '';
  const page = parseInt(searchParams.get('page') || '1');

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = { page, limit: 12 };
      if (search) params.search = search;
      if (department) params.department = department;

      const { data } = await api.get('/courses', { params });
      setCourses(data.courses);
      setTotal(data.total);
      setPages(data.pages);
    } catch {
      setError('Failed to load courses. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [search, department, page]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  useEffect(() => {
    api.get('/courses/departments').then(({ data }) => setDepartments(data.departments));
  }, []);

  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    if (key !== 'page') next.delete('page');
    setSearchParams(next);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const val = e.target.elements.search.value.trim();
    setParam('search', val);
  };

  return (
    <div className="courses-page">
      <div className="container">
        {/* Page header */}
        <div className="page-header">
          <h1 className="page-title">Browse Courses</h1>
          <p className="page-subtitle">
            {total > 0 ? `${total} course${total !== 1 ? 's' : ''} available` : 'Search for a course to get started'}
          </p>
        </div>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-wrap">
            <span className="search-icon">🔍</span>
            <input
              name="search"
              type="search"
              defaultValue={search}
              key={search}
              className="search-input"
              placeholder="Search by course name, code, or keyword…"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Search
          </button>
          {search && (
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setParam('search', '')}
            >
              Clear
            </button>
          )}
        </form>

        {/* Department filters */}
        {departments.length > 0 && (
          <div className="filter-bar">
            <button
              className={`filter-chip ${!department ? 'filter-chip--active' : ''}`}
              onClick={() => setParam('department', '')}
            >
              All Departments
            </button>
            {departments.map((d) => (
              <button
                key={d}
                className={`filter-chip ${department === d ? 'filter-chip--active' : ''}`}
                onClick={() => setParam('department', d)}
              >
                {d}
              </button>
            ))}
          </div>
        )}

        {/* Results */}
        {loading ? (
          <div className="loading-state">
            <div className="spinner spinner--lg" />
            <p>Loading courses…</p>
          </div>
        ) : error ? (
          <div className="alert alert-error">{error}</div>
        ) : courses.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📭</span>
            <h3>No courses found</h3>
            <p>Try a different search term or department filter.</p>
          </div>
        ) : (
          <>
            <div className="courses-grid">
              {courses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>

            {/* Pagination */}
            {pages > 1 && (
              <div className="pagination">
                <button
                  className="btn btn-ghost"
                  disabled={page <= 1}
                  onClick={() => setParam('page', String(page - 1))}
                >
                  ← Previous
                </button>
                <span className="pagination-info">
                  Page {page} of {pages}
                </span>
                <button
                  className="btn btn-ghost"
                  disabled={page >= pages}
                  onClick={() => setParam('page', String(page + 1))}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
