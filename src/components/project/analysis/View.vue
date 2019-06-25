<template>
  <ViewProcess ref="ViewProcess" :instId="instId" :title="title" :max="1" :loading="loading" @on-load="instLoaded" @on-submit="save">
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
                  <FormItem prop="analysisDate" label="日期">
                    {{formItem.analysisDate}}
                  </FormItem>
                </td>
                <td>
                  <FormItem prop label="成本分析表名称">
                    {{formItem.analysisName}}
                  </FormItem>
                </td>
              </tr>
              <tr>
                <td>
                  <FormItem prop="fee" label="费用">
                    {{formItem.fee}}
                  </FormItem>
                </td> 
                <td>
                  <FormItem prop label="工程造价合计">
                    {{formItem.totalProjectAmount}}
                  </FormItem>
                </td>
                 <td>
                  <FormItem prop label="成本合价合计">
                    {{formItem.totalCostAmount}}
                  </FormItem>
                </td>
              </tr>
              <tr>
                <td>
                  <FormItem prop label="材料成本合计">
                    {{formItem.totalMaterialAmount}}
                </FormItem>
                </td>
                <td>
                  <FormItem prop label="人工成本合计"> 
                    {{formItem.totalLaborAmount}}
                  </FormItem>
                </td>
                <td>
                  <FormItem prop label="机械成本合计"> 
                    {{formItem.totalMachineAmount}}
                  </FormItem>
                </td>
              </tr>
              <tr>   
                <td>
                  <FormItem prop label="材料成本占比"> 
                    {{formItem.materialPercent}}
                  </FormItem>
                </td>
                <td>
                  <FormItem prop label="人工成本占比"> 
                    {{formItem.laborPercent}}
                  </FormItem>
                </td>
                 <td>
                  <FormItem prop label="机械成本占比"> 
                    {{formItem.machinePercent}}
                  </FormItem>
                </td>
              </tr>
              <tr>
                <td>
                  <FormItem prop label="计算">
                    {{formItem.calcPeople}}
                  </FormItem>
                </td>
                <td>
                  <FormItem prop label="复核">
                    {{formItem.reviewPeople}}
                  </FormItem>
                </td>
                 <td>
                  <FormItem prop label="审核">
                    {{formItem.auditPeople}}
                  </FormItem>
                </td>
              </tr>
            </table>
        </Form>
      </div>
      <div>
        <div class="subheader">成本分析明细</div>
          <Editable
            ref="editable"
            :list="list"
            :editable="false"
            @on-amount-change="onAmountChange"
          ></Editable>
      </div>       
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
      title:'成本分析表',
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
      this.analysisId = proc.instance.businessKey;
      this.title = "成本分析表_" + this.analysisId;
      this.load();
    },
    load() {
      this.loading = 1;

      this.$http.post("/api/engine/project/analysis/get", {analysisId: this.analysisId}).then((res) => {
        this.loading = 0;
        if (res.data.code == 0) {
          if (res.data.data) {  
          if(res.data.data.analysisDate!=null)          
            res.data.data.analysisDate=res.data.data.analysisDate.length>=10?res.data.data.analysisDate.substring(0,10):res.data.data.analysisDate; 
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
        analysisId: "", 
        projectCode: "", 
        projectName: "", 
        analysisDate: "", 
        analysisName: "",   
        totalAmount: 0, 
        fee: 0, 
        totalProjectAmount: 0, 
        totalCostAmount: 0, 
        totalMaterialAmount: 0, 
        totalLaborAmount: 0, 
        totalMachineAmount: 0,
        materialPercent: 0, 
        laborPercent: 0, 
        machinePercent: 0, 
        calcPeople: "",
        reviewPeople: "", 
        auditPeople: "", 
        status: 0 //  审批状态
      };
      return obj;
    },
    save(proc) {
      var form = {
        detailList: []
      };

      Object.assign(form, this.formItem);
      form.analysisDate = page.formatDate(form.analysisDate);

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
      var uri = '/api/engine/project/analysis/submit';

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
