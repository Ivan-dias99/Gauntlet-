// Wave P-39a — plugins page scaffold. Catálogo + custom plugins. P-44.

export default function PluginsPage() {
  return (
    <section
      data-page="plugins"
      style={{ padding: "var(--space-6)", maxWidth: 1080, margin: "0 auto" }}
    >
      <h2 style={{ fontFamily: "var(--serif)", fontSize: "var(--t-title)", margin: 0 }}>
        plugins
      </h2>
      <p className="kicker" data-tone="ghost">catálogo + custom upload — P-44</p>
    </section>
  );
}
