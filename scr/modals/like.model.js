import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const likeSchema = new Schema(
    {
        video: {
            type: Schema.Types.ObjectId,
            ref: "Video",
            required: true,
        },
        comment: {
            type: Schema.Types.ObjectId,
            ref: "Comment",
            required: true,
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        tweet: {
            type: Schema.Types.ObjectId,
            ref: "Tweet",
            required: true,
        }
    },
    {
        timestamps: true
    }
);

export const Like = mongoose.model("Like", likeSchema); 