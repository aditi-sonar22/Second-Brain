import React from 'react';

const NoteCard = ({ note, onEdit, onDelete, onStar, onDone }) => {
  const textStyle = note.done ? {
    textDecoration: 'line-through',
    color: 'gray'
  } : {};

  return (
    <div className="note-card" id={`note-${note._id}`}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: '' }}>
        <h3 style={textStyle}>{note.title}</h3>
        <button
          onClick={() => onStar(note._id)}
          style={{
            fontSize: '20px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: note.starred ? 'gold' : '#ccc',
          }}
          title="Star this note"
        >
          {note.starred ? '⭐' : '☆'}
        </button>

        
      </div>

      <p style={textStyle}>{note.content}</p>

      <div>
        <strong style={textStyle}>Links:</strong>
        {note.tags.map((tag, i) => {
          const isValidUrl = tag.startsWith('http://') || tag.startsWith('https://');
          const finalUrl = isValidUrl ? tag : `https://${tag}`;

          return (
            <div key={i}>
              <a
                href={finalUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: note.done ? 'gray' : '#66f', textDecoration: 'underline' }}
              >
                {tag}
              </a>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: '10px' }}>
        <button onClick={onDone} style={{ marginRight: '10px' }}>
          ✅ {note.done ? 'Mark as Undone' : 'Mark as Done'}
        </button>
        <button onClick={onEdit} style={{ marginRight: '10px' }}>✏️ Edit</button>
        <button onClick={onDelete}>🗑️ Delete</button>
      </div>
    </div>
  );
};

export default NoteCard;
