<template>
  <StartProcess ref="startProcess" defineId="15" :title="pageTitle" max="1" :loading="loading" @on-submit="save">
        <div class="baseinfo">
          <div class="page-tools"></div>
          <Form
            ref="form"
            class="page-form"
            :model="formItem"
            :rules="formRules"
            :label-width="120"
          >
            <table cellspacing="0" cellpadding="0">
              <colgroup>
                <col width="33%">
                <col width="auto">
                <col width="33%">
              </colgroup>
              <tr>
                 <td>
                  <FormItem prop="projectCode" label="工程名称">
                    <SelectProject
                      v-model="formItem.projectCode"
                      :model="formItem"
                      :text="formItem.projectName"
                      @on-select="onQueryChange"
                    />
                  </FormItem>
                </td>
                <td>
                  <FormItem prop="analysisDate" label="日期">
                    <Date-picker
                      type="date"
                      placeholder="选择日期"
                      v-model="formItem.analysisDate"
                      format="yyyy-MM-dd"
                    ></Date-picker>
                  </FormItem>
                </td>
                <td>
                  <FormItem prop label="成本分析表名称">
                    <Input v-model="formItem.analysisName"/>
                  </FormItem>
                </td>
              </tr>
              <tr>
                <td>
                  <FormItem prop="fee" label="费用">
                     <InputNumber
                        style="width:100%;"
                        :max="9999999999"              
                        :min="0"               
                        v-model="formItem.fee"
                      ></InputNumber>
                  </FormItem>
                </td> 
                <td v-if="$user.hasPower('wdsx.cbfxbszkj')">
                  <FormItem prop label="工程造价合计">
                    <Input v-model="formItem.totalProjectAmount" readonly="readonly" placeholder="自动计算"/>
                  </FormItem>
                </td>
                <td  v-if="$user.hasPower('wdsx.cbfxbszkj')">
                  <FormItem prop label="成本合价合计">
                    <Input v-model="formItem.totalCostAmount" readonly="readonly" placeholder="自动计算"/>
                  </FormItem>
                </td>
              </tr>
              <tr  v-if="$user.hasPower('wdsx.cbfxbszkj')"> 
                <td>
                  <FormItem prop label="材料成本合计">
                    <Input v-model="formItem.totalMaterialAmount" readonly="readonly" placeholder="自动计算"/>
                </FormItem>
                </td>
                <td>
                  <FormItem prop label="人工成本合计"> 
                    <Input v-model="formItem.totalLaborAmount" readonly="readonly" placeholder="自动计算"/>
                  </FormItem>
                </td>
                <td>
                  <FormItem prop label="机械成本合计"> 
                    <Input v-model="formItem.totalMachineAmount" readonly="readonly" placeholder="自动计算"/>
                  </FormItem>
                </td>
              </tr>
              <tr  v-if="$user.hasPower('wdsx.cbfxbszkj')"> 
                <td>
                  <FormItem prop label="材料成本占比"> 
                    <Input v-model="formItem.materialPercent" readonly="readonly" placeholder="自动计算"/>
                  </FormItem>
                </td>
                <td>
                  <FormItem prop label="人工成本占比"> 
                    <Input v-model="formItem.laborPercent" readonly="readonly" placeholder="自动计算"/>
                  </FormItem>
                </td>
                <td>
                  <FormItem prop label="机械成本占比"> 
                    <Input v-model="formItem.machinePercent" readonly="readonly" placeholder="自动计算"/>
                  </FormItem>
                </td>
              </tr>
              <tr>
                <td>
                  <FormItem prop label="计算">
                    <Input v-model="formItem.calcPeople"/>
                  </FormItem>
                </td>
                <td>
                  <FormItem prop label="复核">
                    <Input v-model="formItem.reviewPeople" />
                  </FormItem>
                </td>
                <td>
                  <FormItem prop label="审核">
                    <Input v-model="formItem.auditPeople"/>
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
            :editable="true"
            @on-import="onImport"
            @on-amount-change="onAmountChange"
          ></Editable>
        </div>
  </StartProcess>
</template>
<script>
import Loading from "@/components/loading";
import LayoutHor from "@/components/layout/LayoutHor";
import Editable from "./DetailEditable";
import page from "@/assets/js/page";
import floatObj from "@/assets/js/floatObj";
import SelectProject from "@/components/page/form/SelectProject";
import StartProcess from "@/components/workflow/process/Start";
export default {
  components: {
    Loading,
    LayoutHor,
    Editable,
    SelectProject,
    StartProcess
  },
  props: {
    api: {
      type: String,
      default: '/api/engine/project/quantity/listAll'
    },
  },
  data() {
    return {
      loading: 0,
      pageFlag: 1, //1.新建 2.编辑 3.修订
      formItem: this.getInitFormItem(),
      formRules: {
        projectCode: [
          {
            required: true,
            whitespace: true,
            message: "请选择工程",
            trigger: "change"
          }
        ]
      },
      list: [],
      ExcelList: [],
      fileId:'',//导入文件id
      analysisId:'',
      oriItem: {},
      
    };
  },
  mounted: function () {
    this.analysisId = this.$route.query.id;
    this.fileId = this.$route.query.fileId;
    if (this.analysisId) {
      this.pageFlag = 2;
      this.load();
    } else {
      this.pageFlag = 1;
      this.initNew();
      if(this.fileId){
        this.importExcel(this.fileId);
      }
    }
  },
  computed: {
    pageTitle() {
      if (this.pageFlag == 1) {
        return "成本分析表 - 创建";
      }
      if (this.pageFlag == 2) {
        return "成本分析表 - 编辑";
      }
    }
  },
  methods: {
    load() {
      this.loading = 1;
      this.$http
        .post("/api/engine/project/analysis/get", {
          analysisId: this.analysisId
        })
        .then(res => {
          this.loading = 0;
          if (res.data.code == 0) {
            if (res.data.data) {
              this.oriItem = eval("(" + JSON.stringify(res.data.data) + ")");
              Object.assign(this.formItem, res.data.data);
              this.list = res.data.data.detailList;
              this.$nextTick(() => {
                this.list = res.data.data.detailList;
              })
            } else {
              this.$Message.error("订单不存在！");
              this.goBack();
            }
          } else {
            this.$Message.error(res.data.message);
          }
        })
        .catch(error => {
          this.loading = 0;
          this.$Message.error("操作失败！");
        });
    },
    initNew() {
      Object.assign(this.formItem, this.getInitFormItem());
      this.list = [];
    },
    save(proc) {
      var form = {
        detailList: []
      };

      Object.assign(form, this.formItem);
      form.analysisDate = page.formatDate(form.analysisDate);
      var pass = true;
      this.$refs.form.validate(valid => {
        pass = valid;
      });
      if (!pass) {
        this.$Message.error("验证未通过！");
        return;
      }
      form.detailList = [];
      // 明细
      for (var i = 0; i < this.list.length; i++) {
        var item = this.list[i];
        var msg = "明细第 " + (i + 1) + " 行，";
        if (item.levelCode == ''||item.levelCode == null) {
          this.$Message.error(msg + '层级编码不能为空');
          return;
        }
        form.detailList.push(item);
      }

      form.proc = proc.formItem;
      // 提交
      this.loading = 1;
      var uri = "/api/engine/project/analysis/add ";
      if (this.pageFlag == 2) {
        uri = "/api/engine/project/analysis/update ";
      }
      this.$http
        .post(uri, form)
        .then(res => {
          this.loading = 0;
          if (res.data.code == 0) {
            this.$Message.success("操作成功！");
            this.goBack();
          } else {
            this.$Message.error(res.data.message);
          }
        })
        .catch(error => {
          this.loading = 0;
          this.$Message.error("请求失败，请重新操作");
        });
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
    onAmountChange(total) {
      this.formItem.totalProjectAmount = total.totalProjectAmount;
      this.formItem.totalCostAmount = total.totalCostAmount;
      this.formItem.totalMaterialAmount = total.totalMaterialAmount;
      this.formItem.totalLaborAmount = total.totalLaborAmount;
      this.formItem.totalMachineAmount = total.totalMachineAmount;
      if(total.totalCostAmount>0){
        this.formItem.materialPercent = floatObj.divide(total.totalMaterialAmount,total.totalCostAmount);
        this.formItem.laborPercent = floatObj.divide(total.totalLaborAmount,total.totalCostAmount);
        this.formItem.machinePercent = floatObj.subtract(1,floatObj.add(this.formItem.materialPercent,this.formItem.laborPercent));
      }
    },
    // 对运输结算单进行新增前判断,通过后获取列表
    onImport() {
      if (this.formItem.projectCode == "") {
        this.$Message.error("请选择工程");
        return;
      }
      var param = {};
      param.projectCode = this.formItem.projectCode;
      this.$http.post(this.api, param).then((res) => {
        this.loading = 0;
        if (res.data.code === 0) {
          this.loading = 0;
          var data = res.data.data;
          res.data.data.rows.map((item)=>{
            item.workload=item.reviewWorkload;
            item.materialFee=0;
            item.laborFee=0;
            item.machineFee=0;
            item.totalFee=0;
            item.reviewPrice=0;
            item.differPrice=0;
            item.projectAmount=0;
            item.costAmount=0;
            item.materialAmount=0;
            item.laborAmount=0;
            item.machineAmount=0;
          })
          this.list = data.rows;
          if (this.list.length == 0) {
            this.$Message.error("抱歉，没有找到对应数据");
          } else {
            this.$Message.success("共查询" + this.list.length + "条数据");
          }
        } else {
          this.loading = 0;
          this.list = [];
          this.$Message.error(res.data.message);
        }
      }).catch((error) => {
        this.loading = 0;
        this.$Message.error("请求失败，请重新发送")
      });

    },
    onQueryChange() {
      this.list = [];
      this.onImport();
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
    //导入excel
    importExcel(fileId){
      this.$http.post('/api/engine/project/analysis/import', {fileId:fileId}).then((res) => {
        if (res.data.code === 0) {
          this.ExcelList=res.data.data;
          //主表
          this.formItem.projectCode=this.ExcelList[0][0];
          this.formItem.projectName=this.ExcelList[0][1];
          this.formItem.calcPeople=this.ExcelList[this.ExcelList.length-1][1];
          this.formItem.reviewPeople=this.ExcelList[this.ExcelList.length-1][5];
          this.formItem.auditPeople=this.ExcelList[this.ExcelList.length-1][9];
          this.formItem.analysisDate=this.ExcelList[this.ExcelList.length-1][13];
          this.formItem.materialPercent=this.ExcelList[this.ExcelList.length-2][12];
          this.formItem.laborPercent=this.ExcelList[this.ExcelList.length-2][13];
          this.formItem.machinePercent=this.ExcelList[this.ExcelList.length-2][14];
          this.formItem.totalProjectAmount=this.ExcelList[this.ExcelList.length-3][10];
          this.formItem.totalCostAmount=this.ExcelList[this.ExcelList.length-3][11];
          this.formItem.totalMaterialAmount=this.ExcelList[this.ExcelList.length-3][12];
          this.formItem.totalLaborAmount=this.ExcelList[this.ExcelList.length-3][13];
          this.formItem.totalMachineAmount=this.ExcelList[this.ExcelList.length-3][14];
          //明细
          var obj={}
          for(var i=2;i<this.ExcelList.length-3;i++){
            if(this.ExcelList[i][0]!=''){
              obj = {
                levelCode: this.ExcelList[i][0], 
                subProjectName: this.ExcelList[i][1], 
                workload: parseInt(this.ExcelList[i][2]), 
                unit: this.ExcelList[i][3], 
                materialFee: parseInt(this.ExcelList[i][4]), 
                laborFee: parseInt(this.ExcelList[i][5]), 
                machineFee: parseInt(this.ExcelList[i][6]), 
                totalFee: parseInt(this.ExcelList[i][7]), 
                reviewPrice: parseInt(this.ExcelList[i][8]), 
                differPrice: parseInt(this.ExcelList[i][9]), 
                projectAmount: parseInt(this.ExcelList[i][10]), 
                costAmount: parseInt(this.ExcelList[i][11]), 
                materialAmount: parseInt(this.ExcelList[i][12]), 
                laborAmount: parseInt(this.ExcelList[i][13]), 
                machineAmount: parseInt(this.ExcelList[i][14]),
                remark: this.ExcelList[i][15]
              };
              this.list.push(obj);
            }
          }
          for(var i=0;i<this.list.length;i++){
            this.$refs.editable.computedAmount(i);
          }
        } else {
          this.$Message.error(res.data.message)
        }
      }).catch((error) => {
        this.$Message.error(error.toString())
      });
    },
  }
};
</script>

<style type="text/css">

</style>
