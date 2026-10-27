import {Router} from 'express';
import { createClient, deactivateClient, getClientById, getClients, updateClient } from '../controllers/clientController.js';

const router = Router();

router.get('/', getClients);
router.get('/:id', getClientById);
router.post('/', createClient);
router.put('/:id', updateClient);
router.patch('/:id/deactivate', deactivateClient);

export default router;