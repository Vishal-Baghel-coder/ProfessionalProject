import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'

cloudinary.config({
    cloud_name: 'drsuunbou',
    api_key: '278281991325817',
    api_secret: '-sMlTQG4za92D9agGEczwo2pxg8'
});

const uploadOnCloudinary = async (localFilePath) => {
    console.log("Enter in uploadOnCloudinary", localFilePath)
    try {
        if (!localFilePath) return null
        //uplaod the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto'
        }).catch((error) => {
            console.log("Error is", error);
        })
        //file has been uploaded 
        //console.log("file is uploaded on cloudinary",response.url);
        fs.unlinkSync(localFilePath)
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath)//remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}

export { uploadOnCloudinary }