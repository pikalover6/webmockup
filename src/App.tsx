import { useEffect, useState } from "react";
import Wordmark from "./Wordmark";

type Item = { label: string; href: string; children?: { label: string; href: string }[] };

// This mockup only covers the home page; page links go to the live lab site.
const SITE = "https://pages.uoregon.edu/libudalab/";
const resolve = (href: string) => (href.startsWith("#") || href.includes("://") ? href : SITE + href);

const NAV: Item[] = [
  { label: "Home", href: "#" },
  { label: "Research", href: "research.html" },
  {
    label: "People",
    href: "people.html",
    children: [
      { label: "Current Members", href: "people.html" },
      { label: "Alumni", href: "people.html#alumnilocation" },
      { label: "Lab Photos", href: "labPhotos.html" },
    ],
  },
  { label: "Publications", href: "publications.html" },
  {
    label: "Resources",
    href: "pa-resources.html",
    children: [
      { label: "Publication-associated Resources", href: "pa-resources.html" },
      { label: "GitHub", href: "https://github.com/libudalab" },
      { label: "Living in Eugene, OR", href: "eugIsAwesome.html" },
    ],
  },
  { label: "Social / News", href: "news.html" },
  {
    label: "Openings",
    href: "openings.html",
    children: [
      { label: "Positions", href: "openings.html" },
      { label: "Living in Eugene, OR", href: "eugIsAwesome.html" },
    ],
  },
  { label: "Contact", href: "contact.html" },
];

function useTouchLayout() {
  const q = "(hover: none), (max-width: 700px)";
  const [touch, setTouch] = useState(() => window.matchMedia(q).matches);
  useEffect(() => {
    const m = window.matchMedia(q);
    const on = () => setTouch(m.matches);
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, []);
  return touch;
}

export default function App() {
  const touch = useTouchLayout();
  const [open, setOpen] = useState<string | null>(null);

  // an expanded list closes when the layout changes or when tapping anywhere outside it
  useEffect(() => setOpen(null), [touch]);
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!(e.target as Element).closest(".nav-item.open")) setOpen(null);
    };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, [open]);

  return (
    <div className="page">
      <header className="masthead">
        <Wordmark />
        <p className="affil">
          <a href="http://biology.uoregon.edu/">Department of Biology</a>
          <span className="sep">|</span>
          <a href="http://molbio.uoregon.edu/">Institute of Molecular Biology</a>
          <span className="sep">|</span>
          <a className="uo" href="http://uoregon.edu/">University of Oregon</a>
        </p>
      </header>

      <figure className="specimen">
        {/* the gif is untouched; CSS crops the top 8% to hide the baked-in "N min" counter */}
        <img src="./herm.gif" alt="Live imaging of a C. elegans hermaphrodite germline" />
      </figure>

      <nav className="nav" aria-label="Primary">
        {NAV.map((item, i) => (
          <div key={item.label} className={"nav-item" + (i === 0 ? " active" : "") + (open === item.label ? " open" : "")}>
            <a
              href={resolve(item.href)}
              aria-expanded={item.children ? open === item.label : undefined}
              onClick={(e) => {
                // on touch layouts the parent link toggles its list instead of navigating
                if (item.children && touch) {
                  e.preventDefault();
                  setOpen((o) => (o === item.label ? null : item.label));
                }
              }}
            >
              {item.label}
              {item.children && <span className="caret">▼</span>}
            </a>
            {item.children && (
              <div className="menu">
                {item.children.map((c) => (
                  <a key={c.label} href={resolve(c.href)}>
                    {c.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
}
