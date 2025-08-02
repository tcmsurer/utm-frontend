import React from 'react';
import { Container, Typography, Paper, Box, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Header } from './layout/Header';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';

const ContactPage = () => {
    return (
        <div>
            <Header />
            <Container maxWidth="md" sx={{ my: 4 }}>
                <Paper sx={{ p: 4, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        İletişim Bilgileri
                    </Typography>
                    <List>
                        <ListItem>
                            <ListItemIcon><LocationOnIcon color="primary" /></ListItemIcon>
                            <ListItemText primary="Adres" secondary="Örnek Mah. Teknoloji Cad. No:123, Büyükçekmece/İstanbul" />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon><EmailIcon color="primary" /></ListItemIcon>
                            <ListItemText primary="E-Posta" secondary="destek@ustatedarikmerkezi.com" />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon><PhoneIcon color="primary" /></ListItemIcon>
                            <ListItemText primary="Telefon" secondary="+90 555 123 45 67" />
                        </ListItem>
                    </List>
                </Paper>
            </Container>
        </div>
    );
};

// DİKKAT: Eksik olan ve hatayı çözen satır budur.
export default ContactPage;