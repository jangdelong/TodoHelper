"use strict";
/*
* Controller 模块
**/
var config = require('../config');
var db = require('../dao/todoHelperDao');

exports.err = null;

exports.index = function(req, res, next) {
    db.allTodos(function(err, todos) {
        if (err) {
            return next(err);
        }
        var todos_unfinished = [],
            todos_finished = [];
        for (var i = 0; i < todos.length; i++) {
            if (todos[i].finished == false) {
                todos_unfinished.push(todos[i]);
            } else {
                todos_finished.push(todos[i]);
            }
        }
        res.render('index.html', {
            title: config.app_name,
            copyright: config.app_desc,

            todos_unfinished: todos_unfinished,
            todos_finished: todos_finished
        });
    });
};

//error page
exports.error = function(req, res, next) {
    console.log(exports.err);

    res.render('error.html', {
        title: config.app_name,
        copyright: config.app_desc,
        message: exports.err
    });
};

//添加事项
exports.new_load = function(req, res, next) {
    res.render('new.html', {
        title: config.app_name,
        copyright: config.app_desc
    });
};
exports.new_post = function(req, res, next) {
    var _title = req.body.title,
        _content = req.body.content,
        _post_date = req.body.post_date;

    //console.log('请求的参数: ');
    //console.log(req.body.title);

    _title = _title.trim();
    _content = _content.trim();
    _post_date = _post_date.trim();

    if (!_title) {
        return res.render('error.html', {message: '事项标题插入失败'});
    }
    if (!_content) {
        return res.render('error.html', {message: '事项说明插入失败'});
    }
    var obj_todo = {
        title: _title,
        content: _content
    };
    if (_post_date) {
        //_post_date = _post_date.split('-').join('/');
        //console.log('时间格式：' + _post_date);
        obj_todo.post_date = new Date(_post_date + ' 00:00:00');
    }

    db.add(obj_todo, function(err, row) {
        if (err) {
            next(err);
        }
        res.send({'status': 1});
    });
};

//删除事项
exports.delete = function(req, res, next) {
    var id = req.params.id;

    db.delete(id, function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
};

//完成事项
exports.finish = function(req, res, next) {
    var id = req.params.id;
    var finished = req.query.status === 'yes' ? true : false;

    db.editFinished(id, finished, function(err, result) {
        if (err) {
            next(err);
        }

        res.redirect('/');
    });
};

//修改事项
exports.modify = function(req, res, next) {
    var id = req.params.id;
    var obj = {};
    obj.title = req.body.title;
    obj.content = req.body.content;
    obj.post_date = req.body.post_date;

    obj.title = obj.title.trim();
    obj.content = obj.content.trim();
    obj.post_date = obj.post_date.trim();

    if (obj.title && obj.content) {
        obj.post_date = new Date(obj.post_date + ' 00:00:00');
        db.edit(id, obj, function(err, result) {
            if (err) {
                next(err);
            }
            res.send({'status': 1});
        });
    }
};
