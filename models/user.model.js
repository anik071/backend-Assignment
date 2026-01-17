import mongoose from "mongoose"
import { type } from "os"
import { required } from "zod/mini";
import bcrypt from 'bcrypt'
import Event from "./event.model.js";
const userSchema=new mongoose.Schema({
    "name":{type:String,required:true},
    "email":{type:String,required:true,unique:true},
    "role":{
        type:String,
        enum:['admin','user'],
        default:"user"
    },
    "password":{type:String,required:true},
    "eventId":[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Event",
    }
    ]
},{
    timestamps:true
});
userSchema.pre('save',async function(){
    if(!this.isModified('password'))return;
    const salt=await bcrypt.genSalt(10)
    this.password =await bcrypt.hash(this.password,salt)
})
userSchema.methods.isValid= async function(userPass) {
    return await bcrypt.compare(userPass,this.password);
}

export default mongoose.model('User',userSchema)