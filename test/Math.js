const {expect} = require('chai');

const Darblast = require('../dist/darblast.js');
const {vec2, vec3, vec4, mat2, mat3, mat4} = Darblast.Math;


describe('vec2', () => {
  it('constructs correctly', () => {
    const v = new vec2(2, 3);
    expect(v.x).to.equal(2);
    expect(v.y).to.equal(3);
  });

  it('can be constructed from vec3', () => {
    const v = vec2.fromVec3(new vec3(2, 3, 4));
    expect(v.x).to.equal(2);
    expect(v.y).to.equal(3);
  });

  it('can be assigned', () => {
    const v = new vec2(2, 3);
    v.assign(new vec2(4, 5));
    expect(v.x).to.equal(4);
    expect(v.y).to.equal(5);
  });

  it('can be assigned from vec3', () => {
    const v = new vec2(2, 3);
    v.assign(new vec3(4, 5, 6));
    expect(v.x).to.equal(4);
    expect(v.y).to.equal(5);
  });

  it('can be assigned from vec4', () => {
    const v = new vec2(2, 3);
    v.assign(new vec4(4, 5, 6, 7));
    expect(v.x).to.equal(4);
    expect(v.y).to.equal(5);
  });

  it('can be cloned', () => {
    const v = new vec2(2, 3);
    const u = v.clone();
    u.x = 4;
    u.y = 5;
    expect(v.x).to.equal(2);
    expect(v.y).to.equal(3);
  });

  it('can be converted to vec3', () => {
    const v = new vec2(2, 3);
    const u = v.toVec3(4);
    v.x = 5;
    v.y = 6;
    expect(u.x).to.equal(2);
    expect(u.y).to.equal(3);
    expect(u.z).to.equal(4);
  });

  it('defaults Z to 0 when unspecified upon conversion to vec3', () => {
    const v = new vec2(2, 3);
    const u = v.toVec3();
    expect(u.z).to.equal(0);
  });

  it('can be converted to vec4', () => {
    const v = new vec2(2, 3);
    const u = v.toVec4(4, 5);
    v.x = 6;
    v.y = 7;
    expect(u.x).to.equal(2);
    expect(u.y).to.equal(3);
    expect(u.z).to.equal(4);
    expect(u.w).to.equal(5);
  });

  it('defaults Z and W when unspecified upon conversion to vec4', () => {
    const v = new vec2(2, 3);
    const u = v.toVec4();
    expect(u.z).to.equal(0);
    expect(u.w).to.equal(1);
  });

  it('can be converted to a homogeneous vec3', () => {
    const v = new vec2(2, 3);
    const u = v.toHomogeneous();
    v.x = 4;
    v.y = 5;
    expect(u.x).to.equal(2);
    expect(u.y).to.equal(3);
    expect(u.z).to.equal(1);
  });

  it('negates in place', () => {
    const v = new vec2(2, 3);
    v.neg_();
    expect(v.x).to.equal(-2);
    expect(v.y).to.equal(-3);
  });

  it('negates', () => {
    const v = new vec2(2, 3);
    const u = v.neg();
    v.x = 4;
    v.y = 5;
    expect(u.x).to.equal(-2);
    expect(u.y).to.equal(-3);
  });

  // TODO
});


describe('vec3', () => {
  it('constructs correctly', () => {
    const v = new vec3(2, 3, 4);
    expect(v.x).to.equal(2);
    expect(v.y).to.equal(3);
    expect(v.z).to.equal(4);
  });

  // TODO
});


describe('vec4', () => {
  it('constructs correctly', () => {
    const v = new vec4(2, 3, 4, 5);
    expect(v.x).to.equal(2);
    expect(v.y).to.equal(3);
    expect(v.z).to.equal(4);
    expect(v.w).to.equal(5);
  });

  // TODO
});


describe('mat2', () => {
  // TODO
});


describe('mat3', () => {
  // TODO
});


describe('mat4', () => {
  // TODO
});
