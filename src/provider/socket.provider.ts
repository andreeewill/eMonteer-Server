import cookie from 'cookie';
import { Server as SocketServer } from 'socket.io';
import { instrument } from '@socket.io/admin-ui';
import { Server } from 'http';

import UserSocket from '../component/user/socket';

class SocketIO {
  private ioInst?: SocketServer;

  public initializeServer(server: Server) {
    this.ioInst = new SocketServer(server, {
      cors: {
        origin: [
          process.env.FRONTEND_APP || 'http://localhost:3000',
          'https://admin.socket.io',
        ],
        credentials: true,
      },
    });

    instrument(this.ioInst, {
      auth: false,
      mode: 'development',
    });

    const customerNamespace = this.ioInst.of('/customer');

    // Will be triggered on client first connect
    customerNamespace.use((socket, next) => {
      console.log('general socket');
      const parsedCookie = cookie.parse(socket.handshake.headers.cookie || '');
      console.log('parsed cookie', parsedCookie);
      // console.log('cookie socket', parsedCookie.toString());
      // todo : add cookie validation here
      // can add attr to socket obj (ex. socket.user = ...)
      next();
    });

    const mechanicNamespace = this.ioInst.of('/mechanics');

    mechanicNamespace.use((socket, next) => {
      console.log('soket data', socket.handshake.auth);
      console.log('socket data', socket.data);
      // console.log('socket data', socket);
      next();
    });

    mechanicNamespace.on('connection', (socket) => {
      UserSocket(socket);
      console.log('a client connected');
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
