import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import NoteCard from './NoteCard';
import './dashboard.css';


const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ title: '', content: '', tags: '' });
  const [editNoteId, setEditNoteId] = useState(null);
  const userId = localStorage.getItem('userId');
  const userEmail = localStorage.getItem('userEmail');

  const fetchNotes = useCallback(() => {
    if (!userId) return;
    axios.get(`http://localhost:5000/api/notes/mynotes/${userId}`)
      .then(res => setNotes(res.data))
      .catch(err => console.error("Error fetching notes:", err));
  }, [userId]);


  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const logout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    window.location.href = '/'; // or navigate('/login') if using React Router
  };



  const saveNote = () => {
    if (!newNote.title || !newNote.content || !userId) {
      alert("Please fill all fields");
      return;
    }


    const payload = {
      title: newNote.title,
      content: newNote.content,
      tags: newNote.tags.split(',').map(tag => tag.trim()),
      user: userId,
      starred: false // default unstarred
    };


    if (editNoteId) {
      axios.put(`http://localhost:5000/api/notes/update/${editNoteId}`, payload)
        .then(res => {
          setNotes(notes.map(note => note._id === editNoteId ? res.data : note));
          setNewNote({ title: '', content: '', tags: '' });
          setEditNoteId(null);
        })
        .catch(err => console.error("Error updating note:", err));
    } else {
      axios.post('http://localhost:5000/api/notes/create', payload)
        .then(res => {
          setNotes(prev => [...prev, res.data]);
          setNewNote({ title: '', content: '', tags: '' });
        })
        .catch(err => console.error("Error creating note:", err));
    }
  };


  const deleteNote = (id) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    axios.delete(`http://localhost:5000/api/notes/delete/${id}`)
      .then(() => setNotes(notes.filter(note => note._id !== id)))
      .catch(err => console.error("Error deleting note:", err));
  };


  const editNote = (note) => {
    setEditNoteId(note._id);
    setNewNote({
      title: note.title,
      content: note.content,
      tags: note.tags.join(', '),
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  const toggleStar = (id, currentStatus) => {
    axios.patch(`http://localhost:5000/api/notes/star/${id}`)
      .then(res => {
        // Update the notes array with the new starred status
        setNotes(prevNotes =>
          prevNotes.map(note => note._id === id ? res.data : note)
        );
      })
      .catch(err => console.error("Error toggling star:", err));
  };

  const toggleDone = (id, currentStatus) => {
  axios.patch(`http://localhost:5000/api/notes/done/${id}`)
    .then(res => {
      setNotes(prev =>
        prev.map(note => note._id === id ? res.data : note)
      );
    })
    .catch(err => console.error("Error marking note as done:", err));
};



  



  // Sort notes - starred notes first
  const sortedNotes = [...notes].sort((a, b) => b.starred - a.starred);


  return (
    <div className="dashboard">
      <div className="sidebar">
      <div className="profile-section">
          <h3>👤 {userEmail}</h3>
          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>

        <h2>{editNoteId ? 'Edit Note' : 'Create Note'}</h2>
        <input
          placeholder="Title"
          value={newNote.title}
          onChange={e => setNewNote({ ...newNote, title: e.target.value })}
        />
        <textarea
          placeholder="Content"
          value={newNote.content}
          onChange={e => setNewNote({ ...newNote, content: e.target.value })}
        />
        <input
          placeholder="Tags"
          value={newNote.tags}
          onChange={e => setNewNote({ ...newNote, tags: e.target.value })}
        />
        <button onClick={saveNote}>{editNoteId ? 'Update Note' : 'Save Note'}</button>
      </div>


      <div className="notes-container">
        <h2>My Notes</h2>
        {sortedNotes.map(note => (
          <NoteCard
            key={note._id}
            note={note}
            onEdit={() => editNote(note)}
            onDelete={() => deleteNote(note._id)}
            onStar={() => toggleStar(note._id, note.starred)}
            onDone={() => toggleDone(note._id, note.done)}
          />
        ))}
      </div>
    </div>
  );
};


export default Dashboard;







