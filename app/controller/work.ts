import { Controller } from 'egg';
import inputValidate from '../decorator/inputValidate';
import checkPermission from '../decorator/checkPermission';

const workCreateRules = {
  title: 'string',
};

const channelRules = {
  name: 'string',
  workId: 'number',
};

export default class WorkController extends Controller {
  @inputValidate(workCreateRules, 'workValidateFail')
  @checkPermission('Work')
  public async createWork() {
    const { ctx } = this;
    try {
      await ctx.service.work.createEmptyWork(ctx.request.body);
      ctx.helper.success({ ctx, message: '创建成功' });
    } catch (e) {
      ctx.helper.error({ ctx, errorType: 'workValidateFail', error: e });
    }
  }
  @checkPermission('Work')
  public async copyWork() {
    const { ctx } = this;
    const { id } = ctx.request.body;
    try {
      const res = await ctx.service.work.copyWork(parseInt(id));
      ctx.helper.success({ ctx, message: '操作成功', res });
    } catch (e) {
      ctx.helper.error({ ctx, errorType: 'universalError', error: e });
    }
  }
  @checkPermission('Work')
  public async findWorkById() {
    const { ctx } = this;
    const { id } = ctx.params;
    const res = await this.ctx.model.Work.findOne({ id }).lean();
    ctx.helper.success({ ctx, res });
  }
  @checkPermission('Work')
  public async deleteWork() {
    const { ctx } = this;
    const { id } = ctx.params;

    try {
      await ctx.model.Work.deleteOne({ id });
      ctx.helper.success({ ctx, message: '操作成功' });
    } catch (e) {
      ctx.helper.error({ ctx, errorType: 'universalError', error: e });
    }
  }

  public async publish(isTemplate) {
    const { ctx } = this;
    const { id } = ctx.request.body;
    try {
      await ctx.model.Work.findOneAndUpdate({ id }, { isTemplate });
      ctx.helper.success({ ctx, message: '操作成功' });
    } catch (e) {
      ctx.helper.error({ ctx, errorType: 'universalError', error: e });
    }
  }
  @checkPermission('Work')
  public async publishWork() {
    this.publish(true);
  }
  @checkPermission('Work')
  public async publishTemplate() {
    this.publish(false);
  }
  @checkPermission('Work')
  public async myList() {
    const { ctx } = this;
    const userId = ctx.state.user._id;
    const { pageSize, pageNumber } = ctx.query;
    const findCondition = {
      user: userId,
    };
    const condition: IndexCondition = {
      populate: {
        path: 'user',
        select: 'username nickname picture',
      },
      select: 'id author copiedCount coverImg desc title user isHot createdAt',
      find: findCondition,
      ...(pageNumber && { pageNumber: parseInt(pageNumber) }),
      ...(pageSize && { pageSize: parseInt(pageSize) }),
    };
    const mylist = await ctx.service.work.getList(condition);
    ctx.helper.success({ ctx, res: mylist });
  }

  public async templateList() {
    const { ctx } = this;
    const { pageSize, pageNumber } = ctx.query;
    const findCondition = { isPublic: true, isTemplate: true };
    const condition: IndexCondition = {
      populate: {
        path: 'user',
        select: 'username nickname picture',
      },
      select: 'id author copiedCount coverImg desc title user isHot createdAt',
      find: findCondition,
      ...(pageNumber && { pageNumber: parseInt(pageNumber) }),
      ...(pageSize && { pageSize: parseInt(pageSize) }),
    };
    const templateList = await ctx.service.work.getList(condition);
    ctx.helper.success({ ctx, res: templateList });
  }

  public async getChannels() {
    const { ctx } = this;
    const { workId } = ctx.query;
    const channels = await ctx.service.work.getChannels(Number(workId));
    ctx.helper.success({ ctx, res: channels });
  }
  @inputValidate(channelRules, 'channelValidateFail')
  @checkPermission({ mongoose: 'Work', casl: 'Channel' }, 'noPermission', { key: 'channels.id', value: { type: 'body', valueKey: 'workId' } })
  public async createChannel() {
    const { ctx } = this;
    const { name, workId } = ctx.request.body;
    const channels = await ctx.service.work.createChannel(name, workId);
    if (channels) {
      ctx.helper.success({ ctx, res: channels });
    } else {
      ctx.helper.error({ ctx, errorType: 'createChannelFail' });
    }
  }
  @checkPermission({ mongoose: 'Work', casl: 'Channel' }, 'noPermission', { key: 'channels.id', value: { type: 'params', valueKey: 'id' } })
  public async updateChannel() {
    const { ctx } = this;
    const { id } = ctx.params;
    const { name } = ctx.request.body;
    const channel = await ctx.service.work.updateChannel(id, name);
    if (channel) {
      ctx.helper.success({ ctx, message: '操作成功' });
    } else {
      ctx.helper.error({ ctx, errorType: 'universalError' });
    }
  }
  @checkPermission({ mongoose: 'Work', casl: 'Channel' }, 'noPermission', { key: 'channels.id', value: { type: 'params', valueKey: 'id' } })
  public async delChannel() {
    const { ctx } = this;
    const { id } = ctx.params;
    const res = await ctx.service.work.delChannel(id);
    if (res) {
      ctx.helper.success({ ctx, message: '操作成功' });
    } else {
      ctx.helper.error({ ctx, errorType: 'universalError' });
    }
  }
}

export interface IndexCondition {
  pageSize?: number
  pageNumber?: number
  select?: string | string[]
  populate?: { path?: string, select?: string } | string
  customSort?: Record<string, any>
  find: Record<string, any>
}
