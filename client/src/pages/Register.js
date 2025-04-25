import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import './Register.css';

// 🔒 Validation functions
function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function isStrongPassword(password) {
  const minLength = 8;
  const hasNumber = /\d/;
  return (
    password.length >= minLength &&
    hasNumber.test(password)
  );
}

function isValidFullPhone(phone) {
    return /^\+\d{8,20}$/.test(phone.trim());
}

function isAtLeast18YearsOld(dateString) {
  const today = new Date();
  const dob = new Date(dateString);
  const age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  const dayDiff = today.getDate() - dob.getDate();
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    return age - 1 >= 18;
  }
  return age >= 18;
}

function Register() {
    const location = useLocation();
    const [role, setRole] = useState('freelancer');

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const [phone, setPhone] = useState('');
    const [phoneError, setPhoneError] = useState('');


    const [dob, setDob] = useState('');
    const [dobError, setDobError] = useState('');

    function handleSubmit(e) {
        e.preventDefault();

        const userData = {
        firstName,
        lastName,
        email,
        phone: `${phone}`,
        password, // Normally you'd hash this before sending to a backend
        dob,
        role,
        };

        console.log('Submitting user data:', userData);

        fetch('http://localhost:5000/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        })
            .then((res) => res.json())
            .then((data) => console.log(data))
            .catch((err) => console.error(err));
          
    }

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlRole = params.get('role');
    if (urlRole === 'client' || urlRole === 'freelancer') {
      setRole(urlRole);
    }
  }, [location.search]);

  const isFormValid =
    firstName.trim() !== '' &&
    lastName.trim() !== '' &&
    email.trim() !== '' &&
    isValidEmail(email) &&
    password !== '' &&
    isStrongPassword(password) &&
    confirmPassword === password &&
    isValidFullPhone(phone) &&
    dob !== '' &&
    isAtLeast18YearsOld(dob);

  return (
    <div className="register-container">
      <h1>Register</h1>
      <form className="register-form" onSubmit={handleSubmit}>
        <label>
          First Name
          <input
            type="text"
            placeholder="John"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </label>

        <label>
          Last Name
          <input
            type="text"
            placeholder="Doe"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </label>

        <label>
          Email
          <input
            type="email"
            placeholder="john@example.com"
            value={email}
            required
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError(isValidEmail(e.target.value) ? '' : 'Invalid email address');
            }}
          />
        </label>
        {emailError && <p className="form-warning">{emailError}</p>}

        <label>
          Password
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            required
            onChange={(e) => {
              const pwd = e.target.value;
              setPassword(pwd);
              setPasswordError(
                isStrongPassword(pwd)
                  ? ''
                  : 'Password must be 8+ characters and include a number'
              );
            }}
          />
        </label>
        {passwordError && <p className="form-warning">{passwordError}</p>}

        <label>
          Confirm Password
          <input
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </label>
        {confirmPassword && confirmPassword !== password && (
          <p className="form-warning">Passwords do not match</p>
        )}
        <label>
        Phone Number
            <input
                type="tel"
                placeholder="+3725551234"
                value={phone}
                onChange={(e) => {
                const val = e.target.value;
                setPhone(val);
                setPhoneError(isValidFullPhone(val) ? '' : 'Enter full phone number with + and digits only');
                }}
                required
            />
        </label>
        {phoneError && <p className="form-warning">{phoneError}</p>}


        <label>
          Date of Birth
          <input
            type="date"
            value={dob}
            required
            onChange={(e) => {
              const selected = e.target.value;
              setDob(selected);
              setDobError(
                isAtLeast18YearsOld(selected)
                  ? ''
                  : 'You must be at least 18 years old to register'
              );
            }}
          />
        </label>
        {dobError && <p className="form-warning">{dobError}</p>}

        <div className="role-selector">
          <p>Are you hiring or looking for a job?</p>
          <div className="role-buttons">
            <button
              type="button"
              className={role === 'freelancer' ? 'selected' : ''}
              onClick={() => setRole('freelancer')}
            >
              I'm looking for a job
            </button>
            <button
              type="button"
              className={role === 'client' ? 'selected' : ''}
              onClick={() => setRole('client')}
            >
              I'm hiring
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="submit-btn"
          disabled={!isFormValid}
        >
          Create Account
        </button>
      </form>
      Already have an account? 
      <Link to='/login'>
        Click Here
      </Link>
    </div>
  );
}

export default Register;