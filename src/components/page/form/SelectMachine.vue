<template>
<!-- 选择机械 -->
  <div class="page-form-select">
    <Input v-model="text" readonly="readonly" :placeholder="placeholder" icon="search" @on-click="selMachine"></Input>
    <selMachine ref="selMachine"></selMachine>
  </div>
</template>

<script>  
import selMachine from '@/components/machine/Selectmachine'

export default { 
  components: { 
    selMachine
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
          }
        }
      });
    },
  }
}
</script>

<style>
  .page-form-select{
    height: 100%;
    width: 100%;
  }
</style>

