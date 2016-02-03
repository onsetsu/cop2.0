
var expect = chai.expect;
import uuidGenerator from './../src/client/app/generator.js';
import { Layer, withLayers, wrapProperty, unwrapProperty } from './../cop.js';

let AddressLayer;
let EmploymentLayer;
let Person;
let Employer;

var copExample = function() {

    AddressLayer = new Layer();
    EmploymentLayer = new Layer();

    Person = class {

        constructor(newName, newAddress, newEmployer) {
            this.name = newName;
            this.address = newAddress;
            this.employer = newEmployer;
        }

        print() {
            return "Name: " + this.name;
        }

        AddressLayer$print() {
            return cop.proceed() + "; Address: " + this.address;
        }

        EmploymentLayer$print() {
            return cop.proceed() + "; [Employer] " + this.employer.print();
        }

        toString() {
            return "Person: " + this.name;
        }
    };


    Employer = class {

        constructor(newName, newAddress) {
            this.name = newName;
            this.address = newAddress;
        }

        print() {
            return "Name: " + this.name;
        }

        toString() {
            return "Employer: " + this.name;
        }
    };

    AddressLayer.refineClass(Employer, {
        print() {
            return cop.proceed() + "; Address: " + this.address;
        }
    });

};

let DummyLayer = new Layer();
let DummyLayer2 = new Layer();
let DummyLayer3 = new Layer();


class DummyClass {
    constructor() {
        this.e = "Hello";
        this.m = "Hello";
        this.execution = []
    }
    f(a, b) {
        this.execution.push("d.f");
        // console.log("execute default f(" + a, ", " + b + ")");
        return 0;
    }
    DummyLayer$f(a, n) {
        this.execution.push("ld.f");
        //console.log("execute dummy layer f(" + a, ", " + b + ")");
        return cop.proceed() + 100;
    }

    DummyLayer2$f(a, n) {
        this.execution.push("ld2.f");
        return cop.proceed() + 1000;
    }

    get DummyLayer$e() {
        return this._DummyLayer_e;
    }
    set DummyLayer$e(v) {
        this._DummyLayer_e = v;
    }
    get DummyLayer$m() {
        return cop.proceed() + " World";
    }
    h() {
        // console.log("h");
        return 2;
    }
    DummyLayer$h() {
        // console.log("D$h old(" + cop.proceed() +")");
        return 3;
    }
    DummyLayer3$h() {
        // console.log("D3$h old(" + cop.proceed() +")");
        return 4;
    }

    DummyLayer$newMethod() {
        return "totally new"
    }

    m1() {
        return 1;
    }

    DummyLayer$m1() {
        return 7;
    }


    m2() {
        return "m2";
    }

    DummyLayer$m2() {
        return "D$m2," + cop.proceed();
    }


    fooo() {
        return "base";
    }

    DummyLayer$newFoo() {
        return "newFoo";
    }

    say(a) {
        return "Say: " + a
    }
}

class DummySubclass extends DummyClass {

    f2() {
        return 3;
    }

    DummyLayer$f2() {
        return 4;
    }

    m1() {
        return 10;
    }

    DummyLayer$m1() {
        return cop.proceed() + 1;
    }

    DummyLayer$fooo() {
        var proc =  cop.proceed();
        return proc+"-layer-"+this.newFoo();
    }

    toString() {
        return "[a DummySubclass]"
    }

    m2() {
        return "S$m2"
    }

}

class SecondDummySubclass extends DummyClass {

    DummyLayer$m1() {
        return cop.proceed() + 100;
    }

}



//###########################################################################
//############################ TESTS TESTS TESTS ############################
//###########################################################################

describe('CopExampleTest', function() {

    it('testCopExample', function() {
        copExample();

        var name = "Hans Peter",
            address = "Am Kiez 49, 123 Berlin",
            employer_name = "Doener AG",
            employer_address = "An der Ecke, 124 Berlin",
            employer = new Employer(employer_name, employer_address),
            person = new Person(name, address, employer);

        expect(person.print()).to.equal("Name: " + name, "toString without a layer is broken");

        return;
        withLayers([AddressLayer], function() {
            expect(person.print()).to.equal("Name: " + name + "; Address: " + address); // , "toString with address layer is broken"
        }.bind(this));

        expect(true).to.equal(false);

        withLayers([EmploymentLayer], function() {
            this.assertEquals(person.print(), "Name: " + name + "; [Employer] Name: " + employer_name, "toString with employment layer is broken");
        }.bind(this));

        return;

        cop.withLayers([Global.AddressLayer, Global.EmploymentLayer], function() {
            this.assertEquals(person.print(), "Name: " + name +  "; Address: " + address +
                "; [Employer] Name: " + employer_name + "; Address: " + employer_address,
                "toString with employment layer is broken");
        }.bind(this));
    });
});

describe('wrapProperty', function() {
    it('should wrap properties accordingly', function() {
        var obj = {
                prop: 42,
                func: function() { return this.prop; }
            },
            newFunc = function() { return 43; };

        expect(obj.prop).to.equal(42);
        expect(obj.func()).to.equal(42);

        var accessor = wrapProperty(obj, 'func', {
            getter: function() {
                return newFunc;
            }
        });

        expect(obj.func).to.equal(newFunc);
        expect(obj.func()).to.equal(43);

        obj.func = function() { return 41};

        expect(obj.func).to.equal(newFunc);
        expect(obj.func()).to.equal(43);

        accessor.unwrap();

        expect(obj.func()).to.equal(41);
    });
});

describe('cop', function() {
    describe('Layer on mixins', function() {
        it('should allow to import functionality over transitively over multiple modules', function() {
            var uuidGen = uuidGenerator();

            expect(uuidGen().split('-').length).to.equal(5);
        });
    });
});
