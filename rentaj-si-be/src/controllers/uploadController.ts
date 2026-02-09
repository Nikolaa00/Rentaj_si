import { Request, Response } from 'express';
import cloudinary from '../config/cloudinary';
import { Readable } from 'stream';

const uploadToCloudinary = (
  buffer: Buffer,
  folder: string
): Promise<any> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `rentajsi/${folder}`,
        resource_type: 'image',
        transformation: [
          { width: 1200, height: 800, crop: 'limit' },
          { quality: 'auto' },
          { fetch_format: 'auto' },
        ],
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    const readableStream = new Readable();
    readableStream.push(buffer);
    readableStream.push(null);
    readableStream.pipe(uploadStream);
  });
};

export const uploadImages = async (req: Request, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'DEALER') {
      return res.status(403).json({ error: 'Only dealers can upload images' });
    }

    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return res.status(400).json({ error: 'No files provided' });
    }

    const uploadPromises = (req.files as Express.Multer.File[]).map(
      async (file) => {
        const result = await uploadToCloudinary(file.buffer, 'cars');
        return {
          url: result.secure_url,
          publicId: result.public_id,
        };
      }
    );

    const uploadedImages = await Promise.all(uploadPromises);

    res.json({
      message: 'Images uploaded successfully',
      images: uploadedImages,
      count: uploadedImages.length,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload images' });
  }
};

export const deleteImage = async (req: Request, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'DEALER') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { publicId } = req.params;

    await cloudinary.uploader.destroy(publicId);

    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
};