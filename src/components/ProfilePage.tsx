import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Container, Typography, Paper, Box, TextField, Button, CircularProgress, Snackbar, Alert } from '@mui/material';
import { Header } from './layout/Header';
import { updateUserProfile } from '../services/api';
import type { UserProfile } from '../services/api';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
    const auth = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ fullName: '', phone: '', address: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (!auth.userProfile) {
            // Eğer profil bilgisi hala yükleniyorsa bekle, yoksa ana sayfaya at
            if (!auth.token) navigate('/');
        } else {
            setFormData({
                fullName: auth.userProfile.fullName,
                phone: auth.userProfile.phone,
                address: auth.userProfile.address
            });
            setLoading(false);
        }
    }, [auth.userProfile, auth.token, navigate]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);
        try {
            await updateUserProfile(formData);
            setSuccess('Profil bilgileriniz başarıyla güncellendi!');
            // Context'i de yenilemek için bir fonksiyon çağrılabilir veya sayfa yenilenebilir
        } catch (err) {
            setError('Profil güncellenirken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };
    
    if (loading) { return <><Header /><CircularProgress sx={{ display: 'block', margin: 'auto', mt: 5 }} /></>; }

    return (
        <div>
            <Header />
            <Container maxWidth="sm" sx={{ my: 4 }}>
                <Paper sx={{ p: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Profilim
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit}>
                        <TextField
                            label="Kullanıcı Adı"
                            value={auth.userProfile?.username || ''}
                            fullWidth
                            margin="normal"
                            disabled // Değiştirilemez
                        />
                        <TextField
                            label="E-posta"
                            value={auth.userProfile?.email || ''}
                            fullWidth
                            margin="normal"
                            disabled // Değiştirilemez
                        />
                        <TextField
                            label="Ad Soyad"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            required
                        />
                        <TextField
                            label="Telefon"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            required
                        />
                        <TextField
                            label="Adres"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            multiline
                            rows={3}
                            required
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            disabled={loading}
                            sx={{ mt: 2 }}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Bilgileri Güncelle'}
                        </Button>
                    </Box>
                </Paper>
            </Container>
            <Snackbar open={!!success} autoHideDuration={6000} onClose={() => setSuccess('')}>
                <Alert onClose={() => setSuccess('')} severity="success" sx={{ width: '100%' }}>
                    {success}
                </Alert>
            </Snackbar>
            <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
                <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default ProfilePage;