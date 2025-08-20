const express = require('express')
const http = require('http')
const { Server } = require('socket.io')


const app = express()
const server = http.createServer(app)
const io = new Server(server, {
    cors: { origin: '*' }
})
const port = 3000

let users = [];

app.get('/', (req, res) => {
    res.send('Hello World!')
})

io.on("connection", (socket) => {
    console.log("um novo user conectou")

    socket.on("registerUser", (username) => {
        users.push({ id: socket.id, username })

        io.emit("userConnected", username)
        socket.emit("systemMessage", "Bem-vindo ao chat," + username)
    })

    socket.on("sendMessage", (data) => {
        io.emit("newMessage", { username: data.username, message: data.message })
    })

    //desconectar user
    socket.on("disconnected", () => {
        console.log("um usuario foi desconectado", socket.id) 
        const username = users.find(u => u.id === socket.id)?.username;
        io.emit("userDisconnected", username)
    });
});



server.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
