<template>
  <ListPage
    ref="page"
    title="项目文件夹"
    api="/api/engine/project/folder/root"
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
  </ListPage>
</template>
<script>
import ListPage from '@/components/page/ListPage'; 
import page from '@/assets/js/page';

export default {
  components: { 
    ListPage, 
  },
  data() {
    let that = this;
    return {
      tabName: '1',
      columns: [
         
        {
          title: '编码',
          key: 'projectCode',
          width: 120, 
        },
        {
          title: '项目名称',
          key: 'fileName', 
          align: 'left', 
          render: (h, params) => {
            var row = params.row;
            var text = row.fileName;
            text = text;
            return h('a',{
              props:{

              },
              on:{
                click:()=>{
                  this.$router.push({path:'/project/folder/browse?forward&projectCode='+row.projectCode + '&projectName='+row.fileName});
                }
              }
            },[h('Icon',{props:{type:"folder"},style:"color:#ff9900;font-size:16px;margin-right:10px;"}),text]);
          }
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
    goTab(index) {
      var pages = ['/admin', '/provider'];
      this.$router.push({ path: pages[index] });
    },
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
    rowCommand: function (name, params) {
      if (name === '编辑') {
        this.updateRole(params.row.projectCode);
        return;
      }
      if (name === '删除') {
        this.$Modal.confirm({
          title: '删除确认',
          content: '<p>删除后不能恢复，确定删除已选择的记录吗？</p>',
          onOk: () => {
            this.$http.post('/api/engine/project/delete', { 'projectCode': params.row.projectCode }).then((res) => {
              if (res.data.code === 0) {
                this.$Message.success("删除成功");
                $.extend(this.queryForm, this.queryParam);
                this.query();
              } else {
                this.$Message.error(res.data.message)
              }
            }).catch((error) => {
              this.$Message.error(error.toString())
            });
          }
        });
      }
    },
    goBack: function () {
      this.$router.go(-1);
    },
    add: function () {
      this.$refs.edit.open(0);
    },
    updateRole: function (roleId) {
      this.$refs.edit.open(roleId);
    },
    importExcel(){

    }
  }
}

</script>

<style type="text/css">
</style>
