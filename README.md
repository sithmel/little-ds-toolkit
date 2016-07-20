little-ds-toolkit
=================
[![Build Status](https://travis-ci.org/sithmel/little-ds-toolkit.svg?branch=master)](https://travis-ci.org/sithmel/little-ds-toolkit)

This is a little collection of some useful data structures. The goal is not giving an exhaustive list and implementation of all existing data structures. But rather a small set of the most useful ones.

heap
====
This data structure is particularly efficient when it comes to repetitively return the minimum (or maximum) item contained, while inserting items in a random order.

You can import it with:
```js
var Heap = require('little-ds-toolkit/lib/heap');
```
or
```js
var Heap = require('little-ds-toolkit').Heap;
```
Creating an instance:
```js
var heap = new Heap();
```
The constructor function can take as argument the comparator used to internally sort the items (just like Array.prototype.sort):
```js
var heap = new Heap(function (a, b) {
  if (a.value < b.value) {
    return 1;
  } esle if (a.value > b.value) {
    return -1;
  } else {
    return 0;
  }
});
```
You can add items:
```js
heap.push(item); // Θ(log n)
```
remove and get the minimum (or maximum, depending on the comparator)
```js
var min = heap.pop(); // Θ(log n)
```
Peeking without removing it is even more efficient:
```js
var min = heap.peek(); // Θ(1)
```
Searching across the data structure is not particularly efficient, it returns a valid index or -1 (not found):
```js
heap.indexOf(item); // Θ(n)
```
You can also pass a function that should return true when the item is found:
```js
heap.indexOf(function (item) { // Θ(n)
  return item.prop === 5;
});
```
Using the index you can get or remove an item:
```js
heap.getIndex(3); // Θ(1)

heap.removeIndex(3); // Θ(log n)
```
removeIndex returns the item removed.

The "remove" method is a short for indexOf + removeIndex.
```js
heap.remove(item); // Θ(n + log n)
// is the same as:
heap.removeIndex(heap.indexOf(item)); // Θ(n + log n)
```
You can get the length of the heap with:
```js
heap.size(); // Θ(1)
```

union-find
==========
This data structure is useful to group item together and tell if one or more items belongs to the same group.

You can import it with:
```js
var UnionFind = require('little-ds-toolkit/lib/union-find');
```
or
```js
var UnionFind = require('little-ds-toolkit').UnionFind;
```
You can create an UnionFind node:
```js
var item = new UnionFind(value);
```
It has only two methods. Union:
```js
item.union(item2); // almost Θ(1) (grows very slowly)
```
and find:
```js
item.find(); // almost Θ(1) (grows very slowly)
```
The find returns the element "leader". The important part is that 2 elements with the same leader belongs to the same group.

lru-cache
=========
This data structure is a key value cache. The least used items are purged from the cache when it reaches its maximum size (or length).

You can import it with:
```js
var LRUCache = require('little-ds-toolkit/lib/lru-cache');
```
or
```js
var LRUCache = require('little-ds-toolkit').LRUCache;
```
You create a cache using:
```js
var cache = new LRUCache(options);
```
The options are:

* maxSize: maximum size in byte
* maxLen: maximum items
* defaultTTL: default time to live. Older items are considered stale and not returned

It makes sense to use either one of maxSize or maxLen, or it is not going to behave differently from a simple object.
You can set an item:
```js
cache.set(key, value, ttl); // the time to live is optional Θ(1)
```
and get an item:
```js
var value = cache.get(key); // Θ(1)
```
If the item is not in the cache or stale, it'll return undefined.
The "peek" method is not altering the LRU data structure while returning a value. It is also returning stale objects.
```js
var value = cache.peek(key); // Θ(1)
```
You can remove an item from the cache using:
```js
cache.del(key); // Θ(1)
```
You can check if a value is in the cache using "has":
```js
cache.has(key); // Θ(1)
```
It returns a boolean.
cache.len is an attribute containing the number of items.
cache.size contains the used memory (in bytes). This is only used when you set a "maxSize".
