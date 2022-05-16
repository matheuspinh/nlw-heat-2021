//Importing dotenv module installed with "yarn add dotenv"
import "dotenv/config";
//Importing the express module
import express from "express";
//Importing router from the services directory
import { router } from "./routes";
//Importing Server for websocket communication
import { Server } from "socket.io";
import http from "http";
import cors from "cors";

//Creating a new Instance of Express called app
const app = express();
app.use(cors())
//Creating a new Instance of Server
const serverHttp = http.createServer(app);
//Create instance of io
const io = new Server(serverHttp, {
  cors: {
    origin: "*"
  }
});

io.on("connection", socket => {
  console.log(`Usuário conectado no socket ${socket.id}`);
});
//Specifying that we expect to receive JSON requisitions
app.use(express.json());

app.use(router);

//Authentication route to github
app.get("/github", (request, response) => {
  response.redirect(
    `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`);
});

//Callback route from github
app.get("/signin/callback", (request, response) => {
  //Desestruturação de code
  const { code } = request.query;
  return response.json(code);
})

export { serverHttp, io };