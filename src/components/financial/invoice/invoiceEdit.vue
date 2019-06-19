<template>
  <Modal v-model="show" :title="title" :closable="false" :mask-closable="false" width="600">
    <div class="page">
      <Loading :loading="loading">
      <div class="page-form">
        <Form :model="formItem" ref="argForm" :label-width="120" :rules="ruleValidate" class="form-item">

          <div class="form-sub-title">
            <Icon type="compose"></Icon>
            基本资料
          </div>
          <FormItem label="单据编号" prop="invoiceReceiptCode">
            <Input v-model="formItem.invoiceReceiptCode" placeholder="自动生成" readonly/>
          </FormItem>
          <FormItem prop="projectCode" label="工程名称"> 
            <SelectProject v-model="formItem.projectCode" :model="formItem" :text="formItem.projectName" placeholder="工程名称"/>
          </FormItem>
          <FormItem prop="invoiceDate" label="发票日期">
             <DatePicker type="date" placeholder="发票日期" v-model="formItem.invoiceDate" format="yyyy-MM-dd" 
             style="width:100%;"></DatePicker>
          </FormItem>
          <FormItem label="发票类型" prop>
            <Select v-model="formItem.invoiceType" style="width:100%" placeholder="发票类型">
              <Option
                v-for="item in $args.getArgGroup('invoice_type')"
                :value="item.argText"
                :key="item.argText"
              >{{ item.argText }}</Option>
            </Select>
          </FormItem>
          <FormItem label="发票号码" prop="invoiceNo" >
            <Input v-model="formItem.invoiceNo" placeholder="发票号码"/>
          </FormItem>
           <FormItem label="组织机构代码证" prop="orgCode" >
            <Input v-model="formItem.orgCode" placeholder="组织机构代码证"/>
          </FormItem>
          <FormItem prop="amount" label="发票金额">
            <InputNumber
              style="width:100%;"
              :max="99999999999999"              
              :min="0"               
              v-model="formItem.amount"
              @on-change="onAmountChange"
            ></InputNumber>
          </FormItem>
          <FormItem label="金额大写" prop="amountCapital" >
            <Input v-model="formItem.amountCapital" placeholder="金额大写" readonly/>
          </FormItem>
          <FormItem label="纳税人识别号" prop="taxpayerNo" >
            <Input v-model="formItem.taxpayerNo" placeholder="纳税人识别号"/>
          </FormItem>
          <FormItem label="开户银行" prop="bank" >
            <Input v-model="formItem.bank" placeholder="开户银行"/>
          </FormItem>
          <FormItem label="开户账号" prop="bankCardNo" >
            <Input v-model="formItem.bankCardNo" placeholder="开户账号"/>
          </FormItem>
          <FormItem label="付款单位" prop="payOrg" >
            <Input v-model="formItem.payOrg" placeholder="付款单位"/>
          </FormItem>
          <FormItem prop="providerCode" label="收款单位">
            <Input
              v-model="formItem.providerName"
              placeholder="收款单位"
              class="width-1"
              readonly="readonly"
              icon="search"
              @on-click="selProvider"
            />
          </FormItem>
          <FormItem prop="billingType" label="开票类型" > 
            <Select v-model="formItem.billingType">
              <Option v-for="item in billingType" :value="item.code" :key="item.code">{{ item.text }}</Option>
            </Select>
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
      <SelProvider ref="selProvider"></SelProvider>
    </div>
    <div slot="footer"></div>
  </Modal>
</template>
<script>
  import Loading from '@/components/loading'; 
  import SelProvider from '@/components/provider/SelectProvider';
  import page from '@/assets/js/page';
  import SelectProject from '@/components/page/form/SelectProject';
  import UploadBox from '@/components/upload/Index';

  export default {
    components: {
      Loading, 
      SelProvider,
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
          invoiceReceiptCode: '',
          projectCode:'',
          projectName:'',
          invoiceDate:'',
          invoiceType:'',
          invoiceNo:'',
          orgCode:'',
          amount:0,
          amountCapital:'',
          taxpayerNo:'',
          bank:'',
          bankCardNo:'',
          payOrg:'',    
          providerCode:'',
          providerName: '',
          billingType: '',
          remark:'',
          files:'',
        },
        oriItem:{

        },
        //验证
        ruleValidate: {
          projectCode: [
            {required: true, whitespace: true, message: '工程名称不能为空', trigger: 'change'},
            {type: 'string', max: 50, message: '不能超过50个字', trigger: 'blur'}
          ],
        },
        billingType:[
        {code:'劳务',text:'劳务'},
        {code:'分包',text:'分包'},
        {code:'材料采购',text:'材料采购'},
        {code:'材料租赁',text:'材料租赁'},
        {code:'机械采购',text:'机械采购'},
        {code:'机械租赁',text:'机械租赁'},
        {code:'运费',text:'运费'},
        {code:'其他',text:'其他'},
      ],
      }
    },
    computed: {
      title() {
        if (this.isEdit === 0) {
          return "添加发票收票信息";
        } else {
          return "编辑发票收票信息";
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
          url = '/api/engine/financial/invoice/update';
          msg = '修改成功';
        } else {
          url = '/api/engine/financial/invoice/add';
          msg = '添加成功';
        }
        var form = {};
        Object.assign(form, this.formItem);
        form.invoiceDate = page.formatDate(form.invoiceDate);
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
          invoiceReceiptCode: '',
          projectCode:'',
          projectName:'',
          invoiceDate:'',
          invoiceType:'',
          invoiceNo:'',
          orgCode:'',
          amount:0,
          amountCapital:'',
          taxpayerNo:'',
          bank:'',
          bankCardNo:'',
          payOrg:'',    
          providerCode:'',
          providerName: '',
          billingType: '',
          remark:'',
          files:'',
        };
        if (arg.invoiceReceiptCode) {
          this.oriItem = $.extend({
            invoiceReceiptCode: '',
            projectCode:'',
            projectName:'',
            invoiceDate:'',
            invoiceType:'',
            invoiceNo:'',
            orgCode:'',
            amount:0,
            amountCapital:'',
            taxpayerNo:'',
            bank:'',
            bankCardNo:'',
            payOrg:'',    
            providerCode:'',
            providerName: '',
            billingType: '',
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
      selProvider(row) {
        var sel = this.$refs.selProvider;//引用该控件，赋值给变量对象
        sel.show({
          ok: (data) => {
            if (data) {
              this.formItem.providerName = data.providerName;
              this.formItem.providerCode = data.providerCode;
            }
          }
        });
      },
      reset() {
        $.extend(this.formItem,this.oriItem);
      },
      onAmountChange(){
        this.formItem.amountCapital=this.digitUppercase(this.formItem.amount);
      },
      digitUppercase(n) {
      var fraction = ['角', '分'];
      var digit = [
      '零', '壹', '贰', '叁', '肆',
      '伍', '陆', '柒', '捌', '玖'
      ];
      var unit = [
      ['圆', '万', '亿'],
      ['', '拾', '佰', '仟']
      ];
      var head = n < 0 ? '欠' : '';
      n = Math.abs(n);
      var s = '';
      for (var i = 0; i < fraction.length; i++) {
        s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
      }
      s = s || '整';
      n = Math.floor(n);
      for (var i = 0; i < unit[0].length && n > 0; i++) {
        var p = '';
        for (var j = 0; j < unit[1].length && n > 0; j++) {
          p = digit[n % 10] + unit[1][j] + p;
          n = Math.floor(n / 10);
        }
        s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
      }
      return head + s.replace(/(零.)*零分/, '分')
      .replace(/(零.)+/g, '圆')
      .replace(/^整$/, '整');

    },
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
