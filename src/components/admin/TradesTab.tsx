import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Switch, Alert, TablePagination, IconButton, Modal, TextField, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getUstalarForAdmin, createUsta, activateUsta, deactivateUsta, Usta } from '../../services/api';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';

const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', sm: 500 },
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

interface UstaWithStatus extends Usta {
    active: boolean;
    profileImageUrl?: string;
}

export const TradesTab: React.FC<{ active: boolean }> = ({ active }) => {
    const [ustalar, setUstalar] = useState<UstaWithStatus[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalElements, setTotalElements] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formLoading, setFormLoading] = useState(false);

    // Form state'leri
    const [newUstaName, setNewUstaName] = useState('');
    const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
    
    const navigate = useNavigate();

    const fetchUstalar = async () => {
        try {
            const response = await getUstalarForAdmin(page, rowsPerPage);
            setUstalar(response.data.content as UstaWithStatus[]);
            setTotalElements(response.data.totalElements);
        } catch (err) { setError("Ustalar yüklenemedi."); }
    };

    useEffect(() => { if (active) { fetchUstalar(); } }, [active, page, rowsPerPage]);

    const handleToggleActive = async (id: string, currentStatus: boolean) => {
        try {
            if (currentStatus) { await deactivateUsta(id); } else { await activateUsta(id); }
            fetchUstalar();
        } catch (err) { setError("Usta durumu güncellenemedi."); }
    };

    const handleOpenModal = () => {
        setNewUstaName('');
        setProfileImageFile(null);
        setError(null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => setIsModalOpen(false);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setProfileImageFile(event.target.files[0]);
        }
    };

    const handleSaveUsta = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!newUstaName.trim()) { setError("Usta adı boş olamaz."); return; }

        const formData = new FormData();
        formData.append('name', newUstaName);
        if (profileImageFile) {
            formData.append('profileImage', profileImageFile);
        }

        setFormLoading(true);
        setError(null);
        try {
            await createUsta(formData);
            handleCloseModal();
            fetchUstalar();
        } catch (err) { setError("Yeni usta oluşturulamadı."); } finally { setFormLoading(false); }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Usta Tanımları</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenModal}>
                    Yeni Usta Ekle
                </Button>
            </Box>
            
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Usta Adı</TableCell>
                            <TableCell align="center">Aktif Durumu</TableCell>
                            <TableCell align="right">İşlemler</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {ustalar.map((usta) => (
                            <TableRow key={usta.id} sx={{ '&:last-child td, &:last-child th': { border: 0 }, opacity: usta.active ? 1 : 0.5 }}>
                                <TableCell>{usta.name}</TableCell>
                                <TableCell align="center">
                                    <Switch checked={usta.active} onChange={() => handleToggleActive(usta.id, usta.active)} color="success" />
                                </TableCell>
                                <TableCell align="right">
                                    <IconButton size="small" sx={{ mr: 1 }} disabled> {/* Düzenleme ileride eklenebilir */}
                                        <EditIcon />
                                    </IconButton>
                                    <Button variant="outlined" size="small" startIcon={<PhotoLibraryIcon />} onClick={() => navigate(`/admin/usta-portfolio/${usta.id}`)}>
                                        Portfolyo
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination component="div" count={totalElements} page={page} onPageChange={(e, newPage) => setPage(newPage)} rowsPerPage={rowsPerPage} onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }} />

            <Modal open={isModalOpen} onClose={handleCloseModal}>
                <Box sx={modalStyle}>
                    <Typography variant="h6" component="h2">Yeni Usta Ekle</Typography>
                    <Box component="form" onSubmit={handleSaveUsta} sx={{ mt: 2 }}>
                        <TextField fullWidth required label="Usta Adı" value={newUstaName} onChange={e => setNewUstaName(e.target.value)} margin="normal" />
                        <Button variant="contained" component="label" fullWidth sx={{ mt: 1 }}>
                            Profil Resmi Seç (Opsiyonel)
                            <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                        </Button>
                        {profileImageFile && <Typography variant="body2" sx={{ mt: 1 }}>Seçilen: {profileImageFile.name}</Typography>}
                        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                            <Button onClick={handleCloseModal}>İptal</Button>
                            <Button type="submit" variant="contained" disabled={formLoading}>{formLoading ? <CircularProgress size={24} /> : 'Kaydet'}</Button>
                        </Box>
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
};