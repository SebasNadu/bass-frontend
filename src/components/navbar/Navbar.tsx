import { useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Input,
  NavbarMenuToggle,
  Button,
  NavbarMenu,
  NavbarMenuItem,
} from "@heroui/react";
import { useAuth } from "@/hooks/useAuth";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { SearchIcon } from "./SearchIcon";

export default function AppNavbar() {
  const [query, setQuery] = useState("");
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const links = [
    { name: "Home", path: "/home" },
    { name: "Profile", path: "/profile" },
    { name: "Cart", path: "/cart" },
  ];

  return (
    <Navbar isBordered className="h-16">
      {/* Left (mobile toggle) */}
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle />
      </NavbarContent>

      {/* Brand (mobile) */}
      <NavbarContent className="sm:hidden pr-3" justify="center">
        <NavbarBrand>
          <h3 className="font-bold text-inherit">BASS</h3>
        </NavbarBrand>
      </NavbarContent>

      {/* Desktop menu */}
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarBrand>
          <h3 className="font-bold text-inherit">BASS</h3>
        </NavbarBrand>

        {links.map((link) => (
          <NavbarItem
            key={link.path}
            isActive={location.pathname === link.path}
          >
            <NavLink
              to={link.path}
              className={({ isActive }) =>
                `px-2 ${
                  isActive ? "text-pink-600 font-semibold" : "text-foreground"
                }`
              }
            >
              {link.name}
            </NavLink>
          </NavbarItem>
        ))}
      </NavbarContent>

      {/* Right side */}
      <NavbarContent justify="end">
        <Input
          classNames={{
            base: "max-w-full sm:max-w-[10rem] h-10",
            mainWrapper: "h-full",
            input: "text-small",
            inputWrapper:
              "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
          }}
          placeholder="AI Search..."
          size="sm"
          startContent={<SearchIcon size={18} />}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        {isAuthenticated ? (
          <Button
            key="logout"
            variant="ghost"
            color="danger"
            onPress={handleLogout}
          >
            Log Out
          </Button>
        ) : (
          <NavLink to="/login" className="text-secondary">
            <Button key="login" variant="ghost" color="success">
              Login
            </Button>
          </NavLink>
        )}
      </NavbarContent>

      {/* Mobile menu */}
      <NavbarMenu>
        {links.map((link) => (
          <NavbarMenuItem key={link.path}>
            <NavLink
              to={link.path}
              className={({ isActive }) =>
                `w-full text-lg ${
                  isActive ? "text-pink-600 font-semibold" : "text-foreground"
                }`
              }
            >
              {link.name}
            </NavLink>
          </NavbarMenuItem>
        ))}
        {isAuthenticated && (
          <NavbarMenuItem>
            <Button
              color="danger"
              variant="ghost"
              onPress={handleLogout}
              className="w-full"
            >
              Log Out
            </Button>
          </NavbarMenuItem>
        )}
      </NavbarMenu>
    </Navbar>
  );
}
