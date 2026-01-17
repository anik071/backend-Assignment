import  jwt  from "jsonwebtoken";
import User from "../models/user.model.js"
import dotenv from "dotenv";
dotenv.config();
const generateToken = (userId) => {
    return jwt.sign({userId},process.env.SECRET_KEY,{expiresIn:process.env.EXP});
};
export const login=async (req,res)=>{
    try{
        const {identifier,password} = req.body
        if (!identifier || !password) {
        return res.status(400).json({
            success: false,
            message: "Identifier and password are required"
        });
        }
        const user = await User.findOne({email:identifier});
            if(!user){
              return res.status(401).json({
                success:false,
                message:"Invalid Email Address!!",
                error:error.message
               });
            }
            if(!user.isValid(password)){
                res.status(401).json({
                success:false,
                message:"Wrong Password",
                error:error.message
               });
            }
               const token= generateToken(user._id);
               res.cookie('token',token,{
                httpOnly:true,
                sameSite:"strict",
                secure:process.env.NODE_ENV==="production",
                maxAge: 24*60*60*1000
               });
             res.status(200).json({
                success:true,
                message:"Log in Successful",
                data:{
                    user:{
                        id:user._id,
                        name:user.name,
                        email:user.email,
                        role:user.role
                    },token
                }
               });
            } catch (error){
                res.status(500).json({
                success:false,
                message:"Server Error!!",
                error:error.message
            });
    }
};
export const register=async(req,res)=>{
    try{
        const { email , password} = req.body;
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"Email and Password are required"
            });
        }
        const existing = await User.findOne({email:email.toLowerCase()})
        if(existing){
             res.status(400).json({
            success:false,
            message:"Email Already used",
            error:error.message
            })
        }
        const user=await User.create({
            name:req.body.name,
            email:email.toLowerCase(),
            role:req.body.role||"user",
            password:password
        });
        const token = generateToken(user._id);
        res.cookie('token',token,{
            httpOnly:true,
            secure:process.env.NODE_ENV==="production",
            sameSite:"strict",
            maxAge:24*60*60*1000
        });
        res.status(201).json({
            success:true,
            message:"User Registration successful",
            data:{
                user:{
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    password: user.password
                },token
            
            }

        });
        
    }catch(error){
        res.status(500).json({
            success:false,
            message:"Server Error",error:error.message
        })
    }
};

export const logout=async(req,res)=>{
    try{
        res.cookie('token','',{
            httpOnly:true,
            expires:new Date(0),
            secure:process.env.NODE_ENV==="production",
            sameSite:"strict"
        });
        res.status(200).json({
            success:true,
            message:"Logged out successfully"
        });
    }catch(error){
        res.status(500).json({
            success:false,
            message:"Server Error",
            error:error.message
        });
    }
};

export const GetUserProfile=async(req,res)=>{
    try{
        const user=req.user;
        res.status(200).json({
            success:true,
            message:"User profile fetched successfully",
            data:{user}
        });
    }catch(error){
        res.status(500).json({
            success:false,
            message:"Server Error",
            error:error.message
        });
    }
};

// export const GetAllUsers=async(req,res)=>{
//     try{
//         const users=await User.find();
//         res.status(200).json({
//             success:true,
//             message:"Users fetched successfully",
//             data:{users}
//         });
//     }catch(error){
//         res.status(500).json({
//             success:false,
//             message:"Server Error",
//             error:error.message
//         });
//     }
// // };
// export const deleteProfile=async(req,res)=>{
//     try {
//         await User.findByIdAndDelete(req.user._id);
//         res.status(200).json({
//             success:true,
//             message:"User Deleted Successfully"
//         })
//     } catch (error) {
//         res.staus(500).json({
//             success:false,
//             message:"Server Error",
//             error:error.message
//         });
//     }
// };