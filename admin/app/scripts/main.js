var table;
$.ajax({
    url: "http://localhost:9000/views/table.html",
    dataType: "html"
}).then(function(template) {
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

}, function(err) {
    table = new Table();
    table.alerter("Sorry, Issues loading template file...");
    return Error(err);
});
