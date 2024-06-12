import mongoose,{Schema} from "mongoose";


const reviewSchema = new Schema({
    review:{
        type:String,
        required:[true,"Please add your review"]
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    book:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Book"
    },
    likes:{
        type:Number,
        default:0
    },
    dislikes:{
        type:Number,
        default:0
    },

})




export const Review = mongoose.model("Review",reviewSchema);