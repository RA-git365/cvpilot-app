export default function Navbar({
  dark,
  setDark,
  theme,
}) {
  return (
    <nav
      style={{
        display: "flex",
        justifyContent:
          "space-between",
        alignItems: "center",
        padding: 18,
        borderRadius: 20,
        background:
          theme.card,
        border: `1px solid ${theme.border}`,
      }}
    >
      <h2
        style={{
          margin: 0,
          fontWeight: 800,
        }}
      >
        CVPilot 🚀
      </h2>

      <button
        onClick={() =>
          setDark(!dark)
        }
        style={{
          padding:
            "10px 16px",
          borderRadius: 12,
          border: "none",
          cursor:
            "pointer",
          fontWeight: 700,
        }}
      >
        {dark
          ? "☀ Light"
          : "🌙 Dark"}
      </button>
    </nav>
  );
}