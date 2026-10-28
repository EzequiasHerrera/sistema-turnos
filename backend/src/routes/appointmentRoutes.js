
import { Router } from 'express';
import { createAppointment, getAppointmentById, getAppointments, updateAppointment, updateAppointmentStatus } from '../controllers/appointmentController.js';

const router = Router();

router.get('/', getAppointments);
router.get('/:id', getAppointmentById);
router.post('/', createAppointment);
router.put('/:id', updateAppointment);
router.patch('/:id/status', updateAppointmentStatus);

export default router;
