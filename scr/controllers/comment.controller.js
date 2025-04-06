import mongoose from "mongoose"
import { Comment } from "../models/comment.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Video } from "../modals/video.model.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const { videoId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const currentpage = parseInt(req.query.page) - 1;
    const endpage = parseInt(req.query.limit);

    const comment = await Comment.find(videoId).skip(currentpage * endpage).limit(endpage - 1);

    res.status(200).json(new ApiResponse(200, comment, "All comments of video is fetch successfully"));

})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const { videoId, content } = req.params;

    if (content === "") {
        new ApiError(400, "content is blank ,please add content");
    }
    const comment = await Comment.create({
        content: content,
        owner: req.user._id,
        video: videoId,
    })

    res.status(200).json(new ApiResponse(200, comment, "comment is add successfully"));
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment

})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
})

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}