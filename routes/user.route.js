import express from 'express';
import { login,register,logout,GetUserProfile/* ,GetAllUsers,deleteProfile */} from "../controllers/user.controler.js"
import { authenticate,authorizeAdmin } from '../middlewares/user.middleware.js';
const router=express.Router();

router.post('/login',login);
router.post('/register',register);
router.post('/logout',authenticate,logout);
router.get('/profile',authenticate,GetUserProfile);
/* router.get('/users',authenticate,authorizeAdmin,GetAllUsers);
router.delete('/delete',authenticate,deleteProfile); */
export default router;