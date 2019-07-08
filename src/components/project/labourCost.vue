<template>
  <ListPage
    ref="page"
    api="/api/engine/project/labourCost/list"
    :model="this"
    :beforeLoad="beforeLoad"
    @on-load="onLoadData"
  >
    <div class="page-title" slot="page-title">工程人工成本统计</div>

    <div class="page-searchbox">
      <table cellpadding="0" cellspacing="0">
        <tr>
          <td>
            <SelectProject
              v-model="queryForm.projectCode"
              :model="queryForm"
              :text="queryForm.projectName"
              @on-select="selProject"
              placeholder="工程名称"
            />
          </td>
          <td style="width:60px"></td>
          <td style="font-weight: bold;color:#999;">
            人数合计：
            <span style="color:green">{{sumInfo.totalWorkload}}</span>
          </td>
          <td style="font-weight: bold;color:#999;padding-left:20px;">
            金额合计：
            <span style="color:red">{{sumInfo.totalAmount}}</span>
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
import SelectProject from "@/components/page/form/SelectProject"; // 工程

import page from '@/assets/js/page';

export default {
  components: {
    ListPage,
    ListPageDetail,
    DataRowOperate,
    UploadBox,
    SelectProject
  },
  data() {
    let that = this;
    return {
      curRow: null,
      columns: [
        {
          title: '月份',
          key: 'ym',
          align: 'center',
          width: 120,
        },
        {
          title: '领工',
          key: 'leader',
          align: 'left',
          width: 550,
        }, {
          title: '人数',
          key: 'totalWorkload',
          align: 'center',
          width: 120,
        }, {
          title: '金额',
          key: 'totalAmount',
          align: 'right',
          width: 120,
        }, {
          title: ' ',
        }
      ],
      queryForm: {
        projectCode: '',
      },
      sumInfo: {
        totalWorkload: '0',
        totalAmount: '0',
      },
      loading: 0
    }
  },
  mounted: function () {

  },
  methods: {
    selProject(data) {
      if (data) {
        this.query();
      }
    },
    query() {
      if (this.queryForm.projectCode == '') {
        this.$Message.error("请选择产品");
        return;
      }
      this.$refs.page.query();
    },
    beforeLoad() {
      var queryParam = this.$refs.page.queryParam;
    },
    goPage(page) {
      this.$router.push({ path: page });
    },
    onLoadData(comp) {
      if (comp.apiRult && comp.apiRult.data.sum) {
        this.sumInfo = comp.apiRult.data.sum;
      }
    }
  }
}

</script>

<style type="text/css">
</style>
