import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { Header } from './layout/Header';
import { Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, CircularProgress, Box, Modal, List, ListItem, ListItemText, Divider, FormControlLabel, Checkbox, Chip } from '@mui/material';
import { getMyRequests, closeMyRequest } from '../services/api';
import type { ServiceRequest } from '../services/api';
import { useNavigate } from 'react-router-dom';

const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', sm: 600 },
    bgcolor: 'background.paper',
    border: '2px solid #000',
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
    const auth = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!auth.token) {
            navigate('/');
            return;
        }
        fetchRequests();
    }, [auth.token, navigate]);

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
        return allRequests.filter(req => showClosed ? true : req.status === 'OPEN');
    }, [allRequests, showClosed]);

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
                                                    Detayları Görüntüle
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
                                <ListItem><ListItemText primary="Başlık" secondary={selectedRequest.title} /></ListItem>
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