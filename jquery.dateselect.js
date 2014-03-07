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
    $.fn.dateselect = function(opts) {
        opts = $.extend({}, $.fn.dateselect.defaults, opts);

        var monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        function isLeap(y) {
            return ((y % 4 === 0) && ((y % 100 !== 0) || (y % 400 === 0))) ? true : false;
        }

        function pad10(n) {
            n = parseInt(n);
            return (n < 10) ? '0' + n.toString() : n;
        }

        function uniqid() {
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

            retId = 'ds';
            retId += formatSeed(parseInt(new Date().getTime() / 1000, 10), 8);
            retId += formatSeed(this.php_js.uniqidSeed, 5);
            return retId;
        }

        this.each(function(i, e) {
            $(e).addClass('dateselect-input').hide();

            if (e.id === '') {
                e.id = uniqid();
            }

            if ($('#dateselect-' + e.id).length === 0) {
                var val = $(e).val().split('-'), j,
                        y = val[0],
                        m = val[1],
                        d = val[2],
                        $container,
                        $selectors = [],
                        time = new Date();

                $container = $('<div />', {
                    id: 'dateselect-' + e.id,
                    class: 'dateselect ' + opts.cssClass
                });

                var hasValidValue = (e.value === '' || e.value === '0000-00-00') ? true : false;

                var attrs = {
                    'style': "width: auto !important; min-width: 0 !important",
                    'tabindex': $(e).attr('tabindex')
                };

                $.each(opts.order, function(j, selector) {
                    $.extend(attrs, {
                        'id': e.id + '-' + selector,
                        'class': 'dateselect-selector dateselect-' + selector + ' ' + opts.cssClassSelector
                    });

                    if (hasValidValue) {
                        attrs.html = '<option class="dateselect-empty" value="">' + opts.selectOne[j] + '</option>';
                    }

                    $selectors[selector] = $('<select>', attrs).appendTo($container).after('&nbsp;');
                });

                var currentYear = (time.getYear() > 1900) ? 0 : 1900;

                if (opts.minYear < 1900) {
                    opts.minYear = currentYear + time.getYear() + opts.minYear;
                }

                if (opts.maxYear < 1900) {
                    opts.maxYear = currentYear + time.getYear() + opts.maxYear;
                }

                for (j = opts.maxYear; j >= opts.minYear; j--) {
                    $selectors['year'].append('<option ' + ((j == y) ? 'selected="selected"' : '') + ' value="' + j + '">' + j + '</option>');
                }

                for (j in opts.monthNames) {
                    $selectors['month'].append('<option ' + ((j + 1 == m) ? 'selected="selected"' : '') + ' value="' + (parseInt(j) + 1) + '">' + opts.monthNames[j] + '</option>');
                }

                for (j = 1; j <= 31; j++) {
                    $selectors['day'].append('<option ' + ((j == d) ? 'selected="selected"' : '') + ' value="' + j + '">' + pad10(j) + '</option>');
                }

                $(e).hide().before($container);
            }

            $('select.dateselect-selector').on('change', function(evt) {
                var $selector = $(this);

                if ($selector.val() !== '') {
                    $selector.find('option.dateselect-empty').remove();
                }

                var
                        month = $container.find('select.dateselect-month').val(),
                        year = $container.find('select.dateselect-year').val(),
                        day = $container.find('select.dateselect-day').val();

                if (!$selector.hasClass('dateselect-day')) {
                    var mm = Math.max(1, month);

                    var max = ((mm === 2) && (isLeap(year))) ? monthDays[mm - 1] + 1 : monthDays[mm - 1];

                    $container.find('select.dateselect-day option.dateselect-numeric').remove();

                    day = Math.min(day, max);

                    for (var i = 1; i <= max; i++) {
                        $container.find('select.dateselect-day').append('<option class="dateselect-numeric" ' + ((day == i) ? 'selected="selected"' : '') + ' value="' + i + '">' + pad10(i) + '</option>');
                    }
                }

                if ((year !== '') && (month !== '') && (day !== '')) {
                    $container.find('.dateselect-input').val(pad10(year) + '-' + pad10(month) + '-' + pad10(day));
                    opts.callback(new Date(year, month, day));
                } else {
                    $container.find('.dateselect-input').val('');
                    opts.callback(false);
                }

                $container.find('.dateselect-input').bind('focus');
            });
        });
    };

    $.fn.dateselect.defaults = {
        cssClass: '',
        cssClassSelector: '',
        maxYear: 0,
        minYear: -100,
        monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        order: ['day', 'month', 'year'],
        selectOne: ['Day', 'Month', 'Year'],
        callback: function(value) {}
    };
})(jQuery);