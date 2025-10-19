import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Paper, CircularProgress, Alert, Modal, List, ListItem, ListItemText, ListItemAvatar, Avatar, IconButton, TextField, RadioGroup, FormControlLabel, Radio, FormControl, Container } from '@mui/material';
import { Header } from '../layout/Header';
import { getPortfolioForAdmin, createPortfolioItem, deletePortfolioItem, RehberIcerik } from '../../services/api';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', sm: 600 },
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    maxHeight: '90vh',
    overflowY: 'auto'
};

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const UstaPortfolioYonetimi: React.FC = () => {
    const { ustaId } = useParams<{ ustaId: string }>();
    const navigate = useNavigate();
    const [portfolio, setPortfolio] = useState<RehberIcerik[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Form state'leri
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [mediaType, setMediaType] = useState<'IMAGE' | 'VIDEO'>('IMAGE');
    const [mediaFile, setMediaFile] = useState<File | null>(null);
    const [formLoading, setFormLoading] = useState(false);

    const fetchPortfolio = async () => {
        if (!ustaId) return;
        setLoading(true);
        try {
            const response = await getPortfolioForAdmin(ustaId);
            setPortfolio(response.data);
        } catch (err) { setError('Portfolyo yüklenemedi.'); } finally { setLoading(false); }
    };

    useEffect(() => { fetchPortfolio(); }, [ustaId]);

    const handleOpenModal = () => {
        setTitle(''); setDescription(''); setMediaType('IMAGE'); setMediaFile(null);
        setError(null); setIsModalOpen(true);
    };
    const handleCloseModal = () => setIsModalOpen(false);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) setMediaFile(event.target.files[0]);
    };

    const handleSave = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!ustaId || !mediaFile) { setError("Lütfen tüm alanları doldurun."); return; }

        const formData = new FormData();
        const dto = { title, description, mediaType };
        formData.append('dto', JSON.stringify(dto));
        formData.append('mediaFile', mediaFile);

        setFormLoading(true); setError(null);
        try {
            await createPortfolioItem(ustaId, formData);
            handleCloseModal(); fetchPortfolio();
        } catch (err) { setError('Portfolyo kaydı oluşturulamadı.'); } finally { setFormLoading(false); }
    };
    
    const handleDelete = async (contentId: string) => {
        if(window.confirm('Bu içeriği silmek istediğinizden emin misiniz?')){
            try {
                await deletePortfolioItem(contentId);
                fetchPortfolio();
            } catch (err) { setError('İçerik silinemedi.'); }
        }
    };

    if (loading) return <CircularProgress />;

    return (
        <div>
            <Header />
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/admin')}>
                    Admin Paneline Geri Dön
                </Button>
                <Paper sx={{ p: 2, mt: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h5">Portfolyo Yönetimi</Typography>
                        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenModal}>
                            Yeni İçerik Ekle
                        </Button>
                    </Box>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    <List>
                        {portfolio.map(item => (
                            <ListItem key={item.id} secondaryAction={
                                <IconButton edge="end" onClick={() => handleDelete(item.id)}><DeleteIcon /></IconButton>
                            }>
                                <ListItemAvatar>
                                    <Avatar variant="square" src={`${API_URL}/api/files/${item.mediaUrl}`} />
                                </ListItemAvatar>
                                <ListItemText primary={item.title} secondary={(item.description || '').substring(0, 100) + '...'} />
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            </Container>

            <Modal open={isModalOpen} onClose={handleCloseModal}>
                <Box sx={modalStyle}>
                    <Typography variant="h6" component="h2">Yeni Portfolyo İçeriği</Typography>
                    <Box component="form" onSubmit={handleSave} sx={{ mt: 2 }}>
                        <TextField fullWidth required label="Başlık" value={title} onChange={e => setTitle(e.target.value)} margin="normal" />
                        <TextField fullWidth multiline rows={4} label="Açıklama" value={description} onChange={e => setDescription(e.target.value)} margin="normal" />
                        <FormControl component="fieldset" margin="normal">
                            <RadioGroup row value={mediaType} onChange={e => setMediaType(e.target.value as 'IMAGE' | 'VIDEO')}>
                                <FormControlLabel value="IMAGE" control={<Radio />} label="Resim" />
                                <FormControlLabel value="VIDEO" control={<Radio />} label="Video" />
                            </RadioGroup>
                        </FormControl>
                        <Button variant="contained" component="label" fullWidth>
                            Medya Dosyası Seç
                            <input type="file" hidden required accept={mediaType === 'IMAGE' ? 'image/*' : 'video/*'} onChange={handleFileChange} />
                        </Button>
                        {mediaFile && <Typography variant="body2" sx={{ mt: 1 }}>Seçilen: {mediaFile.name}</Typography>}
                        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                            <Button onClick={handleCloseModal}>İptal</Button>
                            <Button type="submit" variant="contained" disabled={formLoading}>{formLoading ? <CircularProgress size={24} /> : 'Kaydet'}</Button>
                        </Box>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
};

export default UstaPortfolioYonetimi;