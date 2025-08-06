import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Container, Typography, Paper, Box, TextField, Button, CircularProgress, Snackbar, Alert, Divider, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Header } from './layout/Header';
import { updateUserProfile, changePassword } from '../services/api';
import type { UserProfile } from '../services/api';
import { useNavigate } from 'react-router-dom';

const ProfilePage: React.FC = () => {
    const auth = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ fullName: '', phone: '', address: '' });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        if (auth.token && auth.userProfile) {
            setFormData({
                fullName: auth.userProfile.fullName || '',
                phone: auth.userProfile.phone || '',
                address: auth.userProfile.address || ''
            });
            setLoading(false);
        } else if (!auth.token && !auth.userProfile) {
            navigate('/');
        }
    }, [auth.userProfile, auth.token, navigate]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(''); setSuccess(''); setSubmitting(true);
        try {
            await updateUserProfile(formData);
            setSuccess('Profil bilgileriniz başarıyla güncellendi!');
        } catch (err) {
            setError('Profil güncellenirken bir hata oluştu.');
        } finally {
            setSubmitting(false);
        }
    };

    const handlePasswordChange = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(''); setSuccess('');
        if (newPassword !== confirmPassword) {
            setError("Yeni şifreler eşleşmiyor.");
            return;
        }
        setSubmitting(true);
        try {
            const response = await changePassword({ oldPassword, newPassword });
            setSuccess(response.data);
            setOldPassword(''); setNewPassword(''); setConfirmPassword('');
        } catch (err: any) {
            setError(err.response?.data || "Şifre değiştirilirken bir hata oluştu.");
        } finally {
            setSubmitting(false);
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
                        <TextField label="Kullanıcı Adı" value={auth.userProfile?.username || ''} fullWidth margin="normal" disabled />
                        <TextField label="E-posta" value={auth.userProfile?.email || ''} fullWidth margin="normal" disabled />
                        <TextField label="Ad Soyad" name="fullName" value={formData.fullName} onChange={handleChange} fullWidth margin="normal" required />
                        <TextField label="Telefon" name="phone" value={formData.phone} onChange={handleChange} fullWidth margin="normal" required />
                        <TextField label="Adres" name="address" value={formData.address} onChange={handleChange} fullWidth margin="normal" multiline rows={3} required />
                        <Button type="submit" variant="contained" color="primary" fullWidth disabled={submitting} sx={{ mt: 2 }}>
                            {submitting ? <CircularProgress size={24} /> : 'Bilgileri Güncelle'}
                        </Button>
                    </Box>
                </Paper>

                {/* DİKKAT: Accordion ve AccordionSummary stilleri güncellendi */}
                <Accordion sx={{ mt: 3, boxShadow: 'none', '&:before': { display: 'none' }, border: '1px solid rgba(0, 0, 0, 0.12)', borderRadius: 1 }}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        sx={{
                            backgroundColor: 'rgba(0, 0, 0, 0.03)',
                            '& .MuiAccordionSummary-content': {
                                margin: '12px 0',
                            },
                        }}
                    >
                        <Typography variant="h6">Şifre Değiştir</Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ p: 2 }}>
                        <Box component="form" onSubmit={handlePasswordChange}>
                            <TextField label="Mevcut Şifre" type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} fullWidth margin="normal" required />
                            <TextField label="Yeni Şifre" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} fullWidth margin="normal" required />
                            <TextField label="Yeni Şifre (Tekrar)" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} fullWidth margin="normal" required />
                            <Button type="submit" variant="contained" color="primary" fullWidth disabled={submitting} sx={{ mt: 2 }}>
                                {submitting ? <CircularProgress size={24} /> : 'Şifreyi Değiştir'}
                            </Button>
                        </Box>
                    </AccordionDetails>
                </Accordion>

            </Container>
            <Snackbar open={!!success} autoHideDuration={6000} onClose={() => setSuccess('')}>
                <Alert onClose={() => setSuccess('')} severity="success" sx={{ width: '100%' }}>{success}</Alert>
            </Snackbar>
            <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
                <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>{error}</Alert>
            </Snackbar>
        </div>
    );
};

export default ProfilePage;