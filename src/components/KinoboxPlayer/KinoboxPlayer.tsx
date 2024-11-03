import React, { useEffect, useRef } from "react";
import { Player } from "./KinoboxPlayer.styles";

interface Props {
  kpId: number;
}

function KinoboxPlayer({ kpId }: Props) {
  const containerRef = useRef(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://kinobox.tv/kinobox.min.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (containerRef.current) {
        (window as any).kbox(containerRef.current, {
          search: { kinopoisk: kpId },
          menu: {
            enabled: false,
          }
        });
      }
    };

    return () => {
      try {
        document.body.removeChild(script);
      } catch (e) {}
    };
  }, [kpId]);

  return <Player style={{height: '500px'}} ref={containerRef} className="kinobox_player"></Player>;
}

export default KinoboxPlayer;