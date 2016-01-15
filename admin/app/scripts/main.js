var table, tele, build, interval, cache = {};
Ractive.DEBUG = false;

function pre(e, str) {
    if (e) {
        e.preventDefault();
    }
    if (interval) {
        clearInterval(interval);
    }
    if ($(str).parent().hasClass("active")) {
        return false;
    }
    if (e) {
        $('.nav li').each(function() {
            $(this).removeClass("active");
        });
        $($(e.target)[0]).parent().addClass("active");
    }
    return true;
}

function viewBuilder(evente, el, url, callback) {
    if (pre(evente, el) === false) {
        return Promise.reject("Same Element clicked twice");
    }
    if (url in cache) {
        return Promise.resolve(callback(cache[url]));
    }
    return $.ajax({
        url: "views/" + url + ".html",
        dataType: "html"
    }).then(function(template) {
        callback(template);
        return template;
    }, function(err) {
        var base = new Base();
        base.alerter("Sorry, Issues loading template file...");
        return Error(JSON.stringify(err));
    }).then(function(template) {
        cache[url] = template;
    });
}



$(document).ready(function() {
    $('#tele').click(function(e) {
        viewBuilder(e, "#tele", "teleprompter", function(template) {
            tele = new Tele({
                // The `el` option can be a node, an ID, or a CSS selector.
                el: '#container',
                template: template,
                // Here, we're passing in some initial data
                data: {
                    type: [{
                        name: "Pizza",
                        quickOrders: ["Large eperoni"],
                        buildYourOwn: true
                    }, {
                        name: "Wings",
                        quickOrders: ["Spicy buffalo"],
                        buildYourOwn: true
                    }, {
                        name: "Salad",
                        quickOrders: ["Regular", "Lechuga"],
                        buildYourOwn: true
                    }, {
                        name: "Drink",
                        quickOrders: ["Sprite", "Coke", "Diet Coke", "Materva", "Water"],
                        buildYourOwn: false,
                        images: ["sprite.png", "coke.jpg", "diet_coke.jpg", "materva.png", "water.jpg"]
                    }]
                }
            });
        });
    });
    $('#home').click(function(e) {
        viewBuilder(e, "#home", "table", function(template) {
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
                    tables: ["users", "other", "orders", "transactions", "MeantToCauseAlert", "settings", "tablesInfo", "symbols", "quickOrdersPizza", "quickOrdersSalad", "quickOrdersWings", "quickOrdersDrink", "pizzaHeadings", "ingredients"]
                }
            });
        }).then(function() {
            var func = function() {
                table.switchTable({
                    type: 'GET'
                }, table.get("table")).then(function() {}, function(err) {
                    clearInterval(interval);
                    table.alerter('Sorry, Issues loading Table Data from API..', "<button id='click' class=' btn btn-default'><span class='glyphicon glyphicon-refresh'></span>Click to retry</button>");
                    $('#click').click(function() {
                        $(this).find('span').addClass("glyphicon-refresh-animate");
                        $("#alert").fadeTo(500, 0).slideUp(500, function() {
                            $(this).remove();
                        });
                        interval = setInterval(func, 12000);
                    });
                    console.log(err);
                });
            };
            interval = setInterval(func, 12000);
        }, function(err) {
            console.log(err);
        });
    });
    $('#build').click(function(e) {
        viewBuilder(e, "#build", "builder", function(template) {
            build = new Builder({
                // The `el` option can be a node, an ID, or a CSS selector.
                el: '#container',
                template: template,
                // Here, we're passing in some initial data
                data: {

                }
            });
        });
    }).trigger("click");


});
