  <%--用于生产环境-build--%>
    <!DOCTYPE html>
    <%@ page contentType="text/html;charset=UTF-8" %>
    <%@ include file="/WEB-INF/views/include/taglib.jsp"%>
    <html>
    <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=0">
    <title>ECMS</title>


    </head>
    <body>
    <input type="hidden" id="basePath" value="${basePath}">
    <input type="hidden" id="hostAddress" value="${hostAddress}">
    <input type="hidden" id="token" value="${token}">
    <input type="hidden" id="oaUserId" value="${ea.id}">
    <input type="hidden" id="wxPath" value="${ctxWx}">
    <input type="hidden" id="wxName" value="${ea.accounts}">
    <input type="hidden" id="wxMobile" value="${wu.mobile}">
    <input type="hidden" id="wxAvatar" value="${wu.avatar}">
    <input type="hidden" id="orgAndRankName" value="${ea.orgAndRankName}">

    <div id="app-box"></div>
    <%--<script type="text/javascript" src="http://res.wx.qq.com/open/js/jweixin-1.1.0.js"></script>--%>
    <script src="http://res.wx.qq.com/open/js/jweixin-1.4.0.js"></script>
    <script type="text/javascript" src="https://api.map.baidu.com/api?v=2.0&ak=HmIUaIAvPzNSnoyRXLw5UF4YTzt9iC1k"></script>
    <script type="text/javascript" src="https://api.map.baidu.com/library/GeoUtils/1.2/src/GeoUtils_min.js"></script>
    <script src="https://cdn.bootcss.com/vConsole/3.2.2/vconsole.min.js"></script>
    <script type="text/javascript">
    wx.config(${jsConfig});
    </script>

    </body>
    </html>
