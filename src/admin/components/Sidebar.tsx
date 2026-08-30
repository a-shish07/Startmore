
// import { NavLink, useNavigate } from "react-router-dom";

// import {
//   FaTachometerAlt,
//   FaBoxOpen,
//   FaTags,
//   FaShapes,
//   FaShoppingCart,
//   FaUsers,
//   FaUserShield,
//   FaCog,
//   FaSignOutAlt,
//   FaRulerCombined,
//   FaImages,
// } from "react-icons/fa";

// import "../styles/admin-sidebar.css";

// interface SidebarProps {
//   sidebarOpen: boolean;
//   setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
// }

// const Sidebar = ({
//   sidebarOpen,
//   setSidebarOpen,
// }: SidebarProps) => {
//   const navigate = useNavigate();

//   const logout = () => {
//     localStorage.removeItem("adminToken");
//     localStorage.removeItem("adminUser");

//     navigate("/admin/login");
//   };

//   return (
//     <aside
//       className={`admin-sidebar ${
//         sidebarOpen ? "open" : ""
//       }`}
//     >
//       <div className="sidebar-logo">
//         <h2>SR ARTÉMORE</h2>
//         <span>Admin Panel</span>
//       </div>

//       <nav className="sidebar-menu">

//         <NavLink
//           to="/admin/dashboard"
//           className="sidebar-link"
//           onClick={() => setSidebarOpen(false)}
//         >
//           <FaTachometerAlt />
//           <span>Dashboard</span>
//         </NavLink>

//         <NavLink
//           to="/admin/banners"
//           className="sidebar-link"
//           onClick={() => setSidebarOpen(false)}
//         >
//           <FaImages />
//           <span>Hero Banner</span>
//         </NavLink>

       

//         <NavLink
//           to="/admin/categories"
//           className="sidebar-link"
//           onClick={() => setSidebarOpen(false)}
//         >
//           <FaTags />
//           <span>Categories</span>
//         </NavLink>

//         <NavLink
//           to="/admin/shapes"
//           className="sidebar-link"
//           onClick={() => setSidebarOpen(false)}
//         >
//           <FaShapes />
//           <span>Shapes</span>
//         </NavLink>

//         <NavLink
//           to="/admin/sizes"
//           className="sidebar-link"
//           onClick={() => setSidebarOpen(false)}
//         >
//           <FaRulerCombined />
//           <span>Sizes</span>
//         </NavLink>

//          <NavLink
//           to="/admin/products"
//           className="sidebar-link"
//           onClick={() => setSidebarOpen(false)}
//         >
//           <FaBoxOpen />
//           <span>Products</span>
//         </NavLink>
        
//         <NavLink
//           to="/admin/orders"
//           className="sidebar-link"
//           onClick={() => setSidebarOpen(false)}
//         >
//           <FaShoppingCart />
//           <span>Orders</span>
//         </NavLink>

//         <NavLink
//           to="/admin/customers"
//           className="sidebar-link"
//           onClick={() => setSidebarOpen(false)}
//         >
//           <FaUsers />
//           <span>Customers</span>
//         </NavLink>

//         <NavLink
//           to="/admin/users"
//           className="sidebar-link"
//           onClick={() => setSidebarOpen(false)}
//         >
//           <FaUserShield />
//           <span>Users</span>
//         </NavLink>

//         <NavLink
//           to="/admin/settings"
//           className="sidebar-link"
//           onClick={() => setSidebarOpen(false)}
//         >
//           <FaCog />
//           <span>Settings</span>
//         </NavLink>

//       </nav>

//       <button
//         className="logout-btn"
//         onClick={() => {
//           setSidebarOpen(false);
//           logout();
//         }}
//       >
//         <FaSignOutAlt />
//         <span>Logout</span>
//       </button>
//     </aside>
//   );
// };

// export default Sidebar;


// import { NavLink, useNavigate } from "react-router-dom";

// import {
//   FaTachometerAlt,
//   FaBoxOpen,
//   FaTags,
//   FaShapes,
//   FaShoppingCart,
//   FaUsers,
//   FaUserShield,
//   FaCog,
//   FaSignOutAlt,
//   FaRulerCombined,
//   FaImages,
// } from "react-icons/fa";

// import "../styles/admin-sidebar.css";

// interface SidebarProps {
//   sidebarOpen: boolean;
//   setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
// }

// const Sidebar = ({
//   sidebarOpen,
//   setSidebarOpen,
// }: SidebarProps) => {
//   const navigate = useNavigate();

//   const logout = () => {
//     localStorage.removeItem("adminToken");
//     localStorage.removeItem("adminUser");

//     navigate("/admin/login");
//   };

//   const closeSidebar = () => {
//     setSidebarOpen(false);
//   };

//   return (
//     <aside
//       className={`admin-sidebar ${
//         sidebarOpen ? "open" : ""
//       }`}
//     >

//       {/* ==========================================
//           LOGO
//       ========================================== */}

//       <div className="sidebar-logo">

//         <div className="sidebar-brand">

//           <div className="sidebar-brand-mark">
//             SR
//           </div>

//           <div className="sidebar-brand-text">
//             <h2>SR ARTÉMORE</h2>
//             <span>ADMIN PANEL</span>
//           </div>

//         </div>

//       </div>


//       {/* ==========================================
//           MENU
//       ========================================== */}

//       <nav className="sidebar-menu">

//         <NavLink
//           to="/admin/dashboard"
//           className="sidebar-link"
//           onClick={closeSidebar}
//         >
//           <FaTachometerAlt />
//           <span>Dashboard</span>
//         </NavLink>


//         <NavLink
//           to="/admin/banners"
//           className="sidebar-link"
//           onClick={closeSidebar}
//         >
//           <FaImages />
//           <span>Hero Banner</span>
//         </NavLink>


//         <NavLink
//           to="/admin/categories"
//           className="sidebar-link"
//           onClick={closeSidebar}
//         >
//           <FaTags />
//           <span>Categories</span>
//         </NavLink>


//         <NavLink
//           to="/admin/shapes"
//           className="sidebar-link"
//           onClick={closeSidebar}
//         >
//           <FaShapes />
//           <span>Shapes</span>
//         </NavLink>


//         <NavLink
//           to="/admin/sizes"
//           className="sidebar-link"
//           onClick={closeSidebar}
//         >
//           <FaRulerCombined />
//           <span>Sizes</span>
//         </NavLink>


//         <NavLink
//           to="/admin/products"
//           className="sidebar-link"
//           onClick={closeSidebar}
//         >
//           <FaBoxOpen />
//           <span>Products</span>
//         </NavLink>


//         <NavLink
//           to="/admin/orders"
//           className="sidebar-link"
//           onClick={closeSidebar}
//         >
//           <FaShoppingCart />
//           <span>Orders</span>
//         </NavLink>


//         <NavLink
//           to="/admin/customers"
//           className="sidebar-link"
//           onClick={closeSidebar}
//         >
//           <FaUsers />
//           <span>Customers</span>
//         </NavLink>


//         <NavLink
//           to="/admin/users"
//           className="sidebar-link"
//           onClick={closeSidebar}
//         >
//           <FaUserShield />
//           <span>Users</span>
//         </NavLink>


//         <NavLink
//           to="/admin/settings"
//           className="sidebar-link"
//           onClick={closeSidebar}
//         >
//           <FaCog />
//           <span>Settings</span>
//         </NavLink>

//       </nav>


//       {/* ==========================================
//           FOOTER
//       ========================================== */}

//       <div className="sidebar-footer">

//         <div className="sidebar-version">
//           SR Artémore · v1.0
//         </div>

//         <button
//           className="logout-btn"
//           onClick={() => {
//             closeSidebar();
//             logout();
//           }}
//         >
//           <FaSignOutAlt />
//           <span>Logout</span>
//         </button>

//       </div>

//     </aside>
//   );
// };

// export default Sidebar;

import {
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  FaTachometerAlt,
  FaBoxOpen,
  FaTags,
  FaShapes,
  FaShoppingCart,
  FaUsers,
  FaUserShield,
  FaCog,
  FaSignOutAlt,
  FaRulerCombined,
  FaImages,
  FaEnvelope,
} from "react-icons/fa";

import "../styles/admin-sidebar.css";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >;
}

const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
}: SidebarProps) => {

  const navigate = useNavigate();


  /* ==========================================
     LOGOUT
  ========================================== */

  const logout = () => {

    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");

    setSidebarOpen(false);

    navigate("/admin/login");
  };


  /* ==========================================
     CLOSE MOBILE SIDEBAR
  ========================================== */

  const closeSidebar = () => {
    setSidebarOpen(false);
  };


  return (
    <aside
      className={`admin-sidebar ${
        sidebarOpen ? "open" : ""
      }`}
    >

      {/* ==========================================
          LOGO
      ========================================== */}

      <div className="sidebar-logo">

        <div className="sidebar-brand">

          <div className="sidebar-brand-mark">
            SR
          </div>

          <div className="sidebar-brand-text">

            <h2>
              SR ARTÉMORE
            </h2>

            <span>
              ADMIN PANEL
            </span>

          </div>

        </div>

      </div>


      {/* ==========================================
          MENU
      ========================================== */}

      <nav className="sidebar-menu">

        <NavLink
          to="/admin/dashboard"
          className="sidebar-link"
          onClick={closeSidebar}
        >
          <FaTachometerAlt />

          <span>
            Dashboard
          </span>
        </NavLink>


        <NavLink
          to="/admin/banners"
          className="sidebar-link"
          onClick={closeSidebar}
        >
          <FaImages />

          <span>
            Hero Banner
          </span>
        </NavLink>


        <NavLink
          to="/admin/categories"
          className="sidebar-link"
          onClick={closeSidebar}
        >
          <FaTags />

          <span>
            Categories
          </span>
        </NavLink>


        <NavLink
          to="/admin/shapes"
          className="sidebar-link"
          onClick={closeSidebar}
        >
          <FaShapes />

          <span>
            Shapes
          </span>
        </NavLink>


        <NavLink
          to="/admin/sizes"
          className="sidebar-link"
          onClick={closeSidebar}
        >
          <FaRulerCombined />

          <span>
            Sizes
          </span>
        </NavLink>


        <NavLink
          to="/admin/products"
          className="sidebar-link"
          onClick={closeSidebar}
        >
          <FaBoxOpen />

          <span>
            Products
          </span>
        </NavLink>


        <NavLink
          to="/admin/orders"
          className="sidebar-link"
          onClick={closeSidebar}
        >
          <FaShoppingCart />

          <span>
            Orders
          </span>
        </NavLink>


        <NavLink
          to="/admin/customers"
          className="sidebar-link"
          onClick={closeSidebar}
        >
          <FaUsers />

          <span>
            Customers
          </span>
        </NavLink>


        <NavLink
          to="/admin/users"
          className="sidebar-link"
          onClick={closeSidebar}
        >
          <FaUserShield />

          <span>
            Users
          </span>
        </NavLink>

        <NavLink to="/admin/abandoned-cart-emails" className="sidebar-link" onClick={closeSidebar}>
          <FaEnvelope />
          <span>Abandoned Cart Emails</span>
        </NavLink>


        {/* <NavLink
          to="/admin/settings"
          className="sidebar-link"
          onClick={closeSidebar}
        >
          <FaCog />

          <span>
            Settings
          </span>
        </NavLink> */}

      </nav>


      {/* ==========================================
          FOOTER
      ========================================== */}

      <div className="sidebar-footer">

        <div className="sidebar-version">
          SR Artémore · v1.0
        </div>

        <button
          className="logout-btn"
          onClick={logout}
        >
          <FaSignOutAlt />

          <span>
            Logout
          </span>
        </button>

      </div>

    </aside>
  );
};

export default Sidebar;
