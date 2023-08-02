import { Request, Response } from "express";
import { UserService } from "../service";
import { CustomError } from "../customClass";
export class UserController {
  /** 회원 가입 */
  static createUser = async (req: Request, res: Response) => {
    try {
      const {
        email,
        password,
        confirmPWD,
        name,
        nickname,
        phone,
        is_admin,
        authCode,
      } = req.body;
      const { status, message, result } = await UserService.signup(
        email,
        password,
        confirmPWD,
        name,
        nickname,
        phone,
        is_admin,
        authCode
      );
      res.status(status).json({ message, result });
    } catch (error) {
      if (error instanceof CustomError)
        return res.status(error.status).json({ message: error.message });
      return res.status(500).json({ message: "회원가입에 실패하였습니다." });
    }
  };

  /** 로그인 */
  static login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const { status, message, result } = await UserService.login(
        email,
        password
      );
      res.clearCookie("accessToken");
      res.cookie("accessToken", `Bearer ${result.accessToken}`); // Access Token을 Cookie에 전달한다.

      return res.status(status).json({ message });
    } catch (error) {
      if (error instanceof Error) {
        if (error.name == "TokenExpiredError") {
          const { email, password } = req.body;
          const { status, message, result } = await UserService.loginError(
            email,
            password
          );
          res.clearCookie("accessToken");
          res.cookie("accessToken", `Bearer ${result}`);
          return res.status(status).json({ message: message });
        }
      }
      if (error instanceof CustomError)
        return res.status(error.status).json({ message: error.message });
      return res.status(500).json({ message: "회원가입에 실패하였습니다." });
    }
  };

  /** 이메일 인증 */
  static isEmailValid = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      const { status, message, result } = await UserService.isEmailValidCheck(
        email
      );

      return res.status(status).json({ message, result });
    } catch (error) {
      if (error instanceof CustomError)
        return res.status(error.status).json({ message: error.message });
      return res.status(500).json({ message: "오류가 발생하였습니다." });
    }
  };

  /** 유저정보 조회 */
  static findUser = async (req: Request, res: Response) => {
    try {
      const { user_id } = res.locals.user;
      const { status, message, result } = await UserService.getProfile(user_id);

      res.status(status).json({ result });
    } catch (error) {
      if (error instanceof CustomError)
        return res.status(error.status).json({ message: error.message });
      return res.status(500).json({ message: "오류가 발생하였습니다." });
    }
  };

  /** 로그아웃 */
  static logout = async (req: Request, res: Response) => {
    try {
      const { user_id } = res.locals.user;
      const { status, message, result } = await UserService.logout(user_id);
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      res.status(status).json({ message: message });
    } catch (error) {
      if (error instanceof CustomError)
        return res.status(error.status).json({ message: error.message });

      return res.status(500).json({ message: "오류가 발생하였습니다." });
    }
  };
}
