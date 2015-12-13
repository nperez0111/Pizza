var table;
$.ajax({
    url: "views/table.html",
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
    var interval = setInterval(function() {
        table.switchTable({
            url: table.url + table.get("table"),
            type: 'GET',
            dataType: 'json',
            //*
            headers: {
                Authorization: "Basic " + btoa("nick@nickthesick.com" + ':' + "0046788285")
            }, //*/
        }).then(function() {}, function(err) {
            clearInterval(interval);
            console.log(err);
        });
    }, 4000);
    console.log(interval);
}, function(err) {
    table = new Table();
    table.alerter("Sorry, Issues loading template file...");
    return Error(err);
});
