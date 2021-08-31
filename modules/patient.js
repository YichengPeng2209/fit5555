const mongoose = require('mongoose');

let patientSchema = mongoose.Schema({
    __id:mongoose.Schema.Types.ObjectId,
    name:{
        type:String,
        required:true,
    },

    doctor:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor'
    },

    age:{
        type:Number,
        validate:{
            validator:function(ageValue){
                return ageValue>=0 && ageValue<=120;
            },
            message:'the value of age should between 0 to 120',
        },
    },

    vistDate:{
        type:Date,
        default:Date.now,
    },

    description:{
        type:String,
        validate:{
            validator:function(desc){
                return desc.length >=10;
            },
            message:'the length of description should be at least 10 characters',
        },
    },

});

module.exports = mongoose.model('Patient',patientSchema);
