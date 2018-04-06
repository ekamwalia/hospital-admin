const connection = require('../config/database');
const doctorsTable = 'doctors';
const hospitalAdminTable = 'hospital_admin';
const patientsTable = 'patients';

exports.viewPatients = function(req, res) {
    let query = `
                 Select patients.id as patient_id, patients.name as patient_name, patients.room_num, doctors.name as doctor_name, doctors.dept, date_admission 
                 FROM patients Inner Join doctors ON doctors.id = patients.doctor_id
                 Where doctors.id= ?   
                `;

    connection.query(query, req.session.key.id, (err, results, fields) => {
        if(err) {
            res.render('error', {message: "Internal Server Error", error: err});
            return
        }

        res.send({success : true, data : results})
    });
};