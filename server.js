const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config({ path: './config.env' });

// CONNECTION WITH ATLAS CLOUD DATABASE
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then((con) => {
    // console.log(con.connections);
    console.log('DB conncetion successfull');
  });

// LOCAL DATABSE CONNECTION
// mongoose
//   .connect(process.env.LOCAL_DATABASE, {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: false
//   })
//   .then((con) => {
//     // console.log(con.connections);
//     console.log('DB conncetion successfull');
//   });

const app = require('./app');
// to log all env variable
// console.log(process.env);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
