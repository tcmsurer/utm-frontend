import React, { useState, useEffect } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { getAllRequestsForAdmin } from '../../services/api';
import type { ServiceRequest } from '../../services/api';
import { RequestDetailModal } from './RequestDetailModal'; // YENİ: Modal'ı import et

export const RequestsTab = () => {
    const [requests, setRequests] = useState<ServiceRequest[]>([]);
    const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const response = await getAllRequestsForAdmin();
            setRequests(response.data);
        } catch (error) {
            console.error("Talepler getirilirken hata oluştu:", error);
        }
    };

    const handleOpenModal = (request: ServiceRequest) => {
        setSelectedRequest(request);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedRequest(null);
    };

    return (
        <Box>
            <Typography variant="h5" gutterBottom>Gelen Hizmet Talepleri</Typography>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Başlık</TableCell>
                            <TableCell>Kullanıcı</TableCell>
                            <TableCell>Tarih</TableCell>
                            <TableCell>Son Teklif</TableCell> {/* YENİ SÜTUN */}
                            <TableCell>Eylemler</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {requests.map((request) => {
                            // En son teklifi bul (tarihe göre sıralı geldiğini varsayarak)
                            const lastOffer = request.offers && request.offers.length > 0 
                                ? request.offers[request.offers.length - 1] 
                                : null;

                            return (
                                <TableRow key={request.id} hover sx={{ cursor: 'pointer' }}>
                                    <TableCell onClick={() => handleOpenModal(request)}>{request.title}</TableCell>
                                    <TableCell onClick={() => handleOpenModal(request)}>{request.user?.username || 'Bilinmiyor'}</TableCell>
                                    <TableCell onClick={() => handleOpenModal(request)}>{new Date(request.createdDate).toLocaleDateString()}</TableCell>
                                    <TableCell onClick={() => handleOpenModal(request)}>
                                        {/* Son teklif varsa fiyatını göster */}
                                        {lastOffer ? `${lastOffer.price.toFixed(2)} ₺` : 'Teklif Yok'}
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="outlined" size="small" onClick={() => handleOpenModal(request)}>
                                            Detay Gör / Teklif Ver
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            <RequestDetailModal
                request={selectedRequest}
                open={isModalOpen}
                onClose={handleCloseModal}
            />
        </Box>
    );
};