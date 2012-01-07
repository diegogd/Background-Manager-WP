/*
 * Copyright (c) 2011 Mike Green <myatus@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 */
(function(a){a.extend(myatu_bgm,{showHideLayoutTable:function(b){if((typeof b==="string"&&b=="full")||this.value=="full"){a(".bg_extra_layout").hide()}else{a(".bg_extra_layout").show()}},showHideInfoExtra:function(){if(a("#info_tab:checked").length){a(".info_tab_extra").show()}else{a(".info_tab_extra").hide()}},updatePreviewColor:function(){var b=a("#background_color").val();if(b&&b.charAt(0)=="#"){if(b.length>1){a("#bg_preview").css("background-color",b);a("#clear_color").show()}else{a("#bg_preview").css("background-color","");a("#clear_color").hide()}}},updatePreviewOverlay:function(){var b=myatu_bgm.GetAjaxData("overlay_data",a("#active_overlay option:selected").val());if(b){a("#bg_preview_overlay").css("background","url('"+b+"') repeat fixed top left transparent")}else{a("#bg_preview_overlay").css("background","")}},updatePreviewGallery:function(){var c=a("#active_gallery option:selected").val(),b=myatu_bgm.GetAjaxData("random_image",{active_gallery:c,prev_img:"none"});if(b){a("#bg_preview").css("background-image","url('"+b.thumb+"')")}else{a("#bg_preview").css("background-image","")}},updatePreviewLayout:function(){var f=a('input[name="background_size"]:checked').val(),c=a('input[name="background_position"]:checked').val().replace("-"," "),e=a('input[name="background_repeat"]:checked').val(),d=(a("#background_stretch_horizontal:checked").length==1),b=(a("#background_stretch_vertical:checked").length==1);if(f=="full"){a("#bg_preview").css({"background-size":"100% auto","background-repeat":"no-repeat","background-position":"top left",})}else{a("#bg_preview").css({"background-size":((d)?"100%":"50px")+" "+((b)?"100%":"50px"),"background-repeat":e,"background-position":c,})}},clearColor:function(){a("#background_color").val("#");myatu_bgm.updatePreviewColor();return false}});a(document).ready(function(b){myatu_bgm.updatePreviewColor();myatu_bgm.updatePreviewGallery();myatu_bgm.updatePreviewLayout();myatu_bgm.updatePreviewOverlay();myatu_bgm.showHideInfoExtra();myatu_bgm.showHideLayoutTable(b('input[name="background_size"]:checked').val());b("#background_color").focusin(function(){b("#color_picker").show()}).focusout(function(){b("#color_picker").hide();myatu_bgm.updatePreviewColor()}).keyup(function(){if(this.value.charAt(0)!="#"){this.value="#"+this.value}b.farbtastic("#color_picker").setColor(b("#background_color").val());myatu_bgm.updatePreviewColor()});b("#color_picker").farbtastic(function(c){b("#background_color").attr("value",c);b("#bg_preview").css("background-color",c)});b.farbtastic("#color_picker").setColor(b("#background_color").val());b('input[name="background_size"]').change(myatu_bgm.showHideLayoutTable);b("#active_gallery").change(myatu_bgm.updatePreviewGallery);b("#active_overlay").change(myatu_bgm.updatePreviewOverlay);b('input[name="background_size"]').change(myatu_bgm.updatePreviewLayout);b('input[name="background_position"]').change(myatu_bgm.updatePreviewLayout);b('input[name="background_repeat"]').change(myatu_bgm.updatePreviewLayout);b("#background_stretch_horizontal").click(myatu_bgm.updatePreviewLayout);b("#background_stretch_vertical").click(myatu_bgm.updatePreviewLayout);b("#info_tab").click(myatu_bgm.showHideInfoExtra);b("#clear_color").click(myatu_bgm.clearColor)})})(jQuery);