import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Jobs.css'; // your existing CSS

function Jobs() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch('http://localhost:5000/posts');
        const data = await res.json();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  if (loading) {
    return <p>Loading posts...</p>;
  }

  return (
    <div className="jobs-container">
      <h2>Available Jobs</h2>
      <div className="jobs-list">
        {posts.length > 0 ? (
          posts.map((post) => {
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

export default Jobs;
