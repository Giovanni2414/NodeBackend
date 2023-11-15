import { Request } from 'express';

declare global {
    namespace Express {
        interface Request {
            user?: { userId: string; role: string }; // Ajusta según la estructura de tu objeto de usuario
        }
    }
}