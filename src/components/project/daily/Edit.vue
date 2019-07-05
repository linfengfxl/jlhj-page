<template>
  <StartProcess
    ref="startProcess"
    defineId="11"
    :title="pageTitle"
    :max="1"
    :loading="loading"
    @on-submit="save"
  >
    <div class="baseinfo">
      <div class="page-tools"></div>
      <Form ref="form" class="page-form" :model="formItem" :rules="formRules" :label-width="120">
        <table cellspacing="0" cellpadding="0">
          <colgroup>
            <col width="50%" />
            <col width="50%" />
          </colgroup>
          <tr>
            <td>
              <FormItem label="本日进行" prop="dayWork">
                <Input type="textarea" :rows="2" v-model="formItem.dayWork" />
              </FormItem>
            </td>
            <td>
              <FormItem label="明日计划" prop="nextDayPlan">
                <Input type="textarea" :rows="2" v-model="formItem.nextDayPlan" />
              </FormItem>
            </td>
          </tr>
        </table>
      </Form>
    </div>
    <div class="subheader">完成工作项</div>
    <Editable ref="editable" :list="list" :editable="true" :projectCode="projectCode"></Editable>
    <div class="subheader">劳务用工</div>
    <div class="editable-table-container editable">
      <table cellspacing="0" cellpadding="0">
        <thead>
          <th>技工人数</th>
          <th>力工人数</th>
          <th>工作内容</th>
        </thead>
        <tbody>
          <tr>
            <td>
              <InputNumber :max="999999" :min="0" v-model="formItem.skillWorkload"></InputNumber>
            </td>
            <td>
              <InputNumber :max="999999" :min="0" v-model="formItem.strongWorkload"></InputNumber>
            </td>
            <td>
              <Input type="textarea" :rows="1" v-model="formItem.remark" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div>
      <div
        class="demo-tabs-style1"
        style="background: #e3e8ee;padding:2px;width:100%; margin-top:30px;"
      >
        <Tabs type="card">
          <TabPane label="入库单" name="name2">
            <div class="page-datatable">
              <SelectRkd
                ref="selectRkd"
                :list="rkdList"
                :editable="true"
                :projectCode="projectCode"
              ></SelectRkd>
              <!-- <i-table :columns="columns2" :data="rkdList"></i-table> -->
            </div>
          </TabPane>
          <TabPane label="机械作业单" name="name3">
            <div class="page-datatable">
              <SelectJxzyd
                ref="selectJxzyd"
                :list="jxzydList"
                :editable="true"
                :projectCode="projectCode"
              ></SelectJxzyd>
              <!-- <i-table :columns="columns3" :data="jxzydList"></i-table> -->
            </div>
          </TabPane>
          <TabPane label="运输小票" name="name4">
            <div class="page-datatable">
              <SelectYsxp
                ref="selectYsxp"
                :list="ysxpList"
                :editable="true"
                :projectCode="projectCode"
              ></SelectYsxp>
              <!-- <i-table :columns="columns4" :data="ysxpList"></i-table> -->
            </div>
          </TabPane>
        </Tabs>
      </div>
    </div>
    <!-- 当日的 劳务用工、入库单 、
      机械作业单、
    运输小票-->

    <!-- <table class="savebar" cellpadding="0" cellspacing="0">
        <tr>
          <td class="save" @click="save" v-if="pageFlag<=2">保存</td>
          <td class="reset" @click="reset">重置</td>
          <td></td>
        </tr>
    </table>-->
  </StartProcess>
</template>
<script>
import Loading from '@/components/loading';
import LayoutHor from '@/components/layout/LayoutHor';
import Editable from './DetailEditable';
//import Editable2 from './DetailEditable2';
import page from '@/assets/js/page';
import floatObj from '@/assets/js/floatObj';
import dateFormat from "@/assets/js/dateFormat";
import SelStorage from '@/components/storage/input/SelStorage';//仓库部门
import SelectProject from '@/components/page/form/SelectProject';//工程名称
import SelectMember from '@/components/page/form/SelectMember';//收料员
import SelectProvider from '@/components/page/form/SelectProvider';//供应商
import pagejs from '@/assets/js/page';
import ListPageDetail from '@/components/page/ListPageDetail';
import UploadBox from '@/components/upload/Index';
import StartProcess from '@/components/workflow/process/Start';
import SelectRkd from './SelectRkd';
import SelectJxzyd from './SelectJxzyd';
import SelectYsxp from './SelectYsxp';

export default {
  components: {
    Loading,
    LayoutHor,
    Editable,
    SelectRkd,
    SelectJxzyd,
    SelectYsxp,
    ListPageDetail,
    //Editable2,
    SelStorage,
    SelectProject,
    SelectMember,
    SelectProvider,
    StartProcess,
    UploadBox,
  },
  data() {
    return {
      loading: 0,
      dailyId: '',
      projectCode: '',
      projectName: '',
      pageFlag: 1,//1.新建 2.编辑 3.修订
      isEdit: 0,
      formItem: {
        dailyId: '',//日报编号
        dayWork: '',//本日进行
        nextDayPlan: '',//明日计划   
        skillWorkload: '0',//技工人数
        strongWorkload: '0',//力工人数
        remark: '',//工作内容
      },
      formRules: {
        dayWork: [
          { required: true, whitespace: true, message: '不能为空', trigger: 'blur' },
          { type: 'string', max: 200, message: '不能超过200个字', trigger: 'blur' }
        ],
        nextDayPlan: [
          { required: true, whitespace: true, message: '不能为空', trigger: 'blur' },
          { type: 'string', max: 200, message: '不能超过200个字', trigger: 'blur' }
        ],
      },
      list: [],
      rkdList: [],
      jxzydList: [],
      ysxpList: [],
      nowDate: '',
      oriItem: {},
      storage: [],
    }
  },

  mounted: function () {
    this.nowDate = dateFormat(new Date(), 'yyyy-MM-dd');
    this.dailyId = this.$route.query.id;
    this.projectCode = this.$route.query.projectCode;
    this.projectName = this.$route.query.name;
    this.formItem.projectCode = this.projectCode;
    if (this.dailyId) {
      this.pageFlag = 2;
      this.load();
    } else {
      this.pageFlag = 1;
      this.initNew();
    }
    // this.loadjxzydList();
    // this.loadysxpList();
  },
  computed: {
    pageTitle() {
      if (this.pageFlag == 1) {
        return '施工日报 ' + this.projectName + ' - 创建';
      }
      if (this.pageFlag == 2) {
        return '施工日报 ' + this.projectName + '- 编辑';
      }
      if (this.pageFlag == 3) {
        return '施工日报 ' + this.projectName + '- 修订';
      }
    }
  },
  methods: {
    load() {
      this.loading = 1;
      this.$http.post("/api/engine/project/daily/getPc", { dailyId: this.dailyId }).then((res) => {
        this.loading = 0;
        if (res.data.code == 0) {
          if (res.data.data) {
            console.log(res.data.data);
            this.oriItem = eval('(' + JSON.stringify(res.data.data) + ')');
            Object.assign(this.formItem, res.data.data);
            this.list = res.data.data.workloadList;

            this.rkdList = res.data.data.rkdList;
            this.jxzydList = res.data.data.jxzydList;
            this.ysxpList = res.data.data.ysxpList;
            // for (var i = 0; i < res.data.data.detailList.length; i++) {
            //   var item = res.data.data.detailList[i];
            //   if (item.type == 1) {
            //     this.rkdList.push({ "id": item.invoiceCode });
            //   }
            //   if (item.type == 2) {
            //     this.jxzydList.push({ "machineOrderId": item.invoiceCode });
            //   }
            //   if (item.type == 3) {
            //     this.ysxpList.push({ "transportOrderId": item.invoiceCode });
            //   }
            // }
          } else {
            this.$Message.error('订单不存在！');
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
    loadrkdList: function () {
      var param = {
        projectCode: this.formItem.projectCode,
        createTimeEnd: this.nowDate,
        createTimeStart: this.nowDate,
        type: 1,//入库单
        pageSize: 9999,
        status: 2,//通过
      };
      this.$http.post("/api/engine/storage/instock/list", param).then((res) => {
        this.loading = 0;
        if (res.data.code == 0) {
          if (res.data.data) {
            this.rkdList = res.data.data.rows;
          }
        } else {
          this.$Message.error(res.data.message);
        }
      }).catch((error) => {
        this.loading = 0;
        this.$Message.error("操作失败！")
      });
    },
    loadjxzydList: function () {
      var param = {
        projectCode: this.formItem.projectCode,
        timeStart: this.nowDate,
        timeEnd: this.nowDate,
        status: 2,//通过
        pageSize: 9999
      };
      this.$http.post("/api/engine/machine/order/list", param).then((res) => {
        this.loading = 0;
        if (res.data.code == 0) {
          if (res.data.data) {
            this.jxzydList = res.data.data.rows;
          }
        } else {
          this.$Message.error(res.data.message);
        }
      }).catch((error) => {
        this.loading = 0;
        this.$Message.error("操作失败！")
      })
    },
    loadysxpList: function () {
      var param = { projectCode: this.formItem.projectCode, createTimeStart: this.nowDate, createTimeEnd: this.nowDate, pageSize: 9999, status: 2 };
      this.$http.post("/api/engine/transport/order/list", param).then((res) => {
        this.loading = 0;
        if (res.data.code == 0) {
          if (res.data.data) {
            this.ysxpList = res.data.data.rows;
          }
        } else {
          this.$Message.error(res.data.message);
        }
      }).catch((error) => {
        this.loading = 0;
        this.$Message.error("操作失败！")
      })
    },
    initNew() {
      Object.assign(this.formItem, {
        dailyId: '',//日报编号
        dayWork: '',//本日进行
        nextDayPlan: '',//明日计划  
      });
      this.list = [];
    },
    save(proc) {
      var form = {
        detailList: [],
        workloadList: [],
      };
      Object.assign(form, this.formItem);
      var pass = true;
      this.$refs.form.validate((valid) => {
        pass = valid;
      })
      if (!pass) {
        this.$Message.error('验证未通过！');
        return;
      }
      if (this.formItem.skillWorkload == '' || this.formItem.skillWorkload == null) {
        this.$Message.error('请录入技工人数');
        return;
      }
      if (this.formItem.strongWorkload == '' || this.formItem.strongWorkload == null) {
        this.$Message.error('请录入力工人数');
        return;
      }
      form.detailList = [];
      form.workloadList = [];
      // 明细
      for (var i = 0; i < this.list.length; i++) {
        var item = this.list[i];
        var msg = '明细第 ' + (i + 1) + ' 行，';
        if (item.workloadId != '') {
          // workloadPlan: 0,//今日计划工程量
          // workload: 0,//今日完成工程量 
          // actualWorkload: 0,//累计完成工程量 
          // actualPercent: 0,//累计完成工程比 
          // startPile: '',//起始桩号 
          // leftRight: '',//左右幅
          if (item.workloadPlan == 0) {
            this.$Message.error(msg + '请录入今日计划工程量');
            return;
          }
          if (item.workload == 0) {
            this.$Message.error(msg + '请录入今日完成工程量');
            return;
          }
          if (item.actualWorkload == 0) {
            this.$Message.error(msg + '请录入累计完成工程量');
            return;
          }
          if (item.actualPercent == 0) {
            this.$Message.error(msg + '请录入累计完成工程比');
            return;
          }
          form.workloadList.push(item);
        }
      }
      if (form.workloadList.length == 0) {
        this.$Message.error('请至少填写一项分部分项工程名');
        return;
      }
      for (var i = 0; i < this.rkdList.length; i++) {
        var item = this.rkdList[i];
        var it = { "type": 1, "invoiceCode": item.id }
        form.detailList.push(it);
      }
      for (var i = 0; i < this.jxzydList.length; i++) {
        var item = this.jxzydList[i];
        var it = { "type": 2, "invoiceCode": item.machineOrderId }
        form.detailList.push(it);
      }
      for (var i = 0; i < this.ysxpList.length; i++) {
        var item = this.ysxpList[i];
        var it = { "type": 3, "invoiceCode": item.transportOrderId }
        form.detailList.push(it);
      }
      form.proc = proc.formItem;
      // 提交
      this.loading = 1;
      var uri = '/api/engine/project/daily/addPc';
      if (this.pageFlag == 2) {
        uri = '/api/engine/project/daily/updatePc';
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
    computedDetailList() {
      // for (var i = 0; i < this.list.length; i++) {
      //   this.list[i].quantity = 0;
      // }
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
.demo-tabs-style1 > .ivu-tabs-card > .ivu-tabs-content {
  height: auto;
  margin-top: -16px;
}

.demo-tabs-style1 > .ivu-tabs-card > .ivu-tabs-content > .ivu-tabs-tabpane {
  background: #fff;
  padding: 16px;
}

.demo-tabs-style1 > .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab {
  border-color: transparent;
}
</style>
