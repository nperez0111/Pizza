var Builder = Base.extend({
    oninit: function() {
        this.observe("currentChoices", function(newVal, oldVal, obj) {
            var currentSize = this.size();
            var that = this;

            this.set("toppingsSelected", that.get("currentChoices").length < 2 ? [] : that.get("currentChoices").filter(function(cur, i, arr) {
                return i !== 0;
            }).map(function(arr, r) {
                return arr.map(function(val, c) {
                    return val ? that.get("types")[r + 1][c] : false;
                });
            }).reduce(function(a, b) {
                return a.concat(b);
            }).filter(function(val) {
                return val;
            }));
        });
        this.inits(this);
    },
    inits:function(that){
        this.getData("pizzaHeadings");
    },
    data: function() {
        return {
            headings: [],
            types: [
                []
            ],
            currentChoices: [
                [],
                [],
                []
            ],
            sizes: [45, 37.5, 30],
            svg: {
                radius: 0
            },
            toppingsSelected: []
        };
    },
    size: function() {
        var currentSize = this.get("currentChoices[0]").indexOf(true),
            possibleSizes = this.get("sizes");
        this.animate("svg.radius", currentSize > -1 ? possibleSizes[currentSize] : 0);
        return currentSize;
    },
    getData: function(urlEx) {
        var that = this;
        this.getCache("headings", function() {
            return that.sendToDataBase({
                type: "GET"
            }, urlEx + "/sortBy/Name");
        }, true).then(function(obj) {
            var titles = [],
                types = [
                    []
                ];
            obj.forEach(function(obj, i, arr) {
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
