/**
 * Created by knarf on 05/03/15.
 */
describe("A test suite", function() {
    beforeEach(function() { });
    afterEach(function() { });


    it('should not fail', function() {
        expect(true).to.be.true;
    });

    it('should fail', function() {
        expect(true).to.be.false;
    });

});