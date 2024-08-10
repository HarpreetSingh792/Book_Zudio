import { v2 as cloudinary } from "cloudinary";

export const uploadImageToCloudinary = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file);
    return {
      url: result.url,
      public_id:result.public_id
    };
  } catch (error) {
    console.log(error);
  }
};

export const deleteFromCloudinary = async (id) => {
  try {
    const result = await cloudinary.uploader.destroy(id,(error)=>{
        if(error){
            return console.log(error)
        }
    });
    console.log("Deleted Sucessfully!:-> ",result);
    // return result;
  } catch (error) {
    console.log(error);
  }
};
