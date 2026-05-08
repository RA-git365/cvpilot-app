export default function Navbar({ dark, setDark }) {
  const links = [
    ["Flow", "#flow"],
    ["Templates", "#templates"],
    ["Pricing", "#pricing"],
    ["Builder", "#builder"],
  ];

  return (
    <nav className="cvp-navbar">
      <a href="#top" className="cvp-brand" aria-label="CVPilot home">
        <span>CV</span>Pilot
      </a>

      <div className="cvp-nav-links">
        {links.map(([label, href]) => (
          <a key={href} href={href}>
            {label}
          </a>
        ))}
      </div>

      <div className="cvp-nav-actions">
        <button className="cvp-theme-toggle" onClick={() => setDark(!dark)}>
          {dark ? "Light" : "Dark"}
        </button>
        <a className="cvp-nav-cta" href="#builder">
          Analyze My CV
        </a>
      </div>
    </nav>
  );
}
