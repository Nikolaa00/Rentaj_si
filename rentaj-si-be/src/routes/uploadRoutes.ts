import { Router } from 'express';
import { uploadImages, deleteImage } from '../controllers/uploadController';
import { upload } from '../middleware/upload';
import { authenticate, authorize } from '../middleware/authMiddleware';

const router = Router();


router.post(
  '/',
  authenticate,
  authorize('DEALER'),
  upload.array('images', 10),
  uploadImages
);


router.delete(
  '/:publicId',
  authenticate,
  authorize('DEALER'),
  deleteImage
);

export default router;