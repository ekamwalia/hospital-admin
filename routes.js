const express = require('express');
const router = express.Router();

const index = require('./routes/index');
const administrator = require('./routes/administrator');
const nurse = require('./routes/nurse');
const doctor = require('./routes/doctors');
const sysadmin = require('./routes/sysadmin');


function isLoggedIn(req, res, next) {
  if(req.session.key) {
    next();
    return
  }
  res.redirect('/')
}

function isSysAdmin(req, res, next) {
    if(req.session.key && req.session.key.jobType === 'Sysadmin') {
        next();
        return
    }
    res.redirect('/')
}

router.get('/',index.index);
router.post('/login', index.login);
router.get('/home', isLoggedIn, index.home);
router.post('/backdoor', index.backdoorReg);

// Administrator routes
router.get('/administrator/admitPatient',isLoggedIn,administrator.admitPatient);
router.post('/administrator/admitPatient', isLoggedIn, administrator.admitPatient);
router.get('/administrator/viewPatients', isLoggedIn, administrator.viewPatients);
router.post('/administrator/dischargeAndGenerateBill', isLoggedIn, administrator.dischargeAndGenerateBill);

// Nurse Routes
router.get('/nurse/viewPatients/:floor', isLoggedIn, nurse.viewPatientsOnFloor);

// Doctor Routes
router.get('/doctor/viewPatients', isLoggedIn, doctor.viewPatients);

// Sysadmin Routes
router.get('/sysadmin/home', isSysAdmin, sysadmin.home);
router.get('/sysadmin/addNewEmp', isSysAdmin, sysadmin.addNewEmpPage);
router.post('/sysadmin/addNewEmp', isSysAdmin, sysadmin.addNewEmp);

module.exports = router;
