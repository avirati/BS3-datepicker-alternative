var Datepicker = function(el, options){
    var activator = document.getElementById(el);
    options = options || {};
    
    var container = document.createElement('DIV');
    container.className = 'datepicker';
    container.style.display="none";
    activator.parentNode.appendChild(container);

    var options = options || {};

    var days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var monthnames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var daynames = new Array("Su", "Mo", "Tu", "We", "Th", "Fr", "Sa");
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

        var nextMonthRender = function() {
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

        var prevMonthRender = function() {
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

        var updateActivator = function(d, m, y) {
            activator.value = new Date(y, m, d);
            container.style.display = "none";
        }

        for(var i = 0, iL = valid_dates.length; i < iL; i++) {
            var date = valid_dates[i].childNodes[0].innerHTML;
            valid_dates[i].onclick = updateActivator.bind(this, date, Month, Year);
        }
    };

    activator.onclick = function(){
        container.style.display = "block";
        container.style.top = activator.offsetHeight + 10;
        container.style.left = 0;
    }

    options.month = options.month || thisMonth;
    options.year = options.year || thisYear;

    generateHTML(options.month, options.year);
}