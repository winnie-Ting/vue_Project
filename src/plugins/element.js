import Vue from 'vue'
import {
  Aside,
  Alert,
  Button,
  Breadcrumb,
  BreadcrumbItem,
  Container,
  Card,
  Col,
  Cascader,
  Checkbox,
  CheckboxGroup,
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
  Steps,
  Step,
  Table,
  TableColumn,
  Tooltip,
  Tag,
  Tree,
  Tabs,
  TabPane,
  Upload
} from 'element-ui'
import Timeline from '../plugins/timeline/index.js'
import TimelineItem from '../plugins/timeline-item/index.js'

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
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Steps)
Vue.use(Step)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Upload)
Vue.use(Timeline)
Vue.use(TimelineItem)
Vue.prototype.$Message = Message
Vue.prototype.$confirm = MessageBox.confirm
