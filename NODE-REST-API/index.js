const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const route = require('./routes/users')
const auth = require('./routes/auth')
const post = require('./routes/post')

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('MongoDB Connected');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

connectDB();

//Middlewares

app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/api/user", route)
app.use("/api/auth", auth)
app.use("/api/posts", post)

// app.get("/", (req,res)=>{
//     res.send("welcome to homepage")
// })
// app.get("/users", (req,res)=>{
//     res.send("welcome to userpage")
// })


app.listen(8800, () => { 
    console.log(`Server is running on port ${8800}`); 
})



module.exports = app;