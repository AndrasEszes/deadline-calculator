const transformer = require('@nestjs/graphql/plugin');

module.exports.version = 1;
module.exports.name = 'nestjs-graphql-transformer';

module.exports.factory = (cs) => {
  return transformer.before({}, cs.program);
};
