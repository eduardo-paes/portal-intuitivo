// -- Tabelas
import UserTable from "./Tables/UserTable"
import ContentTable from "./Tables/ContentTable"
import DisTable from "./Tables/DisTable"
import TagTable from "./Tables/TagTable"
import QuestionTable from "./Tables/QuestionTable"
import ActivityTable from "./Tables/ActivityTable"
import CorrectionTable from "./Tables/CorrectionTable"

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
import ContentDialogFilter from "./Dialogs/ContentDialogFilter"
import CorrectionDialogFilter from "./Dialogs/CorrectionDialogFilter"
import QuestionDialog from "./Dialogs/QuestionDialog"
import QuestionDialogFilter from "./Dialogs/QuestionDialogFilter"
import PDFPreviewDialog from "./Dialogs/PDFPreviewDialog"
import SlideDialog from "./Dialogs/SlideDialog"
import ExerciseDialog from "./Dialogs/StudentDialogs/ExerciseDialog"
import StudyContentDialog from "./Dialogs/StudentDialogs/StudyContentDialog"
import SimpleFeedback from "./Dialogs/StudentDialogs/SimpleFeedback"
import CorrectionDialog from "./Dialogs/CorrectionDialog"
import UserDialogFilter from "./Dialogs/UserDialogFilter"

// -- Editor
import TextEditor from "./Editor/Editor"

// -- Date
import DatePicker from "./Calendar/DatePicker"

// -- Uploads
import UploadButton from './Upload/UploadButton'
import UploadContent from './Upload/UploadContent'
import UploadEssay from './Upload/UploadEssay'

// -- Cards
import ActivityCard from './Cards/ActivityCard'
import QuestionCard from './Cards/QuestionCard'
import SubjectCard from './Cards/AdminCards/SubjectCard'
import AreaCard from './Cards/AdminCards/AreaCard'
import StudentResults from './Cards/StudentResults'

// -- Accorddions
import ContentAccordion from './Accordions/ContentAccordion'
import AccordionSkeleton from './Accordions/SkeletonAccordion'
import EssayAccordion from './Accordions/EssayAccordion'
import SubjectAccordion from './Accordions/Teacher/AnalysisAccordion'

// -- Sliders
import DiscreteSlider from './Sliders/DiscreteSlider'

// -- Others
import PDFViewer from './PDFViewer/PDFViewer'
import RadioAnswer from "./Radio/RadioAnswer"
import RadioCorrected from "./Radio/RadioCorrected"
import SimpleRadio from './Radio/SimpleRadio'
import WirisIframe from './MathDisplay/WirisIframe'
import LinearProgressBar from "./ProgressBar/LinearProgressBar"
import QuestionProgress from "./ProgressBar/QuestionProgress"
import CircularStatic from "./ProgressBar/CircularStatic"


// -- Tabs
import FullWidthTab from './Tabs/FullWidthTab'
import VerticalTab from './Tabs/VerticalTab'

// -- Snackbars
import SimpleSnackMessage from './Snackbars/SimpleSnackMessage'

export { 
    UserTable,
    ContentTable,
    DisTable, 
    TagTable,
    QuestionTable,
    ActivityTable,
    CorrectionTable,

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
    ContentDialogFilter,
    CorrectionDialog,
    CorrectionDialogFilter,
    QuestionDialog,
    QuestionDialogFilter,
    UserDialogFilter,
    PDFPreviewDialog,
    SlideDialog,
    ExerciseDialog,
    StudyContentDialog,
    SimpleFeedback,

    TextEditor,
    DatePicker,

    UploadButton,
    UploadContent,
    UploadEssay,

    ActivityCard,
    QuestionCard,
    SubjectCard,
    AreaCard,
    StudentResults,

    ContentAccordion,
    AccordionSkeleton,
    EssayAccordion,
    SubjectAccordion,

    DiscreteSlider,

    PDFViewer,
    RadioAnswer,
    RadioCorrected,
    SimpleRadio,
    WirisIframe,
    LinearProgressBar,
    QuestionProgress,
    CircularStatic,

    FullWidthTab,
    VerticalTab,

    SimpleSnackMessage,
}
