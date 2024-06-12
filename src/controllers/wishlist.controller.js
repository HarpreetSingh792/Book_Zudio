import { Wishlist } from "../models/wishlist.js";
import asyncHandler from "../utils/asyncHandler.js"
import mongoose from "mongoose";
import ErrorHandler from "../utils/errorHandler.js";

export const toggleList=asyncHandler(async(req,res,next)=>{
    const {_id} = req.user.access;
    const {id} = req.params;
    const {toggle} = req.query;

    

    if(toggle){
       await Wishlist.findOne({book:id}).findOneAndDelete({user:_id});    
        return res.status(200).json({
            success:true,
            message:"Removed from wishlist"
        })
    }
    else{
        const list= await Wishlist.aggregate([
            {
                $match:{
                    book:new mongoose.Types.ObjectId(id)
                }
            },
            {
                $match:{
                    user:new mongoose.Types.ObjectId(_id)
                }
            }
        ])
        if(list.length===0){
            await Wishlist.create({
                user:_id,
                book:id
            })
            return res.status(200).json({
                success:true,
                message:"Added to wishlist"
            })
        } 
    }

    next(new ErrorHandler(404,"Something went wrong"))
})


export const showAll= asyncHandler(async(req,res,next)=>{
    const {_id} = req.user.access;

    const list= await Wishlist.aggregate([
        {
            $match:{
                user:new mongoose.Types.ObjectId(_id)
            }
        },
        {
            $lookup:{
                from:"books",
                localField:"book",
                foreignField:"_id",
                as:"book"
            }
        },
        {
            $project:{
                user:1,
                book:{
                    author:1,
                    title:1,
                    photo:1,
                    price:1,
                    description:1,
                    category:1
                }
            }
        }
    ]);

    if(!list) next(new ErrorHandler(404,"Your Wishlist is Empty"));

    res.status(200).json({
        success:true,
        list      
    })
})