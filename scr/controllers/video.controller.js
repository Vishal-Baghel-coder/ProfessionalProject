import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../modals/video.model.js"
import { User } from "../modals/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    const currentpage = parseInt(req.query.page) - 1;
    const endpage = parseInt(req.query.limit);
    const queryObj = query ? { title: new RegExp(query, 'i'), owner: userId } : { owner: userId };

    const skip = currentpage * endpage;
    const videos = await Video.find(queryObj)
        .sort({ [sortBy]: sortType === 'asc' ? 1 : -1 })
        .skip(skip) // Skip the first (currentPage * endPage) videos
        .limit(endpage); // Limit the result to 'endPage' number of videos

    const total = await Video.countDocuments(queryObj);
    const response = {
        videos,
        total,
        currentPage: currentpage + 1,
        totalPages: Math.ceil(total / endpage),
    };

    return res.status(200).json(new ApiResponse(200, response, "Videos fetched successfully"));


    //TODO: get all videos based on query, sort, pagination
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body
    console.log(title, description)
    if ([title, description].some((field) => !field || field?.trim === '')) {
        throw new ApiError(400, "All fields are required");
    }
    const videoLocalPath = req.files?.video[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail[0]?.path;
    console.log(videoLocalPath, thumbnailLocalPath)

    if (!videoLocalPath || !thumbnailLocalPath) {
        throw new ApiError(401, "video file  is requried");
    }
    const ow = req.user._id;
    const videourl = await uploadOnCloudinary(videoLocalPath);
    const durations = videourl.duration;
    const thumbnailFile = await uploadOnCloudinary(thumbnailLocalPath);
    const video = await Video.create({
        videoFile: videourl.url,
        thumbnail: thumbnailFile.url,
        title,
        description,
        owner: ow,
        isPublised: true,
        duration: durations,
        views: 0,
    })

    return res.status(201).json(
        new ApiResponse(200, video, "Video Uploded Successfully")
    )
    // TODO: get video, upload to cloudinary, create video
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    // This is a GET request as it is fetching a video by its ID
    //console.log(videoId)
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid videoId format");
    }
    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(400, "No video is found");
    }

    return res.status(201).json(
        new ApiResponse(200, { video: video }, "Video found Successfully")
    )
    //TODO: get video by id
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { title, description } = req.body;
    if (!videoId) {
        throw new ApiError(400, "No video is found");
    }
    if ([title, description].some((field) => field === undefined || field === '')) {
        throw new ApiError(501, "Both fields are required");
    }

    const thumbnailLocalPath = req.files?.thumbnail[0]?.path;
    if (!thumbnailLocalPath) {
        throw new ApiError(501, "thumbnail is required");
    }

    const thumbnailurl = await uploadOnCloudinary(thumbnailLocalPath);
    const video = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: {
                title: title,
                description: description,
                thumbnail: thumbnailurl.url
            }
        },
        {
            new: true,
        }
    );

    res.status(200).json(new ApiResponse(200, video, "Video is updated Successfully"));
    //TODO: update video details like title, description, thumbnail

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!isValidObjectId(videoId)) {
        throw new ApiError(501, "videoId is Invalid");
    }

    const video = await Video.findByIdAndDelete(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    res.status(200).json(new ApiResponse(200, null, "Video deleted successfully"));
    //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!videoId) {
        throw new ApiError(400, "Valid videoId and status of button is required");
    }
    const video = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: {
                isPublised: { $not: "$isPublised" }
            }
        },
        {
            new: true,
        }
    );

    res.status(200).json(new ApiResponse(200, 'togglePublishAtstus updated Succesfully'));


})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}