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
          <FormItem label="合同编号" prop="contractId">
            <Input v-model="formItem.contractId" placeholder="合同编号" :disabled="isEdit" />
          </FormItem>
          <FormItem label="合同名称" prop="contractName" >
            <Input v-model="formItem.contractName" placeholder="合同名称"/>
          </FormItem>
          <FormItem label="客户名称" prop="customerName" >
            <Input
              v-model="formItem.customerName"
              placeholder="客户名称"
              class="width-1"
              readonly="readonly"
              icon="search"
              @on-click="selCustomer"
            />
          </FormItem>
          <FormItem prop="signDate" label="签订日期">
             <DatePicker type="date" placeholder="签订日期" v-model="formItem.signDate" format="yyyy-MM-dd" 
             style="width:100%;"></DatePicker>
          </FormItem>
          <FormItem prop="validStartDate" label="合同生效日期" >
             <DatePicker type="date" placeholder="合同生效日期" v-model="formItem.validStartDate" format="yyyy-MM-dd" 
             style="width:100%;"></DatePicker>
          </FormItem>
          <FormItem prop="validEndDate" label="合同终止日期" >
             <DatePicker type="date" placeholder="合同终止日期" v-model="formItem.validEndDate" format="yyyy-MM-dd" 
             style="width:100%;"></DatePicker>
          </FormItem>
          <FormItem prop="amount" label="合同金额">
            <InputNumber
              style="width:100%;"
              :max="9999999999"              
              :min="0"               
              v-model="formItem.amount"
            ></InputNumber>
          </FormItem>
          <FormItem prop="contractType" label="合同类型"> 
            <Select v-model="formItem.contractType">
              <Option v-for="item in $args.getArgGroup('contract_type')" :value="item.argCode" :key="item.argCode">{{ item.argText }}</Option>
            </Select>
          </FormItem>
          <FormItem prop="paySubject" label="付款方"> 
            <Select v-model="formItem.paySubject">
              <Option v-for="item in $args.getArgGroup('pay_subject')" :value="item.argCode" :key="item.argCode">{{ item.argText }}</Option>
            </Select>
          </FormItem>
          <FormItem prop="status" label="合同情况" > 
            <Select v-model="formItem.status">
              <Option v-for="item in contractStatus" :value="item.code" :key="item.code">{{ item.text }}</Option>
            </Select>
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

  export default {
    components: {
      Loading, 
      SelectCustomer
    },
    data() {
      return {
        loading: 1,
        show: false,
        //是否编辑 
        isEdit: false,
        //表单对象
        formItem: {
          contractId: '',
          contractName:'',
          customerCode:'',
          customerName: '',
          signDate: '',
          validStartDate: '',
          validEndDate: '',
          amount:0,
          contractType:'',
          paySubject:'',
          status: '',
        },
        oriItem:{

        },
        //验证
        ruleValidate: {
          contractId: [
            {required: true, whitespace: true, message: '合同编号不能为空', trigger: 'change'},
            {type: 'string', max: 50, message: '不能超过50个字', trigger: 'blur'}
          ],
          contractName: [
            {required: true, whitespace: true, message: '合同名称不能为空', trigger: 'change'},
            {type: 'string', max: 50, message: '不能超过50个字', trigger: 'blur'}
          ],
          customerName: [
            {required: true, whitespace: true, message: '客户名称不能为空', trigger: 'change'},
            {type: 'string', max: 50, message: '不能超过50个字', trigger: 'blur'}
          ],
          status: [
            {required: true, message: '合同情况不能为空', trigger: 'change',type: 'number'},
          ],
        },
        contractStatus:[
        {code:1,text:'已做未签'},
        {code:2,text:'未做'},
        {code:3,text:'已签'},
      ],
      }
    },
    computed: {
      title() {
        if (this.isEdit === 0) {
          return "添加合同信息";
        } else {
          return "编辑合同信息";
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
          url = '/api/engine/financial/contract/update';
          msg = '修改成功';
        } else {
          url = '/api/engine/financial/contract/add';
          msg = '添加成功';
        }
        var form = {};
        Object.assign(form, this.formItem);
        form.signDate = page.formatDate(form.signDate);
        form.validStartDate = page.formatDate(form.validStartDate);
        form.validEndDate = page.formatDate(form.validEndDate);
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
        this.oriItem={};
        if (arg.contractId) {
          this.oriItem = $.extend({
            contractId: '',
            contractName:'',
            customerCode:'',
            customerName: '',
            signDate: '',
            validStartDate: '',
            validEndDate: '',
            contractType:'',
            amount:0,
            paySubject:'',
            status: ''},arg);
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
