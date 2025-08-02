import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Header } from './layout/Header';
import { Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, CircularProgress, Box, Modal, List, ListItem, ListItemText, Divider } from '@mui/material';
import { getMyRequests } from '../services/api';
import type { ServiceRequest } from '../services/api';
import { useNavigate } from 'react-router-dom';

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

const MyRequests: React.FC = () => {
    const [requests, setRequests] = useState<ServiceRequest[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const auth = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!auth.token) {
            navigate('/');
            return;
        }

        const fetchRequests = async () => {
            try {
                setLoading(true);
                const response = await getMyRequests();
                setRequests(response.data);
                setError(null);
            } catch (err) {
                console.error("Talepler getirilirken hata:", err);
                setError("Taleplerinizi getirirken bir sorun oluştu.");
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, [auth.token, navigate]);

    const handleOpenModal = (request: ServiceRequest) => {
        setSelectedRequest(request);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedRequest(null);
    };

    if (loading) {
        return (
            <div>
                <Header />
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                    <CircularProgress />
                </Box>
            </div>
        );
    }
    
    return (
        <div>
            <Header />
            <Container component="main" maxWidth="lg" sx={{ my: 4 }}>
                <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
                    <Typography component="h1" variant="h4" gutterBottom>
                        Oluşturduğum Talepler
                    </Typography>
                    {error && <Typography color="error">{error}</Typography>}
                    <TableContainer>
                        <Table sx={{ minWidth: 650 }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Başlık</TableCell>
                                    <TableCell>Kategori</TableCell>
                                    <TableCell>Oluşturulma Tarihi</TableCell>
                                    <TableCell>Durum</TableCell>
                                    <TableCell>Eylemler</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {requests.map((request) => (
                                    <TableRow key={request.id}>
                                        <TableCell>{request.title}</TableCell>
                                        <TableCell>{request.category}</TableCell>
                                        <TableCell>{new Date(request.createdDate).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color={request.offers && request.offers.length > 0 ? 'success.main' : 'primary.main'}>
                                                {request.offers && request.offers.length > 0 ? 'Teklif Alındı' : 'Açık'}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Button variant="outlined" size="small" onClick={() => handleOpenModal(request)}>
                                                Mesajları Görüntüle
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
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
                                <ListItem><ListItemText primary="Başlık" secondary={selectedRequest.title} /></ListItem>
                                <ListItem><ListItemText primary="Açıklama" secondary={selectedRequest.description} sx={{ whiteSpace: 'pre-wrap' }} /></ListItem>
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
                            ) : (
                                <Typography>Henüz bir teklif almadınız.</Typography>
                            )}
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