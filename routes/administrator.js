const connection = require('../config/database');
const doctorsTable = 'doctors';
const hospitalAdminTable = 'hospital_admin';
const patientsTable = 'patients';


exports.admitPatient = function(req,res) {
  if(req.method == 'GET'){
    res.render('pages/addpatient');
  }
  else{
    let query = `INSERT INTO ${patientsTable} (name, email, gender, age, phone, room_num, doctor_id, date_admission) values (?,?,?,?,?,?,?,now())`;
    let values = [req.body.name, req.body.email, req.body.gender, req.body.age, req.body.phone, req.body.room_num, req.body.doctor_id];
    connection.query(query, values, (err, results, fields) => {
      if(err){
        res.render('error', {message : "Internal Server Error", error : err});
        return
      }
      res.render('pages/viewpatients',{patients:results});
    });
  }
};

exports.viewPatients = function(req, res) {
  let query = `Select patients.id as patient_id, patients.name as patient_name, room_num, doctors.name as doctor_name, doctors.dept as dept FROM patients Inner Join doctors ON doctors.id = patients.doctor_id
`;
  console.log('in viewpatients');
  connection.query(query, (err, results, fields) => {
    if(err) {
      res.render('error', {message : "Internal Server Error", error : err});
      return
    }
    res.render('pages/viewpatients',{data:results});
  });
};

exports.dischargeAndGenerateBill = function(req, res) {
      let query = `Update patients Set date_discharge = now() Where id = ?`;
      connection.query(query, req.body.patient_id,(err, results, fields) => {
        if(err){
          res.render('error', {message : "Internal Server Error in first query", error : err});
          return
        }
        query = `
                Select datediff(date_admission, date_discharge) as days, patients.name as name,visitation, cost
                From patients Inner Join doctors ON patients.doctor_id = doctors.id
                INNER JOIN rooms ON patients.room_num = rooms.room_num
                Where patients.id = ?
              `;

        connection.query(query,  req.body.patient_id,(err, results, fields) => {
            if(err) {
            res.render('error', {message : "Internal Server Error", error : err});
            return
        }

        let bill = (results[0].days + 1) * results[0].cost + (results[0].days + 1) * results[0].visitation;

        res.render('pages/bill',{bill:bill,patient:results});
        });
      });
};
