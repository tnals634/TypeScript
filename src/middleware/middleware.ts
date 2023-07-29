import { Request, Response, NextFunction } from "express";
import { User } from "../entity/user";
import { Token } from "../entity/token";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { myDataBase } from "../dbc";
dotenv.config();
const { JWT_KEY } = process.env;
const secretKey: string = JWT_KEY || "jwt_secret_key";

export class authMiddleware {
  static nonAuthMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (req.cookies) throw new Error("로그인시 사용할 수 없습니다.");
    } catch (error) {
      console.log(error);
      if (error) return res.status(403).json({ message: error });
      return res.status(500).json({ message: "오류가 발생하였습니다." });
    }
  };

  static allAuthMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const accessToken = req.cookies.accessToken;
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken)
        return res
          .status(400)
          .json({ message: "Refresh Token이 존재하지 않습니다." });
      if (!accessToken)
        return res
          .status(400)
          .json({ message: "Access Token이 존재하지 않습니다." });

      const isAccessTokenValidate = validateAccessToken(accessToken);
      const isRefreshTokenValidate = validateRefreshToken(refreshToken);

      if (!isRefreshTokenValidate)
        return res
          .status(419)
          .json({ message: "Refresh Token이 만료되었습니다." });

      if (!isAccessTokenValidate) {
        const accessTokenId = await myDataBase
          .getRepository(Token)
          .findOneBy({ refreshToken: refreshToken });
        if (!accessTokenId?.user_id)
          return res.status(419).json({
            message: "Refresh Token의 정보가 서버에 존재하지 않습니다.",
          });

        const newAccessToken = createAccessToken(accessTokenId.user_id);
        res.cookie("accessToken", newAccessToken);
        return res.json({ message: "Access Token을 새롭게 발급하였습니다." });
      }

      const payload = getAccessTokenPayload(accessToken);
      return res.json({
        message: `${payload}의 Payload를 가진 Token이 성공적으로 인증되었습니다.`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  static adminAuthMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const refreshTokenUserId = await req.cookies.refreshToken.user_id;

      if (!refreshTokenUserId) throw new Error("로그인 후 사용가능합니다.");
      const user = await myDataBase
        .getRepository(User)
        .findOneBy({ user_id: refreshTokenUserId });
      if (user?.group != 1) throw new Error("관계자외 사용 금지입니다.");
      next();
    } catch (error) {
      console.log(error);
    }
  };

  static userAthMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const refreshTokenUserId = await req.cookies.refreshToken.user_id;

      if (!refreshTokenUserId) throw new Error("로그인 후 사용가능합니다.");
      const user = await myDataBase
        .getRepository(User)
        .findOneBy({ user_id: refreshTokenUserId });
      if (user?.group != 0) throw Error("사용자 외 사용 금지입니다.");
      next();
    } catch (error) {
      console.log(error);
    }
  };
}

// Access Token을 검증합니다.
function validateAccessToken(accessToken: string) {
  try {
    jwt.verify(accessToken, secretKey); // JWT를 검증합니다.
    return true;
  } catch (error) {
    return false;
  }
}

// Refresh Token을 검증합니다.
function validateRefreshToken(refreshToken: string) {
  try {
    jwt.verify(refreshToken, secretKey); // JWT를 검증합니다.
    return true;
  } catch (error) {
    return false;
  }
}

// Access Token의 Payload를 가져옵니다.
function getAccessTokenPayload(accessToken: string) {
  try {
    const payload = jwt.verify(accessToken, secretKey); // JWT에서 Payload를 가져옵니다.
    return payload;
  } catch (error) {
    return null;
  }
} // Access Token을 생성합니다.
function createAccessToken(id: number) {
  const accessToken = jwt.sign(
    { id: id }, // JWT 데이터
    secretKey, // 비밀키
    { expiresIn: "1m" }
  ); // Access Token이 10초 뒤에 만료되도록 설정합니다.

  return accessToken;
}

// Refresh Token을 생성합니다.
function createRefreshToken() {
  const refreshToken = jwt.sign(
    {}, // JWT 데이터
    secretKey, // 비밀키
    { expiresIn: "7d" }
  ); // Refresh Token이 7일 뒤에 만료되도록 설정합니다.

  return refreshToken;
}
