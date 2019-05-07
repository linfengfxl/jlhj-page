<template>
  <div class="dblist-left">
    <table class="layout" cellpadding="0" cellspacing="0">
      <tr>
        <td class="searchbar">
          <div style="position:relative;">
            <Input v-model="keyword" placeholder="关键字过滤" style="width:100%" clearable ></Input>
          </div> 
        </td> 
      </tr>
      <tr>
        <td style="position:relative">
          <div class="list">
            <div :class="{'list-item':1,'select':curApi == item}" v-for="(item,index) in listFilter" @click="select(item)">
               <div class="api"><span style="color:#ccc">{{index+1}}.</span> {{item.tableName}}</div>
               <div class="title">{{item.caption}}</div>
            </div>
          </div> 
        </td>
      </tr>
    </table>
  </div> 
</template>
<script> 
  import Loading from '@/components/loading'; 

  export default {
    components: {
       
    },
    props: {
    },
    data() {
      var that = this;
      return {
        loading:0, 
        list:[],
        keyword:'',
        curApi:null,
      }
    },
    mounted:function(){
      this.load();
    },
    watch:{
      curApi(val){
        this.$emit('on-current-change',val);
      }
    },
    computed:{ 
      listFilter(){
        var list = [];
        this.list.map((item)=>{
          if((item.caption + item.tableName).toLowerCase().indexOf(this.keyword)>=0){
            list.push(item);
          }
        });
        return list;
      }
    },
    methods:{
      load(){
        this.loading = 1;
        this.$http.post('/api/engine/db.tableName', {pageSize:1000}).then((res) => {
          this.loading = 0;
          if (res.data.code == 0) {
            var curIndex = this.list.indexOf(this.curApi);
            this.list = res.data.data;
            if(this.curApi){
              var api = this.curApi.api;
              var curApi = null;
              this.list.map(item=>{
                if(item.api == api){
                  curApi = item;
                }
              })
              if(curApi == null && this.list.length > 0){
                if(curIndex >= this.list.length){
                  curIndex = this.list.length - 1;
                }
                curApi = this.list[curIndex];
              }
              this.curApi = curApi;
            }
          } else {
            this.$Message.error(res.data.message)
          }
        }).catch((error) => { 
          this.loading = 0;
          this.$Message.error(error.message)
        });
      },
      select(item){
        this.curApi = item;
      },
      add(){
        this.curApi = {id:0};
      }
    }
  }

</script>

<style type="text/css">
  .dblist-left{
    height: 100%;
    width: 200px;
    background-color: white;
    border-right: 1px solid #eeeeee;
  }

  .dblist-left .searchbar{
    height: 42px;
    font-size: 12px;
    padding: 0 10px;
    border-bottom: 1px solid #eeeeee;
  }

  .dblist-left .layout{
    width: 100%;
    height: 100%;
    table-layout:fixed ;
  }

  .dblist-left .list{
    height: 100%;
    vertical-align: top;
    overflow-x: hidden;
    overflow-y: auto;
    background-color: white;
    z-index: 10;
  }

  .dblist-left .list:hover{
    top:0px;
    overflow-x: auto;
    position: absolute;
    width: 300px;
    border-right: 1px solid #eeeeee;
  } 

  .dblist-left .list-item{
    border-bottom: 1px solid #eeeeee;
    padding: 4px;
    cursor: pointer;
  }
  .dblist-left .list-item:hover,.dblist-left .list-item.select{
    background-color:#e8f8fd;
  }
  .dblist-left .list-item .api{
    padding: 0 6px;
    height: 20px;
    line-height: 20px;
    font-size: 16px;
    color: orange;
    white-space: nowrap;
  }
  .dblist-left .list-item .title{
    padding: 0 6px;
    height: 20px;
    line-height: 20px;
    font-size: 12px;
    color: #999;
  }
</style>

