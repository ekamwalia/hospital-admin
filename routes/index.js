const mysql = require('mysql');
const connection = require('../config/database');
const bcrypt = require('bcryptjs');

const salt = 'vf43864kshsb6535id'
const doctorsTable = 'doctors';
const hospitalAdminTable = 'hospital_admin';

/* GET home page. */
exports.index =  function(req, res) {
  res.render('pages/index');
}

/* POST login user */
exports.login = function(req, res) {
  if(!req.body.email || !req.body.password  || !req.body.profile){
      res.status(403).send({success : false , msg : "Bad Request"});
      return
  }

  let table;
  switch(req.body.profile) {
    case 'Doctor' :
      table = doctorsTable;
      break;
    default :
      table = hospitalAdminTable
  }

  console.log("Table is  : ", table);
  let query = `SELECT * from ${table} WHERE email = ?`;
  connection.query(query, [req.body.email], (err, results, fields) => {
    if (err){
      res.render('error', {message : "Internal Server Error", error : err})
      return
    }
    else if(results.length == 0){
      res.status(200).send({success : false, msg : "Could Not Find User"});
      return
    }
    else {
      console.log(results[0]);
      console.log(req.body.password);
      hashAndComparePasswords(results[0].password, req.body.password, (err, match) => {
        if(err) {
          res.render('error', {message : "Internal Server Error", error : err})
          return
        }
        else if(!match) {
          res.status(200).send({success : false, msg : "Wrong Password"})
          return
        }
        else {
          req.session.key = results[0]
          res.redirect('/home')
        }
      });
    }
  });
}

function hashAndComparePasswords(userPassword, enteredPassword, done) {
  done(null, bcrypt.compareSync(enteredPassword, userPassword))
}

exports.home = function(req,res) {
  if(req.session.key.jobType == 'Doctor') {
    let query = `SELECT name, age, gender, date_admission, room_num FROM patients WHERE doctor_id = ?`;
    connection.query(query, [req.session.key.id], (err, results, field) => {
      if(err)
        res.render('error', {message : "Internal Server Error", error : err})
      else if(results.length == 0)
        res.render('pages/doctorsHome', {message : "No patients found"})
      else {
        console.log(results);
        res.render('pages/doctorsHome', {patients : results})
      }
    });

  } else if(req.session.key.jobType === 'Administrator') {

    res.redirect('/administrator/viewpatients');

  } else if(req.session.key.jobType === 'Nurse') {

        res.redirect('/nurse/viewPatients/1');

  } else if(req.session.key.jobType === 'Sysadmin') {

      res.render('pages/sysadmin');

  } else{

    res.render('error', {message : "Internal Server Error", error : null});

  }
}

exports.backdoorReg = function(req,res) {
  if(!req.body.profile)
    res.render('/error', {message : "Bad Request"});

  if(req.body.profile == 'Doctor') {
    let query = `INSERT INTO ${doctorsTable} (name,email,password,dept,jobType,visitation) Values (?,?,?,?,?,?)`;
    let hash = bcrypt.hashSync(req.body.password, 8);

   let values = [req.body.name, req.body.email, hash, req.body.dept, 'Doctor', req.body.visitation];

   connection.query(query, values, (err, results, fields) => {
     if(err)
      res.render('error', {message : "Internal Server Error", error : err})
      else {
        res.redirect('/');
      }
   });
 } else {
     let query = `INSERT INTO ${hospitalAdminTable} (name,email,password,jobType, salary) Values (?,?,?,?,?)`;
     let hash = bcrypt.hashSync(req.body.password, 8);

     let values = [req.body.name, req.body.email, hash,req.body.profile, req.body.salary];

     connection.query(query, values, (err, results, fields) => {
      if(err)
       res.render('error', {message : "Internal Server Error", error : err});
       else {
         res.redirect('/');
       }
    });
   }
};
