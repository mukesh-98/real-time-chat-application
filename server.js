const express = require("express");
const socket = require("socket.io");
const app = express();
const port = 3100;

const regServer = app.listen(port, () =>
	console.log(`Example app listening on port ${port}! \n `)
);
server = socket(regServer);

server.on("connection", (socket) => {
	console.log("socket id", socket.id);
	getMyId(socket);
	messageOn(socket);
});
function getMyId(socket) {
	server.emit("getMyId", socket.id);
}
function messageOn(socket) {
	socket.on("message", (data) => {
		console.log("message data", data);
		broadcastEmit(socket, data);
	});
}

function broadcastEmit(socket, data) {
	server.emit("broadcast", { ...data, id: socket.id });
}
