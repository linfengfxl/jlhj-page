<template>
  <Modal v-model="show" :title="title" :closable="false" :mask-closable="false">
    <div class="page">
      <Loading :loading="loading">
      <div class="page-form">
        <Form :model="formItem" ref="argForm" :label-width="120" :rules="ruleValidate" class="form-item">

          <div class="form-sub-title">
            <Icon type="compose"></Icon>
            基本资料
          </div>
          <FormItem label="单据编号" prop="contractReceiptCode">
            <Input v-model="formItem.contractReceiptCode" placeholder="自动生成" readonly/>
          </FormItem>
          <FormItem label="收款户名" prop="receiptAccount" >
            <Input v-model="formItem.receiptAccount" placeholder="收款户名"/>
          </FormItem>
          <FormItem prop="receiptDate" label="收款日期">
             <DatePicker type="date" placeholder="收款日期" v-model="formItem.receiptDate" format="yyyy-MM-dd" 
             style="width:100%;"></DatePicker>
          </FormItem>
          <FormItem prop="receiptType" label="收款类型" > 
            <Select v-model="formItem.receiptType">
              <Option v-for="item in receiptType" :value="item.code" :key="item.code">{{ item.text }}</Option>
            </Select>
          </FormItem>
          <FormItem prop="projectCode" label="工程名称"> 
            <SelectProject v-model="formItem.projectCode" :model="formItem" :text="formItem.projectName" placeholder="工程名称"/>
          </FormItem>
          <FormItem label="合同甲方" prop="customerName" >
            <Input
              v-model="formItem.customerName"
              placeholder="合同甲方"
              class="width-1"
              readonly="readonly"
              icon="search"
              @on-click="selCustomer"
            />
          </FormItem>
           <FormItem prop="penalty" label="罚款">
            <InputNumber
              style="width:100%;"
              :max="9999999999"              
              :min="0"               
              v-model="formItem.penalty"
            ></InputNumber>
          </FormItem>
           <FormItem prop="deduction" label="扣款">
            <InputNumber
              style="width:100%;"
              :max="9999999999"              
              :min="0"               
              v-model="formItem.deduction"
            ></InputNumber>
          </FormItem>
           <FormItem prop="receiptAmount" label="收款金额">
            <InputNumber
              style="width:100%;"
              :max="9999999999"              
              :min="0"               
              v-model="formItem.receiptAmount"
            ></InputNumber>
          </FormItem>
          <FormItem label="经手人" prop="payee" >
            <Input v-model="formItem.payee" placeholder="经手人"/>
          </FormItem>
          <FormItem label="备注" prop="remark" >
            <Input v-model="formItem.remark" placeholder="备注"/>
          </FormItem>
          <FormItem prop="files" label="附件">
            <UploadBox v-model="formItem.files" :readonly="false"></UploadBox>
          </FormItem> 
          <FormItem >
            <Button type="primary" icon="checkmark" @click="save">保存</Button>
            <Button type="ghost" @click="reset" style="margin-left: 8px" >重置</Button>
            <Button type="ghost" @click="close" style="margin-left: 8px">取消</Button>
          </FormItem> 
        </Form>
      </div>
      </Loading>
      <SelectCustomer ref="selCustomer" :transfer="false"></SelectCustomer>
    </div>
    <div slot="footer"></div>
  </Modal>
</template>
<script>
  import Loading from '@/components/loading'; 
  import SelectCustomer from '@/components/customer/SelectCustomer';
  import page from '@/assets/js/page';
  import SelectProject from '@/components/page/form/SelectProject';
  import UploadBox from '@/components/upload/Index';

  export default {
    components: {
      Loading, 
      SelectCustomer,
      SelectProject,
      UploadBox
    },
    data() {
      return {
        loading: 1,
        show: false,
        //是否编辑 
        isEdit: false,
        //表单对象
        formItem: {
          contractReceiptCode: '',
          receiptAccount:'',
          receiptDate:'',
          receiptType:'',
          projectCode:'',
          projectName:'',
          customerCode:'',
          customerName: '',
          penalty: 0,
          deduction: 0,
          receiptAmount: 0,
          payee:'',
          remark:'',
          files:'',
        },
        oriItem:{

        },
        //验证
        ruleValidate: {
          receiptAccount: [
            {required: true, whitespace: true, message: '收款户名不能为空', trigger: 'change'},
            {type: 'string', max: 50, message: '不能超过50个字', trigger: 'blur'}
          ],
          projectCode: [
            {required: true, whitespace: true, message: '工程名称不能为空', trigger: 'change'},
            {type: 'string', max: 50, message: '不能超过50个字', trigger: 'blur'}
          ],
          customerName: [
            {required: true, whitespace: true, message: '客户名称不能为空', trigger: 'change'},
            {type: 'string', max: 50, message: '不能超过50个字', trigger: 'blur'}
          ],
        },
        receiptType:[
        {code:'进度款',text:'进度款'},
        {code:'完工款',text:'完工款'},
      ],
      }
    },
    computed: {
      title() {
        if (this.isEdit === 0) {
          return "添加合同收款信息";
        } else {
          return "编辑合同收款信息";
        }
      }, 
    },
    methods: {
      save() { 
        this.$refs['argForm'].validate((valid) => {
          if (valid) { 
            this.saveArg();
          } else {
            return;
          }
        });
      },
      saveArg() {
        let url = '';
        let msg = '';
        if (this.isEdit) {
          url = '/api/engine/financial/contractReceipt/update';
          msg = '修改成功';
        } else {
          url = '/api/engine/financial/contractReceipt/add';
          msg = '添加成功';
        }
        var form = {};
        Object.assign(form, this.formItem);
        form.receiptDate = page.formatDate(form.receiptDate);
        this.loading = 1;       
        this.$http.post(url, form).then((res) => {
          this.loading = 0;
          if (res.data.code === 0) {
            this.$Message.success(msg);
            this.close(); 
            this.$emit("on-save");
          } else { 
            this.$Message.error(res.data.message)
          }
        }).catch((error) => {
          this.loading = 0;
          this.$Message.error(error.message)
        });
      },
      open(arg) {
        this.show = true; 
        this.$refs['argForm'].resetFields(); 
        this.oriItem={
            contractReceiptCode: '',
            receiptAccount:'',
            receiptDate:'',
            receiptType:'',
            projectCode:'',
            projectName:'',
            customerCode:'',
            customerName: '',
            penalty: 0,
            deduction: 0,
            receiptAmount: 0,
            payee:'',
            remark:'',
            files:'',};
        if (arg.contractReceiptCode) {
          this.oriItem = $.extend({
            contractReceiptCode: '',
            receiptAccount:'',
            receiptDate:'',
            receiptType:'',
            projectCode:'',
            projectName:'',
            customerCode:'',
            customerName: '',
            penalty: 0,
            deduction: 0,
            receiptAmount: 0,
            payee:'',
            remark:'',
            files:'',
          },arg);
          this.isEdit = true; 
        } else {
          this.isEdit = false; 
        }
        $.extend(this.formItem,this.oriItem);
        this.loading = 0;
      },
      close() {
        this.show = false;
      },
      selCustomer() {
        var sel = this.$refs.selCustomer;
        sel.show({
          ok: (data) => {
            if (data) {
              this.formItem.customerCode = data.customerCode;
              this.formItem.customerName = data.customerName;
            }
          }
        });
      },
      reset() {
        $.extend(this.formItem,this.oriItem);
      }
    }
  }

</script>

<style type="text/css">
  .form-sub-title {
    font-size: 14px;
    margin: 0 0 12px 18px;
    color: #2b85e4;
  }
</style>
