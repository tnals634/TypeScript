import Joi from "joi";
import { performance } from "./message.json";
import { Request, Response, NextFunction } from "express";

export class performanceValidation {
  static pValidation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { title, content, date, time, place, seatCount, category } = req.body;

    const schema = Joi.object().keys({
      title: Joi.string()
        .empty()
        .min(2)
        .max(40)
        .regex(/^[가-힣0-9a-zA-Z]+$/)
        .required()
        .messages(performance.title),
      content: Joi.string()
        .empty()
        .min(2)
        .max(200)
        .regex(/^[가-힣a-zA-Z0-9/\s.]+$/)
        .required()
        .messages(performance.content),
      date: Joi.string()
        .empty()
        .required()
        .min(2)
        .max(30)
        .regex(/^[가-힣0-9a-zA-Z/\s.-]+$/)
        .messages(performance.date),
      time: Joi.string(),
      place: Joi.string()
        .empty()
        .min(8)
        .max(100)
        .regex(/^[가-힣0-9a-zA-Z/\s.-]+$/)
        .required()
        .messages(performance.place),
      seatCount: Joi.number().required().messages(performance.seatCount),
      category: Joi.string()
        .empty()
        .required()
        .min(3)
        .max(50)
        .regex(/^[가-힣a-zA-Z]+$/)
        .messages(performance.category),
    });
    try {
      await schema.validateAsync({
        title,
        content,
        date,
        time,
        place,
        seatCount,
        category,
      });
    } catch (err) {
      if (err instanceof Error) {
        return res.status(412).json({ message: err.message });
      }
    }

    next();
  };

  static searchValidation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { search, searchType } = req.body;

    const schema = Joi.object().keys({
      search: Joi.string()
        .empty()
        .min(2)
        .max(40)
        .regex(/^[가-힣0-9a-zA-Z]+$/)
        .required()
        .messages(performance.title),
      searchType: Joi.number()
        .required()
        .max(1)
        .messages(performance.seatCount),
    });
    try {
      await schema.validateAsync({ search, searchType });
    } catch (err) {
      if (err instanceof Error) {
        return res.status(412).json({ message: err.message });
      }
    }

    next();
  };
}
