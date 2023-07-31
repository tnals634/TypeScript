import { User } from "../entity/user";
import { Performance } from "../entity/performance";
import { myDataBase } from "../dbc";
import { UserInfo } from "../entity/userInfo";
import { CustomError } from "../customClass";

export class PerformanceService {
  static performanceCreate = async (
    user_id: number,
    title: string,
    content: string,
    date: string,
    place: string,
    seatCount: number,
    image: string,
    category: string
  ) => {
    const user = await myDataBase
      .getRepository(User)
      .findOneBy({ user_id: user_id });
    if (user?.group != 1)
      throw new CustomError("사장이 아니면 사용할 수 없습니다.", 403);
    else if (!title || !content || !date || !place || !seatCount || !category)
      throw new CustomError("정보를 입력해주세요.", 400);

    const findPerformance = await myDataBase
      .getRepository(Performance)
      .findOneBy({ title: title });
    if (findPerformance)
      throw new CustomError(
        `[${findPerformance.title}] 의 제목이 이미 존재합니다.`,
        412
      );
    const performance = new Performance();
    performance.title = title;
    performance.content = content;
    performance.date = date;
    performance.place = place;
    performance.seatCount = seatCount;
    performance.category = category;
    performance.image = image ? image : "../../img/cat.jpg";
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
        image: p.performance.image,
        category: p.performance.category,
        director: p.userInfo.name,
        title: p.performance.title,
        place: p.performance.place,
        price: 30000,
        date: JSON.parse(p.performance.date),
      };
    });
    return { status: 200, message: "", performances: result };
  };

  static performanceTitleGet = async () => {
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
      return a.performance.title - b.performance.title;
    });
    const result = performances.map((p: any) => {
      return {
        performanceId: p.performance.performance_id,
        userId: p.userInfo.user_info_id,
        image: p.performance.image,
        category: p.performance.category,
        director: p.userInfo.name,
        title: p.performance.title,
        place: p.performance.place,
        price: 30000,
        date: JSON.parse(p.performance.date),
      };
    });
    return { status: 200, message: "", performances: result };
  };

  static performanceDetailGet = async (performance_id: number) => {
    const pe = await myDataBase
      .getRepository(Performance)
      .findOneBy({ performance_id: performance_id });
    if (!pe) throw new CustomError("공연이 존재하지 않습니다.", 400);

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
    let check = false;
    if (performance.p?.seatCount! > 0) check = true;
    const result = {
      performanceId: performance.p?.performance_id,
      userId: performance.user?.user_info_id,
      image: performance.p?.image,
      category: performance.p?.category,
      director: performance.user?.name,
      title: performance.p?.title,
      content: performance.p?.content,
      seat: performance.p?.seatCount,
      reservationAvailability: check,
      price: 30000,
      date: JSON.parse(performance.p?.date!),
    };
    return { status: 200, message: "", result: result };
  };

  static performanceSearchGet = async (search: string, searchType: number) => {
    const performances = await myDataBase.getRepository(Performance).find();
    let result: any;

    if (searchType == 0) {
      result = performances.map((p) => {
        if (p.title.search(search) > -1) return p;
      });
    } else if (searchType == 1) {
      console.log("result");
      result = performances.map((p) => {
        if (p.content.search(search) > -1) return p;
      });
      console.log(result);
    } else if (searchType == 2) {
      result = performances.map((p) => {
        if (p.category.search(search) > -1) return p;
      });
    } else {
      throw new CustomError("해당번호의 searchType이 존재하지 않습니다.", 400);
    }

    const performanceSearch = await myDataBase.manager.transaction(
      async (transactionalEntityManager) => {
        let allInfos: any = [];
        for (let i in result) {
          const userInfo = await transactionalEntityManager
            .getRepository(UserInfo)
            .findOneBy({ user: result[i].user });

          const performanceInfo = await transactionalEntityManager
            .getRepository(Performance)
            .findOneBy({ title: result[i].title });

          allInfos[i] = { userInfo: userInfo, performance: performanceInfo };
        }
        return allInfos;
      }
    );

    const payload = performanceSearch.map((p: any) => {
      return {
        performanceId: p.performance.performance_id,
        userId: p.userInfo.user_info_id,
        image: p.performance.image,
        category: p.performance.category,
        director: p.userInfo.name,
        title: p.performance.title,
        place: p.performance.place,
        price: 30000,
        date: JSON.parse(p.performance.date),
      };
    });
    return { status: 200, message: "", performance: payload };
  };
}
