<template>
  <Modal v-model="show" :title="title" :closable="false" class="edit-user">
    <div class="page">
      <Loading :loading="loading">
        <div class="page-form">
          <Form
            :model="formItem"
            ref="form"
            :label-width="80"
            :rules="ruleValidate"
            class="form-item"
          >
            <FormItem label="流程名称" prop="title">{{formItem.title}}</FormItem>
            <FormItem label="标题格式" prop="instTitle">{{formItem.instTitle}}</FormItem>
            <FormItem label="审批层级" prop="nodes">
              <Table border :columns="columns" :data="data6"></Table>
              <!-- {{formItem.nodes}} -->
            </FormItem>
            <FormItem>
              <div class>
                <Button icon="checkmark" type="primary" @click="save" v-if="this.isEdit!=2">保存</Button>
                <Button @click="close" style="margin-left: 8px">取消</Button>
              </div>
            </FormItem>
          </Form>
        </div>
      </Loading>
    </div>
    <div slot="footer"></div>
    <SelectDept ref="dept" @on-check="updateDept" @on-close="closeDept"></SelectDept>
  </Modal>
</template>
<script>
import SelectDept from "@/components/commons/SelectDept";
import Loading from "@/components/loading";
import dateFormat from "@/assets/js/dateFormat";
import page from "@/assets/js/page";

export default {
  components: {
    SelectDept,
    Loading,
    page
  },
  data() {
    return {
      columns: [
        {
          type: 'index',
          title: "序号",
          key: "selNum",
          width: 100,
          align: "center"
        },
        {
          title: "岗位",
          key: "jobs",
          align: "center",
          render: (h, params) => {
              return h('Select', {
                  props: {
                      value: this.data6[params.index].volumeType,
                  },
                  on: {
                      'on-change':(event) => {
                          this.data6[params.index].volumeType = event
                      }
                  }
              },
              [
                  h('Option', {
                      props: {
                          value: '1'
                      }
                  }, 'option1'),
                   h('Option', {
                      props: {
                          value: '2'
                      }
                  }, 'option2')
              ]
              )
          }
        },
        {
          title: "操作",
          key: "action",
          width: 120,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small"
                  },
                  style: {
                      color: '#20c1ee'
                  },
                  on: {
                    click: () => {
                      this.addShow(params.index);
                    }
                  }
                },
                "添加"
              ),
               h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small"
                  },
                  style: {
                      color: '#20c1ee'
                  },
                  on: {
                    click: () => {
                      this.removeP(params.index);
                    }
                  }
                },
                "删除"
              ),
            ]);
          }
        }
      ],
      data6: [
        {
        },
        {
        },
        {
        }
      ],
      installed: 1,
      loading: 0,
      show: false,
      //是否编辑 0 添加 1 编辑 2 查看
      isEdit: 0,
      //表单对象formItem
      formItem: this.initItem(),
      ruleValidate: {
        title: [
          {
            required: true,
            whitespace: true,
            message: "编码不能为空",
            trigger: "blur"
          },
          {
            type: "string",
            max: 30,
            message: "不能超过30个字",
            trigger: "blur"
          }
        ],
        nodes: [
          {
            required: true,
            whitespace: true,
            type: "string",
            message: "层级不能为空",
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {
    title() {
      if (this.isEdit === 0) {
        return "添加";
      } else {
        return "修改";
      }
    }
  },
  methods: {
    // 初始化json数据
    initItem() {
      return {
        id: '',
        nodes: "",
        nodeNames:"",
        title: "",
        instTitle: "",
        createTime: ""
      };
    },
    save() {
      if (!this.formItem.resourceType) {
        this.$Message.error("请选择资源类别");
        return;
      }
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.save();
        }
      });
    },
    save() {
      let url = "";
      let msg = "";
      if (this.isEdit == 0) {
        url = "/api/engine/material/add";
        msg = "添加成功";
      } else {
        url = "/api/engine/workflow/define/update";
        msg = "修改成功";
      }
      this.loading = 1;
      this.$http
        .post(url, this.formItem)
        .then(res => {
          // console.log(this.formItem);
          this.loading = 0;
          if (res.data.code === 0) {
            this.$Message.success(msg);
            this.close();
            this.$emit("on-save");
          } else {
            this.loading = 0;
            this.$Message.error(res.data.message);
          }
        })
        .catch(error => {
          this.loading = 0;
          this.$Message.error(error.message);
        });
    },
    //添加或编辑弹窗
    open(item) {
      this.$refs["form"].resetFields();
      // assign方法把最后一个属性赋值给前一个属性，得到的属性值赋给this.formItem;把item里面的属性值赋给this.initItem(),最后得到this.initItem()赋值给this.formItem
      this.formItem = Object.assign(this.initItem(), item);
      console.log(this.formItem)
      this.show = true;
      if (this.formItem.id > 0) {
        this.isEdit = 1;
      } else {
        this.isEdit = 0;
      }
    },
    // 审批层级添加、删除
    addShow(index) {
      var obj = {
      }
      this.data6.push(obj)
    },
    // 审批层级删除
    removeP(index) {
      this.data6.splice(index, 1);
    },
    closeDept() {
      this.show = true;
    },
    close() {
      this.show = false;
    },
    selectDept() {
      if (this.isEdit != 2) {
        this.show = false;
        this.$refs.dept.selectIds = this.formItem.deptIds;
        this.$refs.dept.open();
      }
    },
    updateDept(depts) {
      this.show = true;
      this.formItem.deptIds = [];
      this.formItem.deptNames = [];
      depts.map(item => {
        this.formItem.deptIds.push(item.deptId);
        this.formItem.deptNames.push(item.deptName);
      });

      this.formItem.deptName = this.formItem.deptNames.join(",");

      this.$refs.dept.close();
    }
  }
};
</script> 
