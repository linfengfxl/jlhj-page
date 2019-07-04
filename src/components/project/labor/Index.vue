<template>
  <ListPage
    ref="page"
    api="/api/engine/project/labor/list"
    :model="this"
    @onCurrentRowChange="curRowChg"
    :beforeLoad="beforeLoad"
  >
    <div class="page-title" slot="page-title">劳务用工登记</div>
    <div class="page-searchbox">
      <table cellpadding="0" cellspacing="0">
        <tr>
          <td class="page-tools">
            <Button @click="add" v-power icon="plus">登记</Button>&nbsp;
          </td>
          <td class="page-tools" v-if="queryForm.status==0"></td>
        </tr>
      </table>
    </div>
    <div class="page-searchbox">
      <table cellpadding="0" cellspacing="0">
        <tr>
          <td>
            <Input v-model="queryForm.projectName" placeholder="工程名称" @keyup.enter.native="query"></Input>
          </td>
          <td>
            <DatePicker
              type="daterange"
              v-model="queryForm.createTime"
              split-panels
              placeholder="日期"
              style="width: 180px"
              :clearable="true"
              ::transfer="true"
            ></DatePicker>
          </td>
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
      api="/api/engine/project/labor/getByProjectList"
      :columns="columns1"
    ></ListPageDetail>
  </ListPage>
</template>
<script>
import ListPage from '@/components/page/ListPage';
import ListPageDetail from '@/components/page/ListPageDetail';
import DataRowOperate from '@/components/commons/DataRowOperate';
import UploadBox from '@/components/upload/Index';

import page from '@/assets/js/page';

export default {
  components: {
    ListPage,
    ListPageDetail,
    DataRowOperate,
    UploadBox,
  },
  data() {
    let that = this;
    return {
      curRow: null,
      columns: [
        {
          title: '操作',
          width: 90,
          align: 'center',
          fixed: 'left',
          render: (h, params) => {
            var row = params.row;
            return h(DataRowOperate, {
              props: {
                btns: [{
                  key: 'edit',
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
        },
        page.table.initDateColumn({
          title: '日期',
          key: 'laborDate',
          align: 'center',
          width: 120,
        }),
        {
          title: '工程名称',
          key: 'projectName',
          align: 'left',
        }, {
          title: '人员合计',
          key: 'totalWorkload',
          align: 'center',
          width: 120,
        }, {
          title: '金额合计',
          key: 'totalAmount',
          align: 'right',
          width: 120,
        }, {
          title: '附件',
          key: 'files',
          align: 'center',
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
      columns1: [
        {
          title: '领工',
          key: 'leader',
          align: 'center',
          width: 200,
        },
        {
          title: '人数',
          key: 'workload',
          align: 'center',
          width: 200,
        },
        {
          title: '金额',
          key: 'amount',
          align: 'center',
          width: 200,
        },
        {
          title: ' ',
          key: '',
        }
      ],
      queryForm: {
        projectName: '',
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
        projectName: '',
        createTime: []//[page.formatDate(new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 60)), page.formatDate(new Date())]
      });
      this.query();
    },
    curRowChg(row) {
      if (row != null) {
        this.curRow = row;
        this.curRowId = "?laborId=" + row.laborId;
        this.$refs.detail.load(this.curRowId);
      } else {
        this.curRow = null;
        this.curRowId = null;
        this.$refs.detail.clear();
      }
    },
    add() {
      this.$router.push({ path: '/project/labor/edit?forward' })
    },
    edit(row) {
      if (row) {
        this.$router.push({ path: '/project/labor/edit?forward&id=' + row.laborId })
      }
    },
    del(row) {
      this.$Modal.confirm({
        title: '删除确认',
        content: '<p>删除后不能恢复，确定删除已选择的记录吗？</p>',
        onOk: () => {
          if (row) {
            this.loading = 1;
            this.$http.post('/api/engine/storage/instock/delete', {
              stockBillId: row.stockBillId,
            }).then((res) => {
              this.loading = 0;
              if (res.data.code === 0) {
                this.$Message.success("删除成功");
                this.$refs.page.query();
              } else {
                this.$Message.error(res.data.message)
              }
            }).catch((error) => {
              this.loading = 0;
              this.$Message.error(error.toString())
            });
          }
        }
      });
    },
    goPage(page) {
      this.$router.push({ path: page });
    }
  }
}

</script>

<style type="text/css">
</style>
