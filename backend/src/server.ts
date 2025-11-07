import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import checkoutRouter from './routes/checkout';
import paymentIntentRouter from './routes/paymentIntent';
import webhookRouter from './routes/webhook';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 4000;

const corsOptions = {
    origin: process.env.FRONTEND_URL === '*' ? true : (process.env.FRONTEND_URL || 'http://localhost:3000'),
    credentials: true,
};

app.use(cors(corsOptions));

app.use(
    '/webhook',
    express.raw({ type: 'application/json' }),
    webhookRouter
);

app.use(express.json());

app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api', checkoutRouter);
app.use('/api', paymentIntentRouter);

const frontendPath = path.join(__dirname, '../../frontend/out');
app.use(express.static(frontendPath));

app.get('*', (req: Request, res: Response, next: NextFunction) => {
    if (req.path.startsWith('/api') || req.path === '/webhook') {
        return next();
    }

    const filePath = path.join(frontendPath, req.path.endsWith('/') ? `${req.path}index.html` : `${req.path}.html`);
    res.sendFile(filePath, (err: any) => {
        if (err) {
            res.sendFile(path.join(frontendPath, 'index.html'));
        }
    });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
