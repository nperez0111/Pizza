(function() {
    'use strict';

    $.extend({
        el: function(el, props) {
            var $el = $(document.createElement(el));
            $el.attr(props);
            return $el;
        }
    });
    $.mockjax({
        url: "*/pizza/api/v1/undefined",
        responseText: {
            status: "success",
            message: JSON.stringify([{
                fname: "FAKE",
                lname: "OBJ",
                email: "nick@nickthesick.com"
            }, {
                fname: "NICK",
                lname: "POST",
                email: "rf@gh.co"
            }, {
                fname: "macaroni",
                lname: "maybe",
                email: "nick@nickthesick.c0"
            }, {
                fname: "yo",
                lname: "maybe",
                email: "nick@nickthesi"
            }]),
        }
    });
    $.mockjax({
        url: "*/pizza/api/v1/FAKE",
        responseText: {
            status: "success",
            message: JSON.stringify(true),
        }
    });
    describe('Ractive Table', function() {
        describe('Constructor', function() {
            it('Should exist', function() {
                var table = new Table();
                expect(table).to.exist;
                expect(table).to.not.be.null;
            });
            it("Should accept object in its param", function() {
                var table = new Table({
                    // The `el` option can be a node, an ID, or a CSS selector.
                    el: '#container',
                    template: '',
                    // Here, we're passing in some initial data
                    data: {}
                });
                expect(table).to.exist;
                expect(table).to.not.be.null;
            });
        });
        describe('.Add(Obj)', function() {
            it('Should exist', function() {
                var table = new Table();
                expect(table.add).to.exist;
            });
            it('Should accept an object ', function() {
                var table = new Table({
                    data: {
                        data: [],
                        add: []
                    }
                });
                expect(table.add({
                    node: ".k"
                })).to.be.true;
            });
            it('Should manipulate both the data and add properties of the data object', function() {
                var dat = [],
                    adder = ['yes', 'no'],
                    table = new Table({
                        data: {
                            data: dat,
                            add: adder
                        }
                    });
                table.add({
                    node: '.k'
                });
                expect(table.get("data")[0]).to.equal(adder);
                expect(table.get("add").length).to.equal(0);

            });
            it('Should check if inputs are empty', function() {
                var table = new Table({
                        data: {
                            data: [],
                            add: ['ok', '']
                        }
                    }),
                    $el = $.el('div', {
                        'class': 'wrapper'
                    }).append(
                        $.el('div', {
                            'class': 'input-group'
                        }).append($.el('input', {
                            'value': 'ok'
                        }))
                    ).append(
                        $.el('div', {
                            'class': 'input-group'
                        }).append($.el('input', {
                            'value': ''
                        })));

                expect(table.add({
                    node: ".k",
                    el: $el.find('.input-group')
                })).to.be.false;

                expect($($el.find('.input-group')[0]).hasClass("has-error")).to.not.be.true;
                expect($($el.find('.input-group')[1]).hasClass("has-error")).to.be.true;
            });
            it('Should set the node back to add', function() {
                var table = new Table({
                        data: {
                            data: [],
                            add: ['ok', '']
                        }
                    }),
                    $node = $.el('div', {}),
                    $el = $.el('div', {
                        'class': 'wrapper'
                    }).append(
                        $.el('input', {
                            'value': 'ok'
                        })
                    ).append($.el('input', {
                        'value': ''
                    }));
                table.add({
                    node: $node
                });
                expect($($node.find('span')).hasClass('glyphicon-floppy-saved')).to.be.true;
                table.add({
                    node: ".k",
                    el: $el.find('input')
                });
                expect($($node.find('span')).hasClass('glyphicon-floppy-saved')).to.be.true;
            });
        });
        describe('.Edit(Obj)', function() {
            it('Should exist', function() {
                var table = new Table();
                expect(table.edit).to.exist;
            });
            it('Should accept an object', function() {
                var table = new Table({
                    data: {
                        editing: {
                            past: {},
                            notAllowed: []
                        }
                    }
                });
                expect(table.edit({
                    index: {
                        r: 0,
                        c: 0
                    }
                })).to.be.true;
            });
            it('Should manipulate current row being edited and the past cache', function() {
                var table = new Table({
                    data: {
                        editing: {
                            past: {},
                            notAllowed: []
                        },
                        data: [true]
                    }
                });
                table.edit({
                    index: {
                        r: 0,
                        c: 0
                    }
                });
                expect(table.get('editing.cur')).to.equal(0);
                expect(table.get('editing.past.0')).to.be.true;
            });
            it('Should not edit if the col is not allowed', function() {
                var table = new Table({
                    data: {
                        editing: {
                            past: {},
                            notAllowed: [false, true]
                        },
                        data: [true]
                    }
                });
                expect(table.edit({
                    index: {
                        r: 0,
                        c: 1
                    }
                })).to.be.false;
            });
            it('Should not overwrite past cache if the functions is called more than once', function() {
                var table = new Table({
                    data: {
                        editing: {
                            past: {},
                            notAllowed: []
                        },
                        data: [true]
                    }
                });
                table.edit({
                    index: {
                        r: 0,
                        c: 0
                    }
                });
                expect(table.get('editing.past.0')).to.be.true;
                table.set("data[0]", false);
                table.edit({
                    index: {
                        r: 0,
                        c: 0
                    }
                });
                expect(table.get('editing.past.0')).to.be.true;
            });
        });
        describe('.Revert(Obj)', function() {
            it('Should exist', function() {
                var table = new Table();
                expect(table.revert).to.exist;
            });
            it('Should accept an obj', function() {
                var table = new Table({
                    data: {
                        editing: {
                            cur: 0,
                            past: {}
                        }
                    }
                });

                expect(table.revert({
                    index: {
                        r: 0
                    },
                    el: ''
                })).to.be.true;
            });
            it('Should cancel the current edit and put the values back to their previous state', function() {
                var table = new Table({
                        data: {
                            editing: {
                                past: {},
                                notAllowed: [],
                                cur: -1
                            },
                            data: [
                                ["hello"]
                            ]
                        }
                    }),
                    $el = $.el('tr', {}).append($($.el('td', {}).text("other")));
                table.set("editing.cur", 0);
                expect(table.get("editing.cur")).to.equal(0);
                table.set("editing.past", {
                    0: "hello"
                });
                expect(table.get("editing.past.0")).to.equal("hello");
                table.set("data", [
                    ["hello"]
                ]);
                table.revert({
                    index: {
                        r: 0
                    },
                    el: $el
                });
                expect(table.get("editing.cur")).to.equal(-1);
                expect(table.get("editing.past.0")).to.be.undefined;
                expect($($($el).get(0)).find('td').text()).to.equal("hello");

            });
        });
        describe('.Save(Obj)', function() {
            it('Should exist', function() {
                var table = new Table();
                expect(table.save).to.exist;
                expect(table.save).to.not.be.undefined;
            });
            it('Should accept an object', function() {
                var table = new Table({
                    data: {
                        editing: {
                            past: {},
                            cur: 0
                        }
                    }
                });
                expect(table.save({
                    index: {
                        r: 0
                    }
                })).to.be.false;
            });
            it('Should save the current rows data', function() {
                var table = new Table({
                        data: {
                            editing: {
                                past: {},
                                cur: 0,
                                notAllowed: [true]
                            },
                            data: [
                                ["hello"]
                            ],
                            table: "",
                            rows: [""]
                        }
                    }),
                    $el = $.el('tr', {}).append($.el('td', {}).text("hello"));
                table.set("editing.past", {
                    0: ["nothello"]
                });
                table.save({
                    index: {
                        r: 0
                    },
                    el: $el
                });
                expect(table.get('editing.past.0')).to.not.exist;
                expect(table.get('data[0][0]')).to.equal("hello");
            });
            it('Should return false if no changes occured', function() {
                var table = new Table({
                        data: {
                            editing: {
                                past: {},
                                cur: 0
                            },
                            data: [
                                ["hello"]
                            ]
                        }
                    }),
                    $el = $.el('tr', {}).append($.el('td', {}).text("hello"));
                table.set("editing.past", {
                    0: ["hello"]
                });
                expect(table.save({
                    index: {
                        r: 0,
                        el: $el
                    }
                })).to.be.false;

            });
            it('Should return false if the text is empty', function() {
                var table = new Table({
                        data: {
                            editing: {
                                past: {},
                                cur: 0
                            },
                            data: [
                                ["hello"]
                            ]
                        }
                    }),
                    $el = $.el('tr', {}).append($.el('td', {}).text(""));
                table.set("editing.past", {
                    0: ["hello"]
                });
                expect(table.save({
                    index: {
                        r: 0,
                        el: $el
                    }
                })).to.be.false;
            });
        });
        describe('.Delete(Obj)', function() {
            it('Should exist', function() {
                var table = new Table();
                expect(table.delete).to.exist;
            });
            it('Should accept an object', function() {
                var table = new Table({
                    data: {
                        data: [
                            ["hello"],
                            ["jk"]
                        ]
                    }
                });
                expect(table.delete({
                    index: {
                        r: 0
                    }
                })).to.exist;
            });
            it('Should return the deleted array', function() {
                var table = new Table({
                    data: {
                        data: [
                            ["hello"],
                            ["jk"]
                        ]
                    }
                });
                expect(table.delete({
                    index: {
                        r: 0
                    }
                })).to.deep.equal(["hello"]);
            });
        });
        describe('.Alerter(String)', function() {
            it('Should exist', function() {
                var table = new Table();
                expect(table.alerter).to.exist;
            });
            it('Should accept a string', function() {
                var table = new Table();
                expect(table.alerter("")).to.be.true;
            });
            it('Should alert user', function() {
                var table = new Table(),
                    $el = $.el('div', {});
                table.alerter({
                    el: $el,
                    str: "wkj"
                });
                expect($el.text()).to.contain("wkj");
            });
        });
        describe('.SwitchTable(Obj)', function() {
            it('Should exist', function() {
                var table = new Table();
                expect(table.switchTable).to.exist;
            });
            it('Should accept an object', function() {
                var table = new Table({
                    data: {
                        data: [
                            []
                        ],
                        rows: []
                    }
                });
                expect(table.switchTable({
                    url: 'http://localhost:80/pizza/api/v1/undefined',
                    dataType: 'json'
                })).to.exist;
            });
            it('Should switch the current table data', function() {
                var dta, table = new Table({
                    data: {
                        data: [],
                        rows: []
                    }
                });
                table.switchTable({
                    url: 'http:///pizza/api/v1/undefined',
                    dataType: 'json',
                    type: 'GET'
                });
                expect(table.get('data')).to.not.deep.equal(dta);
                expect(table.get('row')).to.not.deep.equal([]);

            });
            it('Should return an error if url is not requestable', function() {
                var table = new Table({
                    data: {
                        data: [],
                        rows: []
                    }
                });
                try {
                    table.switchTable();
                } catch (err) {
                    expect(err).to.be.instanceOf(Error);
                }
                table.switchTable().then(function(a) {
                    expect(a).to.deep.equal([]);
                });

            });
            it('Should set the editing status per table', function() {
                var table = new Table({
                    data: {
                        data: [],
                        rows: [],
                        editing: {
                            notAllowed: []
                        }
                    }
                });
                table.set("table", "users");

                table.switchTable({
                    url: 'http:///pizza/api/v1/undefined',
                    dataType: 'json',
                    type: 'GET'
                }).then(function() {
                    expect(table.get("editing.notAllowed")).to.deep.equal([false, false, true]);
                });


            });
        });
        describe('.MoveTo( From , To )', function() {
            it('Should exist', function() {
                var table = new Table();
                expect(table.moveTo).to.exist;
            });
            it('Should accept (from , to)', function() {
                var table = new Table({
                    data: {
                        data: [
                            ["First Row"],
                            ["Second Row"]
                        ]
                    }
                });
                expect(table.moveTo(0, 1)).to.be.true;
            });
            it('Should move the row from \'from\' to \'to\'', function() {
                var table = new Table({
                    data: {
                        data: [
                            ["First Row"],
                            ["Second Row"]
                        ]
                    }
                });
                table.moveTo(0, 1);
                expect(table.get("data")[0]).to.deep.equal(["Second Row"]);
                expect(table.get("data")[1]).to.deep.equal(["First Row"]);
                table.moveTo(1, 0);
                expect(table.get("data")[1]).to.deep.equal(["Second Row"]);
                expect(table.get("data")[0]).to.deep.equal(["First Row"]);
            });
            it('Should return false if from or to aren\'t numbers', function() {
                var table = new Table();
                expect(table.moveTo("not a num", {})).to.be.false;
                expect(table.moveTo("1", "2")).to.be.false;
            });
        });
        describe('.sendToDataBase(Obj)', function() {
            it('Should exist', function() {
                var table = new Table();
                expect(table.sendToDataBase).to.exist;
            });
            it('Should accept an Obj', function() {
                var table = new Table();
                table.switchTable({
                    url: 'http:///pizza/api/v1/undefined',
                    type: 'GET'
                });
                table.sendToDataBase({
                    type: "GET",
                    url: 'http:///pizza/api/v1/undefined'
                }).then(function(r) {
                    expect(r).to.be.true;
                });
            });
            it('Should return a promise', function() {
                var table = new Table();
                expect(table.sendToDataBase({
                    type: "GET",
                    url: 'http:///pizza/api/v1/undefined'
                }).then).to.exist;
            });
            it('Should return the resultant data within a promise', function() {
                var table = new Table();
                table.switchTable({
                    url: 'http:///pizza/api/v1/undefined',
                    type: 'GET'
                });
                table.sendToDataBase({
                    type: "GET",
                    url: 'http:///pizza/api/v1/undefined'
                }).then(function(r) {
                    expect(JSON.parse(r)[0].fname).to.equal("FAKE");
                });
            });
            it('Should throw an error if no parameters given', function() {
                var table = new Table();
                try {
                    table.sendToDataBase();
                } catch (err) {
                    expect(err).to.be.instanceOf(Error);
                }
            });
        });
    });
})();
