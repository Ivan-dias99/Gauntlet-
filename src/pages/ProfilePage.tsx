// Wave P-39a — profile page scaffold. Real content in P-43.

export default function ProfilePage() {
  return (
    <section
      data-page="profile"
      style={{
        padding: "var(--space-6)",
        maxWidth: 720,
        margin: "0 auto",
      }}
    >
      <h2
        style={{
          fontFamily: "var(--serif)",
          fontSize: "var(--t-title)",
          margin: 0,
        }}
      >
        perfil
      </h2>
      <p className="kicker" data-tone="ghost">
        operador · estatísticas · histórico — P-43
      </p>
    </section>
  );
}
