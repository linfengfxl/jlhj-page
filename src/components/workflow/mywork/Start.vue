<template>
  <div class="page wfstart">
    <div class="page-title">发起审批</div>
    <div class="wfstart-box">
      <template v-for="group in list">
        <div style="clear: both;"></div>
        <div class="wfstart-box-header">{{group.title}}</div>
        <div class="wfstart-box-item" v-for="item in group.forms" @click="goPage(item)"  v-if="$user.hasPower('fq.'+item.key)">
          <Icon type="paper-airplane icon"></Icon>
          {{item.title}} 
        </div>
      </template>      
    </div>
  </div>
</template>
<script>
  export default {
    components: { 
    },
    data() {       
      return {         
        list:[] 
      }
    },
    mounted: function () { 
      this.load();
    },
    computed: {},
    methods: {
      load:function(id){
        this.$http.post('/api/engine/workflow/form/list').then((res) => {
          if (res.data.code === 0) {
            this.list = [
              {id:'1',title:'财务',forms:[]},
              {id:'2',title:'仓库',forms:[]},
              {id:'3',title:'运输',forms:[]},
              {id:'9',title:'其它',forms:[]}
            ];

            res.data.data.map(item=>{
              this.list.map(group=>{
                if(item.module == group.id){
                  group.forms.push(item);
                }
              });
            });

          } else {
            this.$Message.error(res.data.message);
          }
        }).catch((error) => {
            this.$Message.error(error.toString())
        })
      },
      goPage(item){
        if(item.startUrl == ''){
          this.$Message.error('未配置 url');
          return;
        }
        this.$router.push({ path: item.startUrl });
      }
    }
  }

</script>

<style type="text/css">
  .wfstart-box{
    padding: 10px;    
    max-width: 920px;
    margin:0 auto;
    margin-top: 40px;
  }
  .wfstart-box-header{
    clear: both;
    font-size: 18px;
    color: #2b579a;
    margin-top: 15px;
    padding-left: 10px;
    border-left:2px solid #2b579a;
  }

  .wfstart-box-item{
    color:#2b579a;
    width: 280px;
    height: 50px;    
    line-height: 50px;
    border:1px solid #BFD2ED;   
    border-radius: 3px;
    float: left;
    margin: 10px;
    padding: 0px 10px;
    font-size: 16px;
    cursor: pointer;
    padding-left: 50px;
    position: relative;
  }

  .wfstart-box-item:hover{
    background-color: #e8f8fd;
    border-color: #7BA7EA;
    color:#2B579A;        
  }

  .wfstart-box-item:hover .icon{
    color:#2B579A;        
  }

  .wfstart-box-item .icon{
    font-size: 28px;
    position: absolute;
    left: 10px;
    top:10px;
    color:#BFD2ED;    
  }
</style>
