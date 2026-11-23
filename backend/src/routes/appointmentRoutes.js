
import { Router } from 'express';
import { createAppointment, deleteAppointment, getAppointmentById, getAppointments, getAppointmentsByClientId, updateAppointment, updateAppointmentStatus } from '../controllers/appointmentController.js';

const router = Router();

router.get('/', getAppointments);
router.get('/:id', getAppointmentById);
router.post('/', createAppointment);
router.put('/:id', updateAppointment);
router.patch('/:id/status', updateAppointmentStatus);
router.delete("/:id", deleteAppointment);
router.get("/client/:client_id", getAppointmentsByClientId);

export default router;
