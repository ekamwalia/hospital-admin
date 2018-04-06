const mysql = require('mysql');
const connection = require('./config/database');

connection.connect( (err) => {
	if(err)
		return console.log('ERROR : Could not connect to database. ', err);
});

// Doctors Table
let createDoctorsTable = `CREATE TABLE doctors(
                      id int not null primary key auto_increment,
                      name varchar(50) ,
                      email varchar(50) not null,
                      password varchar(80) not null,
                      dept varchar(20) not null,
					  jobType varchar(20) not null,
                      visitation numeric(6,2) not null
                      )`;

connection.query(createDoctorsTable , (err , results , fields) => {
  if(err)
    return console.error("ERROR : Error creating table " + err);

  console.log("SUCCESS : Doctors Table Created")
});


// Hospital Admin Table
let createAdminTable = `
                        CREATE TABLE hospital_admin(
                        id int not null primary key auto_increment,
                        name varchar(50) ,
                        email varchar(50) not null,
                        password varchar(80) not null,
                        jobType varchar(20) not null,
                        salary numeric(10,2) not null
                      )`;

connection.query(createAdminTable , (err , results , fields) => {
  if(err)
    return console.error("ERROR : Error creating table " + err)

  console.log("SUCCESS : Hospital Admin Table Created")
});


// Rooms Table
let createRoomsTable = `
                        CREATE TABLE rooms(
                        room_num int not null,
                        floor int not null
                        building varchar(20) not null,
					    occupancy int not null,
                        cost numeric(6,2) not null
                      )`;

connection.query(createRoomsTable , (err , results , fields) => {
  if(err)
    return console.error("ERROR : Error creating table " + err)

  console.log("SUCCESS : Rooms Table Created")
});

// Rooms Table
let createPatientsTable = ` 
                            CREATE TABLE patients(
                            id int not null primary key auto_increment,
                            name varchar(20) not null,
                            email varchar(20) not null,
                            phone varchar(10) not null,
                            gender  varchar(1) not null,
                            age int not null,
                            room_num varchar(10) not null,
                            dept varchar(10) not null,
                            doctor_id int not null,
                            date_admission date not null,
                            date_discharge date
                      )`;

connection.query(createPatientsTable , (err , results , fields) => {
  if(err)
    return console.error("ERROR : Error creating table " + err)

  console.log("SUCCESS : Patients Table Created")
});


// Close connection to database
connection.end((err) => {
  if(err)
    return console.error("ERROR : Could not close connection to database " + err)

  console.log("SUCCESS : Connection to database closed")
});