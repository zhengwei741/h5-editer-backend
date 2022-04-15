// This file is created by egg-ts-helper@1.30.2
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportHome from '../../../app/controller/home';
import ExportNews from '../../../app/controller/news';
import ExportUser from '../../../app/controller/user';
import ExportUtils from '../../../app/controller/utils';
import ExportWork from '../../../app/controller/work';

declare module 'egg' {
  interface IController {
    home: ExportHome;
    news: ExportNews;
    user: ExportUser;
    utils: ExportUtils;
    work: ExportWork;
  }
}
