var table;
$.ajax({
    url: "http://localhost:9000/table.html",
    dataType: "html"
}).then(function (template) {
    table = new Table({
        // The `el` option can be a node, an ID, or a CSS selector.
        el: '#container',
        template: template,
        // Here, we're passing in some initial data
        data: {
            rows: ['Some', 'Error', 'Occurred'],
            add: [],
            editing: {
                cur: -1,
                past: {},
                notAllowed: [false, false, false]
            },
            data: [
            ["Check", "If", "Connected"],
            ["To", "The", "Internet"]
        ],
            table: "users",
            tables: ["users", "other", "MeantToCauseAlert"]
        }
    });

}, function (err) {
    $('#alert').slideDown().html("<a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a><h3>Sorry, Issues loading template file..</h3></div><p>Check internet connection Or Contact Support.</p>");
    return Error(err);
});

String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
}