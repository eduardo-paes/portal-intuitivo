// -- Tabelas
import UserTable from "./Tables/UserTable"
import ContentTable from "./Tables/ContentTable"
import DisTable from "./Tables/DisTable"
import QuestionTable from "./Tables/QuestionTable"
import ActivityTable from "./Tables/ActivityTable"

// -- Forms
import UserForm from "./Form/UserForm"
import ContentForm from "./Form/ContentForm"
import QuestionForm from "./Form/QuestionForm"
import ActivityForm from "./Form/ActivityForm"

// -- Validators
import UserValidater from "./Form/Validation/FormValidateUser"
import ContentValidater from "./Form/Validation/FormValidateContent"
import QuestionValidater from "./Form/Validation/FormValidateQuestion"

// -- Drawer
import ItemsDrawer from "./Drawer/ItemsDrawer"
import ProfileMenu from "./Drawer/ProfileMenu"
import SideBar from "./Drawer/SideBar"
import TopBar from "./Drawer/TopBar"

// -- Dialogs
import DialogForm from "./Dialogs/DialogForm"
import PDFPreviewDialog from "./Dialogs/PDFPreviewDialog"
import CustomDialog from "./Dialogs/CustomDialog"

// -- Editor
import TextEditor from "./Editor/Editor"

// -- Upload Content
import UploadContent from './Upload/UploadContent'

// -- Cards
import QuestionCard from './Cards/QuestionCard'

export { 
    UserTable,
    ContentTable,
    DisTable, 
    QuestionTable,
    ActivityTable,

    UserForm, 
    QuestionForm,
    ActivityForm,
    ContentForm,

    UserValidater, 
    QuestionValidater,
    ContentValidater,

    ItemsDrawer, 
    ProfileMenu, 
    SideBar, 
    TopBar,
    
    PDFPreviewDialog,
    DialogForm,
    CustomDialog,

    TextEditor,
    UploadContent,
    QuestionCard
}
