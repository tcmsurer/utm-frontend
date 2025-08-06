import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Pagination, CircularProgress, Paper, Table, TableContainer, TableHead, TableBody, TableRow, TableCell, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { getUstalarForAdmin, createUstaForAdmin, deleteUstaForAdmin } from '../../services/api';
import type { Usta, Page } from '../../services/api';

interface TabProps {
    active: boolean;
}

export const TradesTab = ({ active }: TabProps) => {
    const [ustaPage, setUstaPage] = useState<Page<Usta> | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [newUstaName, setNewUstaName] = useState('');

    useEffect(() => {
        if (active) {
            fetchUstalar(currentPage - 1);
        }
    }, [currentPage, active]);

    const fetchUstalar = async (page: number) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getUstalarForAdmin(page, 10);
            setUstaPage(response.data);
        } catch (err) {
            console.error("Ustalar getirilirken hata oluştu:", err);
            setError("Usta listesi yüklenirken bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    const handleAddUsta = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newUstaName.trim()) return;
        try {
            await createUstaForAdmin({ name: newUstaName });
            setNewUstaName('');
            if (currentPage === 1) {
                fetchUstalar(0);
            } else {
                setCurrentPage(1);
            }
        } catch (error) {
            console.error("Usta eklenirken hata oluştu:", error);
            alert('Usta eklenemedi. Yetkiniz var mı?');
        }
    };

    const handleDeleteUsta = async (id: string) => {
        if (window.confirm('Bu usta tanımını silmek istediğinizden emin misiniz?')) {
            try {
                await deleteUstaForAdmin(id);
                fetchUstalar(currentPage - 1);
            } catch (error) {
                console.error("Usta silinirken hata oluştu:", error);
                alert('Usta silinemedi.');
            }
        }
    };

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setCurrentPage(value);
    };

    if (loading) { return <CircularProgress />; }
    if (error) { return <Typography color="error">{error}</Typography>; }

    return (
        <Box>
            <Typography variant="h5" gutterBottom>Usta Tanımlarını Yönet</Typography>
            <Box component="form" onSubmit={handleAddUsta} sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <TextField label="Yeni Usta Adı" variant="outlined" value={newUstaName} onChange={(e) => setNewUstaName(e.target.value)} size="small" sx={{ flexGrow: 1 }} />
                <Button type="submit" variant="contained">Ekle</Button>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Usta Adı</TableCell>
                            <TableCell align="right">Eylemler</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {ustaPage && ustaPage.content.length > 0 ? (
                            ustaPage.content.map((usta) => (
                                <TableRow key={usta.id}>
                                    <TableCell>{usta.name}</TableCell>
                                    <TableCell align="right">
                                        <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteUsta(usta.id)}><DeleteIcon /></IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={2} align="center">Usta tanımı bulunamadı.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, p: 2 }}>
                <Pagination count={ustaPage?.totalPages || 0} page={currentPage} onChange={handlePageChange} color="primary" disabled={!ustaPage || ustaPage.totalPages === 0} />
            </Box>
        </Box>
    );
};