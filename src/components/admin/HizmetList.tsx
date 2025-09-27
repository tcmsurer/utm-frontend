import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, CircularProgress, Alert, Modal } from '@mui/material';
import { getAdminHizmetler, deleteHizmet, createHizmet, updateHizmet, Hizmet } from '../../services/api';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import HizmetForm from './HizmetForm';

const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', sm: 600 },
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

const HizmetList: React.FC = () => {
    const [hizmetler, setHizmetler] = useState<Hizmet[]>([]);
    const [loading, setLoading] = useState(true);
    const [formLoading, setFormLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingHizmet, setEditingHizmet] = useState<Hizmet | null>(null);

    const fetchHizmetler = async () => {
        setLoading(true);
        try {
            const response = await getAdminHizmetler();
            setHizmetler(response.data);
        } catch (err) {
            setError('Hizmetler yüklenirken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHizmetler();
    }, []);

    const handleOpenModal = (hizmet: Hizmet | null = null) => {
        setEditingHizmet(hizmet);
        setIsModalOpen(true);
        setError(null);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingHizmet(null);
    };

    const handleSave = async (hizmetData: Hizmet) => {
        setFormLoading(true);
        setError(null);
        try {
            if (editingHizmet && hizmetData.id) {
                await updateHizmet(hizmetData.id, hizmetData);
            } else {
                await createHizmet(hizmetData);
            }
            handleCloseModal();
            fetchHizmetler(); // Listeyi yenile
        } catch (err) {
            setError('Hizmet kaydedilirken bir hata oluştu.');
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Bu hizmeti silmek istediğinizden emin misiniz?')) {
            try {
                await deleteHizmet(id);
                fetchHizmetler(); // Listeyi yenile
            } catch (err) {
                setError('Hizmet silinirken bir hata oluştu.');
            }
        }
    };

    if (loading) return <CircularProgress />;

    return (
        <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5">Hizmet Yönetimi</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenModal()}
                >
                    Yeni Hizmet Ekle
                </Button>
            </Box>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Başlık</TableCell>
                            <TableCell>Video URL</TableCell>
                            <TableCell align="right">İşlemler</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {hizmetler.map((hizmet) => (
                            <TableRow key={hizmet.id}>
                                <TableCell>{hizmet.title}</TableCell>
                                <TableCell>{hizmet.videoUrl}</TableCell>
                                <TableCell align="right">
                                    <IconButton onClick={() => handleOpenModal(hizmet)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(hizmet.id!)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Modal open={isModalOpen} onClose={handleCloseModal}>
                <Box sx={modalStyle}>
                    <HizmetForm
                        hizmet={editingHizmet}
                        onSave={handleSave}
                        onCancel={handleCloseModal}
                        loading={formLoading}
                        error={error}
                    />
                </Box>
            </Modal>
        </Paper>
    );
};

export default HizmetList;