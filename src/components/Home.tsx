import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUstalar, getSorularByUsta, createMyRequest, Usta, Soru } from '../services/api';
import { Container, Stepper, Step, StepLabel, Button, Typography, Box, Paper, Select, MenuItem, FormControl, InputLabel, TextField, CircularProgress, Alert } from '@mui/material';
import { Header } from './layout/Header';
import { useNavigate, useLocation } from 'react-router-dom';

const steps = ['Usta Seçimi', 'İş Detayları', 'Adres ve Ek Bilgiler', 'Onay'];

const Home: React.FC = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [ustalar, setUstalar] = useState<Usta[]>([]);
    const [selectedUsta, setSelectedUsta] = useState('');
    const [sorular, setSorular] = useState<Soru[]>([]);
    const [answers, setAnswers] = useState<{ [key: string]: string }>({});
    const [userDetails, setUserDetails] = useState({ address: '', notes: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const auth = useAuth();
    const navigate = useNavigate();
    
    // DİKKAT: Usta Rehberi sayfasından yönlendirmeyi yakalamak için eklendi
    const location = useLocation();
    const preselectedUsta = location.state?.preselectedUsta as Usta | undefined;

    useEffect(() => {
        const fetchUstalar = async () => {
            try {
                const response = await getUstalar();
                setUstalar(response.data);
            } catch (err) {
                setError('Usta listesi yüklenemedi.');
            }
        };
        fetchUstalar();
    }, []);

    // DİKKAT: Usta Rehberi'nden gelen önceden seçilmiş ustayı işlemek için eklendi
    useEffect(() => {
        if (preselectedUsta && ustalar.length > 0) {
            // Ustanın listede olduğundan emin ol
            const ustaExists = ustalar.some(u => u.id === preselectedUsta.id);
            if (ustaExists) {
                setSelectedUsta(preselectedUsta.name);
                setActiveStep(1); // Süreci 2. adımdan başlat
            }
        }
    }, [preselectedUsta, ustalar]);


    useEffect(() => {
        if (selectedUsta) {
            const fetchSorular = async () => {
                setLoading(true);
                try {
                    const response = await getSorularByUsta(selectedUsta);
                    setSorular(response.data);
                    setLoading(false);
                } catch (err) {
                    setError('Bu ustaya ait sorular yüklenemedi.');
                    setLoading(false);
                }
            };
            fetchSorular();
        }
    }, [selectedUsta]);

    const handleNext = () => setActiveStep((prev) => prev + 1);
    const handleBack = () => setActiveStep((prev) => prev - 1);

    const handleAnswerChange = (soruId: string, value: string) => {
        setAnswers(prev => ({ ...prev, [soruId]: value }));
    };

    const handleSubmit = async () => {
        if (!auth.user) {
            setError("Talep oluşturmak için giriş yapmalısınız.");
            return;
        }
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const requestData = {
                category: selectedUsta,
                details: answers,
                address: userDetails.address,
                notes: userDetails.notes
            };
            await createMyRequest(requestData);
            setSuccess("Talebiniz başarıyla oluşturuldu! 'Taleplerim' sayfasından takip edebilirsiniz.");
            // Formu sıfırla
            setActiveStep(0);
            setSelectedUsta('');
            setAnswers({});
            setUserDetails({ address: '', notes: '' });
        } catch (err) {
            setError("Talep oluşturulurken bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };
    
    const renderStepContent = (step: number) => {
        switch (step) {
            case 0:
                return (
                    <FormControl fullWidth sx={{ mt: 3 }}>
                        <InputLabel>Hangi Alanda Ustaya İhtiyacınız Var?</InputLabel>
                        <Select value={selectedUsta} onChange={(e) => setSelectedUsta(e.target.value)} label="Hangi Alanda Ustaya İhtiyacınız Var?">
                            {ustalar.map((usta) => (
                                <MenuItem key={usta.id} value={usta.name}>{usta.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                );
            case 1:
                return (
                    <Box sx={{ mt: 3 }}>
                        {loading ? <CircularProgress /> : sorular.map((soru) => (
                            <FormControl fullWidth margin="normal" key={soru.id}>
                                <InputLabel>{soru.question}</InputLabel>
                                <Select value={answers[soru.id] || ''} onChange={(e) => handleAnswerChange(soru.id, e.target.value)} label={soru.question}>
                                    {soru.options.map((option, index) => (
                                        <MenuItem key={index} value={option}>{option}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        ))}
                    </Box>
                );
            case 2:
                return (
                    <Box sx={{ mt: 3 }}>
                        <TextField label="Adresiniz" fullWidth margin="normal" value={userDetails.address} onChange={(e) => setUserDetails(prev => ({...prev, address: e.target.value}))} />
                        <TextField label="Ek Notlarınız" fullWidth margin="normal" multiline rows={4} value={userDetails.notes} onChange={(e) => setUserDetails(prev => ({...prev, notes: e.target.value}))}/>
                    </Box>
                );
            case 3:
                return (
                    <Box sx={{ mt: 3 }}>
                        <Typography variant="h6">Talep Özeti</Typography>
                        <Typography><b>Usta:</b> {selectedUsta}</Typography>
                        <Typography><b>Adres:</b> {userDetails.address}</Typography>
                        <Typography><b>Detaylar:</b></Typography>
                        <ul>
                            {sorular.map(s => <li key={s.id}>{s.question}: {answers[s.id]}</li>)}
                        </ul>
                    </Box>
                );
            default:
                return 'Bilinmeyen Adım';
        }
    };


    return (
        <div>
            <Header />
            <Container maxWidth="md" sx={{ my: 4 }}>
                <Paper sx={{ p: { xs: 2, sm: 4 }, backgroundColor: 'rgba(255, 255, 255, 0.98)', borderRadius: '16px' }}>
                    <Typography component="h1" variant="h4" align="center" gutterBottom>
                        Usta Bulmanın En Kolay Yolu
                    </Typography>
                    <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
                        {steps.map((label) => (
                            <Step key={label}><StepLabel>{label}</StepLabel></Step>
                        ))}
                    </Stepper>
                    
                    {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    
                    {activeStep === steps.length ? (
                        <Typography variant="h5" gutterBottom>Talebiniz Alındı.</Typography>
                    ) : (
                        <>
                            {renderStepContent(activeStep)}
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                                {activeStep !== 0 && (
                                    <Button onClick={handleBack} sx={{ mr: 1 }}>Geri</Button>
                                )}
                                {activeStep === steps.length - 1 ? (
                                    <Button variant="contained" onClick={handleSubmit} disabled={loading}>{loading ? <CircularProgress size={24} /> : 'Talebi Gönder'}</Button>
                                ) : (
                                    <Button variant="contained" onClick={handleNext}>İleri</Button>
                                )}
                            </Box>
                        </>
                    )}
                </Paper>
            </Container>
        </div>
    );
};

export default Home;