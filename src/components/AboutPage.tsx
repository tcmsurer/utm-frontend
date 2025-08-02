import React from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';
import { Header } from './layout/Header';

const AboutPage = () => {
    return (
        <div>
            <Header />
            <Container maxWidth="md" sx={{ my: 4 }}>
                <Paper sx={{ p: 4, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Hakkımızda
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Usta Tedarik Merkezi, eviniz veya iş yeriniz için ihtiyaç duyduğunuz her alanda, işinin ehli, güvenilir ve profesyonel ustaları sizinle buluşturan bir platformdur. Yılların getirdiği tecrübe ile, kaliteli hizmeti en kolay ve hızlı yoldan almanızı sağlamayı misyon edindik.
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Misyonumuz, hizmet arayanlarla hizmet veren profesyoneller arasında güvene dayalı, şeffaf ve verimli bir köprü kurmaktır. Boya-badanadan elektrik tesisatına, su tesisatından mobilya montajına kadar geniş bir yelpazede, her biri kendi alanında doğrulanmış ustalarla çalışıyoruz.
                    </Typography>
                </Paper>
            </Container>
        </div>
    );
};

export default AboutPage;