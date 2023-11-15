import { Request, Response } from 'express';
import { UserModel } from '../models/User';
import { GroupModel } from '../models/Group';
import authMiddleware from '../middlewares/AuthMiddleware';
import { validationResult } from 'express-validator';

class GroupController {

    async createGroup(req: Request, res: Response): Promise<void> {
        try {
            authMiddleware(['admin', 'superadmin'])(req, res, async () => {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({ errors: errors.array() });
                }

                const { name, users } = req.body;
                const newGroup = await GroupModel.create({ name, users });
                res.json(newGroup);
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error en el servidor' });
        }
    }

    async getGroups(req: Request, res: Response): Promise<void> {
        try {
            authMiddleware(['admin', 'superadmin'])(req, res, async () => {
                const groups = await GroupModel.find({}).populate('users');

                res.status(200).json(groups);
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error en el servidor' });
        }
    }

    async getGroupById(req: Request, res: Response): Promise<void> {
        try {
            authMiddleware(['admin', 'superadmin'])(req, res, async () => {
                const groupId = req.params.groupId;

                // Buscar el grupo por su ID en la base de datos
                const group = await GroupModel.findById(groupId).populate('users');

                if (!group) {
                    res.status(404).json({ error: 'Grupo no encontrado' });
                    return;
                }

                res.status(200).json(group);
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error en el servidor' });
        }
    }

    async updateGroup(req: Request, res: Response): Promise<void> {
        try {
            authMiddleware(['admin', 'superadmin'])(req, res, async () => {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({ errors: errors.array() });
                }

                const { groupId } = req.params;
                const { name, users } = req.body;

                // Validar si el grupo existe
                const existingGroup = await GroupModel.findById(groupId);
                if (!existingGroup) {
                    return res.status(404).json({ error: 'Grupo no encontrado' });
                }

                // Actualizar la información del grupo
                existingGroup.name = name;
                existingGroup.users = users;
                const updatedGroup = await existingGroup.save();

                res.json(updatedGroup);
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error en el servidor' });
        }
    }

    async deleteGroup(req: Request, res: Response): Promise<void> {
        try {
            authMiddleware(['admin', 'superadmin'])(req, res, async () => {
                const { groupId } = req.params;

                const group = await GroupModel.findByIdAndDelete(groupId);

                if (!group) {
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

    async assignUser(req: Request, res: Response): Promise<void> {
        try {
            authMiddleware(['admin', 'superadmin'])(req, res, async () => {
                const { groupId, userId } = req.params;
                console.log(groupId);
                // Verificar si el grupo existe
                const existingGroup = await GroupModel.findById(groupId);
                if (!existingGroup) {
                    return res.status(404).json({ error: 'Grupo no encontrado' });
                }

                // Verificar si el usuario existe
                const existingUser = await UserModel.findById(userId);
                if (!existingUser) {
                    return res.status(404).json({ error: 'Usuario no encontrado' });
                }

                // Verificar si el usuario ya está en el grupo
                if (existingGroup.users.includes(existingUser._id)) {
                    return res.status(400).json({ error: 'El usuario ya está en el grupo' });
                }

                // Agregar el usuario al array de usuarios del grupo
                existingGroup.users.push(existingUser._id);
                const updatedGroup = await existingGroup.save();

                res.json(updatedGroup);
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error en el servidor' });
        }
    }

    async removeUser(req: Request, res: Response): Promise<void> {
        try {
            authMiddleware(['admin', 'superadmin'])(req, res, async () => {
                const { groupId, userId } = req.params;

                // Verificar si el grupo existe
                const existingGroup = await GroupModel.findById(groupId);
                if (!existingGroup) {
                    return res.status(404).json({ error: 'Grupo no encontrado' });
                }

                // Verificar si el usuario existe
                const existingUser = await UserModel.findById(userId);
                if (!existingUser) {
                    return res.status(404).json({ error: 'Usuario no encontrado' });
                }

                // Verificar si el usuario está en el grupo
                if (!existingGroup.users.includes(existingUser._id)) {
                    return res.status(400).json({ error: 'El usuario no está en el grupo' });
                }

                // Remover el usuario del array de usuarios del grupo
                existingGroup.users = existingGroup.users.filter((user) => user.toString() !== existingUser._id.toString());
                const updatedGroup = await existingGroup.save();

                res.json(updatedGroup);
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error en el servidor' });
        }
    }
}

export default new GroupController();