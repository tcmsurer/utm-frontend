import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AppBar, Toolbar, Typography, Button, Modal, Box, TextField, Tabs, Tab, useTheme, useMediaQuery, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText, Divider, Menu, MenuItem, Alert } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/banner.png';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PhoneIcon from '@mui/icons-material/Phone';
import { forgotPassword } from '../../services/api';

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
  const [forgotPasswordView, setForgotPasswordView] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const auth = useAuth();
  const navigate = useNavigate();

  const handleOpen = () => { setForgotPasswordView(false); setOpen(true); };
  const handleClose = () => { setOpen(false); setError(''); setSuccess(''); setIsRegister(false); };
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      if (isRegister) {
        await auth.register({ fullName, username, password, email, phone, address });
      } else {
        await auth.login({ username, password });
      }
      handleClose();
    } catch (err) {
      setError(isRegister ? 'Kayıt başarısız oldu.' : 'Kullanıcı adı veya şifre yanlış.');
    }
  };
  
  const handleForgotPassword = async () => {
    setError(''); setSuccess('');
    try {
        const response = await forgotPassword(email);
        setSuccess(response.data);
        setTimeout(() => {
            handleClose();
        }, 3000);
    } catch (err) {
        setError("Bir hata oluştu, lütfen tekrar deneyin.");
    }
  };

  const handleLogout = () => { handleMenuClose(); auth.logout(); navigate('/'); };

  const renderDesktopMenu = () => (
    <>
      <Button color="inherit" component={Link} to="/">Usta Bul</Button>
      <Button color="inherit" component={Link} to="/hizmetlerimiz">Hizmetlerimiz</Button>
      <Button color="inherit" component={Link} to="/hakkimizda">Hakkımızda</Button>
      <Button color="inherit" component={Link} to="/iletisim">İletişim</Button>

      <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
          <Button 
            href="tel:+905055440166" 
            startIcon={<PhoneIcon />}
            variant="contained"
            sx={{ 
              color: '#0D47A1',
              backgroundColor: '#FFC107',
              borderRadius: '20px',
              px: 2,
              '&:hover': {
                backgroundColor: '#FFD54F',
              }
            }}
          >
            +90 505 544 01 66
          </Button>
      </Box>

      {auth.user ? (
        <div>
          <Button onClick={handleMenu} color="inherit" startIcon={<AccountCircleIcon />}>
            {auth.userProfile?.fullName || auth.user.sub}
          </Button>
          <Menu
              anchorEl={anchorEl} open={menuOpen} onClose={handleMenuClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
              <MenuItem onClick={handleMenuClose} component={Link} to="/profilim">Profilim</MenuItem>
              {auth.isAdmin ? (
                  <MenuItem onClick={handleMenuClose} component={Link} to="/admin">Admin Konsolu</MenuItem>
              ) : (
                  <MenuItem onClick={handleMenuClose} component={Link} to="/taleplerim">Taleplerim</MenuItem>
              )}
              <Divider />
              <MenuItem onClick={handleLogout}>Çıkış Yap</MenuItem>
          </Menu>
        </div>
      ) : (
        <Button color="inherit" onClick={handleOpen}>Giriş Yap / Kayıt Ol</Button>
      )}
    </>
  );

  const renderMobileMenu = () => (
    <>
      <IconButton color="inherit" edge="end" onClick={() => setDrawerOpen(true)}><MenuIcon /></IconButton>
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 250 }} role="presentation" onClick={() => setDrawerOpen(false)}>
          <List>
            {auth.user && auth.userProfile && (
              <>
                <ListItem><ListItemText primary={auth.userProfile.fullName} secondary={auth.userProfile.email} /></ListItem>
                <Divider />
              </>
            )}
            <ListItem disablePadding component={Link} to="/" sx={{ color: 'inherit' }}><ListItemButton><ListItemText primary="Usta Bul" /></ListItemButton></ListItem>
            <ListItem disablePadding component={Link} to="/hizmetlerimiz" sx={{ color: 'inherit' }}><ListItemButton><ListItemText primary="Hizmetlerimiz" /></ListItemButton></ListItem>
            <ListItem disablePadding component={Link} to="/hakkimizda" sx={{ color: 'inherit' }}><ListItemButton><ListItemText primary="Hakkımızda" /></ListItemButton></ListItem>
            <ListItem disablePadding component={Link} to="/iletisim" sx={{ color: 'inherit' }}><ListItemButton><ListItemText primary="İletişim" /></ListItemButton></ListItem>
            <Divider />
            {auth.user ? (
              <>
                <ListItem disablePadding component={Link} to="/profilim" sx={{ color: 'inherit' }}><ListItemButton><ListItemText primary="Profilim" /></ListItemButton></ListItem>
                {auth.isAdmin ? (
                  <ListItem disablePadding component={Link} to="/admin" sx={{ color: 'inherit' }}><ListItemButton><ListItemText primary="Admin Konsolu" /></ListItemButton></ListItem>
                ) : (
                  <ListItem disablePadding component={Link} to="/taleplerim" sx={{ color: 'inherit' }}><ListItemButton><ListItemText primary="Taleplerim" /></ListItemButton></ListItem>
                )}
                <ListItem disablePadding onClick={handleLogout} sx={{ color: 'inherit' }}><ListItemButton><ListItemText primary="Çıkış Yap" /></ListItemButton></ListItem>
              </>
            ) : (
              <ListItem disablePadding onClick={handleOpen} sx={{ color: 'inherit' }}><ListItemButton><ListItemText primary="Giriş Yap / Kayıt Ol" /></ListItemButton></ListItem>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );

  return (
    <>
      <AppBar 
        position="static" 
        elevation={1}
        sx={{ 
          background: 'linear-gradient(45deg, #0D47A1 30%, #1976D2 90%)',
          color: 'white'
        }}
      >
        <Toolbar>
          <Box component={Link} to="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
            <Box
              component="img"
              src={logo}
              alt="Usta Tedarik Merkezi Logo"
              sx={{ height: 40, mr: 1.5 }}
            />
            <Typography variant="h6" component="div" sx={{ fontFamily: 'Poppins', fontWeight: 'bold' }}>
              Usta Tedarik Merkezi
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          {isMobile ? renderMobileMenu() : renderDesktopMenu()}
        </Toolbar>
      </AppBar>

      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          {forgotPasswordView ? (
            <>
              <Typography component="h1" variant="h5">Şifremi Unuttum</Typography>
              <TextField margin="normal" required fullWidth label="Kayıtlı Email Adresiniz" type="email" value={email} onChange={e => setEmail(e.target.value)} autoFocus/>
              <Button onClick={handleForgotPassword} fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                  Sıfırlama Linki Gönder
              </Button>
              <Button size="small" onClick={() => { setForgotPasswordView(false); setError(''); setSuccess(''); }}>Giriş Yap'a Geri Dön</Button>
            </>
          ) : (
            <>
              <Tabs value={isRegister ? 1 : 0} onChange={(e, newValue) => setIsRegister(newValue === 1)} centered>
                  <Tab label="Giriş Yap" />
                  <Tab label="Kayıt Ol" />
              </Tabs>
              <Typography component="h1" variant="h5" sx={{ mt: 2, textAlign: 'center' }}>
                  {isRegister ? 'Kayıt Ol' : 'Giriş Yap'}
              </Typography>
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                  <TextField margin="normal" required fullWidth label="Kullanıcı Adı veya E-posta" value={username} onChange={e => setUsername(e.target.value)} inputProps={{ autoCapitalize: 'none' }} />
                  <TextField margin="normal" required fullWidth label="Şifre" type="password" value={password} onChange={e => setPassword(e.target.value)} />
                  {isRegister && (
                      <>
                          <TextField margin="normal" required fullWidth label="Ad Soyad" value={fullName} onChange={e => setFullName(e.target.value)} />
                          <TextField margin="normal" required fullWidth label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} inputProps={{ autoCapitalize: 'none' }} />
                          <TextField margin="normal" required fullWidth label="Telefon" type="tel" value={phone} onChange={e => setPhone(e.target.value)} />
                          <TextField margin="normal" required fullWidth label="Adres" value={address} onChange={e => setAddress(e.target.value)} />
                      </>
                  )}
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    {!isRegister && (
                        <Button onClick={() => { setForgotPasswordView(true); setError(''); setSuccess(''); }} size="small" sx={{ mt: 1, textTransform: 'none' }}>
                            Şifremi unuttum
                        </Button>
                    )}
                  </Box>
                  <Button type="submit" fullWidth variant="contained" sx={{ mt: 1, mb: 2 }}>
                      {isRegister ? 'Kayıt Ol' : 'Giriş Yap'}
                  </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </>
  );
};