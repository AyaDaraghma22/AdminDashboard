const axios = require('axios')

exports.homeRoutes = (req, res) => {
  // Make a get request to /api/users
  axios.get('http://localhost:3000/api/users')
    .then(function (response) {
      res.render('Basic', { users: response.data })
    })
    .catch(err => {
      res.send(err)
    })
}

exports.add_user = (req, res) => {
  res.render('AddUser')
}

exports.update_user = (req, res) => {
  const userId = req.params.userId;

  axios.get(`http://localhost:3000/User/api/users/${userId}`)
    .then(function (response) {
      const userData = response.data;
      console.log('User data:', userData);
      res.render('UpdateUser', { user: userData });
    })
    .catch(err => {
      console.error('Error fetching user data:', err);
      res.status(500).send('Error fetching user data');
    });
};
