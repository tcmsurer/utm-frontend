import React, { useState, useEffect, useMemo } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Pagination, CircularProgress, FormControlLabel, Checkbox, Chip } from '@mui/material';
import { getAllRequestsForAdmin, closeRequestByAdmin } from '../../services/api';
import type { ServiceRequest, Page } from '../../services/api';
import { RequestDetailModal } from './RequestDetailModal';

interface TabProps { 
    active: boolean; 
}

export const RequestsTab = ({ active }: TabProps) => {
    // --- 1. Adım: Tüm hook'lar (useState, useMemo, useEffect) en başta olmalı ---
    const [requestsPage, setRequestsPage] = useState<Page<ServiceRequest> | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showClosed, setShowClosed] = useState<boolean>(false);
    const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const filteredContent = useMemo(() => {
        if (!requestsPage?.content) return [];
        return requestsPage.content.filter(req => showClosed ? true : req.status === 'OPEN');
    }, [requestsPage, showClosed]);

    useEffect(() => {
        if (active) {
            fetchRequests(currentPage - 1);
        }
    }, [currentPage, active]);

    // --- 2. Adım: Diğer fonksiyonlar hook'lardan sonra gelir ---
    const fetchRequests = async (page: number) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getAllRequestsForAdmin(page, 10);
            setRequestsPage(response.data);
        } catch (error) {
            console.error("Talepler getirilirken hata oluştu:", error);
            setError("Talepler yüklenirken bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    const handleCloseRequest = async (id: string) => {
        if (window.confirm("Bu talebi kapatmak istediğinizden emin misiniz?")) {
            try {
                await closeRequestByAdmin(id);
                fetchRequests(currentPage - 1);
            } catch (error) {
                alert("Talep kapatılırken bir hata oluştu.");
            }
        }
    };

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setCurrentPage(value);
    };

    const handleOpenModal = (request: ServiceRequest) => {
        setSelectedRequest(request);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedRequest(null);
        if(active){ fetchRequests(currentPage - 1); }
    };

    // --- 3. Adım: Koşullu return'ler en sonda gelir ---
    if (loading && !requestsPage) { return <CircularProgress />; }
    if (error) { return <Typography color="error">{error}</Typography>; }

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5" gutterBottom>Gelen Hizmet Talepleri</Typography>
                <FormControlLabel
                    control={<Checkbox checked={showClosed} onChange={(e) => setShowClosed(e.target.checked)} />}
                    label="Kapalı Talepleri Göster"
                />
            </Box>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Başlık</TableCell>
                            <TableCell>Müşteri</TableCell>
                            <TableCell>Tarih</TableCell>
                            <TableCell>Durum</TableCell>
                            <TableCell>Eylemler</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredContent.length > 0 ? (
                            filteredContent.map((request) => (
                                <TableRow key={request.id} sx={{ opacity: request.status !== 'OPEN' ? 0.6 : 1 }}>
                                    <TableCell>{request.title}</TableCell>
                                    <TableCell>{request.user.fullName}</TableCell>
                                    <TableCell>{new Date(request.createdDate).toLocaleString('tr-TR')}</TableCell>
                                    <TableCell>
                                        <Chip label={request.status} color={request.status === 'OPEN' ? 'primary' : 'default'} size="small" />
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="outlined" size="small" onClick={() => handleOpenModal(request)} sx={{ mr: 1 }}>
                                            Detay Gör
                                        </Button>
                                        {request.status === 'OPEN' && (
                                            <Button variant="contained" color="error" size="small" onClick={() => handleCloseRequest(request.id)}>
                                                Kapat
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} align="center">Gösterilecek talep bulunamadı.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, p: 2 }}>
                <Pagination count={requestsPage?.totalPages || 0} page={currentPage} onChange={handlePageChange} color="primary" />
            </Box>
            <RequestDetailModal request={selectedRequest} open={isModalOpen} onClose={handleCloseModal} />
        </Box>
    );
};