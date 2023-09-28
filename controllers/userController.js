const uuid = require('uuid').v4;
const fs = require('fs').promises;
const { userValidators, AppError } = require('../utils/app');


exports.createUser = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    if (!name || !email || !phone) {
      throw new AppError(400, 'Missing required fields');
    }

    const newUser = {
      name,
      email,
      phone,
      id: uuid(),
    };

   
    const usersDB = await fs.readFile('models.json');
    const users = JSON.parse(usersDB);
  
    users.push(newUser);

    await fs.writeFile('models.json', JSON.stringify(users));

    res.status(201).json({
      msg: 'Success',
      user: newUser,
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

exports.getUsers = async (req, res) => {
  try {
    const usersDB = await fs.readFile('models.json');
    const users = JSON.parse(usersDB);

    res.status(200).json({
      msg: 'Success',
      users,
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

exports.getUser = async (req, res) => {
  try {
    const { user } = req;

    res.status(200).json({
      msg: 'Success',
      user,
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};
