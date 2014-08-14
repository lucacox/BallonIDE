/// <reference path="../Scripts/typings/mongoose/mongoose.d.ts" />

import express  = require('express');
import mongoose = require('mongoose');
import fs       = require('fs');
import os       = require('os');
 
export function api(app: express.Express, app_config: any) {
    
    app.get('/api/v1/app_config', function (req, res) {
        res.json(app_config);
    });

    app.post('/api/v1/app_config', function (req, res) {
        var params = req.body;
        for (var key in params.app_config) {
            app_config[key] = params.app_config[key];
        }

        app_config.save(function (err) {
            res.send({
                app_config: app_config,
                status: !err
            });
        });
    });

    app.get('/api/v1/file', function (req, res) {
        var params = req.query;
        fs.readFile(params.filename, { encoding: 'utf8' }, function (err, data) {
            res.json({
                file: params.filename,
                body: data,
                status: !err
            });
        });
    });

    app.post('/api/v1/file', function (req, res) {
        var params = req.body;
        fs.writeFile(params.filename, params.text.split("\\n").join(os.EOL) + os.EOL, { encoding: 'utf8' }, function (err, data) {
            res.json({
                file: params.filename,
                status: !err
            });
        });
    });

    app.post('/api/v1/rename', function (req, res) {
        var params = req.body;
        fs.exists(params.old_name, function (exists) {
            fs.rename(params.old_name, params.new_name, function (err) {
                res.json({
                    file: params.new_name,
                    status: !err
                })
    });
        });
    });

    app.get('/api/v1/dir', function (req, res) {
        var params = req.query;
        fs.readdir(params.dir, function (err, files) {
            var f = [];
            for (var i in files) {
                f.push({
                    file: files[i],
                    dir: fs.statSync(params.dir + "/" + files[i]).isDirectory()
                });
            }
            f.sort(function (a, b) {
                if (a.dir && !b.dir) {
                    return -1;
                } else if (!a.dir && b.dir) {
                    return 1;
                } else {
                    if (a.file < b.file)
                        return -1;
                    else if (a.file > b.file)
                        return 1;
                    else
                        return 0;
                }
            });
            res.json({
                status: !err,
                dir: params.dir,
                files: f
            });
        });
    });
}

