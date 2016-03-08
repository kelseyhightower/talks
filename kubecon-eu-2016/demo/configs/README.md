# Ghost Configuration Guide

This guide will walk you through creating a `config.js`
configuration file.

## Prerequisites

* [Mailgun account](https://www.mailgun.com)
* [mySQL instance]()

## Configuring Ghost

Use the [Ghost configuration guide](http://support.ghost.org/config)
as a reference and substitute the following items:

```
GhostURL
DatabaseHost
DatabasePassword
MailgunDomain
MailgunUsername
MailgunPassword
```

### Example Config

```
const fs = require('fs');

var config;

config = {
  production: {
    url: 'http://ghost.example.com',
    forceAdminSSL: true,
    database: {
      client: 'mysql',
      connection: {
        host: '203.0.113.100',
        user: 'ghost',
        password: 'XXXXXXXX',
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
        from: 'ghost@example.com',
        host: 'smtp.mailgun.org',
        port: 2525,
        secure: true,
        auth: {
            user: 'postmaster@mg.example.com',
            pass: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
        }
      }
    }
  }
}

module.exports = config;
```
