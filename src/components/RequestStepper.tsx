import React, { useState, useEffect } from 'react';
import { Stepper, Step, StepLabel, Button, Typography, Box, Select, MenuItem, TextField, FormControl, InputLabel, Divider } from '@mui/material';
import { getUstalar, getSorularByUsta, createMyRequest } from '../services/api';
import type { Usta, Soru } from '../services/api';
import { useAuth } from '../context/AuthContext';

const steps = ['Usta Seçimi', 'İş Detayları', 'Ek Bilgiler', 'Onay'];

const formInputStyle = {
    '& .MuiOutlinedInput-root': {
        borderRadius: '12px',
        backgroundColor: 'rgba(240, 247, 255, 0.7)',
        transition: 'all 0.3s ease-in-out',
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(0, 0, 0, 0.23)',
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#1976D2',
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#0D47A1',
            borderWidth: '2px',
        },
    },
    '& .MuiSelect-select': {
        fontWeight: 500,
        padding: '14px',
    },
    '& .MuiInputLabel-root': {
        fontWeight: 400,
    },
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    borderRadius: '12px',
};

export const RequestStepper = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [ustalar, setUstalar] = useState<Usta[]>([]);
    const [selectedUsta, setSelectedUsta] = useState<string>('');
    const [sorular, setSorular] = useState<Soru[]>([]);
    const [answers, setAnswers] = useState<{ [key: string]: string }>({});

    const auth = useAuth();

    useEffect(() => {
        getUstalar().then(response => setUstalar(response.data));
    }, []);

    const handleUstaSelect = (ustaName: string) => {
        setSelectedUsta(ustaName);
        setAnswers({}); 
        if (ustaName) {
            getSorularByUsta(ustaName).then(response => setSorular(response.data));
        } else {
            setSorular([]);
        }
    };
    
    const handleAnswerChange = (question: string, answer: string) => {
        setAnswers(prev => ({ ...prev, [question]: answer }));
    };

    const handleNext = () => setActiveStep(prev => prev + 1);
    const handleBack = () => setActiveStep(prev => prev - 1);

    const handleSubmit = async () => {
        if (!auth.user) {
            alert("Talebi göndermek için lütfen giriş yapın veya kayıt olun.");
            return;
        }
        const requestData = { title: `Usta Talebi: ${selectedUsta}`, category: selectedUsta, details: answers };
        try {
            await createMyRequest(requestData);
            handleNext();
        } catch (error) {
            alert('Talep gönderilirken bir hata oluştu.');
        }
    };

    const getStepContent = (step: number) => {
        switch (step) {
            case 0:
                return (
                    <Box sx={{ minWidth: 120, my: 4, display: 'flex', justifyContent: 'center' }}>
                        <FormControl fullWidth sx={{ ...formInputStyle, maxWidth: '500px' }}>
                            <InputLabel id="usta-select-label">Hangi alanda ustaya ihtiyacınız var?</InputLabel>
                            <Select labelId="usta-select-label" value={selectedUsta} label="Hangi alanda ustaya ihtiyacınız var?" onChange={e => handleUstaSelect(e.target.value as string)}>
                                <MenuItem value=""><em>Usta Seçiniz</em></MenuItem>
                                {ustalar.map(usta => <MenuItem key={usta.id} value={usta.name}>{usta.name}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Box>
                );
            case 1:
                return (
                    <Box>
                        <Typography variant="h6" sx={{ mb: 2 }}>Lütfen işin detaylarını belirtin:</Typography>
                        {sorular.map(soru => (
                            <Box key={soru.id} sx={{ mb: 2 }}>
                                {soru.type === 'select' ? (
                                    <FormControl fullWidth sx={formInputStyle}>
                                        <InputLabel>{soru.question}</InputLabel>
                                        <Select label={soru.question} defaultValue="" onChange={e => handleAnswerChange(soru.question, e.target.value as string)}>
                                            {soru.options.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                                        </Select>
                                    </FormControl>
                                ) : (
                                    <TextField sx={formInputStyle} label={soru.question} type={soru.type} fullWidth onChange={e => handleAnswerChange(soru.question, e.target.value)} />
                                )}
                            </Box>
                        ))}
                    </Box>
                );
            case 2:
                const finalQuestion = `'${selectedUsta}' ustası başka neyi bilmeli / neye dikkat etmeli?`;
                return (
                     <Box>
                         <Typography variant="h6" sx={{ mb: 2 }}>Eklemek İstedikleriniz</Typography>
                         <TextField sx={formInputStyle} label={finalQuestion} multiline rows={4} fullWidth variant="outlined" onChange={e => handleAnswerChange('Ek Notlar', e.target.value)} />
                     </Box>
                );
            case 3:
                return (
                    <Box>
                        <Typography variant="h6">Talep Özeti</Typography>
                        <Typography><b>Usta:</b> {selectedUsta}</Typography>
                        {Object.entries(answers).map(([q, a]) => <Typography key={q}><b>{q}:</b> {a || '-'}</Typography>)}
                        <Divider sx={{ my: 2 }}/>
                        {auth.user ? <Typography>Talebiniz, <b>{auth.user.sub}</b> hesabınızla gönderilecektir.</Typography> : <Typography color="error">Talebi gönderebilmek için lütfen yukarıdan giriş yapın veya kayıt olun.</Typography>}
                    </Box>
                );
            default:
                return 'Bilinmeyen Adım';
        }
    };

    const isNextButtonDisabled = () => {
        if (activeStep === 0) return !selectedUsta;
        if (activeStep === 1) {
            const validAnswersCount = Object.values(answers).filter(answer => answer && answer.toString().trim() !== '').length;
            return validAnswersCount < sorular.length;
        }
        return false;
    };

    return (
      <Box sx={{ width: '100%' }}>
          <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (<Step key={label}><StepLabel>{label}</StepLabel></Step>))}
          </Stepper>
          {activeStep === steps.length ? (
              <Box sx={{ textAlign: 'center', my: 4 }}>
                  <Typography variant="h5">Talebiniz Alınmıştır!</Typography>
                  <Typography>En kısa sürede sizinle iletişime geçeceğiz.</Typography>
                  <Button sx={{mt: 2}} variant="contained" onClick={() => window.location.reload()}>Yeni Talep Oluştur</Button>
              </Box>
          ) : (
              <>
                  <Box sx={{ mt: 3, mb: 2, p: { xs: 2, md: 3 }, borderRadius: 2, minHeight: 250 }}>
                      {getStepContent(activeStep)}
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                      <Button color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>Geri</Button>
                      <Box sx={{ flex: '1 1 auto' }} />
                      {activeStep === steps.length - 1 ? (
                          <Button onClick={handleSubmit} variant="contained" color="primary" disabled={!auth.user}>Talebi Gönder</Button>
                      ) : (
                          <Button onClick={handleNext} variant="contained" disabled={isNextButtonDisabled()}>İleri</Button>
                      )}
                  </Box>
              </>
          )}
      </Box>
    );
};