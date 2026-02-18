const CURRENT_YEAR = new Date().getFullYear();
const LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Login", href: "/login" },
  { label: "Privacy", href: "https://christuniversity.in/privacy-policy" },
  { label: "Support Email", href: "mailto:mail@christuniversity.in" },
];

export function Footer() {
  return (
    <footer className="section-pad mt-8 border-t border-gray-200 pb-10 pt-8 dark:border-gray-800 md:mt-10">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col gap-7 md:flex-row md:items-start md:justify-between">
          <div className="max-w-md">
            <a href="/" className="text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-100">
              UniFAQ AI
            </a>
            <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
              Source-backed answers for admissions, academics, exams, fees, and
              campus services.
            </p>
          </div>

          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 md:justify-end">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : "_self"}
                className="text-sm font-medium text-gray-700 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-7 border-t border-gray-200 pt-5 text-center text-sm font-normal text-gray-600 dark:border-gray-800 dark:text-gray-400">
        &copy; {CURRENT_YEAR} UniFAQ AI. Built for university students.
      </p>
      </div>
    </footer>
  );
}

export default Footer;
