/* eslint-env node, mocha */
var assert = require('chai').assert
var Cache = require('../lib/lru-cache')

describe('lru-cache', function () {
  describe('init', function () {
    it('must init default values', function () {
      var cache = new Cache()
      assert.equal(cache.len, 0)
      assert.equal(cache.maxLen, Infinity)
      assert.isUndefined(cache.defaultTTL)
    })
    it('must init maxlen', function () {
      var cache = new Cache(5)
      assert.equal(cache.len, 0)
      assert.equal(cache.maxLen, 5)
      assert.isUndefined(cache.defaultTTL)
    })
    it('must init opts obj', function () {
      var cache = new Cache({maxLen: 5, maxSize: 6, defaultTTL: 10})
      assert.equal(cache.len, 0)
      assert.equal(cache.maxLen, 5)
      assert.equal(cache.defaultTTL, 10)
    })
  })
  describe('set', function () {
    it('must set value', function () {
      var cache = new Cache()
      cache.set('key1', 'value1')
      assert.equal(cache.len, 1)

      assert.equal(cache._cache.get('key1'), cache.head)
      assert.equal(cache.head.key, 'key1')
      assert.equal(cache.head.value, 'value1')

      assert.equal(cache._cache.get('key1'), cache.tail)
      assert.equal(cache._cache.get('key1').prev, null)
      assert.equal(cache._cache.get('key1').next, null)
    })
    it('must set value, and then same value', function () {
      var cache = new Cache()
      cache.set('key1', 'value1')
      cache.set('key1', 'value2')
      assert.equal(cache.len, 1)

      assert.equal(cache._cache.get('key1'), cache.head)
      assert.equal(cache.head.key, 'key1')
      assert.equal(cache.head.value, 'value2')

      assert.equal(cache._cache.get('key1'), cache.tail)
      assert.equal(cache._cache.get('key1').prev, null)
      assert.equal(cache._cache.get('key1').next, null)
    })
    it('must set second value', function () {
      var cache = new Cache()
      cache.set('key1', 'value1')
      cache.set('key2', 'value2')
      assert.equal(cache.len, 2)

      assert.equal(cache._cache.get('key2'), cache.head)
      assert.equal(cache.head.key, 'key2')
      assert.equal(cache.head.value, 'value2')

      assert.equal(cache._cache.get('key1'), cache.tail)

      assert.equal(cache._cache.get('key1').prev, null)
      assert.equal(cache._cache.get('key2').prev, cache._cache.get('key1'))
      assert.equal(cache._cache.get('key1').next, cache._cache.get('key2'))
      assert.equal(cache._cache.get('key2').next, null)
    })
    it('must set second value, and reset first', function () {
      var cache = new Cache()
      cache.set('key1', 'value1')
      cache.set('key2', 'value2')
      cache.set('key1', 'value3')
      assert.equal(cache.len, 2)

      assert.equal(cache._cache.get('key1'), cache.head)

      assert.equal(cache.head.key, 'key1')
      assert.equal(cache.head.value, 'value3')

      assert.equal(cache._cache.get('key2'), cache.tail)
      assert.equal(cache._cache.get('key1'), cache.head)

      assert.equal(cache._cache.get('key1').prev, cache._cache.get('key2'))
      assert.equal(cache._cache.get('key1').next, null)
      assert.equal(cache._cache.get('key2').next, cache._cache.get('key1'))
      assert.equal(cache._cache.get('key2').prev, null)
    })
    it('must set 3 values', function () {
      var cache = new Cache()
      cache.set('key1', 'value1')
      cache.set('key2', 'value2')
      cache.set('key3', 'value3')
      assert.equal(cache.len, 3)

      assert.equal(cache._cache.get('key3'), cache.head)

      assert.equal(cache.head.key, 'key3')
      assert.equal(cache.head.value, 'value3')

      assert.equal(cache._cache.get('key1'), cache.tail)

      assert.equal(cache._cache.get('key1').prev, null)
      assert.equal(cache._cache.get('key1').next, cache._cache.get('key2'))

      assert.equal(cache._cache.get('key2').next, cache._cache.get('key3'))
      assert.equal(cache._cache.get('key2').prev, cache._cache.get('key1'))

      assert.equal(cache._cache.get('key3').next, null)
      assert.equal(cache._cache.get('key3').prev, cache._cache.get('key2'))
    })
    it('must set 3 values (twice)', function () {
      var cache = new Cache()
      cache.set('key1', 'value1')
      cache.set('key2', 'value2')
      cache.set('key3', 'value3')
      cache.set('key1', 'value1')
      cache.set('key2', 'value2')
      cache.set('key3', 'value3')
      assert.equal(cache.len, 3)

      assert.equal(cache._cache.get('key3'), cache.head)

      assert.equal(cache.head.key, 'key3')
      assert.equal(cache.head.value, 'value3')

      assert.equal(cache._cache.get('key1'), cache.tail)

      assert.equal(cache._cache.get('key1').prev, null)
      assert.equal(cache._cache.get('key1').next, cache._cache.get('key2'))

      assert.equal(cache._cache.get('key2').next, cache._cache.get('key3'))
      assert.equal(cache._cache.get('key2').prev, cache._cache.get('key1'))

      assert.equal(cache._cache.get('key3').next, null)
      assert.equal(cache._cache.get('key3').prev, cache._cache.get('key2'))
    })
  })
  describe('get', function () {
    it('must put item on the head', function () {
      var cache = new Cache()
      cache.set('key1', 'value1')
      cache.set('key2', 'value2')
      cache.set('key3', 'value3')
      assert.equal(cache.get('key1'), 'value1')

      assert.equal(cache.len, 3)

      assert.equal(cache._cache.get('key1'), cache.head)

      assert.equal(cache.head.key, 'key1')
      assert.equal(cache.head.value, 'value1')

      assert.equal(cache._cache.get('key2'), cache.tail)

      assert.equal(cache._cache.get('key2').prev, null)
      assert.equal(cache._cache.get('key2').next, cache._cache.get('key3'))

      assert.equal(cache._cache.get('key3').next, cache._cache.get('key1'))
      assert.equal(cache._cache.get('key3').prev, cache._cache.get('key2'))

      assert.equal(cache._cache.get('key1').next, null)
      assert.equal(cache._cache.get('key1').prev, cache._cache.get('key3'))
    })
  })
  describe('ttl', function () {
    it('must use the default ttl', function (done) {
      var cache = new Cache({defaultTTL: 5})
      cache.set('key1', 'value1')
      assert.equal(cache.get('key1'), 'value1')
      setTimeout(function () {
        assert.isUndefined(cache.get('key1'))
        done()
      }, 10)
    })
    it('must use the custom ttl', function (done) {
      var cache = new Cache({defaultTTL: 150})
      cache.set('key1', 'value1', 5)
      assert.equal(cache.get('key1'), 'value1')
      setTimeout(function () {
        assert.isUndefined(cache.get('key1'))
        done()
      }, 10)
    })
  })
  describe('maxLen', function () {
    it('must fit a fixed amount of items', function () {
      var cache = new Cache(2)
      cache.set('key1', 'value1')
      cache.set('key2', 'value2')
      cache.set('key3', 'value3')

      assert.equal(cache.get('key2'), 'value2')
      assert.equal(cache.get('key3'), 'value3')

      assert.equal(cache.len, 2)

      assert.isUndefined(cache.get('key1'))

      assert.equal(cache._cache.get('key2'), cache.tail)
      assert.equal(cache._cache.get('key3'), cache.head)
    })

    it('must call onDelete', function () {
      var called = 0
      var cache = new Cache({onDelete: function (item) {
        assert.equal(item.key, 'key1')
        assert.equal(item.value, 'value1')
        called++
      },
      maxLen: 1})
      cache.set('key1', 'value1')
      cache.set('key2', 'value2')

      assert.equal(called, 1)
    })
  })

  describe('del', function () {
    it('must delete obj', function () {
      var cache = new Cache()
      cache.set('key1', 'value1')
      cache.del('key1')
      assert.equal(cache.len, 0)
    })
  })
})
