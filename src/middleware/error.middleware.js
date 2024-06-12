export const errorMiddleware = (err,req,res,next)=>{
    err.message||="Internal Server Error";
    err.status||=500;
    // if(err.name==="CastError") err.message="Invalid ID";
    res.status(err.status).json({
        success:false,
        message:err.message
    })
}
