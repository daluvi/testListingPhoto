/*jslint node: true, indent:4, browser: true, unparam: true*/
/*global $:false, jQuery: false*/
'use strict';
/*
 *
 * jqTransform
 * by mathieu vilaplana mvilaplana@dfc-e.com
 * Designer ghyslain armand garmand@dfc-e.com
 *
 *
 * Version 1.0 25.09.08
 * Version 1.1 06.08.09
 * Add event click on Checkbox and Radio
 * Auto calculate the size of a select element
 * Can now, disabled the elements
 * Correct bug in ff if click on select (overflow=hidden)
 * No need any more preloading !!
 *
 ******************************************** */

//crear compatibilidad de atributo form
//crear compatibilidad de atributo formaction
//crear compatibilidad de atributo formenctype
//crear compatibilidad de atributo list
//crear compatibilidad de atributo step
//crear compatibilidad de etiquetas datalist y el atributo label al option
//crear compatibilidad de etiquetas input mail

(function ($) {
    var
    /*defaultOptions = {
               preloadImg: true
           },*/
    //jqTransformImgPreloaded = false,

    /*jqTransformPreloadHoverFocusImg = function (strImgUrl) {
        //guillemets to remove for ie
        strImgUrl = strImgUrl.replace(/^url\((.*)\)/, '$1').replace(/^\"(.*)\"$/, '$1');
        var imgHover, imgFocus = new Image();
        imgHover.src = strImgUrl.replace(/\.([a-zA-Z]*)$/, '-hover.$1');
        imgFocus.src = strImgUrl.replace(/\.([a-zA-Z]*)$/, '-focus.$1');
    },*/
        id = [],
        TABINDEXMAX = 0,
        /***************************
          Labels
        ***************************/
        jqTransformGetLabel = function (objfield) {
            var selfForm, oLabel, labelTarget, inputname, retorno;

            selfForm = $(objfield.get(0).form);

            labelTarget = (objfield.prev().is('label') ? 'prev' : (objfield.next().is('label') ? 'next' : (objfield.parent().is('label') ? 'parent' : null)));

            function verfForId(obj, objL) {
                var num;
                inputname = obj.attr('id');
                if (inputname !== undefined) {
                    if (objL.attr('for') === undefined) {
                        //num = id[obj.get(0).type];
                        objL.attr('for', inputname);
                    }
                    oLabel = selfForm.find('label[for="' + inputname + '"]');
                } else {
                    if (id[obj.get(0).type] !== undefined) {
                        num = id[obj.get(0).type];
                        inputname = obj.get(0).type + (num + 1);

                        id[obj.get(0).type] = num + 1;
                    } else {
                        id.push(obj.get(0).type);
                        id[obj.get(0).type] = 1;
                        inputname = obj.get(0).type + 1;
                    }
                    obj.attr('id', inputname);
                }
                if (objL.attr('for') === undefined) {
                    num = id[obj.get(0).type];
                    objL.attr('for', (obj.get(0).type + (num + 1)));
                } else {
                    //console.log('');
                }
            }
            switch (labelTarget) {
            case 'next':
                oLabel = objfield.next();
                verfForId(objfield, oLabel);
                retorno = oLabel.css('cursor', 'pointer');
                break;
            case 'prev':
                oLabel = objfield.prev();
                verfForId(objfield, oLabel);
                retorno = oLabel.css('cursor', 'pointer');
                break;
            case 'parent':
                oLabel = objfield.parent();
                verfForId(objfield, oLabel);
                retorno = oLabel.css('cursor', 'pointer');
                break;
            default:
                retorno = false;
            }
            return retorno;
        },
        /* Hide all open selects */
        jqTransformHideSelect = function (oTarget) {
            var ulVisible = $('.jqTransformSelectWrapper ul:visible');
            ulVisible.each(function () {
                var oSelect = $(this).parents(".jqTransformSelectWrapper:first").find("select").get(0);
                //do not hide if click on the label object associated to the select
                if (!(oTarget && oSelect.oLabel && oSelect.oLabel.get(0) === oTarget.get(0))) {
                    $(this).hide();
                }
            });
        },
        /* Check for an external click */
        jqTransformCheckExternalClick = function (event) {
            if ($(event.target).parents('.jqTransformSelectWrapper').length === 0) {
                jqTransformHideSelect($(event.target));
            }
        },

        /* Apply document listener */
        jqTransformAddDocumentListener = function () {
            $(document).mousedown(jqTransformCheckExternalClick);
        },

        /* Add a new handler for the reset action */
        jqTransformReset = function (f) {
            var sel;
            $('.jqTransformSelectWrapper select', f).each(function () {
                sel = (this.selectedIndex < 0) ? 0 : this.selectedIndex;
                $('ul', $(this).parent()).each(function () {
                    $('a:eq(' + sel + ')', this).click();
                });
            });
            $('a.jqTransformCheckbox, a.jqTransformRadio', f).removeClass('jqTransformChecked');
            $('input:checkbox, input:radio', f).each(function () {
                if (this.checked) {
                    $('a', $(this).parent()).addClass('jqTransformChecked');
                }
            });
        },
        tabIndexTransformElement = function (tabIndex, inverse) {
            var $content;
            if (inverse) {
                $content = $('[tabindex=' + (tabIndex - 1) + ']');
            } else {
                $content = $('[tabindex=' + (tabIndex + 1) + ']');
            }
            if ($content.length > 0) {
                if ($content.get(0).nodeName === 'SELECT') {
                    $content.parents('.jqTransformSelectWrapper').find('.jqTransformSelectOpen').trigger('click');
                    $content.parents('.jqTransformSelectWrapper').find('ul li a').trigger('focus');
                } else {
                    jqTransformHideSelect();
                    if ($content.get(0).type === 'checkbox') {
                        $content.parents('.jqTransformCheckboxWrapper').find('.jqTransformCheckbox').trigger('focus');

                    } else if ($content.get(0).type === 'radio') {
                        $content.parents('.jqTransformRadioWrapper').find('.jqTransformRadio').trigger('focus');
                    } else {
                        $content.trigger('focus');
                        $content.data('val', $content.val());
                        $content.val('');
                    }
                }
            } else {

                if (tabIndex !== TABINDEXMAX) {
                    tabIndexTransformElement(tabIndex + 1);
                }
            }
        },
        blurTransformElement = function (elememt) {
            var $content = $(elememt);
            if ($content.data('val') !== undefined) {
                if ($content.val() === '') {
                    $content.val($content.data('val'));
                }
            }
        },
        jqTransformTabIndex = function (element) {
            var $this = $(element);
            $this.on('keydown', function (e) {
                if (e.shiftKey) {
                    if (e.key === 'Tab') {
                        e.preventDefault();
                        e.stopPropagation();
                        tabIndexTransformElement(e.target.tabIndex, true);
                        blurTransformElement(e.target, true);
                    }
                } else {
                    if (e.key === 'Tab') {
                        e.preventDefault();
                        e.stopPropagation();
                        tabIndexTransformElement(e.target.tabIndex);
                        blurTransformElement(e.target);
                    }
                }
            });
        };
    /***************************
      Buttons
     ***************************/
    $.fn.jqTransInputButton = function () {
        return this.each(function () {
            var $input = $(this),
                newBtn;
            if ($input.hasClass('ignore') === true) {
                return;
            }
            newBtn = $('<button id="' + this.id + '" name="' + this.name + '" type="' + this.type + '" class="' + this.className + ' jqTransformButton"><span><span>' + $(this).attr('value') + '</span></span>')
                .hover(function () {
                    newBtn.addClass('jqTransformButton_hover');
                }, function () {
                    newBtn.removeClass('jqTransformButton_hover');
                })
                .mousedown(function () {
                    newBtn.addClass('jqTransformButton_click');
                })
                .mouseup(function () {
                    newBtn.removeClass('jqTransformButton_click');
                });
            $(this).replaceWith(newBtn);
        });
    };

    /***************************
      Text Fields
     ***************************/
    $.fn.jqTransInputText = function () {
        return this.each(function (index, elements) {
            var $input = $(this),
                oLabel,
                /*inputSize,*/
                $wrapper;

            if ($input.hasClass('ignore') === true) {
                return;
            }
            if ($input.hasClass('jqtranformdone') || !$input.is('input')) {
                return;
            }
            $input.addClass('jqtranformdone');

            oLabel = jqTransformGetLabel($(this));
            if (oLabel !== false) {
                oLabel.on('click', function () {
                    $input.focus();
                });
            }

            /*inputSize = $input.width();
            if ($input.attr('size')) {
                inputSize = $input.attr('size') * 10;
                $input.css('width', inputSize);
            }*/

            $input.addClass("jqTransformInput").wrap('<div class="jqTransformInputWrapper" />').wrap('<div class="jqTransformInputInner" />').wrap('<div />');

            $wrapper = $input.parent().parent().parent();
            if ($input.attr('disabled')) {
                $wrapper.addClass('jqTransformDisabled');
            }

            if ($input.attr('tabindex')) {
                jqTransformTabIndex(elements);
            }


            $input
                .focus(function () {
                    $wrapper.addClass("jqTransformInputWrapper_focus");
                })
                .blur(function () {
                    $wrapper.removeClass("jqTransformInputWrapper_focus");
                })
                .hover(function () {
                    $wrapper.addClass("jqTransformInputWrapper_hover");
                }, function () {
                    $wrapper.removeClass("jqTransformInputWrapper_hover");
                });

            /* If this is safari we need to add an extra class */
            // $.browser.safari && $wrapper.addClass('jqTransformSafari');
            // $.browser.safari && $input.css('width',$wrapper.width()+16);
            // this.wrapper = $wrapper;

        });
    };

    /***************************
      number Fields
     ***************************/
    $.fn.jqTransInputNumber = function () {
        return this.each(function (index, elements) {
            var $input = $(this),
                oLabel,
                /*inputSize,*/
                $wrapper;

            if ($input.hasClass('ignore') === true) {
                return;
            }
            if ($input.hasClass('jqtranformdone') || !$input.is('input')) {
                return;
            }
            $input.addClass('jqtranformdone');

            oLabel = jqTransformGetLabel($(this));
            if (oLabel !== false) {
                oLabel.bind('click', function () {
                    $input.focus();
                });
            }

            /*inputSize = $input.width();
            if ($input.attr('size')) {
                inputSize = $input.attr('size') * 10;
                $input.css('width', inputSize);
            }*/

            $input.addClass("jqTransformInput").wrap('<div class="jqTransformInputWrapper" />').wrap('<div class="jqTransformInputInner" />').wrap('<div />').after('<small>');
            //$input.addClass("jqTransformInput").wrap('<div class="jqTransformInputWrapper"><div class="jqTransformInputInner"><div></div></div></div>');
            $wrapper = $input.parent().parent().parent();
            if ($input.attr('disabled')) {
                $wrapper.addClass('jqTransformDisabled');
            }
            if ($input.attr('tabindex')) {
                jqTransformTabIndex(elements);
            }
            /*$wrapper.css("width", inputSize + 10);*/
            $input
                .focus(function () {
                    $wrapper.addClass("jqTransformInputWrapper_focus");
                })
                .blur(function () {
                    $wrapper.removeClass("jqTransformInputWrapper_focus");
                })
                .hover(function () {
                    $wrapper.addClass("jqTransformInputWrapper_hover");
                }, function () {
                    $wrapper.removeClass("jqTransformInputWrapper_hover");
                });

            /* If this is safari we need to add an extra class */
            // $.browser.safari && $wrapper.addClass('jqTransformSafari');
            // $.browser.safari && $input.css('width',$wrapper.width()+16);
            // this.wrapper = $wrapper;

        });
    };

    /***************************
      Check Boxes
     ***************************/
    $.fn.jqTransCheckBox = function () {
        return this.each(function (index, elements) {
            if ($(this).hasClass('ignore') === true) {
                return;
            }
            if ($(this).hasClass('jqTransformHidden')) {
                return;
            }

            var $input = $(this),
                //inputSelf = this,
                oLabel,
                aLink;

            //set the click on the label

            oLabel = jqTransformGetLabel($input);
            if (oLabel !== false) {
                if (oLabel.attr('for') === '' || oLabel.attr('for') === undefined) {
                    oLabel.click(function (e) {
                        aLink.trigger('click');
                    });
                } else {
                    oLabel.click(function (e) {
                        e.stopPropagation();
                        aLink.trigger('click');
                    });
                }
            }


            aLink = $('<a href="#" class="jqTransformCheckbox"></a>');
            //wrap and add the link
            $input.addClass('jqTransformHidden').wrap('<span class="jqTransformCheckboxWrapper"></span>').parent().prepend(aLink);
            //on change, change the class of the link
            if ($input.attr('disabled')) {
                $input.parent().addClass('jqTransformDisabled');
            }
            if ($input.attr('tabindex')) {
                jqTransformTabIndex(elements);
            }
            $input.on('change', function (e) {
                if (this.checked) {
                    aLink.addClass('jqTransformChecked');
                } else {
                    aLink.removeClass('jqTransformChecked');
                }
                return true;
            });
            // Click Handler, trigger the click and change event on the input
            aLink.on('click', function (e) {
                //do nothing if the original input is disabled
                if ($input.attr('disabled')) {
                    return false;
                }
                //trigger the envents on the input object
                $input.trigger('click').trigger("change");
                return false;
            });
            aLink.on('focus', function (e) {
                $(e.target).addClass('jqTransformFocus');
            });
            aLink.on('keydown', function (e) {
                e.preventDefault();

                if (e.key === 'Enter' || e.keyCode === 32) {
                    $(e.target).trigger('click');
                } else if (e.shiftKey) {
                    if (e.key === 'Tab') {
                        $(e.target).removeClass('jqTransformFocus');
                        tabIndexTransformElement($(e.target).parents('.jqTransformCheckboxWrapper').find('input:checkbox').get(0).tabIndex, true);
                    }
                } else if (e.key === 'Tab') {
                    $(e.target).removeClass('jqTransformFocus');
                    tabIndexTransformElement($(e.target).parents('.jqTransformCheckboxWrapper').find('input:checkbox').get(0).tabIndex);
                }
            });
            // set the default state
            if (this.checked) {
                aLink.addClass('jqTransformChecked');
            }
        });
    };

    /***************************
      Radio Buttons
     ***************************/
    $.fn.jqTransRadio = function () {
        return this.each(function (index, elements) {
            if ($(this).hasClass('ignore') === true) {
                return;
            }
            if ($(this).hasClass('jqTransformHidden')) {
                return;
            }

            var $input = $(this),
                inputSelf = this,
                oLabel = jqTransformGetLabel($input),
                aLink;

            if (oLabel !== false) {
                if (oLabel.attr('for') === '' || oLabel.attr('for') === undefined) {
                    oLabel.click(function (e) {
                        aLink.trigger('click');
                    });
                } else {
                    oLabel.click(function (e) {
                        aLink.trigger('click', ['parent']);
                    });
                }
            }

            aLink = $('<a href="#" class="jqTransformRadio" rel="' + this.name + '"></a>');
            $input.addClass('jqTransformHidden').wrap('<span class="jqTransformRadioWrapper"></span>').parent().prepend(aLink);

            if ($input.attr('tabindex')) {
                jqTransformTabIndex(elements);
            }
            $input.on('change', function () {
                if (inputSelf.checked) {
                    aLink.addClass('jqTransformChecked');
                } else {
                    aLink.removeClass('jqTransformChecked');
                }
            });
            // Click Handler
            aLink.click(function (e, t) {
                if ($input.attr('disabled')) {
                    return false;
                }
                if (t === 'parent') {
                    $input.trigger('change');
                } else {
                    $input.trigger('click').trigger('change');
                }

                // uncheck all others of same name input radio elements
                $('input[name="' + $input.attr('name') + '"]', inputSelf.form).not($input).each(function () {
                    if ($(this).attr('type') === 'radio') {
                        $(this).trigger('change');
                    }
                });

                return false;
            });
            aLink.on('focus', function (e) {
                $(e.target).addClass('jqTransformFocus');
            });
            aLink.on('keydown', function (e) {
                e.preventDefault();
                if (e.key === 'Enter' || e.keyCode === 32) {
                    $(e.target).trigger('click');
                } else if (e.shiftKey) {
                    if (e.key === 'Tab') {
                        $(e.target).removeClass('jqTransformFocus');
                        tabIndexTransformElement($(e.target).parents('.jqTransformRadioWrapper').find('input:radio').get(0).tabIndex, true);
                    }
                } else if (e.key === 'Tab') {
                    $(e.target).removeClass('jqTransformFocus');
                    tabIndexTransformElement($(e.target).parents('.jqTransformRadioWrapper').find('input:radio').get(0).tabIndex);
                }
            });
            // set the default state
            if (inputSelf.checked) {
                aLink.addClass('jqTransformChecked');
            }

        });
    };

    /***************************
      TextArea
     ***************************/
    $.fn.jqTransTextarea = function () {
        return this.each(function (index, elements) {
            var textarea = $(this),
                oLabel,
                strTable,
                oTable;

            if (textarea.hasClass('jqtransformdone')) {
                return;
            }
            textarea.addClass('jqtransformdone');

            oLabel = jqTransformGetLabel(textarea);
            if (oLabel !== false) {
                oLabel.click(function () {
                    textarea.focus();
                });
            }

            strTable = '<table cellspacing="0" cellpadding="0" border="0" class="jqTransformTextarea">';
            strTable += '<tr><td id="jqTransformTextarea-tl"></td><td id="jqTransformTextarea-tm"></td><td id="jqTransformTextarea-tr"></td></tr>';
            strTable += '<tr><td id="jqTransformTextarea-ml">&nbsp;</td><td id="jqTransformTextarea-mm"><div></div></td><td id="jqTransformTextarea-mr">&nbsp;</td></tr>';
            strTable += '<tr><td id="jqTransformTextarea-bl"></td><td id="jqTransformTextarea-bm"></td><td id="jqTransformTextarea-br"></td></tr>';
            strTable += '</table>';
            oTable = $(strTable)
                .insertAfter(textarea)
                .hover(function () {
                    if (!oTable.hasClass('jqTransformTextarea-focus')) {
                        oTable.addClass('jqTransformTextarea-hover');
                    }
                }, function () {
                    oTable.removeClass('jqTransformTextarea-hover');
                });
            if (textarea.attr('tabindex')) {
                jqTransformTabIndex(elements);
            }
            textarea
                .focus(function () {
                    oTable.removeClass('jqTransformTextarea-hover').addClass('jqTransformTextarea-focus');
                })
                .blur(function () {
                    oTable.removeClass('jqTransformTextarea-focus');
                })
                .appendTo($('#jqTransformTextarea-mm div', oTable));
            this.oTable = oTable;
            // if($.browser.safari){
            //  $('#jqTransformTextarea-mm',oTable)
            //      .addClass('jqTransformSafariTextarea')
            //      .find('div')
            //          .css('height',textarea.height())
            //          .css('width',textarea.width())
            //  ;
            // }
        });
    };

    /***************************
      Select
     ***************************/
    $.fn.jqTransSelect = function (bool) {
        if (bool) {
            var zindex = $(this).css('zIndex');
            $(this).removeClass('jqTransformHidden');
            $(this).parents('.jqTransformSelectWrapper').find('> div').remove();
            $(this).parents('.jqTransformSelectWrapper').find('> ul').remove();
            $(this).unwrap();
        }
        return this.each(function (index, elements) {
            var $select = $(this),
                oLabel,
                $wrapper,
                $ul,
                oLinkOpen,
                iSelectWidth,
                oSpan,
                newWidth,
                iSelectHeight;
            if ($select.hasClass('jqTransformHidden')) {
                return;
            }
            if ($select.attr('multiple')) {
                return;
            }
            if ($select.hasClass('ignore')) {
                return;
            }
            oLabel = jqTransformGetLabel($select);
            /* First thing we do is Wrap it */
            $wrapper = $select
                .addClass('jqTransformHidden')
                .wrap('<div class="jqTransformSelectWrapper"></div>')
                .parent()
                .css({
                    zIndex: 10 - index
                });
            if (bool) {
                $wrapper.css('zIndex', zindex);
            }
            if ($select.attr('disabled')) {
                $wrapper.addClass('jqTransformDisabled');
            }

            /* Now add the html for the select */
            $wrapper.prepend('<div><span></span><a href="#" class="jqTransformSelectOpen"></a></div><ul></ul>');
            $ul = $('ul', $wrapper).css('width', $select.width()).hide();
            /* Now we add the options */
            $('option', this).each(function (i) {
                if (!$(this).hasClass('ignore')) {
                    var oLi = $('<li><a href="#" index="' + i + '" data-val="' + $(this).val() + '">' + $(this).html() + '</a></li>');
                    $ul.append(oLi);
                }
            });

            /* Add click handler to the a */
            $ul.find('a').click(function () {

                $('a.selected', $wrapper).removeClass('selected');
                $(this).addClass('selected');
                /* Fire the onchange event */

                if ($select[0].selectedIndex !== $(this).attr('index')) {
                    $select[0].selectedIndex = $(this).attr('index');
                    $($select[0]).trigger('change');
                    if ($select[0].selectedIndex !== 0) {
                        $('span:eq(0)', $wrapper).removeClass('jqTransformSelectOptionDefault');
                    } else {
                        $('span:eq(0)', $wrapper).addClass('jqTransformSelectOptionDefault');
                    }
                }
                $select[0].selectedIndex = $(this).attr('index');
                $('span:eq(0)', $wrapper).html($(this).html());
                $ul.hide();
                return false;
            });
            $ul.find('a').keydown(function (e) {
                e.preventDefault();
                var $this = $(e.target);
                if (e.key === 'ArrowUp') {
                    if ($this.parent('li').prev().length > 0) {
                        $this.parent('li').prev().find('a').trigger('focus');
                        $(':focus');
                    }
                } else if (e.key === 'ArrowDown') {
                    if ($this.parent('li').next().length > 0) {
                        $this.parent('li').next().find('a').trigger('focus');
                    }
                } else if (e.key === 'Enter') {
                    $this.trigger('click').trigger('blur');
                    tabIndexTransformElement($this.parents('.jqTransformSelectWrapper').find('select').get(0).tabIndex);
                } else if (e.shiftKey) {
                    if (e.key === 'Tab') {
                        tabIndexTransformElement($this.parents('.jqTransformSelectWrapper').find('select').get(0).tabIndex, true);
                    }
                } else if (e.key === 'Tab') {
                    tabIndexTransformElement($this.parents('.jqTransformSelectWrapper').find('select').get(0).tabIndex);
                }
            });

            /* Set the default */
            if (this.selectedIndex === 0) {
                //console.info('option selected has default atribute?: ' + $(this).find('option:eq(' + (this.selectedIndex) + ')').attr('default'));
                //console.info('option selected not has undefined default atribute?: ' + ($(this).find('option:eq(' + (this.selectedIndex) + ')').attr('default') !== undefined));
                if ($(this).find('option:eq(' + (this.selectedIndex) + ')').attr('default') !== undefined) {
                    //i console.info('option selected not has default atribute value default?: ' + ($(this).find('option:eq(' + (this.selectedIndex) + ')').attr('default') !== 'default'));
                    if ($(this).find('option').attr('default') !== 'default') {
                        $('span:eq(0)', $wrapper).addClass('jqTransformSelectOptionDefault').html($('option:eq(0)', $select).html());
                        $('a:eq(' + (this.selectedIndex) + ')', $ul).click();
                    } else {
                        $('span:eq(0)', $wrapper).addClass('jqTransformSelectOptionDefault').html($('option:eq(0)', $select).html());
                        $('a:eq(' + (this.selectedIndex) + ')', $ul).click();
                    }
                } else {
                    $('a:eq(' + (this.selectedIndex) + ')', $ul).click();
                }
            } else {
                $('a:eq(' + this.selectedIndex + ')', $ul).click();
            }

            /* Set the event span*/
            $('span:first', $wrapper).on('click', function () {
                $("a.jqTransformSelectOpen", $wrapper).trigger('click');
                $wrapper.find('ul li a.selected').trigger('focus');
            });

            if (oLabel !== false) {
                oLabel.on('click', function () {
                    $("a.jqTransformSelectOpen", $wrapper).trigger('click');
                    $wrapper.find('ul li a.selected').trigger('focus');
                });
            }
            this.oLabel = oLabel;

            /* Apply the click handler to the Open */
            oLinkOpen = $('a.jqTransformSelectOpen', $wrapper).on('click', function () {
                //Check if box is already open to still allow toggle, but close all other selects
                if ($ul.css('display') === 'none') {
                    jqTransformHideSelect();
                }
                if ($select.attr('disabled')) {
                    return false;
                }

                $ul.slideToggle('fast', function () {
                    var offSet = ($('a.selected', $ul).offset().top - $ul.offset().top);
                    $ul.animate({
                        scrollTop: offSet
                    });
                });
                return false;
            });

            // Set the new width
            iSelectWidth = $select.outerWidth();
            oSpan = $('span:first', $wrapper);
            newWidth = (iSelectWidth > oSpan.innerWidth()) ? iSelectWidth + oLinkOpen.outerWidth() : $wrapper.width();
            $wrapper.css('width', newWidth);
            $ul.css('width', newWidth - 2);
            oSpan.css({
                width: iSelectWidth
            });

            // Calculate the height if necessary, less elements that the default height
            //show the ul to calculate the block, if ul is not displayed li height value is 0
            $ul.css({
                display: 'block',
                visibility: 'hidden'
            });
            iSelectHeight = ($('li', $ul).length) * ($('li:first', $ul).height()); //+1 else bug ff
            if (iSelectHeight < $ul.height()) {
                $ul.css({
                    height: iSelectHeight,
                    'overflow': 'hidden'
                }); //hidden else bug with ff
            }
            $ul.css({
                display: 'none',
                visibility: 'visible'
            });
        });
    };

    $.fn.jqTransform = function (options) {
        //var opt = $.extend({}, defaultOptions, options);

        /* each form */
        return this.each(function () {
            var selfForm = $(this);
            if (selfForm.hasClass('jqtransformdone')) {
                return;
            }
            //TABINDEX = selfForm.find('[tabindex]').length;
            selfForm.find('[tabindex]').each(function (index, el) {
                if (TABINDEXMAX < el.tabIndex) {
                    TABINDEXMAX = el.tabIndex;
                }
            });

            selfForm.addClass('jqtransformdone');

            $('input:submit, input:reset, input[type="button"]', this).jqTransInputButton();
            $('input:text, input:password, input[type="mail"]', this).jqTransInputText();
            $('input[type="number"]').jqTransInputNumber();
            $('input:checkbox', this).jqTransCheckBox();
            $('input:radio', this).jqTransRadio();
            $('textarea', this).jqTransTextarea();

            if ($('select', this).jqTransSelect().length > 0) {
                jqTransformAddDocumentListener();
            }
            selfForm.bind('reset', function () {
                var action = function () {
                    jqTransformReset(this);
                };
                window.setTimeout(action, 10);
            });

            //preloading dont needed anymore since normal, focus and hover image are the same one
            /*if(opt.preloadImg && !jqTransformImgPreloaded){
                jqTransformImgPreloaded = true;
                var oInputText = $('input:text:first', selfForm);
                if(oInputText.length > 0){
                    //pour ie on eleve les ""
                    var strWrapperImgUrl = oInputText.get(0).wrapper.css('background-image');
                    jqTransformPreloadHoverFocusImg(strWrapperImgUrl);
                    var strInnerImgUrl = $('div.jqTransformInputInner',$(oInputText.get(0).wrapper)).css('background-image');
                    jqTransformPreloadHoverFocusImg(strInnerImgUrl);
                }

                var oTextarea = $('textarea',selfForm);
                if(oTextarea.length > 0){
                    var oTable = oTextarea.get(0).oTable;
                    $('td',oTable).each(function(){
                        var strImgBack = $(this).css('background-image');
                        jqTransformPreloadHoverFocusImg(strImgBack);
                    });
                }
            }*/
        }); /* End Form each */
    }; /* End the Plugin */

}(jQuery));