import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import cryptoRandomString from 'crypto-random-string';
import { IGameSettings } from "./types";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const games: { [key: string]: IGameSettings } = {};

io.on("connection", (socket: Socket) => {
  console.log("User connected:", socket.id);

  socket.on("createGame", (game, callback) => {
    const gameId = cryptoRandomString({length: 4, type: 'distinguishable'});
    if (games[gameId]) callback(false);
    games[gameId] = game;
	
    socket.join(gameId);

    console.log("User created a game. Games (rooms):", games);

    console.log("Data of a game. Games (rooms):", game);

    socket.emit("message", 'You are successfully created a game');

	callback(gameId);
  });

  socket.on("joinGame", (id, callback) => {
    const gameId = cryptoRandomString({length: 4, type: 'distinguishable'});
    if (!games[id]) callback(false);
	
    socket.join(gameId);

    console.log("User joined a game", id);
	
	callback(games[id]);
  });

  socket.on("message", (msg: string) => {
    console.log("Message:", msg);
    socket.broadcast.emit("message", msg); // Broadcast to all clients
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const port = process.env.PORT || 8080;
httpServer.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
