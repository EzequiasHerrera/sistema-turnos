import {Router} from 'express';
import { createClient, toggleClientStatus, getClientById, getClients, updateClient } from '../controllers/clientController.js';

const router = Router();

router.get('/', getClients);
router.get('/:id', getClientById);
router.post('/', createClient);
router.put('/:id', updateClient);
router.patch('/:id/status', toggleClientStatus);

export default router;