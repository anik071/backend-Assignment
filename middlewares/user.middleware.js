import jwt from 'jsonwebtoken';
import User from "../models/user.model.js";
import { success } from 'zod';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
dotenv.config();
export const authenticate= async (req,res,next)=>{
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
        if (!token){
            return res.status(401).json({
                success:false,
                message:"Access denied. No token provided."
            });
        }
        const decoded = jwt.verify(token,process.env.SECRET_KEY);
        req.user = await User.findById(decoded.userId).select('-password');
        if(!req.user){
            return res.status(401).json({
                success:false,
                message:"Invalid token. User not found."
            });
        }
        next();
    } catch (error) {
        return res.status(401).json({
                success:false,
                message:"Invalid or Expired Token",
                error:error.message
            });
    }
};

export const authorizeAdmin= (req,res,next)=>{
    if(req.user.role !=='admin'){
        return res.status(403).json({
            success:false,
            message: "Access Denied. Admin Privileges required"
        });   
    }
    next();
}
