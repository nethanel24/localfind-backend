require('dotenv').config();
console.log('MONGO_URI:', process.env.MONGO_URI); // ← הוסף שורה זו
const app = require('./app');
const connectDB = require('./config/db');
connectDB();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});