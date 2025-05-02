import { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation  } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

function Profile() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [myPosts, setMyPosts] = useState([]);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }

    if (user) {
      fetchMyPosts();
    }
  }, [user, loading, navigate]);

  async function fetchMyPosts() {
    try {
      const username = user.name.split(' ').join('-');
      const res = await fetch(`http://localhost:5000/posts/user/${username}`);
      const data = await res.json();
      setMyPosts(data);
    } catch (error) {
      console.error('Error fetching my posts:', error);
    }
  }
  const handleEdit = (postId) => {
    navigate(`/edit-post/${postId}`);
  };
  const handleDelete = async (postId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (!confirmDelete) return;
  
    try {
      const res = await fetch(`/posts/${postId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${user.token}`,
        },
      });
  
      if (!res.ok) {
        throw new Error("Failed to delete post");
      }
  
      // After delete
      if (location.pathname.includes("/posts/")) {
        navigate("/jobs");
      } else {
        fetchMyPosts(); // refresh posts if on profile
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong while deleting the post.");
    }
  };

  if (loading) {
    return <p>Loading profile...</p>;
  }

  if (!user) {
    return null; // Redirect is happening
  }

  return (
    <div className="profile-container">
      <div className="profile-section" style={{ textAlign: 'center' }}>
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
        <p><strong>Bio:</strong> {user.bio || 'No bio yet'}</p>

        <div className="profile-actions">
          <Link to="/edit-profile" className="profile-action-btn edit-btn">Edit Profile</Link>
          <Link to="/create-post" className="profile-action-btn create-btn">Create Job Offer</Link>
        </div>
      </div>

      <div className="posts-section">
        <h3>My Posts</h3>

        {myPosts.length > 0 ? (
          myPosts.map((post) => {
            // Short Name Formatting
            const shortName = `${post.first_name.charAt(0)}. ${post.last_name}`;
            const usernameURL = `${post.first_name}-${post.last_name}`; // Public Profile URL

            return (
              <div key={post.post_id} className="job-card">
                <h3>{post.title}</h3>


                <div className="job-user-info">
                  <img
                      src={
                          post.avatar
                          ? post.avatar.startsWith('http')
                              ? post.avatar
                              : `http://localhost:5000/${post.avatar}`
                          : 'https://placehold.co/50x50/png'
                      }
                      alt="User Avatar"
                      className="job-user-avatar"
                  />


                  <Link to={`/profile/${usernameURL}`} className="job-user-name">
                    {shortName}
                  </Link>
                </div>

                <p>{post.description.length > 100 ? post.description.slice(0, 100) + '...' : post.description}</p>
                <p><strong>Date:</strong> {new Date(post.upload_date).toLocaleDateString()}</p>
                {user?.id === post.user_id && (
                  <div className="post-actions">
                    <button className="edit-btn" onClick={() => handleEdit(post.post_id)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDelete(post.post_id)}>Delete</button>
                  </div>
                )}
                <Link to={`/posts/${post.post_id}`} className="view-job-link">
                  View Details
                </Link>
              </div>
            );
          })
        ) : (
          <p>No posts available.</p>
        )}
      </div>
    </div>
  );
}

export default Profile;
