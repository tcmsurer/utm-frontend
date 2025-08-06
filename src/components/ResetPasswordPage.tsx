import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Paper, Box, TextField, Button, Alert } from '@mui/material';
import { Header } from './layout/Header';
import { resetPassword } from '../services/api';

const ResetPasswordPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) {
            setError("Geçersiz veya eksik token.");
            return;
        }
        if (password !== confirmPassword) {
            setError("Şifreler eşleşmiyor.");
            return;
        }
        try {
            const response = await resetPassword(token, password);
            setSuccess(response.data);
            setError('');
            setTimeout(() => navigate('/'), 3000);
        } catch (err: any) {
            setError(err.response?.data || "Bir hata oluştu.");
        }
    };

    return (
        <div>
            <Header />
            <Container maxWidth="xs" sx={{ my: 4 }}>
                <Paper sx={{ p: 4 }}>
                    <Typography variant="h5" component="h1" gutterBottom>
                        Yeni Şifre Belirle
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit}>
                        <TextField
                            label="Yeni Şifre"
                            type="password"
                            fullWidth
                            margin="normal"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <TextField
                            label="Yeni Şifre (Tekrar)"
                            type="password"
                            fullWidth
                            margin="normal"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
                            Yeni Şifreyi Kaydet
                        </Button>
                        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                        {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
                    </Box>
                </Paper>
            </Container>
        </div>
    );
};

export default ResetPasswordPage;