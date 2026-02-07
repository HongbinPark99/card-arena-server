// Card Arena Multiplayer Server
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Game rooms storage
const rooms = new Map();
const waitingPlayers = [];

// Room class
class GameRoom {
    constructor(roomId) {
        this.roomId = roomId;
        this.players = [];
        this.gameState = null;
        this.ready = new Set();
    }

    addPlayer(player) {
        if (this.players.length < 2) {
            this.players.push(player);
            return true;
        }
        return false;
    }

    isFull() {
        return this.players.length === 2;
    }

    getOpponent(playerId) {
        return this.players.find(p => p.id !== playerId);
    }
}

io.on('connection', (socket) => {
    console.log(`Player connected: ${socket.id}`);

    // Find match
    socket.on('findMatch', (playerData) => {
        console.log(`${playerData.username} looking for match...`);

        // Check if there's a waiting player
        if (waitingPlayers.length > 0) {
            const opponent = waitingPlayers.shift();
            const roomId = `room_${Date.now()}`;
            const room = new GameRoom(roomId);

            room.addPlayer({ id: socket.id, ...playerData });
            room.addPlayer(opponent);

            rooms.set(roomId, room);

            // Join both players to room
            socket.join(roomId);
            const opponentSocket = io.sockets.sockets.get(opponent.id);
            if (opponentSocket) {
                opponentSocket.join(roomId);
            }

            // Notify both players
            io.to(roomId).emit('matchFound', {
                roomId,
                players: room.players,
                yourTurn: 1
            });

            console.log(`Match created: ${roomId}`);
        } else {
            // Add to waiting list
            waitingPlayers.push({ id: socket.id, ...playerData });
            socket.emit('waiting');
        }
    });

    // Cancel matchmaking
    socket.on('cancelMatch', () => {
        const index = waitingPlayers.findIndex(p => p.id === socket.id);
        if (index > -1) {
            waitingPlayers.splice(index, 1);
        }
    });

    // Player ready with deck selection
    socket.on('playerReady', ({ roomId, selectedCards }) => {
        const room = rooms.get(roomId);
        if (!room) return;

        room.ready.add(socket.id);
        socket.to(roomId).emit('opponentReady');

        // Store selected cards
        const player = room.players.find(p => p.id === socket.id);
        if (player) {
            player.selectedCards = selectedCards;
        }

        // Both players ready - start game
        if (room.ready.size === 2) {
            io.to(roomId).emit('gameStart', {
                player1: room.players[0],
                player2: room.players[1]
            });
        }
    });

    // Submit actions
    socket.on('submitActions', ({ roomId, actions, roundData }) => {
        const room = rooms.get(roomId);
        if (!room) return;

        const player = room.players.find(p => p.id === socket.id);
        if (player) {
            player.actions = actions;
            player.roundData = roundData;
        }

        // Check if both submitted
        const allSubmitted = room.players.every(p => p.actions);
        if (allSubmitted) {
            // Send actions to both players for execution
            io.to(roomId).emit('executeBattle', {
                player1Actions: room.players[0].actions,
                player2Actions: room.players[1].actions,
                player1Data: room.players[0].roundData,
                player2Data: room.players[1].roundData
            });

            // Clear actions for next turn
            room.players.forEach(p => {
                delete p.actions;
                delete p.roundData;
            });
        } else {
            // Notify opponent that we're waiting
            socket.to(roomId).emit('opponentSubmitted');
        }
    });

    // Card selection for next round
    socket.on('selectCardsForRound', ({ roomId, selectedCards }) => {
        const room = rooms.get(roomId);
        if (!room) return;

        const player = room.players.find(p => p.id === socket.id);
        if (player) {
            player.nextRoundCards = selectedCards;
        }

        const bothSelected = room.players.every(p => p.nextRoundCards);
        if (bothSelected) {
            io.to(roomId).emit('bothPlayersSelectedCards', {
                player1Cards: room.players[0].nextRoundCards,
                player2Cards: room.players[1].nextRoundCards
            });

            room.players.forEach(p => delete p.nextRoundCards);
        }
    });

    // Game over
    socket.on('gameOver', ({ roomId, winner }) => {
        socket.to(roomId).emit('opponentLeft', { winner });
        rooms.delete(roomId);
    });

    // Disconnect
    socket.on('disconnect', () => {
        console.log(`Player disconnected: ${socket.id}`);

        // Remove from waiting list
        const waitingIndex = waitingPlayers.findIndex(p => p.id === socket.id);
        if (waitingIndex > -1) {
            waitingPlayers.splice(waitingIndex, 1);
        }

        // Find and cleanup room
        for (const [roomId, room] of rooms.entries()) {
            const playerIndex = room.players.findIndex(p => p.id === socket.id);
            if (playerIndex > -1) {
                socket.to(roomId).emit('opponentDisconnected');
                rooms.delete(roomId);
                break;
            }
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🎮 Card Arena Server running on port ${PORT}`);
    console.log(`🌐 http://localhost:${PORT}`);
});
