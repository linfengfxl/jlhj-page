<template>
<!-- 选择机械 -->
  <div class="page-form-select">     
    <AutoComplete  @input="onInput" :readonly="readonly" :placeholder="placeholder" 
    :textProp="textProp" :text="text" @on-click="selMachine" @on-remote-search="onRemoteSearch"
    :model="model"></AutoComplete>
    <selMachine ref="selMachine"></selMachine>
  </div>
</template>

<script>  
import selMachine from '@/components/machine/Selectmachine'
import AutoComplete from './AutoComplete'
export default { 
  components: { 
    selMachine,
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
    text:{
      type:String,
      default:''
    },
    // 控件显示文本对应 model 属性
    textProp:{
      type:String,
      default:"machineName"
    },
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
      machineCode:'',
      machineName:''
    };
  },
  mounted(){
     
  },
  computed:{

  },
  watch:{
    value(val,old){
      this.machineCode = val;      
    },
    text(val,old){
      this.machineName = val;
    },
    model(val,old){

    }
  },
  methods:{ 
    selMachine(row) {
      var sel = this.$refs.selMachine;//引用该控件，赋值给变量对象
      sel.show({
        ok: (data) => {
          if (data) {
            this.$emit('input',data.machineCode);
            if(this.model){ 
              this.model[this.textProp] = data.machineName;
            }
            this.$emit('on-select',data);
          }
        }
      });
    },
    onInput(e,sender){
      this.$emit('input',e); 
      this.$emit('on-select',sender.selectItem);
    },
    onRemoteSearch(sender){
      sender.loading = true;
      sender.$http.post("/api/engine/machine/list", {keyword:sender.innerText}).then((res) => {
        sender.loading = false;
        if (res.data.code === 0) {           
          var list = res.data.data.rows; 
          sender.items = list.map((item) => {
            item.label = item.machineName;
            item.value = item.machineCode;
            return item;
          });
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

