import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, IconButton, Typography, Select, MenuItem, FormControl, InputLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { getSorularForAdmin, createSoruForAdmin, deleteSoruForAdmin, getUstalar } from '../../services/api';
import type { Soru, Usta } from '../../services/api';

export const QuestionsTab = () => {
    const [sorular, setSorular] = useState<Soru[]>([]);
    const [ustalar, setUstalar] = useState<Usta[]>([]);
    const [newSoru, setNewSoru] = useState({ ustaId: '', question: '', type: 'text', options: '', order: 0 });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const sorularRes = await getSorularForAdmin();
            const ustalarRes = await getUstalar();
            setSorular(sorularRes.data);
            setUstalar(ustalarRes.data);
        } catch (error) {
            console.error("Veri getirilirken hata:", error);
        }
    };

    const handleAddSoru = async (e: React.FormEvent) => {
        e.preventDefault();
        const soruData = {
            question: newSoru.question,
            type: newSoru.type,
            order: newSoru.order,
            options: newSoru.options.split(',').map(opt => opt.trim()),
            usta: { id: newSoru.ustaId }
        };

        try {
            await createSoruForAdmin(soruData);
            setNewSoru({ ustaId: '', question: '', type: 'text', options: '', order: 0 });
            fetchData();
        } catch (error) {
            console.error("Soru eklenirken hata:", error);
            alert('Soru eklenemedi.');
        }
    };

    const handleDeleteSoru = async (id: string) => {
        if (window.confirm('Bu soruyu silmek istediğinizden emin misiniz?')) {
            try {
                await deleteSoruForAdmin(id);
                fetchData();
            } catch (error) {
                console.error("Soru silinirken hata:", error);
                alert('Soru silinemedi.');
            }
        }
    };

    return (
        <Box>
            <Typography variant="h5" gutterBottom>Soru Tanımlarını Yönet</Typography>
            <Paper component="form" onSubmit={handleAddSoru} sx={{ p: 2, mb: 3, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                <FormControl fullWidth>
                    <InputLabel>Usta Tipi</InputLabel>
                    <Select value={newSoru.ustaId} label="Usta Tipi" onChange={e => setNewSoru({...newSoru, ustaId: e.target.value})}>
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
                <Button type="submit" variant="contained" sx={{ gridColumn: 'span 2' }}>Yeni Soru Ekle</Button>
            </Paper>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow><TableCell>Usta</TableCell><TableCell>Soru</TableCell><TableCell>Tip</TableCell><TableCell>Sıra</TableCell><TableCell>Eylemler</TableCell></TableRow>
                    </TableHead>
                    <TableBody>
                        {sorular.map(s => (
                            <TableRow key={s.id}>
                                <TableCell>{s.usta.name}</TableCell>
                                <TableCell>{s.question}</TableCell>
                                <TableCell>{s.type}</TableCell>
                                <TableCell>{s.order}</TableCell>
                                <TableCell><IconButton onClick={() => handleDeleteSoru(s.id)}><DeleteIcon /></IconButton></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};