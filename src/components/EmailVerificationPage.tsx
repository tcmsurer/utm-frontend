import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Container, Typography, Paper, Box, CircularProgress, Alert, Button } from '@mui/material';
import { Header } from './layout/Header';
import { verifyEmail } from '../services/api';
import { useAuth } from '../context/AuthContext';

const EmailVerificationPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const auth = useAuth();
    const token = searchParams.get('token');
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('E-posta adresiniz doğrulanıyor, lütfen bekleyin...');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('Geçersiz doğrulama linki.');
            return;
        }

        const doVerification = async () => {
            try {
                await verifyEmail(token);
                setStatus('success');
                setMessage('E-posta adresiniz başarıyla doğrulandı! Profilinize yönlendiriliyorsunuz...');
                
                // Profil bilgisini yenile
                if (auth.refreshUserProfile) {
                    await auth.refreshUserProfile();
                }

                setTimeout(() => {
                    navigate('/profilim'); // Profil sayfasına yönlendir
                }, 3000);

            } catch (err: any) {
                setStatus('error');
                setMessage(err.response?.data || "Doğrulama sırasında bir hata oluştu. Linkin süresi dolmuş olabilir.");
            }
        };

        doVerification();
    }, [token, navigate, auth]);

    return (
        <div>
            <Header />
            <Container maxWidth="sm" sx={{ my: 4 }}>
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h5" component="h1" gutterBottom sx={{ mb: 3 }}>
                        E-Posta Doğrulama
                    </Typography>
                    {status === 'loading' && <CircularProgress />}
                    {status === 'success' && <Alert severity="success">{message}</Alert>}
                    {status === 'error' && <Alert severity="error">{message}</Alert>}
                    
                    <Button component={Link} to="/" variant="contained" sx={{ mt: 3 }}>
                        Ana Sayfaya Dön
                    </Button>
                </Paper>
            </Container>
        </div>
    );
};

export default EmailVerificationPage;