<template>
  <div class="typowercheck">
    <Loading :title="msg" :loading="loading">
      <CheckboxGroup v-model="checked">
        <table class="typowercheck-table">
          <tr v-for="(item,index) in items" v-if="item.show"> 
            <td class="typowercheck-table-chkall">
              <Icon @click.native="checkAll(item)" type="android-checkbox-outline" title="选中/取消 该结点及其下结点"></Icon>
            </td>
            <td :class="'typowercheck-table-lev typowercheck-table-lev'+item.level">
              <div class="typowercheck-table-fold">
                <div v-if="item.children.length>0">
                  <Icon type="plus-round" @click.native="fold(item,0)" title="展开" v-if="item.fold"></Icon>
                  <Icon type="minus-round" @click.native="fold(item,1)" title="折叠" v-else></Icon> 
                </div> 
              </div> 
              <Checkbox :label="item.id">
                <span>{{item.title}}</span>
              </Checkbox>
            </td>
            <td class="typowercheck-table-points">
              <Checkbox v-for="(sub,index) in item.points" :label="sub.id">
                <span>{{sub.title}}</span>
              </Checkbox>
            </td>
          </tr>
        </table>
      </CheckboxGroup>
    </Loading>
  </div>
</template>
<script>
  import Loading from '@/components/loading';

  export default {
    components: {
      Loading
    },
    data() {
      return {
        loading:0,
        msg:'',
        checked:[],
        items:[],
        treeNodes:[],
      }
    },
    computed: {

    },
    methods: {
      load() {
        this.loading = 1;
        this.$http.post("/api/power/list", {}).then((res) => {
          this.loading = 0;
          if (res.data.code === 0) {
            var powers = res.data.data;
            powers = powers.sort((a,b)=>{return a.seq - b.seq;});
            var chks = this.checked;
            this.treeNodes = this.buildItems(powers,0,1);
            this.treeNodes.map(node=>{
              node.show = 1;
            });
            this.items = [];
            this.buildRow(this.treeNodes,this.items);
            this.checked.push(5002);
            console.log(this);
          } else {
            this.loading = 3;
            this.msg = res.data.message;
          }
        }).catch((error) => {
          this.loading = 3;
            this.msg = error
        });
      },
      buildRow(nodes,rows){
        nodes.map((node)=>{
          rows.push(node);
          this.buildRow(node.children,rows);
        });
      },
      buildItems(powers,parentId,level){
        var arr = [];
        if(level >= 10){
          return arr;
        }
        powers.map((p)=>{
          if(p.parentId == parentId){
            if(p.powerType<3){
              var item = {
                id:p.powerId,
                title:p.powerCaption,
                type:p.powerType,
                level:level,
                fold:1, // 1. 折叠 0.展开
                show:0,
              };
              item.points = this.buildPoints(powers,item.id);
              item.children = this.buildItems(powers,item.id,level+1);
              arr.push(item);
            }
          }
        });
        return arr;
      },
      buildPoints(powers,parentId){
        var arr = [];
        powers.map((p)=>{
          if(p.parentId == parentId){
            if(p.powerType==3){
              var item = {
                id:p.powerId,
                title:p.powerCaption,
                type:p.powerType,
              };
              arr.push(item);
            }
          }
        });
        return arr;
      },
      checkAll(item){
        if(this.checked.indexOf(item.id) >=0){
          // 清除
          this.each([item],(p)=>{
            if(this.checked.indexOf(p.id) >=0){
              this.checked.splice(this.checked.indexOf(p.id),1);
            }
          });
        }else{
          // 选中
          this.each([item],(p)=>{
            if(this.checked.indexOf(p.id) == -1){
              this.checked.push(p.id);
            }
          });
        }
      },
      fold(item,fold){ 
        item.fold = fold;
        this.innerSetShow(item);
      },
      innerSetShow(item){
        if(item.children){
          item.children.map(ch=>{
            if(!item.fold && item.show){
              ch.show = 1;
            }else{
              ch.show = 0;
            }
            this.innerSetShow(ch);
          });
        } 
      },
      each(items,func){
        for(var i =0;i<items.length;i++){
          var item = items[i];
          if(func(item) == false){
            return false;
          }
          if(item.points){
            if(this.each(item.points,func) == false){
              return false;
            }
          }
          if(item.children){
            if(this.each(item.children,func) == false){
              return false;
            }
          }
        }
      }
    }
  }

</script>

<style type="text/css">
  .typowercheck{

  }
  .typowercheck-table{
    width: 100%;
  }
  .typowercheck-table td{
    vertical-align: top;
    padding:4px;
    line-height: 24px;
    border-bottom: 1px #ddd dashed;
  }
  .typowercheck-table-lev{
    white-space:nowrap;
  }
  .typowercheck-table-lev1{
    width: 140px;
    font-weight: bold;
  }
  .typowercheck-table td.typowercheck-table-lev2{
    padding-left: 20px;
  }
  .typowercheck-table td.typowercheck-table-lev3{
    padding-left: 40px;
  }
  .typowercheck .ivu-checkbox-group-item{
    white-space:nowrap;
  }
  .typowercheck-table-points{

  }
  .typowercheck-table-chkall{
    width: 1px;
  }
  .typowercheck-table-chkall .ivu-icon{
    font-size: 16px;
    cursor: pointer;
    color: #ccc;
  }
  .typowercheck-table-chkall .ivu-icon:hover{
    color:#20bfee;
  }
  .typowercheck-table-fold{
    display: inline-block;color: #999;
    width:24px;text-align: center;
  }
</style>
