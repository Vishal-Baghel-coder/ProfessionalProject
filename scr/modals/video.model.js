import mongoose from 'mongoose'
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2'

const VideoSchema = new mongoose.Schema(
    {
        videoFile:{
            type:String, //cloudnary
            required: [true ,'Viedo is required'],
        },
        title:{
            type: String,
            required: true,
        },
        thumbnail:{
            type: String,
            required: true,
        },
        description:{
            type: String,
            required: true,
        },
        duration:{
            type: Number,
            required: true,
        },
        views:{
            type: Number,
            default:0,
        },
        isPublised:{
            type: Boolean,
            default: true,
        },
        owner:{
            type: mongoose.Schema.ObjectId,
            ref:"User"
        }
    }
)


VideoSchema.plugin(mongooseAggregatePaginate)
export const Video = mongoose.model('Video',VideoSchema)