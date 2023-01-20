import { Server as SocketServer } from 'socket.io';
import { Server } from 'http';

class SocketIO {
  private ioInst?: SocketServer;

  public initializeServer(server: Server) {
    this.ioInst = new SocketServer(server, {});
  }

  get io() {
    return this.ioInst;
  }
}

const socketInstance = new SocketIO();

export { socketInstance };

export default socketInstance.io;
