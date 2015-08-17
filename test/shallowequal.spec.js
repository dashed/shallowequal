const chai = require('chai');
const expect = chai.expect;
const _ = require('lodash');

describe('shallowequal', function() {

    let shallowequal;
    const falsey = [, '', 0, false, NaN, null, undefined];

    beforeEach(() => {
        shallowequal = require('../src');
    });

    // test cases copied from https://github.com/facebook/fbjs/blob/82247de1c33e6f02a199778203643eaee16ea4dc/src/core/__tests__/shallowEqual-test.js
    it('returns false if either argument is null', () => {
        expect(shallowequal(null, {})).to.equal(false);
        expect(shallowequal({}, null)).to.equal(false);
    });

    it('returns true if both arguments are null or undefined', () => {
        expect(shallowequal(null, null)).to.equal(true);
        expect(shallowequal(undefined, undefined)).to.equal(true);
    });

    it('returns true if arguments are shallow equal', () => {
        expect(
            shallowequal(
                {a: 1, b: 2, c: 3},
                {a: 1, b: 2, c: 3}
            )
        ).to.equal(true);
    });


    it('returns false if arguments are not objects and not equal', () => {
        expect(
            shallowequal(
                1,
                2
            )
        ).to.equal(false);
    });

    it('returns false if only one argument is not an object', () => {
        expect(
            shallowequal(
                1,
                {}
            )
        ).to.equal(false);
    });

    it('returns false if first argument has too many keys', () => {
        expect(
            shallowequal(
                {a: 1, b: 2, c: 3},
                {a: 1, b: 2}
            )
        ).to.equal(false);
    });

    it('returns false if second argument has too many keys', () => {
        expect(
            shallowequal(
                {a: 1, b: 2},
                {a: 1, b: 2, c: 3}
            )
        ).to.equal(false);
    });

    // subsequent test cases are copied from lodash tests
    it('returns false if arguments are not shallow equal', () => {
        expect(
            shallowequal(
                {a: 1, b: 2, c: {}},
                {a: 1, b: 2, c: {}}
            )
        ).to.equal(false);
    });

    it('should provide the correct `customizer` arguments', () => {
        let argsList = [];
        const object1 = { 'a': [1, 2], 'b': null };
        const object2 = { 'a': [1, 2], 'b': null };

        object1.b = object2;
        object2.b = object1;

        const expected = [
            [object1, object2],
            [object1.a, object2.a, 'a'],
            [object1.a[0], object2.a[0], 0],
            [object1.a[1], object2.a[1], 1],
            [object1.b, object2.b, 'b'],
            [object1.b.a, object2.b.a, 'a'],
            [object1.b.a[0], object2.b.a[0], 0],
            [object1.b.a[1], object2.b.a[1], 1],
            [object1.b.b, object2.b.b, 'b']
        ];

        _.isEqual(object1, object2, function(...args) {
            argsList.push(args);
        });

        expect(argsList).to.eql(expected);
    });

    it('should set the `this` binding', () => {
      const actual = shallowequal('a', 'b', function(a, b) {
        return this[a] == this[b];
      }, { 'a': 1, 'b': 1 });

      expect(actual).to.equal(true);
    });

    it('should handle comparisons if `customizer` returns `undefined`', () => {

        const noop = () => void 0;

        expect(_.isEqual('a', 'a', noop)).to.equal(true);
        expect(_.isEqual(['a'], ['a'], noop)).to.equal(true);
        expect(_.isEqual({ '0': 'a' }, { '0': 'a' }, noop)).to.equal(true);
    });

    it('should not handle comparisons if `customizer` returns `true`', () => {
        const customizer = function(value) {
            return _.isString(value) || undefined;
        };

        expect(_.isEqual('a', 'b', customizer)).to.equal(true);
        expect(_.isEqual(['a'], ['b'], customizer)).to.equal(true);
        expect(_.isEqual({ '0': 'a' }, { '0': 'b' }, customizer)).to.equal(true);
    });

    it('should not handle comparisons if `customizer` returns `false`', () => {
        const customizer = function(value) {
            return _.isString(value) ? false : undefined;
        };

        expect(_.isEqual('a', 'a', customizer)).to.equal(false);
        expect(_.isEqual(['a'], ['a'], customizer)).to.equal(false);
        expect(_.isEqual({ '0': 'a' }, { '0': 'a' }, customizer)).to.equal(false);
    });

    it('should return a boolean value even if `customizer` does not', () => {
        let actual = _.isEqual('a', 'b', _.constant('c'));
        expect(actual).to.equal(true);

        const values = _.without(falsey, undefined);
        const expected = _.map(values, _.constant(false));

        actual = [];
        _.each(values, function(value) {
            actual.push(_.isEqual('a', 'a', _.constant(value)));
        });

        expect(actual).to.eql(expected);
    });

    it('should treat objects created by `Object.create(null)` like any other plain object', () => {
        function Foo() { this.a = 1; }
        Foo.prototype.constructor = null;

        const object2 = { 'a': 1 };
        expect(_.isEqual(new Foo, object2)).to.equal(false);

        const object1 = Object.create(null);
        object1.a = 1;
        expect(_.isEqual(object1, object2)).to.equal(true);
    });
});
