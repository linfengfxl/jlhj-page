import Vue from 'vue'
import Router from 'vue-router'

import frameComps from './frame'
import pageComps from './page'

var components = [];

function buildRouterObjs(components,routerObjs){
    routerObjs = routerObjs || [];
    for(var i = 0;i<components.length;i++){
        let ele = components[i];

        routerObjs.push({
            path: ele.path,
            name: ele.name,
            meta:ele.meta,
            component: () => import ('@/components/' + ele.component),
            children: buildRouterObjs(ele.children || [])
        });

    }
    return routerObjs;
}

let routes = buildRouterObjs(components);
buildRouterObjs(frameComps,routes); 
buildRouterObjs(pageComps,routes); 

Vue.use(Router)
export default new Router({
    routes: routes
})
