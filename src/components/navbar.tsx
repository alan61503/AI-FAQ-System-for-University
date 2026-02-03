import React from "react";
import {
  Navbar as MTNavbar,
  Collapse,
  Button,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import { XMarkIcon, Bars3Icon, SunIcon, MoonIcon } from "@heroicons/react/24/solid";

const NAV_MENU = [
  { name: "Home", href: "#home" },
  { name: "Categories", href: "#categories" },
  { name: "How it works", href: "#how-it-works" },
];

interface NavItemProps {
  children: React.ReactNode;
  href?: string;
}

function NavItem({ children, href }: NavItemProps) {
  const isExternal = href?.startsWith("http");
  return (
    <li>
      <Typography
        as="a"
        href={href || "#"}
        target={isExternal ? "_blank" : "_self"}
        variant="paragraph"
        color="gray"
        className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 transition-colors"
      >
        {children}
      </Typography>
    </li>
  );
}

export function Navbar() {
  const [open, setOpen] = React.useState(false);
  const [isDark, setIsDark] = React.useState(false);

  const handleAsk = () => {
    const input = document.getElementById("faq-question");
    input?.scrollIntoView({ behavior: "smooth", block: "center" });
    if (input instanceof HTMLInputElement) {
      input.focus();
    }
    setOpen(false);
  };

  const handleOpen = () => setOpen((cur) => !cur);

  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpen(false)
    );
  }, []);

  React.useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldUseDark = stored ? stored === "dark" : prefersDark;
    document.documentElement.classList.toggle("dark", shouldUseDark);
    setIsDark(shouldUseDark);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <MTNavbar shadow={false} fullWidth className="border-0 sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto flex items-center justify-between py-3">
        <Typography
          as="a"
          href="#home"
          color="blue-gray"
          className="text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-100"
        >
          UniFAQ AI
        </Typography>
        <ul className="ml-8 hidden items-center gap-6 lg:flex">
          {NAV_MENU.map(({ name, href }) => (
            <NavItem key={name} href={href}>
              {name}
            </NavItem>
          ))}
        </ul>
        <div className="hidden items-center gap-2 lg:flex">
          <IconButton
            variant="text"
            color="gray"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {isDark ? (
              <SunIcon className="h-5 w-5 text-gray-200" />
            ) : (
              <MoonIcon className="h-5 w-5 text-gray-700" />
            )}
          </IconButton>
          <Button
            as="a"
            href="mailto:mail@christuniversity.in"
            variant="text"
            className="text-sm"
          >
            Admin Login
          </Button>
          <Button
            color="gray"
            onClick={handleAsk}
            className="shadow-none text-sm px-4"
          >
            Ask a Question
          </Button>
        </div>
        <IconButton
          variant="text"
          color="gray"
          onClick={handleOpen}
          className="ml-auto inline-block lg:hidden"
        >
          {open ? (
            <XMarkIcon strokeWidth={2} className="h-6 w-6" />
          ) : (
            <Bars3Icon strokeWidth={2} className="h-6 w-6" />
          )}
        </IconButton>
      </div>
      <Collapse open={open}>
        <div className="container mx-auto mt-3 border-t border-gray-200 px-2 pt-4">
          <ul className="flex flex-col gap-4">
            {NAV_MENU.map(({ name, href }) => (
              <NavItem key={name} href={href}>
                {name}
              </NavItem>
            ))}
          </ul>
          <div className="mt-6 mb-4 flex items-center gap-2">
            <IconButton
              variant="text"
              color="gray"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <SunIcon className="h-5 w-5 text-gray-200" />
              ) : (
                <MoonIcon className="h-5 w-5 text-gray-700" />
              )}
            </IconButton>
            <Button
              as="a"
              href="mailto:mail@christuniversity.in"
              variant="text"
            >
              Admin Login
            </Button>
            <Button color="gray" onClick={handleAsk}>
              Ask a Question
            </Button>
          </div>
        </div>
      </Collapse>
    </MTNavbar>
  );
}

export default Navbar;
