/* eslint-env node, mocha */
var assert = require('chai').assert
var Heap = require('../lib/heap')

describe('heap', function () {
  it('must be a function', function () {
    assert.isFunction(Heap)
  })

  it('must return parent Index', function () {
    assert.equal(Heap.getParentIndex(0), undefined)
    assert.equal(Heap.getParentIndex(1), 0)
    assert.equal(Heap.getParentIndex(2), 0)
    assert.equal(Heap.getParentIndex(3), 1)
    assert.equal(Heap.getParentIndex(4), 1)
    assert.equal(Heap.getParentIndex(5), 2)
    assert.equal(Heap.getParentIndex(6), 2)
  })

  it('must return children Index', function () {
    assert.equal(Heap.getChild1Index(0), 1)
    assert.equal(Heap.getChild2Index(0), 2)

    assert.equal(Heap.getChild1Index(1), 3)
    assert.equal(Heap.getChild2Index(1), 4)

    assert.equal(Heap.getChild1Index(2), 5)
    assert.equal(Heap.getChild2Index(2), 6)

    assert.equal(Heap.getChild1Index(3), 7)
    assert.equal(Heap.getChild2Index(3), 8)

    assert.equal(Heap.getChild1Index(4), 9)
    assert.equal(Heap.getChild2Index(4), 10)
  })

  it('must insert growing elements', function () {
    var heap = new Heap()
    heap.push(5)
    assert.deepEqual(heap.data, [5])
    heap.push(6)
    assert.deepEqual(heap.data, [5, 6])
    heap.push(7)
    assert.deepEqual(heap.data, [5, 6, 7])
    heap.push(8)
    assert.deepEqual(heap.data, [5, 6, 7, 8])
  })

  it('must insert mixed elements', function () {
    var heap = new Heap()
    heap.push(5)
    assert.deepEqual(heap.data, [5])
    heap.push(3)
    assert.deepEqual(heap.data, [3, 5])
    heap.push(4)
    assert.deepEqual(heap.data, [3, 5, 4])
    heap.push(8)
    assert.deepEqual(heap.data, [3, 5, 4, 8])
    heap.push(7)
    assert.deepEqual(heap.data, [3, 5, 4, 8, 7])
    heap.push(2)
    assert.deepEqual(heap.data, [2, 5, 3, 8, 7, 4])
  })

  it('must pop minor elements', function () {
    var heap = new Heap()
    heap.data = [2, 5, 3, 8, 7, 4]

    assert.equal(heap.peek(), 2)
    assert.equal(heap.pop(), 2)

    assert.equal(heap.peek(), 3)
    assert.equal(heap.pop(), 3)

    assert.equal(heap.peek(), 4)
    assert.equal(heap.pop(), 4)

    assert.equal(heap.peek(), 5)
    assert.equal(heap.pop(), 5)

    assert.equal(heap.peek(), 7)
    assert.equal(heap.pop(), 7)

    assert.equal(heap.peek(), 8)
    assert.equal(heap.pop(), 8)
  })

  var notSorted = [6, 0, 28, 1, 3, 12, 11, 16, 17, 25, 4, 14, 24, 15, 8, 26, 7, 10, 2, 21, 23, 22, 13, 9, 5, 20, 18, 27, 29, 19]
  var sorted = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29]
  var reversed = [29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]

  it('must heapsort', function () {
    var out = []
    var i
    var heap = new Heap()

    for (i = 0; i < notSorted.length; i++) {
      heap.push(notSorted[i])
    }

    while (heap.size() > 0) {
      out.push(heap.pop())
    }

    assert.deepEqual(out, sorted)
  })

  it('must heapsort (short syntax)', function () {
    var heap = new Heap()
    heap.pushAll(notSorted)
    assert.deepEqual(heap.popAll(), sorted)
  })

  it('must use comparator', function () {
    var out = []
    var i
    var heap = new Heap(function (a, b) {
      if (a < b) {
        return 1
      } else if (a > b) {
        return -1
      } else {
        return 0
      }
    })

    for (i = 0; i < notSorted.length; i++) {
      heap.push(notSorted[i])
    }

    while (heap.size() > 0) {
      out.push(heap.pop())
    }

    assert.deepEqual(out, reversed)
  })

  describe('remove', function () {
    var h

    beforeEach(function () {
      h = new Heap()
      h.data = [2, 5, 3, 8, 7, 4]
    })

    it('must do nothing if does not find the element', function () {
      var res = h.remove(40)
      assert.isUndefined(res)
      assert.deepEqual(h.data, [2, 5, 3, 8, 7, 4])
    })

    it('must be able to remove the tail', function () {
      var res = h.remove(4)
      assert.equal(res, 4)
      assert.deepEqual(h.data, [2, 5, 3, 8, 7])
    })

    it('must be able to remove the root', function () {
      var res = h.remove(2)
      assert.equal(res, 2)
      assert.deepEqual(h.data, [3, 5, 4, 8, 7])
    })

    it('must be able to remove in the middle', function () {
      var res = h.remove(5)
      assert.equal(res, 5)
      assert.deepEqual(h.data, [2, 4, 3, 8, 7])
    })

    it('must be able to remove in the middle (2)', function () {
      var res = h.remove(7)
      assert.equal(res, 7)
      assert.deepEqual(h.data, [2, 4, 3, 8, 5])
    })

    it('must remove using a function', function () {
      var res = h.remove(function (item) { return item === 7 })
      assert.equal(res, 7)
      assert.deepEqual(h.data, [2, 4, 3, 8, 5])
    })
  })

  describe('replaceIndex', function () {
    var h

    beforeEach(function () {
      h = new Heap()
      h.data = [2, 5, 3, 8, 7, 4]
    })

    it('must be able to replace the tail', function () {
      var res = h.replaceIndex(5, 1)
      assert.equal(res, 4)
      assert.deepEqual(h.data, [1, 5, 2, 8, 7, 3])
    })

    it('must be able to replace the root', function () {
      var res = h.replaceIndex(0, 10)
      assert.equal(res, 2)
      assert.deepEqual(h.data, [3, 5, 4, 8, 7, 10])
    })

    it('must be able to replace in the middle', function () {
      var res = h.replaceIndex(2, 10)
      assert.equal(res, 3)
      assert.deepEqual(h.data, [2, 5, 4, 8, 7, 10])
    })

    it('must be able to replace in the middle (2)', function () {
      var res = h.replaceIndex(2, 0)
      assert.equal(res, 3)
      assert.deepEqual(h.data, [0, 5, 2, 8, 7, 4])
    })
  })

  describe('pushall', function () {
    it('must push an array', function () {
      var h = new Heap()
      h.pushAll([4, 3, 2, 1])
      assert.deepEqual(h.data, [1, 2, 3, 4])
    })
  })

  describe('buildHeap', function () {
    it('must push an array', function () {
      var h = new Heap()
      h.buildHeap([4, 3, 2, 1])
      assert.deepEqual(h.data, [1, 4, 2, 3])
      assert.deepEqual(h.popAll(), [1, 2, 3, 4])
    })
  })

  describe('onMove', function () {
    it('must keep the positions updated', function () {
      var positions = {}
      var h = new Heap(undefined, function (item, index, previousIndex) {
        positions[item] = index
      })
      h.pushAll([4, 3, 2, 1])
      assert.deepEqual(h.data, [1, 2, 3, 4])
      assert.deepEqual(positions, {1: 0, 2: 1, 3: 2, 4: 3})
      h.push(0)
      assert.deepEqual(h.data, [0, 1, 3, 4, 2])
      assert.deepEqual(positions, {0: 0, 1: 1, 3: 2, 4: 3, 2: 4})
      assert.equal(h.pop(), 0)
      assert.deepEqual(h.data, [1, 2, 3, 4])
      assert.deepEqual(positions, {0: undefined, 1: 0, 2: 1, 3: 2, 4: 3})
    })
  })
})
