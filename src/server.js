import 'dotenv/config';
import express from 'express';
import logger from './middleware/logger.js';
import cors from 'cors';
import notesRoutes from './routes/notesRoutes.js';
import notFoundHandler from './middleware/notFoundHandler.js';
import errorHandler from './middleware/errorHandler.js';
import { connectMongoDB } from './db/connectMongoDB.js';
import { errors } from 'celebrate';
const app = express();

app.use(express.json());
app.use(cors());
app.use(logger);
app.use(notesRoutes);
app.use(notFoundHandler);
app.use(errors());
app.use(errorHandler);

const PORT = Number(process.env.PORT) || 3000;
await connectMongoDB();
app.listen(PORT, () => {
  console.log(`Server is start on ${PORT}`);
});
