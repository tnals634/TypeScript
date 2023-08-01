import { Point } from "../entity/point";
import { UserInfo } from "../entity/userInfo";
import { Performance } from "../entity/performance";
import { Reserve } from "../entity/reserve";
import { CustomError } from "../customClass";
import { myDataBase } from "../dbc";

export class ReserveService {
  /** 예매 정보 조회 */
  static reservationGet = async (user_id: number) => {
    /** 현재 로그인한 유저가 예매한 내역이 있는지 조회 */
    const userReserveCheck = await myDataBase
      .getRepository(Reserve)
      .find({ where: { user_id: user_id } });
    if (!userReserveCheck)
      throw new CustomError("예매하신 내역이 존재하지 않습니다.", 400);

    /** performance, userInfo, reserve 트랜잭션*/
    const transaction = await myDataBase.manager.transaction(
      async (transactionalEntityManager) => {
        let arr: any = [];
        for (let i in userReserveCheck) {
          const reserve = await transactionalEntityManager
            .getRepository(Reserve)
            .findOneBy({ user_id: user_id });
          const userInfo = await transactionalEntityManager
            .getRepository(UserInfo)
            .findOneBy({ user_info_id: user_id });
          const performance = await transactionalEntityManager
            .getRepository(Performance)
            .findOneBy({ performance_id: reserve?.performance_id });

          arr[i] = { r: reserve, u: userInfo, p: performance };
        }
        return arr;
      }
    );

    /** 트랜잭션으로 묶어놓은 데이터들중 추려내서 result에 넣음 */
    const result = transaction.map((r: any) => {
      return {
        performance_id: r.p.performance_id,
        title: r.p.title,
        director: r.u.name,
        point: Number(r.r.seat) * 30000,
        seat: r.r.seat,
        date: JSON.parse(r.p.date),
      };
    });

    return { status: 200, message: "", result };
  };

  /** 공연 예매 */
  static PerformanceReservation = async (
    user_id: number,
    reserveCount: number,
    performance_id: number
  ) => {
    if (!reserveCount || reserveCount == 0)
      throw new CustomError("좌석의 갯수를 입력해주세요.", 412);

    /** 포인트 조회 */
    const checkPoint = await myDataBase
      .getRepository(Point)
      .find({ where: { user_info_id: user_id } });

    /** 가지고 있는 포인트 계산 */
    let pointCount = 0;
    for (let p of checkPoint) {
      if (p.point_status == 0) pointCount -= Number(p.point);
      else if ((p.point_status = 1)) pointCount += Number(p.point);
    }

    /** 계산된 포인트가 결제할 포인트보다 적을 경우 */
    if (pointCount < reserveCount * 30000)
      throw new CustomError("소유하고있는 포인트보다 가격이 높습니다.", 400);

    /** 유저 정보 조회 */
    const userInfo = await myDataBase
      .getRepository(UserInfo)
      .findOneBy({ user_info_id: user_id });

    /** 공연 정보 조회 */
    const performance = await myDataBase
      .getRepository(Performance)
      .findOneBy({ performance_id: performance_id });

    if (!performance_id)
      throw new CustomError("존재하지 않는 공연입니다.", 400);

    /** 남은 자리 계산 */
    const seat = performance?.seatCount! - reserveCount;

    /** 공연 자리 업데이트 */
    await myDataBase
      .createQueryBuilder()
      .update(Performance)
      .set({ seatCount: seat })
      .where("performance_id = :performance_id", {
        performance_id: performance_id,
      })
      .execute();

    /** 예매 자리 개수 저장 */
    const r = new Reserve();
    r.performance_id = performance_id;
    r.seat = reserveCount;
    r.user_id = user_id;
    r.performance = performance!;
    r.userInfo = userInfo!;
    await myDataBase.getRepository(Reserve).insert(r);

    /** 결제한 포인트 저장 */
    const point = new Point();
    point.point = reserveCount * 30000;
    point.point_reason = `${performance?.title}공연 예매`;
    point.point_status = 0;
    point.userInfo = userInfo!;
    await myDataBase.getRepository(Point).insert(point);
    return {
      status: 200,
      message: `${performance?.title}의 공연을 ${reserveCount}개의 표를 예매하였습니다.`,
      result: true,
    };
  };
}
