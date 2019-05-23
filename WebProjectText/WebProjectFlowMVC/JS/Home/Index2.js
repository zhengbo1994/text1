﻿// 顶部布局首页Index2.aspx中用到的js

var zIndex = 0;
var arr_display = new Array();  // 存放三级以下菜单的display
var arr_focus = new Array();    // 存放三级以下菜单的focus
window.menuLineHeight = 20;
window.menu2Clicked = false;    // 第二级(有子级)菜单是否点击
window.menu3Over = false;       // 菜单下拉框是否悬停

// 获取菜单原始宽度
window.onload = function()
{
    var bWelcom = getObj("hidWelcom").value.substr(0, 1) == "Y";
    var kickIP = getObj("hidWelcom").value.substr(2);

    // 显示欢迎页
    if (bWelcom)
    {
        var win = openWindow("VWelcome.aspx", 800, 600);
        if (win)
        {
            win.focus();
        }
    }
    // 踢出登录提示
    if (kickIP)
    {
        alert("您的账号在别处登录（IP：" + kickIP + "），已将其下线。");
    }
    window["Date_Theme"] = getObj("hidTheme").value;
}

// 关闭窗口前确认
window.onbeforeunload = function()
{
    var axisX = event.screenX - window.screenLeft;
    if (axisX > document.body.clientWidth - 20 && event.clientY < 0 || event.altKey || event.ctrlKey)   
    {
        return "关闭浏览器将退出本系统。";
    }  
}

// 菜单mouseover
function mE(isLeaf)
{
    var aHref = getEventObj("A");
    if (aHref)
    {
        if (isLeaf)
        {
            removeIDTabStyle(aHref, true);
            hideOtherMenu("div_" + aHref.id);
        }
        else
        {
            selectIDTab(aHref, "right -20px", "left -20px", "", true);
            
            var divMenu = getObjP("div_" + aHref.id);
            var left = getAbsAxisX(aHref) + aHref.offsetWidth - 7;
            var top = getAbsAxisY(aHref) - 7;
            var width = 150;
            var height = divMenu.cnt * window.menuLineHeight + 20;
            
            showMenu(divMenu, left, top, width, height, false);
        }
    }
}

// 菜单click
function cM(id, url, linkWay, bPersonal)
{
    hideMenu();
    
    if (linkWay == "1")
    {
        url = "Home/VTab.aspx?ModID=" + id;
    }
    else if (id && url && !isValidUrl(url))
    {
        url += (url.indexOf("?") != -1 ? "&" : "?") + "IDM_ID=" + id;
    }
    
    // 来自个人工作区
    if (bPersonal)
    {
        if (isExecuteUrl(url))
        {
            eval(url);
            return;
        }

        if (!isValidUrl(url))
        {
            url = "../" + url;
        }
        openWindow(url, 0, 0);
    }
    // 来自二级下拉菜单
    else
    {
        var beChanged = (getObjP("ifrMain").src != "../" + url);
        
        if (!isValidUrl(url))
        {
            url = "../" + url;
        }
        getObjP("ifrMain").src = url;
        
        if (beChanged)
        {
            var aHref = getEventObj("A");
            var guide = "";
            if (aHref)
            {
                guide = aHref.innerText;
                
                var aId = aHref.id;
                while (aId.indexOf(".") != -1)
                {
                    aId = aId.substr(0, aId.lastIndexOf("."));
                    aHref = getObj(aId);
                    if (aHref)
                    {
                        guide = aHref.innerText + " >> " + guide;
                    }
                    else
                    {
                        break;
                    }
                }
                aHref = getObjPF("Top", "a" + aId);
                if (aHref)
                {
                    guide = aHref.innerText + ">> " + guide;
                    window.top["Mod1_SelectID"] = aHref.id;
                }
            }
            
            execFrameFuns("Upper", function()
            {
                window.parent.frames("Upper").showGuide(guide);
            }, window.parent);
        }
    }
}

// 菜单下拉框mouseover(opt=1)、mousetout(opt=0)
function fE(opt)
{
    if (opt)
    {
        window.menu3Over = true;
        var divMenu = getEventObj("DIV");
        if (divMenu && arr_display[divMenu.id])
        {
            arr_focus[divMenu.id] = 1;
            divMenu.focus();
        }
    }
    else
    {
        window.menu3Over = false;
    }
}

// 菜单下拉框失去焦点
function bF()
{
    var divMenu = getEventObj("DIV");
    if (divMenu)
    {
        arr_focus[divMenu.id] = 0;
        
        if (!window.menu3Over)
        {
            var allblur = 1;
            for (var key in arr_display)
            {
                if (arr_display[key] && arr_focus[key])
                {
                    allblur = 0;
                    break;
                }
            }
            if (allblur)
            {
                hideMenu();
            }
        }
    }
}

// 隐藏所有菜单下拉框
function hideMenu()
{
    for (var key in arr_display)
    {
        if (arr_display[key])
        {
            getObj(key).style.display = "none";
            arr_display[key] = 0;
            arr_focus[key] = 0;
        }
    }
    
    window.menu2Clicked = false;
    window.menu3Over = false;
}

// 显示菜单下拉框
function showMenu(divMenu, left, top, width, height, bFirstLayer)
{
    hideOtherMenu(divMenu.id);
    
    if (left + width > document.body.offsetWidth)
    {
        left = bFirstLayer ? (document.body.offsetWidth - width) : (left - (width * 2) + 32);
    }
    if (document.body.offsetHeight - top - height < 0)
    {
        top = document.body.offsetHeight - height;
    }
    if (left < 0)
    {
        left = 0;
    }
    if (top < 0 )
    {
        top = 0;
    }
    
    divMenu.style.left = left;
    divMenu.style.top = top;
    divMenu.style.width = width;
    divMenu.style.height = height;
    divMenu.style.zIndex = ++zIndex;
    
    if (!getObj("tb_" + divMenu.id))
    {
        divMenu.innerHTML = "<table id='tb_" + divMenu.id
            + "'><tr><td class='m1'></td><td class='m2'></td><td class='m3'></td></tr><tr><td colspan='3'><table><tr><td class='m4'></td><td class='m5'>"
            + divMenu.innerHTML
            + "</td><td class='m6'></td></tr></table></td></tr><tr><td class='m7'></td><td class='m8'></td><td class='m9'></td></tr></table>";
    }
    
    if (ieVersion <= 6 && divMenu.innerHTML.substr(0, 7) != "<iframe")
    {
        divMenu.innerHTML = '<table class="idtbfix" style="height:100%;position:absolute;z-index:-1;background-color:transparent"><tr><td style="padding:10px 7px">'
            + '<iframe style="width:100%;height:100%" frameborder="0"></iframe></td></tr></table>' + divMenu.innerHTML;
    }
    
    divMenu.style.display = "block";
    divMenu.focus();
}

// 显示菜单下拉框之前隐藏其他菜单下拉框
function hideOtherMenu(id)
{
    var len = id.split(".").length;
    for (var key in arr_display)
    {
        if (key != id && key.split(".").length >= len && arr_display[key])
        {
            getObj(key).style.display = "none";
            arr_display[key] = 0;
        }
    }
    if (getObj(id))
    {
        arr_display[id] = 1;
        arr_focus[id] = 1;
    }
}

// 显隐Logo区
function showIDLogo(div, opt)
{
    if (opt == 0)
    {
        execFrameFuns("Top", function()
            {   
                if (window["LogoIsHide"])
                {
                    getObjF("Top", "trLogo1").style.display = "";
                    getObjF("Top", "trLogo2").style.display = "";
                    getObjF("Top", "tbLogo").style.backgroundImage = "url('" + getObjF("Top", "imgLogo").src + "')";
                    div.className = "l2_ec_on";
                    tdLogo.style.height = 95;
                    window["LogoIsHide"] = 0;
                    div.title = "隐藏 Logo 区域";
                }
                else
                {
                    getObjF("Top", "trLogo1").style.display = "none";
                    getObjF("Top", "trLogo2").style.display = "none";
                    getObjF("Top", "tbLogo").style.backgroundImage = "none";
                    div.className = "l2_ec_off";
                    tdLogo.style.height = 30;
                    window["LogoIsHide"] = 1;
                    div.title = "显示 Logo 区域";
                }
            }, window);
    }
    else if (opt == 1)
    {
        div.className = (window["LogoIsHide"] ? "l2_ec_off" : "l2_ec_on");
    }
    else if (opt == 2)
    {
        div.className = "l2_ec";
    }
}

// 切换用户
function exchangeUser(accountID)
{
    ajaxRequest("FillData.ashx", {action: "ExchangeUser", AccountID:accountID}, "text", afterExchange);
}

// 切换用户
function afterExchange(data, textStatus)
{
    if (data == "Y")
    {
        window.frames("Top").location.reload();
        if (getObj("btnBackTrack"))
        {
            document.body.removeChild(getObj("btnBackTrack"));
        }
    }
    else
    {
        alert(data);
    }
}

// LogoMenu打开工作页
function gz(index)
{
    hideMenu();
    showLogoWork(index);
}
//是否是CTS
function initLocationPage()
{
    if ($("#hidPublishCompany").val() == "CTS")
    {
        getObj("ifrMain").src = "../CTSIM/Index/VHome.aspx";
    }
}

// 中铁华升显示企业门户时，不显示“待办”和“发起工作”，否则显示 add by zhangmq 20140228
$(function ()
{
    if ($("#hidPublishCompany").val() == "ZTHS")
    {
        execFrameFuns("Main", function ()
        {
            $("#aWorkGround", window.frames("Top").document).hide();
            $(".header-tab", window.frames("Main").document).click(function (event)
            {
                if (event.target && event.target.tagName && (event.target.tagName.toUpperCase() == "DD" && event.target.portalType || $(event.target).closest("dd[portalType]").length == 1))
                {
                    var portalType = event.target.portalType || $(event.target).closest("dd[portalType]").attr("portalType");
                    if (portalType === "2")
                    {
                        $("#aWork", window.frames("Top").document).hide();
                        $("#img1", window.frames("Top").document).parent("a").hide();
                    }
                    else
                    {
                        $("#aWork", window.frames("Top").document).show();
                        $("#img1", window.frames("Top").document).parent("a").show();
                    }
                }
            });
        });
    }
})