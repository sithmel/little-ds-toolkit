function UnionFind (data) {
  this.leader = this
  this.rank = 0
  this.data = data
}

UnionFind.prototype.find = function () {
  var node = this
  var i
  var paths = []
  while (node.leader !== node) {
    paths.push(node)
    node = node.leader
  }
  // path compression
  for (i = 0; i < paths.length; i++) {
    paths[i].leader = node
  }
  return node
}

UnionFind.prototype.union = function (that) {
  var leader1 = this.find()
  var leader2 = that.find()
  if (leader1 === leader2) return leader1 // already in same group

  if (leader1.rank === leader2.rank) {
    leader1.leader = leader2
    // update the rank
    leader2.rank = leader1.rank + 1
    return leader2
  }
  if (leader1.rank > leader2.rank) {
    leader2.leader = leader1 // the shallow should get installed under the deep
    return leader1
  }
  leader1.leader = leader2
  return leader2
}

/*
class methods
*/
UnionFind.union = function (item1, item2) {
  item1 = item1 instanceof UnionFind ? item1 : new UnionFind(item1)
  item2 = item2 instanceof UnionFind ? item2 : new UnionFind(item2)
  return item1.union(item2)
}

UnionFind.find = function (item) {
  item = item instanceof UnionFind ? item : new UnionFind(item)
  return item.find()
}

module.exports = UnionFind
