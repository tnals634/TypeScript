import { User } from "../entity/user";
import { Performance } from "../entity/performance";
import { myDataBase } from "../dbc";
import { UserInfo } from "../entity/userInfo";
import { userInfo } from "os";

export class PerformanceService {
  static performanceCreate = async (
    user_id: number,
    title: string,
    content: string,
    price: number
  ) => {
    const user = await myDataBase
      .getRepository(User)
      .findOneBy({ user_id: user_id });
    if (user?.group != 1) throw new Error("사장이 아니면 사용할 수 없습니다.");
    else if (!title || !content || !price)
      throw new Error("값을 입력해주세요.");

    const findPerformance = await myDataBase
      .getRepository(Performance)
      .findOneBy({ title: title });
    if (findPerformance)
      throw new Error(`[${findPerformance.title}] 의 제목이 이미 존재합니다.`);
    const performance = new Performance();
    performance.title = title;
    performance.content = content;
    performance.price = price;
    performance.user = user;

    await myDataBase.getRepository(Performance).insert(performance);
    return {
      status: 201,
      message: `[${title}]공연을 등록했습니다.`,
      result: true,
    };
  };

  static performanceGet = async () => {
    const performances = await myDataBase.manager.transaction(
      async (transactionalEntityManager) => {
        const performance = await myDataBase.getRepository(Performance).find();
        let allInfos: any = [];
        for (let i in performance) {
          const userInfo = await transactionalEntityManager
            .getRepository(UserInfo)
            .findOneBy({ user: performance[i].user });

          const performanceInfo = await transactionalEntityManager
            .getRepository(Performance)
            .findOneBy({ title: performance[i].title });

          allInfos[i] = { userInfo: userInfo, performance: performanceInfo };
        }
        return allInfos;
      }
    );
    performances.sort((a: any, b: any) => {
      return b.performance.createdAt - a.performance.createdAt;
    });
    const result = performances.map((p: any) => {
      return {
        performanceId: p.performance.performance_id,
        userId: p.userInfo.user_info_id,
        director: p.userInfo.name,
        title: p.performance.title,
        price: p.performance.price,
        createdAt: p.performance.createdAt,
      };
    });
    return { status: 200, message: "", performances: result };
  };

  static performanceDetailGet = async (performance_id: number) => {
    const pe = await myDataBase
      .getRepository(Performance)
      .findOneBy({ performance_id: performance_id });
    if (!pe) throw new Error("공연이 존재하지 않습니다.");

    const performance = await myDataBase.manager.transaction(
      async (transactionalEntityManager) => {
        const p = await transactionalEntityManager
          .getRepository(Performance)
          .findOneBy({ performance_id: performance_id });
        const user = await transactionalEntityManager
          .getRepository(UserInfo)
          .findOne({ where: { user: p?.user } });
        return { p, user };
      }
    );
    const result = {
      performanceId: performance.p?.performance_id,
      userId: performance.user?.user_info_id,
      director: performance.user?.name,
      title: performance.p?.title,
      content: performance.p?.content,
      price: performance.p?.price,
      createdAt: performance.p?.createdAt,
    };
    return { status: 200, message: "", result: result };
  };

  static performanceSearchGet = async (search: string, category: number) => {
    const performances = await myDataBase.getRepository(Performance).find();
    let result: any;

    if (category == 0) {
      result = performances.map((p) => {
        if (p.title.search(search) > -1) return p;
      });
      console.log(result);
    } else if (category == 1) {
      console.log("result");
      result = performances.map((p) => {
        if (p.content.search(search) > -1) return p;
      });
      console.log(result);
    }
    return { status: 200, message: "", performance: result };
  };
}
