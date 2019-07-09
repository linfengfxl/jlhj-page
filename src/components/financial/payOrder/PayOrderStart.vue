<template>
  <StartProcess ref="startProcess" :defineId="defineId" :loading="loading" :title="pageTitle" @on-submit="save">
      <div class="baseinfo"> 
        <div class="subheader">
          单据表头
        </div>
        <Form ref="form" class="page-form" :model="formItem" :rules="formRules" :label-width="120">
          <table cellspacing="0" cellpadding="0">
            <colgroup>
              <col width="50%">
              <col width="50%">
            </colgroup>
            <tr>
              <td>
                <FormItem prop="fundsPlan" label="资金计划类型"> 
                  <Select v-model="formItem.fundsPlan" @on-change="barnchChange">
                    <Option v-for="item in fundsPlan" :value="item.code" :key="item.code">{{ item.text }}</Option>
                  </Select>
                </FormItem>
              </td>
              <td>
                <FormItem prop="payType" label="付款分类" > 
                  <Select v-model="formItem.payType" @on-change="barnchChange">
                    <Option v-for="item in payType" :value="item.code" :key="item.code">{{ item.text }}</Option>
                  </Select>
                </FormItem>
              </td>
            </tr>
            <tr>
              <td>
                <FormItem prop="payDate" label="付款日期">
                   <DatePicker type="date" placeholder="" v-model="formItem.payDate" format="yyyy-MM-dd" 
                   style="width:100%;"></DatePicker>
                </FormItem>
              </td>
              <td>
                <FormItem prop="projectCode" label="工程名称"> 
                  <SelectProject v-model="formItem.projectCode" :model="formItem" :text="formItem.projectName" />
                </FormItem>
              </td>
            </tr>
            <tr>  
              <td>
                <FormItem label="供应商" prop="providerCode">
                  <Input
                    v-model="formItem.providerName"
                    placeholder
                    class="width-1"
                    readonly="readonly"
                    icon="search"
                    @on-click="selProvider"
                  />
                </FormItem>
              </td>
             <td>
                <FormItem prop="bank" label="开户银行"> 
                  <Input v-model="formItem.bank"/>
                </FormItem>
              </td> 
            </tr> 
             <tr> 
               <td>
                <FormItem prop="bankAccount" label="银行户名"> 
                  <Input v-model="formItem.bankAccount"/>
                </FormItem>
              </td> 
              <td>
                <FormItem prop="bankCardNo" label="开户账号"> 
                  <Input v-model="formItem.bankCardNo"/>
                </FormItem>
              </td>    
            </tr> 
            <tr>
               <td>
                <FormItem prop="amount" label="付款金额">
                   <InputNumber
                      style="width:100%;"
                      :max="9999999999"              
                      :min="0"               
                      v-model="formItem.amount"
                      @on-change="onAmountChange"
                    ></InputNumber>
                </FormItem>
              </td>
               <td>
                <FormItem prop="amountCapital" label="付款金额大写"> 
                  <Input v-model="formItem.amountCapital"/>
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
                <FormItem prop="payWay" label="付款方式">
                  <Select v-model="formItem.payWay">
                    <Option v-for="item in $args.getArgGroup('pay_way')" :value="item.argCode" :key="item.argCode">{{ item.argText }}</Option>
                  </Select>
                </FormItem>
              </td>  
            </tr>
            <tr>
               <td>
                <FormItem prop="legalSubject" label="法律主体">
                  <Select v-model="formItem.legalSubject">
                    <Option v-for="item in $args.getArgGroup('legal_subject')" :value="item.argCode" :key="item.argCode">{{ item.argText }}</Option>
                  </Select>
                </FormItem>
              </td>    
              <td>
                <FormItem prop="payDesc" label="付款说明">
                  <Input v-model="formItem.payDesc"/>
                </FormItem>
              </td> 
            </tr>
          </table>
        </Form>
      </div>
       <SelProvider ref="selProvider" :transfer="false"></SelProvider>      
</StartProcess>  
</template>
<script>
import Loading from '@/components/loading';
import LayoutHor from '@/components/layout/LayoutHor';
import page from '@/assets/js/page';
import floatObj from '@/assets/js/floatObj'; 
import pagejs from '@/assets/js/page';
import UploadBox from '@/components/upload/Index';
import SelProvider from '@/components/provider/SelectProvider';
import SelectProject from '@/components/page/form/SelectProject';
import SelectDept from '@/components/page/form/SelectDept';
import SelectMember from '@/components/page/form/SelectMember';

import StartProcess from '@/components/workflow/process/Start';

export default {
  components: {
    Loading,
    LayoutHor,    
    UploadBox,
    SelectProject,
    SelectDept,
    StartProcess,
    SelProvider,
    SelectMember,
    page
  },
  data() {
    return {
      loading: 0,
      pageFlag: 1,//1.新建 2.编辑 3.修订
      formItem: {
        payOrderId:'',
        fundsPlan:'',
        payType:'',
        payDate:'',
        projectCode:'',
        projectName:'',
        providerCode:'',
        providerName:'',
        bank:'',
        bankAccount:'',
        bankCardNo:'',
        amount:0,
        amountCapital:'',
        operatorName:'',
        payWay:'',
        legalSubject:'',
        payDesc:'',
        status:0,
        instId:0
      },
      formRules: {
        fundsPlan:[
          { required: true, whitespace: true, message: '该项为非空', trigger: 'change' }
        ],
        providerCode:[
          { required: true, whitespace: true, message: '该项为非空', trigger: 'change' }
        ],
        payType:[
          { required: true, whitespace: true, message: '该项为非空', trigger: 'change' }
        ],
        projectCode:[
          { required: true, whitespace: true, message: '该项为非空', trigger: 'change' }
        ],
        operatorName:[
          { required: true, whitespace: true, message: '该项为非空', trigger: 'change' }
        ]
      },
      defineId:7,
      payOrderId:'',
      oriItem: {},
      fundsPlan:[
        {code:'计划内',text:'计划内'},
        {code:'计划外',text:'计划外'},
      ],
      payType:[
        {code:'材料采购付款',text:'材料采购付款'},
        {code:'机械租赁付款',text:'机械租赁付款'},
        {code:'分包结算付款',text:'分包结算付款'},
        {code:'其它付款',text:'其它付款'},
      ],
    }
  },
  mounted: function () {
    this.payOrderId = this.$route.query.id;
    if (this.payOrderId) {
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
        return '付款单';
      }
      if (this.pageFlag == 2) {
        return '付款单 - 重新发起';
      }
    }
  },
  methods: {
    load() {
      this.loading = 1;
      this.$http.post("/api/engine/financial/payOrder/get", {payOrderId:this.payOrderId}).then((res) => {
        this.loading = 0;
        if (res.data.code == 0) {
          if (res.data.data) {
            this.oriItem = eval('(' + JSON.stringify(res.data.data) + ')');
            Object.assign(this.formItem, res.data.data);
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
        payOrderId:'',
        fundsPlan:'',
        payType:'',
        payDate:page.formatDate(new Date(),'yyyy-MM-dd'),
        projectCode:'',
        projectName:'',
        providerCode:'',
        providerName:'',
        bank:'',
        bankAccount:'',
        bankCardNo:'',
        amount:0,
        amountCapital:'',
        operatorName:'',
        payWay:'',
        legalSubject:'',
        payDesc:'',
        status:0,
        instId:0
      });
      this.formItem.operatorName=this.$user.trueName;
    },
    save(proc) {
      var form = {};
      Object.assign(form, this.formItem);
      form.payDate = page.formatDate(form.payDate);
      var pass = true;
      this.$refs.form.validate((valid) => {
        pass = valid;
      })

      if (!pass) {
        this.$Message.error('验证未通过！');
        return;
      }
      form.proc = proc.formItem;

      // 提交
      this.loading = 1;
      var uri = '/api/engine/financial/payOrder/start';
      if (this.pageFlag == 2) {
        uri = '/api/engine/financial/payOrder/restart';
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
    selProvider() {
      var sel = this.$refs.selProvider;
      sel.show({
        ok: (data) => {
          if (data) {
            this.formItem.providerCode = data.providerCode;
            this.formItem.providerName = data.providerName;
            this.formItem.bank = data.bank;
            this.formItem.bankAccount = data.bankAccount;
            this.formItem.bankCardNo = data.bankCardNo;
          }
        }
      });
    },
    onAmountChange(){
      this.formItem.amountCapital=this.digitUppercase(this.formItem.amount);
    },
    barnchChange(){
      this.$http.post("/api/engine/workflow/define/getByForm", {key:'fkd',branch1:this.formItem.fundsPlan,branch2:this.formItem.payType}).then((res) => {
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

<style type="text/css">
.payPlan-edit.page {
  position: relative;
}
.payPlan-edit .subheader {
  height: 34px;
  line-height: 34px;
  font-size: 14px;
  border-bottom: 0px solid #efefef;
  margin-bottom: 10px;
  color: #20bfee;
}
.payPlan-edit .baseinfo {
}
.payPlan-edit .baseinfo .label {
  width: 80px;
  text-align: right;
  padding-right: 8px;
}
.payPlan-edit .baseinfo table {
  width: 100%;
}
.payPlan-edit .baseinfo table td {
  height: 40px;
  padding-right: 4px;
}

.payPlan-edit .savebar {
  margin-top: 10px;
  height: 40px;
  width: 100%;
  border-collapse: collapse;
}
.payPlan-edit .savebar td {
  border: 1px solid #fefefe;
  font-size: 14px;
}
.payPlan-edit .savebar .save {
  width: 120px;
  border: 1px solid #20bfee;
  background-color: #20bfee;
  color: white;
  text-align: center;
  cursor: pointer;
}
.payPlan-edit .savebar .reset {
  width: 60px;
  border: 1px solid #a1e7f8;
  background-color: #a1e7f8;
  color: white;
  text-align: center;
  cursor: pointer;
}

.selectinput {
  cursor: pointer;
}

.payPlan-edit .tooltip {
  padding: 10px;
  background-color: #fafafa;
  border: 1px solid #efefef;
  border-radius: 3px;
  color: #666;
  margin-top: 10px;
}
</style>
