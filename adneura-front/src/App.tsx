import Login from "./pages/Login.tsx";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home.tsx";
import { AuthProvider } from "./context/AuthContextProvider.tsx";
import { BrandProvider } from "./context/BrandContext.tsx";
import ProtectedRoute from "./services/ProtectedRoute.tsx";
import { BrandSummaryPage } from "./pages/BrandSummaryPage.tsx";
import { StrategicGoalsPage } from "./pages/StrategicGoalsPage.tsx";
import { AudiencePage } from "./pages/AudiencePage.tsx";
import { LoadingAudiencesPage } from "./pages/LoadingAudiencesPage.tsx";
import { AudienceSegmentsPage } from "./pages/AudienceSegmentsPage.tsx";

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <BrandProvider>
                <Home />{" "}
              </BrandProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/brandSummary"
          element={
            <ProtectedRoute>
              <BrandProvider>
                <BrandSummaryPage />
              </BrandProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/strategicGoals"
          element={
            <ProtectedRoute>
              <BrandProvider>
                <StrategicGoalsPage />
              </BrandProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/audienceLoading"
          element={
            <ProtectedRoute>
              <BrandProvider>
                <LoadingAudiencesPage />
              </BrandProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/audienceSegments"
          element={
            <ProtectedRoute>
              <BrandProvider>
                <AudienceSegmentsPage />
              </BrandProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/audience/:audienceId"
          element={
            <ProtectedRoute>
              <BrandProvider>
                <AudiencePage />
              </BrandProvider>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<p>404 Not Found</p>} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
