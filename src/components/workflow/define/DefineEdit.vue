<template>
  <Modal v-model="show" title="设置审批层级" :closable="true" :mask-closable="false" class="edit-user" width="600">
    <div class="page define-edit">
      <Loading :loading="loading">
        <div class="page-form">
          <Form
            :model="formItem"
            ref="form"
            :label-width="80"
            :rules="ruleValidate"
            class="form-item"
          >
            <FormItem label="流程名称" prop="title">{{formItem.title}}</FormItem>
            <FormItem label="标题格式" prop="instTitle">{{formItem.instTitle}}</FormItem>
            <FormItem label="审批层级" prop="nodes">
               <table class="nodestable" cellspacing="0" cellpadding="0">
                 <tr v-for="(item,index) in nodes">
                   <td style="width: 40px;text-align: center;">{{index+1}}</td> 
                   <td>
                      <Select v-model="item.roleId" :filterable="true" :placeholder="item.roleName">
                        <Option v-for="item in roles" :value="item.roleId" :key="item.roleId">{{ item.roleName }}</Option>
                      </Select>
                   </td>
                   <td>
                      <Button @click="insert(index)" size="small">插入</Button>
                      <Button @click="remove(index)" size="small" style="margin-left: 4px">移除</Button>
                   </td>
                 </tr>
                 <tr>
                   <td colspan="3">
                     <Button @click="addrow" size="small">添加行</Button>
                   </td> 
                 </tr>
               </table>
            </FormItem>
            <FormItem>
              <div class>
                <Button icon="checkmark" type="primary" @click="onSave">保存</Button>
                <Button @click="close" style="margin-left: 8px">取消</Button>
              </div>
            </FormItem>
          </Form>
        </div>
      </Loading>
    </div>
    <div slot="footer"></div>    
  </Modal>
</template>
<script>
import SelectDept from "@/components/commons/SelectDept";
import Loading from "@/components/loading";
import dateFormat from "@/assets/js/dateFormat";
import page from "@/assets/js/page";

export default {
  components: {
    Loading
  },
  data() {
    return {  
      loading: 0,
      show: false,
      //是否编辑 0 添加 1 编辑 2 查看
      isEdit: 0,
      //表单对象formItem
      formItem: this.initItem(),
      nodes:[{roleId:''}],
      roles:[],
      ruleValidate: {
        nodes: [
          {
            required: true,
            whitespace: true,
            message: "结点不能为空",
            trigger: "change"
          }
        ],         
      }
    };
  },
  computed: {

  },
  methods: {
    // 初始化json数据
    initItem() {
      return {
        id: '',
        nodes: [],
        nodeNames:"",
        title: "",
        instTitle: "",
        createTime: ""
      };
    },
    loadRoles(){
      this.$http.post('/api/engine/role/all').then(res => {           
          this.loading = 0;
          if (res.data.code == 0) {
             this.roles = res.data.data;
          } else {             
            this.$Message.error(res.data.message);
          }
        })
        .catch(error => {
          this.loading = 0;
          this.$Message.error(error.message);
        });
    },
    onSave() {

      for(var i =0;i<this.nodes.length;i++){
        if(this.nodes[i].roleId == '' || this.nodes[i].roleId == null){
          this.$Message.error('第 '+ (i+1) +' 行未选择岗位');
          return;
        }
      }

      if(this.nodes.length == 0){
        this.$Message.error('至少选择一个岗位');
        return;
      }

      this.formItem.nodes = this.nodes.map(item=>{return item.roleId}).join(',');

      this.$refs["form"].validate(valid => {
        if (valid) {
          this.save();
        }
      });
    },
    save() {
      var url = "/api/engine/workflow/define/update";
      var msg = "修改成功";
      this.loading = 1;
      this.$http
        .post(url, this.formItem)
        .then(res => {
          // console.log(this.formItem);
          this.loading = 0;
          if (res.data.code === 0) {
            this.$Message.success(msg);
            this.close();
            this.$emit("on-save");
          } else {
            this.loading = 0;
            this.$Message.error(res.data.message);
          }
        })
        .catch(error => {
          this.loading = 0;
          this.$Message.error(error.message);
        });
    },
    //添加或编辑弹窗
    open(item) {

      item = JSON.parse(JSON.stringify(item));

      if(this.roles.length == 0){
        this.loadRoles();
      }
      this.$refs["form"].resetFields();       
      this.formItem = Object.assign(this.initItem(), item);

      this.nodes = this.formItem.nodeArr;

      this.show = true;
      if (this.formItem.id > 0) {
        this.isEdit = 1;
      } else {
        this.isEdit = 0;
      }
    },     
    addrow() {
      this.nodes.push({roleId:'',roleName:''})
    },
    insert(index) { 
      this.nodes.splice(index, 0,{roleId:'',roleName:''});
    },
    remove(index) {
      if(this.nodes.length > 1){
        this.nodes.splice(index, 1);
      }else{
        this.$Message.error('至少保留一个岗位');
      } 
    },     
    close() {
      this.nodes = [];
      this.show = false;      
    }
  }
};
</script> 
<style type="text/css">
  .define-edit .nodestable{
    border-collapse:collapse  
  } 
  .define-edit .nodestable td{
    padding: 6px;
    border:1px solid #eee;    
  }
  .define-edit .nodestable .ivu-select{
    min-width: 150px;
  } 

</style>