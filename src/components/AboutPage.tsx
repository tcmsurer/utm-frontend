import React from 'react';
import { Container, Typography, Paper, Box, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { Header } from './layout/Header';
import BuildIcon from '@mui/icons-material/Build';
import CategoryIcon from '@mui/icons-material/Category';
import ScheduleIcon from '@mui/icons-material/Schedule';
import SavingsIcon from '@mui/icons-material/Savings';

const AboutPage = () => {
    return (
        <div>
            <Header />
            <Container maxWidth="md" sx={{ my: 4 }}>
                <Paper sx={{ p: { xs: 2, sm: 4 }, backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '16px' }}>
                    <Typography 
                        variant="h3" 
                        component="h1" 
                        gutterBottom 
                        sx={{ 
                            fontWeight: 700, 
                            textAlign: 'center',
                            mb: 2,
                            background: 'linear-gradient(45deg, #0D47A1 30%, #1976D2 90%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        Hatay'ın Evlerine Özel Çözümleriniz!
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ textAlign: 'center', mb: 4 }}>
                        Usta Tedarik ve Malzeme Temini
                    </Typography>
                    <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.7 }}>
                        Hatay'daki evinizde tadilat veya tamirat mı gerekiyor? İster küçük bir onarım, ister kapsamlı bir yenileme olsun, doğru ustayı bulmak ve kaliteli malzemeleri temin etmek zorlu bir süreç olabilir. İşte tam bu noktada Usta Tedarik, Hataylı hemşehrilerimize özel çözümlerle yanınızda!
                    </Typography>
                    
                    <Divider sx={{ my: 4 }} />

                    <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 500, mb: 3 }}>
                        Neden Hatay'daki Evleriniz İçin Usta Tedarik?
                    </Typography>

                    <List>
                        <ListItem sx={{ alignItems: 'flex-start', mb: 2 }}>
                            <ListItemIcon sx={{ mt: 1 }}><BuildIcon color="primary" fontSize="large" /></ListItemIcon>
                            <ListItemText 
                                primary="Hatay'ın Güvenilir Ustaları Bir Arada" 
                                primaryTypographyProps={{ variant: 'h6', gutterBottom: true }}
                                secondary="Fayans ustasından boyacıya, elektrikçiden tesisatçıya kadar, Hatay ve çevresindeki en deneyimli ve güvenilir ustaları sizin için bir araya getiriyoruz. Uzman ekibimizle, işçilik kalitesinden ödün vermeden, evinizin ihtiyaç duyduğu her türlü tadilat ve tamirat işini profesyonelce tamamlıyoruz." 
                            />
                        </ListItem>
                        <ListItem sx={{ alignItems: 'flex-start', mb: 2 }}>
                            <ListItemIcon sx={{ mt: 1 }}><CategoryIcon color="primary" fontSize="large" /></ListItemIcon>
                            <ListItemText 
                                primary="Malzeme Temininde Kolaylık ve Kalite" 
                                primaryTypographyProps={{ variant: 'h6', gutterBottom: true }}
                                secondary="Tadilat ve tamirat projeleriniz için gerekli olan tüm malzemeleri tek elden temin etme kolaylığı sunuyoruz. Boyadan seramiğe, armatürlerden elektrik malzemelerine kadar, Hatay'daki en kaliteli ve dayanıklı ürünleri en uygun fiyatlarla kapınıza getiriyoruz. Zaman kaybetmeden, doğru malzemeye ulaşın!" 
                            />
                        </ListItem>
                        <ListItem sx={{ alignItems: 'flex-start', mb: 2 }}>
                            <ListItemIcon sx={{ mt: 1 }}><ScheduleIcon color="primary" fontSize="large" /></ListItemIcon>
                            <ListItemText 
                                primary="Zamanında ve Sorunsuz Hizmet" 
                                primaryTypographyProps={{ variant: 'h6', gutterBottom: true }}
                                secondary="Hatay'ın dinamik yapısına uygun olarak, tadilat ve tamirat işlerinizin zamanında başlaması ve bitmesi bizim için önceliktir. Projelerinizi aksatmadan, planlanan süre içinde tamamlamak için titizlikle çalışırız." 
                            />
                        </ListItem>
                        <ListItem sx={{ alignItems: 'flex-start', mb: 2 }}>
                            <ListItemIcon sx={{ mt: 1 }}><SavingsIcon color="primary" fontSize="large" /></ListItemIcon>
                            <ListItemText 
                                primary="Bütçenize Uygun Çözümler" 
                                primaryTypographyProps={{ variant: 'h6', gutterBottom: true }}
                                secondary="İster küçük bir tamirat olsun ister büyük bir renovasyon, bütçenizi zorlamadan en iyi çözümleri sunmak için buradayız. Şeffaf fiyatlandırma politikamızla, ek sürprizlerle karşılaşmazsınız." 
                            />
                        </ListItem>
                    </List>

                    <Divider sx={{ my: 4 }} />

                    <Typography variant="body1" paragraph sx={{ fontStyle: 'italic', textAlign: 'center', fontSize: '1.1rem' }}>
                        Hatay'daki evinizin değerini artırmak ve yaşam alanlarınızı daha konforlu hale getirmek için Usta Tedarik'e güvenin. Tadilat ve tamirat ihtiyaçlarınızda hem güvenilir ustaları hem de kaliteli malzemeleri tek bir adresten temin etmenin rahatlığını yaşayın.
                    </Typography>
                    <Typography variant="h6" component="p" sx={{ fontWeight: 'bold', textAlign: 'center', mt: 3, color: 'primary.main' }}>
                        Usta Tedarik – Hatay'daki Evlerinize Profesyonel Dokunuşlar!
                    </Typography>
                </Paper>
            </Container>
        </div>
    );
};

export default AboutPage;