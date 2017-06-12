$(function(){
	
	//常用乘船人信息数据
	var passengerData = [
			{
				"id":1,
				"name":"王小川",
				"codeTypeId":1,
				"codeType":"身份证",
				"code":"2202045678951",
				"mobile":"13608965458",
				"isDefault":true
			},
			{
				"id":2,
				"name":"张三",
				"codeTypeId":1,
				"codeType":"身份证",
				"code":"220204565671111",
				"mobile":"13608961111",
				"isDefault":false
			},
			{
				"id":3,
				"name":"李四",
				"codeTypeId":2,
				"codeType":"军人证",
				"code":"220204565672222",
				"mobile":"13608961111",
				"isDefault":false
			},
			{
				"id":4,
				"name":"王五",
				"codeTypeId":3,
				"codeType":"港澳台通行证",
				"code":"220204565673333",
				"mobile":"13608963333",
				"isDefault":false
			},
			{
				"id":5,
				"name":"赵六",
				"codeTypeId":4,
				"codeType":"其他证件",
				"code":"220204565674444",
				"mobile":"13608964444",
				"isDefault":false
			},
			{
				"id":6,
				"name":"钱七",
				"codeTypeId":1,
				"codeType":"身份证",
				"code":"220204565675555",
				"mobile":"13608965555",
				"isDefault":false
			}
	];
	
	//票价信息
	var priceData = [
		{
			"priceType":"普通",
			"price":325,
			"priceDetails":"280+20+15"
		},
		{
			"priceType":"学生",
			"price":299,
			"priceDetails":"265+20+15"
		},
		{
			"priceType":"军人",
			"price":275,
			"priceDetails":"235+20+15"
		},
		{
			"priceType":"儿童",
			"price":98,
			"priceDetails":"65+20+15"
		}
	];
	
	//乘客计数
	var passengerCount = 0;
	
	//动态生成船票价格下拉列表框
	var priceListHtml = '';
	priceListHtml += '<select name="price">';
	$.each(priceData,function(index,el){
		priceListHtml += '<option value="' + el.price + '">' + el.priceType + ' ￥' + el.price + '</option>';
	});
	priceListHtml += '</select>';
	
	//动态生成证件类型下拉列表框
	var certTypeHtml = '<select style="width:110px;" name="certType"><option value="1">身份证</option><option value="2">军人证</option><option value="3">港澳台通行证</option><option value="4">其他证件</option></select>';
		
	var htmlStr = ''; //用于动态拼接html字符串
	
	var passengerBlock = $('#passengerBlock'); //常用乘船人姓名区域
	
	/*显示默认乘船人姓名*/
	var defaultPassenger;
	
	$.each(passengerData,function(index,el) {
		if (el.isDefault) {
			defaultPassenger = el;
			return false;//退出jquery的遍历循环，相当于break
		}
	});	
	
	htmlStr = '<label><input type="checkbox" id="' + defaultPassenger.id + '">' 
			+ defaultPassenger.name + '</label>';
	
	$('#defaultPassenger').html(htmlStr);
	
	/*显示其他乘船人姓名*/
	var passengerBlock = $('#passengerBlock');
	
	$.each(passengerData,function(index,el) {
		if (!el.isDefault) {
			htmlStr = '<label><input type="checkbox" id="' + el.id + '">' 
					+ el.name + '</label> ';
			passengerBlock.append(htmlStr);
		}
	});	
	
	/*显示隐藏更多乘船人姓名*/
	$('#moreBtn').click(function(e){
				
		if ( passengerBlock.css('display') == 'none' ) {
			passengerBlock.show();
			$(this).text('<<隐藏');
		} else {
			passengerBlock.hide();
			$(this).text('更多>>');
		}		
	});
	
	/*
	 * 单击任何一个乘船人姓名复选框触发事件
	 */
	$('#allPassenger').on('click',':checkbox',function() {
		
		//获得复选框的id属性值
		var id = $(this).attr('id');
				
		//判断选中添加，取消选中删除
		if (this.checked) {	
			
			//判断人数是否超过5人
			if (passengerCount >= 5) {
				alert('订单最多一次5个人');
				return false;
			}
			
			passengerCount ++; //计数+1
			
			//根据id获得旅客信息
			var p = findPassgerById(id);
			
			//拼接订单条目
			htmlStr = '';
			htmlStr += '<ul id="' + id + '">';
			htmlStr += '	<li>' + priceListHtml + '</li>';
			htmlStr += '	<li>';
			htmlStr += '		姓名：<input name="name" readonly type="text" size="8" value="' + p.name + '">';
			htmlStr += '	</li>';
			htmlStr += '	<li><select style="width:110px;"><option value="' + p.codeTypeId + '">' + p.codeType + '</option></select><input name="code" readonly type="text" value="' + p.code + '"></li>';
			htmlStr += '	<li>';
			htmlStr += '		电话：<input name="mobile" readonly type="text" value="' + p.mobile + '">';
			htmlStr += '	</li>';
			htmlStr += '	<li>';
			htmlStr += '		<input type="button" value="删除当前" class="delBtn">';
			htmlStr += '	</li>';
			htmlStr += '</ul>';			
			
			//添加条目
			$('#passengerList').append(htmlStr);			
			
		} else {
			//删除对应的条目
			$('#passengerList').find('#' + id).remove();
			passengerCount --; //计数-1
		}	
		
		//同步更新票数和订单金额
		getTotalPrice();		
	});
	
	/*
	 * 根据id返回对象数据
	 */
	function findPassgerById(id) {
		
		var p = null;
		
		$.each(passengerData,function(index,el) {
			
			if (id == el.id) {
				p = el;
				return false;
			}			
		});
		
		return p;
	}
	
	/*
	 * 单击删除当前按钮，删除当前的条目
	 */
	$('#passengerList').on('click','.delBtn',function() {
		
		//获得当前ul条目
		var ul = $(this).parents('ul');
		//获得ul的id
		var id = ul.attr('id');
		//删除ul
		ul.remove();
		//取消选中对应的复选框
		$('#allPassenger').find('#' + id).prop('checked',false);
		
		passengerCount --;//计数-1
		
		//同步更新票数和订单金额
		getTotalPrice();
	});
	
	/**
	 * 手动新增乘船人
	 */
	$('#addPassBtn').click(function() {
		
		//判断人数是否超过5人
		if (passengerCount >= 5) {
			alert('订单最多一次5个人');
			return false;
		}
		
		passengerCount ++; //计数+1
		
		//拼接订单条目
		htmlStr = '';
		htmlStr += '<ul>';
		htmlStr += '	<li>' + priceListHtml + '</li>';
		htmlStr += '	<li>';
		htmlStr += '		姓名：<input name="name" type="text" size="8">';
		htmlStr += '	</li>';
		htmlStr += '	<li>' + certTypeHtml + '<input name="code" type="text"></li>';
		htmlStr += '	<li>';
		htmlStr += '		电话：<input type="text" name="mobile">';
		htmlStr += '	</li>';
		htmlStr += '	<li>';
		htmlStr += '		<input type="button" value="删除当前" class="delBtn">';
		htmlStr += '	</li>';
		htmlStr += '</ul>';	
		
		//添加条目
		$('#passengerList').append(htmlStr);	
		
		//同步更新票数和订单金额
		getTotalPrice();
	});
	
	//初始化，默认选中当前默认乘船人
	$('#defaultPassenger :checkbox').click();
	
	/**
	 * 当重新选择票的类型，更新订单金额
	 */
	$('#passengerList').on('change','select[name=price]',function(e){
		getTotalPrice();
	});
	
	/**
	 * 提交订单
	 */
	$('#submitBtn').click(function() {
		
		//表单验证
		if ( !checkForm() ) 
			return;
		
		alert('向后端提交数据');
		
	});
		
	/**
	 * 计算订单人数和金额，同步显示到网页中
	 */
	function getTotalPrice() {
		
		//订单总额
		var totalPrice = 0;
		
		//遍历所有价格列表框
		$('#passengerList select[name=price]').each(function(index,el){
			
			totalPrice += parseFloat(el.value);
			
		});
		
		//显示票的数量
		$('#ticketCount').text(passengerCount);
		//显示订单总额
		$('#totalPrice').text(totalPrice);
	}
	
	/**
	 * 表单验证函数
	 */
	function checkForm() {
		
		var flag = true;
		
		//验证姓名
		$('#passengerList input[name=name]').each(function(index,el){
			
			if (el.value == '') {
				alert('姓名不能为空');
				this.focus();
				flag = false; //设置验证为假
				return false;
			}	
			
		});
		
		if (!flag)
			return false;
		
		//验证证件号码
		$('#passengerList input[name=code]').each(function(index,el){
			
			if (el.value == '') {
				alert('证件号码不能为空');
				this.focus();
				flag = false; //设置验证为假
				return false;
			}	
			
		});		
		
		if (!flag)
			return false;
		
		//验证手机号码
		$('#passengerList input[name=mobile]').each(function(index,el){
			
			if (el.value == '') {
				alert('电话号码不能为空');
				this.focus();
				flag = false; //设置验证为假
				return false;
			}	
			
		});	
		
		//订单数量验证
		if (passengerCount == 0) {
			alert('订单必须至少有一张订票');
			flag = false;
		}
		
		return flag;		
	}	
	
});