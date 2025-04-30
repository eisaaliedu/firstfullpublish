import { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';
import '../styles/shared.css';

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
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
    };

    const getAllUsers = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching users:', error);
        return;
      }
      setUsers(data);
      setLoading(false);
    };

    getUser();
    getAllUsers();
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
              Admin Dashboard
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

        <div className="users-list">
          <h2 style={{ 
            fontSize: 'var(--font-size-xl)',
            marginBottom: 'var(--spacing-lg)'
          }}>
            User Management
          </h2>
          
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Created At</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.email}</td>
                    <td>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        backgroundColor: user.role === 'admin' ? '#818cf8' : '#6ee7b7',
                        color: 'white',
                        fontSize: 'var(--font-size-sm)'
                      }}>
                        {user.role}
                      </span>
                    </td>
                    <td>{new Date(user.created_at).toLocaleDateString()}</td>
                    <td>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        backgroundColor: '#22c55e',
                        color: 'white',
                        fontSize: 'var(--font-size-sm)'
                      }}>
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 