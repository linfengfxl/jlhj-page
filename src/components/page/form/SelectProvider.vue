<template>
<!-- 选择供应商 -->
  <div class="page-form-select">
    <Input v-model="text" readonly="readonly" :placeholder="placeholder" icon="search" @on-click="selProvider"></Input>
    <selProvider ref="selProvider"></selProvider>
  </div>
</template>

<script>  
import selProvider from '@/components/provider/SelectProvider'

export default { 
  components: { 
    selProvider
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
      default:"providerName"
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
      providerCode:'',
      providerName:''
    };
  },
  mounted(){
     
  },
  computed:{

  },
  watch:{
    value(val,old){
      this.providerCode = val;      
    },
    text(val,old){
      this.providerName = val;
    },
    model(val,old){

    }
  },
  methods:{ 
    selProvider(row) {
      var sel = this.$refs.selProvider;//引用该控件，赋值给变量对象
      sel.show({
        ok: (data) => {
          if (data) {
            this.$emit('input',data.providerCode);
            if(this.model){ 
              this.model[this.textProp] = data.providerName;
            }
            this.$emit('on-select',data);
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

