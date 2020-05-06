let mongoose = require('mongoose');



//Student Schema

const StudentSchema = mongoose.Schema({
  name: String,
  roll: String,
  uname: String,
  prog: String ,
  dept: String,
  hall: String,
  year: String,
  host: String,
  blood: String,
  gender: String,
  add: String
});

const Student = module.exports = mongoose.model('maindata',StudentSchema);


