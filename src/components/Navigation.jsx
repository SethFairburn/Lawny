function Navigation({ activePage, setActivePage }) {
  const pages = [
    "dashboard",
    "watering",
    "applications",
    "products",
    "equipment",
  ];

  return (
    <nav className="navigation">
      {pages.map((page) => (
        <button
          key={page}
          className={activePage === page ? "nav-button active" : "nav-button"}
          onClick={() => setActivePage(page)}
        >
          {page}
        </button>
      ))}
    </nav>
  );
}

export default Navigation;
