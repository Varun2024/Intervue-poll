
const express = require('express');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://intervue-poll.web.app", 
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3000;

// --- Data Stores ---
let currentPoll = null;
let participants = {};

// --- Socket.IO Connection Logic ---
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

socket.on('joinRoom', ({ name, role }) => {
  // Default to student if no role is provided (safety check)
  const finalRole = role === 'student' ? 'student' : 'teacher';

  participants[socket.id] = { name, role: finalRole };
  console.log(`${name} (${finalRole}) joined the room.`);

  socket.emit('myInfo', { id: socket.id, name, role: finalRole });
  io.emit('updateParticipantList', Object.values(participants));
});

  // Handle a teacher kicking a student
  socket.on('kickUser', (targetId) => {
    // Security Check: Only a teacher can kick users
    if (participants[socket.id] && participants[socket.id].role === 'teacher') {
      const userToKick = io.sockets.sockets.get(targetId);
      if (userToKick) {
        console.log(`Kicking user ${targetId}`);
        userToKick.disconnect(true); // Force disconnect the target user
      }
    }
  });

  // --- NEW: Chat Logic --- START --- 💬
  socket.on('sendMessage', (messageText) => {
    // Find the sender's info using their socket ID
    const sender = participants[socket.id];

    // Ensure the sender is a valid, joined participant
    if (sender) {
      console.log(`${sender.name} sent message: ${messageText}`);

      // Create a message object to send to all clients
      const messageData = {
        senderName: sender.name,
        senderId: socket.id,
        message: messageText,
        timestamp: new Date().toISOString()
      };

      // Broadcast the new message to ALL connected clients
      io.emit('newMessage', messageData);
    } else {
      // Optional: Handle case where a non-participant tries to send a message
      console.warn(`Attempted message from unknown socket: ${socket.id}`);
      socket.emit('chatError', 'You must join the room before sending messages.');
    }
  });
  // --- NEW: Chat Logic --- END ---

  // --- Polling Logic ---
  if (currentPoll) {
    socket.emit('pollData', {
        question: currentPoll.question,
        options: Object.keys(currentPoll.votes),
        timer: currentPoll.timer,
        correctOption: currentPoll.correctOption
    });
  }

  socket.on('createPoll', ({ question, options, timer, correctOption }) => {
    currentPoll = {
        question, options, correctOption, timer,
        votes: options.reduce((acc, option) => ({ ...acc, [option]: 0 }), {}),
        voters: new Set(),
    };
    io.emit('pollData', { question, options, timer, correctOption });
    console.log('New poll created and broadcast.');
  });

  socket.on('submitVote', (option) => {
    if (currentPoll && !currentPoll.voters.has(socket.id) && currentPoll.votes.hasOwnProperty(option)) {
        currentPoll.votes[option]++;
        currentPoll.voters.add(socket.id);
        io.emit('updateResults', { question: currentPoll.question, votes: currentPoll.votes });
    } else {
        socket.emit('voteError', 'You have already voted or the option is invalid.');
    }
  });


  // --- Disconnect Logic ---
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    // Remove the user from participants list
    delete participants[socket.id];
    // Broadcast the new list to everyone
    io.emit('updateParticipantList', Object.values(participants));
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});