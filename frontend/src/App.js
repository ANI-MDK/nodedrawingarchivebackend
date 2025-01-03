import './App.css';

import Login from './Login';

import Dashboard from './pages/Dashboard';

import RoleList from './pages/RoleList';
import RoleAdd from './pages/RoleAdd';
import RoleEdit from './pages/RoleEdit';

import ProjectList from './pages/ProjectList';
import ProjectAdd from './pages/ProjectAdd';
import ProjectDetail from './pages/ProjectDetail';
import ProjectEdit from './pages/ProjectEdit';

import UserList from './pages/UserList';
import UserAdd from './pages/UserAdd';
import UserEdit from './pages/UserEdit';
import UserDetail from './pages/UserDetail';
import UserPassword from './pages/UserPassword';
import UserPermission from './pages/UserPermission';

import CategoryList from './pages/CategoryList';

import DrawingList from './pages/DrawingList';
import DrawingAdd from './pages/DrawingAdd';
import DrawingEdit from './pages/DrawingEdit';
import DrawingDetail from './pages/DrawingDetail';
import DrawingDownload from './pages/DrawingDownload';

import DownloadHistory from './pages/DownloadHistory';

import { BrowserRouter as Router, Routes,Route } from 'react-router-dom';

//import { AuthProvider } from './AuthContext';

function App() {
  return (
      <Router>
        <Routes >
          <Route path="/" element={<Login/>}/>
          <Route path="/dashboard" element={<Dashboard/>}/>
          <Route path="/rolelist" element={<RoleList/>}/>
          <Route path="/roleadd" element={<RoleAdd/>}/>
          <Route path="/roleedit" element={<RoleEdit/>}/>

          <Route path="/projectlist" element={<ProjectList/>}/>
          <Route path="/projectadd" element={<ProjectAdd/>}/>
          <Route path="/projectdetail" element={<ProjectDetail/>}/>
          <Route path="/projectedit" element={<ProjectEdit/>}/>

          <Route path="/userlist" element={<UserList/>}/>
          <Route path="/useradd" element={<UserAdd/>}/>
          <Route path="/useredit" element={<UserEdit/>}/>
          <Route path="/userdetail" element={<UserDetail/>}/>
          <Route path="/userpassword" element={<UserPassword/>}/>
          <Route path="/userpermission" element={<UserPermission/>}/>

          <Route path="/categorylist" element={<CategoryList/>}/>

          <Route path="/drawinglist" element={<DrawingList/>}/>
          <Route path="/drawingadd" element={<DrawingAdd/>}/>
          <Route path="/drawingedit" element={<DrawingEdit/>}/>
          <Route path="/drawingdetail" element={<DrawingDetail/>}/>
          <Route path="/drawingdownload" element={<DrawingDownload/>}/>

          <Route path="/downloadlog" element={<DownloadHistory/>}/>
        </Routes>
      </Router>
  );
}

export default App;
