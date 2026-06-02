const ROLES = require('../constants/roles');

const users = [
  { id: 1, name: 'Alan',    password: '1234', role: ROLES.LAWYER },
  { id: 2, name: 'Dario',   password: '1234', role: ROLES.LAWYER },
  { id: 3, name: 'Karina',  password: '1234', role: ROLES.LAWYER },
  { id: 4, name: 'Sara',    password: '1234', role: ROLES.ASSISTANT },
  { id: 5, name: 'Miguel',  password: '1234', role: ROLES.ASSISTANT },
  { id: 6, name: 'Roberto', password: '1234', role: ROLES.ASSISTANT }
];

module.exports = users;