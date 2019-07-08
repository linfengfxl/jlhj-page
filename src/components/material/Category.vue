<template>
  <div class="tv-div">
    <DeptTreeNode :model="root"></DeptTreeNode>
    <div v-bind:class="{'contextmenu':1,'hidden':!contextmenu.show}" :style="menustyle">
      <ul v-if="currentItem!=null && currentItem.code==''" clas="contextmenu-ul">
        <li>
          <Button type="text" @click="add" class="contextmenu-item">添加子项</Button>
        </li>
      </ul>
      <ul v-else clas="contextmenu-ul">
        <li>
          <Button type="text" @click="add" class="contextmenu-item">添加子项</Button>
        </li>
        <li>
          <Button type="text" @click="update" class="contextmenu-item">修改</Button>
        </li>
        <li>
          <Button type="text" @click="deleteD" class="contextmenu-item">删除</Button>
        </li>
      </ul>
    </div>
    <CateEdit ref="editDept" @on-save="onSave"></CateEdit>
  </div>
</template>
<script>
import DeptTreeNode from '@/components/contacts/DeptTreeNode'
import treeComponent from '@/components/tree/treeComponent.js'
import CateEdit from '@/components/material/CateEdit'

export default {
  components: {
    DeptTreeNode,
    CateEdit
  },
  props: {
    installed: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      contextmenu: {
        top: 0,
        left: 0,
        show: false
      },
      currentItem: null,
      root: {
        title: '公司',
        children: []
      },
      tree: null,
      editDept: null,
      data: []
    };
  },
  mounted() {
    var that = this;
    var tree = new treeComponent({
      idProperty: 'code',
      titleProperty: 'title',
      parentIdProperty: 'parentCode',
      root: { title: '类别', data: { title: '类别', code: '', parentCode: '', resourceType: '' }, select: true },
      onLoad: function () {
        if (!tree.options.isLoad) {
          tree.build();
          tree.openLevel(0);
        } else {
          tree.buildRestoreStatus();
        }
        tree.options.isLoad = true;
      },
      onEvent: function (e) {
        // 弹出上下文菜单
        if (e.name == 'contextmenu') {
          var offset = $(e.$e.srcElement).offset();

          var winHeight = $(window).height();

          var offsetY = offset.top + $('.contextmenu').height() - winHeight;

          if (offsetY > 0) {
            offset.top = offset.top - offsetY;
          }

          if (offset.top < 0) {
            offset.top = 0;
          }

          that.contextmenu.show = true;
          that.contextmenu.top = offset.top;
          that.contextmenu.left = offset.left;
          that.contextmenu.show = true;
          that.currentItem = e.sender.data;

          tree.setSelect([that.currentItem.code]);

          e.handled = true;
        }
      },
      onSelect: function (e) {
        that.selDept(e.sender.data);
      }
    });
    this.tree = tree;
    this.root = this.tree.options._root;

    // 鼠标离开快捷菜单消失
    var hiddenContextMenuTimer = null;
    $('.contextmenu').hover(function () {
      clearTimeout(hiddenContextMenuTimer);
    }, function () {
      hiddenContextMenuTimer = setTimeout(function () {
        that.contextmenu.show = false;
      }, 300);
    });

    this.load();
  },
  computed: {
    style() {
      if (this.model && this.model.level) {
        return 'padding-left:' + this.model.level * 14 + 'px';
      }
      return "";
    },
    menustyle() {
      return 'top:' + this.contextmenu.top + 'px;left:' + this.contextmenu.left + 'px;z-index:10;';
    }
  },
  methods: {
    load() {
      this.$http.post('/api/engine/material/category/list').then((res) => {
        if (res.data.code === 0) {
          this.tree.options.data = res.data.data;
          this.tree.load();
        } else {
          this.$Message.error(res.data.message)
        }
      }).catch((error) => {
        this.$Message.error(error.message)
      });
    },
    selDept(currentItem) {
      this.contextmenu.show = false;
      this.currentItem = currentItem;
      this.$emit("on-select", currentItem.code);
    },
    setSelect() {
      this.tree.setSelect([]);
    },
    add() {
      this.contextmenu.show = false;
      this.$refs.editDept.openAdd({ parentCode: this.currentItem.code,parentName: this.currentItem.title==null?'类别':this.currentItem.title });
    },
    update() {
      this.contextmenu.show = false;
      if(this.currentItem.parentName==null){
        this.currentItem.parentName='类别';
      }
      this.$refs.editDept.openEdit(this.currentItem);
    },
    onSave(dept) {
      this.load();
    },
    deleteD() {
      this.contextmenu.show = false;
      this.$Modal.confirm({
        title: '删除确认',
        content: '<p>删除后不能恢复，确定删除已选择的记录吗？</p>',
        onOk: () => {
          this.$http.post('/api/engine/material/category/delete', { code: this.currentItem.code }).then((res) => {
            if (res.data.code === 0) {
              this.$Message.success("删除成功");
              this.load();
              this.tree.setSelect([this.currentItem.parentCode]);
              this.$emit("on-select", this.currentItem.parentCode);
            } else {
              this.$Message.error(res.data.message)
            }
          }).catch((error) => {
            this.$Message.error(error.toString())
          });
        }
      });
    }
  }
}
</script>

<style>
.tv-div {
}
.contextmenu {
  position: fixed;
  background-color: white;
  border: 1px solid #efefef;
}
.contextmenu-item {
  width: 100%;
  text-align: left;
}
.contextmenu-item:hover {
  background-color: #eaf2ff;
}
.hidden {
  display: none;
}
</style>

