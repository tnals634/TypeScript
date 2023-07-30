import { Request, Response } from "express";
import { PerformanceService } from "../service";
import { myDataBase } from "../dbc";

export class PerformanceController {
  static performanceCreate = async (req: Request, res: Response) => {
    const { title, content, price } = req.body;
    const user_id = res.locals.user.user_id;
    try {
      const { status, message, result } =
        await PerformanceService.performanceCreate(
          user_id,
          title,
          content,
          price
        );
      return res.status(status).json({ message: message });
    } catch (error) {
      console.log(error);
      if (error) return res.status(403).json({ message: error });
      return res.status(500).json({ message: "공연 등록에 실패했습니다." });
    }
  };

  static performanceGet = async (req: Request, res: Response) => {
    try {
      const { status, message, performances } =
        await PerformanceService.performanceGet();

      return res.status(status).json({ performances });
    } catch (error) {
      return res.status(500).json({ message: "공연 조회에 실패했습니다." });
    }
  };

  static performanceDetailGet = async (req: Request, res: Response) => {
    try {
      const { performance_id } = req.params;
      const { status, message, result } =
        await PerformanceService.performanceDetailGet(Number(performance_id));
      return res.status(status).json({ performance: result });
    } catch (error) {
      return res.status(500).json({ message: "상세 조회에 실패했습니다." });
    }
  };
  static performanceSearchGet = async (req: Request, res: Response) => {
    try {
      const { search, category } = req.body;
      const { status, message, performance } =
        await PerformanceService.performanceSearchGet(search, category);

      return res.status(status).json({ performance });
    } catch (error) {
      return res.status(500).json({ message: "공연 검색에 실패했습니다." });
    }
  };
}