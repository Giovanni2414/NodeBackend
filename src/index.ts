import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import userRoutes from './routes/UserRoutes';
import groupRoutes from './routes/GroupRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Conexión a MongoDB
mongoose.connect('mongodb+srv://nodebackend:nike4545@cluster0.vvxg3lr.mongodb.net/?retryWrites=true&w=majority', { dbName: "nodebackend" });

// Rutas
app.use('/api/users', userRoutes);
app.use('/api/groups', groupRoutes);

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});
