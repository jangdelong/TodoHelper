/*
* Modules 模块
* 主要提供数据库的基本操作：
*       增、删、查、改
*
**/
var util = require('util');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var dburl = require("../config").db; //数据库地址

exports.connect = function(callback) {
    mongoose.connect(dburl);
};

exports.disconnect = function(callback) {
    mongoose.disconnect(callback);
};

exports.setup = function(callback) { callback(null); }

//定义todoHelper对象模型
var TodoScheme = new Schema({
    title: String,
    content: String,
    finished: {
        type: Boolean,
        default: false
    },

    post_date: {
        type: Date,
        default: Date.now   //Date.now静态方法，返回当前时间
    }
});

//访问todo对象模型
var Todo = mongoose.model('Todo', TodoScheme);

//添加操作
exports.add = function(obj, callback) {
    var newTodo = new Todo();

    newTodo.title = obj.title;
    newTodo.content = obj.content;
    newTodo.post_date = obj.post_date;

    //保存数据`newTodo.save()`
    newTodo.save(function(err) {
        if (err) {
            util.log('FATAL ' + err);
            callback(err);
        } else {
            callback(null);
        }
    });
};

//删除操作
exports.delete = function(id, callback) {
    exports.findTodoById(id, function(err, doc) {
        if (err) {
            callback(err);
        } else {
            util.log(util.inspect(doc));
            doc.remove();
            callback(null);
        }
    });
};

//修改操作
exports.edit = function(id, obj, callback) {
    exports.findTodoById(id, function(err, doc) {
        if (err) {
            callback(err);
        } else {
            doc.title = obj.title;
            doc.content = obj.content;
            doc.post_date = obj.post_date;

            doc.save(function(err) {
                if (err) {
                    util.log('FATAL ' + err);
                    callback(err);
                } else {
                    callback(null);
                }
            });
        }
    });
};

//修改操作_数据库完成度
exports.editFinished = function(id, finished, callback) {
    exports.findTodoById(id, function(err, doc) {
        if (err) {
            callback(err);
        } else {
            doc.finished = finished;
            doc.post_date = new Date();
            doc.save(function(err) {
                if (err) {
                    util.log('FATAL' + err);
                    callback(err);
                } else {
                    callback(null);
                }

            });
        }
    });
};

//查找所有
exports.allTodos = function(callback) {
    Todo.find({}, callback);
};

//查找操作
var findTodoById = exports.findTodoById = function(id, callback) {
    Todo.findOne({_id: id}, function(err, doc) {
        if (err) {
            util.log('FATAL' + err);
            callback(err, null);
        } else {
            callback(null, doc);
        }
    });

};
