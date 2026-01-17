import { success } from "zod";
import Event from "../models/event.model.js";
import User from "../models/user.model.js";
export const getAllEvents=async(req,res)=>{
    try {
        const events=await Event.find();
        if(events.length===0){
            return res.status(404).json({
                success:true,
                message:"No events available now"
            })
        }
        res.status(200).json({
            success:true,
            message:"All events are fetched Successfully",
            data:{
                events
            }
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Server Error",
            error:error.message
        })
    }
};

export const getMyEvents=async(req,res)=>{
    try {
        const userId=req.user._id;
        const user=await User.findById(userId).populate('eventId',);
        const events=user.eventId;
        if(events.length===0){
            return res.status(404).json({
                success:true,
                message:"You have not created any event yet"
            })
        }
        res.status(200).json({
            success:true,
            message:"User events fetched Successfully",
            data:{
                events
            }
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Server Error",
            error:error.message
        })
    }
};
export const getEventById=async(req,res)=>{
    try {
        const eventId=req.params.id;
        const event=await Event.findById(eventId);
        if(!event){
            return res.status(404).json({
                success:false,
                message:"No event found with this id"
            })
        }
            res.status(200).json({
            success:true,
            message:"Event fetched Successfully",
            data:{
                event
            }
        })

    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Server Error",
            error:error.message
        })
    }
}

export const CreateEvent=async(req,res)=>{
    try {
        const userId=req.user._id;
        const event = await Event.create({
            eventName:req.body.eventName,
            user_id:userId,
            eventStatus:req.body.eventStatus
        })

        const user=await User.findById(userId);
        user.eventId.push(event._id);
        await user.save();
        return res.status(201).json({
            success:true,
            message:"Event Created Successfully",
            data:{
                event
            }
        })

}catch(error){
     return res.status(500).json({
                success:false,
                message:"Server Error",
                error:error.message
            })
}
}
export const updateEvent=async(req,res)=>{
    try {
        const eventId=req.params.id;
        const event=await Event.findById(eventId);
        if(!event){
            return res.status(404).json({
                success:false,
                message:"No event found with this id"
            })
        }
        event.eventStatus=req.body.eventStatus||event.eventStatus;
        await event.save();
        res.status(200).json({
            success:true,
            message:"Event updated Successfully",
            data:{
                event
            }
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Server Error",
            error:error.message
        })
    }
};

export const searchEvents=async(req,res)=>{
    try {
         const { name, type } = req.query;
        let query = {};
        if (name) {
            query.name = { $regex: name, $options: 'i' };
        }
        if (type) {
            query.type = type.toLowerCase();
        }
        const events=await Event.find(query).populate('user_id','name email role');
        if(events.length===0){
            return res.status(404).json({
                success:false,
                message:"No events found matching the criteria"
            })
        }
        res.status(200).json({
            success:true,
            message:"Events searched Successfully",
            data:{
                events
            }
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Server Error",
            error:error.message
        })
    }
};