import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Container, Typography, Paper, Box, CircularProgress, Alert, Button } from '@mui/material';
import { Header } from './layout/Header';
import { verifyEmail } from '../services/api';

const EmailVerificationPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate(); // Yönlendirme için useNavigate hook'u
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
                setMessage('E-posta adresiniz başarıyla doğrulandı! Ana sayfaya yönlendiriliyorsunuz...');
                
                // Başarılı mesajını 3 saniye gösterdikten sonra ana sayfaya yönlendir
                setTimeout(() => {
                    navigate('/');
                }, 3000);

            } catch (err: any) {
                setStatus('error');
                setMessage(err.response?.data || "Doğrulama sırasında bir hata oluştu. Linkin süresi dolmuş olabilir.");
            }
        };

        doVerification();
    }, [token]); // DİKKAT: Bağımlılık dizisine "token" eklendi. Bu, useEffect'in sadece bir kez çalışmasını sağlar.

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
                    
                    {/* Yönlendirme otomatik olacağı için bu butona gerek kalmayabilir ama yine de kalması iyi olur */}
                    <Button component={Link} to="/" variant="contained" sx={{ mt: 3 }}>
                        Ana Sayfaya Dön
                    </Button>
                </Paper>
            </Container>
        </div>
    );
};

export default EmailVerificationPage;