<template>
  <Modal v-model="show" title="选择部门" :closable="false" :mask-closable="false" :transfer="transfer">
    <div class="select-dept">
      <TvNode :model="root" v-if="type == 1"></TvNode>
      <TvNodeCheck :model="root" v-else></TvNodeCheck>
    </div>
    <div slot="footer">
      <Button  type="text" @click="close" style="margin-left: 8px">取消</Button>
      <Button  type="primary" @click="ok">确定</Button>
    </div>
  </Modal>
</template>

<script>
import TvNode from '@/components/tree/TvNode'
import TvNodeCheck from '@/components/tree/TvNodeCheck'
import treeComponent from '@/components/tree/treeComponent.js'
import Loading from '@/components/loading';

export default {
  name: 'SelectDept',
  components: {
    TvNode,
    TvNodeCheck,    
    Loading
  },
  props: {
    type: { // 1.单选   2.多选
      type:Number,
      default:1 
    },
     transfer: {
      type: Boolean,
      default: true
    },
  },
  data() {
    return {
      root:{
        title:'',
        children:[]
      },
      tree:null,
      show:false,      
      loading: 1,
      selectIds:[],
      hidenIds:[], // 不显示的结点
    };
  },
  mounted(){
    let that = this;
    let tree = new treeComponent({
        idProperty:'deptId',
        titleProperty:'deptName',
        parentIdProperty:'parentId',
        root:{title:'公司',data:{deptName:'公司',deptId:'',parentId:null}},
        onLoad(){
          if(!tree.options.isLoad){
              tree.build();
              tree.openLevel(0);
          }else{
              tree.buildRestoreStatus();
          }
          tree.options.isLoad = true;
        },
        onSelect(e){
           
        }
    });
    this.tree= tree;
    this.root= this.tree.options._root;
  },
  computed:{
  },
  methods:{
    open(){
      this.show = true;
      this.load();
    },
    load(){
        this.loading = 1;
        this.$http.post('/api/engine/dept/list', {}).then((res) => {
          if (res.data.code === 0) {
            this.loading = 0;
            var depts = [];
            res.data.data.map(item=>{
              if(this.hidenIds.indexOf(item.deptId)<0){
                depts.push(item);
              }
            })

            this.tree.options.data = depts;
            this.tree.load();
             
            if(this.selectIds && this.selectIds.length > 0){
              this.tree.setCheck(this.selectIds);
              this.tree.setSelect([this.selectIds[0]]);
            }else{
              this.tree.setCheck([]);
              this.tree.setSelect([]);
            }
          } else {
            this.loading = 0;
            this.$Message.error(res.data.message)
          }
        }).catch((error) => {
          this.loading = 0;
          this.$Message.error(error.toString())
        });
    },
    ok(){
      var depts = [];

      if(this.type == 1){
        this.tree.getSelectData().map(item=>{
          depts.push({deptId:item.deptId,deptName:item.deptName});
        });
      }else{
        this.tree.getCheckData().map(item=>{
          depts.push({deptId:item.deptId,deptName:item.deptName});
        });
      }
       
      this.$emit('on-ok',depts);
      this.close();
    },
    close(){
      this.show = false;
      this.$emit('on-close');
    }
  }
}
</script>

<style>
   .select-dept{padding: 0px;height: 100%;}
</style>

