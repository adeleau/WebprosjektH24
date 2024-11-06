import mysql from 'mysql2';


const pool = mysql.createPool({
  host: 'mysql.stud.ntnu.no',
  user: 'fs_dcst2002_1_gruppe3',
  password: 'Passord123',
  database: 'fs_dcst2002_1_gruppe3_dev',
  
  connectionLimit: 4,
  // Convert MySQL boolean values to JavaScript boolean values
  typeCast: (field, next) =>
    field.type == 'TINY' && field.length == 1 ? field.string() == '1' : next(),
});

pool.getConnection((error, connection) => {
  if (error) {
    console.error('Error connecting to the database: ', error); // Logg feil ved tilkobling
    return;
  }

  console.log('Successfully connected to the database'); // Logg suksess ved tilkobling
  connection.release(); // Husk å frigjøre forbindelsen
});

export default pool;
