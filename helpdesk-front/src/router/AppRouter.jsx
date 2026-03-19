import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "../pages/auth/LoginPage";
import VerifyPage from "../pages/auth/VerifyPage";
import RegisterPage from "../pages/auth/RegisterPage";
import RecoverPage from "../pages/auth/RecoverPage";
import RecoverResetPage from "../pages/auth/RecoverResetPage";

// Импорт компонентов клиента
import ClientLayout from '../components/ClientLayout';
import TicketListPage from '../pages/tickets/TicketListPage';
import CreateTicketPage from '../pages/tickets/CreateTicketPage';
import TicketDetailPage from '../pages/tickets/TicketDetailPage';
import ProfilePage from '../pages/profile/ProfilePage';

// Импорт компонентов оператора
import OperatorLayout from '../components/OperatorLayout';
import OperatorTicketListPage from '../pages/tickets/OperatorTicketListPage';

// Импорт компонентов администратора
import AdminLayout from '../components/AdminLayout';
import UsersPage from '../pages/admin/UsersPage';
import CategoriesPage from '../pages/admin/CategoriesPage';
import ReportsPage from '../pages/admin/ReportsPage';

import PrivateRoute from "../components/PrivateRoute";
import FaqPage from "../pages/admin/FaqPage.jsx";
import FaqViewPage from "../pages/FaqViewPage.jsx";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Публичные маршруты */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/verify" element={<VerifyPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/recover" element={<RecoverPage />} />
                <Route path="/recover/reset" element={<RecoverResetPage />} />

                {/* КЛИЕНТ */}
                <Route
                    path="/client"
                    element={
                        <PrivateRoute allowedRoles={['Client']}><ClientLayout /></PrivateRoute>}
                >
                    <Route index element={<TicketListPage />} />
                    <Route path="tickets" element={<TicketListPage />} />
                    <Route path="tickets/create" element={<CreateTicketPage />} />
                    <Route path="tickets/:id" element={<TicketDetailPage />} />
                    <Route path="profile" element={<ProfilePage />} />
                    <Route path="faq" element={<FaqViewPage />} />
                </Route>

                {/* ОПЕРАТОР */}
                <Route
                    path="/operator"
                    element={<PrivateRoute allowedRoles={['Operator']}><OperatorLayout /></PrivateRoute>}
                >
                    <Route path="tickets" element={<OperatorTicketListPage />} />
                    <Route path="tickets/:id" element={<TicketDetailPage />} />
                    <Route path="profile" element={<ProfilePage />} />
                    <Route path="faq" element={<FaqViewPage />} />
                    <Route index element={<OperatorTicketListPage />} />
                </Route>

                {/* АДМИНИСТРАТОР */}
                <Route
                    path="/admin"
                    element={<PrivateRoute allowedRoles={['Admin']}><AdminLayout /></PrivateRoute>}
                >
                    <Route path="users" element={<UsersPage />} />
                    <Route path="categories" element={<CategoriesPage />} />
                    <Route path="reports" element={<ReportsPage />} />
                    <Route path="profile" element={<ProfilePage />} />
                    <Route path="faq" element={<FaqPage />} />
                    <Route index element={<UsersPage />} />
                </Route>

                {/* Если зашли на неизвестный адрес -> кидаем на логин */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
}