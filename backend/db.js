const mongoose = require('mongoose');
const mongoUrl="mongodb+srv://abhi8777078:abhi8777078@cluster0.9cw7rnp.mongodb.net/"


const connectDB = async() => {
    try {
        mongoose.connect(mongoUrl);
        console.log('Connected to database');
    } catch (error) {
        console.log(error)
    }
}

module.exports =connectDB;