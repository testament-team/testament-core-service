import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { mustExist } from '../util/middleware.util';

@Injectable()
export class SecurityMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: Function) {
    mustExist(req.header("x-user-id"), "Header 'x-user-id' must be set");
    next();
  }
}
