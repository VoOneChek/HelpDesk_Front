import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "../pages/auth/LoginPage";
import VerifyPage from "../pages/auth/VerifyPage";
import RegisterPage from "../pages/auth/RegisterPage";
import RecoverPage from "../pages/auth/RecoverPage";
import RecoverResetPage from "../pages/auth/RecoverResetPage";

import OperatorDashboard from "../pages/dashboards/OperatorDashboard";
import AdminDashboard from "../pages/dashboards/AdminDashboard";

// Импорт компонентов клиента
import ClientLayout from '../components/ClientLayout';
import TicketListPage from '../pages/tickets/TicketListPage';
import CreateTicketPage from '../pages/tickets/CreateTicketPage';
import TicketDetailPage from '../pages/tickets/TicketDetailPage';
import ProfilePage from '../pages/profile/ProfilePage';

import PrivateRoute from "../components/PrivateRoute";

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

                {/* Маршруты КЛИЕНТА */}
                <Route
                    path="/client"
                    element={
                        <PrivateRoute allowedRoles={['Client']}>
                            <ClientLayout />
                        </PrivateRoute>
                    }
                >
                    {/* Вложенные роуты (отобразятся внутри ClientLayout в <Outlet />) */}
                    <Route index element={<TicketListPage />} /> {/* По умолчанию список */}
                    <Route path="tickets" element={<TicketListPage />} />
                    <Route path="tickets/create" element={<CreateTicketPage />} />
                    <Route path="tickets/:id" element={<TicketDetailPage />} />
                    <Route path="profile" element={<ProfilePage />} />
                </Route>

                <Route
                    path="/operator"
                    element={
                        <PrivateRoute allowedRoles={['Operator']}>
                            <OperatorDashboard />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/admin"
                    element={
                        <PrivateRoute allowedRoles={['Admin']}>
                            <AdminDashboard />
                        </PrivateRoute>
                    }
                />

                {/* Если зашли на неизвестный адрес -> кидаем на логин */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
}