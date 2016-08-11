
function Heap(comp, onMove) {
  this.comp = comp || function (a, b) {
    if (a > b) {
      return 1;
    } else if (a < b) {
      return -1;
    } else {
      return 0;
    }
  };
  this.data = [];
  this.onMove = onMove || function () {};
}

Heap.getParentIndex = function (i) {
  var parent = i % 2 ? (i - 1) / 2 : Math.floor((i - 1) / 2);
  return parent >= 0 ? parent : undefined;
};

Heap.getChild1Index = function (i) {
  return 2 * i + 1;
};

Heap.getChild2Index = function (i) {
  return 2 * i + 2;
};

Heap.prototype._swap = function (x, y) {
  var tmp = this.data[x];
  this.data[x] = this.data[y];
  this.data[y] = tmp;
  this.onMove(this.data[x], x, y);
  this.onMove(this.data[y], y, x);
};

Heap.prototype._bubbleUp = function bubbleUp(i) {
  var parentIndex;
  var data = this.data;
  var comp = this.comp;
  while (i > 0) {
    parentIndex = Heap.getParentIndex(i);
    if (comp(data[i], data[parentIndex]) < 0) {
      this._swap(i, parentIndex);
      i = parentIndex;
    }
    else {
      return i;
    }
  }
};

Heap.prototype._bubbleDown = function bubbleDown(i) {
  var data = this.data;
  var comp = this.comp;
  var child1Index, child2Index,
    child1isSmaller, child2isSmaller;
  while (i < data.length) {
    child1Index = Heap.getChild1Index(i);
    child2Index = Heap.getChild2Index(i);
    child1isSmaller = typeof data[child1Index] !== 'undefined' ? comp(data[child1Index], data[i]) < 0 : false;
    child2isSmaller = typeof data[child2Index] !== 'undefined' ? comp(data[child2Index], data[i]) < 0 : false;
    if (child1isSmaller && child2isSmaller) {
      if (comp(data[child1Index], data[child2Index]) < 0) {
        this._swap(child1Index, i);
        i = child1Index;
      }
      else {
        this._swap(child2Index, i);
        i = child2Index;
      }
    }
    else if (child1isSmaller) {
      this._swap(child1Index, i);
      i = child1Index;
    }
    else if (child2isSmaller) {
      this._swap(child2Index, i);
      i = child2Index;
    }
    else {
      return i;
    }
  }
};

Heap.prototype.pushAll = function (items) {
  for (var i = 0; i < items.length; i++) {
    this.push(items[i]);
  }
};

Heap.prototype.push = function (item) {
  this.data.push(item);
  this.onMove(this.data[this.data.length - 1], this.data.length - 1);
  this._bubbleUp(this.data.length - 1);
};

Heap.prototype.peek = function () {
  return this.data[0];
};

Heap.prototype.pop = function () {
  var root = this.data[0];
  var last = this.data.pop();

  if (this.data.length !== 0) {
    this.data[0] = last;
    this.onMove(this.data[0], 0);
    this._bubbleDown(0);
  }
  return root;
};

Heap.prototype.popAll = function () {
  var out = [];
  while (this.size()) {
    out.push(this.pop());
  }
  return out;
};

Heap.prototype.size = function () {
  return this.data.length;
};

Heap.prototype.indexOf = function (value) {
  var n, i = -1;
  var last;

  if (typeof value === 'function') {
    for (n = 0; n < this.data.length; n++) {
      if (value(this.data[n])) {
        i = n;
        break;
      }
    }
  }
  else {
    i = this.data.indexOf(value);
  }
  return i;
};

Heap.prototype.remove = function (value) {
  var i = this.indexOf(value);
  return this.removeIndex(i);
};

Heap.prototype.get = function (i) {
  return this.data[i];
};

Heap.prototype.removeIndex = function (i) {
  var last;
  if (i === -1) return;

  if (i === this.data.length - 1) {
    last = this.data.pop();
    return last;
  }

  this._swap(i, this.data.length - 1);

  last = this.data.pop();

  if (this.data.length > 1) {
    this._bubbleUp(i);
    this._bubbleDown(i);
  }
  return last;
};

Heap.prototype.replaceIndex = function (i, value) {
  var last;
  if (i === -1) return;
  this.data.push(value);

  this._swap(i, this.data.length - 1);

  last = this.data.pop();

  if (this.data.length > 1) {
    this._bubbleUp(i);
    this._bubbleDown(i);
  }
  return last;
};

Heap.prototype.toArray = function () {
  return this.data.slice(0);
};

module.exports = Heap;
