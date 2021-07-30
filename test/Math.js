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

  it('can be added in place', () => {
    const v = new vec2(2, 3);
    const u = new vec2(4, 5);
    v.add_(u);
    expect(v.x).to.equal(6);
    expect(v.y).to.equal(8);
    expect(u.x).to.equal(4);
    expect(u.y).to.equal(5);
  });

  it('can be added', () => {
    const v = new vec2(2, 3);
    const u = new vec2(4, 5);
    const w = v.add(u);
    expect(v.x).to.equal(2);
    expect(v.y).to.equal(3);
    expect(u.x).to.equal(4);
    expect(u.y).to.equal(5);
    expect(w.x).to.equal(6);
    expect(w.y).to.equal(8);
  });

  it('can be subtracted in place', () => {
    const v = new vec2(2, 3);
    const u = new vec2(4, 5);
    v.sub_(u);
    expect(v.x).to.equal(-2);
    expect(v.y).to.equal(-2);
    expect(u.x).to.equal(4);
    expect(u.y).to.equal(5);
  });

  it('can be subtracted', () => {
    const v = new vec2(2, 3);
    const u = new vec2(4, 5);
    const w = v.sub(u);
    expect(v.x).to.equal(2);
    expect(v.y).to.equal(3);
    expect(u.x).to.equal(4);
    expect(u.y).to.equal(5);
    expect(w.x).to.equal(-2);
    expect(w.y).to.equal(-2);
  });

  it('can be multiplied by scalar in place', () => {
    const v = new vec2(2, 3);
    v.mul_(4);
    expect(v.x).to.equal(8);
    expect(v.y).to.equal(12);
  });

  it('can be multiplied by scalar', () => {
    const v = new vec2(2, 3);
    const u = v.mul(4);
    expect(v.x).to.equal(2);
    expect(v.y).to.equal(3);
    expect(u.x).to.equal(8);
    expect(u.y).to.equal(12);
  });

  it('can be divided by scalar in place', () => {
    const v = new vec2(4, 6);
    v.div_(2);
    expect(v.x).to.equal(2);
    expect(v.y).to.equal(3);
  });

  it('can be divided by scalar', () => {
    const v = new vec2(4, 6);
    const u = v.div(2);
    expect(v.x).to.equal(4);
    expect(v.y).to.equal(6);
    expect(u.x).to.equal(2);
    expect(u.y).to.equal(3);
  });

  it('has dot product', () => {
    const v = new vec2(2, 3);
    const u = new vec2(4, 5);
    expect(v.dot(u)).to.equal(23);
  });

  it('has modulus (aka length)', () => {
    const v = new vec2(3, 4);
    expect(v.modulus()).to.equal(5);
    expect(v.length()).to.equal(5);
    expect(v.squareLength()).to.equal(25);
  });

  it('can be normalized in place', () => {
    const v = new vec2(2, 3);
    v.normalize_();
    expect(v.x).to.be.approximately(0.55470, 0.0001);
    expect(v.y).to.be.approximately(0.83205, 0.0001);
  });

  it('can be normalized', () => {
    const v = new vec2(2, 3);
    const u = v.normalize();
    expect(v.x).to.equal(2);
    expect(v.y).to.equal(3);
    expect(u.x).to.be.approximately(0.55470, 0.0001);
    expect(u.y).to.be.approximately(0.83205, 0.0001);
  });

  it('measures angle in upper-right quadrant', () => {
    const v = new vec2(1, Math.sqrt(3));
    const u = new vec2(Math.sqrt(3), 1);
    expect(v.angle(new vec2(2, 0))).to.be.approximately(Math.PI / 3, 0.0001);
    expect(v.angle(u)).to.be.approximately(Math.PI / 6, 0.0001);
  });

  it('measures angle in upper-left quadrant', () => {
    const v = new vec2(-Math.sqrt(3), 1);
    const u = new vec2(-1, Math.sqrt(3));
    expect(v.angle(new vec2(2, 0))).to.be.approximately(
        Math.PI * 5 / 6, 0.0001);
    expect(v.angle(u)).to.be.approximately(Math.PI / 6, 0.0001);
  });

  it('measures angle in lower-right quadrant', () => {
    const v = new vec2(1, -Math.sqrt(3));
    const u = new vec2(Math.sqrt(3), -1);
    expect(v.angle(new vec2(2, 0))).to.be.approximately(Math.PI / 3, 0.0001);
    expect(v.angle(u)).to.be.approximately(Math.PI / 6, 0.0001);
  });

  it('measures angle in lower-left quadrant', () => {
    const v = new vec2(-Math.sqrt(3), -1);
    const u = new vec2(-1, -Math.sqrt(3));
    expect(v.angle(new vec2(2, 0))).to.be.approximately(
        Math.PI * 5 / 6, 0.0001);
    expect(v.angle(u)).to.be.approximately(Math.PI / 6, 0.0001);
  });

  it('measures angle in upper-right quadrant against normal', () => {
    const v = new vec2(0.5, Math.sqrt(3 / 4));
    const u = new vec2(Math.sqrt(3 / 4), 0.5);
    expect(v.anglen(new vec2(1, 0))).to.be.approximately(Math.PI / 3, 0.0001);
    expect(v.anglen(u)).to.be.approximately(Math.PI / 6, 0.0001);
  });

  it('measures angle in upper-left quadrant against normal', () => {
    const v = new vec2(-Math.sqrt(3 / 4), 0.5);
    const u = new vec2(-0.5, Math.sqrt(3 / 4));
    expect(v.anglen(new vec2(1, 0))).to.be.approximately(
        Math.PI * 5 / 6, 0.0001);
    expect(v.anglen(u)).to.be.approximately(Math.PI / 6, 0.0001);
  });

  it('measures angle in lower-right quadrant against normal', () => {
    const v = new vec2(0.5, -Math.sqrt(3 / 4));
    const u = new vec2(Math.sqrt(3 / 4), -0.5);
    expect(v.anglen(new vec2(1, 0))).to.be.approximately(Math.PI / 3, 0.0001);
    expect(v.anglen(u)).to.be.approximately(Math.PI / 6, 0.0001);
  });

  it('measures angle in lower-left quadrant against normal', () => {
    const v = new vec2(-Math.sqrt(3 / 4), -0.5);
    const u = new vec2(-0.5, -Math.sqrt(3 / 4));
    expect(v.anglen(new vec2(1, 0))).to.be.approximately(
        Math.PI * 5 / 6, 0.0001);
    expect(v.anglen(u)).to.be.approximately(Math.PI / 6, 0.0001);
  });

  it('translates in place', () => {
    const v = new vec2(2, 3);
    v.translate_(4, 5);
    expect(v.x).to.equal(6);
    expect(v.y).to.equal(8);
  });

  it('translates', () => {
    const v = new vec2(2, 3);
    const u = v.translate(4, 5);
    expect(v.x).to.equal(2);
    expect(v.y).to.equal(3);
    expect(u.x).to.equal(6);
    expect(u.y).to.equal(8);
  });

  it('translates by another vector in place', () => {
    const v = new vec2(2, 3);
    v.translatev_(new vec2(4, 5));
    expect(v.x).to.equal(6);
    expect(v.y).to.equal(8);
  });

  it('translates by another vector', () => {
    const v = new vec2(2, 3);
    const u = v.translatev(new vec2(4, 5));
    expect(v.x).to.equal(2);
    expect(v.y).to.equal(3);
    expect(u.x).to.equal(6);
    expect(u.y).to.equal(8);
  });

  it('rotates in place', () => {
    const v = new vec2(4, 5);
    v.rotate_(Math.PI / 2, 2, 3);
    expect(v.x).to.equal(0);
    expect(v.y).to.equal(5);
  });

  it('rotates', () => {
    const v = new vec2(4, 5);
    const u = v.rotate(Math.PI / 2, 2, 3);
    expect(v.x).to.equal(4);
    expect(v.y).to.equal(5);
    expect(u.x).to.equal(0);
    expect(u.y).to.equal(5);
  });

  it('rotates around another vector in place', () => {
    const v = new vec2(4, 5);
    v.rotatec_(Math.PI / 2, new vec2(2, 3));
    expect(v.x).to.equal(0);
    expect(v.y).to.equal(5);
  });

  it('rotates around another vector', () => {
    const v = new vec2(4, 5);
    const u = v.rotatec(Math.PI / 2, new vec2(2, 3));
    expect(v.x).to.equal(4);
    expect(v.y).to.equal(5);
    expect(u.x).to.equal(0);
    expect(u.y).to.equal(5);
  });

  it('scales in place', () => {
    const v = new vec2(6, 7);
    v.scale_(2, 3, 4, 5);
    expect(v.x).to.equal(8);
    expect(v.y).to.equal(11);
  });

  it('scales', () => {
    const v = new vec2(6, 7);
    const u = v.scale(2, 3, 4, 5);
    expect(v.x).to.equal(6);
    expect(v.y).to.equal(7);
    expect(u.x).to.equal(8);
    expect(u.y).to.equal(11);
  });

  it('scales around another vector in place', () => {
    const v = new vec2(6, 7);
    v.scalec_(2, 3, new vec2(4, 5));
    expect(v.x).to.equal(8);
    expect(v.y).to.equal(11);
  });

  it('scales around another vector', () => {
    const v = new vec2(6, 7);
    const u = v.scalec(2, 3, new vec2(4, 5));
    expect(v.x).to.equal(6);
    expect(v.y).to.equal(7);
    expect(u.x).to.equal(8);
    expect(u.y).to.equal(11);
  });
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
