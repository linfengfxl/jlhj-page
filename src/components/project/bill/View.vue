<template>
  <ViewProcess ref="ViewProcess" :instId="instId" :title="title" :loading="loading" @on-load="instLoaded" @on-submit="save">
      <div class="baseinfo"> 
        <div class="subheader">
          单据表头
        </div>
        <Form ref="form" class="page-form page-form-view" :model="formItem" :rules="formRules" :label-width="120">
          <table cellspacing="0" cellpadding="0">
              <colgroup>
                <col width="33%">
                <col width="auto">
                <col width="33%">
              </colgroup>
              <tr>
              <td>
                <FormItem prop="projectCode" label="工程名称">
                  {{formItem.projectName}}
                </FormItem>
              </td>
               <td>
                <FormItem prop label="工程队伍">
                  {{formItem.projectTeam}}
                </FormItem>
              </td>
              <td>
                <FormItem prop="billDate" label="日期">
                  {{formItem.billDate}}
                </FormItem>
              </td>
            </tr>
            <tr>
              <td>
                <FormItem prop label="合价合计">
                  {{formItem.totalAmount}}
                </FormItem>
              </td>
              <td>
                <FormItem prop label="备注">
                  {{formItem.remark}}
                </FormItem>
              </td>
            </tr>
            <tr> 
              <td colspan="3">
                <FormItem prop="files" label="附件">
                  <UploadBox v-model="formItem.files" :readonly="true"></UploadBox>
               </FormItem> 
              </td>
            </tr>
          </table>
        </Form>
      </div>
      <!-- <div>
        <div class="subheader">成本分析明细</div>
          <Editable
            ref="editable"
            :list="list"
            :editable="false"
            @on-amount-change="onAmountChange"
          ></Editable>
      </div>      -->  
</ViewProcess>  
</template>
<script>
import Loading from '@/components/loading';
import LayoutHor from '@/components/layout/LayoutHor';
import Editable from './DetailEditable';
import page from '@/assets/js/page';
import floatObj from '@/assets/js/floatObj'; 
import pagejs from '@/assets/js/page';
import UploadBox from '@/components/upload/Index';

import SelectProject from '@/components/page/form/SelectProject';
import SelectDept from '@/components/page/form/SelectDept';

import ViewProcess from '@/components/workflow/process/View';

export default {
  components: {
    Loading,
    LayoutHor,
    Editable,     
    UploadBox,
    SelectProject,
    SelectDept,
    ViewProcess
  },
  data() {
    return {
      title:'分包结算表',
      loading: 0,
      instId:0,
      formItem: {
     
      },
      formRules: {
         
      },
      list: [],
      oriItem: {},
    }
  },
  mounted: function () { 
    this.instId = this.$route.query.inst;    
  },
  computed: {     
  },
  methods: {
    instLoaded(proc){ 
      this.projectBillCode = proc.instance.businessKey;
      this.title = "分包结算表_" + this.projectBillCode;
      this.load();
    },
    load() {
      this.loading = 1;

      this.$http.post("/api/engine/project/bill/get", {projectBillCode: this.projectBillCode}).then((res) => {
        this.loading = 0;
        if (res.data.code == 0) {
          if (res.data.data) {  
          if(res.data.data.billDate!=null)          
            res.data.data.billDate=res.data.data.billDate.length>=10?res.data.data.billDate.substring(0,10):res.data.data.billDate; 
            this.oriItem = eval('(' + JSON.stringify(res.data.data) + ')');
            Object.assign(this.formItem, res.data.data);             
            this.list = res.data.data.detailList;
          } else {
            this.$Message.error('单据不存在！');
            this.goBack();
          }
        } else {
          this.$Message.error(res.data.message);
        }
      }).catch((error) => {
        this.loading = 0;
        this.$Message.error("操作失败！")
      });
    },
    initNew() {
      Object.assign(this.formItem, this.getInitFormItem());
      this.list = [];
    },
      // 初始化表单数据
    getInitFormItem() {
      var obj = {
        projectBillCode: "", 
        projectCode: "", 
        projectName: "", 
        projectTeam:'',
        billDate: "", 
        totalAmount: 0,   
        files: "",
        remark: "", 
        status: 0 //  审批状态
      };
      return obj;
    },
    save(proc) {
      var form = {
        detailList: []
      };

      Object.assign(form, this.formItem);
      form.billDate = page.formatDate(form.billDate);

      var pass = true;
      this.$refs.form.validate((valid) => {
        pass = valid;
      })

      if (!pass) {
        this.$Message.error('验证未通过！');
        return;
      }

      form.detailList = [];
      // 明细
      for (var i = 0; i < this.list.length; i++) {
        var item = this.list[i];
        var msg = '明细第 ' + (i + 1) + ' 行，';
        form.detailList.push(item);
      }

      form.proc = proc.formItem;

      // 提交
      this.loading = 1;
      var uri = '/api/engine/project/bill/submit';

      this.$http.post(uri, form).then((res) => {
        this.loading = 0;
        if (res.data.code == 0) {
          this.$Message.success("操作成功！");
          this.goBack();
        } else {
          this.$Message.error(res.data.message);
        }
      }).catch((error) => {
        this.loading = 0;
        this.$Message.error("请求失败，请重新操作")
      });
    },  
    onAmountChange(val) {
      //this.formItem.amount = val;
    },
    reset() {
      Object.assign(this.formItem, this.oriItem);
    },
    goBack() {
      this.$router.go(-1);
    },
  }
}

</script>

<style type="text/css">

</style>
