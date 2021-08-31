const Doctor = require('./modules/doctor');
const Patient = require('./modules/patient');
const mongoose = require('mongoose');
const express= require('express');
const app = express();
const ejs = require("ejs");
var moment = require("moment");
//allow Express to understand the urlencoded format
app.use(express.urlencoded({ extended: true }));

// Express should be able to render ejs templates
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
let viewPath = __dirname + "/views/";

// we have some static assets such as images in this project
app.use(express.static("public/img"));
app.use(express.static("public/css"));


let url = 'mongodb://localhost:27017/FIT2095Week6';
mongoose.connect(url, function (err) {
    if (err) {
        console.log('Error in Mongoose connection');
        throw err;
    }

    console.log('Successfully connected');
});


app.get("/", function (req, res) {
  // generate the relative path
  let fileName = viewPath + "index.html";
  // send index.html back to the client
  res.sendFile(fileName);
});

app.get("/addDoctor", function (req, res) {
  // generate the relative path
  let fileName = viewPath + "addDoctor.html";
  // send index.html back to the client
  res.sendFile(fileName);
});

app.get("/addPatient",function(req,res)
{
    let fileName = viewPath + "addPatient.html";
  // send index.html back to the client
  res.sendFile(fileName);
});

app.get("/listDoctor",function(req,res)
{
  let fileName = viewPath + "listDoctor.html";
  Doctor.find({},function(err,data){
      res.render(fileName,{doctor:data});
  });
}
);

app.get("/listPatient",function(req,res)
{
  let fileName = viewPath + "listPatient.html";
  // send index.html back to the client
  Patient.find({}).populate('doctor').exec(function (err, data) {
      console.log(data);
       res.render(fileName,{patient: data});
    });
}
);

app.get("/deletePatient",function(req,res)
{
  let fileName = viewPath + "deletePatient.html";
  // send index.html back to the client
  res.sendFile(fileName);
}
);

app.get("/updateDoctor",function(req,res)
{
  let fileName = viewPath + "updateDoctor.html";
  // send index.html back to the client
  res.sendFile(fileName);
}
);

app.post("/addDoctor",function(req,res){
    let doctorDetail = req.body;
    let doctor = new Doctor(
        {
        _id: new mongoose.Types.ObjectId(),
        name: {
            firstName: doctorDetail.firstName,
            lastName: doctorDetail.lastName,},
        DOB:doctorDetail.DOB,
        address:{
            state: doctorDetail.state,
            suburb: doctorDetail.suburb,
            street: doctorDetail.street,
            unit: doctorDetail.unit
        },
        numberOfPatient:parseInt(doctorDetail.numOfPatient),
        }
    );

    doctor.save(function(err){
        if (err){
            console.log(err);
        }
        res.redirect("/listDoctor");
    });
    
});

app.post("/addPatient",function(req,res){
    let patientDetail = req.body;
    let patient = new Patient(
        {
        name: patientDetail.patientName,
        doctor: patientDetail.doctorID,
        age: patientDetail.age,
        vistDate:patientDetail.vistDate,
        description:patientDetail.desc,
        }
    );
    
    patient.save(function(err)
    {
        if (err){
            console.log('error');
        }
        else{
            Doctor.findByIdAndUpdate(patient.doctor,{$inc:{'numberOfPatient':1}},function(err,docs){
                    res.redirect('/listPatient');
                
            });
        }
    });




    
});

app.post("/deltePatientByName",function(req,res){
    let patientName = req.body.delPatient;
    Patient.deleteMany({ 'name': patientName }, function (err, doc) {
    console.log(doc);
});
res.redirect('/listPatient');

});

app.post("/updateDotorByID",function(req,res)
{
    let doctorId = req.body.updateDoctorNum;
    let newNumber = parseInt(req.body.newNum);
    Doctor.findByIdAndUpdate(doctorId,{$set:{'numberOfPatient':newNumber}},function(err,docs){
                    res.redirect('/listPatient');
});
});

app.listen(8080);