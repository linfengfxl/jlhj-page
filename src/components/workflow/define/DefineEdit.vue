<template>
  <Modal v-model="show" title="设置审批层级" :closable="true" :mask-closable="true" class="edit-user" width="600">
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
            <template v-if="isEdit == 0">
              <FormItem label="单据" >
                <Select v-model="formKey" style="width:150px" @on-change="formKeyChange">
                  <Option v-for="item in form" :value="item.key" :key="item.key">{{ item.title }}</Option>
                </Select>
              </FormItem>
              <FormItem label="分支1">
                <Select v-model="branch1Key" style="width:150px" @on-change="branch1Change" >
                  <Option v-for="item in branch1" :value="item" :key="item">{{ item }}</Option>
                </Select>
              </FormItem>
              <FormItem label="分支2" v-if="branch2.length">
                <Select v-model="branch2Key" style="width:150px" @on-change="branch2Change">
                  <Option v-for="item in branch2" :value="item" :key="item">{{ item }}</Option>
                </Select>
              </FormItem>
            </template>
            <template v-if="isEdit || defineLoaded">
            <FormItem label="流程名称" prop="title">{{formItem.title}}</FormItem>
            <FormItem label="标题格式" prop="instTitle">{{formItem.instTitle}}</FormItem>
            <FormItem label="发起人" prop="">
              <Select v-model="startNodes" style="width:335px" multiple>
                  <Option v-for="item in roles" :value="item.roleId" :key="item.roleId">{{ item.roleName }}</Option>
              </Select>
            </FormItem>
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
            </template>
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

      startNodes:[],
      nodes:[{roleId:''}],
      roles:[],
      ruleValidate: {         
      },
      form:[], 
      formKey:'',
      branch1:[],
      branch1Key:'',
      branch2:[],
      branch2Key:'',
      defineLoaded:false,
    };
  },
  computed: { 
  },
  methods: {
    // 初始化json数据
    initItem() {
      return {
        id: 0,
        startNodes:'',
        nodes: '',
        nodeNames:"",
        title: "",
        instTitle: "",
        createTime: ""
      };
    }, 
    loadForm(){
      this.form = [];
      this.$http.post('/api/engine/workflow/form/list').then(res => {
        if (res.data.code == 0) { 
          res.data.data.map(item=>{
            if(item.branch1){
              this.form.push(item)
            }
          })
        }
      })
      .catch(error => {
         
      });
    },
    formKeyChange(){       
      this.branch1 = [];
      this.branch1Key = '';
      this.branch2 = [];
      this.branch2Key = '';
      if(this.formKey){
        this.form.map(item=>{
          if(item.key == this.formKey){
            this.curForm = item;
            if(item.branch1){
              this.branch1 = item.branch1.split(',')
            }
            if(item.branch2){
              this.branch2 = item.branch2.split(',')  
            }
          }
        })
      }
      this.defineLoaded = false;
    },
    branch1Change(){
      this.defineLoaded = false;
      if(this.branch1Key && (this.branch2.length == 0 || this.branch2Key)){
        this.loadDefine();
      }
    },
    branch2Change(){
      this.defineLoaded = false;
      if(this.branch1Key && (this.branch2.length == 0 || this.branch2Key)){
        this.loadDefine();
      }
    },
    loadDefine(){
      var defineKey = this.formKey;
      var titles = [];

      if(this.branch1Key){
        defineKey += "_" + this.branch1Key;
        titles.push(this.branch1Key);
      }
      if(this.branch2Key){
        defineKey += "_" + this.branch2Key
        titles.push(this.branch2Key);
      }

      this.loading = 1;
      this.$http.post('/api/engine/workflow/define/get',{key:defineKey}).then(res => {
        this.loading = 0;

        if (res.data.code == 0) {
          var data = res.data.data;
          if(data){
            this.formItem = Object.assign(this.initItem(), data,{disabled:0});
            this.nodes = this.formItem.nodeList;
          }else{
            this.formItem = Object.assign(this.initItem(),{title:this.curForm.title + ' - ' + titles.join(' - ') 
              ,instTitle:this.curForm.instTitle 
              ,formKey:this.curForm.key
              ,key:defineKey
            });
            this.nodes = [];
          }
          this.defineLoaded = true;
        } else {             
          this.$Message.error(res.data.message);
        }
      })
      .catch(error => {
        this.loading = 0;
        this.$Message.error(error.message);
      });
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

      this.formItem.startNodes = this.startNodes.join(',');

      this.formItem.nodes = this.nodes.map(item=>{return item.roleId}).join(',');

      this.$refs["form"].validate(valid => {
        if (valid) {
          this.save();
        }
      });
    },
    save() {
      var url = "/api/engine/workflow/define/update";
      var msg = "操作成功";
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
      this.formItem = Object.assign(this.initItem(), item);
      this.nodes = this.formItem.nodeArr;
      this.startNodes = (this.formItem.startNodes || '').split(',');
      this.formKey = '';
      this.branch1Key = '';
      this.branch2Key = '';
      this.defineLoaded = false;

      if(this.roles.length == 0){
        this.loadRoles();
      }      
      
      if (this.formItem.id > 0) {
        this.isEdit = 1;
      } else {
        this.isEdit = 0;
      }

      this.loadForm();

      this.show = true;
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