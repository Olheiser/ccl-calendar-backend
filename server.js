require('dotenv').config();
const express = require('express');
//const http = require('http'); // provides the createServer() method
const bodyParser = require('body-parser'); // parse the request body and make it available as a javascript object
//const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');
const mongoose = require('mongoose');

const userRouter = require('./router/userRoutes')
const courtRouter = require('./router/courtRoutes')
const courtSittingRouter = require('./router/courtSittingRoutes')
const courtAttendanceRouter = require('./router/courtAttendanceRoutes')
const authRouter = require('./router/authRoutes')

const app = express(); // Create an instance of the Express application
const MONGO_URL = 'mongodb+srv://npradmin:IwaAtlassaur49@nprobinson.7yutoqh.mongodb.net/CanadaCriminalLawyer';
const PORT = process.env.PORT || 8000;

// allows your server to accept requests from other domains
app.use(cors({
    credentials: true,
}));

// compress responses to reduce the size of the data sent over the network
app.use(compression());

// parse cookies in the request headers
//app.use(cookieParser());

// Enables body parsing for URL-encoded data and JSON data.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/* Connect to the database */
mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB database')
}).catch((err) => {
  console.error(err);
  process.exit(1);
})

app.use('/api/users', userRouter);
app.use('/api/courts', courtRouter);
app.use('/api/courtSittings', courtSittingRouter);
app.use('/api/courtAttendance', courtAttendanceRouter);
app.use('/auth', authRouter);

// Start the server and listen on port 8000
const server = app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

// Handle errors
server.on('error', (err) => {
  console.error(err);
  process.exit(1);
})
