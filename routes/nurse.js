const connection = require('../config/database');
const doctorsTable = 'doctors';
const hospitalAdminTable = 'hospital_admin';
const patientsTable = 'patients';

exports.viewPatientsOnFloor = function(req, res) {
    let query = `
                 Select patients.id as patient_id, patients.name as patient_name, patients.room_num as room, doctors.name as doctor_name, doctors.dept, date_admission 
                 FROM patients Inner Join doctors ON doctors.id = patients.doctor_id
                 INNER JOIN rooms on patients.room_num = rooms.room_num
                 Where  rooms.floor = ?   
                `;

    connection.query(query, req.params.floor, (err, results, fields) => {
        if(err) {
            res.render('error', {message: "Internal Server Error", error: err})
            return
        }

        res.render('pages/viewfloor',{data:results});
    });
};

exports.home = function(req,res){
    res.render('pages/nursesHome');
}