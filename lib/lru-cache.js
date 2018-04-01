var sizeof = require('sizeof')
// utils
function isUndef (item) {
  return typeof item === 'undefined'
}

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

function CacheItem (key, value, ttl, bySize) {
  this.key = key
  this.value = value

  this.next = null
  this.prev = null

  if (ttl) {
    this.expiration = Date.now() + ttl
  }
  if (bySize) {
    this.size = sizeof.sizeof(this.value, false)
  }
}

CacheItem.prototype.isExpired = function () {
  return this.expiration ? Date.now() > this.expiration : false
}

// Cache

function Cache (opts) {
  opts = opts || {}
  opts = typeof opts === 'number' ? { maxLen: opts } : opts
  this.maxSize = opts.maxSize
  this.maxLen = opts.maxLen
  this.defaultTTL = opts.defaultTTL
  this.onDelete = opts.onDelete || function () {}
  try {
    this._cache = new Map()
  } catch (e) {
    this._cache = new FakeMap()
  }
  this.len = 0
  this.size = 0
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
  ttl = isUndef(ttl) ? this.defaultTTL : ttl
  var item = new CacheItem(key, value, ttl, !isUndef(this.maxSize))

  if (this.maxSize && item.size > this.maxSize) {
    throw new Error('Object doesn\'t fit the cache: ' + item.size)
  }

  if (this.has(key)) this._delete(this._cache.get(key))

  if (this.maxSize) {
    this._purgeBySize(item)
  }
  if (this.maxLen) {
    this._purgeByLen()
  }
  // put value in head of linked list
  this._append(item)
}

Cache.prototype._purgeBySize = function (item) {
  while ((this.size + item.size) > this.maxSize && this.len) {
    this.onDelete(this.tail)
    this._delete(this.tail)
  }
}

Cache.prototype._purgeByLen = function () {
  if (this.len === this.maxLen) {
    this.onDelete(this.tail)
    this._delete(this.tail)
  }
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

  if (this.maxSize) {
    this.size -= item.size
  }

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

  if (this.maxSize) {
    this.size += item.size
  }
  this._cache.set(item.key, item)
}

module.exports = Cache
