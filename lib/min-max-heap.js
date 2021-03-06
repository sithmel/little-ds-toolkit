var Heap = require('./heap')

function invertComp (comp) {
  return function (b, a) {
    return comp(a, b)
  }
}

function wrapComp (comp) {
  return function (a, b) {
    return comp(a.value, b.value)
  }
}

function wrapValue (value) {
  return {value: value}
}

function MinMaxHeap (comp) {
  var wrappedComp = wrapComp(comp || function (a, b) {
    if (a > b) {
      return 1
    } else if (a < b) {
      return -1
    } else {
      return 0
    }
  })

  this.minHeap = new Heap(wrappedComp, function (item, index, previousIndex) {
    item.minIndex = index
  })

  this.maxHeap = new Heap(invertComp(wrappedComp), function (item, index, previousIndex) {
    item.maxIndex = index
  })
}

MinMaxHeap.prototype.push = function push (item) {
  var wrapped = wrapValue(item)
  this.minHeap.push(wrapped)
  this.maxHeap.push(wrapped)
}

MinMaxHeap.prototype.buildHeap = function buildHeap (items) {
  var wrapped = items.map(wrapValue)
  this.minHeap.buildHeap(wrapped)
  this.maxHeap.buildHeap(wrapped)
}

MinMaxHeap.prototype.pushAll = function pushAll (items) {
  var wrapped = items.map(wrapValue)
  this.minHeap.pushAll(wrapped)
  this.maxHeap.pushAll(wrapped)
}

MinMaxHeap.prototype.peekMin = function peekMin () {
  return this.minHeap.peek().value
}

MinMaxHeap.prototype.peekMax = function peekMax () {
  return this.maxHeap.peek().value
}

MinMaxHeap.prototype.popMin = function popMin () {
  var item = this.minHeap.pop()
  if (!item) {
    return
  }
  this.maxHeap.removeIndex(item.maxIndex)
  return item.value
}

MinMaxHeap.prototype.popMax = function popMax () {
  var item = this.maxHeap.pop()
  if (!item) {
    return
  }
  this.minHeap.removeIndex(item.minIndex)
  return item.value
}

MinMaxHeap.prototype.popMaxAll = function popMaxAll () {
  var out = []
  while (this.size()) {
    out.push(this.popMax())
  }
  return out
}

MinMaxHeap.prototype.popMinAll = function popMinAll () {
  var out = []
  while (this.size()) {
    out.push(this.popMin())
  }
  return out
}

MinMaxHeap.prototype.size = function size () {
  return this.minHeap.size()
}

MinMaxHeap.prototype.remove = function remove (value) {
  var isEqual = value

  if (typeof value !== 'function') {
    isEqual = function (item) {
      return item.value === value
    }
  }
  var index = this.minHeap.indexOf(function (item) {
    return isEqual(item.value)
  })

  if (index === -1) {
    return
  }

  var item = this.minHeap.get(index)
  this.maxHeap.removeIndex(item.maxIndex)
  this.minHeap.removeIndex(index)
}

MinMaxHeap.prototype.toArray = function () {
  return this.minHeap.toArray().map(function (item) { return item.value })
}

module.exports = MinMaxHeap
