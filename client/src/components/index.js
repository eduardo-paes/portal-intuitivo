<<<<<<< HEAD
// -- Tabelas
import UserTable from "./Tables/UserTable"
import DisTable from "./Tables/DisTable"

// -- Rotas
import {Routes, PrivateRoutes} from "./Routes"

// -- Forms
import UserForm from "./Form/UserForm"
import UserValidater from "./Form/FormValidateUser"

// -- Drawer
import ItemsDrawer from "./Drawer/ItemsDrawer"
import ProfileMenu from "./Drawer/ProfileMenu"
import SideBar from "./Drawer/SideBar"
import TopBar from "./Drawer/TopBar"

// -- Dialogs
import DialogForm from "./Dialogs/DialogForm"

// -- Store
import StoreContext from "./Store/Context"
import StorageProvider from "./Store/Provider"

// -- Editor
import TextEditor from "./Editor/TextEditor"

export { 
    Routes, 
    PrivateRoutes, 
    UserTable,
    DisTable, 
    UserForm, 
    UserValidater, 
    ItemsDrawer, 
    ProfileMenu, 
    SideBar, 
    TopBar,
    DialogForm,
    StoreContext,
    StorageProvider,
    TextEditor
}
=======
import {Routes, PrivateRoutes} from "./Routes"
import Table from "./Table"

export { Routes, PrivateRoutes, Table }
>>>>>>> Adicionando tela de login
