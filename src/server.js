import 'dotenv/config';
import express from 'express';
import logger from 'pino-http';
import cors from 'cors';
const app = express();

app.use(express.json());
app.use(cors());
app.use(
  logger({
    level: 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss',
        ignore: 'pid,hostname',
        messageFormat:
          '{req.method} {req.url} {res.statusCode} - {responseTime}ms',
        hideObject: true,
      },
    },
  }),
);

app.get('/', (req, res) => {
  req.log.info('something else');
  res.send('hello world');
});
app.get('/notes', (req, res) => {
  res.json({
    message: 'Retrieved all notes',
  });
});
app.get('/notes/:noteId', (req, res) => {
  const { noteId } = req.params;
  res.json({
    message: `Retrieved note with ID: ${noteId}`,
  });
});

app.get('/test-error', () => {
  throw new Error('Something went wrong');
});

app.use((_, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res) => {
  console.error('Error:', err.message);
  res.status(500).json({
    message: 'Internal Server Error',
    error: err.message,
  });
});
const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => {
  console.log(`Server is start on ${PORT}`);
});
