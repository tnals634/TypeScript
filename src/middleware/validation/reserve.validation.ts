import Joi from "joi";
import { performance } from "./message.json";
import { Request, Response, NextFunction } from "express";

export class reserveValidation {
  static rValidation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { reserveCount } = req.body;

    const schema = Joi.object().keys({
      reserveCount: Joi.number().required().messages(performance.seatCount),
    });
    try {
      await schema.validateAsync({ reserveCount });
    } catch (err) {
      if (err instanceof Error) {
        return res.status(412).json({ message: err.message });
      }
    }

    next();
  };
}
