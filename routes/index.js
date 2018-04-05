const express = require('express');
const mysql = require('mysql');
const connection = require('../config/database');

const doctorsTable = 'doctors';
const hospitalAdminTable = 'hospital_admin';

}
/* GET home page. */
exports.index =  function(req, res, next) {
  res.render('pages/index');

/* POST login user */
exports.login = function(req, res, next) {
  if(!req.body.email || !req.body.password  || !req.body.profile)
    res.status(403).send({success : false , msg : "Bad Request"});

  let table;
  switch(req.body.profile) {
    case 'Doctor' :
      table = doctorsTable
      break;
    case 'Hosptial Admin' :
      table = hospitalAdminTable
      break
  }

  let query = `SELECT * from ${table} WHERE email = ?`
  connection.query(query, [req.body.email], (err, results, fields) => {
    if (err){
      res.render('/error', {message : "Internal Server Error"})
      return
    }
    else if(results.length == 0){
      res.status(200).send({success : false, msg : "Could Not Find User"});
      return
    }
    else {
      hashAndComparePasswords(results[0].password, req.body.password, (err, match) => {
        if(err) {
          res.render('/error', {message : "Internal Server Error"})
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
  if (userPassword == enteredPassword) {
    done(null, true);
    return
  }
  done("Random", false);
}

exports.home = function(req,res) {
  if(req.session.key.jobType == 'Doctor') {
    let query = `SELECT name, age, gender, date_admission, room_num FROM patients WHERE doctor_id = ?`;

    connection.query(query, [req.session.key.id], (err, results, field) => {
      if(err)
        res.render('/error', {message : "Internal Server Error"})
      else if(results.length == 0)
        res.render('/doctorsHome', {message : "No patients found"})
      else {
        res.render('/doctorsHome', {patiets : results})
      }
    });
  } else if(req.session.key.jobType == 'Adminstrator') {
    res.render('pages/adminHome')
  } else if(req.session.key.JobType == 'Nurse') {
    let query = `SELECT name, age, gender, date_admission, room_num FROM patients WHERE room_num IN
                    (SELECT room_num  FROM rooms WHERE floor = ?)
                `;

    connection.query(query, [req.body.floor], (err, results, field) => {
      if(err)
        res.render('/error', {message : "Internal Server Error"})
      else if(results.length == 0)
        res.render('/nursesHome', {message : "No patients found on this floor"})
      else {
        res.render('/nursesHome', {patiets : results})
      }
    });
  }

  res.render('/error', {message : "Internal Server Error"});
}
