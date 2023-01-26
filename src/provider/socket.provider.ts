import cookie from 'cookie';
import { Server as SocketServer } from 'socket.io';
import { Server } from 'http';

class SocketIO {
  private ioInst?: SocketServer;

  public initializeServer(server: Server) {
    this.ioInst = new SocketServer(server, {
      cors: { origin: process.env.FRONTEND_APP || 'http://localhost:3000' },
    });

    // Will be triggered on client first connect
    this.ioInst.use((socket, next) => {
      const parsedCookie = cookie.parse(socket.handshake.headers.cookie!);
      console.log('cookie socket', parsedCookie);
      // todo : add cookie validation here
      // can add attr to socket obj (ex. socket.user = ...)
      next();
    });

    this.ioInst.on('connection', (socket) => {
      socket.on('disconnect', () => {
        console.log('A client is disconnected with id ', socket.id);
      });
    });
  }

  get io() {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.ioInst!;
  }
}

const socketInstance = new SocketIO();

export { socketInstance };

export default socketInstance.io;
