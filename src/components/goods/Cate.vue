<template>
<div>
  <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
  <!-- 卡片区域 -->
    <el-card>
      <!-- 头部区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <tree-table :data='cateList' :columns='columns' :selection-type='false' :expand-type='false' :show-index='true' border index-text='#' class="treeTable">
        <!--  isok-->
        <template slot='isok' slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: green;"></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <!-- order -->
        <template slot='order' slot-scope="scope">
          <el-tag type="primary" size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" size="mini" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <!-- operate -->
        <template slot='operate'>
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </tree-table>
      <!-- 底部分页 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="querInfo.pagenum" :page-sizes="[3, 5, 6]" :page-size="querInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加分类 对话框 -->
    <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%" @close='addCateDialogClosed'>
      <el-form :model="addCateForm" :rules="addCateRules" ref="addCateFromRef" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类:">
          <el-cascader v-model="selectedKeys" :options="parentCateList" :props="cascaderProps" @change="parentCateChange"
          clearable>
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
</div>
</template>

<script>
export default {
  data() {
    return {
      // 商品分类列表
      cateList: [],
      // 商品分类列表查询条件
      querInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 总数据数
      total: 0,
      // 为table指定列的定义
      columns: [{
        label: '分类名称',
        prop: 'cat_name'
      },
      {
        label: '是否有效',
        prop: 'cat_deleted',
        // 将当前列定义为模板列
        type: 'template',
        template: 'isok'
      },
      {
        label: '排序',
        prop: 'cat_level',
        // 将当前列定义为模板列
        type: 'template',
        template: 'order'
      },
      {
        label: '操作',
        // 将当前列定义为模板列
        type: 'template',
        template: 'operate'
      }],
      // 对话框默认不显示
      addCateDialogVisible: false,
      // 添加分类表单
      addCateForm: {
        cat_name: '',
        // 默认等级
        cat_pid: 0,
        cat_level: 0
      },
      // 添加分类表单规则
      addCateRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }]
      },
      // 父级分类列表
      parentCateList: [],
      // 父级列表被选中的Key
      selectedKeys: [],
      // 级联选项的属性
      cascaderProps: {
        expandTrigger: 'hover',
        checkStrictly: true,
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      }
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取商品分类列表
    async getCateList() {
      const { data: res } = await this.$http.get('categories', { params: this.querInfo })
      if (res.meta.status !== 200) {
        return this.$Message.error('获取分类列表失败')
      }
      // console.log(res)
      this.cateList = res.data.result
      this.total = res.data.total
    },
    // 监听pagesize改变
    handleSizeChange(newSize) {
      this.querInfo.pagesize = newSize
      this.getCateList()
    },
    // 监听pagenum改变
    handleCurrentChange(newPage) {
      this.querInfo.pagenum = newPage
      this.getCateList()
    },
    // 添加分类对话框
    showAddCateDialog() {
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    // 获取父级分类的数据列表
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) {
        return this.$Message.error('获取父级分类失败')
      }
      // console.log(res.data)
      this.parentCateList = res.data
    },
    // 父级列表选择项发生改变触发函数
    parentCateChange() {
      console.log(this.selectedKeys)
      if (this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        this.addCateForm.cat_level = this.selectedKeys.length
        return true
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    // 点击确定提交添加分类表单
    addCate() {
      // console.log(this.addCateForm)
      this.$refs.addCateFromRef.validate(async valid => {
        if (!valid) {
          return this.$Message.error('提交失败')
        }
        const { data: res } = await this.$http.post('categories', this.addCateForm)
        if (res.meta.status !== 201) {
          return this.$Message.error('添加分类失败')
        }
        this.$Message.success('添加分类成功')
        this.getCateList()
        this.addCateDialogVisible = false
      })
    },
    // 关闭添加分类对话框，重置
    addCateDialogClosed() {
      this.$refs.addCateFromRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    }
  }
}
</script>

<style lang="less" scoped>
.treeTable{
  margin-top: 20px;
}
.el-cascader{
  width: 100%;
}
</style>
