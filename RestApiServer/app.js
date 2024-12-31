import dotenv from 'dotenv';
dotenv.config({ path: `${process.cwd()}/.env` });

import imageRoutes from './routes/imageRoutes.js'
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import sequelize from './config/database.js';

import * as OpenApiValidator from 'express-openapi-validator';

import image from './db/models/image.js';
import user from './db/models/user.js';



import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cors from 'cors';


const app = express();
app.use(express.json({ limit: '10mb' }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(cors({
    origin:  ['http://localhost:4000/graphql', 'http://localhost:5173'],
    credentials: true
}));

user.hasMany(image, { foreignKey: 'userId', onDelete: 'cascade'});
image.belongsTo(user, { foreignKey: 'userId'});

sequelize.sync()
    .then(() => {
        console.log('All models were synchronized successfully.');
    });

app.use('/images', express.static(path.join(__dirname, 'images')));



// const spec = path.join(__dirname, 'openapi.yaml');
// app.use('/spec', express.static(spec));


const swaggerDocument = YAML.load(`${__dirname}/openapi.yaml`);


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.use(
    OpenApiValidator.middleware({
      apiSpec: './openapi.yaml',
      validateRequests: false, // (default)
      validateResponses: false, // false by default
    }),
  );


app.use(imageRoutes);
app.use(authRoutes);
app.use(userRoutes);

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
    errors: err.errors,
  });
});

app.listen(process.env.APP_PORT, ()=>
    {console.log('Server is listening')});