<template>
  <div>
    <!-- 面包屑头部 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 用户管理中间的卡片内容 -->
    <el-card>
      <!--Card 中的头部-->
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addUsersDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- Card 中的表格 -->
      <el-table :data="userList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <!-- 使用了作用域插槽，会覆盖prop -->
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope='scope'>
            <!-- 修改 -->
            <el-button type="primary" icon="el-icon-edit"   circle @click="editDialog(scope.row.id)"></el-button>
            <!-- 删除 -->
            <el-button type="danger"  icon="el-icon-delete" @click="deleteUser(scope.row.id)" circle></el-button>
            <!-- 设置 -->
            <el-tooltip effect="dark" content="设置角色"  placement="top-end" :enterable="false">
              <el-button type="warning"   icon="el-icon-setting" circle></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- Card 中的底部分页 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[1, 2, 3, 4]" :page-size="2" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="addUsersDialogVisible" @close="addDialogClose">
      <el-form :model="addUserForm" :rules="addUserRules" ref="addUserFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addUsersDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户的对话框 -->
    <el-dialog title="修改用户信息" :visible.sync="editDialogVisible" width="60%" @close='editDialogClose'>
      <el-form :model="editUserForm" :rules="editUserRuleS" ref="editUserFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editUserForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop='email'>
          <el-input v-model="editUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop='mobile'>
          <el-input v-model="editUserForm.mobile" ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="eidtUserInfo">确 定</el-button>
      </span>
  </el-dialog>
  <!-- 删除用户的弹框 -->

  </div>
</template>

<script>
export default {
  data() {
    // 自定义验证表单
    // 验证邮箱
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (!regEmail.test(value)) {
        callback(new Error('请输入合法邮箱'))
      }
      callback()
    }
    // 验证手机号
    var checkMobile = (rule, value, callback) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (!regMobile.test(value)) {
        callback(new Error('请输入合法手机号'))
      }
      callback()
    }
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userList: [],
      total: 0,
      pagenum: 0,
      addUsersDialogVisible: false,
      editDialogVisible: false,
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addUserRules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在3~10字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在6~15字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 查询到的用户信息对象
      editUserForm: {},
      // 修改用户信息时的校验对象
      editUserRuleS: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    // 获取用户列表
    async getUserList() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户列表失败')
      }
      this.userList = res.data.users
      this.total = res.data.total
      this.pagenum = res.data.pagenum
    },
    // 监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 监听页码值改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    // 监听switch 开关的状态变化
    async userStateChange(userInfo) {
      const { data: res } = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        this.$Message.error('设置状态失败')
      }
      this.$Message.success('设置状态成功')
    },
    // 关闭添加用户表单时,重置
    addDialogClose() {
      this.$refs.addUserFormRef.resetFields()
    },
    // 点击按钮“确定”验证并添加新用户
    addUser() {
      this.$refs.addUserFormRef.validate(async valid => {
        // console.log(valid)
        if (!valid) return false
        // 发起添加用户请求
        const { data: res } = await this.$http.post('users', this.addUserForm)
        if (res.meta.status !== 201) {
          return this.$Message.error('添加用户失败')
        }
        this.addUsersDialogVisible = false
        this.getUserList()
      })
    },
    // 显示编辑用户的对话框
    async editDialog(id) {
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) {
        this.$Message.error('查询失败')
      }
      this.editUserForm = res.data
      this.editDialogVisible = true
    },
    // 关闭修改用户表单时，重置
    editDialogClose() {
      this.$refs.editUserFormRef.resetFields()
    },
    // 点击按钮“确定”验证并修改新用户
    eidtUserInfo() {
      this.$refs.editUserFormRef.validate(async valid => {
        if (!valid) return false
        const { data: res } = await this.$http.put('users/' + this.editUserForm.id, this.editUserForm)
        if (res.meta.status !== 200) {
          return this.$Message.error('更新失败')
        }
        this.editDialogVisible = false
        this.getUserList()
        this.$Message.success('更新成功')
      })
    },
    // 点击删除，根据用户id移除用户
    async deleteUser(id) {
      const confirmResult = await this.$confirm('此操作将永久删除该用户,是否继续', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // console.log(confirmResult)
      // 如果用户确认了删除，返回的是字符串 confirm
      // 如果用户取消了删除， 返回的是异常信息，要用catch()捕获,返回字符串 cancel
      if (confirmResult !== 'confirm') {
        return this.$Message.info('取消删除')
      }
      const { data: res } = await this.$http.delete('users/' + id)
      if (res.meta.status !== 200) {
        return this.$Message.error('删除失败')
      }
      this.$Message.success('删除成功')
      this.getUserList()
    }
  }
}
</script>
<style lang="less" scoped>

</style>
