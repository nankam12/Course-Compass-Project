import { Link } from 'react-router-dom';

const DEPT_COLORS = {
  'Computer Science': '#3b82f6',
  Mathematics: '#8b5cf6',
  Physics: '#06b6d4',
  Psychology: '#ec4899',
  English: '#f59e0b',
  Business: '#10b981',
};

export default function CourseCard({ course }) {
  const deptColor = DEPT_COLORS[course.department] || '#6b7280';

  return (
    <Link to={`/courses/${course._id}`} className="course-card" style={{ '--dept-color': deptColor }}>
      <div className="course-card-accent" />
      <div className="course-card-body">
        <div className="course-card-meta">
          <span className="course-card-code">{course.code}</span>
          <span className="course-card-credits">{course.credits} cr.</span>
        </div>
        <h3 className="course-card-name">{course.name}</h3>
        <span className="course-card-dept">{course.department}</span>
        {course.description && (
          <p className="course-card-desc">{course.description}</p>
        )}
      </div>
      <div className="course-card-footer">
        {course.professor?.name && (
          <span className="course-card-professor">👩‍🏫 {course.professor.name}</span>
        )}
        {course.semester && <span className="course-card-semester">{course.semester}</span>}
      </div>
    </Link>
  );
}
