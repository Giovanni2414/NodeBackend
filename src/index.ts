import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import userRoutes from './routes/UserRoutes';
import groupRoutes from './routes/GroupRoutes';
import * as dotenv from 'dotenv';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Conexión a MongoDB
dotenv.config();
const mongodbUri = process.env.MONGODB_URI;
const mongodbUriNew: string = mongodbUri ?? '';
const mongodb_db = process.env.MONGODB_DB;
mongoose.connect(mongodbUriNew, { dbName: mongodb_db });

// Rutas
app.use('/api/users', userRoutes);
app.use('/api/groups', groupRoutes);

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});
