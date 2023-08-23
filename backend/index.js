const express = require('express');
const connectDB = require('./db');
const app = express();
const cors = require('cors')

connectDB();
const port = 8080

// it is use to enable the json response in the output 
app.use(express.json());
app.use(cors())

// available routes
app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})