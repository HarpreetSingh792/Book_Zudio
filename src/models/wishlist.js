import mongoose,{Schema} from "mongoose";


const wishlistSchema = new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    book:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Book"
    },
})

export const Wishlist= mongoose.model("Wishlist",wishlistSchema)