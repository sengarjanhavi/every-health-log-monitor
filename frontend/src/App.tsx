import { Container, Typography, Box } from '@mui/material';
import LogsPage from './pages/LogsPage';

export default function App() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background:
          'radial-gradient(1200px 600px at 20% -10%, rgba(79,140,255,0.15), transparent), #0f1115',
        py: 6,
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          fontWeight={600}
          gutterBottom
          sx={{ mb: 4 }}
        >
          Every Health Log Monitor
        </Typography>
        <LogsPage />
      </Container>
    </Box>
  );
}
