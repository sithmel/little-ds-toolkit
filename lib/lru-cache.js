// utils
function FakeMap () {
  this._map = {}
}

FakeMap.prototype.has = function (key) {
  return key in this._map
}

FakeMap.prototype.get = function (key) {
  return this._map[key]
}

FakeMap.prototype.set = function (key, value) {
  this._map[key] = value
}

FakeMap.prototype.delete = function (key, value) {
  delete this._map[key]
}

// Cache item
function CacheItem (key, value, ttl) {
  this.key = key
  this.value = value

  this.next = null
  this.prev = null

  if (ttl) {
    this.expiration = Date.now() + ttl
  }
}

CacheItem.prototype.isExpired = function () {
  return this.expiration ? Date.now() > this.expiration : false
}

// Cache
function Cache (opts) {
  opts = opts || {}
  opts = typeof opts === 'number' ? { maxLen: opts } : opts
  this.maxLen = opts.maxLen || Infinity
  this.defaultTTL = opts.defaultTTL
  this.onDelete = opts.onDelete || function () {}
  try {
    this._cache = new Map()
  } catch (e) {
    this._cache = new FakeMap()
  }
  this.len = 0
  // keeping track of double linked list
  this.head = null
  this.tail = null
}

Cache.prototype.get = function (key) {
  if (!this.has(key)) return
  var item = this._cache.get(key)

  if (item.isExpired()) {
    return
  }

  this._delete(item) // remove item from the list and
  this._append(item) // put item at the head

  return item.value
}

Cache.prototype.has = function (key) {
  return this._cache.has(key) && !this._cache.get(key).isExpired()
}

Cache.prototype.peek = function (key) {
  var item = this._cache.get(key)
  return item ? item.value : undefined
}

Cache.prototype.set = function (key, value, ttl) {
  ttl = typeof ttl === 'undefined' ? this.defaultTTL : ttl
  var item = new CacheItem(key, value, ttl)

  if (this.has(key)) this._delete(this._cache.get(key))

  if (this.len === this.maxLen) {
    this.onDelete(this.tail)
    this._delete(this.tail)
  }
  // put value in head of linked list
  this._append(item)
}

Cache.prototype.del = function (key) {
  if (!this.has(key)) return
  var item = this._cache.get(key)
  this.onDelete(item)
  this._delete(item)
}

Cache.prototype._delete = function (item) {
  // delete from tail or from any point of the double linked list
  var prevItem = item.prev
  var nextItem = item.next

  if (this.head === item) {
    this.head = prevItem
  }
  if (this.tail === item) {
    this.tail = nextItem
  }

  if (nextItem) {
    nextItem.prev = prevItem ? prevItem.next : null
  }

  if (prevItem) {
    prevItem.next = nextItem ? nextItem.prev : null
  }

  this.len--

  item.next = null
  item.next = null

  this._cache.delete(item.key)
}

Cache.prototype._append = function (item) {
  // add always to the head
  item.prev = this.head
  if (this.head) {
    this.head.next = item
  }

  this.head = item

  if (!this.tail) {
    this.tail = item
  }

  this.len++

  this._cache.set(item.key, item)
}

module.exports = Cache
