'use strict';
import {Model, Sequelize, DataTypes} from 'sequelize';
import sequelize from '../../config/database.js';
import user from './user.js';

const image = sequelize.define('image', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  dataUri: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'user', 
      key: 'id',    
    },
    onDelete: 'CASCADE',
  },
  createdAt: {
    allowNull: false,

    type: DataTypes.DATE
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE
  },
  deletedAt:{
    allowNull:true,
    type: DataTypes.DATE,
  },
}, {
    paranoid:true,
    freezeTableName:true,
    modelName: 'image'
  });

image.belongsTo(user, { foreignKey: 'userId', as: 'user' });

export default image;