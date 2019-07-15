<template>
<!-- 选择供应商 -->
  <div class="page-form-select">
    <AutoComplete  @input="onInput" :readonly="readonly" :placeholder="placeholder" 
    :textProp="textProp" :text="text" @on-click="selProvider" @on-remote-search="onRemoteSearch"
    :model="model"></AutoComplete>
    <selProvider ref="selProvider"></selProvider>
  </div>
</template>

<script>  
import selProvider from '@/components/provider/SelectProvider'
import AutoComplete from './AutoComplete'
export default { 
  components: { 
    selProvider,
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
    selProvider() {
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
    onInput(e,sender){
      this.$emit('input',e); 
      this.$emit('on-select',sender.selectItem);
    },
    onRemoteSearch(sender){
      sender.loading = true;
      sender.$http.post("/api/engine/provider/list", {keyword:sender.innerText}).then((res) => {
        sender.loading = false;
        if (res.data.code === 0) {           
          var list = res.data.data.rows; 
          sender.items = list.map((item) => {
            item.label = item.providerName;
            item.value = item.providerCode;
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

