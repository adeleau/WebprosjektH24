import mysql from 'mysql2';

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  
  connectionLimit: 8,
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
