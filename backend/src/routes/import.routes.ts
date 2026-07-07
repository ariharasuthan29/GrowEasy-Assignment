import { Router } from 'express';
import { ImportController } from '../controllers/import.controller';
import { uploadMiddleware } from '../middleware/upload.middleware';

const router = Router();

// Endpoint: POST /api/import
router.post('/', uploadMiddleware.single('file'), ImportController.importCSV);

export default router;
