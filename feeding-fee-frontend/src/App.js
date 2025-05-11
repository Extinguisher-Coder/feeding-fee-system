import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboardLayout from './Components/AdminComponents/AdminLayouts/AdminDashboardLayout';
import AdminStudentsPage from './Components/AdminComponents/AdminPages/AdminStudentsPage';
import AdminPaymentPage from './Components/AdminComponents/AdminPages/AdminPaymentPage';
import AdminDashboardPage from './Components/AdminComponents/AdminPages/AdminDashboardPage';
import SettingsPage from './Components/AdminComponents/AdminPages/SettingsPage';
import CasherDashboardLayout from './Components/CasherComponents/CasherLayouts/CasherDashboardLayout';
import ParentDashboardLayout from './Components/ParentCompents/ParentLayouts/ParentDashboardLayout';
import LoginPage from './Components/LoginsComponents/LoginPage';
import AdminReportsPage from './Components/AdminComponents/AdminPages/AdminReportsPage';
import TodayReportPage from './Components/AdminComponents/AdminPages/TodayReportPage';
import StudentRegistrationPage from './Components/AdminComponents/AdminPages/StudentRegistrationPage';
import StudentInformationPage from './Components/AdminComponents/AdminPages/StudentInformationPage';
import StudentUpdateForm from './Components/AdminComponents/AdminPages/StudentUpdateForm';
import AdminUsersPage from './Components/AdminComponents/AdminPages/AdminUsersPage';
import ResetParentPasswordForm from './Components/AdminComponents/AdminPages/ResetParentPasswordForm';
import ChangePasswordForm from './Components/AdminComponents/AdminPages/ChangePasswordForm';
import AddUserForm from './Components/AdminComponents/AdminPages/AddUserForm';
import StudentPaymentPortal from './Components/ParentCompents/ParentPages/StudentPaymentPortal';
import Footer from './Components/FooterComponents/Footer';
import RegistrarDashboardLayout from './Components/RegistrarsComponents/RegisstrarLayouts/RegistrarDashboardLayout';
import ProtectedRoute from './Components/Auth/ProtectedRoute';
import Unauthorized from './Components/Unauthorized';
import WeeklyReportPage from './Components/AdminComponents/AdminPages/WeeklyReportPage';
import UnpaidReportPage from './Components/AdminComponents/AdminPages/UnpaidReportPage';
import ParentChangePasswordForm from './Components/ParentCompents/ParentPages/ParentChangePasswordForm';
import ParentContactUsPage from './Components/ParentCompents/ParentPages/ParentContactUsPage';
import AdminSystemLogsPage from './Components/AdminComponents/AdminPages/AdminSystemLogsPage';
import AbsenteeismForm from './Components/AdminComponents/AdminPages/AbsenteeismForm';



function App() {
  return (
    <Router>
     
      <Routes>
              {/* Public route */}
              {/* .........LoginPage....... */}

              <Route path="/" element={<LoginPage />} />
              <Route path="/unauthorized" element={<Unauthorized />} />


           {/* .........Admin Route.......... */}
           <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
              <Route path="/admin" element={<AdminDashboardLayout />}>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<AdminDashboardPage />} />
                  <Route path="students" element={<AdminStudentsPage />} />
                  <Route path="/admin/view-student/:id" element={<StudentInformationPage />} />
                  <Route path="/admin/edit-student/:id" element={<StudentUpdateForm />} />
                  <Route path="/admin/students/register" element={<StudentRegistrationPage />} />
                  <Route path="payments" element={<AdminPaymentPage />} />
                  <Route path="reports" element={<AdminReportsPage />} />
                  <Route path="/admin/reports/today" element={<TodayReportPage />} />
                  <Route path="/admin/reports/weekly" element={<WeeklyReportPage />} />
                  <Route path="/admin/unpaid" element={<UnpaidReportPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                  <Route path="users" element={<AdminUsersPage />} />
                  <Route path="/admin/users/add" element={<AddUserForm />} />
                  <Route path="/admin/users/change-password" element={<ChangePasswordForm />} />
                  <Route path="/admin/users/reset-parent-password" element={<ResetParentPasswordForm />} />
                  <Route path="/admin/logs" element={<AdminSystemLogsPage/>} />
                  <Route path="/admin/absenteeism" element={<AbsenteeismForm/>} />
                  
                  

              </Route>
            </Route>


           {/* ........ Registrar Route ......... */}

           <Route element={<ProtectedRoute allowedRoles={["Registrar"]} />}>
              <Route path="/registrar" element={<RegistrarDashboardLayout />}>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<AdminDashboardPage />} />
                  <Route path="students" element={<AdminStudentsPage />} />
                  <Route path="/registrar/view-student/:id" element={<StudentInformationPage />} />
                  <Route path="/registrar/edit-student/:id" element={<StudentUpdateForm />} />
                  <Route path="/registrar/students/register" element={<StudentRegistrationPage />} />
                  <Route path="change-password" element={<ChangePasswordForm />} />
          


              </Route>
           </Route>



         {/* .........Casher Route.......... */}

              <Route element={<ProtectedRoute allowedRoles={["Cashier", "Accountant"]} />}>
                <Route path="/cashier" element={<CasherDashboardLayout />}>
                      <Route index element={<Navigate to="dashboard" replace />} />
                      <Route path="dashboard" element={<AdminDashboardPage />} />
                      <Route path="payments" element={<AdminPaymentPage />} />
                      <Route path="reports" element={<AdminReportsPage />} />
                      <Route path="/cashier/reports/today" element={<TodayReportPage />} />
                      <Route path="/cashier/reports/weekly" element={<WeeklyReportPage />} />
                      <Route path="/cashier/unpaid" element={<UnpaidReportPage />} />
                      <Route path="change-password" element={<ChangePasswordForm />} />
          


                </Route>
              </Route>
        
         
         {/* .........Parents Route.......... */}

              <Route element={<ProtectedRoute allowedRoles={["Student"]} />}>
                <Route path="/parent" element={<ParentDashboardLayout />}>
                  <Route index element={<Navigate to="portal" replace />} />
                  <Route path="portal" element={<StudentPaymentPortal />} />
                  <Route path="change-password" element={<ParentChangePasswordForm/>} />
                  <Route path="contact-us" element={<ParentContactUsPage/>} />
                  
                  
                 

                </Route> 
              </Route> 


      </Routes>
      
      <Footer/>

    </Router>
  );
}

export default App;
