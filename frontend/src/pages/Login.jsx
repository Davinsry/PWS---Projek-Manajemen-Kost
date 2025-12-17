import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock } from 'lucide-react';
import api from '../api';
import { DEMO_MODE, DEMO_CREDENTIALS } from '../demoConfig';

const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Demo Mode: Check credentials locally
        if (DEMO_MODE) {
            if (username === DEMO_CREDENTIALS.username && password === DEMO_CREDENTIALS.password) {
                localStorage.setItem('user', JSON.stringify({ id: 1, username: username }));
                navigate('/dashboard');
            } else {
                alert('Username atau password salah! (Demo: admin/admin)');
            }
            return;
        }

        // Normal Mode: API call
        try {
            const response = await api.post('/auth/login', { username, password });
            localStorage.setItem('user', JSON.stringify(response.data.user));
            navigate('/dashboard');
        } catch (error) {
            alert(error.response?.data?.message || 'Login Gagal');
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, var(--color-bg-gradient-start) 0%, var(--color-bg-gradient-end) 100%)'
        }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
                        Login Admin
                    </h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>Sistem Informasi Manajemen Kos</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label className="input-label">Username</label>
                        <div style={{ position: 'relative' }}>
                            <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                            <input
                                type="text"
                                className="form-input"
                                style={{ width: '100%', paddingLeft: '40px', boxSizing: 'border-box' }} // added box-sizing
                                placeholder="Masukkan username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                            <input
                                type="password"
                                className="form-input"
                                style={{ width: '100%', paddingLeft: '40px', boxSizing: 'border-box' }}
                                placeholder="Masukkan password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: '1rem', padding: '0.75rem' }}
                    >
                        Masuk
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
