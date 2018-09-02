import * as express from 'express';
export class ControllerBase {
  public run(
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) {
    this[request.method.toLowerCase()](request, response, next);
  }
}
