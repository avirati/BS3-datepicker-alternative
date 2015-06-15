var Datepicker = function(el, options){
    var container = document.getElementById(el);

    var generateHTML = function (Month, Year) {
        var days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        var monthnames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var daynames = new Array("Su", "Mo", "Tu", "We", "Th", "Fr", "Sa");
        var today = new Date();
        var thisDay = today.getDate();
        var thisMonth = today.getMonth();
        var thisYear = 1900 + today.getYear();


        var html = "";
        firstDay = new Date(Year, Month, 1);
        startDay = firstDay.getDay();

        if (((Year % 4 == 0) && (Year % 100 != 0)) || (Year % 400 == 0)) days[1] = 29;
        else days[1] = 28;

        html += "<div class='datepicker'>";

        html += "<div class='datepicker-header'> \
                    " + monthnames[Month] + " " + Year + " \
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

            if (!(Year > thisYear || (Year == thisYear && Month > thisMonth) || (Year == thisYear && Month == thisMonth && i >= thisDay))) className += " date-passed";

            html += "<td class='" + className + "'><span>" + i + "</span></td>";

            column++;
            if (column == 7) {
                html += "</tr><tr>";
                column = 0;
            }
        }

        html += "</tr></tbody></table></div>";
        container.innerHTML = html;
    };

    generateHTML(options.month, options.year);
}