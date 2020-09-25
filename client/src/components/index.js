// -- Tabelas
import UserTable from "./Tables/UserTable"
import ContentTable from "./Tables/ContentTable"
import DisTable from "./Tables/DisTable"
import TagTable from "./Tables/TagTable"
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
import ActivityValidater from "./Form/Validation/FormValidateActivity"

// -- Drawer
import ItemsDrawer from "./Drawer/ItemsDrawer"
import ProfileMenu from "./Drawer/ProfileMenu"
import SideBar from "./Drawer/SideBar"
import TopBar from "./Drawer/TopBar"

// -- Dialogs
import ActivityDialog from "./Dialogs/ActivityDialog"
import ActivityDialogFilter from "./Dialogs/ActivityDialogFilter"
import ContentDialogForm from "./Dialogs/ContentDialogForm"
import QuestionDialog from "./Dialogs/QuestionDialog"
import QuestionDialogFilter from "./Dialogs/QuestionDialogFilter"
import PDFPreviewDialog from "./Dialogs/PDFPreviewDialog"
import SlideDialog from "./Dialogs/SlideDialog"

// -- Editor
import TextEditor from "./Editor/Editor"

// -- Date
import DatePicker from "./Calendar/DatePicker"

// -- Upload Content
import UploadContent from './Upload/UploadContent'

// -- Cards
import QuestionCard from './Cards/QuestionCard'

export { 
    UserTable,
    ContentTable,
    DisTable, 
    TagTable,
    QuestionTable,
    ActivityTable,

    UserForm, 
    QuestionForm,
    ActivityForm,
    ContentForm,

    UserValidater, 
    QuestionValidater,
    ContentValidater,
    ActivityValidater,

    ItemsDrawer, 
    ProfileMenu, 
    SideBar, 
    TopBar,
    
    ActivityDialog,
    ActivityDialogFilter,
    ContentDialogForm,
    QuestionDialog,
    QuestionDialogFilter,
    PDFPreviewDialog,
    SlideDialog,

    TextEditor,
    DatePicker,
    UploadContent,
    QuestionCard
}
