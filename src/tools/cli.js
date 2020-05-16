

'use strict'

const os = require('os')
const path = require('path')
const moment = require('moment')
const yargs = require('yargs')
const user = os.userInfo({ encoding: 'utf8' })
const getGitUser = require('./utils/getGitUser')
const gitUser = getGitUser()
const version = require('../../package.json').version

const generate = require('./tpl/generate')


yargs.command(['add <componentPath>', 'a'], 'Add a component to project', {
    type: {
        alias: 't',
        describe: 'The component type'
    },
    root: {
        alias: 'r',
        describe: 'The component type',
        default: 'src/components'
    },
    help: {
        alias: 'h'
    }
}, (args) => {
    let componentPath = args.componentPath
    const componentName = componentPath.substr(componentPath.lastIndexOf('/') + 1)
    const ComponentName = componentName[0].toLocaleUpperCase() + componentName.substr(1)
    let type = args.type
    
    if (!type) {
        type = componentPath.split('/')[0]
        if (/s$/.test(type)) {
            type = type.slice(0, -1)
        }
    }

    componentPath = path.join(__dirname, '../../' + args.root, componentPath)

    generate(type, componentPath, {
        type,
        componentPath: args.componentPath.toLowerCase().split('/').slice(1).join('-'),
        componentName,
        ComponentName,
        username: gitUser || user.username,
        version,
        curDate: moment().format('YYYY-MM-DD HH:mm:ss')
    })
    
})
.alias('version', 'v')
.help()
.argv



