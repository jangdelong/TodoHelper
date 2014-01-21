var express = require('express'),
    ejs = require('ejs'),
    todoHelper = require('./controllers/todoHelper'),
    http = require('http'),
    config = require("./config"),
    todoHelperDao = require("./dao/todoHelperDao");

var app = express();

//用EJS模板引擎来处理 `.html` 后缀的文件
app.engine('.html', ejs.__express);
//app.engine('html', ejs.renderFile);
//`旧版本方法`：app.register('.html', ejs)

app.configure(function() {
    app.set('views', __dirname + '/views');
    app.set('port', config.port);
    //app.set('view engine', 'ejs');
    app.set('view engine', 'html');

    //新版本`express3.*`不支持`layout`
    app.set("view options", {layout: false});
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public')); //样式、脚本文件路径
});


app.configure('development', function() {
    app.use(express.errorHandler());
});

//用GET方法获取`主页`界面
app.get('/', todoHelper.index);
app.get('/error', todoHelper.error);

//用GET方法获取`添加事项`界面
app.get('/new', todoHelper.new_load);
app.post('/new', todoHelper.new_post);

app.get('/:id/delete', todoHelper.delete);
app.get('/:id/finish', todoHelper.finish);

//修改
app.post('/:id/modify', todoHelper.modify);


todoHelperDao.connect(function(error) {
    //if (error) throw error;
    if (error) {
        todoHelper.err = error;
        app.get('/error', todoHelper.error);
    }
});
app.on('close', function(error) {
    //if (error) throw error;
    if (error) {
        todoHelper.err = error;
        app.get('/error', todoHelper.error);
    }
    todoHelperDao.disconnect(function(err) {
        //if (err) throw err;
        if (err) {
            todoHelper.err = err;
            app.get('/error', todoHelper.error);
        }
    });
});

http.createServer(app).listen(app.get('port'), function() {
    console.log("Express server listening on port " + app.get('port'));
});
