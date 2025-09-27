import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, CircularProgress, Card, CardContent, CardMedia } from '@mui/material';
import { Header } from './layout/Header';
import { getAllHizmetler, Hizmet } from '../services/api';

const HizmetlerimizPage: React.FC = () => {
    const [hizmetler, setHizmetler] = useState<Hizmet[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHizmetler = async () => {
            try {
                const response = await getAllHizmetler();
                setHizmetler(response.data);
            } catch (error) {
                console.error("Hizmetler yüklenirken hata oluştu:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchHizmetler();
    }, []);

    const getEmbedUrl = (url: string): string => {
        let videoId = '';
        try {
            const urlObj = new URL(url);
            // Handles links like: youtube.com/watch?v=VIDEO_ID
            if (urlObj.hostname.includes('youtube.com')) {
                videoId = urlObj.searchParams.get('v') || '';
                // Handles links like: youtube.com/shorts/VIDEO_ID
                if (!videoId && urlObj.pathname.includes('/shorts/')) {
                    videoId = urlObj.pathname.split('/shorts/')[1];
                }
            }
            // Handles links like: youtu.be/VIDEO_ID
            else if (urlObj.hostname.includes('youtu.be')) {
                videoId = urlObj.pathname.slice(1);
            }
        } catch (e) {
            console.error("Geçersiz URL:", url);
            return ''; // Return an empty string if URL is invalid
        }

        // If a video ID was found, return the proper embed URL
        return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
    };

    if (loading) {
        return <><Header /><CircularProgress sx={{ display: 'block', margin: 'auto', mt: 5 }} /></>;
    }

    return (
        <div>
            <Header />
            <Container maxWidth="lg" sx={{ my: 4 }}>
                <Typography variant="h3" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 4, color: 'white' }}>
                    Hizmetlerimiz
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -2 }}>
                    {hizmetler && hizmetler.length > 0 ? (
                        hizmetler.map((hizmet) => (
                            <Box sx={{ width: { xs: '100%', md: '50%' }, p: 2 }} key={hizmet.id}>
                                <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                    <CardMedia>
                                        <Box sx={{ position: 'relative', paddingTop: '56.25%' /* 16:9 aspect ratio */ }}>
                                            <iframe
                                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                                                src={getEmbedUrl(hizmet.videoUrl)}
                                                title={hizmet.title}
                                                frameBorder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            />
                                        </Box>
                                    </CardMedia>
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography gutterBottom variant="h5" component="div">
                                            {hizmet.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {hizmet.description}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Box>
                        ))
                    ) : (
                        <Typography sx={{ color: 'white', textAlign: 'center', width: '100%', mt: 4 }}>
                            Gösterilecek hizmet bulunmamaktadır.
                        </Typography>
                    )}
                </Box>
            </Container>
        </div>
    );
};

export default HizmetlerimizPage;