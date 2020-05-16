
const fs = require('fs-extra')
const path = require('path')
const colors = require('colors')
const comfirm = require('../utils/comfirm')


const compile = (tplFile, data) => {
    const content = fs.readFileSync(tplFile, 'utf-8')

    return content.replace(/\${(\w+)}/gi, (match, name)=> {
        return data[name] ? data[name] : ''
    })
}

const writeFiles = (componentType, distPath, data) => {

    const tplPath = path.join(__dirname, './component')
    console.log('tplPath: ', tplPath);

    fs.readdir(tplPath, 'utf-8', (err, files) => {
        if (err) {
            console.log(colors.red(err))
            return false
        }
        files.forEach(filename => {
            const content = compile(path.join(tplPath, filename), data)
            let distFileName = data.componentName + '.' + filename.split('.')[1]

            if (filename.indexOf('index') >= 0) {
                distFileName = 'index.ts'
            }

            const filePath = path.join(distPath, distFileName)

            console.log(colors.green('write file ...'))
            console.log(colors.underline(filePath))

            fs.writeFileSync(filePath, content, 'utf-8')
        })
    })

}

module.exports = (componentType, distPath, data) => {

    if (fs.existsSync(distPath)) {
        comfirm(`The component ${componentType} - ${data.componentType} is exist. Do your want to override it ? `, (flag) => {
            if (flag) {
                writeFiles(componentType, distPath, data)
            }
        })
    } else {
        fs.mkdirpSync(distPath)
        writeFiles(componentType, distPath, data)
    }
}