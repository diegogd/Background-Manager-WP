/*
 * Copyright (c) 2011 Mike Green <myatus@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 */
mainWin=window.dialogArguments||opener||parent||top;(function($){$.fn.extend({scrollTo:function(obj){$(this).clearQueue().animate({scrollTop:$(obj).offset().top},"fast");return $(this)}});$.expr[":"].above=function(obj,index,meta,stack){var args=eval("(["+meta[3]+"])"),x=args[0],y=args[1],w=args[2];return($(obj).offset().top<y&&$(obj).offset().left>=x&&$(obj).offset().left<=(x+w))};$.expr[":"].below=function(obj,index,meta,stack){var args=eval("(["+meta[3]+"])"),x=args[0],y=args[1],w=args[2];return($(obj).offset().top>y&&$(obj).offset().left>=x&&$(obj).offset().left<=(x+w))};$.expr[":"].right=function(obj,index,meta,stack){var args=eval("(["+meta[3]+"])"),x=args[0],y=args[1],h=args[2];return($(obj).offset().top>=y&&$(obj).offset().top<=(y+h)&&$(obj).offset().left>x)};$.expr[":"].left=function(obj,index,meta,stack){var args=eval("(["+meta[3]+"])"),x=args[0],y=args[1],h=args[2];return($(obj).offset().top>=y&&$(obj).offset().top<=(y+h)&&$(obj).offset().left<x)};getObjSize=function(obj){var size=0,key;for(key in obj){if(obj.hasOwnProperty(key)){size++}}return size};getAjaxData=function(ajaxFunc,ajaxData){var resp=false;$.ajax({type:"POST",dataType:"json",url:ajaxurl,timeout:5000,async:false,data:{action:ajaxaction,func:ajaxFunc,data:ajaxData,_ajax_nonce:ajaxnonce},success:function(ajaxResp){if(ajaxResp.nonce==ajaxnonceresponse&&ajaxResp.stat=="ok"){resp=ajaxResp.data}}});return resp}})(jQuery);
