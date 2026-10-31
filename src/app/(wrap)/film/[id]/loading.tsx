/**
 * Каркас страницы фильма.
 *
 * Next.js показывает этот файл сразу после клика по карточке, ещё до загрузки
 * данных с TMDB. Без него страница «замирает» на месте, и кажется, что клик
 * не сработал — особенно на медленном интернете.
 */
const Line = ({ width }: { width: string }) => (
  <div
    style={{
      width,
      height: 18,
      borderRadius: 6,
      background: "rgba(255, 255, 255, 0.07)",
      marginBottom: 12,
    }}
  />
);

export default function LoadingFilm() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0b0b0b",
        padding: "120px 24px 80px",
        maxWidth: 1440,
        margin: "0 auto",
        boxSizing: "border-box",
      }}
    >
      <div style={{ display: "flex", gap: 40, alignItems: "flex-start", flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 480px", minWidth: 280 }}>
          {/* название */}
          <div
            style={{
              width: "min(520px, 80%)",
              height: 46,
              borderRadius: 8,
              background: "rgba(255, 255, 255, 0.09)",
              marginBottom: 18,
            }}
          />
          <Line width="min(360px, 60%)" />
          {/* кнопки */}
          <div style={{ display: "flex", gap: 12, marginTop: 26, marginBottom: 26 }}>
            <div style={{ width: 150, height: 46, borderRadius: 8, background: "rgba(255, 255, 255, 0.13)" }} />
            <div style={{ width: 130, height: 46, borderRadius: 8, background: "rgba(255, 255, 255, 0.07)" }} />
          </div>
          {/* описание */}
          <Line width="100%" />
          <Line width="92%" />
          <Line width="86%" />
          <Line width="40%" />
        </div>

        {/* постер */}
        <div
          style={{
            width: 280,
            height: 420,
            borderRadius: 16,
            background: "rgba(255, 255, 255, 0.06)",
            flex: "0 0 auto",
          }}
        />
      </div>

      {/* блок плеера */}
      <div
        style={{
          marginTop: 40,
          width: "100%",
          height: 380,
          borderRadius: 16,
          background: "rgba(255, 255, 255, 0.05)",
        }}
      />
    </main>
  );
}
