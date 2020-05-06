const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const puppeteer = require('puppeteer');
const bodyParser = require('body-parser');
const config = require('./config/database');
const async = require('async');
const imageDownloader = require('node-image-downloader');
//const tree = require('./data.json');
const fs = require('fs');


// mongoose.connect(config.database);
// let db = mongoose.connection;

// // Check connection
// db.once('open', function(){
//   console.log('Connected to MongoDB');
// });

// // Check for DB errors
// db.on('error', function(err){
//   console.log(err);
// });


// Init App
const app = express();

// Bring in Models
let Student = require('./models/dataschema');

// Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());



// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));


var puppet = function(){
    console.log('Starting Shits');
    
    let config = {
      launchOptions:{
        headless:true
      }
    }

    const loginPage = {
      roll:'input[name="txrollno"]',
     // password:'input[id="password"]',
      submitButton:'input[name="sbmbtn"]',
      roll2:'a',
      img:'img',
      roll3:'input[name="numtxt"]'
    }

    puppeteer.launch(config.launchOptions).then(async browser => {
      const page = await browser.newPage();
      await page.goto('https://oa.cc.iitk.ac.in/Oa/Jsp/OAServices/IITK_Srch.jsp?typ=stud');
      await page.waitFor(loginPage.roll);
      await page.type(loginPage.roll,"190001");
      await page.click(loginPage.submitButton);
      await page.waitFor(loginPage.roll2);
      await page.click(loginPage.roll2);
      await page.waitFor(loginPage.img);
      for (let i = 190001; i < 190011; i++) {
        var i2 = i.toString();
        await page.type(loginPage.roll3,i2);
        await page.click(loginPage.submitButton);
        await page.waitFor(loginPage.img);
        const name = await page.evaluate(() => document.querySelectorAll('.TableContent p')[0].innerText);
        const prog = await page.evaluate(() => document.querySelectorAll('.TableContent p')[1].innerText);
        const dept = await page.evaluate(() => document.querySelectorAll('.TableContent p')[2].innerText);
        const host = await page.evaluate(() => document.querySelectorAll('.TableContent p')[3].innerText);
        const email = await page.evaluate(() => document.querySelectorAll('.TableContent p')[4].innerText);
        const blood = await page.evaluate(() => document.querySelectorAll('.TableContent p')[5].innerText);
        const gender = await page.evaluate(() => document.querySelectorAll('.TableContent p')[6].innerText);
        let bodyHTML = await page.evaluate(() => document.body.innerHTML);
        let add = bodyHTML.split('Permanent Address :')[1].split('<br>');
        let name2 = name.split(':');
        let name3 = name2[1].trim();
        let prog2 = prog.split(':');
        let prog3 = prog2[1].trim();
        let dept2 = dept.split(':');
        let dept3 = dept2[1].trim();
        let host2 = host.split(':');
        let host3 = host2[1].trim();
        let hall2 = host3.split(',');
        let hall3 = hall2[0].trim();
        let email2 = email.split(':');
        let email3 = email2[1].trim();
        let blood2 = blood.split(':');
        let blood3 = blood2[1].trim();
        let gender2 = gender.split(':');
        let gender3 = gender2[1].trim();
        let gender4 = gender3.split(' ');
        var info = new Student();
        info.name = name3;
        info.roll = i2;
        info.prog = prog3;
        info.dept = dept3;
        info.host = host3;
        info.uname = email3;
        info.blood = blood3;
        info.gender = gender4[0];
        info.year = 'Y19';
        info.hall = hall3;
        info.add = add[1];
        console.log(i2);
        console.log(name3);
        console.log(prog3);
        console.log(dept3);
        console.log(host3);
        console.log(email3);
        console.log(blood3);
        console.log(hall3);
        console.log(gender4[0]);
        console.log(add[1]);
        db.collection('maindata').findOne({roll:info.roll},function(err, docs) {
          //console.log(JSON.stringify(docs));
          if( err || !docs) {
              //console.log("No user found");
              db.collection('maindata').insertOne(info);
              console.log('DB mai nya account!');
          }
        }
        )};
      // const name = await page.evaluate(() => document.querySelectorAll('.TableContent p')[0].innerText);
      // const prog = await page.evaluate(() => document.querySelectorAll('.TableContent p')[1].innerText);
      // const dept = await page.evaluate(() => document.querySelectorAll('.TableContent p')[2].innerText);
      // const host = await page.evaluate(() => document.querySelectorAll('.TableContent p')[3].innerText);
      // const email = await page.evaluate(() => document.querySelectorAll('.TableContent p')[4].innerText);
      // const blood = await page.evaluate(() => document.querySelectorAll('.TableContent p')[5].innerText);
      // const gender = await page.evaluate(() => document.querySelectorAll('.TableContent p')[6].innerText);
      // let bodyHTML = await page.evaluate(() => document.body.innerHTML);
      // let add = bodyHTML.split('Permanent Address :')[1].split('<br>');
      // console.log(add[1]);
      // let name2 = name.split(':');
      // let name3 = name2[1].trim();
      // let prog2 = prog.split(':');
      // let prog3 = prog2[1].trim();
      // let dept2 = dept.split(':');
      // let dept3 = dept2[1].trim();
      // let host2 = host.split(':');
      // let host3 = host2[1].trim();
      // let email2 = email.split(':');
      // let email3 = email2[1].trim();
      // let blood2 = blood.split(':');
      // let blood3 = blood2[1].trim();
      // let gender2 = gender.split(':');
      // let gender3 = gender2[1].trim();
      // let gender4 = gender3.split(' ');
      // console.log(name3);
      // console.log(prog3);
      // console.log(dept3);
      // console.log(host3);
      // console.log(email3);
      // console.log(blood3);
      // console.log(gender4[0]);
      // await browser.close();

    });
};
//puppet();
var img = function(){
  for(let i=190001;i<=190010;i++){
    var i2 = i.toString();
    imageDownloader({
      imgs: [
        {
          uri: 'https://oa.cc.iitk.ac.in/Oa/Jsp/Photo/'+i2+'_0.jpg',
          filename: i2
        }
      ],
      dest: './public/photos', //destination folder
    })
      .then((info) => {
        console.log('all done', info)
      })
      .catch((error, response, body) => {
        console.log('something goes bad!')
        console.log(error)
      })
  };
};
//img();
 var er1;
 var er2;
 var er3;
 var er4;
app.get('/search', function(req,res){
    //console.log('Starting Shits');
    async.waterfall([function(callback){callback(null,res)},dept,prog,hall,batch,render],function(err,data){
        if(err) console.log(err);
        else console.log('Completed');
    });
});
var dept = function(res,callback){
  db.collection('maindata').distinct('dept',function(err,dept){
    // console.log(dept);
     if(err) console.log(err);
     else {
       //console.log(dept);
       er1 = dept.slice(0);
      // console.log(er1);
     }
     callback(null,[res,er1]);
   });
  // console.log('dept');
  
};
var prog = function([res,er1],callback){
  db.collection('maindata').distinct('prog',function(err,prog){
    // console.log(dept);
     if(err) console.log(err);
     else {
       //console.log(prog);
       er2 = prog.slice(0);
      // console.log(er);
     }
     callback(null,[res,er1,er2]);
   });
   //console.log('prog');
  
};
var hall = function([res,er1,er2],callback){
  db.collection('maindata').distinct('hall',function(err,hall){
    // console.log(dept);
     if(err) console.log(err);
     else {
       //console.log(prog);
       er3 = hall.slice(0);
      // console.log(er);
     }
     callback(null,[res,er1,er2,er3]);
   });
 //  console.log('hall');
  
};
var batch = function([res,er1,er2,er3],callback){
  db.collection('maindata').distinct('year',function(err,batch){
    // console.log(dept);
     if(err) console.log(err);
     else {
       //console.log(prog);
       er4 = batch.slice(0);
      // console.log(er);
     }
     callback(null,[res,er1,er2,er3,er4]);
   });
 //  console.log('batch');
  
};
var render = function([res,er1,er2,er3,er4],callback){
  //console.log(er1);
  res.render('index',{
    depts:er1,
    progs:er2,
    halls:er3,
    years:er4,
    title:'Student-Search'
  });
  callback();
};
  
  //console.log(er);
 // var a =  db.collection('maindata').distinct('dept');
  //console.log(dept);



app.get('/search_partial', function(req,res){
 // var rollarray = [];
 //console.log(req.body.name);
  var rollparser = req.query.roll;
  var genderparser = req.query.gender;
  var bloodparser = req.query.blood;
  var deptparser = req.query.dept;
  var progparser = req.query.prog;
  var hallparser = req.query.hall;
  var yearparser = req.query.year;
  var homeparser = req.query.home;
 // rollarray.push(genderparser);
  //console.log(genderparser);
  //console.log(ghg.length);
//  var rollquery = {};
//   if (rollparser.length == 0)
//     rollquery["$nin"] = rollarray;
//   else
//     rollquery["$in"] = rollarray;
    //{$regex: RegExp(rollquery[0]), $options: "$i"}
  db.collection('maindata').find({$or:[{roll:{$regex:rollparser}},{name:{$regex:rollparser,$options:"i"}},{uname:{$regex:rollparser,$options:"i"}}],gender:{$regex:genderparser},blood:{$regex:bloodparser},
    dept:{$regex:deptparser},prog:{$regex:progparser},hall:{$regex:hallparser},year:{$regex:yearparser},add:{$regex:homeparser,$options:"i"}}).toArray(function(err,students){
    if(err){
      console.log(err);
    } else {
      //console.log(students);
      res.render('index2', {
        students:students,
      });
    }
  });
});

//Json Trials
function json(father){
  //console.log(tree.children[0]);
  var i;
  var child = father.children;
  for(i=0;i<child.length;i++){
    //console.log(father.name+child[i].name);
    if(father.name==='all') froll = 1;
    else{
      var froll = father.name.split('-')[1];
      if(froll.charAt(0)==='Y'){
        froll = froll.substr(1);
      }
    }
    var sname = child[i].name.split('-')[0];
    var sroll = child[i].name.split('-')[1];
    if(sroll.charAt(0)==='Y'){
      sroll = sroll.substr(1);
    }
    fs.appendFileSync('./trial.txt','{id:'+sroll+',pid:'+froll+',name:"'+sname+'",img:"photos/'+sroll+'"},'+'\n', function (err) {
      if (err) throw err;
      console.log('Updated!');
    });
    json(child[i]);
  }
  // var jsonObj = JSON.parse(tree);
  // console.log(jsonObj.name);
};
//json(tree);
//Add Submit POST Route
// app.post('/', function(req, res){
//   //console.log("sdsxa");
//   console.log(req.body.name);
//   var some = req.body.name;
// }); 
// Start Server
app.listen(3000, function(){
  console.log('Server started on port 3000...');
});