/* eslint-env node, mocha */
var assert = require('chai').assert
var MinMaxHeap = require('../lib/min-max-heap')

describe('MinMaxHeap', function () {
  var notSorted = [6, 0, 28, 1, 3, 12, 11, 16, 17, 25, 4, 14, 24, 15, 8, 26, 7, 10, 2, 21, 23, 22, 13, 9, 5, 20, 18, 27, 29, 19]
  var sorted = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29]
  var reversed = [29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]

  it('must be a function', function () {
    assert.isFunction(MinMaxHeap)
  })

  it('must push-pop correctly', function () {
    var heap = new MinMaxHeap()
    heap.pushAll([5, 6, 7, 8, 9])
    assert.equal(heap.peekMin(), 5)
    assert.equal(heap.peekMax(), 9)
    assert.equal(heap.size(), 5)

    assert.equal(heap.popMin(), 5)
    assert.equal(heap.size(), 4)
    assert.deepEqual(heap.toArray(), [6, 8, 7, 9])

    assert.equal(heap.popMax(), 9)
    assert.equal(heap.size(), 3)
    assert.deepEqual(heap.toArray(), [6, 8, 7])

    assert.equal(heap.popMax(), 8)
    assert.equal(heap.size(), 2)
    assert.deepEqual(heap.toArray(), [6, 7])

    assert.equal(heap.popMin(), 6)
    assert.equal(heap.size(), 1)
    assert.deepEqual(heap.toArray(), [7])
  })

  it('must sort ascending', function () {
    var heap = new MinMaxHeap()
    heap.pushAll(notSorted)
    assert.deepEqual(heap.popMinAll(), sorted)
    assert.equal(heap.size(), 0)
  })

  it('must sort descending', function () {
    var heap = new MinMaxHeap()
    heap.pushAll(notSorted)
    assert.deepEqual(heap.popMaxAll(), reversed)
    assert.equal(heap.size(), 0)
  })
})
