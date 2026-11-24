
import { Router } from 'express';

import {
    createAppointment,
    getAppointmentById,
    getAppointments,
    getAppointmentsByClientId,
    updateAppointment,
    updateAppointmentStatus,
    updateAppointmentPayment,
    deleteAppointment
} from '../controllers/appointmentController.js';

const router = Router();

router.get('/', getAppointments);
router.get('/client/:client_id', getAppointmentsByClientId);
router.get('/:id', getAppointmentById);

router.post('/', createAppointment);

router.put('/:id', updateAppointment);

router.patch('/:id/status', updateAppointmentStatus);
router.patch('/:id/payment', updateAppointmentPayment);

router.delete('/:id', deleteAppointment);

export default router;
