import { Router } from 'express';
import { createEvent, getAllEvents } from '../controllers/eventController';
import checkRole from '../middlewares/checkRoles';
import  authenticate  from '../middlewares/authenticate';

const router = Router();

router.get('/getAllEvents', getAllEvents);
router.post('/createEvents', authenticate, checkRole(['admin']), createEvent);

export default router;



  // "swagger": "ts-node swagger.ts",
    // "watch": "ts-node-dev --respawn --transpile-only src/server.ts",
    // "dev": "npm run swagger && npm run watch"
    // npm install --include=dev && npm run build build command
    // npm run start