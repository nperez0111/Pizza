var Builder = Base.extend({
    oninit: function() {
        this.getData({}, "pizzaHeadings");
        this.observe("currentChoices", function(newVal, oldVal, obj) {
            var currentSize = this.size();
        });
    },
    data: function() {
        return {
            headings: [],
            types: [
                []
            ],
            currentChoices: [
                []
            ],
            sizes: [45, 37.5, 30],
            svg: {
                radius: 0
            }
        };
    },
    size: function() {
        var currentSize = this.get("currentChoices[0]").indexOf(true),
            possibleSizes = this.get("sizes");
        this.animate("svg.radius", currentSize > -1 ? possibleSizes[currentSize] : 0);
        return currentSize;
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
            that.set("currentChoices", types.map(function(obj) {
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
