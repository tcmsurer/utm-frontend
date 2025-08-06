import React, { useState, useEffect } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Pagination, CircularProgress } from '@mui/material';
import { getMailLogsForAdmin } from '../../services/api';
import type { MailLog, Page } from '../../services/api';

interface TabProps {
    active: boolean;
}

export const MailLogTab = ({ active }: TabProps) => {
    const [logsPage, setLogsPage] = useState<Page<MailLog> | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (active) {
            fetchLogs(currentPage - 1);
        }
    }, [currentPage, active]);

    const fetchLogs = async (page: number) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getMailLogsForAdmin(page, 10);
            setLogsPage(response.data);
        } catch (err) {
            console.error("Mail logları getirilirken hata oluştu:", err);
            setError("E-posta kayıtları yüklenirken bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setCurrentPage(value);
    };

    if (loading) { return <CircularProgress />; }
    if (error) { return <Typography color="error">{error}</Typography>; }

    return (
        <Box>
            <Typography variant="h5" gutterBottom>Gönderilen E-Posta Kayıtları</Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Talep Başlığı</TableCell>
                            <TableCell>Alıcı Email</TableCell>
                            <TableCell>Konu</TableCell>
                            <TableCell>Tarih</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {logsPage && logsPage.content.length > 0 ? (
                            logsPage.content.map((log) => (
                                <TableRow key={log.id}>
                                    <TableCell>{log.requestTitle}</TableCell>
                                    <TableCell>{log.email}</TableCell>
                                    <TableCell>{log.subject}</TableCell>
                                    <TableCell>{new Date(log.sentDate).toLocaleString('tr-TR')}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} align="center">E-posta kaydı bulunamadı.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, p: 2 }}>
                <Pagination count={logsPage?.totalPages || 0} page={currentPage} onChange={handlePageChange} color="primary" disabled={!logsPage || logsPage.totalPages === 0} />
            </Box>
        </Box>
    );
};