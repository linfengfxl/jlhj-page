<template>  
<ul>
  <li>
      <div v-bind:class="{'tv-node':1,'select':model.select}" :style="style" @click="model.doEvent('select',$event)">
          <table class="tv-node-row" cellpadding="0" cellspacing="0">
            <tr>
                <td class="tv-node-row-arrow">
                    <span v-bind:class="{'tv-arrow':1,'open':model.open,'close':!model.open,'empty':model.children.length==0}" @click="model.doEvent('fold',$event)">
                      <Icon type="arrow-right-b" class="arrow-close"></Icon>
                      <Icon type="arrow-down-b" class="arrow-open"></Icon>
                    </span>
                </td>
                <td class="tv-node-row-check" @click="$event.cancelBubble=true">
                  <Icon type="checkmark-round tv-checkbox tv-checkbox-uncheck" v-if="!model.check" @click="model.check=true"></Icon>
                  <Icon type="checkmark-round tv-checkbox tv-checkbox-check" v-else @click="model.check=false"></Icon>
                    <!--
                    <span @click="$event.cancelBubble=true">
                        <span v-if="!model.check" class="tv-checkbox" @click="model.check=true" >
                           <Icon type="checkmark-round tv-checkbox-uncheck"></Icon>
                        </span>
                        <span v-else class="tv-checkbox tv-checkbox-check" @click="model.check=false">
                          <Icon type="android-checkbox"></Icon>
                        </span> 
                    </span>-->
                </td>
                <td>
                    {{model.title}} 
                </td>
                <td></td>
            </tr>
        </table>
      </div>
      <ul v-bind:class="{'tv-hidden':!model.open}">
          <li v-for="node in model.children">
              <TvNodeCheck :model="node"></TvNodeCheck>
          </li>
      </ul>
  </li>
</ul> 
</template>

<script>

export default {
  name:'TvNodeCheck',
  components: {
  },
  props: {
    model: {
      type:[Object],
      default:{}
    }
  },
  data() { 
    return {};
  },
  mount:function(){ 
  },
  computed:{
    style:function () {
      if(this.model && this.model.level){
        return 'padding-left:' + this.model.level*14 + 'px';
      }
      return "";
    }
  }
}
</script>

<style> 
  .tv ul {
    list-style: none;
  }
  
  .tv{padding: 10px;border:1px solid #dedede;}/*组件*/
  .tv-node{height: 36px;line-height: 36px;cursor: default;padding: 0 10px;}
  .tv-node:hover{background-color: #e8f8fd}
  .tv-node.select{background-color: #e8f8fd;}
  
  .tv-node-row{width: 100%;}
  .tv-node-row td{margin: 0px;padding: 0px;vertical-align: middle;}
  .tv-node-row-arrow{width: 18px;}
  .tv-node-row-check{width: 18px;text-align: center;}

  .tv-children{}
  .tv-children li{padding: 2px;}
  .tv-title{}

  .tv-arrow{cursor: pointer;background-color:transparent;width: 14px;display: inline-block;text-align: center;}
  .tv-arrow:hover{color:#39f}

  .tv-arrow.open .arrow-close,
  .tv-arrow.open .arrow-empty {display: none}        

  .tv-arrow.close .arrow-open,
  .tv-arrow.close .arrow-empty {display: none}

  .tv-arrow.empty .arrow-open,
  .tv-arrow.empty .arrow-close{display: none}

  .tv-node .arrow-close{
    color:#999;
  }

  .tv-node .tv-checkbox{
    display: block;    
    height: 15px;
    width: 15px;
    background-color: white;
    border: 1px solid #d7dde4;
    border-radius: 2px;
    font-size:12px;
    cursor: pointer;
    color:white;
  }

  .tv-node .tv-checkbox:hover{
    border-color: #eb5954;
  }

  .tv-node .tv-checkbox-check{background-color: #eb5954;color:white;border-color: #eb5954}

  .tv-hidden{display: none;}
  .tv-node:hover .tv-toolbar{display: inline-block;}
  .tv-toolbar .ivu-btn{padding: 0px;} 

  /*combotree*/
  .combotree .tv{padding: 0px;margin:0px;border:0px;max-height: 240px;overflow-y:auto;min-width: 240px;overflow-x:hidden; }
  .combotree-input{width: 200px;text-align: left;}
</style>

