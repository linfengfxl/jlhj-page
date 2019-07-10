<template>
  <ListPage
    ref="page"
    api="/api/engine/material/inventory/list"
    :model="this"
    @onCurrentRowChange="curRowChg"
    :beforeLoad="beforeLoad"
  >
    <div class="page-title" slot="page-title">期初库存</div>
    <div class="page-searchbox">
      <table cellpadding="0" cellspacing="0">
        <tr>
          <td class="page-tools">
            <Button @click="add" v-power icon="plus">添加</Button>&nbsp;
          </td>
          <td class="page-tools" v-if="queryForm.status==0"></td>
        </tr>
      </table>
    </div>
    <div class="page-searchbox">
      <table cellpadding="0" cellspacing="0">
        <tr>
          <td>
            <Input v-model="queryForm.deptName" placeholder="仓库名称" @keyup.enter.native="query"></Input>
          </td>
          <!-- <td>
            <DatePicker
              type="daterange"
              v-model="queryForm.createTime"
              split-panels
              placeholder="日期"
              style="width: 180px"
              :clearable="true"
              ::transfer="true"
            ></DatePicker>
          </td>-->
          <td>
            <Button @click="query" type="primary" icon="ios-search">查询</Button>
          </td>
          <td>
            <Button @click="reset">重置</Button>
          </td>
        </tr>
      </table>
    </div>
    <ListPageDetail
      ref="detail"
      slot="page-datatable-detail"
      api="/api/engine/material/inventory/getInventoryCodeByList"
      :columns="columns1"
    ></ListPageDetail>
  </ListPage>
</template>
<script>
import ListPage from '@/components/page/ListPage';
import ListPageDetail from '@/components/page/ListPageDetail';
import DataRowOperate from '@/components/commons/DataRowOperate';

import page from '@/assets/js/page';

export default {
  components: {
    ListPage,
    ListPageDetail,
    DataRowOperate,
  },
  data() {
    let that = this;
    return {
      curRow: null,
      columns: [
        {
          title: '操作',
          width: 120,
          align: 'center',
          fixed: 'left',
          render: (h, params) => {
            var row = params.row;
            return h(DataRowOperate, {
              props: {
                btns: [{
                  key: 'edit',
                },
                {
                  key: 'delete',
                }]
              },
              on: {
                click: (key) => {
                  if (key == "edit") {
                    this.edit(row);
                  }
                  if (key == "delete") {
                    this.del(row);
                  }
                }
              }
            });
          }
        }, {
          title: '单号',
          key: 'inventoryCode',
          align: 'center',
          width: 200,
        },
        {
          title: '年度',
          key: 'year',
          align: 'left',
          width: 150,
        }, {
          title: '仓库',
          key: 'deptName',
          align: 'left',
          width: 220,
        }, {
          title: '工程名称',
          key: 'projectName',
          align: 'left',
        }
      ],
      columns1: [
        {
          title: '物料代码',
          key: 'materCode',
          align: 'left',
          width: 120,
        },
        {
          title: '物料名称',
          key: 'materName',
          align: 'left',
          width: 120,
        },
        {
          title: '规格型号',
          key: 'spec',
          align: 'left',
          width: 120,
        },
        page.table.initArgColumn({
          title: '单位',
          key: 'unit',
          align: 'center',
          group: 'unit',
          width: 100
        }),
        {
          title: '数量',
          key: 'quantity',
          align: 'left',
          width: 120,
        }, {
          title: ' ',
        },
      ],
      queryForm: {
        deptName: '',
        createTime: null,
      },
      loading: 0
    }
  },
  mounted: function () {
    this.reset();
  },
  methods: {
    query() {
      this.$refs.page.query();
    },
    beforeLoad() {
      var queryParam = this.$refs.page.queryParam;
      queryParam.createTimeStart = '';
      queryParam.createTimeEnd = '';
      delete queryParam.createTime;
      if (this.queryForm.createTime.length > 0) {
        queryParam.createTimeStart = page.formatDate(this.queryForm.createTime[0]);
      }
      if (this.queryForm.createTime.length > 1) {
        queryParam.createTimeEnd = page.formatDate(this.queryForm.createTime[1]);
      }
    },
    reset() {
      Object.assign(this.queryForm, {
        deptName: '',
        createTime: []//[page.formatDate(new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 60)), page.formatDate(new Date())]
      });
      this.query();
    },
    curRowChg(row) {
      if (row != null) {
        this.curRow = row;
        this.curRowId = "?inventoryCode=" + row.inventoryCode;
        this.$refs.detail.load(this.curRowId);
      } else {
        this.curRow = null;
        this.curRowId = null;
        this.$refs.detail.clear();
      }
    },
    del: function (row) {
        this.$Modal.confirm({
          title: "删除确认",
          content: "<p>删除后不能恢复，确定删除已选择的记录吗？</p>",
          onOk: () => {
            this.$http
              .post("/api/engine/material/inventory/delete", {
                inventoryCode: row.inventoryCode
              })
              .then(res => {
                if (res.data.code === 0) {
                  this.$Message.success("删除成功");
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
    },
    add() {
      this.$router.push({ path: '/storage/inventory/edit' })
    },
    edit(row) {
      if (row) {
        this.$router.push({ path: '/storage/inventory/edit?forward&inventoryCode=' + row.inventoryCode })
      }
    },
    goPage(page) {
      this.$router.push({ path: page });
    }
  }
}

</script>

<style type="text/css">
</style>
