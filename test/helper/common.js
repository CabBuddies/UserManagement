const expect = require('chai').expect;

function jsonStructure(json,keys){
    for(const k of keys){
        expect(k in json).to.be.true
        json = json[k]
    }
    expect(json).to.not.be.undefined;
    expect(json).to.not.be.null;
    return json
}

function nonEmptyString(value){
    expect(value).to.be.a('string')
    expect(value).to.not.equal("")
    return value
}

module.exports = {
    jsonStructure,
    nonEmptyString
}