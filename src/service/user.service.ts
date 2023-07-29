import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../entity/user";
import { UserInfo } from "../entity/userInfo";
import { Point } from "../entity/point";
import { IsEmailValid } from "../entity/isEmailValid";
import { myDataBase } from "../dbc";
import { emailCheck } from "../mail";
import { Token } from "../entity/token";
import crypto from "crypto";
import { CustomError } from "../customClass";
const { JWT_KEY, SECRET_KEY } = process.env;

dotenv.config();
export class UserService {
  static signup = async (
    email: string,
    password: string,
    confirmPWD: string,
    name: string,
    phone: string,
    group: number,
    authCode: string
  ) => {
    if (!email || !password || !confirmPWD || !name || !phone || !group) {
      throw new Error(
        "이메일, 비밀번호, 비밀번호 확인, 이름, 번호, 그룹을 확인해주세요."
      );
    } else if (password != confirmPWD) {
      throw new Error("비밀번호가 일치하지 않습니다.");
    }
    const isEmail = await myDataBase
      .getRepository(User)
      .findOneBy({ email: email });
    if (isEmail ? true : false) {
      throw new Error("이미 존재하는 이메일입니다.");
    }
    const isEmailValid = await myDataBase
      .getRepository(IsEmailValid)
      .findOneBy({ email: email });
    if (!isEmailValid) throw new Error("이메일을 인증해 주세요.");

    const isEmailValidauthCode = isEmailValid?.auth_code == authCode;
    if (!isEmailValidauthCode) throw new Error("인증번호가 일치하지 않습니다.");

    const passwordToCrypto = crypto
      .pbkdf2Sync(password, SECRET_KEY!.toString(), 11524, 64, "sha512")
      .toString("hex");

    const user = new User();
    user.email = email;
    user.password = passwordToCrypto;
    user.group = group;
    const userInfo = new UserInfo();
    userInfo.name = name;
    userInfo.phone = phone;
    userInfo.user = user;
    const point = new Point();
    point.userInfo = userInfo;
    point.point = 1000000;
    point.point_status = 1;
    point.point_reason = "포인트 지급";

    const result = await myDataBase.manager.transaction(
      async (transactionalEntityManager) => {
        await transactionalEntityManager.getRepository(User).insert(user);
        await transactionalEntityManager
          .getRepository(UserInfo)
          .insert(userInfo);
        await transactionalEntityManager.getRepository(Point).insert(point);
      }
    );
    return { message: "회원가입에 성공하였습니다.", status: 201, result };
  };

  static isEmailValidCheck = async (email: string) => {
    const isEmail = await myDataBase
      .getRepository(User)
      .findOneBy({ email: email });
    if (isEmail?.email) throw new Error("이미 사용중인 이메일 입니다.");

    const authCode = String(Math.floor(Math.random() * 1000000)).padStart(
      6,
      "0"
    );
    const emailAll = new IsEmailValid();
    emailAll.email = email;
    emailAll.auth_code = authCode;
    await myDataBase.getRepository(IsEmailValid).insert(emailAll);

    try {
      const title = "[typescript] 가입 인증번호 입니다.";
      const body = `사용자의 가입 인증번호는 <b>'${authCode}'</b> 입니다.`;
      await emailCheck.sendTemplateToEmail(email, title, body);
    } catch (err) {
      console.error("[이메일 발송 실패]", err);
    }

    return {
      message: "인증번호가 발송되었습니다.\n이메일을 확인해 주세요.",
      status: 200,
      result: true,
    };
  };

  static login = async (email: string, password: string) => {
    if (!email || !password) {
      throw new Error("check email or password");
    }
    const passwordToCrypto = crypto
      .pbkdf2Sync(password, SECRET_KEY!.toString(), 11524, 64, "sha512")
      .toString("hex");
    const user = await myDataBase
      .getRepository(User)
      .findOneBy({ email: email });
    if (!user || !email || !password || user.password !== passwordToCrypto) {
      throw new Error("이메일 또는 비밀번호를 입력해주세요");
    }
    //jwt 토큰

    const secretKey: string = JWT_KEY || "jwt_secret_key";
    const accessToken = jwt.sign({ user_id: user.user_id }, secretKey, {
      expiresIn: "1m",
    });
    const refreshToken = jwt.sign({}, secretKey, { expiresIn: "7d" });

    const tokenObject = new Token();
    tokenObject.refreshToken = refreshToken;
    tokenObject.user_id = user.user_id;
    await myDataBase.getRepository(Token).insert(tokenObject);
    const token = { accessToken: accessToken, refreshToken: refreshToken };
    return {
      status: 200,
      message: "로그인에 성공하였습니다.",
      result: token,
    };
  };

  static getProfile = async (user_id: number) => {
    const result = await myDataBase.manager.transaction(
      async (transactionalEntityManager) => {
        const user = await transactionalEntityManager
          .getRepository(User)
          .findOneBy({ user_id: user_id });
        const userInfo = await transactionalEntityManager
          .getRepository(UserInfo)
          .findOneBy({ user_info_id: user_id });
        const point = await transactionalEntityManager
          .getRepository(Point)
          .findOneBy({ user_info_id: user_id });

        return { user, userInfo, point };
      }
    );
    console.log("-----");
    console.log(result);
    console.log("-----");

    const payload = {
      user_id: result.user?.user_id,
      group: result.user?.group,
      name: result.userInfo?.name,
      phone: result.userInfo?.phone,
      point: result.point?.point,
    };
    return { status: 200, message: "", result: payload };
  };
}
