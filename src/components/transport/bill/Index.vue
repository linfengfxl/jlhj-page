<template>
  <ListPage
    ref="page"
    title="运输结算单"
    api="/api/engine/transport/bill/list"
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
            <!--<SelectProvider
              v-model="queryForm.providerCode"
              :model="queryForm"
              :text="queryForm.providerName"
              @on-select="selProvider"
              placeholder="供应商名称"
            />-->
            <Input v-model="queryForm.providerName" placeholder="供应商名称"></Input>
          </td>
          <td>
            <Input
              v-model="queryForm.transportBillId"
              placeholder="单据编号"
              @keyup.enter.native="query"
            ></Input>
          </td>
          <td>
            <DatePicker
              type="daterange"
              v-model="queryForm.createTime"
              split-panels
              placeholder="创建日期"
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
import ListPage from "@/components/page/ListPage";
import DataRowOperate from "@/components/commons/DataRowOperate";
import SelectProject from "@/components/page/form/SelectProject"; // 工程
import SelectProvider from "@/components/page/form/SelectProvider"; //供应商
import page from "@/assets/js/page";

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
          width: 90,
          fixed: 'left',
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
          key: "transportBillId",
          width: 140,
          fixed: 'left',
          align: "center",
          render: (h, params) => {
            var row = params.row;
            var text = row.transportBillId;
            text = text;
            return h(
              "a",
              {
                props: {},
                on: {
                  click: () => {
                    this.$router.push({
                      path: "/transport/bill/view?forward&inst=" + row.instId
                    });
                  }
                }
              },
              text
            );
          }
        },
        {
          title: "部门",
          key: "deptName",
          width: 120,
          align: "center"
        },
        {
          title: "工程名称",
          key: "projectName",
          width: 120,
          align: "left"
        },
        page.table.initDateColumn({
          title: "结算日期",
          width: 120,
          key: "billDate",
          align: "left"
        }),
        {
          title: "供应商",
          key: "providerName",
          width: 160,
          align: "left"
        },
        {
          title: "供应商联系人",
          key: "linkMan",
          width: 100,
          align: "center"
        },
        {
          title: "纳税人类型",
          key: "taxpayerType",
          width: 100,
          align: "center"
        },
        {
          title: "税率",
          key: "taxRate",
          width: 80,
          align: "center"
        },
        {
          title: "发票类型",
          key: "invoiceType",
          width: 100,
          align: "center"
        },
        page.table.initDateColumn({
          title: "结算开始日期",
          key: "startDate",
          width: 120,
          align: "left"
        }),
        page.table.initDateColumn({
          title: "结算结束日期",
          key: "endDate",
          width: 120,
          align: "center"
        }),
        {
          title: "金额合计",
          key: "amount",
          width: 80,
          align: "center"
        },
        {
          title: "税额合计",
          key: "tax",
          width: 80,
          align: "center"
        },
        {
          title: "扣款合计",
          key: "deductAmount",
          width: 80,
          align: "center"
        },
        {
          title: "价税合计",
          key: "totalPriceTax",
          width: 80,
          align: "center"
        }
      ],
      list: [],
      total: 0,
      queryParam: {}, // creatTime生成的格式放入
      queryForm: {
        status: 2,
        projectCode: "", // 工程名称ID
        transportBillId: "", // 单据编号ID
        providerCode: "", // 供应商ID
        providerName:'',
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
        status: this.queryForm.status,
        projectCode: "", // 工程名称ID
        projectName: "", // 工程名称name
        providerCode: "", // 供应商ID
        providerName: "", // 名称Name
        transportBillId: "", // 单据编号ID
        createTime: [] // 时间
      });
      this.query();
    },
    // select: function (selection) {
    //   this.selection = selection;
    // },
    rowCommand: function (name, params) {
      if (name === "编辑") {
        if (params.row) {
          this.$router.push({
            path: "/transport/bill/start?forward&id=" + params.row.transportBillId
          });
        }
      }
      if (name === "删除") {
        this.$Modal.confirm({
          title: "删除确认",
          content: "<p>删除后不能恢复，确定删除已选择的记录吗？</p>",
          onOk: () => {
            this.$http
              .post("/api/engine/transport/bill/delete", {
                transportBillId: params.row.transportBillId
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
      this.$router.push({
        path: "/transport/bill/start?forward"
      });
    }
  }
};
</script>

<style type="text/css">
</style>
