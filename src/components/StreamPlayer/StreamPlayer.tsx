"use client";

/**
 * Плеер Filmhub для конкретного фильма: показывает варианты качества и озвучки
 * из реестра ссылок (src/data/streams.ts) и отдаёт выбранный вариант нашему
 * плееру. Никаких iframe и чужого интерфейса.
 */

import React, { useMemo, useState } from "react";
import styled from "styled-components";
import Player, { PlayerSource } from "@/components/Player/Player";
import type { FilmStreams } from "@/data/streams";

type Props = {
  filmId: string | number;
  streams: FilmStreams;
  poster?: string | null;
};

const Wrapper = styled.div`
  width: 100%;
`;

const Variants = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 10px;
`;

const Variant = styled.button<{ $active: boolean }>`
  background: ${(props) => (props.$active ? "#d41515" : "#161616")};
  border: 1px solid ${(props) => (props.$active ? "#d41515" : "#333")};
  color: #fff;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 12px;
  cursor: pointer;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: #777;
  }
`;

const VariantLabel = styled.span`
  display: block;
  font-size: 11px;
  opacity: 0.7;
  margin-top: 2px;
`;

const StreamPlayer: React.FC<Props> = ({ filmId, streams, poster }) => {
  const [selected, setSelected] = useState(0);

  const variants = streams.variants;
  const active = variants[Math.min(selected, variants.length - 1)];

  const source: PlayerSource = useMemo(
    () => ({
      id: `${filmId}-${selected}`,
      name: active?.title || streams.title || `Фильм ${filmId}`,
      src: active?.url || "",
      poster: streams.poster || poster || null,
      type: active?.type,
      headers: active?.headers,
      note: active?.quality || undefined,
    }),
    [active, filmId, poster, selected, streams.title]
  );

  // если вариант один и подписей нет — селектор не нужен
  const showVariants =
    variants.length > 1 && variants.some((variant) => variant.quality || variant.audio);

  return (
    <Wrapper>
      {showVariants && (
        <Variants>
          {variants.map((variant, index) => (
            <Variant
              key={`${variant.url}-${index}`}
              $active={index === selected}
              onClick={() => setSelected(index)}
              type="button"
            >
              {variant.quality || `Вариант ${index + 1}`}
              {variant.audio ? <VariantLabel>{variant.audio}</VariantLabel> : null}
            </Variant>
          ))}
        </Variants>
      )}

      {active?.url ? <Player source={source} /> : null}
    </Wrapper>
  );
};

export default StreamPlayer;
