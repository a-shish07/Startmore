// // import { FaBars, FaBell, FaSearch, FaUserCircle } from "react-icons/fa";

// // import "../styles/admin-header.css";

// // const Header = () => {
// //   return (
// //     <header className="admin-header">

// //       <div className="admin-header-left">

// //         <button className="menu-btn">
// //           <FaBars />
// //         </button>

// //         <div className="search-box">

// //           <FaSearch className="search-icon" />

// //           <input
// //             type="text"
// //             placeholder="Search products, orders..."
// //           />

// //         </div>

// //       </div>

// //       <div className="admin-header-right">

// //         <button className="notification-btn">
// //           <FaBell />
// //           <span className="notification-count">3</span>
// //         </button>

// //         <div className="admin-profile">

// //           <FaUserCircle className="profile-icon" />

// //           <div>
// //             <h4>Administrator</h4>
// //             <p>Super Admin</p>
// //           </div>

// //         </div>

// //       </div>

// //     </header>
// //   );
// // };

// // export default Header;

// import { FaBars, FaBell, FaSearch, FaUserCircle } from "react-icons/fa";

// import "../styles/admin-header.css";

// interface HeaderProps {
//   sidebarOpen: boolean;
//   setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
// }

// const Header = ({
//   sidebarOpen,
//   setSidebarOpen,
// }: HeaderProps) => {
//   return (
//     <header className="admin-header">

//       <div className="admin-header-left">

//         <button
//           className="menu-btn"
//           onClick={() => setSidebarOpen(!sidebarOpen)}
//         >
//           <FaBars />
//         </button>

//         <div className="search-box">
//           <FaSearch className="search-icon" />

//           <input
//             type="text"
//             placeholder="Search products, orders..."
//           />
//         </div>

//       </div>

//       <div className="admin-header-right">

//         <button className="notification-btn">
//           <FaBell />
//           <span className="notification-count">3</span>
//         </button>

//         <div className="admin-profile">
//           <FaUserCircle className="profile-icon" />

//           <div>
//             <h4>Administrator</h4>
//             <p>Super Admin</p>
//           </div>
//         </div>

//       </div>

//     </header>
//   );
// };

// export default Header;


// import { FaBars, FaBell, FaUserCircle } from "react-icons/fa";

// import "../styles/admin-header.css";

// interface HeaderProps {
//   sidebarOpen: boolean;
//   setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
// }

// const Header = ({
//   sidebarOpen,
//   setSidebarOpen,
// }: HeaderProps) => {
//   return (
//     <header className="admin-header">

//       {/* ==========================================
//           LEFT
//       ========================================== */}

//       <div className="admin-header-left">

//         {/* Mobile Menu */}
//         <button
//           type="button"
//           className="menu-btn"
//           onClick={() => setSidebarOpen(!sidebarOpen)}
//           aria-label="Toggle sidebar"
//         >
//           <FaBars />
//         </button>

//       </div>


//       {/* ==========================================
//           RIGHT
//       ========================================== */}

//       <div className="admin-header-right">

//         {/* Notification */}
//         <button
//           type="button"
//           className="notification-btn"
//           aria-label="Notifications"
//         >
//           <FaBell />

//           <span className="notification-count">
//             3
//           </span>
//         </button>


//         {/* Admin Profile */}
//         <div className="admin-profile">

//           <FaUserCircle className="profile-icon" />

//           <div className="profile-info">
//             <h4>Administrator</h4>
//             <p>Super Admin</p>
//           </div>

//         </div>

//       </div>

//     </header>
//   );
// };

// export default Header;


import {
  FaBars,
  FaBell,
  FaUserCircle,
} from "react-icons/fa";

import "../styles/admin-header.css";

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >;
}

const Header = ({
  sidebarOpen,
  setSidebarOpen,
}: HeaderProps) => {
  return (
    <header className="admin-header">

      {/* ==========================================
          LEFT
      ========================================== */}

      <div className="admin-header-left">

        <button
          className="menu-btn"
          onClick={() =>
            setSidebarOpen(!sidebarOpen)
          }
          aria-label="Toggle menu"
        >
          <FaBars />
        </button>

      </div>


      {/* ==========================================
          RIGHT
      ========================================== */}

      <div className="admin-header-right">

        {/* Notification */}

        {/* <button
          className="notification-btn"
          aria-label="Notifications"
        >
          <FaBell />

          <span className="notification-count">
            3
          </span>
        </button> */}


        {/* Admin Profile */}

        <div className="admin-profile">

          <FaUserCircle className="profile-icon" />

          <div className="profile-info">

            <h4>
              Administrator
            </h4>

            <p>
              Super Admin
            </p>

          </div>

        </div>

      </div>

    </header>
  );
};

export default Header;