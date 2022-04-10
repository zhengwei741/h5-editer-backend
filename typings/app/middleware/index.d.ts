// This file is created by egg-ts-helper@1.30.2
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportCustomizeError from '../../../app/middleware/customizeError';
import ExportNotfoundHandler from '../../../app/middleware/notfound_handler';

declare module 'egg' {
  interface IMiddleware {
    customizeError: typeof ExportCustomizeError;
    notfoundHandler: typeof ExportNotfoundHandler;
  }
}
