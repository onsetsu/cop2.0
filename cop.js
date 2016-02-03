

let LayerStack = [];

export function wrapProperty(obj, prop, descriptor) {
    var existing = {
        setter: obj.__lookupSetter__(prop),
        getter: obj.__lookupGetter__(prop),
        value: obj[prop]
    };

    //if (existingGetter && !existingGetter.isConstraintAccessor) {
    //    obj.__defineGetter__(this.newIvarname, existingGetter);
    //}
    //if (existingSetter && !existingSetter.isConstraintAccessor) {
    //    obj.__defineSetter__(this.newIvarname, existingSetter);
    //}

    // assign old value to new slot
    //if (!existingGetter &&
    //    !existingSetter &&
    //    this.obj.hasOwnProperty(prop)) {
    //    this.setValue(obj[prop]);
    //}
    //
    try {
        obj.__defineGetter__(prop, () => {
            console.log('bar');
            return descriptor.getter()
        });
    } catch (e) { /* Firefox raises for Array.length */ }
    var newGetter = obj.__lookupGetter__(prop);
    if (!newGetter) {
        // Chrome silently ignores __defineGetter__ for Array.length
    }

    obj.__defineSetter__(prop, newProp => {
        if(existing.setter) {
            return existing.setter.call(obj, newProp);
        } {
            return existing.value = newProp;
        }
    });
    var newSetter = obj.__lookupSetter__(prop);

    //if (newSetter) newSetter.isConstraintAccessor = true;
    //if (newGetter) newGetter.isConstraintAccessor = true;
    return {
        unwrap: function() {
            delete obj[prop];
            if(existing.setter) {
                obj.__defineSetter__(prop, existing.setter);
            } else {
                obj[prop] = existing.value;
            }
            if(existing.getter) {
                obj.__defineGetter__(prop, existing.getter);
            }
        }
    }
}

export function unwrapProperty() {

}

export class Layer {
    refineClass() {

    }
}

export function withLayers(layers, func) {
    LayerStack.push({withLayers: layers});
    // console.log("callee: " + cop.withLayers.caller)
    try {
        return func();
    } finally {
        cop.LayerStack.pop();
    }
}

