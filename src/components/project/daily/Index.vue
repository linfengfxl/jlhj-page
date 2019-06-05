<template>
  <ListPage
    ref="page"
    title="施工日报"
    api="/api/engine/project/list"
    :model="this"
    :beforeLoad="beforeLoad"
  >
    <div class="page-searchbox">
      <table cellpadding="0" cellspacing="0">
        <tr>
          <td>
            <Input v-model="queryForm.keyword" placeholder="编码、名称" @on-enter="query"/>
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
    <Edit ref="edit" @on-save="query"></Edit>
  </ListPage>
</template>
<script>    
import Edit from '@/components/project/Edit';
import ListPage from '@/components/page/ListPage';
import DataRowOperate from '@/components/commons/DataRowOperate';

export default {
  components: {
    Edit,
    ListPage,
    DataRowOperate,
  },
  data() {
    let that = this;
    return {
      tabName: '1',
      columns: [
        {
          title: '操作',
          width: 120,
          align: 'center',
          render: (h, params) => {
            var row = params.row;
            return h(DataRowOperate, {
              props: {
                btns: [{
                  key: 'edit',
                  text:'工程量填报'
                }]
              },
              on: {
                click: (key) => {
                  if (key == "edit") {
                    this.$router.push({ path: '/project/daily/edit?forward&projectCode='+row.projectCode+'&name='+row.name})
                  }
                }
              }
            });
          }
        },
        {
          title: '编码',
          key: 'projectCode',
          width: 100,
        },
        {
          title: '名称',
          key: 'name',
          width: 150,
        },
        {
          title: '委托单位',
          key: 'customerCode',
          align: 'left',
          minWidth: 150
        },
        {
          title: '联系人',
          key: 'linkMan',
          align: 'center',
          width: 130,
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
        }
      ],
      list: [],
      total: 0,
      queryParam: {},
      queryForm: {
        keyword: '',
        page: '',
        pageSize: ''
      },
      selection: [],
      loading: 0
    }
  },
  mounted: function () {
    this.query();
  },
  computed: {},
  methods: {
    beforeLoad() {

    },
    query() {
      this.$refs.page.query();
    },
    reset: function () {
      // 清空条件
      this.queryForm.keyword = '';
      this.query();
    },
    select: function (selection) {
      this.selection = selection;
    },
    goBack: function () {
      this.$router.go(-1);
    },
  }
}

</script>

<style type="text/css">
</style>
