<template>
  <Dropdown trigger="custom" :visible="showDropdown"
  @on-clickoutside="showDropdown=false" placement="bottom-start" @on-click="clickItem">
    <Input
      v-model="innerText"
      :placeholder="placeholder"
      :icon="icon"
      :title="innerText"
      style="width:100%;"
      @on-change="inputChange"
      @on-focus="onFocus"
      @on-blur="onBlur" 
      @on-click="onClickSearch" 
      @on-keydown="onKeyPress"
    ></Input>
    <DropdownMenu slot="list" style="overflow: hidden">
      <div v-if="items.length==0" class="dropdown-empty">暂无信息</div>
      <DropdownItem :name="item.value" v-for="(item,index) in items" :class="{'cur':index == curIndex}">{{item.label}}</DropdownItem>
    </DropdownMenu>
  </Dropdown>
</template>

<script> 

export default {
  components: {
     
  },
  props: {
    value: {
      type: String,
      default: ""
    },
    model: {
      type: Object,
      default: null
    },
    textProp: {
      type: String,
      default: "text"
    },
    text: {
      type: String,
      default: ""
    },
    placeholder: {
      type: String,
      default: ""
    },
    readonly: {
      type: Boolean,
      default: false
    },
    transfer: {
      type: Boolean,
      default: false
    },
    icon:{
      type:String,
      default:'search'
    }
  },
  data() {
    return {
      loading:false,
      curIndex:-1,
      innerValue:'',
      innerText:'',
      items:[],
      showDropdown:false,
      hidenDropdownTimer:null,
      selectItem:null,
    };
  },
  mounted() {},
  computed: {},
  watch: {
    text(n,o){
      this.innerText = n;
    } 
  },
  methods: {
    remoteSearch(input){ 
      this.$emit('on-remote-search',this);
    },
    inputChange(e){
      if(document.activeElement == e.srcElement){
        this.showDropdown = true;
        this.remoteSearch(this.innerText);
      }
    },
    onFocus(e){
      window.clearTimeout(this.hidenDropdownTimer);
      e.srcElement.select();
    },
    onBlur(e){
      window.clearTimeout(this.hidenDropdownTimer);
      this.hidenDropdownTimer =
      window.setTimeout(()=>{
        this.showDropdown = false;
        this.innerText = this.text;
      },200);
    },
    clickItem(e){
      this.selectItem = null;
      this.items.map(item=>{
        if(item.value == e){
          this.selectItem = item;
        }
      })
      if(this.selectItem){
        this.innerText = this.selectItem.label;
        if(this.model){
          this.model[this.textProp] = this.selectItem.label;
        }
        this.$emit('input',this.selectItem.value,this);
      }
      this.showDropdown = false;
    },
    onClickSearch(e){
      this.$emit('on-click');
    },
    onKeyPress(e){
      if(e.code == 'ArrowDown'){
        this.curIndex ++ ;
        if(this.curIndex >= this.items.length){
          this.curIndex = 0;
        }
      }
      if(e.code == 'ArrowUp'){
        this.curIndex -- ;
        if(this.curIndex<0){
          this.curIndex = this.items.length-1;
        }
      } 
      if(e.key == 'Enter'){
        if(this.curIndex >=0 && this.items.length>this.curIndex){
          var item = this.items[this.curIndex];
          this.clickItem(item.value);
        }
      } 
    }
  }
};
</script>

<style>
  .dropdown-empty{
    text-align: center;
    color: #999;
  }
  .ivu-dropdown-item.cur{     
    background-color: #e8f8fd;
  }
</style>

