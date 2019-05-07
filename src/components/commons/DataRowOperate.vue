<template>
  <div class="dataRowOperate">
    <a v-for="(item,index) in innerBtns" :key="index" v-if="item.visible" @click="click(item)" :class="{'disabled':item.disabled}">{{item.text}}</a>
  </div>
</template>
<script>

export default { 
  name:'DataRowOperate',
  props:{
    'btns':{
      type:Array,
      default:[{key:'browse'}]
    }
  },
  data() { 
    return {
      innerBtns:this.innerBuildBtns(this.btns)
    }
  },
  mounted:function(){

  },
  computed:{
    
  },
  watch:{
    btns(newVal,old){
      this.innerBtns = this.innerBuildBtns(newVal);
    }
  },
  methods:{ 
    click:function(item){
      if(item.disabled){
        return;
      }
      this.$emit('click',item.key);
    },
    innerBuildBtns(btns){
      var defaultBtnOptions = {
        'default':{text:'按钮',disabled:false,icon:'',visible:true},
        'browse':{text:'浏览',disabled:false,icon:'',visible:true},
        'view':{text:'查看',disabled:false,icon:'',visible:true},
        'open':{text:'打开',disabled:false,icon:'',visible:true},
        'edit':{text:'编辑',disabled:false,icon:'',visible:true},
        'delete':{text:'删除',disabled:false,icon:'',visible:true},
        'submit':{text:'提交',disabled:false,icon:'',visible:true},
        'audit':{text:'送审',disabled:false,icon:'',visible:true},
      };

      var list = [];
      btns.map(btn=>{
        var temp = Object.assign(defaultBtnOptions[btn.key] || defaultBtnOptions['default'],btn);
        list.push(Object.assign(btn,temp));
      });
 
      return list;  
    }
  }
}

</script>

<style type="text/css">
  .dataRowOperate a{
    display: inline-block;
    padding: 4px;
  }

  .dataRowOperate a.disabled{
    color: #ccc;
  }
  
</style>

