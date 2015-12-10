var tele;
$.ajax({
    url: "http://localhost:9000/views/teleprompter.html",
    dataType: "html"
}).then(function(template) {
    tele = new Tele({
        // The `el` option can be a node, an ID, or a CSS selector.
        el: '#container',
        template: template,
        // Here, we're passing in some initial data
        data: {
            title: "Current Question at hand",
            possibleInps: [{
                label: "How did you do it?",
                type: "text",
                answer: "I didn't..."
            }, {
                label: "How did you do it?",
                type: "text",
                answer: "I didn't..."
            }]
        }
    });

}, function(err) {
    tele = new Tele();
    tele.alerter("Sorry, Issues loading template file...");
    return Error(err);
});
