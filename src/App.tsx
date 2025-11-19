import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useSearchParams,
  useLocation,
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
import { useEffect } from "react";
import { Group } from "lucide-react";
import { useAppStore } from "./store/useAppStore";
import UserParticipation from "./pages/UserParticipation";
import { getGroups, useGroupStore } from "./store/useGroupStore";
import { getWishes, useWishStore } from "./store/useWishStore";
import { useAuth } from "./store/useAuth";

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {isAuthenticated && <Header />}
        <main className="min-h-screen">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Home />} />
            <Route path="/ranking" element={<Ranking />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/create" element={<CreateWish />} />
            <Route path="/wish/:id" element={<WishDetail />} />
            <Route path="/wish/:id/edit" element={<WishEdit />} />
            <Route path="/my-wishes" element={<MyWishes />} />
            <Route path="/groups/new" element={<GroupCreate />} />
            <Route path="/groups/:groupId/invite" element={<InviteUser />} />
            <Route path="/user-participation" element={<UserParticipation />} />
          </Routes>
        </main>
        {isAuthenticated && <FooterTabs />}
      </div>
    </Router>
  );
}

export default App;
