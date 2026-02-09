import { api } from '@/lib/axios';

export const uploadService = {
  // Upload multiple images
  uploadImages: async (files: File[]): Promise<{ message: string; images: { url: string; publicId: string }[]; count: number }> => {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('images', file);
      });

      const response = await api.post<{ message: string; images: { url: string; publicId: string }[]; count: number }>(
        '/api/uploads',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error uploading images:', error);
      throw error;
    }
  },

  // Delete image by public ID
  deleteImage: async (publicId: string): Promise<{ message: string }> => {
    try {
      const response = await api.delete<{ message: string }>(`/api/uploads/${publicId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  },
};