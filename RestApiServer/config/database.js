import { Sequelize } from 'sequelize';

import config from './config.js';

import dotenv from 'dotenv';
dotenv.config({ path: `${process.cwd()}/.env` });

const env = process.env.NODE_ENV || "development"; 

const sequelize = new Sequelize(config[env]);

export default sequelize;