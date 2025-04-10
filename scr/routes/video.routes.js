﻿import { Router } from 'express';
import {
    deleteVideo,
    getAllVideos,
    getVideoById,
    publishAVideo,
    togglePublishStatus,
    updateVideo,
} from "../controllers/video.controller.js"
import { verifyJWT } from "../middlewares/auth.middlewares.js"
import { upload } from "../middlewares/multer.middleware.js"; // Ensure multer is properly configured

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router
    .route("/")
    .get(getAllVideos)
    .post(
        upload.fields([
            {
                name: "video",
                maxCount: 1,
            },
            {
                name: "thumbnail",
                maxCount: 1,
            },
        ]),
        publishAVideo
    );

router.route("/getvideobyid/:videoId").get(getVideoById);
router.route("/updateVideo/:videoId").patch(
    upload.fields([
        {
            name: "thumbnail",
            maxCount: 1,
        },
    ]),
    updateVideo
);


export default router