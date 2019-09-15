// es5 style
// function extend (base, constructor) {
//     var prototype = new Function();
//     prototype.prototype = base.prototype;
//     constructor.prototype = new prototype();
//     constructor.prototype.constructor = constructor;
// }

function Klass () {
}

function extendKlass (base, constructor, body) {
    for (var meth in body) {
        body[meth] = {
            value: body[meth],
            writable: true,
            enumerable: true,
            configurable: true
        }

    }
    constructor.prototype = Object.create(base.prototype, body);
    constructor.prototype.constructor = constructor;
    return constructor;
}
