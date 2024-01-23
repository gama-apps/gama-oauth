const { rule, shield } = require('graphql-shield');

const isAuthenticated = rule()(async (parent, args, context) => {
  return context.user !== undefined; // Modifica según tu lógica de autenticación
});

module.exports = shield({
  Query: {
    user: isAuthenticated,
  },
  Mutation: {
    login: isAuthenticated,
    updateUser: isAuthenticated,
    logout: isAuthenticated,
  },
});
  