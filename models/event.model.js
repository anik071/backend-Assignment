import mongoose, { mongo } from "mongoose";

const eventSchema=new mongoose.Schema({
    eventName:{
        type:String,
        required:true
    },
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:user,
    },
    eventStatus:{
        type:String,
        enum:['ongoing','completed','upcoming','cancelled'],
        default:"upcoming"
    }
},{
    timestamps:true
});
export default mongoose.model("Event",eventSchema);