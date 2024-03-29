const express = require("express"); // Access
const socket = require("socket.io");

const app = express(); //Initialized and server ready

app.use(express.static("public"));

let port = process.env.PORT || 1000;
let server = app.listen(port, () => {
    console.log("Listening to port :" + port);
})

let io = socket(server);

io.on("connection", (socket) => {
    console.log("Made socket connection");
    // Received data
    socket.on("beginpath", (data) => {
        // data -> data from frontend
        // Now transfer data to all connected computers
        io.sockets.emit("beginpath", data);
    })
    socket.on("drawstroke", (data) => {
        io.sockets.emit("drawstroke", data);
    })
    socket.on("redoundo", (data) => {
        io.sockets.emit("redoundo", data);
    })
})