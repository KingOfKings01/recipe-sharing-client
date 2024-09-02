import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import FormComponent from '../components/FormComponent';
import { signIn } from '../API/userApis';
import { useState } from 'react';

function SignIn() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const initialValues = { name: '', email: '', phone: '', password: '', confirmPassword: '' };

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters long').required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm password is required'),
  });

  const onSubmit = async (values) => {
    try {
      setLoading(true);
      setError(null);
      const { token, email, username } = await signIn(values);
      localStorage.setItem('token', token);
      localStorage.setItem('email', email);
      localStorage.setItem('username', username);
      alert('Sign In successful');
      navigate('/');
    } catch (err) {
      setError(err?.message || 'Sign In failed');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: 'name', type: 'text', placeholder: 'Name' },
    { name: 'email', type: 'email', placeholder: 'Email' },
    { name: 'password', type: 'password', placeholder: 'Password' },
    { name: 'confirmPassword', type: 'password', placeholder: 'Confirm Password' },
  ];

  return (
    <div className='form-page'>
      <h2>Sign In</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <FormComponent
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        fields={fields}
        buttonLabel="Sign In"
      />
      <div className="navigation-links">
        <Link to="/login">Already have an account? Log In</Link>
      </div>
    </div>
  );
}

export default SignIn;
