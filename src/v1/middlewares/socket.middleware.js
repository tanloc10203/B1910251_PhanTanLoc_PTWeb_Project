const { Socket } = require("socket.io");
const {
  UnAuthorizedRequestError,
  ForbiddenRequestError,
} = require("../core/error.response");
const AuthService = require("../services/auth.service");
const { _User } = require("../models/user.model");
const { jwtService } = require("../services/jwt.service");

const PRIVATE_KEY_ACCESS_TOKEN = process.env.PRIVATE_KEY_ACCESS_TOKEN;

class SocketMiddleware {
  /**
   * @description Xac thuc truoc khi vao socket
   * @param {Socket} socket
   * @param {import("express").NextFunction} next
   * @returns
   */
  static async auth(socket, next) {
    const sessions = socket.request.session;

    if (
      Object.keys(sessions).length === 0 ||
      !sessions.token ||
      !sessions.token.refreshToken
    ) {
      return next(new UnAuthorizedRequestError());
    }

    const { refreshToken } = sessions.token;

    const { accessToken } = socket.handshake.auth;

    if (!accessToken) {
      return next(new UnAuthorizedRequestError("Not authorized!"));
    }

    try {
      const user = await SocketMiddleware.verifyToken({
        accessToken,
        refreshToken,
      });
      socket.user = user;
    } catch (error) {
      console.log("error SocketMiddleware auth", error);
      return next(error.message);
    }

    next();
  }

  /**
   *
   * @param {{accessToken: String, refreshToken: String}} param0
   * @returns
   */
  static async verifyToken({ accessToken, refreshToken }) {
    const { valid, decoded, errors } = jwtService.verify(
      accessToken,
      PRIVATE_KEY_ACCESS_TOKEN
    );

    if (!valid && errors) {
      if (errors.message === "jwt expired") {
        const authService = new AuthService(_User);

        const response = await authService.refreshToken({
          token: refreshToken,
        });

        if (response.elements) {
          return await SocketMiddleware.verifyToken({
            accessToken: response.elements.accessToken,
            refreshToken: response.elements.refreshToken,
          });
        }
      } else {
        throw new ForbiddenRequestError(errors.message);
      }
    }

    return decoded.user;
  }
}

module.exports = SocketMiddleware;
