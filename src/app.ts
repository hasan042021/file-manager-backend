import express from 'express';
import cors from 'cors';
import {
  fileUploadErrorHandler,
  globalErrorHandler,
  notFoundHandler,
} from '@middlewares/errorHandlers.middleware';

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

app.get('/', (_req, res) => {
  res.send('Route is working! YaY!');
});

// app.use('/api', apiRoutes);

app.use(fileUploadErrorHandler);
app.use(globalErrorHandler);
app.use(notFoundHandler);

export default app;
