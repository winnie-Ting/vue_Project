import Vue from 'vue'
import {
  Aside,
  Button,
  Breadcrumb,
  BreadcrumbItem,
  Container,
  Card,
  Col,
  Cascader,
  Dialog,
  Form,
  FormItem,
  Header,
  Input,
  Message,
  Main,
  Menu,
  MenuItemGroup,
  MenuItem,
  MessageBox,
  Option,
  Pagination,
  Row,
  Submenu,
  Switch,
  Select,
  Table,
  TableColumn,
  Tooltip,
  Tag,
  Tree
} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)
Vue.prototype.$Message = Message
Vue.prototype.$confirm = MessageBox.confirm
