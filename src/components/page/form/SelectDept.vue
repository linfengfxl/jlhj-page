<template>
  <div class="page-form-select">
    <Input v-model="text" readonly="readonly" :placeholder="placeholder" icon="search" @on-click="openPop"></Input>
    <SelDept ref="dept" @on-ok="selectDept"></SelDept>
  </div>
</template>

<script>  
import SelDept from '@/components/commons/SelectDept';

export default { 
  components: { 
    SelDept
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
      default:"deptName"
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
      deptId:'',
      deptName:''
    };
  },
  mounted(){
     
  },
  computed:{

  },
  watch:{
    value(val,old){
      this.deptId = val;      
    },
    text(val,old){
      this.deptName = val;
    },
    model(val,old){

    }
  },
  methods:{
    openPop(){
      if(this.value){
        this.$refs.dept.selectIds = [this.value];
      }       
      this.$refs.dept.open();
    },
    selectDept(depts){       
      if(depts.length>0){
        var data = depts[0];
        this.$emit('input',data.deptId);
        if(this.model){
          this.model[this.textProp] = data.deptName;
        }
      }
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

