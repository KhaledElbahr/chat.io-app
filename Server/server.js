const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;
const path = require('path');
const publicPath = path.join(__dirname, '..', 'public');

app.use(express.static(publicPath));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.get('/', (req, res) => {
    res.render('index.html');
});

app.get('/messages', (req, res) => {
    res.send(messages);
});

app.post('/message', (req, res) => {
    messages.push(req.body);
    res.sendStatus(200);
});

const server = app.listen(PORT, () => {
    console.log(`Listening on port: http://localhost:${PORT}`);
});

const io = require('socket.io')(server);
let socketsConnected = new Set();

io.on('connection', onConnected);

function onConnected(socket) {
    socketsConnected.add(socket.id);

    io.emit('clients-total', socketsConnected.size);

    socket.on('disconnect', () => {
        socketsConnected.delete(socket.id);
        io.emit('clients-total', socketsConnected.size);
    })

    socket.on('message', (data) => {
        socket.broadcast.emit('chat-message', data);
    })

    socket.on('feedback', (data) => {
        socket.broadcast.emit('feedback', data);
    })
}

