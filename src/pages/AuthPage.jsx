import React, { useState } from 'react';
import { authService } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Bot, Mail, Lock, User } from 'lucide-react';

const AuthPage = ({ setToken }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const data = await authService.login(formData.email, formData.password);
        setToken(data.access_token);
        navigate('/');
      } else {
        await authService.signup(formData.username, formData.email, formData.password);
        setIsLogin(true);
        setError('Signup successful! Please login.');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="welcome-icon" style={{ margin: '0 auto 16px auto' }}>
            <Bot size={32} />
          </div>
          <h1>{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
          <p>{isLogin ? 'Log in to continue to AI Chat' : 'Sign up to get started'}</p>
        </div>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="input-group">
              <label>Username</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: 12, top: 13, color: 'var(--text-secondary)' }} />
                <input 
                  type="text" 
                  name="username" 
                  className="input" 
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleChange}
                  required 
                  style={{ paddingLeft: 40 }}
                />
              </div>
            </div>
          )}

          <div className="input-group">
            <label>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: 12, top: 13, color: 'var(--text-secondary)' }} />
              <input 
                type="email" 
                name="email" 
                className="input" 
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required 
                style={{ paddingLeft: 40 }}
              />
            </div>
          </div>

          <div className="input-group">
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: 12, top: 13, color: 'var(--text-secondary)' }} />
              <input 
                type="password" 
                name="password" 
                className="input" 
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required 
                style={{ paddingLeft: 40 }}
              />
            </div>
          </div>

          {error && <div className="error-text" style={{ color: error.includes('successful') ? 'var(--success)' : 'var(--error)' }}>{error}</div>}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 24 }} disabled={loading}>
            {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
          </button>
        </form>

        <div className="auth-switch">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => { setIsLogin(!isLogin); setError(''); }}>
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
