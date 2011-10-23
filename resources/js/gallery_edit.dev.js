/*
 * Copyright (c) 2011 Mike Green <myatus@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 */

(function($){
    /** Holds selected photos */
    photo_selection = new Object();
   
    /** Gets the photo count [Ajax] */
    getPhotoCount = function() { return getAjaxData('photo_count', $('#edit_id').val()); }

    /** Gets the hash of the current photos [Ajax] */
    getPhotosHash = function() { return getAjaxData('photos_hash', $('#edit_id').val()); }

    /** Gets all the ids of the photos [Ajax] */
    getPhotoIds = function() { return getAjaxData('photo_ids', $('#edit_id').val()); }

    /** Removes the photo iframe overlay and restores iframe visibility */
    removePhotosOverlay = function() { $('#photos_iframe').fadeIn('fast', function() { $('#photo_iframe_overlay').hide(); }); }

    /** Displays or hides the "Edit Bar" (containing buttons related to selected items) */
    showHideEditBar = function(getIds) {
        if (getIds == true) {
            // Check if a selected ID no longer exist in getPhotoIds(), and delete from photo_selection if so.
            var ids = getPhotoIds();

            for (key in photo_selection) {
                var id = key.replace('photo_', '');

                if (ids[id] == undefined)
                    delete photo_selection[key];
            }
        }

        // Show or hide the edit bar based on the photo_selection object count
        var edit_bar = $('#quicktags'), selected_count = $('#selected-count'), count = getObjSize(photo_selection);

        if (count > 0) {
            edit_bar.slideDown();
            selected_count.show();
            $('#select-count', selected_count).html(count);
        } else {
            edit_bar.slideUp();
            selected_count.hide();
            $('#select-count', selected_count).html('0');
        }
    }

    /** Returns whether photos have been changed (based on the hash) */
    havePhotosChanged = function(setNewHash) {
        var current_hash = $('#photos_hash').val(), hash = getPhotosHash();

        if (hash != false && current_hash != hash) {
            if (setNewHash == true)
                $('#photos_hash').val(hash);

            return true;
        }

        return false;
    }

    /** Loads a URL in the photo iframe */
    loadPhotosIframe = function(dest) {
        var overlay = $('#photo_iframe_overlay'), loader = $('#loader', overlay);

        if (dest == undefined)
            dest = $('#photos_iframe').attr("src"); // Default action is to reload
           
        // Display the overlay on top of the photos iframe
        overlay.show();

        // Hide the photo buttons, if shown.
        $('#photo_buttons').hide()

        // Center the loader image
        loader.css('top', ((overlay.height() - loader.outerHeight()) / 2) + overlay.scrollTop() + 'px');
        loader.css('left', ((overlay.width() - loader.outerWidth()) / 2) + overlay.scrollLeft() + 'px');
        
        // Fade out the iframe
        $('#photos_iframe').attr("src", dest).fadeOut('fast');
    }

    /** Shows (or hides) the (single photo) edit/delete buttons on the highlighted item */
    showHidePhotoButtons = function(highlighted) {
        var photo_buttons = $('#photos_iframe').contents().find('#photo_buttons');

        if (highlighted == undefined)
            highlighted = $('#photos_iframe').contents().find('.highlighted:first');

        // If nothing is highlighted, then we hide the edit buttons instead.
        if (!$(highlighted).length) {
            photo_buttons.hide();
            return;
        }

        var photo_img = $('img', highlighted), overlay = $('#photo_iframe_overlay'), loader = $('#loader', overlay);

        // Align edit buttons within the top-left corner of the image tag
        photo_buttons.css('top', photo_img.offset().top - overlay.scrollTop() + 'px');
        photo_buttons.css('left', photo_img.offset().left - overlay.scrollLeft() +  'px');
        photo_buttons.show();

        // Set the correct href for the photo `edit` and `delete` button
        $('#photo_edit_button', photo_buttons).attr("href", $('#photo_iframe_edit_base').val() + '&id=' + $(highlighted).attr('id').replace('photo_', '') + '&TB_iframe=true');
        $('#photo_del_button', photo_buttons).attr("href", '#' + $(highlighted).attr('id').replace('photo_', ''));
    }

    /** Event triggered when the iframe has finished loading */
    onPhotosIframeFinish = function(current_page) {
        var photo_body = $('#photos_iframe').contents().find('html,body'), photo_container = $('#photo_container', photo_body);
        var pagination_links = getAjaxData('paginate_links', { id: $('#edit_id').val(), base: $('#photos_iframe_base').val(), pp: $('#photos_per_page').val(), current: current_page });

        // Display pagination links, if any were returned by Ajax call
        if (pagination_links != false) {
            $('.tablenav-pages').html(pagination_links);
            $('.tablenav-pages a').click(onPaginationClick);
        }

        // Display photo count
        $('#wp-word-count #photo-count').html(getPhotoCount());
        
        // Iterate the photos displayed, binding click and re-highlighting if previously selected
        $('.photo', photo_container).each(function(index) {
            $(this).dblclick(onPhotoDoubleClick);
            $(this).click(onPhotoClick);

            if (photo_selection[$(this).attr('id')] == true)
                $(this).addClass('selected');
        });

        // Add a additional click events
        photo_body.click(onEmptyPhotoAreaClick);
        $('#photo_edit_button', photo_body).click(onPhotoEditButtonClick);
        $('#photo_del_button', photo_body).click(onPhotoDeleteButtonClick);

        // Attach keyboard events
        photo_body.keydown(onIframeKeyDown);

        // Remove the overlay, we're done.
        removePhotosOverlay();
    }

    /** Event triggered when `Delete Selected` is clicked */
    onDeleteSelected = function(event) {
        if ($('#photo_del_is_perm').val() == '1' && confirm(bgmL10n.warn_delete_all_photos) == false)
            return false;

        var key, ids = '';

        for (key in photo_selection)
            ids += key.replace('photo_', '') + ',';

        // Delete the photos from the DB
        getAjaxData('delete_photos', ids);

        showHideEditBar(true);
        
        if (havePhotosChanged(true))
            loadPhotosIframe();

        return false;
    }

    /** Event triggered when `Clear` is clicked */
    onClearSelected = function(event) {
        var photo_container = $('#photos_iframe').contents().find('#photo_container');

        // Clear photo_selection
        photo_selection = new Object();

        // Remove any selected classes displayed
        $('.photo', photo_container).each(function(index) {
            if ($(this).hasClass('selected'))
                $(this).removeClass('selected');
        });

        // Hide the edit bar
        showHideEditBar(false);

        return false;
    }

    /** Event triggered when one of the pagination buttons have been clicked */
    onPaginationClick = function(event) {
        loadPhotosIframe($(this).attr('href'));

        return false;
   }

    /** Event triggered when a photo (inside the iframe) has been double clicked */
    onPhotoDoubleClick = function(event) {
        var id = $(this).attr('id');

        $(this).toggleClass('selected');

        if ($(this).hasClass('selected')) {
            photo_selection[id] = true;
        } else {
            delete photo_selection[id];
        }

        showHideEditBar(false);

        return false;
    }

    /** Event triggered when a photo (inside the iframe) has been clicked */
    onPhotoClick = function(event) {
        // Only allow a single photo to be highlighted
        $('#photos_iframe').contents().find('.photo').removeClass('highlighted');

        // Highlight the clicked item
        $(this).addClass('highlighted');

        // And show the photo buttons
        showHidePhotoButtons(this);

        return false;
    }

    /** Event triggered when no photo (empty area) is clicked */
    onEmptyPhotoAreaClick = function(event) {
        $('#photos_iframe').contents().find('.photo').removeClass('highlighted');

        showHidePhotoButtons();
    }

    /** Event triggered when the `edit` button is clicked */
    onPhotoEditButtonClick = function(event) {
        tb_show($(this).attr('title'), $(this).attr('href')); // We do this here instead of using a thickbox class, to ensure it is shown in the parent, not the iframe

        return false;
    }

    /** Event triggered when the `delete` button is clicked */
    onPhotoDeleteButtonClick = function(event) {
        if ($('#photo_del_is_perm').val() == '1' && confirm(bgmL10n.warn_delete_photo) == false)
            return false;

        // Delete the photo from the DB
        getAjaxData('delete_photos', $(this).attr('href').replace('#', ''));

        showHideEditBar(true);
        
        if (havePhotosChanged(true))
            loadPhotosIframe();
        
        return false;
    }

    /** Event tiggered when a key is pressed inside the iframe, to assist with selecting items by keyboard */
    onIframeKeyDown = function(event) {
        var photo_body = $('#photos_iframe').contents().find('html,body'), photo_container = $('#photo_container', photo_body), highlighted = $('.photo.highlighted', photo_container);

        // Internal function to ensure a highlighted item, and then scroll to the highlighted item
        var doScroll = function(which) { 
            if (!highlighted.length && which != undefined) 
                highlighted = $('.photo:'+which, photo_container).addClass('highlighted');

            // Add any photo buttons, if needed
            showHidePhotoButtons();

            // Scroll to the item.
            if (photo_body.length && highlighted.length)
                photo_body.scrollTo(highlighted);

        };

        // Internal function to get position, width and height details
        var pos = function(obj) { return { x: $(obj).offset().left, y: $(obj).offset().top, w: $(obj).outerWidth(), h: $(obj).outerHeight() }; }

        // Event is based on specific keys:
        switch (event.keyCode) {
            case 32:
                // Space
                highlighted.dblclick();

                return false;

            case 37: 
                // Left arrow
                highlighted = highlighted.removeClass('highlighted').prev('.photo').addClass('highlighted');

                doScroll('last');

                return false;

            case 39: 
                // Right arrow
                highlighted = highlighted.removeClass('highlighted').next('.photo').addClass('highlighted');

                doScroll('first');

                return false;

            case 40:
                // Down arrow
                if (highlighted.length) {
                    // Remove the highlighting on the current `highlighted` photo
                    highlighted.removeClass('highlighted');

                    // Try to go to the photo below
                    possible_highlighted = $('.photo:below('+pos(highlighted).x+','+pos(highlighted).y+','+pos(highlighted).w+'):first', photo_container);

                    // If there's no photo below, go to the first one in the column above it and move one to the right if possible, or the very first one otherwise.
                    if (!possible_highlighted.length || possible_highlighted == highlighted) {
                        highlighted = $('.photo:above('+pos(highlighted).x+','+pos(highlighted).y+','+pos(highlighted).w+'):first', photo_container);

                        if (highlighted.length)
                            highlighted = $('.photo:right('+pos(highlighted).x+','+pos(highlighted).y+','+pos(highlighted).h+'):first', photo_container);

                        if (!highlighted.length)
                            highlighted = $('.photo:first', photo_container);
                    } else {
                        highlighted = possible_highlighted;
                    }

                    highlighted.addClass('highlighted');

                    doScroll();
                } else {
                    doScroll('last');
                }
                
                return false;

            case 38:
                // Up arrow
                if (highlighted.length) {
                    highlighted.removeClass('highlighted');

                    // Try to go to the photo directly above the current highlighted one
                    possible_highlighted = $('.photo:above('+pos(highlighted).x+','+pos(highlighted).y+','+pos(highlighted).w+'):last', photo_container);

                    // If that didn't work, move one left or to the far right (reset) and then the bottom photo in that column.
                    if (!possible_highlighted.length || possible_highlighted == highlighted) {
                        if (highlighted.prev('.photo').length) {
                            highlighted = highlighted.prev('.photo');
                        } else {
                            highlighted = $('.photo:right('+pos(highlighted).x+','+pos(highlighted).y+','+pos(highlighted).h+'):last', photo_container);
                        }

                        highlighted = $('.photo:below('+pos(highlighted).x+','+pos(highlighted).y+','+pos(highlighted).w+'):last', photo_container);

                        if (!highlighted.length)
                            highlighted = $('.photo:last', photo_container);                        
                    } else {
                        highlighted = possible_highlighted;
                    }

                    highlighted.addClass('highlighted');

                    doScroll();
                } else {
                    doScroll('first');
                }

                return false;
        }

    }    

    /** "Ready" event */
    $(document).ready(function($){
        // Override send_to_editor(html):
        mainWin.send_to_editor = function(send_id) {
            tb_remove(); // All we need to do is close the ThickBox window
        }

        // Override tb_remove()
        mainWin.tb_remove = function() {
            $("#TB_imageOff").unbind("click");
            $("#TB_closeWindowButton").unbind("click");
            $("#TB_window").fadeOut("fast",function(){$('#TB_window,#TB_overlay,#TB_HideSelect').trigger("unload").unbind().remove();});
            $("#TB_load").remove();

            if (typeof document.body.style.maxHeight == "undefined") {//if IE 6
                $("body","html").css({height: "auto", width: "auto"});
                $("html").css("overflow","");
            }

            document.onkeydown = "";
            document.onkeyup = "";

            if (havePhotosChanged(true))
               loadPhotosIframe();

            return false;
        }

        // Attach 'click' events
        $('#ed_delete_selected').click(onDeleteSelected);
        $('#ed_clear_selected').click(onClearSelected);
    });

})(jQuery);