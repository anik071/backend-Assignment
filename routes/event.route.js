import express from "express";
import {getAllEvents,getMyEvents,getEventById,CreateEvent,updateEvent,searchEvent} from "../controllers/event.controller.js"
import { authenticate, authorizeAdmin } from "../middlewares/user.middleware";
import { get } from "mongoose";

const router=express.Router();
router.get('/search/:key',authenticate,searchEvent);
router.get('/all',authenticate,authorizeAdmin,getAllEvents);
router.get('/me',authenticate,getMyEvents);
router.get('/:id',authenticate,getEventById);
router.post('/',authenticate,CreateEvent);
router.put('/:id',authenticate,updateEvent);


export default router;