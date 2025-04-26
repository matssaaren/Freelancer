import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './CreatePost.css'; // optional new CSS

function CreatePost() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description) {
      setError('Title and description are required.');
      return;
    }

    try {
      const token = localStorage.getItem('token');

      const res = await fetch('http://localhost:5000/create-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Post creation failed.');
      }

      navigate('/jobs'); // after successful post, redirect to job listings
    } catch (err) {
      setError(err.message);
    }
  };

  if (!user) {
    return <p>You must be logged in to create a post.</p>;
  }

  return (
    <div className="create-post-container">
      <h2>Create New Job Post</h2>
      <form onSubmit={handleSubmit} className="create-post-form">
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="5"
            required
          />
        </div>

        {error && <p className="form-error">{error}</p>}

        <button type="submit" className="submit-btn">Create Post</button>
      </form>
    </div>
  );
}

export default CreatePost;
