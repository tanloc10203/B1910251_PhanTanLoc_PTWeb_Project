const { Socket } = require("socket.io");

class SocketService {
  /**
   *
   * @param {Socket} socket
   */
  static initializeUser = (socket) => {
    // socket.user = {...socket.request.seesion.}
    console.log("user connect", socket.user);

    socket.join(socket.user._id);

    const newUser = {};
  };
}

module.exports = SocketService;
