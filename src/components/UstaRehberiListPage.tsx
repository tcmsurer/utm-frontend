import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, CircularProgress, Card, CardActionArea, CardMedia, CardContent } from '@mui/material';
import { Link } from 'react-router-dom';
import { Header } from './layout/Header';
import { getUstalar, Usta } from '../services/api'; // Usta tipi artık güncel
import ConstructionIcon from '@mui/icons-material/Construction';

const API_DOMAIN = process.env.REACT_APP_API_URL || 'http://localhost:8080'; 

const UstaRehberiListPage: React.FC = () => {
    const [ustalar, setUstalar] = useState<Usta[]>([]); // Artık Usta tipi doğru veriyi içeriyor
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActiveUstas = async () => {
            try {
                const response = await getUstalar();
                setUstalar(response.data);
            } catch (error) {
                console.error("Aktif ustalar listesi yüklenirken hata oluştu:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchActiveUstas();
    }, []);

    if (loading) {
        return <><Header /><Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box></>;
    }

    return (
        <div>
            <Header />
            <Container maxWidth="lg" sx={{ my: 4 }}>
                <Typography variant="h3" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 4, color: 'white' }}>
                    Usta Rehberi
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -2 }}>
                    {ustalar.length > 0 ? (
                        ustalar.map((usta) => (
                            <Box sx={{ width: { xs: '100%', md: '50%' }, p: 2 }} key={usta.id}>
                                <Card sx={{ height: '100%' }}>
                                    <CardActionArea component={Link} to={`/usta-portfolio/${usta.id}`} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                        <CardMedia
                                            component="div"
                                            sx={{ 
                                                height: 200, 
                                                width: '100%',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                backgroundImage: usta.profileImageUrl ? `url(${API_DOMAIN}/api/files/${usta.profileImageUrl})` : 'none',
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center',
                                                bgcolor: !usta.profileImageUrl ? 'grey.200' : 'transparent'
                                            }}
                                        >
                                            {!usta.profileImageUrl && (
                                                <ConstructionIcon sx={{ fontSize: 80, color: 'grey.500' }} />
                                            )}
                                        </CardMedia>
                                        <CardContent sx={{ flexGrow: 1 }}>
                                            <Typography gutterBottom variant="h5" component="div" sx={{ textAlign: 'center' }}>
                                                {usta.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                                                Referans İşlerini Görmek İçin Tıklayın
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Box>
                        ))
                    ) : (
                        <Typography sx={{ color: 'white', textAlign: 'center', width: '100%', mt: 4 }}>
                            Gösterilecek aktif usta bulunmamaktadır.
                        </Typography>
                    )}
                </Box>
            </Container>
        </div>
    );
};

export default UstaRehberiListPage;