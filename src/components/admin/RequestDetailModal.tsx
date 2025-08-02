import React, { useState } from 'react';
import { Modal, Box, Typography, Button, TextField, List, ListItem, ListItemText, Divider, CircularProgress } from '@mui/material';
import type { ServiceRequest } from '../../services/api';
import { createOfferForAdmin } from '../../services/api';

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  maxHeight: '90vh',
  overflowY: 'auto'
};

interface Props {
    request: ServiceRequest | null;
    open: boolean;
    onClose: () => void;
}

export const RequestDetailModal = ({ request, open, onClose }: Props) => {
    const [price, setPrice] = useState<number>(0);
    const [details, setDetails] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    if (!request) return null;

    const handleSubmitOffer = async () => {
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            await createOfferForAdmin(request.id, { price, details });
            setSuccess('Teklif başarıyla gönderildi!');
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (err) {
            setError('Teklif gönderilirken bir hata oluştu.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle}>
                <Typography variant="h5" component="h2" gutterBottom>
                    Talep Detayları (#{request.id.substring(0, 8)})
                </Typography>
                <List dense>
                    <ListItem><ListItemText primary="Başlık" secondary={request.title} /></ListItem>
                    <ListItem><ListItemText primary="Kategori" secondary={request.category} /></ListItem>
                    <ListItem><ListItemText primary="Kullanıcı" secondary={request.user.username} /></ListItem>
                </List>
                
                {/* YENİ EKLENEN KISIM: SORULAR VE CEVAPLAR */}
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6">Kullanıcının Verdiği Cevaplar</Typography>
                <List dense>
                    {Object.entries(request.details).map(([question, answer]) => (
                        <ListItem key={question}>
                            <ListItemText 
                                primary={question} 
                                secondary={answer || "-"} // Cevap boşsa tire koy
                            />
                        </ListItem>
                    ))}
                </List>
                {/* YENİ KISIM BİTTİ */}

                <Divider sx={{ my: 2 }} />
                <Typography variant="h6">Teklif Gönder</Typography>
                <Box component="form" noValidate autoComplete="off" sx={{ mt: 2 }}>
                    <TextField
                        label="Fiyat (₺)"
                        type="number"
                        fullWidth
                        margin="normal"
                        onChange={(e) => setPrice(Number(e.target.value))}
                    />
                    <TextField
                        label="Teklif Detayları ve Mesajınız"
                        multiline
                        rows={4}
                        fullWidth
                        margin="normal"
                        onChange={(e) => setDetails(e.target.value)}
                    />
                    {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
                    {success && <Typography color="primary" sx={{ mt: 1 }}>{success}</Typography>}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <Button onClick={onClose} sx={{ mr: 1 }}>Kapat</Button>
                        <Button variant="contained" onClick={handleSubmitOffer} disabled={loading}>
                            {loading ? <CircularProgress size={24} /> : 'Teklifi Gönder'}
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
};