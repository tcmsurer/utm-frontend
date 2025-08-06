import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Typography, Select, MenuItem, FormControl, InputLabel, Pagination, CircularProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { getSorularForAdmin, createSoruForAdmin, deleteSoruForAdmin, getUstalar } from '../../services/api';
import type { Soru, Usta, Page } from '../../services/api';

interface TabProps {
    active: boolean;
}

export const QuestionsTab = ({ active }: TabProps) => {
    const [soruPage, setSoruPage] = useState<Page<Soru> | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [ustalar, setUstalar] = useState<Usta[]>([]);
    const [newSoru, setNewSoru] = useState({ ustaId: '', question: '', type: 'text', options: '', order: 0 });

    useEffect(() => {
        if (active) {
            fetchData(currentPage - 1);
        }
    }, [currentPage, active]);

    const fetchData = async (page: number) => {
        setLoading(true);
        setError(null);
        try {
            const [sorularRes, ustalarRes] = await Promise.all([
                getSorularForAdmin(page, 10),
                getUstalar() // Formdaki dropdown için usta listesini her zaman çekiyoruz
            ]);
            setSoruPage(sorularRes.data);
            setUstalar(ustalarRes.data);
        } catch (err) {
            console.error("Veri getirilirken hata:", err);
            setError("Sorular veya ustalar yüklenirken bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    const handleAddSoru = async (e: React.FormEvent) => {
        e.preventDefault();
        const usta = ustalar.find(u => u.id === newSoru.ustaId);
        if (!usta) {
            alert("Lütfen bir usta tipi seçin.");
            return;
        }

        const soruData = {
            question: newSoru.question,
            type: newSoru.type,
            order: newSoru.order,
            options: newSoru.type === 'select' ? newSoru.options.split(',').map(opt => opt.trim()) : [],
            usta: usta
        };

        try {
            await createSoruForAdmin(soruData);
            setNewSoru({ ustaId: '', question: '', type: 'text', options: '', order: 0 });
            if (currentPage === 1) {
                fetchData(0);
            } else {
                setCurrentPage(1);
            }
        } catch (error) {
            console.error("Soru eklenirken hata:", error);
            alert('Soru eklenemedi.');
        }
    };

    const handleDeleteSoru = async (id: string) => {
        if (window.confirm('Bu soruyu silmek istediğinizden emin misiniz?')) {
            try {
                await deleteSoruForAdmin(id);
                fetchData(currentPage - 1);
            } catch (error) {
                console.error("Soru silinirken hata:", error);
                alert('Soru silinemedi.');
            }
        }
    };
    
    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setCurrentPage(value);
    };

    if (loading && !soruPage) { return <CircularProgress />; }
    if (error) { return <Typography color="error" sx={{ p: 2 }}>{error}</Typography>; }

    return (
        <Box>
            <Typography variant="h5" gutterBottom>Soru Tanımlarını Yönet</Typography>
            <Paper component="form" onSubmit={handleAddSoru} sx={{ p: 2, mb: 3, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
                <FormControl fullWidth>
                    <InputLabel>Usta Tipi</InputLabel>
                    <Select value={newSoru.ustaId} label="Usta Tipi" onChange={e => setNewSoru({...newSoru, ustaId: e.target.value})} required>
                        {ustalar.map(u => <MenuItem key={u.id} value={u.id}>{u.name}</MenuItem>)}
                    </Select>
                </FormControl>
                <TextField label="Soru Metni" value={newSoru.question} onChange={e => setNewSoru({...newSoru, question: e.target.value})} required />
                <FormControl fullWidth>
                    <InputLabel>Soru Tipi</InputLabel>
                    <Select value={newSoru.type} label="Soru Tipi" onChange={e => setNewSoru({...newSoru, type: e.target.value})}>
                        <MenuItem value="text">Metin</MenuItem>
                        <MenuItem value="number">Sayı</MenuItem>
                        <MenuItem value="select">Seçenekli</MenuItem>
                    </Select>
                </FormControl>
                <TextField label="Seçenekler (virgülle ayırın)" value={newSoru.options} onChange={e => setNewSoru({...newSoru, options: e.target.value})} disabled={newSoru.type !== 'select'} />
                <TextField label="Sıra" type="number" value={newSoru.order} onChange={e => setNewSoru({...newSoru, order: parseInt(e.target.value) || 0})} />
                <Button type="submit" variant="contained" sx={{ gridColumn: '1 / -1' }}>Yeni Soru Ekle</Button>
            </Paper>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Usta</TableCell>
                            <TableCell>Soru</TableCell>
                            <TableCell>Tip</TableCell>
                            <TableCell>Sıra</TableCell>
                            <TableCell align="right">Eylemler</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {soruPage && soruPage.content.length > 0 ? (
                            soruPage.content.map(s => (
                                <TableRow key={s.id}>
                                    <TableCell>{s.usta.name}</TableCell>
                                    <TableCell>{s.question}</TableCell>
                                    <TableCell>{s.type}</TableCell>
                                    <TableCell>{s.order}</TableCell>
                                    <TableCell align="right"><IconButton onClick={() => handleDeleteSoru(s.id)}><DeleteIcon /></IconButton></TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} align="center">Soru tanımı bulunamadı.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, p: 2 }}>
                <Pagination count={soruPage?.totalPages || 0} page={currentPage} onChange={handlePageChange} color="primary" disabled={!soruPage || soruPage.totalPages === 0} />
            </Box>
        </Box>
    );
};