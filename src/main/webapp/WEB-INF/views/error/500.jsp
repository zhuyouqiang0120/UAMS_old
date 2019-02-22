<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>无标题文档</title>
<link href="${ContextPath}/static/hySpin/css/spin.css" rel="stylesheet" type="text/css" />
<script type="text/javascript"	src="${ContextPath}/static/js/jquery-2.0.3.js"> </script>
<script type="text/javascript">
$(function(){
    $('.error').css({'position':'absolute','left':($(window).width()-490)/2});
	$(window).resize(function(){  
    $('.error').css({'position':'absolute','left':($(window).width()-490)/2});
    })  
});  
</script> 
</head>
<body>
<div class="error">
    <h2>非常遗憾，您访问的请求出错！</h2>
    <p>看到这个提示，请进入DEBUG模式.</p>
    <div class="reindex"><a href="${ContextPath}">返回首页</a></div>
</div>
</body>
</html>
