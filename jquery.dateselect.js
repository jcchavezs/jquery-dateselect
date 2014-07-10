/*
 *  $ Dateselect 1.0.3
 *
 *  Copyright (c) 2011 Fractalia - Applications Lab (https://bitbucket.org/fractalia/jquery-dateselect)
 *  Dual licensed under the MIT License (http://www.opensource.org/licenses/mit-license.php)
 *  and GPL ( http://www.gnu.org/copyleft/gpl.html )
 *
 *  http://fractalia.pe/plugins/jquery/dateselect
 *
 *  Depends:
 *    jquery.js
 **/

(function($) {
    $.fn.dateselect = function(a) {
        a = $.extend({}, $.fn.dateselect.defaults, a);

        var monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        function isLeap(y) {
            return ((y % 4 === 0) && ((y % 100 !== 0) || (y % 400 === 0))) ? true : false;
        }

        function pad10(n) {
            n = parseInt(n);
            return (n < 10) ? '0' + n.toString() : n;
        }

        function uniqid(prefix) {
            /* based on php.js' uniqid function */
            var retId;
            var formatSeed = function(seed, reqWidth) {
                seed = parseInt(seed, 10).toString(16);
                if (reqWidth < seed.length) {
                    return seed.slice(seed.length - reqWidth);
                }
                if (reqWidth > seed.length) {
                    return Array(1 + (reqWidth - seed.length)).join('0') + seed;
                }
                return seed;
            };

            if (!this.php_js) {
                this.php_js = {};
            }

            if (!this.php_js.uniqidSeed) {
                this.php_js.uniqidSeed = Math.floor(Math.random() * 0x75bcd15);
            }
            this.php_js.uniqidSeed++;

            retId = prefix;
            retId += formatSeed(parseInt(new Date().getTime() / 1000, 10), 8);
            retId += formatSeed(this.php_js.uniqidSeed, 5);
            return retId;
        }

        this.each(function(i, e) {
            $(e).addClass('dateselect-input');

            if (e.id === '') {
                e.id = uniqid('ds');
            }

            if (typeof e.tabindex === 'undefined') {
                e.tabindex = 0;
            }

            if ($('#dateselect-' + e.id).length > 0) {
                return;
            }

            var matches;

            var notEmpty = (e.value === '' || e.value === '0000-00-00' || (null === (matches = e.value.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}/)))) ? false : true;

            if (notEmpty) {
                var val = matches[0].split('-'),
                        y = val[0],
                        m = val[1],
                        d = val[2]
                        ;
            }

            $(e).before('<div id="dateselect-' + e.id + '" class="dateselect ' + a.cssClass + '" />').appendTo('#dateselect-' + e.id).hide();

            $.each(a.order, function(i, v) {
                $('div#dateselect-' + e.id).append('<select id="' + e.id + '-' + v + '" class="dateselect-selector dateselect-' + v + ' ' + a.cssClassSelector + '" style="width:auto!important; min-width:0 !important;" tabindex="' + e.tabindex + '">' + (!notEmpty ? '<option value="">' + a.selectOne[v] + '</option>' : '') + '</select>&nbsp;');
            });

            var time = new Date();

            var cy = (time.getYear() > 1900) ? 0 : 1900;

            if (a.minYear < 1900) {
                a.minYear = cy + time.getYear() + a.minYear;
            }

            if (a.maxYear < 1900) {
                a.maxYear = cy + time.getYear() + a.maxYear;
            }

            for (i = a.maxYear; i >= a.minYear; i--) {
                $('select#' + e.id + '-year').append('<option ' + ((notEmpty && i == y) ? 'selected="selected"' : '') + ' value="' + i + '">' + i + '</option>');
            }

            $.each(a.monthNames, function(i, v) {
                $('select#' + e.id + '-month').append('<option ' + ((notEmpty && i + 1 == m) ? 'selected="selected"' : '') + ' value="' + (i + 1) + '">' + v + '</option>');
            });

            for (i = 1; i <= 31; i++) {
                $('select#' + e.id + '-day').append('<option ' + ((notEmpty && i == d) ? 'selected="selected"' : '') + ' class="dateselect-numeric" value="' + i + '">' + pad10(i) + '</option>');
            }

            $('body').on('change', 'select.dateselect-selector', function() {
                var ds = $(this);
                
                if (ds.val() !== '') {
                    ds.find('option[value=""]').remove();
                }

                var csd = ds.parents('.dateselect:first'),
                        m = csd.find('select.dateselect-month').val(),
                        y = csd.find('select.dateselect-year').val(),
                        d = csd.find('select.dateselect-day').val();

                var i;

                if (!ds.hasClass('dateselect-day')) {
                    var mm = Math.max(1, m);
                    var max = ((mm === 2) && (isLeap(y))) ? monthDays[mm - 1] + 1 : monthDays[mm - 1];

                    csd.find('select.dateselect-day option.dateselect-numeric').remove();

                    d = Math.min(d, max);

                    for (i = 1; i <= max; i++) {
                        csd.find('select.dateselect-day').append('<option class="dateselect-numeric" ' + ((d == i) ? 'selected="selected"' : '') + ' value="' + i + '">' + pad10(i) + '</option>');
                    }
                }

                if ((y !== '') && (m !== '') && (d !== '')) {
                    csd.find('.dateselect-input').val(pad10(y) + '-' + pad10(m) + '-' + pad10(d));
                }
            });
        });

        return $(this);
    };

    $.fn.dateselect.defaults = {
        cssClass: '',
        cssClassSelector: '',
        maxYear: 0,
        minYear: 1900,
        monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        order: ['day', 'month', 'year'],
        selectOne: {'day': 'Day', 'month':'Month', 'year':'Year'}
    };
})(jQuery);