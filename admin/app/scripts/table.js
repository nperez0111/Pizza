var Table = Base.extend({

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
                type: 'GET',
            }, newVal);
        });

        var that = this,
            list = ["ctrl+s", "ctrl+z", "ctrl+d"],
            functions = ["save", "revert", "delete"];
        Mousetrap.bind(list, function(e, combo) {
            if (e.preventDefault) {
                e.preventDefault();
            } else {
                // internet explorer
                e.returnValue = false;
            }
            that[functions[list.indexOf(combo)]]({
                index: {
                    r: that.get("editing.cur")
                }
            });

            return false;
        });

    },
    unrender: function() {
        Mousetrap.unbind(["ctrl+s", "ctrl+z", "ctrl+d"]);
    },
    add: function(obj) {
        var itemToAdd = this.get('add'),
            missing = false;

        $(obj.node).html("<span class='glyphicon glyphicon-refresh glyphicon-refresh-animate'></span> Loading...");

        $(obj.el || 'th .input-group').each(function(i) {
            if (itemToAdd.length < i || !itemToAdd[i]) {
                $(this).addClass("has-error");
                $(this).find('input').focus();
                missing = true;
            } else {
                $(this).removeClass("has-error");
            }
            if (i === 0) {
                $(this).find('input').focus();
            }
        });
        if (missing) {
            $(obj.node).html('<span class="glyphicon glyphicon-floppy-saved"></span> Add');
            return false;
        }
        this.set("add", []);
        this.get('data').push(itemToAdd);
        var that = this;
        return this.sendToDataBase({
            type: "PUT",
            data: this.makeObj(itemToAdd)
        }, this.get("table") + '/').then(function(o) {

            $(obj.node).html('<span class="glyphicon glyphicon-floppy-saved"></span> Add');
            return o;
        }, function(a) {
            that.get('data').splice(that.get('data').length - 1, 1);
            $(obj.node).html('<span class="glyphicon glyphicon-floppy-saved"></span> Add');
            return a;
        }).then(function(message) {
            that.notify(message, "Table Row added!");
        }, function(err) {
            that.notify("Error occured", err, 5000, "error");
        });
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
        this.notify("Changes not saved", "All changes have been reverted.");
        return true;
    },
    delete: function(obj) {
        var rowOfDeletion = this.get("data").splice(obj.index.r, 1)[0],
            that = this;
        console.log(rowOfDeletion);
        this.sendToDataBase({
            type: "DELETE"
        }, this.get('table') + "/" + rowOfDeletion[this.get('editing.notAllowed').indexOf(true)]).then(function(message) {
            that.notify("Delete went well!", message);
        }, function(err) {
            that.notify("Error occured", err, 5000, "error");
        });
        return rowOfDeletion;
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
            var that = this;
            that.logger(this.makeObj(arr));
            this.sendToDataBase({
                type: "POST",
                data: this.makeObj(arr)
            }, this.get("table") + "/" + previous[row][this.get('editing.notAllowed').indexOf(true)]).then(function(message) {
                that.notify("Changes Saved!", message);
                return message;
            }, function(err) {
                that.notify("Error occured", err, 5000, "error");
                return err;
            });
        } else {
            //are the same do nothing
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
    switchTable: function(obj, str) {
        var that = this;

        return this.sendToDataBase(obj, str).then(function(r) {

            return (JSON.parse(r));

        }, function(err) {
            that.alerter("Sorry, Issues loading Table Data from API..");
            return Error(JSON.stringify(err));
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
            var tabler = that.get("table"),
                val = that.getCache("tablesInfo" + tabler, function() {
                    return new Promise(function(resolve, reject) {
                        that.sendToDataBase({
                            type: "GET"
                        }, ("tablesInfo/search/tableName/" + tabler)).then(function(response) {
                            return JSON.parse(response)[0];
                        }, function(err) {
                            that.notify("Table Missing", "This may not be a valid table according to DataBase!");
                            reject(err);
                            return (err);

                        }).then(function(response) {
                            that.set("editing.notAllowed", JSON.parse(response.primaryKeyArr));
                            that.set("description", response.description);
                            resolve(JSON.stringify(response));
                            return response;
                        });
                    });
                });
            that.set("editing.notAllowed", JSON.parse(val.primaryKeyArr || "[]"));
            that.set("description", val.description);

            return data;
        });
    }
});
