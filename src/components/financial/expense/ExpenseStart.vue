<template>
  <StartProcess ref="startProcess" :defineId="defineId" :loading="loading" :title="pageTitle" @on-submit="save"> 
    <div class="baseinfo"> 
      <div class="subheader">
        单据表头
      </div>
      <Form ref="form" class="page-form" :model="formItem" :rules="formRules" :label-width="120">
        <table cellspacing="0" cellpadding="0">
          <colgroup>
            <col width="33%">
            <col width="auto">
            <col width="33%">
          </colgroup>
          <tr>
            <td>
              <FormItem prop="catalog" label="报销分类"> 
                <Select v-model="formItem.catalog" @on-change="catalogChange">
                  <Option v-for="item in catalog" :value="item.code" :key="item.code" >{{ item.text }}</Option>
                </Select>
              </FormItem>
            </td>
            <td>
              <FormItem prop="projectId" label="工程名称"> 
                <SelectProject v-model="formItem.projectId" :model="formItem" :text="formItem.projectName" />
              </FormItem>
            </td>
            <td>
              <FormItem prop="billDate" label="报销日期">
                 <DatePicker type="date" placeholder="" v-model="formItem.billDate" format="yyyy-MM-dd" ></DatePicker>
              </FormItem>
            </td>
          </tr>
          <tr> 
            <td>
              <FormItem prop="bankOpen" label="开户银行">
                <Input v-model="formItem.bankOpen"/>
              </FormItem>
            </td>
            <td>
              <FormItem prop="bankAccName" label="银行户名">
                <Input v-model="formItem.bankAccName"/>
              </FormItem>
            </td>
            <td>
              <FormItem prop="bankAccount" label="银行账号">
                <Input v-model="formItem.bankAccount"/>
              </FormItem>
            </td>              
          </tr> 
          <tr>
             <td>
              <FormItem prop="payWay" label="付款方式">
                <Select v-model="formItem.payWay">
                  <Option v-for="item in $args.getArgGroup('pay_way')" :value="item.argCode" :key="item.argCode">{{ item.argText }}</Option>
                </Select>
              </FormItem>
            </td>
            <td>
              <FormItem prop="legal" label="法律主体">
                <Select v-model="formItem.legal">
                  <Option v-for="item in $args.getArgGroup('legal')" :value="item.argCode" :key="item.argCode">{{ item.argText }}</Option>
                </Select>
              </FormItem> 
            </td>
            <td>
               <FormItem prop="amount" label="报销金额">
                <Input
                  v-model="formItem.amount"
                  placeholder
                  class="width-1"
                  readonly="readonly"
                />
              </FormItem>
            </td>
          </tr>
           <tr> 
            <td>
              <FormItem prop="operatorName" label="经办人">
                <Input v-model="formItem.operatorName"/>
              </FormItem>
            </td>
            <td>
              <FormItem prop="deptId" label="经办人部门">
                <SelectDept v-model="formItem.deptId" :model="formItem" :text="formItem.deptName" />
              </FormItem>
            </td>  
          </tr> 
          <tr>
            <td colspan="3">
              <FormItem prop="files" label="附件">
                <UploadBox v-model="formItem.files" :readonly="false"></UploadBox>
              </FormItem>
            </td>
          </tr>
          <tr>
            <td colspan="3">
              <FormItem prop="describe" label="报销说明">
                <Input type="textarea" v-model="formItem.describe" :rows="3" />
              </FormItem>
            </td>
          </tr>
        </table>
      </Form>
    </div>

    <div class="subheader">单据明细</div>         
    <Editable
      ref="editable"
      :list="list"
      :editable="true"           
      @on-amount-change="onAmountChange"           
    ></Editable> 
</StartProcess>  
</template>
<script> 
import LayoutHor from '@/components/layout/LayoutHor';
import Editable from './DetailEditable';
import page from '@/assets/js/page';
import floatObj from '@/assets/js/floatObj'; 
import pagejs from '@/assets/js/page';
import UploadBox from '@/components/upload/Index';

import SelectProject from '@/components/page/form/SelectProject';
import SelectDept from '@/components/page/form/SelectDept';

import StartProcess from '@/components/workflow/process/Start';

export default {
  components: { 
    LayoutHor,
    Editable,     
    UploadBox,
    SelectProject,
    SelectDept,
    StartProcess
  },
  data() {
    return {
      loading: 0,
      stockBillId: '',
      pageFlag: 1,//1.新建 2.编辑 3.修订 
      formItem: {
        billId:'',
        catalog:'',
        projectId:'',
        projectName:'',
        billDate:'',
        amount:'',
        bankAccName:'',
        bankOpen:'',
        bankAccount:'',
        operator:'',
        operatorName:'',
        deptId:'',
        deptName:'',
        payWay:'',
        legal:'',
        files:'',
        describe:'',        
        status:0,
        instId:0
      },
      formRules: {
        catalog:[
          { required: true, whitespace: true, message: '该项为非空', trigger: 'change' }
        ],
        payWay: [
          { required: true, whitespace: true, message: '该项为非空', trigger: 'change' }
        ], 
        legal: [
          { required: true, whitespace: true, message: '该项为非空', trigger: 'change' }
        ], 
        operatorName: [
          { required: true, whitespace: true, message: '该项为非空', trigger: 'change' }
        ], 
        deptId: [
          { required: true, whitespace: true, message: '该项为非空', trigger: 'change' }
        ],
        billDate:[
          { required: true,  message: '该项为非空', trigger: 'change', pattern: /.+/ }
        ],
      },
      list: [],
      oriItem: {},
      storage: [],
      catalog:[
        {code:'生产类',text:'生产类'},
        {code:'行政类',text:'行政类'},
        {code:'财务类',text:'财务类'},
        {code:'伙食类',text:'伙食类'},
        {code:'业务招待费',text:'业务招待费'},
        {code:'其他类',text:'其他类'}
      ],
      defineId:1
    }
  },
  mounted: function () {
    this.billId = this.$route.query.id;
    if (this.billId) {
      this.pageFlag = 2;
      this.load();
    } else {
      this.pageFlag = 1;
      this.initNew();
    }
  },
  computed: {
    pageTitle() {
      if (this.pageFlag == 1) {
        return '报销单';
      }
      if (this.pageFlag == 2) {
        return '报销单 - 重新发起';
      }
    }
  },
  methods: {
    load() {
      this.loading = 1;

      this.$http.post("/api/engine/financial/expense/get?billId=" + this.billId, {}).then((res) => {
        this.loading = 0;
        if (res.data.code == 0) {
          if (res.data.data) {
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
      Object.assign(this.formItem, {
        billId:'',
        catalog:'',
        projectId:'',
        projectName:'',
        billDate:page.formatDate(new Date()),
        amount:'',
        bankAccName:'',
        bankOpen:'',
        bankAccount:'',
        operator:'',
        operatorName:'',
        deptId:'',
        deptName:'',
        payWay:'',
        legal:'',
        files:'',
        describe:'',
        status:0,
        instId:0
      });
      this.list = [];
      this.list.push(this.$refs.editable.listNewRow());
      this.list.push(this.$refs.editable.listNewRow());
    },
    catalogChange(){
      if(this.formItem.catalog == '业务招待费'){
        this.defineId = 10
      }else{
        this.$http.post("/api/engine/workflow/define/getByForm", {key:'fybxd',branch1:this.formItem.catalog}).then((res) => {
          this.loading = 0;
          if (res.data.code == 0) {
             if(res.data.data != null){
               this.defineId = res.data.data.id;
             }
          } else {
            this.$Message.error(res.data.message);
          }
        }).catch((error) => {           
          this.$Message.error("操作失败！")
        });
      }
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
        if (item.amount > 0) {
          if (item.feeType == '' || item.feeType == null) {
            this.$Message.error(msg + '请选择费用类型');
            return;
          }
          form.detailList.push(item);
        }
      }

      form.proc = proc.formItem;

      // 提交
      this.loading = 1;
      var uri = '/api/engine/financial/expense/start';
      if (this.pageFlag == 2) {
        uri = '/api/engine/financial/expense/restart';
      }

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
      this.formItem.amount = val;
    },
    reset() {
      if (this.pageFlag == 1) {
        this.initNew();
      } else {
        Object.assign(this.formItem, this.oriItem);
      }
    },
    goBack() {
      this.$router.go(-1);
    },
  }
}

</script>