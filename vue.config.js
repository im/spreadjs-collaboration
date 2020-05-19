const path = require("path");
const resolve = (dir) => {
    return path.join(__dirname, dir);
}
module.exports = {
    lintOnSave: process.env.NODE_ENV !== 'production',
    devServer: {
        overlay: {
            warnings: true,
            errors: true
        }
    },
    chainWebpack: config => {
        config.resolve.alias
            .set("@", resolve("src"))
            .set("assets", resolve("src/assets"))
            .set("base", resolve("src/style/base"))
            .set("style", resolve("src/style"))
            .set("components", resolve("src/components"))
            .set("collaboration", resolve("src/collaboration"))
            .set("public", resolve("public"));
    }
}