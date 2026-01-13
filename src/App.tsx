import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";

import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";

import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";

import ScaleDashboard from "./pages/Dashboard/ScaleDashboard";
import Scanner from "./pages/Scanner";

import DataProduk from "./pages/Admin/DataProduk";
import RiwayatPenimbangan from "./pages/Admin/RiwayatPenimbangan";
import LaporanPenimbangan from "./pages/Admin/LaporanPenimbangan";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>

        {/* ================= AUTH ================= */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* ============== PROTECTED USER ============== */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          {/* USER & ADMIN */}
          <Route index element={<ScaleDashboard />} />
          <Route path="scan" element={<Scanner />} />
          <Route path="profile" element={<UserProfiles />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="blank" element={<Blank />} />

          {/* UI */}
          <Route path="alerts" element={<Alerts />} />
          <Route path="avatars" element={<Avatars />} />
          <Route path="badge" element={<Badges />} />
          <Route path="buttons" element={<Buttons />} />
          <Route path="images" element={<Images />} />
          <Route path="videos" element={<Videos />} />

          {/* Charts */}
          <Route path="line-chart" element={<LineChart />} />
          <Route path="bar-chart" element={<BarChart />} />

          {/* Tables & Forms */}
          <Route path="basic-tables" element={<BasicTables />} />
          <Route path="form-elements" element={<FormElements />} />

          {/* ============== ADMIN ONLY ============== */}
          <Route
            element={
              <AdminRoute />
            }
          >
            <Route path="dataproduk" element={<DataProduk />} />
            <Route path="riwayat" element={<RiwayatPenimbangan />} />
            <Route path="laporan" element={<LaporanPenimbangan />} />
          </Route>
        </Route>

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </Router>
  );
}
