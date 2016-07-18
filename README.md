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
The constructor function can take as argument the comparator used to internally sort the items:
```js
var heap = new Heap(function (a, b) { return a < b; });
```
You can add items:
```js
heap.push(item); // Θ(log n)
```
and remove and get the minimum (or maximum, depending on the comparator)
```js
var min = heap.pop(); // Θ(log n)
```
Peeking without removing it is even more efficient:
```js
var min = heap.peek(); // Θ(1)
```
You can also remove an arbitrary item ( O(logn) ):
```js
heap.remove(item); // Θ(log n)
```
or
```js
heap.remove(function (item) { // Θ(log n)
  return item === 5;
});
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
item.union(item2); // almost Θ(1) (grows as the inverse Ackerman function)
```
and find:
```js
item.find(); // almost Θ(1) (grows as the inverse Ackerman function)
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
* defaultTTL: default time to live. Older items are considered stale

It makes sense to use at either one of maxSize or maxLen, or it is not going to behave differently from a simple object.
You can set an item:
```js
cache.set(key, value, ttl); // the time to live is optional Θ(1)
```
and get an item:
```js
var value = cache.get(key); // Θ(1)
```
If the item is not in the cache or stale, it'll return undefined.
getStale will return a stale object:
```js
var value = cache.getStale(key); // Θ(1)
```
You can remove an item from the cache using:
```js
cache.del(key); // Θ(1)
```
cache.len is an attribute containing the number of items.
cache.size contains the used memory (in bytes). This is only used when you set a "maxSize".

 
