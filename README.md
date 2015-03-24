# jQuery Dateselect
jQuery plugin for generating a date selector in the Ruby on Rails scaffolding style.

Installation 
-----------
Just include jquery.dateselect.js and declare the elements you want to convert into date selectors.

Options
-----------
+ **cssClass**
The additional class for the container of the date selectors.
+ **cssClassSelector**
The additional class for each selector.
+ **maxYear**
The max year of the date selector. If the value is greater than 1900, then max year will be the maxYear value otherwise, the max will be the sum of the current year and the maxYear value.
**Default: 0**
+ **minYear**
The max year of the date selector. If the value is greater than 1900, then min year will be the minYear value otherwise, the max will be the sum of the current year and the minYear value.
**Default: -100**
+ **monthNames**
An array containing the names of the months.
**Default: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']**
+ **order**
An array containing the order of the components of the date selectors.
**Default:['day', 'month', 'year']**
+ **selectOne**
The placeholder options for the date selectors.
**Default: {'day': 'Day', 'month': 'Month', 'year': 'Year'}**
+ **callback**
The function wich is being called on a successfully creation of the date selectors.
**Default: none **