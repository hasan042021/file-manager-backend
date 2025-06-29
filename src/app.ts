import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import {
  fileUploadErrorHandler,
  globalErrorHandler,
  notFoundHandler,
} from '@middlewares/errorHandlers.middleware';
import { morganStream } from '@logger';

const corsOptions = {
  origin: ['http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

app.use(helmet());
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined', { stream: morganStream }));
}

app.get('/', (_req, res) => {
  res.send('Route is working! YaY!');
});

// app.use('/api', apiRoutes);

app.use(fileUploadErrorHandler);
app.use(globalErrorHandler);
app.use(notFoundHandler);

export default app;
