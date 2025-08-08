import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Header } from './layout/Header';
import { Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, CircularProgress, Box, Modal, List, ListItem, ListItemText, Divider, FormControlLabel, Checkbox, Chip, TextField } from '@mui/material';
import { getMyRequests, closeMyRequest, getRepliesForRequest, postUserReply } from '../services/api';
import type { ServiceRequest, Reply } from '../services/api';
import { useNavigate } from 'react-router-dom';

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

const MyRequests: React.FC = () => {
    const [allRequests, setAllRequests] = useState<ServiceRequest[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showClosed, setShowClosed] = useState<boolean>(false);
    const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [replies, setReplies] = useState<Reply[]>([]);
    const [newReply, setNewReply] = useState('');
    const auth = useAuth();
    const navigate = useNavigate();
    const chatEndRef = useRef<null | HTMLDivElement>(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (!auth.token) { 
            navigate('/'); 
            return; 
        }
        fetchRequests();
    }, [auth.token, navigate]);

    useEffect(() => {
        if (isModalOpen) {
            scrollToBottom();
        }
    }, [replies, isModalOpen]);

    const fetchRequests = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getMyRequests();
            setAllRequests(response.data);
        } catch (err) {
            setError("Taleplerinizi getirirken bir sorun oluştu.");
        } finally {
            setLoading(false);
        }
    };

    const handleCloseRequest = async (id: string) => {
        if (window.confirm("Bu talebi kapatmak istediğinizden emin misiniz? Bu işlem geri alınamaz.")) {
            try {
                await closeMyRequest(id);
                fetchRequests();
            } catch (error) {
                alert("Talep kapatılırken bir hata oluştu.");
            }
        }
    };

    const filteredRequests = useMemo(() => {
        if (!allRequests) return [];
        return allRequests.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime())
                          .filter(req => showClosed ? true : req.status === 'OPEN');
    }, [allRequests, showClosed]);

    const handleOpenModal = async (request: ServiceRequest) => {
        setSelectedRequest(request);
        try {
            const response = await getRepliesForRequest(request.id);
            setReplies(response.data);
        } catch(err) {
            console.error("Mesajlar getirilirken hata oluştu.", err);
            setReplies([]);
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedRequest(null);
        setReplies([]);
        setNewReply('');
    };
    
    const handleSendReply = async () => {
        if (!newReply.trim() || !selectedRequest) return;
        try {
            const response = await postUserReply(selectedRequest.id, newReply);
            setReplies(prevReplies => [...prevReplies, response.data]);
            setNewReply('');
        } catch (err) {
            alert("Mesaj gönderilirken bir hata oluştu.");
        }
    };

    if (loading) {
        return (
            <div>
                <Header />
                <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 5 }} />
            </div>
        );
    }
    
    return (
        <div>
            <Header />
            <Container component="main" maxWidth="lg" sx={{ my: 4 }}>
                <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography component="h1" variant="h4" gutterBottom>
                            Oluşturduğum Talepler
                        </Typography>
                        <FormControlLabel
                            control={<Checkbox checked={showClosed} onChange={(e) => setShowClosed(e.target.checked)} />}
                            label="Kapalı Talepleri Göster"
                        />
                    </Box>
                    {error && <Typography color="error">{error}</Typography>}
                    <TableContainer>
                        <Table sx={{ minWidth: 650 }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Başlık</TableCell>
                                    <TableCell>Oluşturulma Tarihi</TableCell>
                                    <TableCell>Durum</TableCell>
                                    <TableCell>Eylemler</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredRequests.length > 0 ? (
                                    filteredRequests.map((request) => (
                                        <TableRow key={request.id} sx={{ '&:last-child td, &:last-child th': { border: 0 }, opacity: request.status !== 'OPEN' ? 0.6 : 1 }}>
                                            <TableCell>{request.title}</TableCell>
                                            <TableCell>{new Date(request.createdDate).toLocaleString('tr-TR')}</TableCell>
                                            <TableCell>
                                                <Chip label={request.status} color={request.status === 'OPEN' ? 'primary' : 'default'} size="small" />
                                            </TableCell>
                                            <TableCell>
                                                <Button variant="outlined" size="small" onClick={() => handleOpenModal(request)} sx={{ mr: 1 }}>
                                                    Detay & Mesajlar
                                                </Button>
                                                {request.status === 'OPEN' && (
                                                    <Button variant="contained" color="error" size="small" onClick={() => handleCloseRequest(request.id)}>
                                                        Talebi Kapat
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} align="center">Henüz oluşturulmuş bir talebiniz yok.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Container>
            <Modal open={isModalOpen} onClose={handleCloseModal}>
                <Box sx={modalStyle}>
                    {selectedRequest && (
                        <>
                            <Typography variant="h5">Talep Detayı</Typography>
                            <List dense>
                                <ListItem>
                                    <ListItemText 
                                        primary="İşin Yapılacağı Adres" 
                                        secondary={selectedRequest.address} 
                                        sx={{ whiteSpace: 'pre-wrap' }}
                                    />
                                </ListItem>
                                <Divider sx={{ my: 1 }} />
                                {Object.entries(selectedRequest.details).map(([question, answer]) => (
                                    <ListItem key={question}><ListItemText primary={question} secondary={answer || "-"} /></ListItem>
                                ))}
                            </List>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="h6">Gelen Teklifler</Typography>
                            {selectedRequest.offers && selectedRequest.offers.length > 0 ? (
                                <List>
                                    {selectedRequest.offers.map(offer => (
                                        <ListItem key={offer.id}>
                                            <ListItemText 
                                                primary={`Fiyat: ${offer.price.toFixed(2)} ₺`}
                                                secondary={`Mesaj: ${offer.details}`}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            ) : ( <Typography>Henüz bir teklif almadınız.</Typography> )}
                             <Divider sx={{ my: 2 }} />
                            <Typography variant="h6" sx={{ mb: 1 }}>Mesajlaşma</Typography>
                            <Paper variant="outlined" sx={{ p: 2 }}>
                                <Box sx={{ height: '300px', overflowY: 'auto', mb: 2, p: 2, background: '#ECE5DD', borderRadius: 1, display: 'flex', flexDirection: 'column' }}>
                                    {replies.map(reply => {
                                        const isMyMessage = reply.senderUsername === auth.user?.sub;
                                        return (
                                            <Box key={reply.id} sx={{ alignSelf: isMyMessage ? 'flex-end' : 'flex-start', maxWidth: '80%', my: 0.5 }}>
                                                <Paper sx={{
                                                    p: 1.5,
                                                    borderRadius: isMyMessage ? '10px 0 10px 10px' : '0 10px 10px 10px',
                                                    backgroundColor: isMyMessage ? '#DCF8C6' : '#FFFFFF',
                                                }}>
                                                    <Typography variant="caption" display="block" sx={{ fontWeight: 'bold', color: isMyMessage ? '#4CAF50' : '#1976D2' }}>
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
                                    <TextField fullWidth size="small" label="Cevap yaz..." value={newReply} onChange={e => setNewReply(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendReply()}/>
                                    <Button variant="contained" onClick={handleSendReply}>Gönder</Button>
                                </Box>
                            </Paper>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                <Button onClick={handleCloseModal}>Kapat</Button>
                            </Box>
                        </>
                    )}
                </Box>
            </Modal>
        </div>
    );
};

export default MyRequests;