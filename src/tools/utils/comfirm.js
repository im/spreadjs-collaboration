

const colors = require('colors')
const prompt = require('prompt')


module.exports = (msg, callback) => {

    prompt.start()

    prompt.get({
        properties: {
            confirm: {
                description: colors.red(msg),
                message: 'Type yes/no',
                pattern: /^(yes|no|y|n)$/gi,
                required: true,
                default: 'yes'
            }
        }
    }, (err, result) => {

        if (err) {
            console.log(err)
            return callback(err)
        }

        const c = result.confirm.toLowerCase()

        if (c !== 'y' && c !== 'yes') {
            return callback(false)
        }

        callback(true)

    })
}