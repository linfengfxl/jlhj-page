<template>
  <Modal
    v-model="display"
    title="选择用户"
    :closable="false"
    :mask-closable="false"
    width="800"
    class="selmember"
    :transfer="transfer"
  >
    <div class="page">
      <div class="page-searchbox">
        <table cellpadding="0" cellspacing="0">
          <tr>
            <td>
              <Input v-model="queryForm.keyword" placeholder="姓名/手机号" @keyup.enter.native="query"></Input>
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
      <Loading :loading="loading">
        <div class="page-datatable">
          <i-table
            :row-class-name="rowClassName"
            :columns="columns"
            @on-row-click="innerCheckRow(arguments[1])"
            :data="list"
          ></i-table>

          <div style="height:10px;"></div>

          <Page
            ref="pagebar"
            :total="total"
            size="small"
            :page-size-opts="[10,20,30,50,100]"
            @on-page-size-change="pageSizeChange"
            @on-change="pageChange"
            show-sizer
            placement="top"
            :transfer="false"
            show-total
            show-elevator
          ></Page>
        </div>
      </Loading>
    </div>
    <div slot="footer" class="footer">
      <Button @click="onOK" type="primary" icon="checkmark">确 定</Button>
      <Button @click="onCancel" type="default">取 消</Button>
    </div>
  </Modal>
</template>
<script>
import Loading from '@/components/loading';
export default {
  components: {
    Loading,
  },
  props: {
    transfer: {
      type: Boolean,
      default: true
    }
  },
  data() {
    var that = this;
    return {
      columns: [
        {
          title: '选择',
          key: '_checked',
          width: 60,
          render: function (h, params) {
            var row = params.row;
            var index = params.index;
            var props = {
              value: row._checked,
            };
            if (row.status == "2") {
              props.disabled = true;
            }
            return h('Checkbox', {
              props: props,
              on: {
                'on-change': () => {
                  that.innerCheckRow(index);
                }
              }
            });
          }
        },
        {
          title: '用户名',
          key: 'loginName',
          align: 'center',
          width: 120
        },
        {
          title: '姓名',
          key: 'trueName',
          align: 'center',
          width: 120
        },
        {
          title: '岗位',
          key: 'roleName',
          align: 'left',
          minWidth: 100
        },
        {
          title: '部门',
          key: 'deptName',
          align: 'left',
          minWidth: 100
        },
        {
          title: '手机号',
          key: 'mobile',
          align: 'center',
          width: 120
        },
        {
          title: '邮箱',
          key: 'email',
          align: 'center',
          width: 120
        },
        {
          title: '状态',
          key: 'status',
          align: 'center',
          width: 60,
          render: (h, params) => {
            var status = params.row.status;
            var setButton = "正常";
            if (status == 2) {
              setButton = "禁用";
            }
            return h('span', { class: 'status-' + status }, setButton);
          }
        }
      ],
      display: false,
      list: [],
      total: 0,
      queryParam: {},
      queryForm: {
        keyword: '',
        industry: '',
        status: 1
      },
      industry: [],
      selected: [],
      loading: 0,
      options: {
        ok: (data) => { },
        cancel: () => { }
      }
    }
  },
  mounted: function () {
    this.query()
  },
  computed: {},
  methods: {
    load() {
      var pagebar = this.$refs.pagebar;
      this.loading = 1;
      this.queryParam.page = pagebar.currentPage;
      this.queryParam.pageSize = pagebar.currentPageSize;
      this.$http.post("/api/engine/user/list", this.queryParam).then((res) => {
        this.loading = 0;
        if (res.data.code === 0) {
          this.loading = 0;
          var list = res.data.data.rows;
          list.map((item) => { item._checked = false; });
          this.list = list;
          this.total = res.data.data.total;
          this.selection = [];
          // 同步条件信息到表单
          Object.assign(this.queryForm, this.queryParam);
        } else {
          this.loading = 0;
          this.list = null;
          this.total = 0;
          this.$Message.error(res.data.message);
        }
      }).catch((error) => {
        this.loading = 0;
        this.$Message.error("请求失败，请重新发送")
      });
    },
    query: function () {
      Object.assign(this.queryParam, this.queryForm)
      this.load();
    },
    pageChange: function (page) {
      this.load();
    },
    pageSizeChange: function (pageSize) {
      var pagebar = this.$refs.pagebar;
      if (pagebar.currentPage == 1) {
        this.load();
      }
    },
    innerCheckRow(index) {
      for (var i = 0; i < this.list.length; i++) {
        var item = this.list[i];
        item._checked = index == i && item.status != 2;
      }
    },
    reset: function () {
      Object.assign(this.queryForm, {
        keyword: '',
        industry: '',
      });

      var pagebar = this.$refs.pagebar;
      pagebar.current = 1;
      pagebar.currentPage = 1;
      pagebar.currentPageSize = 10;

      this.query();
    },
    rowClassName(row, index) {
      return row._checked ? 'row-checked' : '';
    },
    // 对外方法
    show(options) {
      Object.assign(this.options, {
        ok: (data) => { },
        cancel: () => { }
      }, options);
      this.display = true;
      this.reset();
    },
    // 需要遗弃，请调用 show
    open() {
      this.display = true;
    },
    close() {
      this.display = false;
    },
    onOK() {
      var select = null;
      this.list.map((item) => {
        if (item._checked) {
          select = item;
        }
      });
      if (select == null) {
        this.$Message.error('请选择客户');
        return;
      }
      this.display = false;
      this.options.ok(select);

      // 以下代码需要遗弃
      this.selected = [];
      this.list.map((item) => {
        if (item._checked) {
          this.selected.push(item);
        }
      });
      this.display = false;

      this.$emit('on-ok', this.selected);
    },
    onCancel() {
      this.display = false;
    }
  }
}

</script>

<style type="text/css">
.selmember .page {
  padding: 0px;
}
.selmember .page-searchbox {
  margin-top: 0px;
}
.selmember .status-2 {
  color: #ff6600;
}
.selmember .footer {
  text-align: center;
  padding-left: 10px;
}
.selmember .row-checked td {
  background-color: #e8f8fd;
  /*color:#20bfee;*/
  font-weight: bold;
}
</style>
