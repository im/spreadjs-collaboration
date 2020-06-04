var fs = require('fs');
var electron = require('electron');

var dialog = electron.remote.dialog;

var app = app || {};
app.isNative = true;

app.showOpenFileDialog = function (filters, callback) {
    var options = {
        filters: filters,
        title: 'Select File',       //optional
        properties: ['openFile']
    };

    return dialog.showOpenDialog(options, function (files) {
        if (files && files.length > 0) {
            var fileName = files[0];

            fs.readFile(fileName, function (err, data) {
                callback(err, data);
                /*
                if (err) {
                    callback(err);
                } else {
                    callback(null, 'data:image/jpeg;base64,' + new Buffer(data).toString('base64'));
                }
                */
            });
        } else {
            callback(null);
        }
    });
};

app.showSaveFileDialog = function () {
    var options = {
        filters: [
            { name: 'Images', extensions: ['jpg', 'png', 'gif'] }
        ]
    };

    return dialog.showSaveDialog(options);
};

app.config = function (name, value) {
    if (!app._config) {
        var fileName = 'config.json';
        if (fs.existsSync(fileName)) {
            app._config = JSON.parse(fs.readFileSync(fileName));
            console.log('load config', JSON.stringify(app._config));
        } else {
            console.log(fileName, ' not found');
            return {};
        }
    }

    // TODO, read / write depends on if value is provided
    //console.log('read config', name, app._config[name]);
    if (value != null) {
        app._config[name] = value;
    } else {
        return app._config[name];
    }
};

// Test Use
console.log('test read config', app.config('recentFiles'));
