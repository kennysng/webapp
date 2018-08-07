#!/usr/bin/env node

const assert = require('assert')
const chalk = require('chalk')
const openBrowser = require('react-dev-utils/openBrowser')

const WebApp = require('..')
const { argv, checkBrowsers, env } = WebApp.utils

if (argv.env) env(argv.env)

assert(argv._[1], `please specify a webpack config file`)
const webpackConfig = require(argv._[1])

let webApp
switch (argv._[0]) {
  case 'build':
    process.env.NODE_ENV = 'production'
    webApp = new WebApp(argv)
    webApp.build(webpackConfig)
    break
  case 'start':
    process.env.NODE_ENV = 'development'
    webApp = new WebApp(argv)
    webApp.start(webpackConfig)

    webApp.once('post-start', function () {
      console.log(chalk.green('You can type \'rs\' to restart the development server\n'))

      if (argv.open) {
        checkBrowsers(process.cwd())
          .then(() => openBrowser(`http://${webApp.options.devServer.host}:${webApp.options.port}`))
      }
    })
    process.openStdin().addListener('data', msg => {
      if (String(msg).trim() === 'rs') {
        webApp.restart()
      }
    })
    break
  case undefined:
    console.error(chalk.red(`please specify a command`))
    console.log(chalk.green(`usage: webapp {build|start} /path/to/webpack.config.js [options]`))
    break
  default:
    console.error(chalk.red(`unknown command '${argv._[0]}'`))
    console.log(chalk.green(`usage: webapp {build|start} /path/to/webpack.config.js [options]`))
    break
}
