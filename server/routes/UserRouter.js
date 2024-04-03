const express = require('express')
const route = express.Router()
const services = require('../../services/render')

const {
  CreateUser,
  FindUser,
  UpdateUser,
  DeleteUser
} = require('../controllers/UserController')

route.get('/', services.homeRoutes)
route.get('/add_user', services.add_user)
route.get('/update_user', services.update_user)

// API
route.post('/api/users', CreateUser)
route.get('/api/users', FindUser)
route.put('/api/users/:id', UpdateUser)
route.delete('/api/users/:id', DeleteUser)

module.exports = route
