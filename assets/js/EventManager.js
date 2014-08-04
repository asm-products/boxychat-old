var Class = function(methods) {
    var klass = function() {
        this.initialize.apply(this, arguments);
    };

    for (var property in methods) {
        klass.prototype[property] = methods[property];
    }

    if (!klass.prototype.initialize) klass.prototype.initialize = function(){};

    return klass;
};

var EventManager = new Class({
    events: [],
    ievents: [],
    initialize: function() {
    },
    call: function(event, data) {
        if(this.ievents[event])
            this.ievents[event].forEach(function(e) {
                e(data);
            });
        if(this.events[event])
            this.events[event].forEach(function(e) {
                data = e(data);
            });

        return data;
    },
    set: function(event, f, own) {
        var name = "events";
        if(own) {
            name = "ievents";
        }
        if (!this[name][event])
            this[name][event] = [];
        this[name][event].push(f);
    }
});

eventManager = new EventManager();