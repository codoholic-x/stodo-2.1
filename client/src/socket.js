// socket.js
import { io } from 'socket.io-client';

// Connect to backend socket server
const socket = io('http://localhost:5000'); // Same port as your backend

export default socket;
