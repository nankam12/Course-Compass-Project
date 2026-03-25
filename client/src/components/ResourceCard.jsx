const TYPE_META = {
  video: { icon: '🎥', label: 'Video' },
  notes: { icon: '📝', label: 'Notes' },
  textbook: { icon: '📚', label: 'Textbook' },
  website: { icon: '🌐', label: 'Website' },
  practice_problems: { icon: '💡', label: 'Practice' },
  other: { icon: '📎', label: 'Other' },
};

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

export default function ResourceCard({ resource, voteCount, hasVoted, currentUserId, onVote, onDelete }) {
  const meta = TYPE_META[resource.type] || TYPE_META.other;
  const isOwner = currentUserId && resource.submittedBy?._id === currentUserId;

  return (
    <div className={`resource-card ${hasVoted ? 'resource-card--voted' : ''}`}>
      {/* Vote column */}
      <div className="resource-vote">
        <button
          className={`vote-btn ${hasVoted ? 'vote-btn--active' : ''}`}
          onClick={onVote}
          aria-label={hasVoted ? 'Remove upvote' : 'Upvote this resource'}
          title={currentUserId ? (hasVoted ? 'Remove upvote' : 'Upvote') : 'Sign in to vote'}
        >
          ▲
        </button>
        <span className="vote-count">{voteCount}</span>
      </div>

      {/* Content */}
      <div className="resource-content">
        <div className="resource-header">
          <span className={`resource-type-badge resource-type-badge--${resource.type}`}>
            {meta.icon} {meta.label}
          </span>
          {isOwner && (
            <button
              className="delete-btn"
              onClick={onDelete}
              aria-label="Delete resource"
              title="Delete this resource"
            >
              🗑️
            </button>
          )}
        </div>

        {resource.url ? (
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="resource-title resource-title--link"
          >
            {resource.title} ↗
          </a>
        ) : (
          <p className="resource-title">{resource.title}</p>
        )}

        {resource.description && (
          <p className="resource-desc">{resource.description}</p>
        )}

        <div className="resource-footer">
          <span className="resource-meta">
            Shared by <strong>{resource.submittedBy?.username || 'Unknown'}</strong>
          </span>
          <span className="resource-meta resource-time">{timeAgo(resource.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}
