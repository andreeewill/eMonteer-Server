import { Socket } from 'socket.io';

/**
 * Handle all events for user (customer and mechanic)
 * @param socket - Client's socket
 */
function UserSocket(socket: Socket) {
  socket.on('test-connection', (data) => {
    console.log('dataaaa', data);
  });
  socket.on('disconnect', () => {
    console.log('A client is disconnected with id ', socket.id);
  });
  socket.emit('andre', 'william');
}

export default UserSocket;
