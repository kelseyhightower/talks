var config;

config = {
  test: {
    url: 'http://localhost:2368',
    database: {
      client: 'sqlite3',
      connection: {
        filename: '/var/lib/ghost/data/ghost.db'
      }
    },
    server: {
      host: '127.0.0.1',
      port: '2368'
    },
    paths: {
      contentPath: '/var/lib/ghost'
    },
  }
}

module.exports = config;
