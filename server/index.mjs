import express from 'express';
import cors from 'cors';
import path from 'path';
import morgan from'morgan';
import compression from 'compression';

import { createChatServer } from './sse.mjs';

const app = express();

const port = 8001;

app.use(compression());

app.use(
    cors({
        origin: '*',
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type', 'Cache-Control', 'Connection'],
    }),
);

app.use(morgan('combined'));

createChatServer(app);

app.use(express.static(path.resolve('./dist')));

app.get('/', (_, res) => {
    res.sendFile(path.resolve('./dist/index.html'));
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

