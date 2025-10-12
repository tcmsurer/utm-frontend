import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, CircularProgress, Alert, Select, MenuItem, InputLabel, FormControl, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { Usta, getUstalar } from '../../services/api';

interface UstaRehberiFormProps {
    // onSave fonksiyonu artık bir FormData nesnesi alacak
    onSave: (formData: FormData) => void;
    onCancel: () => void;
    loading: boolean;
    error: string | null;
    // Düzenleme için başlangıç verileri (şimdilik boş bırakıyoruz, ileride eklenebilir)
    // initialData?: any; 
}

const UstaRehberiForm: React.FC<UstaRehberiFormProps> = ({ onSave, onCancel, loading, error }) => {
    const [title, setTitle] = useState('');
    const [detailMediaType, setDetailMediaType] = useState<'IMAGE' | 'VIDEO'>('IMAGE');
    const [detailText, setDetailText] = useState('');
    const [selectedUstaId, setSelectedUstaId] = useState<string>('');
    const [ustalar, setUstalar] = useState<Usta[]>([]);
    
    // Dosya state'leri
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [detailMediaFile, setDetailMediaFile] = useState<File | null>(null);

    useEffect(() => {
        // Form yüklendiğinde aktif ustaları çek
        const fetchActiveUstas = async () => {
            try {
                const response = await getUstalar(); // Bu endpoint sadece aktif ustaları getiriyor
                setUstalar(response.data);
            } catch (err) {
                console.error("Aktif ustalar çekilemedi:", err);
            }
        };
        fetchActiveUstas();
    }, []);

    const handleThumbnailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setThumbnailFile(event.target.files[0]);
        }
    };

    const handleDetailMediaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setDetailMediaFile(event.target.files[0]);
        }
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        
        if (!thumbnailFile || !detailMediaFile || !selectedUstaId) {
            alert("Lütfen tüm alanları ve dosyaları doldurun.");
            return;
        }

        // Backend'e göndermek için FormData oluştur
        const formData = new FormData();
        const dto = {
            title,
            detailMediaType,
            detailText,
            ustaId: selectedUstaId
        };

        formData.append('dto', JSON.stringify(dto));
        formData.append('thumbnail', thumbnailFile);
        formData.append('detailMedia', detailMediaFile);

        onSave(formData);
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ mb: 2 }}>
                Yeni Usta Rehberi Kaydı
            </Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <Box component="form" onSubmit={handleSubmit}>
                <FormControl fullWidth margin="normal" required>
                    <InputLabel>İlişkili Usta</InputLabel>
                    <Select
                        value={selectedUstaId}
                        onChange={(e) => setSelectedUstaId(e.target.value)}
                        label="İlişkili Usta"
                    >
                        {ustalar.map((usta) => (
                            <MenuItem key={usta.id} value={usta.id}>
                                {usta.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                
                <TextField
                    label="Rehber Başlığı (Örn: Ahmet Usta'dan Parke Döşeme Sanatı)"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    fullWidth
                    required
                    margin="normal"
                />

                <Typography variant="subtitle1" sx={{ mt: 2 }}>Küçük Resim (Thumbnail)</Typography>
                <Button variant="contained" component="label" fullWidth>
                    Dosya Seç
                    <input type="file" accept="image/*" hidden onChange={handleThumbnailChange} />
                </Button>
                {thumbnailFile && <Typography variant="body2" sx={{ mt: 1 }}>Seçilen: {thumbnailFile.name}</Typography>}

                <FormControl component="fieldset" margin="normal">
                    <Typography variant="subtitle1">Detay Medya Türü</Typography>
                    <RadioGroup row value={detailMediaType} onChange={(e) => setDetailMediaType(e.target.value as 'IMAGE' | 'VIDEO')}>
                        <FormControlLabel value="IMAGE" control={<Radio />} label="Resim" />
                        <FormControlLabel value="VIDEO" control={<Radio />} label="Video" />
                    </RadioGroup>
                </FormControl>

                <Typography variant="subtitle1" sx={{ mt: 2 }}>Detay Medya Dosyası (Resim veya Video)</Typography>
                <Button variant="contained" component="label" fullWidth>
                    Dosya Seç
                    <input type="file" accept={detailMediaType === 'IMAGE' ? 'image/*' : 'video/*'} hidden onChange={handleDetailMediaChange} />
                </Button>
                {detailMediaFile && <Typography variant="body2" sx={{ mt: 1 }}>Seçilen: {detailMediaFile.name}</Typography>}

                <TextField
                    label="Detaylı Metin"
                    value={detailText}
                    onChange={(e) => setDetailText(e.target.value)}
                    fullWidth
                    required
                    multiline
                    rows={6}
                    margin="normal"
                />

                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <Button onClick={onCancel} color="secondary">
                        İptal
                    </Button>
                    <Button type="submit" variant="contained" disabled={loading}>
                        {loading ? <CircularProgress size={24} /> : 'Kaydet'}
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default UstaRehberiForm;