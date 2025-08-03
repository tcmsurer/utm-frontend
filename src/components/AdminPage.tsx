import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Box, Typography, Tabs, Tab, Paper, Container } from '@mui/material';
import { Header } from './layout/Header';
import { RequestsTab } from './admin/RequestsTab';
import { TradesTab } from './admin/TradesTab';
import { QuestionsTab } from './admin/QuestionsTab';
import { MailLogTab } from './admin/MailLogTab';

function TabPanel(props: { children?: React.ReactNode; index: number; value: number; }) {
    const { children, value, index, ...other } = props;
    return (
        <div role="tabpanel" hidden={value !== index} {...other}>
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

const AdminPage: React.FC = () => {
    const [tabIndex, setTabIndex] = useState(0);
    const auth = useAuth();

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };

    if (!auth.user || !auth.isAdmin) {
        return (
            <div>
                <Header />
                <Container sx={{ mt: 4 }}>
                    <Typography variant="h4" color="error" align="center">
                        Bu sayfaya erişim yetkiniz yok.
                    </Typography>
                    <Typography align="center">
                        Lütfen admin olarak giriş yapın.
                    </Typography>
                </Container>
            </div>
        );
    }
    
    return (
        <div>
            <Header />
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Typography variant="h4" gutterBottom align="center">Admin Paneli</Typography>
                <Paper>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs 
                            value={tabIndex} 
                            onChange={handleTabChange}
                            variant="scrollable"
                            scrollButtons="auto"
                            allowScrollButtonsMobile
                        >
                            <Tab label="Talepler" />
                            <Tab label="Usta Tanımları" />
                            <Tab label="Soru Tanımları" />
                            <Tab label="Mail Kayıtları" />
                        </Tabs>
                    </Box>
                    <TabPanel value={tabIndex} index={0}>
                        <RequestsTab />
                    </TabPanel>
                    <TabPanel value={tabIndex} index={1}>
                        <TradesTab />
                    </TabPanel>
                    <TabPanel value={tabIndex} index={2}>
                        <QuestionsTab />
                    </TabPanel>
                    <TabPanel value={tabIndex} index={3}>
                        <MailLogTab />
                    </TabPanel>
                </Paper>
            </Container>
        </div>
    );
};

export default AdminPage;