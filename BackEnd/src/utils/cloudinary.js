import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        // Upload the file to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto'
        });

        // Log successful upload
        console.log("File has been uploaded successfully:", response.url);
        fs.unlinkSync(localFilePath);
        console.log("Response is ",response);
        return response;
    } catch (error) {
        // Log error details
        console.error("Error uploading file to Cloudinary:", error);

        // Remove the locally saved temporary file if upload failed
            fs.unlinkSync(localFilePath);

        return null;
    }
}

export { uploadOnCloudinary };
