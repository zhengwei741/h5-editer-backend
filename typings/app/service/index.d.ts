// This file is created by egg-ts-helper@1.30.3
// Do not modify this file!!!!!!!!!

import 'egg';
type AnyClass = new (...args: any[]) => any;
type AnyFunc<T = any> = (...args: any[]) => T;
type CanExportFunc = AnyFunc<Promise<any>> | AnyFunc<IterableIterator<any>>;
type AutoInstanceType<T, U = T extends CanExportFunc ? T : T extends AnyFunc ? ReturnType<T> : T> = U extends AnyClass ? InstanceType<U> : U;
import ExportNews from '../../../app/service/news';
import ExportTest from '../../../app/service/Test';
import ExportUser from '../../../app/service/User';
import ExportUtils from '../../../app/service/Utils';
import ExportWork from '../../../app/service/Work';

declare module 'egg' {
  interface IService {
    news: AutoInstanceType<typeof ExportNews>;
    test: AutoInstanceType<typeof ExportTest>;
    user: AutoInstanceType<typeof ExportUser>;
    utils: AutoInstanceType<typeof ExportUtils>;
    work: AutoInstanceType<typeof ExportWork>;
  }
}
