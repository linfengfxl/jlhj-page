var router = {}
// 监听路由变化，判断是否缓存页面
router.afterEach = function(to,from){
  if(typeof(to.query.forward) == 'undefined'){
    clear(from);
  }

  clearAfter(to);
}

// 清除指定路由缓存
function clear(from){
  if(from && from.matched.length && from.matched[0].instances && from.matched[0].instances.default){
    var vm = from.matched[0].instances.default;
    if(vm.$vnode.parent && vm.$vnode.parent.componentInstance && vm.$vnode.parent.componentInstance.cache)
    {
      if (vm.$vnode.componentOptions)
      {
        var key = vm.$vnode.key == null
            ? vm.$vnode.componentOptions.Ctor.cid + (vm.$vnode.componentOptions.tag ? `::${this.$vnode.componentOptions.tag}` : '')
            : vm.$vnode.key;
        var cache = vm.$vnode.parent.componentInstance.cache;
        var keys  = vm.$vnode.parent.componentInstance.keys;
        if (cache[key])
        {
            if (keys.length) {
                var index = keys.indexOf(key);
                if (index > -1) {
                    keys.splice(index, 1);
                }
            }
            delete cache[key];
        }
      }
    }
    vm.$destroy(false);
  }
}
// 清除指定路由之后的缓存
function clearAfter(to){
  if(to && to.matched.length && to.matched[0].instances && to.matched[0].instances.default){
    var vm = to.matched[0].instances.default;

    if(vm.$vnode.parent && vm.$vnode.parent.componentInstance && vm.$vnode.parent.componentInstance.cache)
    {
      if (vm.$vnode.componentOptions)
      {
          var key = vm.$vnode.key == null
              ? vm.$vnode.componentOptions.Ctor.cid + (vm.$vnode.componentOptions.tag ? `::${this.$vnode.componentOptions.tag}` : '')
              : vm.$vnode.key;
          var cache = vm.$vnode.parent.componentInstance.cache;
          var keys  = vm.$vnode.parent.componentInstance.keys;

          var start = keys.indexOf(key);
          if(start>=0 && keys.length>(start+1)){
            for(var i = start+1;i<keys.length;i++){
              if(cache[keys[i]]){
                delete cache[keys[i]]
              }
            }
            keys.splice(start+1);
          }
      }
    }      
  }
} 

export default router;