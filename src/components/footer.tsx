import { Typography } from "@material-tailwind/react";

const CURRENT_YEAR = new Date().getFullYear();
const LINKS = [
  { label: "Privacy", href: "https://christuniversity.in/privacy-policy" },
  { label: "Accessibility", href: "https://christuniversity.in/" },
  { label: "Support", href: "mailto:mail@christuniversity.in" },
  { label: "Status", href: "https://christuniversity.in/news" },
  { label: "Contact", href: "mailto:mail@christuniversity.in" },
];

export function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 section-pad">
      <div className="container mx-auto flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
        <div>
          <Typography
            as="a"
            href="#home"
            variant="h6"
            className="text-gray-900 dark:text-gray-100"
          >
            UniFAQ AI
          </Typography>
          <Typography className="mt-2 !text-gray-600 dark:!text-gray-300" variant="small">
            Simple, verified answers for university students.
          </Typography>
        </div>
        <ul className="flex flex-wrap items-center gap-4">
          {LINKS.map((link) => (
            <li key={link.href}>
              <Typography
                as="a"
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : "_self"}
                variant="small"
                color="white"
                className="font-normal !text-gray-700 hover:!text-gray-900 dark:!text-gray-300 dark:hover:!text-gray-100 transition-colors"
              >
                {link.label}
              </Typography>
            </li>
          ))}
        </ul>
      </div>
      <Typography
        color="blue-gray"
        className="text-center mt-8 font-normal !text-gray-600 dark:!text-gray-400"
      >
        &copy; {CURRENT_YEAR} UniFAQ AI. Built for university students.
      </Typography>
    </footer>
  );
}

export default Footer;
