/************************************************
* author: Jelon Cheung
* date: 2013-12-30
* description: application.js 面向对象
*              app前台js脚本
*
*************************************************/

function TodoHelper() {

    //事项_id，用于数据修改
	this._id = '';
    //jQuery对象，插件调用
    this._$ = jQuery || $;
} 

TodoHelper.prototype.init = function() {
	var _this = this;

    _this.initDateFormat(_this._$);
	_this.btnSave('#fat-btn, #btnAdd');
	_this.datePicker('.datepicker');
	_this.addForm();
    _this.niceScroll('html');
	_this.collapse();
    //_this.backStretch();
	_this.newPost('#btnAdd');
    _this.checkTodo(_this);
    _this.editTodo('#fat-btn', _this);
    _this.toolTip();

};

/*
* 保存按钮
*/
TodoHelper.prototype.btnSave = function(str) {
	if (!str) {
		str = '#fat-btn';
	}
	$(str).click(function() {
		var $btn = $(this);
		$btn.button('loading');
		setTimeout(function() {
			$btn.button('reset');
		}, 1000);

	});
};

/*
* 日期控件
*/
TodoHelper.prototype.datePicker = function(str) {
	if (!str) {
		str = '.datepicker';
	}
	var options = {
		dateFormat: 'yy-mm-dd',
		monthNames: ["\u4e00\u6708","\u4e8c\u6708","\u4e09\u6708","\u56db\u6708","\u4e94\u6708","\u516d\u6708","\u4e03\u6708","\u516b\u6708","\u4e5d\u6708","\u5341\u6708","\u5341\u4e00\u6708","\u5341\u4e8c\u6708"],
		monthNamesShort: ["\u4e00","\u4e8c","\u4e09","\u56db","\u4e94","\u516d","\u4e03","\u516b","\u4e5d","\u5341","\u5341\u4e00","\u5341\u4e8c"],

		dayNames: ["\u661f\u671f\u65e5","\u661f\u671f\u4e00","\u661f\u671f\u4e8c","\u661f\u671f\u4e09","\u661f\u671f\u56db","\u661f\u671f\u4e94","\u661f\u671f\u516d"],
		dayNamesShort: ["\u5468\u65e5","\u5468\u4e00","\u5468\u4e8c","\u5468\u4e09","\u5468\u56db","\u5468\u4e94","\u5468\u516d"],
		dayNamesMin: ["\u65e5","\u4e00","\u4e8c","\u4e09","\u56db","\u4e94","\u516d"],

		showMonthAfterYear: true,
		yearSuffix: '\u5e74'
	};
	if ($(str)) {
		$(str).datepicker(options);
	}
	
};

/*
* 添加事项表单
*/
TodoHelper.prototype.addForm = function() {
	var $btnAdd = $('#btnAdd'),
		$btnCancel = $('#btnCancel');

	$btnCancel.click(function() {
		$('#txtTitle, #txtContent, #txtTime').val('');
	});
	$btnAdd.click(function() {

		var $txtTitle = $('#txtTitle'),
			$txtContent = $('#txtContent'),
			//$txtTime = $('#txtTime'),

			txtTitle = $txtTitle.val(),
			txtContent = $txtContent.val();
			//txtTime = $txtTime.val();
		
		if (txtTitle === '') {
			$txtTitle.parent('.form-group').addClass('has-warning');
		} else {
			$txtTitle.parent('.form-group').removeClass('has-warning');
		}

		if (txtContent === '') {
			$txtContent.parent('.form-group').addClass('has-warning');
		} else {
			$txtContent.parent('.form-group').removeClass('has-warning');
		}

		//if (txtTime === '') {
		//	$txtTime.parent('.form-group').addClass('has-warning');
		//} else {
		//	$txtTime.parent('.form-group').removeClass('has-warning');
		//}
	});
};

/*
* Collapse
*/
TodoHelper.prototype.collapse = function() {
	var $collapse = $('#collapse_click_1, #collapse_click_2');
	$collapse.click(function() {
		var $this = $(this);
		var _addClass = function() {
			$this.siblings('span.pull-right').removeClass('glyphicon-chevron-down')
				.addClass('glyphicon-chevron-up');
		};
		var _removeClass = function() {
			$this.siblings('span.pull-right').removeClass('glyphicon-chevron-up')
				.addClass('glyphicon-chevron-down');
		};
		$this.hasClass('collapsed') ? _addClass() : _removeClass();


    });
};

/*
* 滚动条插件nicescroll
*/
TodoHelper.prototype.niceScroll = function(str) {
	if (!str) {
		str = 'html';
	}

    $(str).niceScroll({
        cursorcolor: '#398F70'
    });

};

/*
* 背景插件backstretch
*/
TodoHelper.prototype.backStretch = function(imgs) {
	var imgs = imgs || [
    		"images/bg1.jpg",
      		"images/bg2.jpg",
            "images/bg3.jpg"
    	];
	return (function($) {
		$.backstretch(imgs, {
       		fade: 750,
       		duration: 4000
    	});
	})(jQuery);

}; 

/*
* 添加事项
*/
TodoHelper.prototype.newPost = function(str) {
    if (!str) {
        str = '#btnAdd';
    }

    $(str).on('click', function() {
        var post_url = 'http://localhost:3000/new';
        var txt_title = $('#txtTitle').val(),
            txt_content = $('#txtContent').val(),
            txt_time = $('#txtTime').val();
        //alert(txt_time);
        //console.log(txt_time);

        if (txt_title && txt_content) {
            $.ajax({
                data: {
                    title: txt_title,
                    content: txt_content,
                    post_date: txt_time
                },
                url: post_url,
                type: 'post',
                dataType: 'json',
                success: function(data) {
                    if (data.status == 1) {
                        window.location.href = '/';
                    }
                }
            });
        }
    });
};


/*
* 查看事项详情
*/
TodoHelper.prototype.checkTodo = function(_this) {
    var _this = _this;
	var $targets = $(".ev_target1, .ev_target2");

    //点击事项标题显示模态框
    $targets.click(function(event) {
        var $td;
        if ($(this).is('.ev_target1')) {
            $td = $(this).parent('td');
        } else if ($(this).is('.ev_target2')) {
            $td = $(this).parent('td').siblings(':first');
        }

        var txt_title = $td.find('.txtTitle').text(),
            txt_content = $td.find('.txtContent').val(),
            txt_post_time = $td.find('.txtPostTime').text(),
            txt_id = $td.find('._id').val(),
            txt_flag_finished = $td.find('.flagFinished').val();

        //以下是显示到模态框的数据
        txt_title = $.trim(txt_title);
        txt_content = $.trim(txt_content);
        txt_post_time = $.trim(txt_post_time);

        //console.log('_id: ' + txt_id);

        $('#txtTitle').val(txt_title);
        $('#txtContent').val(txt_content);
        $('#txtTime').val(txt_post_time);
        //只有未完成的事项方可编辑修改
        if (txt_flag_finished === 'false') {
            $('#txtTitle, #txtContent, #txtTime').attr('disabled', false);
            _this._id = txt_id;
        } else {
            $('#txtTitle, #txtContent, #txtTime').attr('disabled', true);
            _this._id = '';
        }

        event.preventDefault();
    });
};

/*
* 编辑事项
*/
TodoHelper.prototype.editTodo = function(str, _this) {
    if (!str) {
        str = '#fat-btn';
    }
    var _this = _this;

    $(str).on('click', function() {
        var _id = _this._id;

        //console.log('This is ' + _id);
        //未完成事项方可编辑修改
        if (_id) {
            var post_url = 'http://localhost:3000/' + _id + '/modify';
            var txt_title = $('#txtTitle').val(),
                txt_content = $('#txtContent').val(),
                txt_time = $('#txtTime').val();

            $.ajax({
                data: {
                    title: txt_title,
                    content: txt_content,
                    post_date: txt_time
                },
                url: post_url,
                type: 'post',
                dataType: 'json',
                success: function(data) {
                    if (data.status == 1) {
                        window.location.href = '/';
                    }
                }
            });
        }
    });
};

/*
* 日期显示格式插件 yyyy-mm-dd
*/
TodoHelper.prototype.initDateFormat = function(_$) {
    var jQuery = _$;

    //插件开始
    ;(function($) {
        $.fn.dateFormat = function(options) {
            var defaults = {
                format: 'yyyy-mm-dd',
                dataName: 'post_time'
            };
            var $this = $(this);
            var defaults = $.extend({}, options);
            var _split = defaults.format.replace(/\w+/g, '');

            $this.each(function() {
                var txt_time = $(this).attr('data-' + defaults.dataName);
                txt_time = new Date(txt_time);
                //console.log(txt_time);

                var _year = txt_time.getFullYear(),
                    _month = txt_time.getMonth() + 1,
                    _date = txt_time.getDate(),
                    _result = '';

                //[String] + [Number] = [String]
                _month = _month < 10 && _month > 0 ? ('0' + _month) : _month;
                _date = _date < 10 && _date > 0 ? ('0' + _date) : _date;

                _result = _year + _split.charAt(0) + _month + _split.charAt(1) + _date;
                $(this).text(_result) || $(this).val(_result);
            });
        };
    })(jQuery);

    //插件调用
   jQuery(document).ready(function() {
        $('.txtPostTime').dateFormat({
            format: 'yyyy-mm-dd',
            dataName: 'post_time'
        });
   });

};

/*
* tooltips
*/
TodoHelper.prototype.toolTip = function() {
    var $txtTitle = $('.txtTitle');
    var sub_string = function(str) {
        return str = str.length > 8 ? str.substr(0, 6) + ' ...' : str;
    };

    return $txtTitle.each(function() {
        var cont = $(this).siblings('.txtContent').val();
        cont = sub_string(cont);
        $(this).tooltip({
            placement: 'right',
            title: cont,
            animation: true
        });
    });
};




/************************************************
* INIT
************************************************/
var todoHelper = new TodoHelper();
todoHelper.init();
