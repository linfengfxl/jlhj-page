<template>
  <div class="page home">
    <Alert type="warning" banner  show-icon class="notice" >
      <Icon type="android-volume-down" slot="icon"></Icon>
      公告：欢迎
    </Alert>
    <div class="columns">
      <Card class="column">
          <a slot="title" @click="openMyWf">我的待办</a>
          <a @click="openMyWork(item)" v-for="item in myworks">{{item.instName}}</a>
      </Card>
      <Card class="column">
          <a slot="title" >安全库存</a>
          
      </Card>
      <Card class="column">
          <a slot="title" >我的关注</a>
          
      </Card>
      <div class="clear"></div>
    </div>

  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
       myworks:[],
       formItem:{
        instName:'',
        instId:'',
        status:3,
        page:1,
        pageSize:5,
       },
    }
  },
  mounted() {
     this.loadMyWork();
  },
  computed:{
     
  },
  methods: {
    load:function () {
      
    },
    loadMyWork:function(){ 
        
    }, 
    openMyWork(item){
      let routeData = this.$router.resolve({ path:'/workflow/process?inst=' + item.instId + '&task=' + item.taskId});
      window.open(routeData.href, '_blank');
    },
    openMyWf(item){
      this.$router.push({path:'/workflow/mywork'})
    },
  }
}
</script>
<style>
  .page.home{
    width: 900px; 
    margin:0 auto;
  }
  /*公告*/
  .page .notice{
    height: 42px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    font-size: 14px;
  }

  .page .notice.ivu-alert.ivu-alert-with-icon{
    padding: 0px 40px;
    line-height: 42px;
  }

  .page .notice .ivu-alert-icon {
      font-size: 20px;
      top: 0px;
      left: 16px;
      position: absolute;
  }

  /*栏目*/
  .home .columns{
    margin: 0px -10px 0px -10px;
  }
  .home .clear{
     clear:both
  }
  .home .columns .column{
    width: 430px;
    margin:10px;
    float: left;
  }

  .home .column .ivu-card-body a{
    display: block;
    padding: 4px 0px;
    color:#666;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .home .column .ivu-card-body  a:hover{
    color:#4dcdf1;
  }
  .home .column.ivu-card{
    border-radius: 0px;
  }
  .home .column.ivu-card .ivu-card-head{
    padding: 0px 16px;
    height: 42px;
    line-height: 42px;
    color:#333;
  }




</style>


