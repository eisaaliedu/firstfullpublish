import { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';
import '../styles/shared.css';

export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }
      setUser(user);

      // Fetch user profile
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      setProfile(profile);
      setLoading(false);
    };

    getUser();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="loading">
        Loading...
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: 'var(--spacing-xl)'
        }}>
          <div>
            <h1 style={{ 
              fontSize: 'var(--font-size-2xl)',
              marginBottom: 'var(--spacing-xs)'
            }}>
              My Dashboard
            </h1>
            {user && (
              <p style={{ color: 'var(--text-secondary)' }}>
                Welcome back, {user.email}
              </p>
            )}
          </div>
          <button 
            onClick={handleSignOut}
            className="btn btn-danger"
          >
            Sign Out
          </button>
        </div>

        {profile && (
          <div className="user-profile">
            <h2 style={{ 
              fontSize: 'var(--font-size-xl)',
              marginBottom: 'var(--spacing-lg)'
            }}>
              Profile Information
            </h2>
            
            <div className="card" style={{ backgroundColor: 'var(--background-light)' }}>
              <div style={{ 
                display: 'grid', 
                gap: 'var(--spacing-lg)',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))'
              }}>
                <div>
                  <h3 style={{ 
                    fontSize: 'var(--font-size-lg)',
                    color: 'var(--text-secondary)',
                    marginBottom: 'var(--spacing-xs)'
                  }}>
                    Account Type
                  </h3>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    backgroundColor: '#6ee7b7',
                    color: 'white',
                    fontSize: 'var(--font-size-sm)'
                  }}>
                    {profile.role}
                  </span>
                </div>

                <div>
                  <h3 style={{ 
                    fontSize: 'var(--font-size-lg)',
                    color: 'var(--text-secondary)',
                    marginBottom: 'var(--spacing-xs)'
                  }}>
                    Member Since
                  </h3>
                  <p>{new Date(profile.created_at).toLocaleDateString()}</p>
                </div>

                <div>
                  <h3 style={{ 
                    fontSize: 'var(--font-size-lg)',
                    color: 'var(--text-secondary)',
                    marginBottom: 'var(--spacing-xs)'
                  }}>
                    Status
                  </h3>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    backgroundColor: '#22c55e',
                    color: 'white',
                    fontSize: 'var(--font-size-sm)'
                  }}>
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 