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
            <col width="50%">
            <col width="50%">
          </colgroup>
          <tr>
            <td>
              <FormItem label="本日进行" prop="dayWork">
                <Input type="textarea" :rows="2" v-model="formItem.dayWork"/>
              </FormItem>
            </td>
            <td>
              <FormItem label="明日计划" prop="nextDayPlan">
                <Input type="textarea" :rows="2" v-model="formItem.nextDayPlan"/>
              </FormItem>
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
      <Editable ref="editable" :list="list" :editable="true" :projectCode="projectCode"></Editable>
      <div
        class="demo-tabs-style1"
        style="background: #e3e8ee;padding:2px;width:100%; margin-top:30px;"
      >
        <Tabs type="card">
          <TabPane label="劳务用工" name="name1">
            <div class="page-datatable">
              <i-table :columns="columns1" :data="lwygList"></i-table>
            </div>
          </TabPane>
          <TabPane label="入库单" name="name2">
            <div class="page-datatable">
              <i-table :columns="columns2" :data="rkdList"></i-table>
            </div>
          </TabPane>
          <TabPane label="机械作业单" name="name3">
            <div class="page-datatable">
              <i-table :columns="columns3" :data="jxzydList"></i-table>
            </div>
          </TabPane>
          <TabPane label="运输小票" name="name4">
            <div class="page-datatable">
              <i-table :columns="columns4" :data="ysxpList"></i-table>
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

export default {
  components: {
    Loading,
    LayoutHor,
    Editable,
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
      lwygList: [],
      rkdList: [],
      jxzydList: [],
      ysxpList: [],
      nowDate: '',
      oriItem: {},
      storage: [],
      columns1: [
        {
          title: '领工',
          key: 'leader',
          align: 'left',
          width: 120,
        },
        {
          title: '技工工作量',
          key: 'skillWorkload',
          align: 'left',
          width: 120,
        },
        {
          title: '技工加班量',
          key: 'skillWorkloadOvertime',
          align: 'left',
          width: 120,
        },
        {
          title: '力工工作量',
          key: 'strongWorkload',
          align: 'left',
          width: 120,
        },
        {
          title: '力工加班量',
          key: 'strongWorkloadOvertime',
          align: 'left',
          width: 120,
        },
        {
          title: '金额',
          key: 'amount',
          align: 'left',
          width: 120,
        },
        {
          title: '备注',
          key: 'remark',
          align: 'left',
          minWidth: 80,
        },
        {
          title: '附件',
          key: 'files',
          align: 'center',
          width: 200,
          render: (h, params) => {
            var row = params.row;
            return h(UploadBox, {
              props: {
                value: row.files,
                readonly: true
              }
            });
          }
        }
      ],
      columns2: [
        {
          title: '单号',
          key: 'stockBillId',
          width: 120,
          align: 'center',
          fixed: 'left',
          render: (h, params) => {
            var row = params.row;
            var text = row.stockBillId;
            text = text;
            return h('a', {
              props: {

              },
              on: {
                click: () => {
                  this.$router.push({ path: '/storage/instock/view?forward&inst=' + row.instId });
                }
              }
            }, text);
          }
        },
        page.table.initDateColumn({
          title: '单据日期',
          key: 'operateDate',
          align: 'center',
          width: 100,
        }),
        {
          title: '仓库',
          key: 'deptName',
          align: 'left',
          width: 160,
        },
        {
          title: '工程名称',
          key: 'projectName',
          align: 'left',
          minWidth: 120,
        }, {
          title: '供应商',
          key: 'providerName',
          align: 'left',
          width: 200,
        }, {
          title: '申请人',
          key: 'creatorName',
          align: 'left',
          width: 100,
        },
        page.table.initMapColumn({
          title: '状态',
          key: 'status',
          data: {
            '0': '待提交',
            '1': '审核中',
            '2': '通过',
            '3': '驳回',
          },
          width: 80,
        }),
        {
          title: '红蓝字',
          key: 'inboundType',
          align: 'center',
          width: 100,
          render: (h, params) => {
            var row = params.row;
            if (row.inboundType == 1) {
              return h('span', {
                style: {
                  color: 'blue'
                }
              }, "蓝字");
            }
            return h('span', {
              style: {
                color: 'red'
              }
            }, "红字");
          }
        },
        page.table.initMapColumn({
          title: '来源',
          key: 'source',
          width: 80,
          data: {
            '1': 'PC端',
            '2': 'APP',
          },
        }),
        page.table.initDateColumn({
          title: '创建日期',
          key: 'createTime',
          align: 'center',
          width: 100,
        }),
      ],
      columns3: [//机械作业单
        {
          title: '单号',
          key: 'machineOrderId',
          width: 140,
          align: 'center',
          fixed: 'left',
          render: (h, params) => {
            var row = params.row;
            var text = row.machineOrderId;
            text = text;
            return h('a', {
              props: {

              },
              on: {
                click: () => {
                  this.$router.push({ path: '/machine/order/view?forward&inst=' + row.instId });
                }
              }
            }, text);
          }
        }, {
          title: '部门',
          key: 'deptName',
          width: 120,
        },
        {
          title: '工程名称',
          key: 'projectName',
          minWidth: 240,
        }, {
          title: '供应商名称',
          key: 'providerName',
          minWidth: 120,
        },
        {
          title: '机械名称',
          key: 'machineName',
          width: 120,
        },
        page.table.initDateColumn({
          title: '作业日期',
          key: 'jobDate',
        }),
        page.table.initMapColumn({
          title: '来源',
          key: 'source',
          width: 80,
          data: {
            '1': 'PC端',
            '2': 'APP',
          },
        }),
        {
          title: '创建人',
          key: 'creatorName',
          align: 'center',
          width: 100,
        },
        {
          title: '创建时间',
          key: 'createTime',
          align: 'center',
          width: 160,
        }
      ],
      columns4: [//运输小票
        {
          title: "单据编号",
          fixed: 'left',
          key: "transportOrderId",
          width: 120,
          align: "left",
          render: (h, params) => {
            var row = params.row;
            var text = row.transportOrderId;
            text = text;
            return h(
              "a",
              {
                props: {},
                on: {
                  click: () => {
                    this.$router.push({
                      path: "/transport/order/view?forward&inst=" + row.instId
                    });
                  }
                }
              },
              text
            );
          }
        },
        {
          title: "所属部门",
          key: "deptName",
          width: 100,
          align: "center"
        },
        {
          title: "工程名称",
          key: "projectName",
          width: 120,
          align: "left"
        },
        {
          title: "供应商名称",
          key: "providerName",
          width: 140,
          align: "left"
        },
        {
          title: "供应商联系人",
          key: "linkMan",
          width: 100,
          align: "center"
        },
        {
          title: "税率",
          key: "taxRate",
          width: 90,
          align: "center",
          render: (h, params) => {
            var row = params.row;
            return h('span', floatObj.multiply(row.taxRate, 100) + "%");
          }
        },
        {
          title: "运输设备名称",
          key: "machineName",
          width: 100,
          align: "left"
        }, {
          title: "运输时间",
          key: "transportDate",
          width: 140,
          align: "left"
        }, {
          title: "车牌号",
          key: "vehicleNum",
          width: 80,
          align: "left"
        },
        {
          title: "数量",
          key: "num",
          width: 60,
          align: "center"
        },
        {
          title: "单位",
          key: "unit",
          width: 60,
          align: "center"
        },
        {
          title: "里程数",
          key: "milage",
          width: 60,
          align: "center"
        },
        {
          title: "含税单价",
          key: "taxUnitPrice",
          width: 80,
          align: "center"
        },
        {
          title: "扣款金额",
          key: "deductAmount",
          width: 80,
          align: "center"
        },
        {
          title: "金额",
          key: "amount",
          width: 60,
          align: "center"
        },
        {
          title: "税额",
          key: "tax",
          width: 60,
          align: "center"
        },
        {
          title: "价税合计",
          key: "totalPriceTax",
          width: 80,
          align: "center"
        },
        {
          title: "运输起点",
          key: "transportStart",
          width: 100,
          align: "left"
        },
        {
          title: "运输终点",
          key: "transportEnd",
          width: 100,
          align: "left"
        },
        {
          title: "抵达时间",
          key: "arrivalTime",
          width: 140,
          align: "left"
        },
        {
          title: "运输类别",
          key: "transportType",
          width: 100,
          align: "center"
        },
        {
          title: "运输内容",
          key: "transportContent",
          width: 120,
          align: "left"
        },
        page.table.initMapColumn({
          title: '来源',
          key: 'source',
          width: 80,
          data: {
            '1': 'PC端',
            '2': 'APP',
          },
        }),
      ],
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
    this.loadlwygList();
    this.loadrkdList();
    this.loadjxzydList();
    this.loadysxpList();
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
      this.$http.post("/api/engine/project/daily/get", { dailyId: this.dailyId }).then((res) => {
        this.loading = 0;
        if (res.data.code == 0) {
          if (res.data.data) {
            console.log(res.data.data);
            this.oriItem = eval('(' + JSON.stringify(res.data.data) + ')');
            Object.assign(this.formItem, res.data.data);
            this.list = res.data.data.detailList;
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
    loadlwygList: function () {
      this.$http.post("/api/engine/project/labor/getByProjectList?projectCode=" + this.formItem.projectCode + "&laborDate=" + this.nowDate + " 00:00:00", {}).then((res) => {
        this.loading = 0;
        if (res.data.code == 0) {
          if (res.data.data) {
            this.lwygList = res.data.data.detailList;
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
      var uri = '/api/engine/project/daily/add';
      if (this.pageFlag == 2) {
        uri = '/api/engine/project/daily/update';
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
