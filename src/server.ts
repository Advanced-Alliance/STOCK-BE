import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import cryptoRandomString from "crypto-random-string";
import { IAnswer, IGameSettings, TeamTypes } from "./types";

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
    const onlineId = cryptoRandomString({ length: 4, type: "distinguishable" });
    if (games[onlineId]) callback(false);
    games[onlineId] = { ...game, onlineId };

    socket.join(onlineId);

    socket.emit("message", "You are successfully created a game");

    callback(onlineId);
  });

  socket.on("joinGame", (id, callback) => {
    const onlineId = cryptoRandomString({ length: 4, type: "distinguishable" });
    if (!games[id]) callback(false);

    socket.join(onlineId);

    console.log("User joined a game", id);

    callback(games[id]);
  });

  socket.on("message", (msg: string) => {
    console.log("Message:", msg);
    socket.broadcast.emit("message", msg); // Broadcast to all clients
  });



  socket.on("openCard", (gameId: string, card: IAnswer) => {
    console.log("openCard:", gameId, card);
    // socket.to(gameId).emit("openCard", card); // TODO: я не знаю, но почему-то он не хочет пушить в комнату
    socket.broadcast.emit("openCard", card); // Broadcast to all clients
  });

  socket.on("changeQuestion", (gameId: string, next: boolean) => {
    console.log("changeQuestion:", next);
    // socket.to(gameId).emit("changeQuestion", next); // TODO: я не знаю, но почему-то он не хочет пушить в комнату
    socket.broadcast.emit("changeQuestion", next); // Broadcast to all clients
  });

  socket.on("setFail", (gameId: string, team: TeamTypes) => {
    console.log("setFail:", team);
    // socket.to(gameId).emit("setFail", next); // TODO: я не знаю, но почему-то он не хочет пушить в комнату
    socket.broadcast.emit("setFail", team); // Broadcast to all clients
  });

  socket.on("changeTeam", (gameId: string, team: TeamTypes) => {
    console.log("changeTeam:", team);
    // socket.to(gameId).emit("changeTeam", next); // TODO: я не знаю, но почему-то он не хочет пушить в комнату
    socket.broadcast.emit("changeTeam", team); // Broadcast to all clients
  });




  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const port = process.env.PORT || 8080;
httpServer.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
