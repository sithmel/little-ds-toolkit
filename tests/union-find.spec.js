/* eslint-env node, mocha */
var assert = require('chai').assert
var UnionFind = require('../lib/union-find')

describe('union-find', function () {
  var a, b, c, d
  beforeEach(function () {
    a = new UnionFind('a')
    b = new UnionFind('b')
    c = new UnionFind('c')
    d = new UnionFind('d')
  })

  it('must be a function', function () {
    assert.isFunction(UnionFind)
  })

  it('must return leader', function () {
    assert.equal(a.find(), a)
  })

  it('must perform union', function () {
    a.union(b)
    assert.equal(a.find(), b)
    assert.equal(b.find(), b)
  })

  it('must increase rank if equal', function () {
    a.union(b)
    assert.equal(a.rank, 0)
    assert.equal(b.rank, 1)
  })

  it('must not increase rank if not equal', function () {
    a.union(b)
    a.union(c)
    a.union(d)
    assert.equal(a.rank, 0)
    assert.equal(b.rank, 1)
    assert.equal(c.rank, 0)
    assert.equal(d.rank, 0)
  })

  it('must increase rank with 2 groups', function () {
    a.union(b)
    c.union(d)
    a.union(c)
    assert.equal(a.rank, 0)
    assert.equal(b.rank, 1)
    assert.equal(c.rank, 0)
    assert.equal(d.rank, 2)
  })

  describe('path compression', function () {
    beforeEach(function () {
      a.union(b)
      c.union(d)
      a.union(c)
    })

    it('must verify topology', function () {
      assert.equal(a.leader, b)
      assert.equal(b.leader, d)
      assert.equal(c.leader, d)
      assert.equal(d.leader, d)
    })

    it('must find and apply compression', function () {
      assert.equal(a.find(), d)

      assert.equal(a.leader, d)
      assert.equal(b.leader, d)
      assert.equal(c.leader, d)
      assert.equal(d.leader, d)
    })
  })
})
