import React, { useState, useEffect } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Pagination, CircularProgress } from '@mui/material';
import { getAllUsersForAdmin } from '../../services/api';
import type { UserProfile, Page } from '../../services/api';

interface TabProps {
    active: boolean;
}

export const UsersTab = ({ active }: TabProps) => {
    const [usersPage, setUsersPage] = useState<Page<UserProfile> | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (active) {
            fetchUsers(currentPage - 1);
        }
    }, [currentPage, active]);

    const fetchUsers = async (page: number) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getAllUsersForAdmin(page, 10);
            setUsersPage(response.data);
        } catch (error) {
            console.error("Kullanıcılar getirilirken hata oluştu:", error);
            setError("Kullanıcı listesi yüklenirken bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setCurrentPage(value);
    };

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    return (
        <Box>
            <Typography variant="h5" gutterBottom>Kullanıcı Yönetimi</Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Ad Soyad</TableCell>
                            <TableCell>Kullanıcı Adı</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Telefon</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {usersPage && usersPage.content && usersPage.content.length > 0 ? (
                            usersPage.content.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.fullName}</TableCell>
                                    <TableCell>{user.username}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.phone}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    Kullanıcı bulunamadı.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, p: 2 }}>
                <Pagination
                    count={usersPage?.totalPages || 0}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    disabled={!usersPage || usersPage.totalPages === 0}
                />
            </Box>
        </Box>
    );
};