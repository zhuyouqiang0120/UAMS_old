<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<title></title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" name="viewport" />
<link href="${ContextPath}/assets/UI/main.css" media="all" rel="stylesheet" type="text/css" />
<link href="${ContextPath}/assets/UI/image/fault.ico" rel="shortcut icon" />
<title>UAMS统一媒资管理软件V2.0</title>
<style type="text/css">
body{ background:url(${ContextPath}/assets/UI/image/bg.png); background-size: cover; }
</style>
</head>
<body>
<div class="login-container fadeIn">
	<span class="login-logo">
		<img src="${ContextPath}/assets/UI/image/logo.png" width="90" height="65"/>
	</span>
	<span class="login-title"> UAMS统一媒资管理软件 </span>
	<form action="${ContextPath}/login" method="post">
		<div class="form-group">
			<input type="text" class="form-control login-input" name="username" placeholder="用户名">
		</div>
		<div class="form-group">
			<input type="password" class="form-control login-input" name="password"	placeholder="密码">
		</div>
		<div class="login-error">${loginErr}</div>
		<div class="form-group login-btn">
			<button type="submit" class="btn btn-info"><span class="icon icon-log-in"></span> 登录</button>
			<button type="reset" class="btn btn-default"><span class="icon icon-log-out"></span> 取消</button>
		</div>
	</form>
</div>
</body>
</html>