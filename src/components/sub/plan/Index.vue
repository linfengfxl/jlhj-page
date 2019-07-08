<template>
  <ListPage
    ref="page"
    api="/api/engine/sub/plan/list"
    :model="this"
    @onCurrentRowChange="curRowChg"
    :beforeLoad="beforeLoad"
  >
    <div class="page-title" slot="page-title">
      分包需求计划
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
          <td style="width:60px;">
            工程名称
          </td>
          <td >
            <Input v-model="queryForm.projectName" placeholder="工程名称" @keyup.enter.native="query"></Input>
          </td>
          <td style="width:60px;">
            分包项目
          </td>
          <td >
            <Input v-model="queryForm.subProjectName" placeholder="分包项目" @keyup.enter.native="query"></Input>
          </td>
          <td style="width:60px;">
            分包类型
          </td>
          <td>
            <Select v-model="queryForm.subType" style="width:150px;" >
              <Option
                v-for="item in subTypes"
                :value="item.code"
                :key="item.code"
              >{{ item.text }}</Option>
            </Select>
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
      api="/api/engine/sub/plan/getDetailList?subPlanId="
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
          key: 'subPlanId',
          width: 140,
          fixed: 'left',
          render:(h,params)=>{
            var row = params.row;
            return h('a',{
              props:{

              },
              on:{
                click:()=>{
                  this.$router.push({path:'/sub/plan/view?id=' + row.subPlanId});
                }
              }
            },row.subPlanId);
          }
        },
        {
          title: '工程名称',
          key: 'projectName',
          align: 'left',
          minWidth: 200,
        },
        {
          title: '分包类型',
          key: 'subType',
          align: 'center',
          width: 100,
        },
        {
          title: '分包项目',
          key: 'subProjectName',
          align: 'center',
          minWidth: 150,
        },
        page.table.initDateColumn({
          title: '分包进场日期',
          key: 'entryDate',
          width: 100,
          align: 'center',
        }),
        page.table.initDateColumn({
          title: '分包退场日期',
          key: 'exitDate',
          width: 100,
          align: 'center',
        }),
        {
          title: '工期',
          key: 'duration',
          align: 'center',
          width: 100,
        },
        {
          title: '分包原因',
          key: 'reason',
          align: 'center',
          minWidth: 120,
        },
        {
          title: '附件',
          key: 'files',
          align: 'center',
          width: 200,
          render:(h,params)=>{
            var row = params.row;
            return h(UploadBox,{
              props:{
                value:row.files,
                readonly:true
              }
            });
          }
        },
        {
          title: '数量合计',
          key: 'planWorkload',
          align: 'left',
          width: 120,
        },
        {
          title: '金额合计',
          key: 'amount',
          align: 'left',
          width: 120,
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
      columns1: [
        {
          title: '分包工序',
          key: 'subProcess',
          align: 'left',
          width: 120,
        },
        {
          title: '工作内容',
          key: 'content',
          align: 'left',
          minWidth: 150,
        },
        page.table.initArgColumn({
          title: '计量单位',
          key: 'unit',
          align: 'center',
          group: 'unit',
          width: 100
        }),
        {
          title: '计划工作量',
          key: 'planWorkload',
          align: 'left',
          width: 120,
        },
        {
          title: '分包单价',
          key: 'subPrice',
          align: 'left',
          width: 120,
        },
        {
          title: '合价',
          key: 'amount',
          align: 'left',
          width: 120,
        },
        {
          title: '累计计划工程量',
          key: 'totalWorkload',
          align: 'left',
          width: 150,
        },
        {
          title: '备注',
          key: 'remark',
          align: 'left',
          width: 150,
        },
        
      ],
      queryForm: {
        projectName: '',
        subProjectName: '',
        subType: '',
      },
      subTypes: [
        {code:'劳务分包',text:'劳务分包'},
        {code:'专业分包',text:'专业分包'},
      ],
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
        subProjectName: '',
        subType: '',
      });
      this.query();
    },
    curRowChg(row) {
      if (row != null) {
        this.curRow = row;
        this.curRowId = row.subPlanId;
        this.$refs.detail.load(this.curRowId);
      } else {
        this.curRow = null;
        this.curRowId = null;
        this.$refs.detail.clear();
      }
    },
    add() {
      this.$router.push({ path: '/sub/plan/edit' })
    },
    edit(row) {
      if (row) {
        this.$router.push({
          path: '/sub/plan/edit?id=' + row.subPlanId
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
            this.$http.post('/api/engine/sub/plan/delete', {
              subPlanId: row.subPlanId,
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
