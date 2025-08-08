import React, { useState, useEffect, useRef } from 'react';
import { Modal, Box, Typography, Button, TextField, List, ListItem, ListItemText, Divider, CircularProgress, Chip, Paper } from '@mui/material';
import { ServiceRequest, Reply, Offer } from '../../services/api';
import { createOfferForAdmin, getRepliesForRequest, postAdminReply, updateOfferForAdmin } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 600 },
  bgcolor: 'background.paper',
  border: '1px solid #ddd',
  borderRadius: '8px',
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
    const auth = useAuth();
    const [existingOffer, setExistingOffer] = useState<Offer | null>(null);
    const [price, setPrice] = useState<number>(0);
    const [details, setDetails] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [replies, setReplies] = useState<Reply[]>([]);
    const [newReply, setNewReply] = useState('');
    const chatEndRef = useRef<null | HTMLDivElement>(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (open && request) {
            const lastOffer = request.offers && request.offers.length > 0 ? request.offers[request.offers.length - 1] : null;
            setExistingOffer(lastOffer);
            setPrice(lastOffer?.price || 0);
            setDetails(lastOffer?.details || '');
            setLoading(false); setError(''); setSuccess(''); setNewReply('');
            
            const fetchReplies = async () => {
                try {
                    const response = await getRepliesForRequest(request.id);
                    setReplies(response.data);
                } catch (err) { console.error("Mesajlar getirilirken hata olustu", err); }
            };
            fetchReplies();
        }
    }, [open, request]);

    useEffect(() => {
        scrollToBottom();
    }, [replies]);

    const handleSubmitOffer = async () => {
        setLoading(true); setError(''); setSuccess('');
        try {
            if (existingOffer) {
                await updateOfferForAdmin(existingOffer.id, price);
                setSuccess('Teklif fiyatı başarıyla güncellendi!');
            } else {
                if (!request) return;
                await createOfferForAdmin(request.id, { price, details });
                setSuccess('Teklif başarıyla gönderildi!');
            }
            setTimeout(() => { onClose(); }, 2000);
        } catch (err) {
            setError('İşlem sırasında bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    const handleSendReply = async () => {
        if (!newReply.trim() || !request) return;
        try {
            const response = await postAdminReply(request.id, newReply);
            setReplies(prevReplies => [...prevReplies, response.data]);
            setNewReply('');
        } catch (err) {
            alert("Mesaj gönderilirken bir hata oluştu.");
        }
    };

    if (!request) return null;

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle}>
                <Typography variant="h5" component="h2" gutterBottom>Talep Detayları</Typography>
                <List dense>
                    <ListItem><ListItemText primary="Müşteri Adı Soyadı" secondary={request.user.fullName} /></ListItem>
                    <ListItem><ListItemText primary="E-posta" secondary={request.user.email} /></ListItem>
                    <ListItem><ListItemText primary="Telefon" secondary={request.user.phone} /></ListItem>
                    {/* YENİ EKLENEN SATIR */}
                    <ListItem>
                        <ListItemText 
                            primary="İşin Yapılacağı Adres" 
                            secondary={request.address}
                            sx={{ whiteSpace: 'pre-wrap' }}
                        />
                    </ListItem>
                </List>
                <Divider sx={{ my: 2 }} />

                <Typography variant="h6">Kullanıcının Verdiği Cevaplar</Typography>
                <List dense>
                    {Object.entries(request.details).map(([question, answer]) => (
                        <ListItem key={question}>
                            <ListItemText 
                                primary={question} 
                                secondary={answer || "-"}
                            />
                        </ListItem>
                    ))}
                </List>
                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" sx={{ mb: 1 }}>Fiyat Teklifi</Typography>
                <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                    <TextField label="Teklif Fiyatı (₺)" type="number" fullWidth value={price} onChange={(e) => setPrice(Number(e.target.value))} margin="normal" />
                    <TextField label="Teklif Detayları (İlk Teklifte Girilir)" multiline rows={3} fullWidth value={details} onChange={(e) => setDetails(e.target.value)} margin="normal" disabled={!!existingOffer} />
                    {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
                    {success && <Typography color="primary" sx={{ mt: 1 }}>{success}</Typography>}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <Button variant="contained" onClick={handleSubmitOffer} disabled={loading}>
                            {loading ? <CircularProgress size={24} /> : (existingOffer ? 'Fiyatı Güncelle' : 'Teklifi Gönder')}
                        </Button>
                    </Box>
                </Paper>

                <Typography variant="h6" sx={{ mb: 1 }}>Mesajlaşma</Typography>
                <Paper variant="outlined" sx={{ p: 2 }}>
                    <Box sx={{ height: '250px', overflowY: 'auto', mb: 2, p: 2, background: '#ECE5DD', borderRadius: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {replies.map(reply => {
                            const isAdminMessage = reply.senderUsername === auth.user?.sub;
                            return (
                                <Box key={reply.id} sx={{ alignSelf: isAdminMessage ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                                    <Paper sx={{
                                        p: 1.5,
                                        borderRadius: isAdminMessage ? '10px 0 10px 10px' : '0 10px 10px 10px',
                                        backgroundColor: isAdminMessage ? '#DCF8C6' : '#FFFFFF',
                                    }}>
                                        <Typography variant="caption" display="block" sx={{ fontWeight: 'bold', color: isAdminMessage ? '#4CAF50' : '#1976D2' }}>
                                            {reply.senderUsername}
                                        </Typography>
                                        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{reply.text}</Typography>
                                        <Typography variant="caption" display="block" sx={{ color: 'text.secondary', textAlign: 'right', fontSize: '0.65rem', mt: 0.5 }}>
                                            {new Date(reply.date).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                                        </Typography>
                                    </Paper>
                                </Box>
                            );
                        })}
                        <div ref={chatEndRef} />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <TextField fullWidth size="small" label="Cevap yaz..." value={newReply} onChange={e => setNewReply(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendReply()} />
                        <Button variant="contained" onClick={handleSendReply}>Gönder</Button>
                    </Box>
                </Paper>

                 <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                    <Button onClick={onClose}>Paneli Kapat</Button>
                </Box>
            </Box>
        </Modal>
    );
};