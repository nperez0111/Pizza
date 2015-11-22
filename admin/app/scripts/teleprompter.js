var Tele = Ractive.extend({
    oninit: function() {},
    alert: function(str) {
        var other = (str.str || str) + "";
        $(str.el || '#alert').slideDown().html("<a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a><h3>" + (other) + "</h3><p>Check internet connection Or Contact Support.</p>");
        return true;
    }
});
