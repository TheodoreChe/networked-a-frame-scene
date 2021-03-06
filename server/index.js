const dotEnv = require('dotenv');
const path = require("path");
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

dotEnv.config({ path: '.env' });

const port = process.env.SERVER_PORT;

app.use(express.static(path.resolve(__dirname, "..", "dist")));

const rooms = {};

io.on("connection", socket => {
    console.log("user connected", socket.id);

    let curRoom = null;

    socket.on("joinRoom", data => {
        const { room } = data;

        if (!rooms[room]) {
            rooms[room] = {
                name: room,
                occupants: {},
            };
        }

        const joinedTime = Date.now();
        rooms[room].occupants[socket.id] = joinedTime;
        curRoom = room;

        console.log(`${socket.id} joined room ${room}`);
        socket.join(room);

        socket.emit("connectSuccess", { joinedTime });
        const occupants = rooms[room].occupants;
        io.in(curRoom).emit("occupantsChanged", { occupants });
    });

    socket.on("send", data => {
        io.to(data.to).emit("send", data);
    });

    socket.on("broadcast", data => {
        socket.to(curRoom).broadcast.emit("broadcast", data);
    });

    socket.on("disconnect", () => {
        console.log('disconnected: ', socket.id, curRoom);
        if (rooms[curRoom]) {
            console.log("user disconnected", socket.id);

            delete rooms[curRoom].occupants[socket.id];
            const occupants = rooms[curRoom].occupants;
            socket.to(curRoom).broadcast.emit("occupantsChanged", { occupants });

            if (occupants == {}) {
                console.log("everybody left room");
                delete rooms[curRoom];
            }
        }
    });
});

http.listen(port, () => {
    console.log(`listening on ${process.env.SERVER_URL}:${port}`);
});