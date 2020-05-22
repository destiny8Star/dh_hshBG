<template>
  <div class="v-component-sync-tree">
    <div class="origin-tree tree-item">
      <div class="tree-header">选择可配送区域</div>
      <div class="tree-body">
        <el-tree :data="originTree" show-checkbox ref="originTree" node-key="id" :props="defaultProps" @check-change="getOriginKeys"></el-tree>
      </div>
    </div>
    <div class="tree-cut">
      <i class="ivu-icon ivu-icon-ios-arrow-right"></i>
      <el-icon class="el-icon-arrow-right"></el-icon>
    </div>
    <div class="final-tree tree-item">
      <div class="tree-header">配送区域</div>
      <div class="tree-body">
        <div class="body-main">
          <ul>
            <li v-for="(item,index) of finalTree" :key="item.id">
              <span class="item-text item-expand" @click.stop="toggleOpen(item.id)"> <el-icon class="item-icon" :class="item.open ?'el-icon-caret-bottom':'el-icon-caret-right'"></el-icon>{{ item.title }}</span>
              <!--<span class="item-edit" @click.stop="popEditModal(item.id, item.title)">
                                <el-icon class="el-icon-edit"></el-icon>
                            </span>-->
              <span class="item-del" @click.stop="popDelModal(item.id, item.pid)">
                                <el-icon class="el-icon-delete"></el-icon>
                            </span>
              <ul class="tree-child" style="margin-left:20px;" :class="{'tree-show': item.open}">
                <li v-for="child of item.children" :key="child.id">
                  <span class="item-text">{{ child.title }}</span>
                  <!--<span class="item-edit" @click.stop="popEditModal(child.id, child.title)">
                                        <el-icon class="el-icon-edit"></el-icon>
                                    </span>-->
                  <span class="item-del" @click.stop="popDelModal(child.id, child.pid)">
                        <el-icon class="el-icon-delete"></el-icon>
                    </span>

                </li>
              </ul>
            </li>
          </ul>
        </div>
        <div class="edit-mask" v-if="editShow">
          <div class="edit-wrapper">
            <el-input class="edit-input" v-model="editText"></el-input>
            <div class="edit-opra-wrapper">
              <el-button-group>
                <el-button class="edit-cancel" type="default" @click="editCancel">
                  取消
                </el-button>
                <el-button class="edit-ok" type="primary" @click="editOk">
                  确认
                </el-button>
              </el-button-group>
            </div>
          </div>
        </div>
        <div class="del-mask" v-if="delShow">
          <div class="del-wrapper">
            <div class="del-text">
              <el-icon class="el-icon-warning"></el-icon>
              是否删除
            </div>
            <div class="del-opra-wrapper">
              <el-button-group>
                <el-button class="del-cancel" @click="delCancel">
                  取消
                </el-button>
                <el-button class="del-ok" type="primary" @click="delOk">
                  确认
                </el-button>
              </el-button-group>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//   import Tool from './tool'
//   require('./vue-component-sync-tree.scss')
  export default {
    name: 'synctree',
    model: {
      prop: 'finalList',
      event: 'change'
    },

    props: {
      // 目的列表数据
      finalList: {
        type: Array,
        default: () => []
      },
      // 源列表数据
      data: {
        type: Array,
        default: () => []
      }
      
    },
    data() {
      return {
        delShow: false, // 删除确认弹出层控制器
        delId: '', // 删除弹出层 => id
        delPid: '', // 删除弹出层 => pid
        editShow: false, // 修改弹出层控制器
        editText: '', // 修改弹出层 => text
        editId: '', // 修改弹出层 => id
        originTree: [], // 源列表Tree
        originKeys: [], // 源列表keys
        defaultProps: {
          children: 'children',
          label: 'title'
        },
        showChild: false,
        tempList: [],
        delKeys: [],
        ableKeys: []
      }
    },
    computed: {
      // 源列表数据
        originList() {
            return this.data;
        },
      // 目的列表Tree
      finalTree() {
          console.log("this.finalList",this.finalList)
        this.finalList.forEach(item => {
          if (item.open === undefined && Number(item.pid) === 0) {
            this.$set(item, 'open', false)
          }
        })
        let arr = []
        // return Tool.arrToTree(this.finalList)
        return arr.push(this.finalList)
      },
      // 目的列表keys
      finalKeys() {
        return this.finalList.map(item => item.id)
      },
      // 根据源列表选择的keys生成的目的列表的keys
      originToFinalKeys() {
        const parentKeys = []
        this.originList.forEach(item => {
          if (this.originKeys.includes(item.id) && Number(item.pid) !== 0) {
            parentKeys.push(item.pid)
          }
        })
        return this.unique([...parentKeys, ...this.originKeys])
      }
    },
    created() {
      // 初始化源列表Tree
    //   this.initOriginTree()
    },
    mounted() {
      // 初始化源列表点选
    //   this.initOriginChecked()
      // this.initOriginDisChecked()
    },
    methods: {
      // 弹出删除弹出层
      popDelModal(id, pid) {
        this.delId = id
        this.delPid = pid
        this.delShow = true
      },
      getFinalKeys() {
        //   console.log(this.originToFinalKeys)
      },
      // 删除弹出层确认
      delOk() {
        const keys = []
        keys.push(this.delId)
        if (Number(this.delPid) === 0) {
          // 如果删除的key是一级分类
          this.finalTree.forEach(item => {
            if (item.id === this.delId) {
              item.children.forEach(child => {
                keys.push(child.id)
              })
            }
          })
        } else {
          // 如果删除的key是二级分类
          keys.push(this.delPid)
        }
        // 删除
        keys.forEach(key => {
          this.originKeys = this.removeByValue(this.originKeys, key)
        })
        // 同步到左侧
        this.$refs.originTree.setCheckedKeys(this.originKeys)

        this.delCancel()
      },
      // 删除弹出层取消
      delCancel() {
        this.delShow = false
        this.delId = ''
        this.delPid = ''
      },
      // 初始化源列表Tree
      initOriginTree() {
        this.originTree = Tool.arrToTree(this.originList)
      },
      // 初始化源列表点选
      initOriginChecked() {
        const checkedKeys = []
        this.finalList.forEach(item => {
          if (Number(item.pid) !== 0) {
            checkedKeys.push(item.id)
          } else {
            // 判断是否只有一级分类
            if (!this.finalList.map(i => i.pid).includes(item.id)) {
              checkedKeys.push(item.id)
            }
          }
        })
        this.$refs.originTree.setCheckedKeys(checkedKeys)
      },
      // 获取源列表keys
      getOriginKeys(data, checked, indeterminate) {
        //  console.log(data, checked, indeterminate)
        // if (checked === true) {
        //   this.disabledKeys.push(data.id)
        // } else {
        //   this.disabledKeys.splice(this.disabledKeys.findIndex(item => item === data.id), 1)
        // }
        this.originKeys = this.$refs.originTree.getCheckedKeys()
        // 点选源列表时关闭目的列表编辑弹出层
        // this.editCancel()
        // 点选源列表时关闭目的列表删除弹出层
        // this.delCancel()
      },
      // 在 target 数组中取出 arg 数组中没有的值组成数组返回
      findOut(target, arg) {
        return target.filter(v => !arg.includes(v))
      },
      // 删除数组中的某个值
      removeByValue(target, arg) {
        const index = target.indexOf(arg)
        if (index !== -1) {
          target.splice(index, 1)
        }
        return target
      },
      // 数组去重
      unique(arr) {
        const newArr = []
        arr.forEach(item => {
          if (!newArr.includes(item)) {
            newArr.push(item)
          }
        })
        return newArr
      },
      // 展开
      toggleOpen(id) {
        // 修改的是finalList 不是 finalTree，所以要通过id去获取而非index
        this.finalList.forEach(item => {
          if (item.id === id) {
            this.$set(item, 'open', !item.open)
          }
        })
      }
    },
    watch: {
     
      // 根据源列表的操作，同步目的列表
      originToFinalKeys() {
        // 点选源列表生成的目的列表中存在，但当前目的列表中没有
        this.findOut(this.originToFinalKeys, this.finalKeys).forEach(key => {
          this.originList.forEach(item => {
            if (item.id === key) {
              this.finalList.push(Tool.deepClone(item))
            }
          })
        })

        // 源列表取消选中，去除目的列表中的item
        this.findOut(this.finalKeys, this.originToFinalKeys).forEach(key => {
          this.finalList.forEach(item => {
            if (item.id === key) {
              this.finalList = this.removeByValue(this.finalList, item)
            }
          })
        })
      },
      finalList() {
        // 初始化左侧点选
        this.initOriginChecked()
     
      }
    }
  }

</script>

<style >
  .item-icon {
    font-size: 16px;
    vertical-align: middle;
    color: #c0c4cc;
  }


  .tree-child {
    display: none;
  }

  .tree-show {
    display: block!important;
  }

</style>