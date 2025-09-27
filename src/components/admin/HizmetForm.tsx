import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, CircularProgress, Alert } from '@mui/material';
import { Hizmet } from '../../services/api';

interface HizmetFormProps {
    hizmet: Hizmet | null; // Düzenlenecek hizmet veya yeni için null
    onSave: (hizmetData: Hizmet) => void;
    onCancel: () => void;
    loading: boolean;
    error: string | null;
}

const HizmetForm: React.FC<HizmetFormProps> = ({ hizmet, onSave, onCancel, loading, error }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [videoUrl, setVideoUrl] = useState('');

    useEffect(() => {
        // Eğer düzenleme modundaysak, formu mevcut hizmet bilgileriyle doldur
        if (hizmet) {
            setTitle(hizmet.title);
            setDescription(hizmet.description);
            setVideoUrl(hizmet.videoUrl);
        } else {
            // Yeni ekleme modundaysak formu temizle
            setTitle('');
            setDescription('');
            setVideoUrl('');
        }
    }, [hizmet]);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        onSave({ id: hizmet?.id, title, description, videoUrl });
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ mb: 2 }}>
                {hizmet ? 'Hizmeti Düzenle' : 'Yeni Hizmet Ekle'}
            </Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <Box component="form" onSubmit={handleSubmit}>
                <TextField
                    label="Hizmet Başlığı"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    fullWidth
                    required
                    margin="normal"
                />
                <TextField
                    label="Video URL (YouTube linkini yapıştırın)"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    fullWidth
                    required
                    margin="normal"
                />
                <TextField
                    label="Açıklama"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    fullWidth
                    required
                    multiline
                    rows={4}
                    margin="normal"
                />
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <Button onClick={onCancel} color="secondary">
                        İptal
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : (hizmet ? 'Güncelle' : 'Kaydet')}
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default HizmetForm;