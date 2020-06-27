<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- Card 视图 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
        <el-button type="primary" @click="addRolesDialogVisible = true">添加角色</el-button>
      <!-- 角色列表区域 -->
      <el-table :data="rolesList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope='scope'>
            <el-row v-for="(item1,i1) in scope.row.children" :key="item1.id" :class="['vcenter','bdbottom',i1 == 0?'bdtop':'']">
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close='removeRightTag(scope.row,item1.id)'>{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- 渲染二级权限 -->
                <el-row v-for="(item2,i2) in item1.children" :key="item2.id" :class="[i2 == 0?'':'bdtop','vcenter']">
                  <el-col :span="6">
                    <el-tag type="success" closable @close='removeRightTag(scope.row,item2.id)'>{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 渲染三级权限 -->
                  <el-col :span="18">
                    <el-tag type="warning" v-for="item3 in item2.children" :key="item3.id" closable @close='removeRightTag(scope.row,item3.id)'>
                      {{item3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width=300px>
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editRoles(scope.row.id)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteRoles(scope.row.id)">删除</el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加用户对话框 -->
     <el-dialog title="添加角色" :visible.sync="addRolesDialogVisible" @close='addRolesClose'>
      <el-form :model="addRolesForm" :rules="addRolesRules" ref="addRolesFormRef">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑用户对话框 -->
     <el-dialog title="修改角色信息" :visible.sync="editRolesDialogVisible" width="60%" @close='editRolesClose'>
      <el-form :model="editRolesForm" :rules="editRolesRules" ref="editRolesFormRef">
        <el-form-item label="用户ID" prop="roleId">
          <el-input v-model="editRolesForm.roleId" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="eidtRolesInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%" @close='setRightDialogClosed'>
      <el-tree
          :data="rightsList"
          show-checkbox
          node-key="id"
          default-expand-all
          :default-checked-keys="defkeys"
          :props="rightProps" ref="treeRef">
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRight">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 所有角色列表数据
      rolesList: [],
      // 添加角色表单数据
      addRolesForm: {
        'roleId': '',
        'roleName': '',
        'roleDesc': ''
      },
      addRolesDialogVisible: false,
      // 添加角色规则
      addRolesRules: {
        roleName: [
          { required: true, message: '请输入角色', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在2~10字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '角色描述', trigger: 'blur' },
          { min: 2, max: 15, message: '长度在2~15字符', trigger: 'blur' }
        ]
      },
      // 编辑角色表单数据
      editRolesForm: {
        'roleId': '',
        'roleName': '',
        'roleDesc': ''
      },
      editRolesDialogVisible: false,
      // 编辑角色规则
      editRolesRules: {
        roleName: [
          { required: true, message: '请输入角色', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在2~10字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '角色描述', trigger: 'blur' },
          { min: 2, max: 15, message: '长度在2~15字符', trigger: 'blur' }
        ]
      },
      // 分配权限对话框
      setRightDialogVisible: false,
      // 所有权限列表
      rightsList: [],
      // 权限树形列表绑定属性
      rightProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认树形展开选中的节点ID值数组
      defkeys: [],
      roleId: ''
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    // 获取角色列表
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        this.$Message.error('获取角色列表失败')
      }
      this.rolesList = res.data
    },
    // 添加角色
    addRoles() {
      this.$refs.addRolesFormRef.validate(async valid => {
        // console.log(valid)
        if (!valid) return false
        // 发起添加用户请求
        const { data: res } = await this.$http.post('roles', this.addRolesForm)
        if (res.meta.status !== 201) {
          return this.$Message.error('添加用户失败')
        }
        this.addRolesDialogVisible = false
        this.getRolesList()
      })
    },
    // 关闭添加按钮后，重置表单
    addRolesClose() {
      this.$refs.addRolesFormRef.resetFields()
    },
    // 编辑角色
    async editRoles(id) {
      const { data: res } = await this.$http.get('roles/' + id)
      // console.log(res)
      if (res.meta.status !== 200) {
        this.$Message.error('查询失败')
      }
      this.editRolesForm = res.data
      this.editRolesDialogVisible = true
    },
    // 关闭编辑对话框，重置表单
    editRolesClose() {
      this.$refs.editRolesFormRef.resetFields()
    },
    // 提交编辑角色
    eidtRolesInfo() {
      this.$refs.editRolesFormRef.validate(async valid => {
        if (!valid) return false
        const { data: res } = await this.$http.put('roles/' + this.editRolesForm.roleId, this.editRolesForm)
        if (res.meta.status !== 200) {
          return this.$Message.error('更新失败')
        }
        this.editRolesDialogVisible = false
        this.getRolesList()
        this.$Message.success('更新成功')
      })
    },
    // 删除角色
    async deleteRoles(id) {
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
      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$Message.error('删除失败')
      }
      this.$Message.success('删除成功')
      this.getRolesList()
    },
    // 移除权限标签
    async removeRightTag(role, rightId) {
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$Message.info('取消删除')
      }
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      if (res.meta.status !== 200) {
        return this.$Message.error('删除失败')
      }
      role.children = res.data
    },
    // 显示分配权限的对话框内容
    async showSetRightDialog(role) {
      this.roleId = role.id
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$Message.error('获取权限列表失败')
      }
      this.rightsList = res.data
      // console.log(this.rightsList)
      this.getLeafKeys(role, this.defkeys)
      this.setRightDialogVisible = true
    },
    // 通过递归形式，获取角色下所有三级权限的id，保存到数组
    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    // 监听分配权限的对话框的关闭事件
    setRightDialogClosed() {
      this.defkeys = []
    },
    // 角色授权
    async allotRight() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedNodes()
      ]
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (res.meta.status !== 200) {
        return this.$Message.error('更新失败')
      }
      this.$Message.success('更新成功')
      this.getRolesList()
      this.setRightDialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag{
  margin: 10px;
}
.bdbottom{
  border-bottom:1px solid #eee;
}
.bdtop{
  border-top: 1px solid #eee;
}
.vcenter{
  display: flex;
  align-items: center;
}
</style>
