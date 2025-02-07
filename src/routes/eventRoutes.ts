import { Router } from 'express';
import { createEvent, getAllEvents } from '../controllers/eventController';
import checkRole from '../middlewares/checkRoles';
import  authenticate  from '../middlewares/authenticate';

const router = Router();

router.get('/getAllEvents', getAllEvents);
router.post('/createEvents', authenticate, checkRole(['admin']), createEvent);

export default router;
