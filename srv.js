import { createServer } from "http"
import { Server } from "socket.io"

const http_Server = createServer((req, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*")
  response.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET")
  response.setHeader("Access-Control-Max-Age", 2592000)
})

let users = [];

const io = new Server(http_Server, {
  cors: {
    origin: "*",
  },
})

io.on("connection", (socket) => {
  users.push({ userId: socket.handshake.query.user })
  console.log(users);

  socket.on('disconnect', () => {
    socket.emit('userLeft', { user: socket.handshake.query.user })
    users = users.filter((user) => { return user.userId !== socket.handshake.query.user });
    console.log(users);
  })
})

http_Server.listen(process.env.PORT || 4000, "127.0.0.1")