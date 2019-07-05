<template>
  <div class="wfcomment">
    <div class="wfcomment-left">
      <div class="btn-folder" @click="switchFolder">      
        <Icon type="chevron-right" v-if="unfold"></Icon>
        <Icon type="chevron-left" v-else></Icon>
      </div>
    </div>    
    <div class="wfcomment-container" v-if="unfold">
      <div v-for="item in list" class="row">
        <div class="comment">{{item.comment}}</div>
        <div class="footer">
          <div class="time">{{item.createTime}}</div>
          <div class="name">{{item.creatorName}}</div>
        </div>
      </div>
      <div class="row">
        <Input v-model="comment" type="textarea" :rows="4" placeholder="批注"></Input>
        <div style="margin-top: 10px;">
          <Button type="primary" @click="btnSave" :loading="loading==1">确定</Button>
        </div>
      </div>
    </div>    
  </div>
</template>
<script>
export default {
  components: {　
     
  },
  props: {     
    instId:{
      type:[Number,String],
      default:0
    },
  },
  data() {
    return {
      loading:0,
      list:[],
      comment:'',
      unfold:1,
    }
  },
  mounted: function () { 
    this.load();
  },
  computed: {},
  watch: {
    instId(val, old) {
      if(val){
        this.load();
      }
    }
  },
  methods: {
    load() {
      this.list = [];
      this.loading = 1;
      this.$http.post('/api/engine/comment/list',{instId:this.instId}).then((res) => {
        this.loading = 0;
        if (res.data.code === 0) {
          var data = res.data.data;
          this.list = data;
        } else {
          this.$Message.error(res.data.message);
        }
      }).catch((error) => {
        this.loading = 0;
        this.$Message.error(error.toString())
      })
    },
    btnSave(){
      this.loading = 1;
      this.$http.post('/api/engine/comment/add',{comment:this.comment,instId:this.instId}).then((res) => {
        this.loading = 0;
        if (res.data.code === 0) {
          this.$Message.success('添加成功');
          this.comment = '';
          this.load();
        } else {
          this.$Message.error(res.data.message);
        }
      }).catch((error) => {
        this.loading = 0;
        this.$Message.error(error.toString())
      })
    },
    switchFolder(){
      this.unfold = !this.unfold;
    }
  }
}

</script>

<style type="text/css">
  .wfcomment{
    position: absolute;
    top:42px;
    right: 0px;
    bottom: 0px;    
    z-index: 10;
    overflow-y: hidden; 
    padding-left: 20px;
  }

  .wfcomment-container{
    width: 100%;
    height: 100%;
    overflow-y: auto;        
    border-left: 1px solid #eee;
    background:white;
    width: 210px;
  }

  .wfcomment-left{
    height: 100%;
    position: relative;
    float: left;
    margin-left: -20px;
  }

  .wfcomment.unfold{
     
  }

  .wfcomment .row{
    padding:10px;    
    border-bottom: 1px solid #eee;
  }

  .wfcomment .row:hover{
    background-color: #fafafa;
  }

  .wfcomment .row .footer{
    color:#999;
  }
  .wfcomment .row .footer .name{
    text-align: right;
  }
  .wfcomment .row .footer .time{
    float: left;
  }

  .wfcomment .btn-folder{
    position: absolute;
    top: 50%;  right: -20px;
    border:1px solid #ddd;
    background-color: #efefef;
    border-right: 0;
    padding: 10px 4px; 
    margin-top: -29px;
    cursor: pointer;
  }
  .wfcomment .btn-folder:hover{
    color: white;
    background-color: #2db7f5;
    border-color: #2db7f5;
  }
</style>
