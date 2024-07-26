import express from 'express';
import { nanoid } from 'nanoid';

export const createChatServer = (app) => {
    // История сообщений
    const allMessages = [
        {
            user: { name: 'bot', id: '' },
            text: 'Hello world!',
            timestamp: new Date().toISOString(),
        },
    ];

    let clients = [];

    app.get('/sse', (req, res) => {
        console.log('req')
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        const id = nanoid();
        clients.push({ id, res });

        console.log(clients.length);

        req.on('close', () => {
            clients = clients.filter(client => client.id !== id);
            res.end();
        });

        res.write(`event: connection\n\n`);
        res.flush();
    });
      
    // Route для отправки сообщений на сервер
    app.post('/send', express.json(), (req, res) => {
        const { message } = req.body;

        allMessages.push(message);

        clients.forEach((client) => {
            client.res.write(`data: ${JSON.stringify(message)}\n\n`);
            client.res.flush();
        });

        res.status(200).send('Message received');
        res.flush();
    });

    // Route для получения истории
    app.get('/history', (_, res) => {
        res.json(allMessages);
    });
}