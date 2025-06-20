import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import cryptoRandomString from "crypto-random-string";
import { IAnswer, IGame, IGameSettings, TeamTypes } from "./types";

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

  socket.on("createGame", (settings: IGameSettings, callback) => {
    const onlineId = cryptoRandomString({ length: 4, type: "distinguishable" });
    if (games[onlineId]) callback(false);

    settings.game = {
      ...settings.game,
      currentStage: 0,
      teamLeft: {
        fails: 0,
        players: [],
        points: 0,
      },
      teamRight: {
        fails: 0,
        players: [],
        points: 0,
      },
    };

    games[onlineId] = { ...settings, onlineId };

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
    // const stageId = games[gameId].game.currentStage;
    // games[gameId].game.questions[stageId].answers[card.id].opened = true; // TODO: change card: IAnswer to just card id
    // socket.to(gameId).emit("openCard", card); // TODO: я не знаю, но почему-то он не хочет пушить в комнату
    socket.broadcast.emit("openCard", card); // Broadcast to all clients
  });

  socket.on("changeQuestion", (gameId: string, next: boolean) => {
    console.log("changeQuestion:", next);
    // const stageId = games[gameId].game.currentStage;
    // let changed = false;
    // if (next && stageId < games[gameId].game.questions.length) {
    //   games[gameId].game.currentStage += 1;
    //   changed = true;
    // }
    // if (!next && stageId > 0) {
    //   games[gameId].game.currentStage -= 1;
    //   changed = true;
    // }
    // if (changed) {
    //   games[gameId].game.teamLeft.fails = 0;
    //   games[gameId].game.teamRight.fails = 0;
    // }

    // socket.to(gameId).emit("changeQuestion", next); // TODO: я не знаю, но почему-то он не хочет пушить в комнату
    socket.broadcast.emit("changeQuestion", next); // Broadcast to all clients
  });

  socket.on("setFail", (gameId: string, team: TeamTypes) => {
    console.log("setFail:", team);
    // if (games[gameId].game[team].fails < games[gameId].game.maxFails) {
    //   games[gameId].game[team].fails += 1;
    // }
    // socket.to(gameId).emit("setFail", next); // TODO: я не знаю, но почему-то он не хочет пушить в комнату
    socket.broadcast.emit("setFail", team); // Broadcast to all clients
  });

  socket.on("changeTeam", (gameId: string, team: TeamTypes) => {
    console.log("changeTeam:", team);
    // TODO: add current team to game settings
    // socket.to(gameId).emit("changeTeam", next); // TODO: я не знаю, но почему-то он не хочет пушить в комнату
    socket.broadcast.emit("changeTeam", team); // Broadcast to all clients
  });

  socket.on(
    "changePoints",
    (gameId: string, team: TeamTypes, points: number) => {
      console.log("changePoints:", team, points);
    //   games[gameId].game[team].points = points;

      // socket.to(gameId).emit("changePoints", next); // TODO: я не знаю, но почему-то он не хочет пушить в комнату
      socket.broadcast.emit("changePoints", [team, points]); // Broadcast to all clients
    }
  );

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const port = process.env.PORT || 8080;
httpServer.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
