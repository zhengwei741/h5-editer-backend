import { AbilityBuilder, Ability } from "@casl/ability";
import { permittedFieldsOf } from '@casl/ability/extra';

import { pick } from 'lodash'

class Work {
  constructor(attr) {
    Object.assign(this, attr);
  }
}

const all = ['title', 'uuid', 'authorId', 'published'];
const options = { fieldsFrom: rule => rule.fields || all };

interface User {
  role: 'admin' | 'vip' | 'normal'
}

const work1 = new Work({
  title: 'title',
  uuid: 'uuid',
  published: 'published'
});

const adminUser: User = { role: 'admin' }
const vipUser: User = { role: 'vip' }
const normalUser: User = { role: 'normal' }

const defineAbilitiesFor = function (user) {
  const { can, rules } = new AbilityBuilder(Ability);

  if (user.role === 'admin') {
    can('manage', 'all')
  } else if (user.role === 'vip') {
    can("download", "Work");
    can("read", "Work");
    can("update", "Work", ['uuid', 'title']);
    can("delete", "Work");
  } else if (user.role === 'normal') {
    can("read", "Work");
    can("update", "Work", ['title']);
    can("delete", "Work");
  }
  return new Ability(rules);
};

const adminAbility = defineAbilitiesFor(adminUser);
console.log(adminAbility.can("read", work1));
console.log(adminAbility.can("download", work1));

console.log('----------vipAbility------------')
const vipAbility = defineAbilitiesFor(vipUser);
const canUpdate = permittedFieldsOf(vipAbility, 'update', work1, options)
console.log(vipAbility.can("download", work1));
console.log(vipAbility.can("read", work1));
console.log(vipAbility.can("update", work1, 'uuid'));

console.log(pick(work1, canUpdate), 'pick(work1, canUpdate)')

console.log('----------normalUserAbility------')
const normalUserAbility = defineAbilitiesFor(normalUser);
console.log(normalUserAbility.can("download", work1));
console.log(normalUserAbility.can("read", work1));
console.log(normalUserAbility.can("update", work1, 'uuid'));
