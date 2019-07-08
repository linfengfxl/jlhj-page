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
                <FormItem label="单据编号" prop="subPlanId">
                  <Input v-model="formItem.subPlanId" disabled  class="width-1" placeholder="自动生成"/>
                </FormItem>
              </td>
               <td>
                <FormItem prop="projectCode" label="工程名称">
                  <SelectProject
                    v-model="formItem.projectCode"
                    :model="formItem"
                    :text="formItem.projectName"
                    @on-select="selProject"
                  />
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
                <FormItem prop="levelCode" label="分包项目">
                  <Select v-model="formItem.levelCode" style="width:100%" @on-change="selSubProjectName()">
                    <Option
                      v-for="item in subProjectNames"
                      :value="item.levelCode"
                      :key="item.levelCode"
                    >{{ item.subProjectName }}</Option>
                  </Select>
                </FormItem>
              </td>
              <td>
                <FormItem label="分包进场日期" prop="entryDate">
                  <Date-picker
                    type="date"
                    style="width:100%"
                    v-model="formItem.entryDate"
                    format="yyyy-MM-dd"
                    @on-change="getDuration"
                  ></Date-picker>
                </FormItem>
              </td>
              <td>
                <FormItem label="分包退场日期" prop="exitDate">
                  <Date-picker
                    type="date"
                    style="width:100%"
                    v-model="formItem.exitDate"
                    format="yyyy-MM-dd"
                    @on-change="getDuration"
                  ></Date-picker>
                </FormItem>
              </td>
            </tr>
            <tr>
               <td>
                <FormItem label="工期" prop="duration"> 
                   <InputNumber v-model="formItem.duration"  style="width:100%" readonly></InputNumber>
                </FormItem>
              </td>
              <td colspan="2">
                <FormItem label="分包原因" prop="reason">
                  <Input type="textarea" :rows="2" v-model="formItem.reason"/>
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
              <td>
                <FormItem label="数量合计" prop="planWorkload">
                  {{formItem.planWorkload}}
                </FormItem>
              </td>
              <td>
                <FormItem label="金额合计" prop="amount">
                  {{formItem.amount}}
                </FormItem>
              </td>
            </tr>
          </table>
        </Form>
      </div>
      <div>
        <div class="subheader">单据明细</div>
        <Editable ref="editable" :list="list" :editable="true" :model="formItem" @on-amount-change="onAmountChange"></Editable>
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
import UploadBox from '@/components/upload/Index';
import pagejs from '@/assets/js/page';
export default {
  components: {
    Loading,
    LayoutHor,
    Editable,
    SelectProject,
    UploadBox
  },
  data() {
    return {
      loading: 0,
      subPlanId: '',
      pageFlag: 1,//1.新建 2.编辑 3.修订
      isEdit: 0,
      formItem: {
        subPlanId: '',//单据编号
        projectCode: '',//对应工程
        projectName: '',//对应工程
        subType: '',//分包类型
        levelCode:'',
        subProjectName:'',
        entryDate:'',
        exitDate:'',
        duration: 0,
        reason: '',
        files: '',
        planWorkload: 0,
        amount: 0,   
      },
      formRules: {
        projectCode: [
          { required: true, whitespace: true, message: '请选择工程', trigger: 'change' }
        ],
        subType: [
          { required: true, whitespace: true, message: '请选择分包类型', trigger: 'change' }
        ],
        levelCode: [
          { required: true, whitespace: true, message: '请选择分包项目', trigger: 'change' }
        ],
      },
      list: [],
      oriItem: {},
      subProjectNames:[],
      subTypes: [
        {code:'劳务分包',text:'劳务分包'},
        {code:'专业分包',text:'专业分包'},
      ],
    }
  },
  
  mounted: function () {
    this.subPlanId = this.$route.query.id;
    if (this.subPlanId) {
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
        return '分包需求计划 - 创建';
      }
      if (this.pageFlag == 2) {
        return '分包需求计划 - 编辑';
      }
      if (this.pageFlag == 3) {
        return '分包需求计划 - 修订';
      }
    }
  },
  methods: {
    selProject() {
      if(this.formItem.projectCode){
        this.$http.post("/api/engine/project/workload/listAll", {projectCode: this.formItem.projectCode }).then((res) => {
          this.loading = 0;
          if (res.data.code == 0) {
            if (res.data.data.rows) {
              this.subProjectNames=res.data.data.rows;
            } 
          } else {
            this.$Message.error(res.data.message);
          }
        }).catch((error) => {
          this.loading = 0;
          this.$Message.error("操作失败！")
        });
      }
    },
    getDuration(){
      if(this.formItem.entryDate!=''&&this.formItem.exitDate!=''){
        var sdate = new Date(this.formItem.entryDate); 
      　 var now = new Date(this.formItem.exitDate); 
      　 var days = now.getTime() - sdate.getTime(); 
      　 var day = parseInt(days / (1000 * 60 * 60 * 24)); 
      　　this.formItem.duration=day+1;
      }
    },
    selSubProjectName(){
      this.subProjectNames.map((item)=>{
        if(this.formItem.levelCode==item.levelCode){
          this.formItem.subProjectName=item.subProjectName;
        }
      })      
    },
    load() { 
      this.loading = 1;
      this.$http.post("/api/engine/sub/plan/get", { subPlanId: this.subPlanId }).then((res) => {
        this.loading = 0;
        if (res.data.code == 0) {
          if (res.data.data) {
            console.log(res.data.data);
            this.oriItem = eval('(' + JSON.stringify(res.data.data) + ')');
            Object.assign(this.formItem, res.data.data);
            this.selProject();
            this.list = res.data.data.detailList;
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
        subPlanId: '',//单据编号
        projectCode: '',//对应工程
        projectName: '',//对应工程
        subType: '',//分包类型
        levelCode:'',
        subProjectName:'',
        entryDate:'',
        exitDate:'',
        duration: 0,
        reason: '',
        files: '',
        planWorkload: 0,
        amount: 0,   
      });
      this.list = [];
      this.list.push(this.$refs.editable.listNewRow());
      this.list.push(this.$refs.editable.listNewRow());
    },
    save(proc) {
      var form = {
        detailList: []
      };
      Object.assign(form, this.formItem);
      form.entryDate = page.formatDate(form.entryDate);
      form.exitDate = page.formatDate(form.exitDate);
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
      var uri = '/api/engine/sub/plan/add';
      if (this.pageFlag == 2) {
        uri = '/api/engine/sub/plan/update';
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
    onAmountChange(total){
      this.formItem.planWorkload=total.planWorkload;
      this.formItem.amount=total.amount;
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
