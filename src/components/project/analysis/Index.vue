<template>
  <ListPage
    ref="page"
    title="成本分析表"
    api="/api/engine/project/analysis/list"
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
            <Input v-model="queryForm.projectName"  placeholder="工程名称" @on-enter="query"/>
          </td> 
          <td>
            <Input
              v-model="queryForm.analysisId"
              placeholder="单据编号"
              @keyup.enter.native="query"
            ></Input>
          </td>
          <td>
            <DatePicker
              type="daterange"
              v-model="queryForm.createTime"
              split-panels
              placeholder="选择日期"
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
          <td>&nbsp;</td>
          <td><Button @click="exportDown" type="info" icon="ios-download-outline">导出</Button></td>
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
      columns: [
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
          key: "analysisId",
          width: 140,
          fixed: 'left',
          align: "center",
          render: (h, params) => {
            var row = params.row;
            var text = row.analysisId;
            text = text;
            return h(
              "a",
              {
                props: {},
                on: {
                  click: () => {
                    this.$router.push({
                      path: "/project/analysis/view?forward&inst=" + row.instId
                    });
                  }
                }
              },
              text
            );
          }
        },
        {
          title: "工程名称",
          key: "projectName",
          minWidth: 200,
          align: "left"
        },
        page.table.initDateColumn({
          title: "日期",
          width: 120,
          key: "analysisDate",
          align: "left"
        }),
        {
          title: "成本分析表名称",
          key: "analysisName",
          width: 160,
          align: "left"
        },
        {
          title: "金额",
          key: "totalAmount",
          width: 100,
          align: "center"
        },
        {
          title: "费用",
          key: "fee",
          width: 100,
          align: "center"
        },
        {
          title: "工程造价合计",
          key: "totalProjectAmount",
          width: 100,
          align: "center"
        },
        {
          title: "成本合价合计",
          key: "totalCostAmount",
          width: 100,
          align: "center"
        },
        {
          title: "材料成本合计",
          key: "totalMaterialAmount",
          width: 100,
          align: "center"
        },
        {
          title: "人工成本合计",
          key: "totalLaborAmount",
          width: 100,
          align: "center"
        },{
          title: "机械成本合计",
          key: "totalMachineAmount",
          width: 100,
          align: "center"
        },
        {
          title: "材料成本占比",
          key: "materialPercent",
          width: 100,
          align: "center"
        },
        {
          title: "人工成本占比",
          key: "laborPercent",
          width: 100,
          align: "center"
        },
        {
          title: "机械成本占比",
          key: "machinePercent",
          width: 100,
          align: "center"
        },
        {
          title: "计算",
          key: "calcPeople",
          width: 80,
          align: "center"
        },
        {
          title: "复核",
          key: "reviewPeople",
          width: 80,
          align: "center"
        },
        {
          title: "审核",
          key: "auditPeople",
          width: 80,
          align: "center"
        },
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
        },
      ],
      list: [],
      total: 0,
      queryParam: {}, // creatTime生成的格式放入
      queryForm: {
        status: 2,
        projectName: "", // 工程名称
        analysisId: "", // 单据编号ID
        createTime: [] // 时间格式转换成简单格式
      },
      loading: 0
    };
  },
  mounted: function () {
    this.query();
  },
  computed: {},
  methods: {
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
    exportDown(){
      this.$refs.page.exportDown();
    },
    reset() {
      // 清空条件
      Object.assign(this.queryForm, {
        status: this.queryForm.status,
        projectName: "", // 工程名称
        analysisId: "", // 单据编号ID
        createTime: [] // 时间格式转换成简单格式
      });
      this.query();
    },
    rowCommand: function (name, params) {
      if (name === "编辑") {
        if (params.row) {
          this.$router.push({
            path: "/project/analysis/start?forward&id=" + params.row.analysisId
          });
        }
      }
      if (name === "删除") {
        this.$Modal.confirm({
          title: "删除确认",
          content: "<p>删除后不能恢复，确定删除已选择的记录吗？</p>",
          onOk: () => {
            this.$http
              .post("/api/engine/project/analysis/delete", {
                analysisId: params.row.analysisId
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
    goBack: function () {
      this.$router.go(-1);
    },
    add: function () {
      this.$router.push({
        path: "/project/analysis/start?forward"
      });
    }
  }
};
</script>

<style type="text/css">
</style>
