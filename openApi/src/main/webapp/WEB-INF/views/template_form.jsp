<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>템플릿 메일폼</title>
<script type="text/javascript" src="js/jquery-1.7.min.js"></script>
<script type="text/javascript" src="js/jquery.smartPop.js"></script>
<link rel="stylesheet" href="css/jquery.smartPop.css" />
<script language="javascript">
function editContent() {
	$.smartPop.open({ background: "black", width: 400, height: 300, url: 'editContent.jsp' });
//	window.open("editContent.html" ,'pbml_win','toolbar=no,location=no,directories=no, status=no,menubar=no,resizable=yes, scrollbars=yes,width=650,height=700,left=0,top=0' );
//	document.content.action = "editContent.jsp";
//	document.content.target = "pbml_win";
//	document.content.submit();
}
</script>
</head>
<body>
<form name="content" action="" method="post">
<a href="#" onclick="javascript:editContent()">
내용입니다.
</a>
</form>


</body>
</html>