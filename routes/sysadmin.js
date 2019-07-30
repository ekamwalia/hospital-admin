const connection = require('../config/database');
const bcrypt = require('bcryptjs');

const doctorsTable = 'doctors';
const hospitalAdminTable = 'hospital_admin';

exports.home = function (req, res) {
    let doctorsQuery = `Select name, email, jobType, dept, visitation from doctors`;

    connection.query(doctorsQuery, (err, results, fields) => {
        if(err) {
            res.send('error', {message : "Internal Server Error", error : err});
            return
        }

        let data  = {doctors : results};

        let adminsQuery = `Select name, email, jobType, salary  from hospital_admin Order By jobtype, name asc`
        connection.query(adminsQuery, (err, results, fields) => {
            if(err) {
                res.render('error', {message : "Internal Server Error", error : err})
                return
            }
            data['admins'] = results;
            res.render('pages/employees',{doctors:data['doctors'],admins:data['admins']});
        });

    });
};

exports.addNewEmpPage = function(req, res) {
    res.render('pages/sysadminNewEmp');
};

exports.addNewEmp = function(req, res) {
    if(!req.body.profile)
        res.render('/error', {message : "Bad Request"});

    if(req.body.profile == 'Doctor') {
        let query = `INSERT INTO ${doctorsTable} (name,email,password,dept,jobType,visitation) Values (?,?,?,?,?,?)`;
        let hash = bcrypt.hashSync(req.body.password, 8);

        let values = [req.body.name, req.body.email, hash, req.body.dept, 'Doctor', req.body.salary];

        connection.query(query, values, (err, results, fields) => {
            if(err)
                res.render('error', {message : "Internal Server Error", error : err})
            else {
                res.redirect('/sysadmin/home');
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
                res.redirect('/sysadmin/home');
            }
        });
    }
};