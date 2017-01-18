/*jslint node: true, indent:4, browser: true, plusplus: true, unparam: true*/
/*global $:false, jQuery: false, requirejs: false, define: false*/
'use strict';
//include('js/css_browser_selector.js');
function css_browser_selector(a) {
    var b = {
            orientation: "",
            maxw: 0
        },
        c = [320, 480, 640, 768, 1024, 1152, 1280, 1440, 1680, 1920, 2560],
        d = c.length,
        e = a.toLowerCase(),
        f = function (a) {
            return new RegExp(a, "i").test(e);
        },
        g = "gecko",
        h = "webkit",
        i = "chrome",
        j = "firefox",
        k = "safari",
        l = "opera",
        m = "mobile",
        n = "android",
        o = "blackberry",
        p = "lang_",
        /*q = "device_",*/
        r = document.documentElement,
        s = [!/opera|webtv/i.test(e) && /msie\s(\d+)/.test(e) ? "ie ie" + (/trident\/4\.0/.test(e) ? "8" : RegExp.$1) : f("firefox/") ? g + " " + j + (/firefox\/((\d+)(\.(\d+))(\.\d+)*)/.test(e) ? " " + j + RegExp.$2 + " " + j + RegExp.$2 + "_" + RegExp.$4 : "") : f("gecko/") ? g : f("opera") ? l + (/version\/((\d+)(\.(\d+))(\.\d+)*)/.test(e) ? " " + l + RegExp.$2 + " " + l + RegExp.$2 + "_" + RegExp.$4 : /opera(\s|\/)(\d+)\.(\d+)/.test(e) ? " " + l + RegExp.$2 + " " + l + RegExp.$2 + "_" + RegExp.$3 : "") : f("konqueror") ? "konqueror" : f("blackberry") ? o + (/Version\/(\d+)(\.(\d+)+)/i.test(e) ? " " + o + RegExp.$1 + " " + o + RegExp.$1 + RegExp.$2.replace(".", "_") : /Blackberry ?(([0-9]+)([a-z]?))[\/|;]/gi.test(e) ? " " + o + RegExp.$2 + (RegExp.$3 ? " " + o + RegExp.$2 + RegExp.$3 : "") : "") : f("android") ? n + (/Version\/(\d+)(\.(\d+))+/i.test(e) ? " " + n + RegExp.$1 + " " + n + RegExp.$1 + RegExp.$2.replace(".", "_") : "") + (/Android ([\w\W]+); ([\w\W]+) Build/i.test(e) ? " device_" + RegExp.$2.replace(/ /g, "_").replace(/-/g, "_") : "") : f("chrome") ? h + " " + i + (/chrome\/((\d+)(\.(\d+))(\.\d+)*)/.test(e) ? " " + i + RegExp.$2 + (RegExp.$4 > 0 ? " " + i + RegExp.$2 + "_" + RegExp.$4 : "") : "") : f("iron") ? h + " iron" : f("applewebkit/") ? h + " " + k + (/version\/((\d+)(\.(\d+))(\.\d+)*)/.test(e) ? " " + k + RegExp.$2 + " " + k + RegExp.$2 + RegExp.$3.replace(".", "_") : / Safari\/(\d+)/i.test(e) ? RegExp.$1 === "419" || RegExp.$1 === "417" || RegExp.$1 === "416" || RegExp.$1 === "412" ? " " + k + "2_0" : RegExp.$1 === "312" ? " " + k + "1_3" : RegExp.$1 === "125" ? " " + k + "1_2" : RegExp.$1 === "85" ? " " + k + "1_0" : "" : "") : f("mozilla/") ? g : "", f("mobi|mobile|j2me|iphone|ipod|ipad|blackberry|playbook|kindle|silk") ? m : "", f("j2me") ? "j2me" : f("iphone") ? "iphone" : f("ipod") ? "ipod" : f("ipad") ? "ipad" : f("playbook") ? "playbook" : f("kindle|silk") ? "kindle" : f("mac") ? "mac" + (/mac os x ((\d+)[.|_](\d+))/.test(e) ? " mac" + RegExp.$1.replace(".", "_") : "") : f("win") ? "win" + (f("windows nt 6.2") ? " win8" : f("windows nt 6.1") ? " win7" : f("windows nt 6.0") ? " vista" : f("windows nt 5.2") || f("windows nt 5.1") ? " win_xp" : f("windows nt 5.0") ? " win_2k" : f("windows nt 4.0") || f("WinNT4.0") ? " win_nt" : "") : f("freebsd") ? "freebsd" : f("x11|linux") ? "linux" : "", /[; |\[](([a-z]{2})(\-[a-z]{2})?)[)|;|\]]/i.test(e) ? (p + RegExp.$2).replace("-", "_") + (RegExp.$3 !== "" ? (" " + p + RegExp.$1).replace("-", "_") : "") : ""],
        u = s.join(" ").replace(/ +/g, " ") + " js ";


    function t() {
        var v = window.outerWidth || r.clientWidth,
            x = window.outerHeight || r.clientHeight,
            ww,
            widthClasses = "",
            z;
        b.orientation = (v < x) ? "portrait" : "landscape";
        r.className = r.className.replace(/ ?orientation_\w+/g, "").replace(/ [min|max|cl]+[w|h]_\d+/g, "");
        for (ww = d - 1; ww >= 0; ww--) {
            if (v >= c[ww]) {
                b.maxw = c[ww];
                break;
            }
        }
        for (z in b) {
            if (b.hasOwnProperty(z)) {

                widthClasses += " " + z + "_" + b[z];
            }
        }
        r.className = r.className + widthClasses;

        return widthClasses;
    }
    window.onresize = t;
    t();
    r.className = (u + r.className.replace(/(no[\-|_]?)?js/g, "")).replace(/^ /, "");
    return u;
}
var showLog = true;

function log(a) {
    if (window.console && showLog) {
        console.log(a);
    }
}
css_browser_selector(navigator.userAgent);
/*****jQUERY*****/
function equalHeight(group) {
    var tallest = 0,
        thisHeight;
    group.each(function () {
        thisHeight = $(this).height();
        if (thisHeight > tallest) {
            tallest = thisHeight;
        }
    });
    group.height(tallest);
}


/**
 * Ajax function for sending to´process´
 *
 * @param      {object/formData}  data       The data form
 * @param      {function}         $$ejecute  The function to ejecute in sucess event
 */
function ajaxProcess(data, $$ejecute) {
    $.ajax({
        url: 'process.php',
        data: data,
        processData: false, // tell jQuery not to process the data
        contentType: false, // tell jQuery not to set contentType
        type: 'post',
        success: $$ejecute,
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
        }
    });
}

//Item Sorter
function sortableList() {
    $("#ListPhoto").sortable({
        placeholder: "ui-state-highlight",
        out: function (event, ui) {
            var formData = new FormData();
            formData.append('action', 'reorder');

            $(ui.item).parents('ul').find('li').each(function (index, el) {
                $(el).data('order', index + 1);
                formData.append('id[]', $(el).data('id'));
                formData.append('order[]', $(el).data('order'));
            });

            ajaxProcess(formData, function (data) {

            });
        }
    });
    $("#ListPhoto").disableSelection();
    // Touch event aggregate
    $("#ListPhoto").draggable();
}

/**
 * Functionality to create html structure of listing items.
 *
 * @param      {string}  description  The description text
 * @param      {string}  files        The url files
 * @param      {number}  order        The order of the item
 * @param      {number}  id           The record identifier
 * @return     {object/jQuery}  { item del listado  }
 */
function htmlItem(description, files, order, id) {
    var $li = $('<li>').attr({
            'data-id': id,
            'data-order': order
        }),
        $figure = $('<figure>'),
        $figcaption = $('<figcaption>'),
        $p = $('<p>'),
        $img = $('<img>').attr({
            'class': 'img-responsive',
            width: 320,
            height: 320
        }),
        $spanAdd = $('<span>').attr({
            'data-fancybox-type': 'inline',
            'data-fancybox-href': '#formAddEditPhoto',
            'class': 'fa fa-pencil-square-o fancy edit'

        }),
        $spanRemove = $('<span>').attr({
            'class': 'fa fa-times remove'
        }),
        $div = $('<div>');

    $p.text(description);
    $img.attr('src', files);

    $figcaption.append($div);
    $figcaption.append($p);
    $figcaption.append($spanAdd);
    $figcaption.append($spanRemove);
    $figure.append($img);
    $figure.append($figcaption);
    return $li.append($figure);
}

// Popup initiator
function fancyForm() {
    $('.fancy').fancybox();
}

// Add photo
function addPhoto() {
    $('.add').on('click', function (e) {
        // Prevent event
        e.preventDefault();

        // Add share value to send to´process´
        $('#action').val('add');

        // Remove excess input
        $('#nameImg').remove();
        $('#order').remove();
        $('#formPhoto img').remove();

        // Clean form
        $('#formPhoto').trigger('reset');
    });
}

// Edit photo
function editPhoto() {
    $('.edit').on('click', function (e) {
        // Prevent event
        e.preventDefault();

        var nameImg = $(e.currentTarget).parents('figure').find('img').attr('src'),
            nameImgA = nameImg.split('/'),
            // Create input with image name
            name = $('<input type="hidden" name="nameImg" id="nameImg">').val(nameImgA[nameImgA.length - 1]),
            // Create input with order number of what is edited
            targetOrder = $('<input type="hidden" name="order" id="order">').val($(e.currentTarget).parents('li').data('order')),
            // Create input with id number of what is edited
            targetId = $('<input type="hidden" name="id" id="id">').val($(e.currentTarget).parents('li').data('id')),
            // Create sample image of what is edited
            img = $('<img class="img-responsive" width="150" height="150">').attr('src', nameImg);

        // Add share value to send to ´process´
        $('#action').val('edit');

        // Remove input and surplus image
        $('#nameImg').remove();
        $('#order').remove();
        $('#id').remove();
        $('#formPhoto img').remove();

        // Add sample image of what is edited. Add textarea content, To edit
        $('#photo').before(img);
        $('#description').val($(e.currentTarget).parents('figure').find('p').text());
        // Add to form inputs
        $('#formPhoto').append(name).append(targetOrder).append(targetId);
    });
}

// Remove photo
function removePhoto() {
    $('.remove').on('click', function (e) {
        // Prevent event
        e.preventDefault();

        // Save image name to remove and id record number
        var nameImg = $(e.currentTarget).parents('figure').find('img').attr('src');
        nameImg = nameImg.split('/');
        var idItem = $(e.currentTarget).parents('li').data('id');

        $(e.currentTarget).parents('li').remove();

        // Set of parameters to send
        var formData = new FormData();
        formData.append('action', 'remove');
        formData.append('nameImg', nameImg[nameImg.length - 1]);
        formData.append('id', idItem);

        // Post to process
        ajaxProcess(formData, function (data) {
            // If it is successful
            // Rebuild the content
            refreshContent();
        });
    });
}

//Shipping form
function formPost() {
    // Variable bool for photo and description
    var boolPhoto = false,
        boolDescription = false;
    // Add content change event, if it happens to set true value to `boolPhoto` and `boolDescription`
    $('#photo').on('change', function (e) {
        boolPhoto = true;
    });
    $('#description').on('change', function (e) {
        boolDescription = true;
    });

    // Add functionality to event
    $('#formPhoto').on('submit', function (e) {
        // Prevent sending event
        e.preventDefault();

        // If to add
        if ($('#action').val() === 'add') {
            // If the image and description is added
            if (boolPhoto && boolDescription) {

                // Set of parameters to send
                var formDataAdd = new FormData(),
                    $file = $('#photo')[0].files[0],
                    $typeFile = $file.type;
                // Parameter of type of action to be executed in the `process`
                formDataAdd.append('action', $('#action').val());

                // If the image is added, add parameter with information of the image but cancel sending
                if (boolPhoto) {
                    // Validate image type `jpeg` `jpg` `png` `gif`
                    if ($typeFile === 'image/jpeg' || $typeFile === 'image/jpg' || $typeFile === 'image/png' || $typeFile === 'image/gif') {
                        formDataAdd.append('file', $file);
                    } else {
                        return false;
                    }
                } else if ($file.length === 0) {
                    return false;
                }

                // If the description of the image is added, add parameter with the text, but pass to the parameter empty text
                if (boolDescription) {
                    formDataAdd.append('description', $('#description').val());
                } else {
                    formDataAdd.append('description', $('#description').val(''));
                }

                // Add the new order to the parameter
                formDataAdd.append('order', $('#ListPhoto li').length + 1);

                // Post to process
                ajaxProcess(formDataAdd, function (data, textStatus, jqXHR) {
                    // If it is successful

                    // Clean form
                    $('#formPhoto').trigger('reset');

                    // Return value to false
                    boolPhoto = false;
                    boolDescription = false;

                    // Close pop up
                    $.fancybox.close(true);

                    // Rebuild the content
                    refreshContent();
                });
            }
            // If it's to edit
        } else if ($('#action').val() === 'edit') {
            // If the image or description was modified
            if (boolPhoto || boolDescription) {

                // Set of parameters to send
                var formDataEdit = new FormData();
                // Parameter of type of action to execute in the process
                formDataEdit.append('action', $('#action').val());
                // If the image is modified, add parameter ´file´ with image data, but image path
                if (boolPhoto) {
                    formDataEdit.append('file', $('#photo')[0].files[0]);
                } else {
                    formDataEdit.append('file', $('#formPhoto img').attr('src'));
                }

                // If the description is modified, set parameter with the edited, but parameter with what already contained the description
                if (boolDescription) {
                    formDataEdit.append('description', $('#description').val());
                } else {
                    formDataEdit.append('description', $('#description').val());
                }

                // Post id to register
                formDataEdit.append('id', $('#id').val());

                // Post to process
                ajaxProcess(formDataEdit, function (data, textStatus, jqXHR) {
                    // If it is successful

                    // Clean form
                    $('#formPhoto').trigger('reset');

                    // Return value to false
                    boolPhoto = false;
                    boolDescription = false;

                    // Close pop up
                    $.fancybox.close(true);

                    // Rebuild the content
                    refreshContent();
                });
            } else {
                return false;
            }
        }
    });
}

// Refreshed content
function refreshContent() {
    // Set of parameters to send
    var formData = new FormData();
    // Parameter of type of action to execute in `process`
    formData.append('action', 'refresh');

    // Post to `process`
    ajaxProcess(formData, function (data, textStatus, jqXHR) {
        // If it is successful
        // get json
        data = $.parseJSON(data);

        // Change item counter value
        $('#countItem').text(data.length);

        // Empty the photo list
        $('#ListPhoto').empty();

        // rove json
        $.each(data, function (index, val) {
            // If there is a record in the json
            if ($(val).length > 0) {
                // Add item to list of photos
                $('#ListPhoto').append(htmlItem(val.description, val.route, val.order, val.id));
            }
        });

        // Add pop up functionality
        fancyForm();

        // Add functionality to `edit` button
        editPhoto();

        // Add functionality to `delete` button
        removePhoto();

        // Add broken image url solver
        $('img').fixBroken();
    });
}

/*jQuery Global Functions*/
$(function () {
    // Start loading item to listing
    refreshContent();

    // Add pop up functionality
    fancyForm();

    // To add functionality to `add` button
    addPhoto();

    // Add sorting functionality
    sortableList();

    // Add functionality to form
    formPost();
});