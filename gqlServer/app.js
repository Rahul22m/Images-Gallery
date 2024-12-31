import express from 'express';
import jwt from 'jsonwebtoken';

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';

import { typeDefs } from './schema/schema.js';
import { resolvers } from './resolvers/resolver.js';

async function startServer() {
    const app = express();

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        
    });
   
    // Start Apollo Server
    await server.start();
    console.log('Apollo Server started.');

    // Express middleware
    app.use(express.json({ limit: '10mb' })); // Parse incoming JSON requests
    app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data
    app.use(cors({
        origin: ['http://localhost:5173', 'http:localhost:3000'],
        credentials: true
    })); 

    app.use('/graphql', expressMiddleware(server, {
        context: async({ req }) => {
            const authHeader = req.headers.authorization|| '';
            const token = authHeader.split(' ')[1]
            let userId;
            if(authHeader && authHeader.startsWith('Bearer')){
                const tokenDetail = jwt.verify(token, 'very-long-secret-key-rahul');
                userId = tokenDetail.id;
            }
            return {userId, token}
        },
    }));

    app.listen(4000, () => {
        console.log('Server is listening on port 4000');
    });

}

startServer();
