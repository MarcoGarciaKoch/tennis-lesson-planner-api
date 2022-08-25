import express from "express";
import cors from 'cors';
import authRouter from "./auth/auth.router.js";
import { validateAuth } from "./auth/auth.middleware.js";
import usersRouter from './users/users.router.js';
// Create express server
export var app = express();
// Middleware to allow communication between front server and back server, ensuring some security.
app.use(cors());
//Middleware that reads the body (string in JSON format) and transforms into an JavaScript object.
app.use(express.json());
app.get('/ping', function (_req, res) { return res.send('pong'); });
app.use('/auth', authRouter); // Declare authetication router
app.use('/users', validateAuth, usersRouter); // Declare user router
