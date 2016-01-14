var Builder = Base.extend({
    oninit: function() {
        this.getData({}, "pizzaHeadings");
    },
    data: function() {
        return {
            headings: [],
            types: [
                []
            ],
            order: [
                []
            ]
        };
    },
    getData: function(toDB, urlEx) {
        var that = this;
        this.sendToDataBase({
            type: "GET",
            data: toDB
        }, urlEx).then(function(obj) {
            var titles = [],
                types = [
                    []
                ];
            JSON.parse(obj).forEach(function(obj, i, arr) {
                if (titles.indexOf(obj.Title) === -1) {
                    if (obj.Title === "Size") {
                        titles.unshift(obj.Title);
                        types.unshift([obj.Name]);
                    } else {
                        titles.push(obj.Title);
                        types[titles.length - 1] = [(obj.Name)];
                    }
                } else {
                    types[titles.indexOf(obj.Title)].push(obj.Name);
                }
            });
            that.set("headings", titles);
            that.set("orders", types.map(function(obj) {
                return obj.map(function(a) {
                    return false;
                });
            }));
            that.set("types", types);

        }, function(err) {
            that.notify("Error occured", err, 5000, "error");
        });
    }
});
