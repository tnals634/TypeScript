import { Request, Response } from "express";
import { PerformanceService } from "../service";
import { CustomError } from "../customClass";

export class PerformanceController {
  /** 공연 등록 */
  static performanceCreate = async (req: Request, res: Response) => {
    const image = req.file ? req.file : null;
    const { title, content, date, time, place, seatCount, category } = req.body;
    const { user_id } = res.locals.user;
    try {
      const dateAndTime = JSON.stringify([date, time]);
      const { status, message, result } =
        await PerformanceService.performanceCreate(
          user_id,
          title,
          content,
          dateAndTime,
          place,
          seatCount,
          JSON.stringify(image),
          category
        );
      return res.status(status).json({ message: message });
    } catch (error) {
      console.log(error);
      if (error instanceof CustomError)
        return res.status(error.status).json({ message: error.message });
      return res.status(500).json({ message: "공연 등록에 실패했습니다." });
    }
  };

  /** 공연 조회 */
  static performanceGet = async (req: Request, res: Response) => {
    try {
      const { status, message, performances } =
        await PerformanceService.performanceGet();

      return res.status(status).json({ performances });
    } catch (error) {
      if (error instanceof CustomError)
        return res.status(error.status).json({ message: error.message });
      return res.status(500).json({ message: "공연 조회에 실패했습니다." });
    }
  };

  /** 공연 제목순 조회 */
  static performanceTitleGet = async (req: Request, res: Response) => {
    try {
      const { status, message, performances } =
        await PerformanceService.performanceTitleGet();

      return res.status(status).json({ performances });
    } catch (error) {
      if (error instanceof CustomError)
        return res.status(error.status).json({ message: error.message });
      return res.status(500).json({ message: "공연 조회에 실패했습니다." });
    }
  };

  /** 공연 상세 조회 */
  static performanceDetailGet = async (req: Request, res: Response) => {
    try {
      const { performance_id } = req.params;
      const { status, message, result } =
        await PerformanceService.performanceDetailGet(Number(performance_id));
      return res.status(status).json({ performance: result });
    } catch (error) {
      if (error instanceof CustomError)
        return res.status(error.status).json({ message: error.message });
      return res.status(500).json({ message: "상세 조회에 실패했습니다." });
    }
  };

  /** 공연 검색 조회 */
  static performanceSearchGet = async (req: Request, res: Response) => {
    try {
      const { search, searchType } = req.body;

      const { status, message, performance } =
        await PerformanceService.performanceSearchGet(search, searchType);

      return res.status(status).json({ performance });
    } catch (error) {
      if (error instanceof CustomError)
        return res.status(error.status).json({ message: error.message });
      return res.status(500).json({ message: "공연 검색에 실패했습니다." });
    }
  };
}
