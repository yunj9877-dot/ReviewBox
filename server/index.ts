import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import indexingRouter from './routes/indexing';
import searchRouter from './routes/search';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/index', indexingRouter);
app.use('/api/search', searchRouter);

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
