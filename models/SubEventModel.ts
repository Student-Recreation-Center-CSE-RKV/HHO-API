import mongoose from "mongoose";
import {SubEventDocument} from './models';
const subEventSchema = new mongoose.Schema<SubEventDocument>({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    venue:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        required:true
    },
    time:{
        type:String,
        required:true
    },
    poster:{
        type:String
    },
    mainEventId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Events",
        required:true
    }
},{
    timestamps:true
})

const subEventModel = mongoose.model<SubEventDocument>('subEvents',subEventSchema);

export default subEventModel;