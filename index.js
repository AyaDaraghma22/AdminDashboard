// index.js
const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const bodyparser = require('body-parser')
const UserRouter = require('./server/routes/UserRouter')
const path = require('path')
const cors = require('cors');

const app = express()
const port = 3000

app.use(morgan('tiny'));
app.use(express.static('frontend'));
app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json())
app.use(cors());

// MongoDb connection
app.use(morgan('tiny'));
mongoose.connect('mongodb://0.0.0.0/AdminDashboard', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const conn = mongoose.connection

conn.once('open', () => {
  console.log('Connected to MongoDB')
})

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err)
})

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE'
  )
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  next()
})

app.use(bodyparser.urlencoded({ extended: true }))
app.use(express.json())
app.use('/User', UserRouter)
app.use(express.static(path.join(__dirname, 'frontend')));

app.use(express.static(path.resolve(__dirname, 'dist')))// Serve static files from the dist directory

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'frontend', 'Basic.html'))
})
// Define route to serve CSS file
app.get('/style.css', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'style.css'));
});
app.get('/add_user', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'frontend', 'AddUser.html'))
})
app.get('/update_user/:userId', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'frontend', 'UpdateUser.html'))
})
app.engine('html', require('ejs').renderFile);
app.set('frontend engine', 'html');
app.set('frontend', path.join(__dirname, 'frontend/html'));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
