import './Home.css';
import { Link } from 'react-router-dom';

function Home() {

  return (
    <div className="home-container">
      <h1>Welcome to FreelanceHub</h1>
      <p className="intro">
        Your one-stop platform for connecting talented freelancers with ambitious clients. Whether you're looking to hire or be hired, FreelanceHub makes it simple, fast, and secure.
      </p>

      <div className="actions">
        <div className="card">
          <h2>I'm a Freelancer</h2>
          <p>Create a profile, showcase your work, and apply to jobs that match your skills.</p>
          <Link to='/register?role=freelancer'>
            <button>Get Started</button>
          </Link>
        </div>

        <div className="card">
          <h2>I'm Hiring</h2>
          <p>Post job offers, browse freelancer profiles, and find the perfect match for your project.</p>
          <Link to='/register?role=client'>
            <button>Offer a Job</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
