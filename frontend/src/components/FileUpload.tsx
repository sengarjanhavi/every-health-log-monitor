import { useState } from 'react';
import {
  Button,
  Stack,
  Alert,
  Card,
  CardContent,
  Typography,
} from '@mui/material';
import { uploadLogs } from '../api/logsApi';

interface FileUploadProps {
  onUploadSuccess: () => void;
}

export default function FileUpload({ onUploadSuccess }: FileUploadProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const text = await file.text();
      const parsed = JSON.parse(text);

      if (!Array.isArray(parsed)) {
        throw new Error('JSON must contain an array of log entries.');
      }

      const insertedCount = await uploadLogs(parsed);
      setSuccess(`Successfully uploaded ${insertedCount} logs.`);
      onUploadSuccess();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to upload logs.');
      }
    } finally {
      setLoading(false);
      event.target.value = '';
    }
  }

  return (
    <Card variant="outlined" sx={{ backdropFilter: 'blur(6px)' }}>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="subtitle1" fontWeight={500}>
            Upload logs
          </Typography>

          <Button
            variant="contained"
            component="label"
            disabled={loading}
            sx={{ alignSelf: 'flex-start' }}
          >
            Upload JSON
            <input
              type="file"
              hidden
              accept="application/json"
              onChange={handleFileChange}
            />
          </Button>

          {success && <Alert severity="success">{success}</Alert>}
          {error && <Alert severity="error">{error}</Alert>}
        </Stack>
      </CardContent>
    </Card>
  );
}
