var Builder = Base.extend({
    oninit: function() {
        this.getData({}, "pizzaHeadings");
    },
    data: function() {
        return {
            headings: [],
            types: [
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
            console.log(titles);
            console.log(types);
            that.set("headings", titles);
            that.set("types", types);

        }, function(err) {
            that.alerter("Sorry, Issues sending Data to API..", err.responseText ? JSON.parse(err.responseText).data : "");
            console.log(err);
            return Error(JSON.stringify(err));
        });
    }
});
