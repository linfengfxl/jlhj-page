<template>
  <Modal
    v-model="display"
    title="选择运输小票"
    :closable="false"
    :mask-closable="false"
    width="800"
    class-name="ivu-modal-mask select_provider"
    class="selprovider"
    :transfer="transfer"
  >
    <div class="page">
      <div class="page-searchbox">
        <table cellpadding="0" cellspacing="0">
          <tr>
            <td>
              <Select v-model="queryForm.transportType" placeholder="运输类型">
                <Option
                  v-for="item in transportType"
                  :value="item.code"
                  :key="item.code"
                >{{ item.text }}</Option>
              </Select>
            </td>
            <td>
              <Input
                v-model="queryForm.machineName"
                placeholder="运输设备名称"
                @keyup.enter.native="query"
              ></Input>
            </td>
            <td>
              <Input
                v-model="queryForm.transportStart"
                placeholder="运输起点"
                @keyup.enter.native="query"
              ></Input>
            </td>
            <td>
              <Input
                v-model="queryForm.transportEnd"
                placeholder="运输终点"
                @keyup.enter.native="query"
              ></Input>
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
            ref="table"
            :row-class-name="rowClassName"
            :columns="columns"
            @on-selection-change="select"
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
import page from '@/assets/js/page';
import floatObj from '@/assets/js/floatObj';

export default {
  components: {
    Loading,
  },
  props: {
    transfer: {
      type: Boolean,
      default: true
    },
    projectCode: {//产品编号 选择框外面传入
      type: String,
      default: ''
    },
  },
  data() {
    var that = this;
    return {
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center',
          fixed: 'left',
        },
        {
          title: '单号',
          key: 'transportOrderId',
          fixed: 'center',
          width: 120,
        },
        {
          title: "运输类别",
          key: "transportType",
          width: 100,
          align: "center"
        },
        {
          title: "运输设备名称",
          key: "machineName",
          width: 100,
          align: "left"
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
      ],
      display: false,
      list: [],
      total: 0,
      queryParam: {},
      queryForm: {
        transportType: '',
        machineName: '',
        transportStart: '',
        transportEnd: '',
      },
      industry: [],
      selected: [],
      selection: [],
      loading: 0,
      options: {},
      transportType: [
        { code: '内倒', text: '内倒' },
        { code: '外弃', text: '外弃' },
        { code: '运材料', text: '运材料' },
      ],
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
      this.queryParam.projectCode = this.projectCode;
      this.$http.post("/api/engine/project/daily/selectTransportOrderList", this.queryParam).then((res) => {
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
    select: function (selection) {
      this.selection = selection;
    },
    reset: function () {
      Object.assign(this.queryForm, {
        transportType: '',
        machineName: '',
        transportStart: '',
        transportEnd: '',
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
    close() {
      this.display = false;
    },
    onOK() {
      var selectList = this.$refs.table.getSelection();
      if (selectList.length == 0) {
        this.$Message.error('请选择');
        return;
      }
      // this.display = false;
      // this.options.ok(select);
      this.display = false;
      this.options.ok(selectList);
    },
    onCancel() {
      this.display = false;
    }
  }
}

</script>

<style type="text/css">
.selprovider .page {
  padding: 0px;
}
.selprovider .page-searchbox {
  margin-top: 0px;
}
.selprovider .status-2 {
  color: #ff6600;
}
.selprovider .footer {
  text-align: right;
  padding-left: 10px;
}
.selprovider .row-checked td {
  background-color: #e8f8fd;
  /*color:#20bfee;*/
  font-weight: bold;
}
.select_provider {
  z-index: 10000;
}
</style>
