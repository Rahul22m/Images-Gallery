const bcrypt = require('bcrypt');
module.exports = {
  up: (queryInterface, Sequelize) => {
    let password = process.env.ADMIN_PASSWORD
    const hashedPassword = bcrypt.hashSync(password,10);
    return queryInterface.bulkInsert('user', [
      {
        userType: "Admin",
        email: process.env.ADMIN_EMAIL,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('user', {userType:'Admin'}, {});
  },
};
