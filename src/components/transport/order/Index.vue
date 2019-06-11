<template>
  <ListPage
    ref="page"
    title="运输小票"
    api="/api/engine/transport/order/list"
    :model="this"
    :beforeLoad="beforeLoad"
  >
    <div class="page-tools">
      <table cellpadding="0" cellspacing="0">
        <tr>
          <td>
            <RadioGroup v-model="queryForm.status" type="button" @on-change="query">
              <Radio :label="2">通过</Radio>
              <Radio :label="1">审批中</Radio>
              <Radio :label="3">驳回</Radio>
              <Radio :label="4">作废</Radio>
            </RadioGroup>
          </td>
          <td>
            <Button @click="add" icon="plus">添加</Button>
          </td>
          <td class="page-tools" v-if="queryForm.status==0"></td>
        </tr>
      </table>
    </div>
    <div class="page-searchbox">
      <table cellpadding="0" cellspacing="0">
        <tr>
          <td>
            <SelectProject
              v-model="queryForm.projectCode"
              :model="queryForm"
              :text="queryForm.projectName"
              placeholder="工程名称"
            />
          </td>

          <td>
            <SelectProvider
              v-model="queryForm.providerCode"
              :model="queryForm"
              :text="queryForm.providerName"
              @on-select="selProvider"
              placeholder="供应商名称"
            />
          </td>
          <td>
            <Input
              v-model="queryForm.transportOrderId"
              placeholder="单据编号"
              @keyup.enter.native="query"
            ></Input>
          </td>
          <td>
            <DatePicker
              type="daterange"
              v-model="queryForm.createTime"
              split-panels
              placeholder="运输时间"
              style="width: 180px"
              :clearable="true"
              ::transfer="true"
            ></DatePicker>
          </td>
          <td>
            <Button @click="query" type="primary" icon="ios-search">查询</Button>
          </td>
          <td>
            <Button @click="reset" type="default">重置</Button>
          </td>
        </tr>
      </table>
    </div>
  </ListPage>
</template>
<script>
//import Edit from "@/components/transport/order/Edit";
import ListPage from "@/components/page/ListPage";
import DataRowOperate from "@/components/commons/DataRowOperate";
import SelectProject from "@/components/page/form/SelectProject"; // 工程
import SelectProvider from "@/components/page/form/SelectProvider"; //供应商
import page from "@/assets/js/page";
import floatObj from '@/assets/js/floatObj';

export default {
  components: {
    ListPage,
    DataRowOperate,
    SelectProject,
    SelectProvider
  },
  data() {
    let that = this;
    return {
      tabName: "1",
      columns: [
        /*
        {
          type: 'selection',
          width: 50,
          align: 'center',
          render: function (h,params) {
            if(params.row.roleId === 1){
              params.row._disabled = true
            }
          }
        },*/
        {
          title: "操作",
          width: 120,
          align: "center",
          render: (h, params) => {
            var row = params.row;
            return h(DataRowOperate, {
              props: {
                btns: [
                  {
                    key: "edit",
                    disabled: row.status !== 3
                  }
                ]
              },
              on: {
                click: key => {
                  if (key == "edit") {
                    this.rowCommand("编辑", params);
                  }
                  if (key == "delete") {
                    this.rowCommand("删除", params);
                  }
                }
              }
            });
          }
        },
        {
          title: "单据编号",
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
          width: 100,
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
          width: 60,
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
        },
        page.table.initDateColumn({
          title: "运输时间",
          key: "transportDate",
          width: 120,
          align: "left"
        }),
        {
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
        page.table.initDateColumn({
          title: "抵达时间",
          key: "arrivalTime",
          width: 120,
          align: "left"
        }),
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
        }
      ],
      list: [],
      total: 0,
      queryParam: {}, // creatTime生成的格式放入
      queryForm: {
        status: 2,
        projectCode: "", // 工程名称ID
        transportOrderId: "", // 单据编号ID
        providerCode: "", // 供应商ID
        createTime: [] // 时间格式转换成简单格式
      },
      // selection: [],
      loading: 0
    };
  },
  mounted: function () {
    this.query();
  },
  computed: {},
  methods: {
    // goTab(index) {
    //   var pages = ['/admin', '/provider'];
    //   this.$router.push({ path: pages[index] });
    // },
    query() {
      this.$refs.page.query();
    },
    beforeLoad() {
      var queryParam = this.$refs.page.queryParam;
      // 开始时间传入
      queryParam.createTimeStart = "";
      // 结束时间传入
      queryParam.createTimeEnd = "";
      // 删除复杂化的时间格式
      delete queryParam.createTime;
      if (this.queryForm.createTime.length > 0) {
        // 将复杂的时间格式转化为年月日简单格式
        queryParam.createTimeStart = page.formatDate(
          this.queryForm.createTime[0]
        );
      }
      if (this.queryForm.createTime.length > 1) {
        queryParam.createTimeEnd = page.formatDate(
          this.queryForm.createTime[1]
        );
      }
    },
    reset() {
      // 清空条件
      Object.assign(this.queryForm, {
        projectCode: "", // 工程名称ID
        projectName: "", // 工程名称name
        providerCode: "", // 供应商ID
        providerName: "", // 工程名称Name
        transportOrderId: "", // 单据编号ID
        createTime: [] // 时间
      });
      this.query();
    },
    // select: function (selection) {
    //   this.selection = selection;
    // },
    rowCommand: function (name, params) {
      if (name === "编辑") {
        this.updateRole(params.row.transportOrderId);
        return;
      }
      if (name === "删除") {
        this.$Modal.confirm({
          title: "删除确认",
          content: "<p>删除后不能恢复，确定删除已选择的记录吗？</p>",
          onOk: () => {
            this.$http
              .post("/api/engine/transport/order/delete", {
                transportOrderId: params.row.transportOrderId
              })
              .then(res => {
                if (res.data.code === 0) {
                  this.$Message.success("删除成功");
                  $.extend(this.queryForm, this.queryParam);
                  this.query();
                } else {
                  this.$Message.error(res.data.message);
                }
              })
              .catch(error => {
                this.$Message.error(error.toString());
              });
          }
        });
      }
    },
    selProvider() { },
    goBack: function () {
      this.$router.go(-1);
    },
    add: function () {
      this.$router.push({ path: '/transport/order/start?forward' })
    },
    updateRole: function (roleId) {
      this.$refs.edit.open(roleId);
    }
  }
};
</script>

<style type="text/css">
</style>
