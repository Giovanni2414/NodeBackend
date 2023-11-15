import { Request, Response } from 'express';
import { UserModel } from '../models/User';
import { GroupModel } from '../models/Group';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import authMiddleware from '../middlewares/AuthMiddleware';

class UserController {

    async createUser(req: Request, res: Response): Promise<void> {
        try {
            // Middleware de autenticación solo permite a superadmin crear usuarios
            authMiddleware(['superadmin'])(req, res, async () => {
                const { username, email, password, role } = req.body;
                console.log(req.body);

                // Verificar si el usuario ya existe
                const existingUser = await UserModel.findOne({ username });
                if (existingUser) {
                    res.status(400).json({ error: 'El nombre de usuario ya está en uso' });
                    return;
                }

                // Encriptar la contraseña antes de almacenarla en la base de datos
                const hashedPassword = await bcrypt.hash(password, 10);

                // Crear el nuevo usuario
                const newUser = new UserModel({
                    username,
                    email,
                    password: hashedPassword,
                    role,
                });

                // Guardar el usuario en la base de datos
                await newUser.save();

                res.status(201).json(newUser);
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error en el servidor' });
        }
    }

    async getUsers(req: Request, res: Response): Promise<void> {
        try {
            authMiddleware(['admin', 'superadmin'])(req, res, async () => {
                // Obtener todos los usuarios de la base de datos
                const users = await UserModel.find({}, '-password'); // Excluye el campo de la contraseña

                res.status(200).json(users);
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error en el servidor' });
        }
    }

    async getUserById(req: Request, res: Response): Promise<void> {
        try {
            // Middleware de autenticación para obtener un usuario por ID
            authMiddleware(['admin', 'superadmin'])(req, res, async () => {
                const userId = req.params.userId;

                // Buscar el usuario por su ID en la base de datos
                const user = await UserModel.findById(userId, '-password'); // Excluye el campo de la contraseña

                if (!user) {
                    res.status(404).json({ error: 'Usuario no encontrado' });
                    return;
                }

                res.status(200).json(user);
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error en el servidor' });
        }
    }

    async updateUser(req: Request, res: Response): Promise<void> {
        try {
            // Middleware de autenticación solo permite a superadmin actualizar usuarios
            authMiddleware(['superadmin'])(req, res, async () => {
                const userId = req.params.userId;
                const { username, email, password, role } = req.body;

                // Buscar el usuario por su ID en la base de datos
                const user = await UserModel.findById(userId);

                if (!user) {
                    res.status(404).json({ error: 'Usuario no encontrado' });
                    return;
                }

                // Actualizar los campos del usuario
                user.username = username || user.username;
                user.role = role || user.role;
                user.email = email || user.email;

                if (password) {
                    // Encriptar la nueva contraseña antes de actualizarla
                    const hashedPassword = await bcrypt.hash(password, 10);
                    user.password = hashedPassword;
                }

                // Guardar los cambios en la base de datos
                await user.save();

                res.status(200).json(user);
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error en el servidor' });
        }
    }

    async deleteUser(req: Request, res: Response): Promise<void> {
        try {
            authMiddleware(['superadmin'])(req, res, async () => {
                const userId = req.params.userId;

                // Buscar y eliminar el usuario por su ID en la base de datos
                const user = await UserModel.findByIdAndDelete(userId);

                if (!user) {
                    res.status(404).json({ error: 'Usuario no encontrado' });
                    return;
                }

                res.status(204).send();
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error en el servidor' });
        }
    }

    async login(req: Request, res: Response): Promise<void> {
        try {
            const { username, password } = req.body;

            // Buscar al usuario por nombre de usuario
            const user = await UserModel.findOne({ username });
            console.log(await bcrypt.hash("admin", 10));

            if (!user) {
                res.status(401).json({ error: 'Credenciales inválidas' });
                return;
            }

            // Verificar la contraseña
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                res.status(401).json({ error: 'Credenciales inválidas' });
                return;
            }

            // Generar token JWT
            const token = jwt.sign({ userId: user._id, role: user.role }, 'miSecretKey', { expiresIn: '1h' });

            res.status(200).json({ token });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error en el servidor' });
        }
    }

    async getUserGroups(req: Request, res: Response): Promise<void> {
        try {
            authMiddleware(['admin', 'superadmin'])(req, res, async () => {
                const { userId } = req.params;

                // Verificar si el usuario existe
                const existingUser = await UserModel.findById(userId);
                if (!existingUser) {
                    return res.status(404).json({ error: 'Usuario no encontrado' });
                }

                // Obtener todos los grupos asociados al usuario
                const userGroups = await GroupModel.find({ users: existingUser._id });

                res.json(userGroups);
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error en el servidor' });
        }
    }
}

export default new UserController();