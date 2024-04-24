const User = require('../models/UserModel');
const jwt = require('jsonwebtoken');

exports.CreateUser = async (req, res) => {
  const { name, email, gender, status } = req.body;

  try {
    const newUser = new User({
      name,
      email,
      gender,
      status
    });

    await newUser.save(); // Save the user without a callback

    console.log('User added successfully');
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).json({ success: false, error: 'Failed to save user' });
  }
};

exports.FindUser = (req, res) => {
  if (req.query.id) {
    const id = req.query.id

    User.findOneAndUpdate({ _id: id }, req.body, { new: true, useFindAndModify: false })
      .then(updatedUser => {
        if (!updatedUser) {
          res.status(404).send({ message: `Cannot Update user with ${id}. Maybe user not found!` })
        } else {
          res.json(updatedUser)
        }
      })
      .catch(err => {
        res.status(500).send({ message: 'Error Update user information', error: err }) // Handling database query error
      })
  } else {
    User.find()
      .then(users => { // Renaming user to users for clarity, as this will return an array of users
        res.send(users)
      })
      .catch(err => {
        res.status(500).send({ message: 'Error Occurred while retrieving user information', error: err })
      })
  }
}

// Update a new identified user by user id

exports.UpdateUser = (req, res) => {
  if (!req.body) {
    return res
      .status(400)
      .send({ message: 'Data to update can not be empty' })
  }

  const id = req.params.id
  User.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({ message: `Cannot Update user with ${id}. Maybe user not found!` })
      } else {
        res.send(data)
      }
    })
    .catch(err => {
      res.status(500).send({ message: 'Error Update user information', error: err })
    })
}

// Delete a user with specified user id in the request
exports.DeleteUser = (req, res) => {
  const id = req.params.id;

  User.findByIdAndDelete(id)
    .then(data => {
      if (!data) {
        res.status(404).send({ message: `Cannot delete user with id ${id}. User not found` });
      } else {
        res.send({ message: 'User was deleted successfully!' });
      }
    })
    .catch(err => {
      res.status(500).send({ message: 'Could not delete user with id ' + id, error: err });
    });
};
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing

exports.Signin = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user in the database by username
    const user = await User.findOne({ username });

    // Check if user exists
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, username: user.username }, process.env.SECRET_KEY, { expiresIn: '1h' });

    // Send token as response
    res.json({ success: true, token });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
