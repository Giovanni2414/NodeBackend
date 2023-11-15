import express from 'express';
import GroupController from '../controllers/GroupController';
import { check, validationResult } from 'express-validator';

const router = express.Router();

// Validaciones para la creación de un grupo
const validateGroupCreation = [
    check('name').notEmpty().withMessage('El nombre del grupo es requerido'),
];

router.post('/', validateGroupCreation, GroupController.createGroup);
router.get('/', GroupController.getGroups);
router.get('/:groupId', GroupController.getGroupById);
router.put('/:groupId', validateGroupCreation, GroupController.updateGroup);
router.delete('/:groupId', GroupController.deleteGroup);
router.post('/assignUser', GroupController.assignUser)
router.post('/removeUser', GroupController.removeUser)

export default router;