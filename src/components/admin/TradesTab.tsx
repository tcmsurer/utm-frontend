import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, List, ListItem, ListItemText, IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { getUstalar, createUstaForAdmin, deleteUstaForAdmin } from '../../services/api';
import type { Usta } from '../../services/api';

export const TradesTab = () => {
    const [ustalar, setUstalar] = useState<Usta[]>([]);
    const [newUstaName, setNewUstaName] = useState('');

    useEffect(() => {
        fetchUstalar();
    }, []);

    const fetchUstalar = async () => {
        try {
            const response = await getUstalar();
            setUstalar(response.data);
        } catch (error) {
            console.error("Ustalar getirilirken hata oluştu:", error);
        }
    };

    const handleAddUsta = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newUstaName.trim()) return;
        try {
            await createUstaForAdmin({ name: newUstaName });
            setNewUstaName('');
            fetchUstalar(); // Listeyi yenile
        } catch (error) {
            console.error("Usta eklenirken hata oluştu:", error);
            alert('Usta eklenemedi. Yetkiniz var mı?');
        }
    };

    const handleDeleteUsta = async (id: string) => {
        if (window.confirm('Bu usta tanımını silmek istediğinizden emin misiniz?')) {
            try {
                await deleteUstaForAdmin(id);
                fetchUstalar(); // Listeyi yenile
            } catch (error) {
                console.error("Usta silinirken hata oluştu:", error);
                alert('Usta silinemedi.');
            }
        }
    };

    return (
        <Box>
            <Typography variant="h5" gutterBottom>Usta Tanımlarını Yönet</Typography>
            <Box component="form" onSubmit={handleAddUsta} sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                    label="Yeni Usta Adı"
                    variant="outlined"
                    value={newUstaName}
                    onChange={(e) => setNewUstaName(e.target.value)}
                    size="small"
                />
                <Button type="submit" variant="contained">Ekle</Button>
            </Box>
            <List>
                {ustalar.map((usta) => (
                    <ListItem
                        key={usta.id}
                        secondaryAction={
                            <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteUsta(usta.id)}>
                                <DeleteIcon />
                            </IconButton>
                        }
                    >
                        <ListItemText primary={usta.name} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};