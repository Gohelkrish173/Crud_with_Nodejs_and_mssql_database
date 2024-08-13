const sql = require('mssql/msnodesqlv8');

const config = {
  server: "LAPTOP-KA8DP3HL\\SQLEXPRESS",
  database: "CS",
  options: {
    trustedConnection: true, // Set to true if using Windows Authentication
    trustServerCertificate: false, // Set to true if using self-signed certificates
  },
  driver: "msnodesqlv8", // Required if using Windows Authentication
};

sql.connect(config).then(pool =>{
  if(pool.connecting){
    console.log('local sql server is connecting...');
  }
  if(pool.connect){
    console.log("connected");
  };
}).catch(err => console.log('database connection Failed! Bad config',err));

module.exports = sql;
