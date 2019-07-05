<template>
  <ListPage
    ref="page"
    api="/api/engine/sub/accept/list"
    :model="this"
    @onCurrentRowChange="curRowChg"
    :beforeLoad="beforeLoad"
  >
    <div class="page-title" slot="page-title">
      分包完工验收单
    </div>
    <div class="page-searchbox">
      <table cellpadding="0" cellspacing="0">
        <tr>
          <td class="page-tools">
            <Button @click="add" v-power icon="plus">添加</Button>&nbsp;
          </td>
        </tr>
      </table>
    </div>
    <div class="page-searchbox">
      <table cellpadding="0" cellspacing="0">
        <tr>
          <td>
            工程名称
          </td>
          <td >
            <Input v-model="queryForm.projectName" placeholder="工程名称" @keyup.enter.native="query"></Input>
          </td>
          <td>
            供应商名称
          </td>
          <td >
            <Input v-model="queryForm.providerName" placeholder="供应商名称" @keyup.enter.native="query"></Input>
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
  </ListPage>
</template>
<script>
import ListPage from '@/components/page/ListPage';
import ListPageDetail from '@/components/page/ListPageDetail';
import DataRowOperate from '@/components/commons/DataRowOperate';
import UploadBox from '@/components/upload/Index';

import page from '@/assets/js/page';
import floatObj from '@/assets/js/floatObj';

export default {
  components: {
    ListPage,
    ListPageDetail,
    DataRowOperate,
    UploadBox
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
                  //power: 'ckgl.rk.edit',
                  //disabled: row.status != 0
                }, {
                  key: 'delete',
                  //power: 'ckgl.rk.edit',
                  //disabled: row.status != 0
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
        {
          title: '单据编号',
          key: 'subAccepCode',
          width: 140,
          fixed: 'left',
          render:(h,params)=>{
            var row = params.row;
            return h('a',{
              props:{

              },
              on:{
                click:()=>{
                  this.$router.push({path:'/sub/accept/view?id=' + row.subAccepCode});
                }
              }
            },row.subAccepCode);
          }
        },
        {
          title: '工程名称',
          key: 'projectName',
          align: 'left',
          minWidth: 150,
        },
        {
          title: '验收时间',
          key: 'acceptDate',
          align: 'center',
          width: 150,
        },
        {
          title: '供应商名称',
          key: 'providerName',
          align: 'center',
          minWidth: 150,
        },
        {
          title: '竣工组织部门',
          key: 'deptName',
          align: 'center',
          width: 100,
        },
        page.table.initDateColumn({
          title: '开工日期',
          key: 'startDate',
          width: 100,
          align: 'center',
        }),
        page.table.initDateColumn({
          title: '竣工日期',
          key: 'endDate',
          width: 100,
          align: 'center',
        }),
        {
          title: '要求整改时间',
          key: 'rectificationDate',
          align: 'center',
          width: 150,
        },
        {
          title: '参加验收人员',
          key: 'acceptPerson',
          align: 'center',
          minWidth: 120,
        },
        {
          title: '验收内容',
          key: 'acceptContent',
          align: 'left',
          minWidth: 150,
        },
        {
          title: '验收问题',
          key: 'acceptProblem',
          align: 'left',
          minWidth: 120,
        },
        {
          title: '备注',
          key: 'remark',
          align: 'left',
          minWidth: 120,
        },
        {
          title: '创建人',
          key: 'creatorName',
          align: 'center',
          width: 100,
        },
        page.table.initDateColumn({
          title: '创建日期',
          key: 'createTime',
          align: 'center',
          width: 100,
        }),
      ],
      queryForm: {
        projectName: '',
        providerName: '',
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
    },
    reset() {
      Object.assign(this.queryForm, {
        projectName: '',
        providerName: '',
      });
      this.query();
    },
    curRowChg(row) {
      if (row != null) {
        this.curRow = row;
        this.curRowId = row.subAccepCode;
      } else {
        this.curRow = null;
        this.curRowId = null;
      }
    },
    add() {
      this.$router.push({ path: '/sub/accept/edit' })
    },
    edit(row) {
      if (row) {
        this.$router.push({
          path: '/sub/accept/edit?id=' + row.subAccepCode
        })
      }
    },
    del(row) {
      this.$Modal.confirm({
        title: '删除确认',
        content: '<p>删除后不能恢复，确定删除已选择的记录吗？</p>',
        onOk: () => {
          if (row) {
            this.loading = 1;
            this.$http.post('/api/engine/sub/accept/delete', {
              subAccepCode: row.subAccepCode,
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
