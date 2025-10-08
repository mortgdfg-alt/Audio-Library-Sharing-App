const connectDB = require("./config/db");


require("dotenv").config();

const app = require('./app');

connectDB();

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running in on port ${PORT}`);
});
