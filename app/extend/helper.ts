const moment = require('moment');
exports.relativeTime = (time) => {
  return moment(time).format("YYYY-MM-DD HH:mm:ss")
};

exports.relativeTime2 = () => '33333';