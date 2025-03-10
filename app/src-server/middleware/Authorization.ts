import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

const authRegex = /^Bearer /i;

export class Authorization {
  constructor() {}

  static check(
    req: NextApiRequest,
    res: NextApiResponse,
    next?: NextApiHandler
  ) {
    try {
      const token = req.headers.authorization;
      if (token && token.replace(authRegex, "")) {
        return next && next(req, res);
      }
      throw "Authorization 토큰 정보가 없습니다.";
    } catch (e) {
      throw e as string;
    }
  }

  static checkToken(token?: string) {
    try {
      if (token && token.replace(authRegex, "")) {
        return token;
      }
      throw "Authorization 토큰 정보가 없습니다.";
    } catch (e) {
      return e as string;
    }
  }
}
