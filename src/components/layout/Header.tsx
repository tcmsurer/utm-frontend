import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AppBar, Toolbar, Typography, Button, Modal, Box, TextField, Tabs, Tab } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/banner.png'; // 1. Adım: Logoyu import et

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export const Header = () => {
  const [open, setOpen] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');

  const auth = useAuth();
  const navigate = useNavigate();

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setError('');
    setIsRegister(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isRegister) {
        await auth.register({ username, password, email, phone, address });
      } else {
        await auth.login({ username, password });
      }
      handleClose();
    } catch (err) {
      setError(isRegister ? 'Kayıt başarısız oldu.' : 'Kullanıcı adı veya şifre yanlış.');
    }
  };

  const handleLogout = () => {
    auth.logout();
    navigate('/');
  }

  return (
    <>
      <AppBar position="static" sx={{ background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)', boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)' }}>
        <Toolbar>
          
          {/* 2. Adım: Başlık kısmını logo ve metin içeren bir Box ile değiştir */}
          <Box component={Link} to="/" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
            <Box
              component="img"
              src={logo}
              alt="Usta Merkezi Logo"
              sx={{ height: 40, mr: 1.5 }} // Logo boyutu ve metinle arasındaki boşluk
            />
            <Typography variant="h6" component="div" sx={{ fontFamily: 'Poppins', fontWeight: 'bold' }}>
              Usta Tedarik Merkezi
            </Typography>
          </Box>

          <Button color="inherit" component={Link} to="/hakkimizda">Hakkımızda</Button>
          <Button color="inherit" component={Link} to="/iletisim">İletişim</Button>

          {auth.user ? (
            <>
              <Button color="inherit" component={Link} to="/taleplerim">Taleplerim</Button>
              <Typography sx={{ mx: 2 }}>Hoşgeldin, {auth.user.sub}</Typography>
              <Button color="inherit" onClick={handleLogout}>Çıkış Yap</Button>
            </>
          ) : (
            <Button color="inherit" onClick={handleOpen}>Giriş Yap / Kayıt Ol</Button>
          )}
        </Toolbar>
      </AppBar>

      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <Tabs value={isRegister ? 1 : 0} onChange={() => setIsRegister(!isRegister)} centered>
            <Tab label="Giriş Yap" />
            <Tab label="Kayıt Ol" />
          </Tabs>
          <Typography component="h1" variant="h5" sx={{ mt: 2, textAlign: 'center' }}>
            {isRegister ? 'Kayıt Ol' : 'Giriş Yap'}
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            {error && <Typography color="error" align="center">{error}</Typography>}
            <TextField margin="normal" required fullWidth label="Kullanıcı Adı" value={username} onChange={e => setUsername(e.target.value)} />
            <TextField margin="normal" required fullWidth label="Şifre" type="password" value={password} onChange={e => setPassword(e.target.value)} />
            {isRegister && (
              <>
                <TextField margin="normal" required fullWidth label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
                <TextField margin="normal" required fullWidth label="Telefon" value={phone} onChange={e => setPhone(e.target.value)} />
                <TextField margin="normal" required fullWidth label="Adres" value={address} onChange={e => setAddress(e.target.value)} />
              </>
            )}
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              {isRegister ? 'Kayıt Ol' : 'Giriş Yap'}
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};