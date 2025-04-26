import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './Profile.css'; // Reuse your profile styles!

function PublicProfile() {
  const { username } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchPublicProfile() {
      try {
        const res = await fetch(`http://localhost:5000/profile/${username}`);

        if (!res.ok) {
          throw new Error('Profile not found');
        }

        const userData = await res.json();
        setUser(userData);
      } catch (error) {
        console.error('Public profile fetch error:', error);
        navigate('/404');
      }
    }

    fetchPublicProfile();
  }, [username, navigate]);

  if (!user) {
    return <p>Loading profile...</p>;
  }

  return (
    <div className="profile-container">
      <div className="profile-section">
      <img
        src={
            user.avatar
            ? user.avatar.startsWith('http')
                ? user.avatar
                : `http://localhost:5000/${user.avatar}`
            : 'https://placehold.co/150/png'
        }
        alt="User Avatar"
        className="avatar"
      />

        <h2>{user.name}</h2>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.phone || 'Not set'}</p>
        <p><strong>Date of Birth:</strong> {user.dob ? new Date(user.dob).toLocaleDateString() : 'Not set'}</p>
        <p><strong>Role:</strong> {user.role}</p>
        <p><strong>Bio:</strong> {user.bio || 'No bio yet'}</p>
      </div>

      <div className="posts-section">
        <h3>Posts</h3>
        <div className="post">
          <h4>Example Post 1</h4>
          <p>This is an example of a public user's post.</p>
        </div>
        <div className="post">
          <h4>Example Post 2</h4>
          <p>Another sample public project description.</p>
        </div>
      </div>
    </div>
  );
}

export default PublicProfile;
