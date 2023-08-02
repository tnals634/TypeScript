import Joi from "joi";
import { user } from "./message.json";
import { Request, Response, NextFunction } from "express";

export class userValidation {
  static signupValidation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
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

    const schema = Joi.object().keys({
      email: Joi.string()
        .empty()
        .max(40)
        .regex(
          /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i
        )
        .required()
        .messages(user.email),
      nickname: Joi.string()
        .empty()
        .min(2)
        .max(15)
        .regex(/^[ㄱ-ㅎ가-힣a-zA-Z0-9]+$/)
        .required()
        .messages(user.nickname),
      name: Joi.string()
        .empty()
        .required()
        .min(2)
        .max(10)
        .regex(/^[가-힣a-zA-Z]+$/)
        .messages(user.name),
      phone: Joi.string()
        .empty()
        .required()
        .min(11)
        .max(15)
        .regex(/^\d{2,3}-?\d{3,4}-?\d{4}$/)
        .messages(user.phone),
      password: Joi.string()
        .empty()
        .min(8)
        .max(20)
        .regex(/^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+])/)
        .required()
        .messages(user.password),
      confirmPWD: Joi.string()
        .valid(Joi.ref("password"))
        .required()
        .messages(user.confirmPassword),
      is_admin: Joi.boolean(),
      authCode: Joi.string().allow(""),
    });
    try {
      await schema.validateAsync({
        email,
        password,
        confirmPWD,
        name,
        nickname,
        phone,
        is_admin,
        authCode,
      });
    } catch (err) {
      if (err instanceof Error) {
        return res.status(412).json({ message: err.message });
      }
    }

    next();
  };

  static loginValidation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { email, password } = req.body;

    const schema = Joi.object().keys({
      email: Joi.string()
        .empty()
        .max(40)
        .regex(
          /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i
        )
        .required()
        .messages(user.email),
      password: Joi.string()
        .empty()
        .min(8)
        .max(20)
        .regex(/^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+])/)
        .required()
        .messages(user.password),
    });
    try {
      await schema.validateAsync({ email, password });
    } catch (err) {
      if (err instanceof Error) {
        return res.status(412).json({ message: err.message });
      }
    }

    next();
  };

  static emailValidation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { email } = req.body;

    const schema = Joi.object().keys({
      email: Joi.string()
        .empty()
        .max(40)
        .regex(
          /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i
        )
        .required()
        .messages(user.email),
    });
    try {
      await schema.validateAsync({ email });
    } catch (err) {
      if (err instanceof Error) {
        return res.status(412).json({ message: err.message });
      }
    }

    next();
  };
}
