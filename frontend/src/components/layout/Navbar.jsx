import { useEffect, useState } from "react";
import { PanelLeft, Search } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { membersApi } from "../../api/endpoints.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { useDebounce } from "../../hooks/useDebounce.js";

const titles = {
  "/dashboard": "Organization Dashboard",
  "/members": "Members",
  "/plans": "Plans",
  "/memberships": "Memberships",
  "/payments": "Payments",
  "/settings": "Settings",
  "/member/dashboard": "Member Dashboard",
  "/member/profile": "My Profile",
  "/member/membership": "My Membership",
  "/member/payments": "Payment History",
};

const Navbar = ({ onSidebarToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const title = titles[location.pathname] || "FitSuite";
  const isMemberArea = location.pathname.startsWith("/member");
  const fallbackName = isMemberArea || user?.role === "member" ? "Member" : "Admin";
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    document.title = isMemberArea ? `FitSuite Member - ${title}` : `FitSuite - ${title}`;
  }, [isMemberArea, title]);

  useEffect(() => {
    let mounted = true;
    const trimmedQuery = debouncedQuery.trim();

    if (isMemberArea || trimmedQuery.length < 2) {
      setResults([]);
      setSearching(false);
      return () => {
        mounted = false;
      };
    }

    setSearching(true);
    membersApi
      .search({ q: trimmedQuery, page: 1, limit: 5 })
      .then(({ data }) => {
        if (!mounted) return;
        setResults(data.data || []);
      })
      .catch(() => mounted && setResults([]))
      .finally(() => mounted && setSearching(false));

    return () => {
      mounted = false;
    };
  }, [debouncedQuery, isMemberArea]);

  const openSearch = (value = query) => {
    const searchValue = value.trim();
    if (!searchValue) return;

    setResults([]);
    navigate(`/members?search=${encodeURIComponent(searchValue)}`);
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === "Enter") {
      openSearch();
    }
  };

  return (
    <header className="navbar">
      <div className="navbar__left">
        <button className="icon-button" onClick={onSidebarToggle}>
          <PanelLeft size={20} />
        </button>
        {!isMemberArea && (
          <div className="navbar__search">
            <Search size={18} />
            <input
              placeholder="Search members by name, phone, email"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={handleSearchKeyDown}
            />
            {(query.trim().length >= 2 || searching) && (
              <div className="navbar-search-results">
                {searching ? (
                  <div className="navbar-search-results__empty">Searching...</div>
                ) : results.length ? (
                  results.map((member) => (
                    <button
                      key={member._id}
                      type="button"
                      onClick={() => openSearch(member.phone || member.name)}
                    >
                      <strong>{member.name}</strong>
                      <span>{member.phone || member.email || "Member"}</span>
                    </button>
                  ))
                ) : (
                  <div className="navbar-search-results__empty">No members found</div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="navbar__center">
        <span>{title}</span>
      </div>

      <div className="navbar__actions">
        <div className="navbar__profile">
          <div className="avatar">
            {user?.profileImage ? (
              <img src={user.profileImage} alt={user?.name || fallbackName} />
            ) : (
              user?.name?.charAt(0) || fallbackName.charAt(0)
            )}
          </div>
          <span>{user?.name || fallbackName}</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
