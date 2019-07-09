<template>
  <div class="page page-bill">
    <div class="page-bar">
      <LayoutHor>
        <div slot="left">
          <Button size="small" @click="goBack" icon="chevron-left" type="warning">返回</Button>
        </div>
        <div class="page-bar-title">{{pageTitle}}</div>
      </LayoutHor>
    </div>
    <Loading :loading="loading">
      <div class="baseinfo">
        <div class="page-tools"></div>
        <Form ref="form" class="page-form" :model="formItem" :rules="formRules" :label-width="120">
          <table cellspacing="0" cellpadding="0">
            <colgroup>
              <col width="33%">
              <col width="auto">
              <col width="33%">
            </colgroup>
            <tr>
              <td>
                <FormItem label="单据编号" prop="subContractId">
                  <Input v-model="formItem.subContractId" disabled class="width-1" placeholder="自动生成"/>
                </FormItem>
              </td>
              <td>
                <FormItem label="合同编码" prop="subContractCode">
                  <Input v-model="formItem.subContractCode"  class="width-1"/>
                </FormItem>
              </td>
              <td>
                <FormItem label="合同名称" prop="subContractName">
                  <Input v-model="formItem.subContractName" />
                </FormItem>
              </td>
            </tr>
            <tr>
              <td>
                <FormItem prop="projectCode" label="工程名称">
                  <SelectProject
                    v-model="formItem.projectCode"
                    :model="formItem"
                    :text="formItem.projectName"
                  />
                </FormItem>
              </td>
              <td>
                <FormItem label="合同性质" prop="subContractNature">
                  <Input v-model="formItem.subContractNature" />
                </FormItem>
              </td>
               <td>
                <FormItem label="签订日期" prop="signDate">
                  <Date-picker
                    type="date"
                    style="width:100%"
                    v-model="formItem.signDate"
                    format="yyyy-MM-dd"
                  ></Date-picker>
                </FormItem>
              </td>
            </tr>
            <tr>
              <td>
                <FormItem label="签订份数" prop="signNum"> 
                   <InputNumber v-model="formItem.signNum"  style="width:100%"></InputNumber>
                </FormItem>
              </td>
              <td>
                <FormItem label="合同金额" prop="amount">
                  <InputNumber
                    style="width:100%;"
                    :max="9999999999"              
                    :min="0"               
                    v-model="formItem.amount"
                  ></InputNumber>
                </FormItem>
              </td> 
              <td>
                <FormItem prop="subType" label="分包类型">
                  <Select v-model="formItem.subType" style="width:100%" >
                    <Option
                      v-for="item in subTypes"
                      :value="item.code"
                      :key="item.code"
                    >{{ item.text }}</Option>
                  </Select>
                </FormItem>
              </td>
            </tr>
            <tr>
              <td>
                <FormItem label="分包项目" prop="subProjectName">
                  <Input v-model="formItem.subProjectName" />
                </FormItem>
              </td>
              <td>
                <FormItem prop="settleMethod" label="结算方式">
                  <Select v-model="formItem.settleMethod" style="width:100%" >
                    <Option
                      v-for="item in settleMethods"
                      :value="item.code"
                      :key="item.code"
                    >{{ item.text }}</Option>
                  </Select>
                </FormItem>
              </td>
              <td>
                <FormItem prop="providerCode" label="供应商">
                  <SelectProvider
                    v-model="formItem.providerCode"
                    :model="formItem"
                    :text="formItem.providerName"
                    @on-select="selProvider"
                  />
                </FormItem>
              </td>
            </tr>
            <tr> 
              <td>
                <FormItem label="联系人" prop>{{formItem.linkMan}}</FormItem>
              </td>
              <td>
                <FormItem label="付款方式" prop="payWay">
                  <Select v-model="formItem.payWay" style="width:100%" >
                    <Option
                      v-for="item in $args.getArgGroup('pay_way')"
                      :value="item.argCode"
                      :key="item.argCode"
                    >{{ item.argText }}</Option>
                  </Select>
                </FormItem>
              </td>
              <td>
                <FormItem label="预付款" prop>
                  <InputNumber v-model="formItem.prepayment" style="width:100%"></InputNumber>
                </FormItem>
              </td>
            </tr>
            <tr>
              <td>
                <FormItem label="质保金金额" prop="warranty">
                  <InputNumber
                    style="width:100%;"
                    :max="9999999999"              
                    :min="0"               
                    v-model="formItem.warranty"
                  ></InputNumber>
                </FormItem>
              </td>
              <td>
                <FormItem label="税率" prop>
                  {{formItem.taxRate*100+"%"}}
                </FormItem>
              </td>
              <td>
                <FormItem label="合同状态" prop="status">
                  <Select v-model="formItem.status" style="width:100%" >
                    <!--1.执行中 2.终止 3.已结算 4.解除 5关闭 -->
                    <Option v-for="item in status" :value="item.code" :key="item.code">{{ item.text }}</Option>
                  </Select>
                </FormItem>
              </td>
            </tr>
            <tr>
              <td>
                <FormItem label="合同要点" prop="contractPoint">
                  <Input type="textarea" :rows="2" v-model="formItem.contractPoint"/>
                </FormItem>
              </td>
              <td>
                <FormItem label="专项条款" prop="specialTerms">
                  <Input type="textarea" :rows="2" v-model="formItem.specialTerms"/>
                </FormItem>
              </td>
              <td>
                <FormItem label="风险项" prop="riskItem">
                  <Input type="textarea" :rows="2" v-model="formItem.riskItem"/>
                </FormItem>
              </td>
            </tr>
            <tr>
              <td>
                <FormItem label="数量合计">
                  {{formItem.totalWorkload}}
                </FormItem>
              </td>
              <td>
                <FormItem label="金额合计">
                  {{formItem.totalAmount}}
                </FormItem>
              </td>
              <td>
                <FormItem label="含税金额合计" >
                  {{formItem.totalTaxAmount}}
                </FormItem>
              </td>
            </tr>
          </table>
        </Form>
      </div>
      <div>
        <div class="subheader">单据明细</div>
        <Editable ref="editable" :list="list" :taxRate="taxRate" :editable="true" :model="formItem" 
        @on-amount-change="onAmountChange"></Editable>
      </div>
      <table class="savebar" cellpadding="0" cellspacing="0">
        <tr>
          <td class="save" @click="save" v-if="pageFlag<=2">保存</td>
          <td class="reset" @click="reset">重置</td>
          <td></td>
        </tr>
      </table>
    </Loading>
  </div>
</template>
<script>
import Loading from '@/components/loading';
import LayoutHor from '@/components/layout/LayoutHor';
import Editable from './DetailEditable';
import page from '@/assets/js/page';
import floatObj from '@/assets/js/floatObj';
import SelectProject from '@/components/page/form/SelectProject';//工程名称
import SelectProvider from '@/components/page/form/SelectProvider';//供应商
import pagejs from '@/assets/js/page';
export default {
  components: {
    Loading,
    LayoutHor,
    Editable,
    SelectProject,
    SelectProvider,
  },
  data() {
    return {
      loading: 0,
      subContractId: '',
      pageFlag: 1,//1.新建 2.编辑 3.修订
      isEdit: 0,
      formItem: {
        subContractId: '',//单据编号
        subContractCode: '',//合同编码
        subContractName: '',//合同名称
        projectCode: '',//对应工程
        projectName: '',//对应工程
        subContractNature:'',//合同性质
        signDate: '',//签订日期
        signNum: 0,//签定份数
        amount:0,//合同金额
        subType:'',//分包类型
        subProjectName:'',//分包项目
        settleMethod:'',//结算方式
        providerCode: '',//供应商
        providerName: '',//供应商名称
        linkMan: '',//供应商联系人
        payWay: '',//付款方式:从字典中选择
        prepayment: 0,//	预付款
        warranty: 0,//		质保金
        taxRate: 0,//		税率
        taxRate1: 0,//		税率
        contractPoint: '',//		合同要点
        specialTerms: '',//		专项条款
        riskItem: '',//		风险项 
        status: null,//	合同状态 1.执行中 2.终止 3.已结算 4.解除 5关闭  
        totalWorkload:0,//数量合计
        totalAmount:0,//金额合计
        totalTaxAmount:0,//含税金额合计
      },
      formRules: {
        subContractCode: [
          { required: true, whitespace: true, message: '合同编码不能为空', trigger: 'blur' },
          { type: 'string', max: 50, message: '不能超过50个字', trigger: 'blur' }
        ],
        subContractName: [
          { required: true, whitespace: true, message: '合同名称不能为空', trigger: 'blur' },
          { type: 'string', max: 50, message: '不能超过50个字', trigger: 'blur' }
        ],
        projectCode: [
          { required: true, whitespace: true, message: '请选择工程', trigger: 'change' }
        ],
        providerCode: [
          { required: true, whitespace: true, message: '请选择供应商', trigger: 'change' }
        ],
        signNum: [
          {type: 'number', required: true, whitespace: true, message: '签订份数不能为空', trigger: 'blur' },
        ],
        amount: [
          {type: 'number', required: true, whitespace: true, message: '合同金额不能为空', trigger: 'blur' },
        ],
        signDate: [
          {type: 'date', required: true, whitespace: true, message: '签订日期不能为空', trigger: 'change' },
        ],
        status: [
          {type: 'number', required: true, whitespace: true, message: '合同状态不能为空', trigger: 'change' },
        ],
        subProjectName: [
          { required: true, whitespace: true, message: '分包项目不能为空', trigger: 'blur' },
          { type: 'string', max: 50, message: '不能超过50个字', trigger: 'blur' }
        ],
      },
      list: [],
      oriItem: {},
      taxRate:{
        taxRate:0,
      },
      subTypes: [
        {code:'劳务分包',text:'劳务分包'},
        {code:'专业分包',text:'专业分包'},
      ],
      settleMethods: [
        {code:'分段结算',text:'分段结算'},
        {code:'竣工后一次结算',text:'竣工后一次结算'},
        {code:'按进度款结算',text:'按进度款结算'},
      ],
      status: [
        {code:1,text:'执行中'},
        {code:2,text:'终止'},
        {code:3,text:'已结算'},
        {code:4,text:'解除'},
        {code:5,text:'关闭'}
      ]
    }
  },
  
  mounted: function () {
    this.subContractId = this.$route.query.id;
    if (this.subContractId) {
      this.pageFlag = 2;
      this.isEdit=1;
      this.load();
    } else {
      this.pageFlag = 1;
      this.isEdit=0;
      this.initNew();
    }
  },
  computed: {
    pageTitle() {
      if (this.pageFlag == 1) {
        return '分包合同 - 创建';
      }
      if (this.pageFlag == 2) {
        return '分包合同 - 编辑';
      }
      if (this.pageFlag == 3) {
        return '分包合同 - 修订';
      }
    }
  },
  methods: {
    selProvider(data) {
      if (data) {
        this.formItem.providerName = data.providerName;
        this.formItem.providerCode = data.providerCode;
        this.formItem.linkMan = data.linkMan;//供应商联系人
        this.formItem.taxRate = data.taxRate;//税率
        this.taxRate.taxRate=data.taxRate;//明细需要
        this.list.map(mater => {
          this.$refs.editable.onAmountChange(mater);
        })
        
      }
    },
    load() { 
      this.loading = 1;
      this.$http.post("/api/engine/sub/contract/get", { subContractId: this.subContractId }).then((res) => {
        this.loading = 0;
        if (res.data.code == 0) {
          if (res.data.data) {
            this.oriItem = eval('(' + JSON.stringify(res.data.data) + ')');
            //this.formItem.taxRate1 = floatObj.multiply(this.formItem.taxRate, 100);//税率
            Object.assign(this.formItem, res.data.data);
            this.list = res.data.data.detailList;
            this.taxRate.taxRate=this.formItem.taxRate;//明细需要
            var total = {
              totalWorkload:0,
              totalAmount:0,
              totalTaxAmount:0,
            };
            this.list.map(mater => {
              total.totalWorkload = parseFloat(floatObj.add(total.totalWorkload, mater.workload));
              total.totalAmount = parseFloat(floatObj.add(total.totalAmount, mater.amount));
              total.totalTaxAmount = parseFloat(floatObj.add(total.totalTaxAmount, mater.totalAmount));
            });
            this.formItem.totalWorkload=total.totalWorkload;
            this.formItem.totalAmount=total.totalAmount;
            this.formItem.totalTaxAmount=total.totalTaxAmount;
          } else {
            this.$Message.error('合同不存在！');
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
        subContractId: '',//单据编号
        subContractCode: '',//合同编码
        subContractName: '',//合同名称
        projectCode: '',//对应工程
        projectName: '',//对应工程
        subContractNature:'',//合同性质
        signDate: '',//签订日期
        signNum: 0,//签定份数
        amount:0,//合同金额
        subType:'',//分包类型
        subProjectName:'',//分包项目
        settleMethod:'',//结算方式
        providerCode: '',//供应商
        providerName: '',//供应商名称
        linkMan: '',//供应商联系人
        payWay: '',//付款方式:从字典中选择
        prepayment: 0,//  预付款
        warranty: 0,//    质保金
        taxRate: 0,//   税率
        taxRate1: 0,//    税率
        contractPoint: '',//    合同要点
        specialTerms: '',//   专项条款
        riskItem: '',//   风险项 
        status: null,// 合同状态 1.执行中 2.终止 3.已结算 4.解除 5关闭  
        totalWorkload:0,//数量合计
        totalAmount:0,//金额合计
        totalTaxAmount:0,//含税金额合计
      });
      this.list = [];
      this.list.push(this.$refs.editable.listNewRow());
      this.list.push(this.$refs.editable.listNewRow());
    },
    onAmountChange(total){
      this.formItem.totalWorkload=total.totalWorkload;
      this.formItem.totalAmount=total.totalAmount;
      this.formItem.totalTaxAmount=total.totalTaxAmount;
    },
    save(proc) {
      var form = {
        detailList: []
      };
      Object.assign(form, this.formItem);
      form.signDate = page.formatDate(form.signDate);
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
        if (item.subProcess == '') {
          this.$Message.error(msg + '请录入分包工序');
          return;
        }
        form.detailList.push(item);

      }

      // 提交
      this.loading = 1;
      var uri = '/api/engine/sub/contract/add';
      if (this.pageFlag == 2) {
        uri = '/api/engine/sub/contract/update';
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
.instock-edit.page {
  width: 100%;
  margin: 0 auto;
  padding: 10px 20px;
  position: relative;
}
.instock-edit .subheader {
  height: 34px;
  line-height: 34px;
  font-size: 14px;
  border-bottom: 0px solid #efefef;
  margin-bottom: 10px;
  color: #20bfee;
}
.instock-edit .baseinfo {
}
.instock-edit .baseinfo .label {
  width: 80px;
  text-align: right;
  padding-right: 8px;
}
.instock-edit .baseinfo table {
  width: 100%;
}
.instock-edit .baseinfo table td {
  height: 40px;
  padding-right: 4px;
}

.instock-edit .savebar {
  margin-top: 10px;
  height: 40px;
  width: 100%;
  border-collapse: collapse;
}
.instock-edit .savebar td {
  border: 1px solid #fefefe;
  font-size: 14px;
}
.instock-edit .savebar .save {
  width: 120px;
  border: 1px solid #20bfee;
  background-color: #20bfee;
  color: white;
  text-align: center;
  cursor: pointer;
}
.instock-edit .savebar .reset {
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

.instock-edit .tooltip {
  padding: 10px;
  background-color: #fafafa;
  border: 1px solid #efefef;
  border-radius: 3px;
  color: #666;
  margin-top: 10px;
}
</style>
