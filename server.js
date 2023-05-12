const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./app');
// to log all env variable
// console.log(process.env);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
