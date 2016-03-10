const fs = require('fs');

var config;

config = {
  production: {
    url: '{{.GhostURL}}',
    urlSSL: '{{.GhostSSLURL}}',
    forceAdminSSL: true,
    database: {
      client: 'mysql',
      connection: {
        host: '{{.DatabaseHost}}',
        user: 'ghost',
        password: '{{.DatabasePassword}}',
        database: 'ghost',
        charset: 'utf8',
        ssl: {
          ca: fs.readFileSync('/etc/ghost/ssl/database-ca.crt'),
        }
      }
    },
    server: {
      host: '127.0.0.1',
      port: '2368'
    },
    paths: {
      contentPath: '/var/lib/ghost'
    },
    mail: {
      transport: 'SMTP',
      options: {
        from: 'ghost@{{.MailgunDomain}}',
        host: 'smtp.mailgun.org',
        port: 2525,
        secure: true,
        auth: {
            user: '{{.MailgunUsername}}',
            pass: '{{.MailgunPassword}}'
        }
      }
    }
  }
}

module.exports = config;
