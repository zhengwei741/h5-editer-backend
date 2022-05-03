import { AbilityBuilder, Ability } from "@casl/ability";
import { UserProps } from '../model/user'
import { Document } from 'mongoose'

export const defineAbilitiesForUser = function (user: UserProps & Document) {
  const { can, rules } = new AbilityBuilder(Ability);

  if (user.role === 'admin') {
    can('manage', 'all')
  } else if (user.role === 'normal') {
    // user
    can("read", "User", { _id: user._id })
    can("update", "User", ['nickName', 'picture'], { _id: user._id })
    // Work
    can("create", "Work", ['title', 'desc', 'coverImg', 'content'])
    can("read", "Work", { user: user._id })
    can("update", "Work", ['title', 'desc', 'coverImg', 'content'], { user: user._id })
    can("delete", "Work", { user: user._id })
    // channel
    can('create', 'Channel', ['name', 'workId'], { user: user._id })
    can('read', 'Channel', { user: user._id })
    can('update', 'Channel', ['name'], { user: user._id })
    can('delete', 'Channel', { user: user._id })
  }
  return new Ability(rules)
}
