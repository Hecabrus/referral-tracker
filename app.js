import express from 'express';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Store verifications in memory
const userVerifications = new Map();

// Serve landing page
app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'public', 'index.html'));
});

// Track user visits
app.post('/track', (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        return res.status(400).json({ success: false, message: 'userId required' });
    }

    userVerifications.set(userId, {
        visitTime: Date.now(),
        verified: true
    });

    res.json({ success: true });
});

// Verify user status
app.post('/verify', (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        return res.status(400).json({ success: false });
    }

    const verification = userVerifications.get(userId);
    if (verification && verification.verified) {
        return res.json({ success: true });
    }

    res.json({ success: false });
});

// Handle all other routes
app.get('*', (req, res) => {
    res.sendFile(join(__dirname, 'public', 'index.html'));
});

// Export for Vercel
export default app;

// Start server if not in Vercel
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
