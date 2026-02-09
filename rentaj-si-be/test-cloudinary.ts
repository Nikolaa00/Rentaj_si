// test-cloudinary.ts
import 'dotenv/config';
import cloudinary from './src/config/cloudinary.ts';

console.log('🔍 Testing Cloudinary Configuration...\n');

// Check which configuration is being used
if (process.env.CLOUDINARY_URL) {
  console.log('✓ Using CLOUDINARY_URL');
  const url = process.env.CLOUDINARY_URL;
  const cloudName = url.split('@')[1];
  console.log('Cloud Name from URL:', cloudName);
} else {
  console.log('✓ Using separate environment variables');
  console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
}

async function testCloudinary() {
  try {
    console.log('\n🧪 Testing Cloudinary upload...');
    
    const result = await cloudinary.uploader.upload(
      'https://res.cloudinary.com/demo/image/upload/sample.jpg',
      {
        folder: 'rentajsi-test',
        public_id: 'connection-test'
      }
    );
    
    console.log('\n✅ Cloudinary connection successful!');
    console.log('Uploaded image URL:', result.secure_url);
    
    // Clean up
    await cloudinary.uploader.destroy(result.public_id);
    console.log('🧹 Test image cleaned up');
    
  } catch (error: any) {
    console.error('\n❌ Cloudinary test failed:');
    console.error('Error:', error.message);
    console.error('HTTP Code:', error.http_code);
  }
}

testCloudinary();