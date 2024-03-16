const fs = require('fs').promises;
const { AppError } = require('../utils/app');

exports.checkUserId = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (id.length !== 36) {
      throw new AppError(400, 'Invalid Id');
    }

    const usersDB = await fs.readFile('models.json');
    const users = JSON.parse(usersDB);

    const user = users.find((item) => item.id === id);

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    req.user = user;

    next();
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};
