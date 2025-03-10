import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { IErrorResponse } from "../types/Response";

export class Error {
  constructor() {}

  static handleError(
    err: IErrorResponse,
    req: NextApiRequest,
    res: NextApiResponse<IErrorResponse>,
    next?: NextApiHandler
  ) {
    console.error(err);
    if (typeof err === "string") {
      res.status(500).json({
        status: 500,
        error: err || "Something broke!",
        success: false,
      });
      res.end();
      return;
    }
    res.status(err.status || 500).json({
      status: err?.status,
      error: err.error || "Something broke!",
      success: err?.success,
      code: err?.code,
    });
    res.end();
    return;
  }

  static handleNoMatch(req: NextApiRequest, res: NextApiResponse) {
    res.status(404).end("Page is not found");

    return;
  }
}
