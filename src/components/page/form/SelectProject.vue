<template>
<!-- 选择工程 -->
  <div class="page-form-select">         
    <AutoComplete  @input="onInput" :readonly="readonly" :placeholder="placeholder" 
    :textProp="textProp" :text="text" @on-click="selProject" @on-remote-search="onRemoteSearch"
    :model="model"></AutoComplete>
    <SelProject ref="selProject"></SelProject>
  </div>
</template>

<script>  
import SelProject from '@/components/project/SelectProject'
import AutoComplete from './AutoComplete'

export default { 
  components: { 
    SelProject,
    AutoComplete
  },  
  props:{
    value:{
      type:String,
      default:''
    },
    model:{
      type:Object,
      default:null
    },
    textProp:{
      type:String,
      default:"projectName"
    },
    text:{
      type:String,
      default:''
    },
    // 控件显示文本对应 model 属性
    placeholder:{
      type:String,
      default:""
    },
    readonly:{
      type:Boolean,
      default:false
    }
  },
  data() {
    return {
      projectId:'',
      projectName:''
    };
  },
  mounted(){
     
  },
  computed:{

  },
  watch:{
    value(val,old){
      this.projectId = val;      
    },
    text(val,old){
      this.projectName = val;
    },
    model(val,old){

    }
  },
  methods:{ 
    selProject() {
      var sel = this.$refs.selProject;//引用该控件，赋值给变量对象
      sel.show({
        ok: (data) => {
          if (data) {
            this.$emit('input',data.projectCode);
            if(this.model){ 
              this.model[this.textProp] = data.name;
            }
            this.$emit('on-select',data);
          }
        }
      });
    },
    onInput(e){
      this.$emit('input',e);
    },
    onRemoteSearch(sender){
      sender.loading = true;
      sender.$http.post("/api/engine/project/list", {keyword:sender.innerText}).then((res) => {
        sender.loading = false;
        if (res.data.code === 0) {           
          var list = res.data.data.rows; 
          sender.items = list.map((item) => { return { label:item.name,value:item.projectCode} });
        } else {

        }
      }).catch((error) => {
        sender.loading = false;
      });
    }
  }
}
</script>

<style>
  .page-form-select{
    height: 100%;
    width: 100%;
  }
</style>

