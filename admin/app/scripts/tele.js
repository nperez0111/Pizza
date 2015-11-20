var tele;
$.ajax({
    url: "http://localhost:9000/views/table.html",
    dataType: "html"
}).then(function (template) {
    tele = new Tele({
        // The `el` option can be a node, an ID, or a CSS selector.
        el: '#container',
        template: template,
        // Here, we're passing in some initial data
        data: {
        }
    });

}, function (err) {
    tele=new Tele();
    tele.alert("Sorry, Issues loading template file...");
    return Error(err);
});