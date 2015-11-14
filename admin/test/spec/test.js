(function() {
    'use strict';
    $.extend({
        el: function(el, props) {
            var $el = $(document.createElement(el));
            $el.attr(props);
            return $el;
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
        describe('.Add(obj)', function() {
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
                        $.el('input', {
                            'value': 'ok'
                        })
                    ).append($.el('input', {
                        'value': ''
                    }));

                expect(table.add({
                    node: ".k",
                    el: $el.find('input')
                })).to.be.false;

                expect($($el.find('input')[0]).hasClass("missing")).to.not.be.true;
                expect($($el.find('input')[1]).hasClass("missing")).to.be.true;
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
        describe('.Edit(obj)', function() {
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
        describe('.Revert(obj)', function() {
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

            });
        });
    });
})();