var Table = Ractive.extend({

    oninit: function(options) {
        //add the on handlers
        this.on('add', function(event) {
            this.add(event);
        });
        this.on('edit', function(event) {
            this.edit(event);
        });
        this.on('revert', function(event) {
            this.revert(event);
        });
        this.on('delete', function(event) {
            this.delete(event);
        });
        this.on('save', function(event) {
            this.save(event);
        });
        this.observe("table", function(newVal, oldVal, obj) {
            this.switchTable({
                url: 'http://localhost:80/pizza/api/v1/' + newVal,
                type: 'GET',
                dataType: 'json',
                //*
                headers: {
                    Authorization: "Basic " + btoa("nick@nickthesick.com" + ':' + "0046788285")
                }, //*/
            });
            //console.log(obj+" changed from "+oldVal+" to "+newVal);
        });
        //find a way to initialize the data object

    },
    add: function(obj) {
        var itemToAdd = this.get('add'),
            missing = false;

        $(obj.node).html("<span class='glyphicon glyphicon-refresh glyphicon-refresh-animate'></span> Loading...");

        $(obj.el || 'th .input-group').each(function(i) {
            if (itemToAdd.length < i || !itemToAdd[i]) {
                $(this).addClass("has-error");
                missing = true;
            } else {
                $(this).removeClass("has-error");
            }
        });
        if (missing) {
            $(obj.node).html('<span class="glyphicon glyphicon-floppy-saved"></span> Add');
            return false;
        }
        this.set("add", []);
        this.get('data').push(itemToAdd);
        $(obj.node).html('<span class="glyphicon glyphicon-floppy-saved"></span> Add');
        //actually send data to server
        return true;
    },
    edit: function(e) {
        var row = e.index.r,
            col = e.index.c,
            preEdit = e.context;
        if (this.get("editing.notAllowed")[col]) {
            return false;
        }
        if (!this.get("editing.past")[row]) {
            this.set("editing.past." + row, this.get("data[" + row + "]"));
        }
        this.set("editing.cur", row);
        return true;
    },
    revert: function(obj) {
        this.set("editing.cur", -1);
        var prev = this.get("editing.past"),
            row = obj.index.r,
            cur = $($($(obj.el || "tbody tr").get(row)).find("td")),
            to = this.get("data[" + row + "]");

        delete prev[row];
        this.set("editing.past", prev);
        cur.each(function(i) {
            if ($(this).text() !== (to[i] + "")) {
                $(this).text(to[i]);
            }
        });
        return true;
    },
    delete: function(obj) {
        var rowOfDeletion = obj.index.r;
        return this.get("data").splice(rowOfDeletion, 1)[0];
    },
    save: function(obj) {
        this.set("editing.cur", -1);
        var row = obj.index.r,
            previous = this.get("editing.past"),
            data = this.get("data"),
            cur = $($($(obj.el || "tbody tr").get(row)).find("td")),
            arr = [],
            flag = true; //assume they are the same

        cur.each(function(i) {
            if (i < previous[row].length) {
                arr.push($(this).text());
                if ($(this).text() !== (previous[row][i]) + "") {
                    flag = false;
                    $(this).removeClass("missing");
                    //they are different
                    if ($(this).text() === "") {
                        $(this).addClass("missing");
                        flag = true;
                        return false;
                        //not getting away with nothing mister
                    }
                }
            }
        });

        if (!flag) {
            //send to database to update val
            console.log("changes observed");
            console.log(arr);
            console.log(previous[row]);
            this.sendToDataBase({
                type: "POST",
                data: this.makeObj(arr),
                url: "http://localhost:80/pizza/api/v1/" + this.get("table") + "/" + previous[row][this.get('editing.notAllowed').indexOf(true)]
            });
        } else {
            //are the same do nothing

            console.log("no changes");
            console.log(arr);
            console.log(previous[row]);
            return false;
        }
        delete previous[row];
        this.set("editing.past", previous);
        return true;
        //find a way of tracking what has even been edited
    },
    makeObj: function(arr) {
        var rows = this.get('rows'),
            obj = {};
        for (var i = 0, l = arr.length; i < l; i++) {
            obj[rows[i]] = arr[i];
        }
        return obj;
    },
    alert: function(str) {
        var other = (str.str || str) + "";
        $(str.el || '#alert').slideDown().html("<a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a><h3>" + (other) + "</h3><p>Check internet connection Or Contact Support.</p>");
        return true;
    },
    moveTo: function(from, to) {
        if (from !== parseInt(from, 10) || to !== parseInt(to, 10)) {
            return false;
        }
        if (from > to) {
            from = from + to;
            to = from - to;
            from = from - to;
        }
        var data = this.get("data"),
            x = data.splice(from, 1),
            y = data.splice(to - 1, 1);
        data.splice(from, 0, y[0]);
        data.splice(to, 0, x[0]);
        return true;
    },
    sendToDataBase: function(obj) {
        obj = $.extend({
            type: "POST",
            dataType: "json",
            url: "/IDK"
                /*,
                            headers: {
                                Authorization: "Basic " + btoa("nick@nickthesick.com" + ':' + "0046788285")
                            }*/
        }, obj);
        obj.data = $.extend({
            login: {
                Email: "nick@nickthesick.com",
                password: "0046788285"
            }
        }, obj.data);
        console.log(obj);
        var that = this;
        return $.ajax(obj).then(function(r) {
            return ((r.message));
        }, function(err) {
            if (obj) {
                that.alert("Sorry, Issues sending Table Data to API..");
                throw Error(JSON.stringify(err));
            }
            return Error(err);
        });
    },
    switchTable: function(obj) {
        var that = this;
        obj = $.extend({
            dataType: "json",
            url: "http://localhost:80/pizza/api/v1/"
        }, obj);
        /*obj.data = $.extend({
            login: {
                Email: "nick@nickthesick.com",
                password: "0046788285"
            }
        }, obj.data);*/
        return $.ajax(obj).then(function(r) {

            return (JSON.parse(r.message));

        }, function(err) {
            if (obj) {
                that.alert("Sorry, Issues loading Table Data from API..");
                throw Error(JSON.stringify(err));
            }
            return Error(err);
        }).then(function(objs) {

            var arr = [],
                arry = [],
                key;

            for (var i in objs) {

                for (key in objs[i]) {
                    arry.push(objs[i][key]);
                }

                arr.push(arry);
                arry = [];

            }
            for (key in objs[0]) {
                arry.push(key);
            }
            that.set("data", arr);
            that.set("rows", arry);
            return arr;
        }).then(function(data) {
            var tabler = that.get("table");
            switch (tabler) {
                case "users":
                    that.set("editing.notAllowed", [false, false, true]);
                    break;
            }
            return data;
        });
    }
});
