import { Router } from 'express';
import { createClient, toggleClientStatus, getClientById, getClients, updateClient, deleteClient } from '../controllers/clientController.js';

const router = Router();

router.get('/', getClients);
router.get('/:id', getClientById);
router.post('/', createClient);
router.put('/:id', updateClient);
router.patch('/:id/status', toggleClientStatus);
router.delete("/:id", deleteClient);

export default router;