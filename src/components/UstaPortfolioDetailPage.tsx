import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, CircularProgress, Paper, Button, Divider, Card, CardMedia, CardContent } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from './layout/Header';
import { getUstalar, Usta } from '../services/api';
import { RehberIcerikDto, getActivePortfolioByUsta } from '../services/api';
import PhoneIcon from '@mui/icons-material/Phone';
import ConstructionIcon from '@mui/icons-material/Construction';

// Sadece temel domain adresini alıyoruz (http://localhost:8080 veya https://utm-backend-ptnn.onrender.com)
const API_DOMAIN = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const UstaPortfolioDetailPage: React.FC = () => {
    const { ustaId } = useParams<{ ustaId: string }>();
    const navigate = useNavigate();
    const [portfolio, setPortfolio] = useState<RehberIcerikDto[]>([]);
    const [usta, setUsta] = useState<Usta | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (ustaId) {
            const fetchDetails = async () => {
                try {
                    const portfolioRes = await getActivePortfolioByUsta(ustaId);
                    setPortfolio(portfolioRes.data);

                    const ustalarRes = await getUstalar();
                    const currentUsta = ustalarRes.data.find(u => u.id === ustaId);
                    setUsta(currentUsta || null);

                } catch (error) {
                    console.error("Portfolyo detayı yüklenirken hata oluştu:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchDetails();
        }
    }, [ustaId]);

    const handleTalepGonder = () => {
        if (usta) {
            navigate('/', { state: { preselectedUsta: usta } });
        }
    };

    if (loading) {
        return <><Header /><Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box></>;
    }

    if (!usta) {
        return <><Header /><Typography variant="h5" color="error" sx={{ textAlign: 'center', mt: 4 }}>Usta bulunamadı.</Typography></>;
    }

    return (
        <div>
            <Header />
            <Container maxWidth="md" sx={{ my: 4 }}>
                <Paper sx={{ p: { xs: 2, sm: 4 }, backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
                    <Typography variant="h3" component="h1" gutterBottom>
                        {usta.name} - Portfolyo
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                        Ustamıza ait referans işler ve projeler.
                    </Typography>
                     <Box sx={{ my: 3, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                        <Button variant="contained" size="large" startIcon={<ConstructionIcon />} onClick={handleTalepGonder}>
                            Bu Ustadan Talep Oluştur
                        </Button>
                        <Button variant="outlined" size="large" startIcon={<PhoneIcon />} href="tel:+905055440166">
                            Bize Ulaşın
                        </Button>
                    </Box>
                    <Divider sx={{ mb: 3 }} />

                    {portfolio.length > 0 ? portfolio.map(item => (
                        <Card key={item.id} sx={{ mb: 4 }}>
                            {item.mediaType === 'IMAGE' ? (
                                // URL'yi API_DOMAIN kullanarak doğru oluşturuyoruz
                                <CardMedia component="img" image={`${API_DOMAIN}/api/files/${item.mediaUrl}`} alt={item.title} sx={{ maxHeight: 500, objectFit: 'contain' }} />
                            ) : (
                                // URL'yi API_DOMAIN kullanarak doğru oluşturuyoruz
                                <CardMedia component="video" controls src={`${API_DOMAIN}/api/files/${item.mediaUrl}`} sx={{ maxHeight: 500, width: '100%' }} />
                            )}
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">{item.title}</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>{item.description}</Typography>
                            </CardContent>
                        </Card>
                    )) : (
                        <Typography>Bu ustaya ait gösterilecek portfolyo içeriği bulunmamaktadır.</Typography>
                    )}
                </Paper>
            </Container>
        </div>
    );
};

export default UstaPortfolioDetailPage;