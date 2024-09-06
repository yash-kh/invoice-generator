import express from 'express';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes';
import quotationRoutes from './routes/quotationRoutes';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/invoice-generator')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// Routes
app.use('/api', authRoutes);
app.use('/api', quotationRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
