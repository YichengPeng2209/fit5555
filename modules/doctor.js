const mongoose = require('mongoose');

let doctorSchema = mongoose.Schema({
    __id:mongoose.Schema.Types.ObjectId,
    name:
    {
        firstName:{
            type: String,
            required:true,
        },
        lastName: String,
    },
    DOB:{
        type: Date,
        default: Date.now,
    },
    address:{
        state:{
            type:String,
            validate:{
                validator: function(state){
                    return state.length >= 2 && state.length<=3;
                },
                message: 'length of state should be min 2, max 3 characters',
            },
        },
        suburb:String,
        street:String,
        unit:String,
    },
    numberOfPatient:{
        type:Number,
        validate:
        {
            validator:function(number){
                return number >= 0;
            },
            message: 'number of patients should be a postive number',
        },
    },
});


module.exports = mongoose.model('Doctor',doctorSchema);