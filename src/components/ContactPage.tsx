import React from 'react';
import { Container, Paper, Box } from '@mui/material';
import { Header } from './layout/Header';
import contactImage from '../assets/iletisim.png'; // 1. Resmi import ediyoruz

const ContactPage = () => {
    return (
        <div>
            <Header />
            <Container maxWidth="md" sx={{ my: 4 }}>
                <Paper sx={{ 
                    p: { xs: 2, sm: 4 }, 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    display: 'flex',
                    justifyContent: 'center'
                }}>
                    {/* 2. Resmi bir Box içinde gösteriyoruz */}
                    <Box
                        component="img"
                        src={contactImage}
                        alt="İletişim Bilgileri"
                        sx={{
                            maxWidth: '100%', // Resmin en fazla kendi genişliğinde olmasını sağlar
                            height: 'auto',   // Yüksekliği otomatik ayarlar
                            weight: 'auto',  // Genişliği otomatik ayarlar
                            borderRadius: '8px' // Köşeleri hafif yuvarlak yapmak için
                        }}
                    />
                </Paper>
            </Container>
        </div>
    );
};

export default ContactPage;