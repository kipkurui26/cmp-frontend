import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  HomeIcon,
  DocumentTextIcon,
  UserIcon,
  Cog6ToothIcon,
  BuildingOfficeIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ChartBarIcon,
  ArchiveBoxIcon
} from "@heroicons/react/24/outline";
import { GiCoffeeBeans } from "react-icons/gi";


const Sidebar = ({ isOpen }) => {
  const location = useLocation();
  const { user } = useAuth();
  const [isSocietyMenuOpen, setIsSocietyMenuOpen] = useState(false);

  const isAdmin = user?.role === "ADMIN";
  const isManager = user?.managed_society !== null;

  const farmerMenuItems = [
    { name: "Dashboard", icon: HomeIcon, path: "/" },
    { name: "Permits", icon: DocumentTextIcon, path: "/permits" },
    { name: "Analytics & Reports", icon: ChartBarIcon, path: "/analytics" },
    // { name: "Profile", icon: UserIcon, path: "/profile" },
  ];

  // Add society management menu items for farmers who are managers
  if (isManager) {
    farmerMenuItems.splice(2, 0, {
      name: "Society Management",
      icon: BuildingOfficeIcon,
      submenu: [
        { name: "Factories", path: "/factories" },
        { name: "Society Profile", path: "/profile" },
      ],
    });
  }

  const adminMenuItems = [
    { name: "Dashboard", icon: HomeIcon, path: "/admin" },
    { name: "Permits", icon: DocumentTextIcon, path: "/admin/permits" },
    { name: "Societies", icon: BuildingOfficeIcon, path: "/admin/societies" },
    { name: "Warehouses", icon: ArchiveBoxIcon, path: "/admin/warehouses" },
    { name: "Coffee Grades", icon: GiCoffeeBeans, path: "/admin/coffee-grades" },
    { name: "Analytics & Reports", icon: ChartBarIcon, path: "/admin/analytics" },
    { name: "Settings", icon: Cog6ToothIcon, path: "/admin/settings" },
  ];

  const menuItems = isAdmin ? adminMenuItems : farmerMenuItems;

  const renderMenuItem = (item) => {
    const isActive = location.pathname.startsWith(item.path);

    if (item.submenu) {
      return (
        <div key={item.name}>
          <button
            onClick={() => setIsSocietyMenuOpen(!isSocietyMenuOpen)}
            className={`w-full group relative flex items-center py-2 text-sm font-medium rounded-md
              ${
                isActive
                  ? "bg-amber-50 text-amber-700"
                  : "text-black hover:bg-amber-50 hover:text-black"
              }
              ${!isOpen ? "justify-center" : "px-2"}
            `}
          >
            <item.icon
              className={`flex-shrink-0 h-6 w-6
                ${isOpen ? 'mr-3' : ''}
                ${
                  isActive
                    ? "text-amber-600"
                    : "text-black group-hover:text-amber-500"
                }
              `}
            />
            {isOpen && (
              <span className="flex-1 flex justify-between items-center whitespace-nowrap overflow-hidden">
                {item.name}
                {isSocietyMenuOpen ? (
                  <ChevronUpIcon className="h-4 w-4 ml-2" />
                ) : (
                  <ChevronDownIcon className="h-4 w-4 ml-2" />
                )}
              </span>
            )}

            {!isOpen && (
              <span className="group-hover:opacity-100 transition-opacity bg-amber-800 text-white text-xs rounded py-1 px-2 absolute left-full ml-4 top-1/2 transform -translate-y-1/2 opacity-0 z-10 whitespace-nowrap pointer-events-none">
                {item.name}
              </span>
            )}
          </button>

          {isOpen && isSocietyMenuOpen && (
            <div className="ml-8 mt-1 space-y-1">
              {item.submenu.map((subItem) => {
                const isSubActive = location.pathname === subItem.path;
                return (
                  <Link
                    key={subItem.name}
                    to={subItem.path}
                    className={`block py-2 px-3 text-sm font-medium rounded-md
                      ${
                        isSubActive
                          ? "bg-amber-50 text-amber-700"
                          : "text-gray-600 hover:bg-amber-50 hover:text-amber-700"
                      }
                    `}
                  >
                    {subItem.name}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.name}
        to={item.path}
        className={`group relative flex items-center py-2 text-sm font-medium rounded-md
        ${
          isActive
            ? "bg-amber-50 text-amber-700"
            : "text-black hover:bg-amber-50 hover:text-black"
        }
          ${!isOpen ? "justify-center" : "px-2"}
        `}
      >
        <item.icon
          className={`flex-shrink-0 h-6 w-6
            ${isOpen ? "mr-3" : ""}
            ${
              isActive
                ? "text-amber-600"
                : "text-black group-hover:text-amber-500"
            }
          `}
        />
        {isOpen && (
          <span className="whitespace-nowrap overflow-hidden">{item.name}</span>
        )}

        {!isOpen && (
          <span className="group-hover:opacity-100 transition-opacity bg-amber-800 text-white text-xs rounded py-1 px-2 absolute left-full ml-4 top-1/2 transform -translate-y-1/2 opacity-0 z-10 whitespace-nowrap pointer-events-none">
            {item.name}
          </span>
        )}
      </Link>
    );
  };

  return (
    <div
      className={`sticky top-16 h-[calc(100vh-4rem)] bg-white border-r border-amber-200 transform transition-transform duration-200 ease-in-out
        ${isOpen ? "w-64" : "w-20"}
        lg:translate-x-0
      `}
    >
      <div className="h-16 flex items-center border-b border-amber-200 px-4">
        <div
          className={`flex items-center ${
            isOpen ? "justify-start" : "justify-center w-full"
          }`}
        >
          <GiCoffeeBeans className="h-8 w-8 text-amber-600 flex-shrink-0" />
          {isOpen && (
            <span className="ml-2 text-xl font-semibold text-amber-900 whitespace-nowrap overflow-hidden">
              {isAdmin
                ? "Admin Panel"
                : isManager
                ? "Society Manager"
                : "Farmer Portal"}
            </span>
          )}
          {!isOpen && (
            <span className="ml-2 text-xl font-semibold text-amber-900 whitespace-nowrap overflow-hidden hidden lg:block">
              {isAdmin ? "Admin" : isManager ? "Manager" : "Farmer"}
            </span>
          )}
        </div>
      </div>

      <nav className="mt-5 flex flex-col space-y-1 px-2">
        {menuItems.map(renderMenuItem)}
      </nav>
    </div>
  );
};

export default Sidebar;
