import React from 'react';
import { Box, Typography, Paper, Grid, Button } from '@mui/material';
import { AccountBalance, Payment, People, Notifications } from '@mui/icons-material';

const Dashboard: React.FC = () => {
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        CrossLink Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Total Users Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <People fontSize="large" />
            <Typography variant="h6">Total Users</Typography>
            <Typography variant="h4">1,234</Typography>
          </Paper>
        </Grid>

        {/* Total Transactions Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Payment fontSize="large" />
            <Typography variant="h6">Total Transactions</Typography>
            <Typography variant="h4">567</Typography>
          </Paper>
        </Grid>

        {/* Total Revenue Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <AccountBalance fontSize="large" />
            <Typography variant="h6">Total Revenue</Typography>
            <Typography variant="h4">€12,345</Typography>
          </Paper>
        </Grid>

        {/* Notifications Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Notifications fontSize="large" />
            <Typography variant="h6">Notifications</Typography>
            <Typography variant="h4">3</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Transactions Table */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Recent Transactions
        </Typography>
        <Paper sx={{ p: 2 }}>
          <Typography variant="body1">Transaction 1: €100</Typography>
          <Typography variant="body1">Transaction 2: €200</Typography>
          <Typography variant="body1">Transaction 3: €300</Typography>
        </Paper>
      </Box>

      {/* Call to Action Button */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Button variant="contained" color="primary">
          View All Transactions
        </Button>
      </Box>
    </Box>
  );
};

export default Dashboard;