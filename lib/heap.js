
function Heap(comp) {
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


Heap.swap = function (data, x, y) {
  var tmp = data[x];
  data[x] = data[y];
  data[y] = tmp;
};

Heap.bubbleUp = function (data, i, comp) {
  var parentIndex;
  while (i > 0) {
    parentIndex = Heap.getParentIndex(i);
    if (comp(data[i], data[parentIndex]) < 0) {
      Heap.swap(data, i, parentIndex);
      i = parentIndex;
    }
    else {
      return i;
    }
  }
};

Heap.bubbleDown = function (data, i, comp) {
  var child1Index, child2Index,
    child1isSmaller, child2isSmaller;
  while (i < data.length) {
    child1Index = Heap.getChild1Index(i);
    child2Index = Heap.getChild2Index(i);
    child1isSmaller = typeof data[child1Index] !== 'undefined' ? comp(data[child1Index], data[i]) < 0 : false;
    child2isSmaller = typeof data[child2Index] !== 'undefined' ? comp(data[child2Index], data[i]) < 0 : false;
    if (child1isSmaller && child2isSmaller) {
      if (comp(data[child1Index], data[child2Index]) < 0) {
        Heap.swap(data, child1Index, i);
        i = child1Index;
      }
      else {
        Heap.swap(data, child2Index, i);
        i = child2Index;
      }
    }
    else if (child1isSmaller) {
      Heap.swap(data, child1Index, i);
      i = child1Index;
    }
    else if (child2isSmaller) {
      Heap.swap(data, child2Index, i);
      i = child2Index;
    }
    else {
      return i;
    }
  }
};


Heap.prototype.push = function (item) {
  this.data.push(item);
  Heap.bubbleUp(this.data, this.data.length - 1, this.comp);
};

Heap.prototype.peek = function () {
  return this.data[0];
};

Heap.prototype.pop = function () {
  var root = this.data[0];
  var last = this.data.pop();

  if (this.data.length !== 0) {
    this.data[0] = last;
    Heap.bubbleDown(this.data, 0, this.comp);
  }
  return root;
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

Heap.prototype.getIndex = function (i) {
  return this.data[i];
};

Heap.prototype.removeIndex = function (i) {
  if (i === -1) return;

  if (i === this.data.length - 1) {
    last = this.data.pop();
    return last;
  }

  Heap.swap(this.data, i, this.data.length - 1);

  last = this.data.pop();

  if (this.data.length > 1) {
    Heap.bubbleUp(this.data, i, this.comp);
    Heap.bubbleDown(this.data, i, this.comp);
  }
  return last;
};


module.exports = Heap;
