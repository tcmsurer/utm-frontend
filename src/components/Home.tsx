import React from 'react';
import { Header } from './layout/Header';
import { RequestStepper } from './RequestStepper';
import { Container, Paper, Typography, Box } from '@mui/material';

const Home: React.FC = () => {
  return (
    <div>
      <Header />
      <Box 
        sx={{ 
          minHeight: 'calc(100vh - 64px)',
          display: 'flex', 
          alignItems: 'center',
          justifyContent: { xs: 'center', md: 'flex-end' },
          padding: { xs: 2, md: 4 },
          paddingRight: { md: '8%' }
        }}
      >
        <Container component="main" maxWidth="md">
          <Paper 
            variant="outlined" 
            sx={{ 
              p: { xs: 2, md: 4 },
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.65)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
            }}
          >
            <Typography
                component="h1"
                variant="h4"
                align="center"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  // Font boyutunu mobil için ayarladık
                  fontSize: { xs: '1.6rem', sm: '2rem', md: '2.5rem' }, 
                  background: 'linear-gradient(45deg, #0D47A1 30%, #1976D2 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  paddingBottom: '0.5rem',
                }}
              >
                Usta Bulmanın En Kolay Yolu
              </Typography>
              <RequestStepper />
          </Paper>
        </Container>
      </Box>
    </div>
  );
};

export default Home;