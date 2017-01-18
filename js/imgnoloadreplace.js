(function ($) {
    $.fn.fixBroken = function (bool) {
        var ieversion;
        if (/Trident/.test(navigator.userAgent)) {
            ieversion = true;
        }
        return this.each(function (index, element) {


            function testImage(URL) {
                var tester = new Image();
                tester.onerror = imageNotFound;
                tester.src = URL;
            }

            function imageNotFound(e) {
                if (e.target.complete === false) {
                    if (($(element).attr('width') || element.width || element.naturalWidth) === 0 || ($(element).attr('height') || $(element).height() || element.naturalHeight) === 0) {
                        element.src = "http://placehold.it/" + 30 + "x" + 30;
                    } else {
                        element.src = "http://placehold.it/" + ($(element).attr('width') || element.width || element.naturalWidth()) + "x" + (element.naturalHeight || $(element).attr('height') || $(element).height());
                    }
                } else {
                    element.src = element.src;
                }
            }
            if (ieversion) {
                testImage(element.src);
            } else if (bool) {
                $(element).trigger('error');
            } else {
                $(element).on('error', function (e) {
                    if (!this.complete || typeof this.naturalWidth === "undefined" || this.naturalWidth === 0) {
                        if (($(this).attr('width') || this.width || this.naturalWidth) === 0 || ($(this).attr('height') || $(this).height() || this.naturalHeight) === 0) {
                            this.src = "http://placehold.it/" + 30 + "x" + 30;
                        } else {
                            this.src = "http://placehold.it/" + ($(this).attr('width') || this.width) + "x" + ($(this).attr('height') || $(this).height());
                        }
                    }
                });
            }
        });
    };
}(jQuery));