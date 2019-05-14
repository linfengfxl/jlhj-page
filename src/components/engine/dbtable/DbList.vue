<template>
  <div class="engine-apilist">
    <Tabs :animated="false" v-model="tabName" class="top" @on-click="goTab">
      <TabPane label="Api 列表" name="0" ></TabPane>
      <TabPane label="页面配置" name="1" v-if="false"></TabPane>
      <TabPane label="数据库表" name="2" ></TabPane>
    </Tabs> 
    <DbListLeft ref="dbListLeft" class="left" @on-current-change="curApiChange"></DbListLeft> 
    <DbEdit ref="dbEdit" :apiObject="curApi" class="right" @on-save="loadList"></DbEdit> 
  </div>
</template>
<script>

import DbListLeft from './DbListLeft'; 
import DbEdit from './DbEdit'; 

export default {
  components: {
    DbListLeft,
    DbEdit
  },
  data() {
    var that = this;
    return {
      tabName:'2',
      curApi:null,
    }
  },
  mounted:function(){ 
  },
  methods:{
    goTab(index){
      var pages = ['/engine/api','','/engine/db']; 
      this.goPage(pages[index]);
    }, 
    goPage:function (path) {
      this.$router.push({path:path});
    },
    curApiChange(api){
      this.curApi = api;
    },
    loadList(api){
      this.$refs.DbListLeft.load(api.api);
    }
  }
}

</script>

<style type="text/css">
  .engine-apilist{
    height: 100%;
    width: 100%; 
    padding-top: 37px;
    padding-left: 200px;
    overflow:hidden;
  }
  .engine-apilist .top{
    position: absolute;
    top:0px;
    left:0px;
    right: 0px;
  }
  .engine-apilist .left{
    position: absolute;
    left:0px;
    bottom: 0px;
    top:37px;
    height: auto;
  }
</style>
