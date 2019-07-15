<template>
  <ViewProcess
    ref="ViewProcess"
    :instId="instId"
    :title="title"
    :loading="loading"
    :max="1"
    @on-load="instLoaded"
    @on-submit="save"
  >
    <div class="baseinfo">
      <div class="page-tools"></div>
      <Form ref="form" class="page-form" :model="formItem" :label-width="120">
        <table cellspacing="0" cellpadding="0">
          <colgroup>
            <col width="50%" />
            <col width="50%" />
          </colgroup>
          <tr>
            <td>
              <FormItem label="本日进行" prop>{{formItem.dayWork}}</FormItem>
            </td>
            <td>
              <FormItem label="明日计划" prop>{{formItem.nextDayPlan}}</FormItem>
            </td>
          </tr>
          <!-- <tr>
              <td colspan="2">
                <FormItem label="班前教育" prop></FormItem>
              </td>
          </tr>-->
        </table>
      </Form>
    </div>
    <div>
      <div class="subheader">完成工作项</div>
      <Editable ref="editable" :list="list" :editable="false" :projectCode="projectCode"></Editable>

      <div
        class="demo-tabs-style1"
        style="background: #e3e8ee;padding:2px;width:100%; margin-top:30px;"
      >
        <Tabs type="card">
          <TabPane label="机械作业单" name="name1">
            <div class="page-datatable">
              <SelectJxzyd
                ref="selectJxzyd"
                :list="jxzydList"
                :editable="false"
                :projectCode="projectCode"
              ></SelectJxzyd>
            </div>
          </TabPane>
          <TabPane label="劳务用工" name="name2">
            <div class="editable-table-container editable">
              <table cellspacing="0" cellpadding="0">
                <thead>
                  <th>技工人数</th>
                  <th>力工人数</th>
                  <th>工作内容</th>
                </thead>
                <tbody>
                  <tr>
                    <td>{{formItem.skillWorkload}}</td>
                    <td>{{formItem.strongWorkload}}</td>
                    <td>{{formItem.remark}}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </TabPane>
          <TabPane label="运输小票" name="name3">
            <div class="page-datatable">
              <SelectYsxp
                ref="selectYsxp"
                :list="ysxpList"
                :editable="false"
                :projectCode="projectCode"
              ></SelectYsxp>
            </div>
          </TabPane>
          <TabPane label="入库单" name="name4">
            <div class="page-datatable">
              <SelectRkd
                ref="selectRkd"
                :list="rkdList"
                :editable="false"
                :projectCode="projectCode"
              ></SelectRkd>
            </div>
          </TabPane>
        </Tabs>
      </div>
    </div>
  </ViewProcess>
</template>
<script>
import Loading from '@/components/loading';
import LayoutHor from '@/components/layout/LayoutHor';
import Editable from './DetailEditable';
import page from '@/assets/js/page';
import floatObj from '@/assets/js/floatObj';
import SelStorage from '@/components/storage/input/SelStorage';//仓库部门
import SelectProject from '@/components/page/form/SelectProject';//工程名称
import SelectMember from '@/components/page/form/SelectMember';//收料员
import SelectProvider from '@/components/page/form/SelectProvider';//供应商
import pagejs from '@/assets/js/page';
import SelectRkd from './SelectRkd';
import SelectJxzyd from './SelectJxzyd';
import SelectYsxp from './SelectYsxp';

import ViewProcess from '@/components/workflow/process/View';
export default {
  components: {
    Loading,
    LayoutHor,
    Editable,
    SelStorage,
    SelectProject,
    SelectMember,
    SelectProvider,
    ViewProcess,
    SelectRkd,
    SelectJxzyd,
    SelectYsxp
  },
  data() {
    return {
      loading: 0,
      instId: 0,
      dailyId: '',
      projectCode: '',
      projectName: '',
      pageFlag: 1,//1.新建 2.编辑 3.修订
      title: '',
      isEdit: 0,
      formItem: {
        dailyId: '',//日报编号
        dayWork: '',//本日进行
        nextDayPlan: '',//明日计划   
      },
      list: [],
      list2: [],
      oriItem: {},
      storage: [],


      nowDate: '',

      lwygList: [],
      rkdList: [],
      jxzydList: [],
      ysxpList: [],
    }
  },
  mounted: function () {
    this.instId = this.$route.query.inst;
  },
  computed: {
    pageTitle() {
      return '施工日报 - 明細';
    }
  },
  methods: {
    instLoaded(proc) {
      this.dailyId = proc.instance.businessKey;
      this.title = "施工日报_" + this.dailyId;
      this.load();
    },
    load() {
      var that = this;
      this.loading = 1;
      this.$http.post("/api/engine/project/daily/getPc", { dailyId: this.dailyId }).then((res) => {
        this.loading = 0;
        if (res.data.code == 0) {
          if (res.data.data) {
            console.log(res.data.data);
            this.oriItem = eval('(' + JSON.stringify(res.data.data) + ')');
            Object.assign(that.formItem, res.data.data);
            this.list = res.data.data.workloadList;
            this.rkdList = res.data.data.rkdList;
            this.jxzydList = res.data.data.jxzydList;
            this.ysxpList = res.data.data.ysxpList;
            this.nowDate = that.formItem.dailyDate;
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
        detailList: []
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

      form.detailList = [];
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
          form.detailList.push(item);
        }
      }
      if (form.detailList.length == 0) {
        this.$Message.error('请至少填写一项分部分项工程名');
        return;
      }

      form.proc = proc.formItem;
      // 提交
      this.loading = 1;
      var uri = '/api/engine/project/daily/submit';

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
