/*
 * Copyright (c) 2011 Mike Green <myatus@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 */
(function(a){a.extend(myatu_bgm,{SetTimer:function(){if(background_manager_vars.change_freq<=0){return}if(myatu_bgm.timer){clearTimeout(myatu_bgm.timer)}myatu_bgm.timer=setTimeout("myatu_bgm.SwitchBackground()",background_manager_vars.change_freq*1000)},SwitchBackground:function(){var d=(background_manager_vars.is_fullsize=="true"),b=(d)?a("#myatu_bgm_top").attr("src"):a("body").css("background-image"),c=myatu_bgm.GetAjaxData("random_image",{prev_img:b,active_gallery:background_manager_vars.active_gallery});if(!c){return}if(d){a("#myatu_bgm_top").clone().attr("id","myatu_bgm_prev").appendTo("body");a("#myatu_bgm_top").hide().attr({src:c.url,alt:c.alt}).imgLoaded(function(){a(this).fadeIn("slow",function(){a("#myatu_bgm_prev").remove();myatu_bgm.SetTimer()})})}else{a("body").css("background-image",'url("'+c.url+'")');myatu_bgm.SetTimer()}a("#myatu_bgm_info_tab").btOff();a(".myatu_bgm_info_tab a").attr("href",c.link);a(".myatu_bgm_info_tab_content img").attr("src",c.thumb);a(".myatu_bgm_info_tab_content h3").text(c.caption);a(".myatu_bgm_info_tab_desc").html(c.desc)}});a(document).ready(function(b){myatu_bgm.SetTimer();if(b.isFunction(b("#myatu_bgm_info_tab").bt)){b("#myatu_bgm_info_tab").bt({contentSelector:"$('.myatu_bgm_info_tab_content')",killTitle:false,trigger:["mouseover focus","mouseout blur"],positions:["right","left"],fill:"#333",strokeStyle:"#666",spikeLength:20,spikeGirth:20,overlap:0,shrinkToFit:true,width:"450px",textzIndex:19999,boxzIndex:19998,wrapperzIndex:19997,windowMargin:20,cssStyles:{fontFamily:'"Lucida Grande",Helvetica,Arial,Verdana,sans-serif',fontSize:"12px",padding:"14px 4px 9px 14px",color:"#eee"},shadow:true,shadowColor:"rgba(0,0,0,.5)",shadowBlur:8,shadowOffsetX:4,shadowOffsetY:4,showTip:function(c){if(!b(".myatu_bgm_info_tab_content img").attr("src")&&!b(".myatu_bgm_info_tab_desc").text()&&!b(".myatu_bgm_info_tab_content h3").text()){return}if(b(".myatu_bgm_info_tab_desc").text()==""){b(c).css("width","auto")}b(c).show()},})}})})(jQuery);
