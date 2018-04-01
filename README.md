little-ds-toolkit
=================
[![Build Status](https://travis-ci.org/sithmel/little-ds-toolkit.svg?branch=master)](https://travis-ci.org/sithmel/little-ds-toolkit)

This is a little collection of some useful data structures. The goal is not giving an exhaustive list and implementation of all existing data structures. But rather a small set of the most useful ones.

heap
====
This data structure is particularly efficient when it comes to repetitively return the minimum (or maximum, depending on the sorting) item contained, while inserting items in a random order.

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
  return a.value - b.value;
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
heap.get(3); // Θ(1)

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
There "pushAll" and "popAll" methods are shortcuts to insert an array of items in the heap, or retrieving them. Combined together the can be used to build the heapsort sorting algorithm:
```js
var heap = new Heap();
heap.pushAll(unsorted_array);
heap.popAll(); // returns a sorted array
```
The "toArray" method returns the inner array representation (partially sorted).

Advanced features: updating item order and removing items
---------------------------------------------------------
An algorithm may require to remove items or update the sorting order. These operations can be expensive as they require to search the item to remove or replace (O(n)). You can solve this problem with some additional book keeping, using the "onMove" callback.
This function can be passed to the contructor (as second argument) and is called every time an item moves in the heap.
```js
var itemPos = {};
var heap = new Heap(undefined, function (item, nextPos, previousPos) {
  itemPos[item.id] = nextPos;
});
```
Using this you can easily remove or replace an item in O(log n):
```js
// removing item "A"
heap.removeIndex(itemPos.A);

// replace item "A"
heap.replaceIndex(itemPos.A, newItem);
```

min-max-heap
============
This data structure implements the same features of the heap (with the same asymptotic running time), but it also allow to pop maximum values in the same way.
It is implemented internally by 2 heaps, with the opposite comparator, pointing one another.
You can create an instance with:
```js
var MinMaxHeap = require('little-ds-toolkit/lib/min-max-heap');
```
or
```js
var MinMaxHeap = require('little-ds-toolkit').MinMaxHeap;

var heap = new MinMaxHeap(optionalComparator);
```
Here is a list of the methods:

* push: push one item in the heap O(log n)
* pushAll: push a list of items in the heap O(n)
* popMin: pop the minimum item from the heap O(log n)
* popMax: pop the maximum item from the heap O(log n)
* peekMin: peek the minimum item from the heap O(1)
* peekMax: peek the maximum item from the heap O(1)
* popMinAll: pop all items from the heap O(n log n)
* popMaxAll: pop all items from the heap in reversed order O(n log n)
* size: returns the number of items stored O(1)
* remove: remove an item from the heap O(n)
* toArray: return a partially sorted array O(1)

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
item.union(item2); // almost O(1) (grows very slowly)
```
and find:
```js
item.find(); // almost O(1) (grows very slowly)
```
Both "find" and "union" return the "leader" element. The important part is that 2 elements with the same leader belong to the same set.
You can retrieve the original value with "item.data".

The object contains 2 useful helper functions "union" and "find" that runs on both UnionFind instances or other values.
```js
// the arguments can be any value (or a UnionFind instance)
var leader = UnionFind.find(item);
var leader = UnionFind.union(item1, item2);
```

lru-cache
=========
This data structure is a key value cache. The least used items are purged from the cache when it reaches its maximum size (or length).
If ES2015 Map are available this can use anything as "key". For old js it only supports strings.

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

* maxLen: maximum items
* defaultTTL: default time to live. Older items are considered stale and not returned
* onDelete: optional function, it is called when an item is removed from the cache

If maxLen is not set that would be equal Infinity, in this way it is going to behave just like a simple map (please set one!).

Stale items are not removed from the cache, they are not returned and they should go towards the end of the queue, and therefore be purged by the LRU algorithm.

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
