function UnionFind(data) {
  this.leader = this;
  this.rank = 0;
  this.data = data;
}

UnionFind.prototype.find = function () {
  var node = this;
  var i, paths = [];
  while (node.leader !== node) {
    paths.push(node);
    node = node.leader;
  }
  // path compression
  for (i = 0; i < paths.length; i++) {
    paths[i].leader = node;
  }
  return node;
};

UnionFind.prototype.union = function (that) {
  var leader1 = this.find();
  var leader2 = that.find();
  if (leader1 === leader2) return; // already in same group

  if (leader1.rank === leader2.rank) {
    leader1.leader = leader2;
    // update the rank
    leader2.rank = leader1.rank + 1;
  }
  if (leader1.rank > leader2.rank) {
    leader2.leader = leader1; // the shallow should get installed under the deep
  }
  else {
    leader1.leader = leader2;
  }
};

module.exports = UnionFind;
