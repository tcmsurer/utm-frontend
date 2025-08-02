import React, { useState, useEffect } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { getMailLogsForAdmin } from '../../services/api';
import type { MailLog } from '../../services/api';

// DİKKAT: Başına "export" eklendi.
export const MailLogTab = () => {
    const [logs, setLogs] = useState<MailLog[]>([]);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await getMailLogsForAdmin();
                setLogs(response.data);
            } catch (error) {
                console.error("Mail logları getirilirken hata oluştu:", error);
            }
        };
        fetchLogs();
    }, []);

    return (
        <Box>
            <Typography variant="h5" gutterBottom>Gönderilen E-Posta Kayıtları</Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow><TableCell>Talep ID</TableCell><TableCell>Alıcı Email</TableCell><TableCell>Konu</TableCell><TableCell>Tarih</TableCell></TableRow>
                    </TableHead>
                    <TableBody>
                        {logs.map((log) => (
                            <TableRow key={log.id}>
                                <TableCell>{log.serviceRequest?.id || 'N/A'}</TableCell>
                                <TableCell>{log.email}</TableCell>
                                <TableCell>{log.subject}</TableCell>
                                <TableCell>{new Date(log.sentDate).toLocaleString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};