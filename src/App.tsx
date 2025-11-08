import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useSearchParams,
} from "react-router-dom";
import Header from "./components/common/Header";
import FooterTabs from "./components/common/FooterTabs";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Ranking from "./pages/Ranking";
import Settings from "./pages/Settings";
import CreateWish from "./pages/CreateWish";
import WishDetail from "./pages/WishDetail";
import WishEdit from "./pages/WishEdit";
import MyWishes from "./pages/MyWishes";
import GroupCreate from "./pages/GroupCreate";
import InviteUser from "./pages/InviteUser";
import { useAuth, auth as accessTokenAuth } from "./store/useAuth";
import { useEffect } from "react";
import { Group } from "lucide-react";
import { useAppStore } from "./store/useAppStore";
import UserParticipation from "./pages/UserParticipation";

function App() {
  const { auth } = useAuth();
  const setUser = useAppStore((state) => state.setUser);
  useEffect(() => {
    console.log(localStorage.getItem("shitai-accessToken"));
    (async () => {
      const { isAuthenticated, id, name, email } = await accessTokenAuth();
      auth(isAuthenticated, id);
      setUser({
        id: id ? id.toString() : "",
        name,
        email,
      });
    })();
  }, []);
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {useAuth().isAuthenticated && <Header />}
        <main className="min-h-screen">
          <Routes>
            <Route
              path="/login"
              element={
                useAuth().isAuthenticated ? (
                  <Navigate to="/" replace />
                ) : (
                  <Login />
                )
              }
            />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                useAuth().isAuthenticated ? (
                  <Home />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/ranking"
              element={
                useAuth().isAuthenticated ? (
                  <Ranking />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/settings"
              element={
                useAuth().isAuthenticated ? (
                  <Settings />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/create"
              element={
                useAuth().isAuthenticated ? (
                  <CreateWish />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/wish/:id"
              element={
                useAuth().isAuthenticated ? (
                  <WishDetail />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/wish/:id/edit"
              element={
                useAuth().isAuthenticated ? (
                  <WishEdit />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/my-wishes"
              element={
                useAuth().isAuthenticated ? (
                  <MyWishes />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/groups/new"
              element={
                useAuth().isAuthenticated ? (
                  <GroupCreate />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/groups/:groupId/invite"
              element={
                useAuth().isAuthenticated ? (
                  <InviteUser />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/user-participation"
              element={
                useAuth().isAuthenticated ? (
                  <UserParticipation />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
          </Routes>
        </main>
        {useAuth().isAuthenticated && <FooterTabs />}
      </div>
    </Router>
  );
}

export default App;
