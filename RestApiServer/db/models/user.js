'use strict';
import {Model, Sequelize, DataTypes} from 'sequelize';
import bcrypt from 'bcrypt';
import sequelize from '../../config/database.js';
// import image from './image.js';
// const AppError = require('../../utils/appError');


const user = sequelize.define('user', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  userType:{
    type: DataTypes.ENUM('User', 'Admin'),
    allowNull: false,
    validate:{
      notNull: {
        msg: 'userType cannot be null',
      },
      notEmpty: {
        msg: 'userType cannot be empty'
      }
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate:{
      notNull:{
        msg:'email cannot be null'
      },
      notEmpty:{
        msg:'email cannot be empty'
      },
      isEmail:{
        msg: 'Invalid email id'
      },
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate:{
      notNull:{
        msg:'password cannot be null'
      },
      notEmpty:{
        msg:'password cannot be empty'
      },
    },
  },
  confirmPassword: {
    type: DataTypes.VIRTUAL,
    set(value){
      if(this.password.length<8){
        throw new Error(
          'Password length must be greater than 8'
        );
      }
      if(value === this.password){
        const hashedPassword = bcrypt.hashSync(value, 10);
        this.setDataValue('password', hashedPassword);
      }else{
        throw new Error(
          'Password and confirm password must be the same'
        );
      }
    },
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE,
  },
  deletedAt: {
    allowNull: true,
    type: DataTypes.DATE,
  },
}, {
  paranoid: true,
  freezeTableName: true,
  modelName: 'user',
});

export default user; 