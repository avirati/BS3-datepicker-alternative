//Date Format - Taken from https://github.com/jacwright/date.format
(function() {

    Date.shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    Date.longMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    Date.shortDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    Date.longDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // defining patterns
    var replaceChars = {
        // Day
        d: function() { return (this.getDate() < 10 ? '0' : '') + this.getDate(); },
        D: function() { return Date.shortDays[this.getDay()]; },
        j: function() { return this.getDate(); },
        l: function() { return Date.longDays[this.getDay()]; },
        N: function() { return (this.getDay() == 0 ? 7 : this.getDay()); },
        S: function() { return (this.getDate() % 10 == 1 && this.getDate() != 11 ? 'st' : (this.getDate() % 10 == 2 && this.getDate() != 12 ? 'nd' : (this.getDate() % 10 == 3 && this.getDate() != 13 ? 'rd' : 'th'))); },
        w: function() { return this.getDay(); },
        z: function() { var d = new Date(this.getFullYear(),0,1); return Math.ceil((this - d) / 86400000); }, // Fixed now
        // Week
        W: function() {
            var target = new Date(this.valueOf());
            var dayNr = (this.getDay() + 6) % 7;
            target.setDate(target.getDate() - dayNr + 3);
            var firstThursday = target.valueOf();
            target.setMonth(0, 1);
            if (target.getDay() !== 4) {
                target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
            }
            return 1 + Math.ceil((firstThursday - target) / 604800000);
        },
        // Month
        F: function() { return Date.longMonths[this.getMonth()]; },
        m: function() { return (this.getMonth() < 9 ? '0' : '') + (this.getMonth() + 1); },
        M: function() { return Date.shortMonths[this.getMonth()]; },
        n: function() { return this.getMonth() + 1; },
        t: function() {
            var year = this.getFullYear(), nextMonth = this.getMonth() + 1;
            if (nextMonth === 12) {
                year = year++;
                nextMonth = 0;
            }
            return new Date(year, nextMonth, 0).getDate();
        },
        // Year
        L: function() { var year = this.getFullYear(); return (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)); },   // Fixed now
        o: function() { var d  = new Date(this.valueOf());  d.setDate(d.getDate() - ((this.getDay() + 6) % 7) + 3); return d.getFullYear();}, //Fixed now
        Y: function() { return this.getFullYear(); },
        y: function() { return ('' + this.getFullYear()).substr(2); },
        // Time
        a: function() { return this.getHours() < 12 ? 'am' : 'pm'; },
        A: function() { return this.getHours() < 12 ? 'AM' : 'PM'; },
        B: function() { return Math.floor((((this.getUTCHours() + 1) % 24) + this.getUTCMinutes() / 60 + this.getUTCSeconds() / 3600) * 1000 / 24); }, // Fixed now
        g: function() { return this.getHours() % 12 || 12; },
        G: function() { return this.getHours(); },
        h: function() { return ((this.getHours() % 12 || 12) < 10 ? '0' : '') + (this.getHours() % 12 || 12); },
        H: function() { return (this.getHours() < 10 ? '0' : '') + this.getHours(); },
        i: function() { return (this.getMinutes() < 10 ? '0' : '') + this.getMinutes(); },
        s: function() { return (this.getSeconds() < 10 ? '0' : '') + this.getSeconds(); },
        u: function() { var m = this.getMilliseconds(); return (m < 10 ? '00' : (m < 100 ?
    '0' : '')) + m; },
        // Timezone
        e: function() { return /\((.*)\)/.exec(new Date().toString())[1]; },
        I: function() {
            var DST = null;
                for (var i = 0; i < 12; ++i) {
                        var d = new Date(this.getFullYear(), i, 1);
                        var offset = d.getTimezoneOffset();

                        if (DST === null) DST = offset;
                        else if (offset < DST) { DST = offset; break; }                     else if (offset > DST) break;
                }
                return (this.getTimezoneOffset() == DST) | 0;
            },
        O: function() { return (-this.getTimezoneOffset() < 0 ? '-' : '+') + (Math.abs(this.getTimezoneOffset() / 60) < 10 ? '0' : '') + (Math.abs(this.getTimezoneOffset() / 60)) + '00'; },
        P: function() { return (-this.getTimezoneOffset() < 0 ? '-' : '+') + (Math.abs(this.getTimezoneOffset() / 60) < 10 ? '0' : '') + (Math.abs(this.getTimezoneOffset() / 60)) + ':00'; }, // Fixed now
        T: function() { return this.toTimeString().replace(/^.+ \(?([^\)]+)\)?$/, '$1'); },
        Z: function() { return -this.getTimezoneOffset() * 60; },
        // Full Date/Time
        c: function() { return this.format("Y-m-d\\TH:i:sP"); }, // Fixed now
        r: function() { return this.toString(); },
        U: function() { return this.getTime() / 1000; }
    };

    // Simulates PHP's date function
    Date.prototype.format = function(format) {
        var date = this;
        return format.replace(/(\\?)(.)/g, function(_, esc, chr) {
            return (esc === '' && replaceChars[chr]) ? replaceChars[chr].call(date) : chr;
        });
    };

}).call(this);
//END Date Format - Taken from https://github.com/jacwright/date.format

var Datepicker = function(el, options){
    var activator = document.getElementById(el);
    
    var container = document.createElement('DIV');
    container.className = 'datepicker';
    container.style.display="none";
    activator.parentNode.appendChild(container);

    options = options || {};
    options.format = options.format || 'd M Y';

    var days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var monthnames = Date.longMonths;
    var daynames = Date.shortDays;
    var today = new Date();
    var thisDay = today.getDate();
    var thisMonth = today.getMonth();
    var thisYear = 1900 + today.getYear();

    var generateHTML = function (Month, Year) {
        var html = "";
        firstDay = new Date(Year, Month, 1);
        startDay = firstDay.getDay();

        if (((Year % 4 == 0) && (Year % 100 != 0)) || (Year % 400 == 0)) days[1] = 29;
        else days[1] = 28;

        html += "<div class='datepicker-header'> \
                    <div class='prev-arrow" + (thisMonth >= Month ? ' disabled' : '') + "'></div> \
                    <div class='month-year'>" + monthnames[Month] + " " + Year + "</div> \
                    <div class='next-arrow'></div> \
                </div>"

        html += "<table class='datepicker-body'> \
                    <thead class='daynames'> \
                    <tr>";

        for (i = 0; i < 7; i++) {
            html += "<td class='day'>" + daynames[i] + "</td>";
        }

        html += "</tr></thead><tbody><tr>";

        var column = 0;
        var lastMonth = Month - 1;
        if (lastMonth == -1) lastMonth = 11;
        for (i = 0; i < startDay; i++) {
            html += "<td class='prev-month'></td>";
            column++;
        }

        for (i = 1; i <= days[Month]; i++) {
            var className = "";
            if ((i == thisDay) && (Month == thisMonth) && (Year == thisYear)) className += " today";

            if (!(Year > thisYear || (Year == thisYear && Month > thisMonth) || (Year == thisYear && Month == thisMonth && i >= thisDay))) className += " disabled";
            else className += " valid";

            html += "<td class='" + className + "'><span>" + i + "</span></td>";

            column++;
            if (column == 7) {
                html += "</tr><tr>";
                column = 0;
            }
        }

        html += "</tr></tbody></table>";
        container.innerHTML = html;

        var prev_arrows = document.querySelectorAll('.prev-arrow');
        var next_arrows = document.querySelectorAll('.next-arrow');

        var nextMonthRender = function(e) {
            if(options.month > 10) {
                options.month = 0;
                options.year += 1;
                generateHTML(options.month, options.year);
            }
            else {
                options.month += 1;
                generateHTML(options.month, options.year);
            }
        }

        var prevMonthRender = function(e) {
            if(options.month < 1) {
                options.month = 11;
                options.year -= 1;
                generateHTML(options.month, options.year);
            }
            else {
                options.month -= 1;
                generateHTML(options.month, options.year);
            }
        }

        for(var i = 0, iL = prev_arrows.length; i < iL; i++) {
            prev_arrows[i].onclick = prevMonthRender;
        }

        for(var i = 0, iL = next_arrows.length; i < iL; i++) {
            next_arrows[i].onclick = nextMonthRender;
        }

        var valid_dates = document.querySelectorAll('.valid');

        var updateActivator = function(d, m, y, e) {
            activator.value = new Date(y, m, d).format(options.format);
            container.style.display = "none";
        }

        for(var i = 0, iL = valid_dates.length; i < iL; i++) {
            var date = valid_dates[i].childNodes[0].innerHTML;
            valid_dates[i].onclick = updateActivator.bind(this, date, Month, Year, event);
        }
    };

    document.body.addEventListener("click", function(){
        var datepickers = document.querySelectorAll(".datepicker")
        for (var i = 0, iL = datepickers.length; i < iL; i++) {
            datepickers[i].style.display = "none";
        };
    })

    activator.onclick = function(e) {
        e.stopPropagation();
        container.style.display = "block";
        container.style.top = activator.offsetHeight + 10;
        container.style.left = 0;
    }

    container.onclick = function(e) {
        e.stopPropagation();
    }

    options.month = options.month || thisMonth;
    options.year = options.year || thisYear;

    generateHTML(options.month, options.year);
}