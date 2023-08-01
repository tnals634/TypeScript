import { Request, Response } from "express";
import { ReserveService } from "../service/reserve.service";
import { CustomError } from "../customClass";
export class ReserveController {
  static createReserve = async (req: Request, res: Response) => {
    try {
      const { reserveCount } = req.body;
      const user_id = res.locals.user.user_id;
      const { performance_id } = req.params;
      const { status, message, result } =
        await ReserveService.PerformanceReservation(
          user_id,
          reserveCount,
          Number(performance_id)
        );

      return res.status(status).json({ message: message });
    } catch (error) {
      if (error instanceof CustomError)
        return res.status(error.status).json({ message: error.message });
      return res.status(500).json({ message: "공연 예매에 실패했습니다." });
    }
  };

  static getReserve = async (req: Request, res: Response) => {
    try {
      const user_id = res.locals.user.user_id;
      const { status, message, result } = await ReserveService.reservationGet(
        user_id
      );
      return res.status(status).json({ reserves: result });
    } catch (error) {
      if (error instanceof CustomError)
        return res.status(error.status).json({ message: error.message });
      return res.status(500).json({ message: "예매표 조회에 실패했습니다." });
    }
  };
}
