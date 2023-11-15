import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const secretKey = 'miSecretKey'; // Asegúrate de guardarla de forma segura, preferiblemente en una variable de entorno

const authMiddleware = (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        console.log(req.path);
        if (req.path == '/login') {
            next();
            return;
        }

        const token = req.header('Authorization');

        if (!token) {
            return res.status(401).json({ error: 'Acceso no autorizado. Token no proporcionado.' });
        }

        try {
            const decoded = jwt.verify(token, secretKey) as { userId: string; role: string };

            // Verificar si el usuario tiene los roles adecuados
            if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
                return res.status(403).json({ error: 'Acceso prohibido. Roles insuficientes.' });
            }

            // Agregar la información del usuario decodificado al objeto de solicitud para su uso posterior
            req.user = decoded;
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ error: 'Token no válido.' });
        }
    };
};

export default authMiddleware;