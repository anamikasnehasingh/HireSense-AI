import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  BrainCircuit,
  FileText,
  BriefcaseBusiness,
  Gauge,
  History,
  LogOut,
} from "lucide-react";

const links = [
  ["/dashboard", "Dashboard", Gauge],
  ["/resumes", "Resumes", FileText],
  ["/jobs", "Jobs", BriefcaseBusiness],
  ["/history", "History", History],
] as const;

export default function Layout() {
  const nav = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("hiresense_token");
    nav("/login");
  };

  return (
    <div className="min-h-screen md:flex bg-[#FEEBE4] text-[#1E1E1E]">

      {/* ================= SIDEBAR ================= */}
      <aside
        className="
          w-full md:w-64
          md:min-h-screen
          shrink-0
          border-r border-[#E8D8D0]
          bg-[#FFF7F3]
          px-4 py-5 md:px-5
          flex flex-col
        "
      >

        {/* Logo */}
        <div className="px-2">

          <div className="flex items-center gap-2.5">
            <div
              className="
                flex h-10 w-10 items-center justify-center
                rounded-xl
                bg-[#F4512C]
                text-white
                shadow-sm
              "
            >
              <BrainCircuit size={22} strokeWidth={2.2} />
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-tight text-[#1E1E1E]">
                HireSense AI
              </h1>
            </div>
          </div>

          <p className="mt-2 text-xs leading-5 text-[#756B66]">
            Resume intelligence, explained.
          </p>

        </div>

        {/* Navigation */}
        <nav className="mt-8 flex flex-col gap-1.5">

          {links.map(([to, name, Icon]) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `
                group flex items-center gap-3
                rounded-xl
                px-3 py-3
                text-sm font-medium
                transition-all duration-200
                ${
                  isActive
                    ? `
                      bg-[#FFD6C3]
                      text-[#C63E21]
                      shadow-sm
                    `
                    : `
                      text-[#514944]
                      hover:bg-[#FFF0EA]
                      hover:text-[#F4512C]
                    `
                }
                `
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={19}
                    strokeWidth={isActive ? 2.4 : 2}
                    className={
                      isActive
                        ? "text-[#F4512C]"
                        : "text-[#756B66] group-hover:text-[#F4512C]"
                    }
                  />

                  <span>{name}</span>

                  {isActive && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#F4512C]" />
                  )}
                </>
              )}
            </NavLink>
          ))}

        </nav>

        {/* Bottom section */}
        <div className="mt-auto pt-8">

          <div className="mb-4 border-t border-[#E8D8D0]" />

          <button
            onClick={handleLogout}
            className="
              group flex w-full items-center gap-3
              rounded-xl
              px-3 py-3
              text-sm font-medium
              text-[#756B66]
              transition-all duration-200
              hover:bg-[#FFF0EA]
              hover:text-[#D6452A]
            "
          >
            <LogOut
              size={19}
              className="
                text-[#756B66]
                transition-colors
                group-hover:text-[#D6452A]
              "
            />

            <span>Logout</span>
          </button>

        </div>

      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="min-w-0 flex-1 bg-transparent p-5 md:p-8">
        <Outlet />
      </main>

    </div>
  );
}