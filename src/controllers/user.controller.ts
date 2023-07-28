import { Request, Response } from "express";
import { UserService } from "../service";
export class UserController {
  static createUser = async (req: Request, res: Response) => {
    try {
      const { email, password, confirmPWD, name, phone, group, authCode } =
        req.body;
      const { status, message, result } = await UserService.signup(
        email,
        password,
        confirmPWD,
        name,
        phone,
        group,
        authCode
      );
      res.status(status).json({ message, result });
    } catch (error) {
      console.log(error);
      if (error) return res.status(403).json({ message: error });
      return res.status(500).json({ message: "회원가입에 실패하였습니다." });
    }
  };

  static findUser = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const { status, message, result } = await UserService.login(
        email,
        password
      );
      res.status(200).json({ message, result });
    } catch (error) {
      const message = error;
      console.error(error);
      if (error) return res.status(403).json({ message: message });
      return res.status(500).json({ message: "회원가입에 실패하였습니다." });
    }
  };

  static isEmailValid = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      const { status, message, result } = await UserService.isEmailValidCheck(
        email
      );

      return res.status(status).json({ message, result });
    } catch (error) {
      console.error(error);
      if (error) return res.status(403).json({ message: error });
      return res.status(500).json({ message: "오류가 발생하였습니다." });
    }
  };
}
