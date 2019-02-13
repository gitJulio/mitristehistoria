//***********************//
// Puerto
//**********************//

process.env.PORT = process.env.PORT || 5000;

const config = {
  db: {
    host: '35.239.128.238',
    port: "5432",
    database: 'mitristehistoria',
    user: 't1end1n',
    password: 'Pegaz02019..'
  }
};

module.exports = config;
