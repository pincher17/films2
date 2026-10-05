"use client";

/**
 * Плеер на hls.js.
 *
 * Умеет: HLS (адаптивный битрейт) с ручным выбором качества, MP4, пауза/перемотка,
 * буфер, громкость, скорость, полный экран, Picture-in-Picture, горячие клавиши,
 * запоминание позиции просмотра и повторный запуск при ошибке.
 *
 * Источник видео задаётся объектом PlayerSource — то есть плеер не привязан
 * к какому-то одному сервису.
 */

import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { detectStreamFormat } from "./streamFormat";
import { loadWatchPosition, saveWatchPosition } from "@/api/watchPosition";

export type PlayerSource = {
  id: string;
  name: string;
  year?: number | null;
  /** Готовая ссылка на поток: .m3u8, .mp4, .mpd или без расширения */
  src: string;
  poster?: string | null;
  /** Пометка об источнике/лицензии — необязательна */
  license?: string;
  note?: string;
  /** Тип потока; если не указан — определится автоматически */
  type?: "hls" | "mp4" | "dash";
  /** Заголовки для запросов манифеста и сегментов (поддерживает HLS) */
  headers?: Record<string, string>;
};

type Props = {
  source: PlayerSource;
};

const RED = "#d41515";

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  background: #000;
  border-radius: 8px;
  overflow: hidden;
  user-select: none;
`;

const Video = styled.video`
  display: block;
  width: 100%;
  max-height: 70vh;
  background: #000;
  cursor: pointer;
`;

const Center = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: rgba(0, 0, 0, 0.45);
  font-size: 14px;
  text-align: center;
  padding: 20px;
`;

const Spinner = styled.div`
  width: 42px;
  height: 42px;
  border: 3px solid rgba(255, 255, 255, 0.25);
  border-top-color: ${RED};
  border-radius: 50%;
  animation: spin 0.9s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const Controls = styled.div<{ $visible: boolean }>`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 10px 12px 12px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.85));
  opacity: ${(props) => (props.$visible ? 1 : 0)};
  transition: opacity 0.25s ease;
  pointer-events: ${(props) => (props.$visible ? "auto" : "none")};
`;

const Progress = styled.input`
  width: 100%;
  height: 4px;
  appearance: none;
  background: rgba(255, 255, 255, 0.25);
  border-radius: 2px;
  outline: none;
  cursor: pointer;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: ${RED};
    cursor: pointer;
  }
  &::-moz-range-thumb {
    width: 14px;
    height: 14px;
    border: none;
    border-radius: 50%;
    background: ${RED};
    cursor: pointer;
  }
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 8px;
  color: #fff;
  font-size: 13px;
`;

const Btn = styled.button`
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  font-size: 14px;
  padding: 2px 6px;
  border-radius: 4px;
  line-height: 1.4;

  &:hover {
    background: rgba(255, 255, 255, 0.12);
  }
`;

const Time = styled.span`
  font-variant-numeric: tabular-nums;
  opacity: 0.85;
  white-space: nowrap;
`;

const Spacer = styled.div`
  flex: 1;
`;

const Select = styled.select`
  background: #141414;
  color: #fff;
  border: 1px solid #333;
  border-radius: 4px;
  padding: 3px 6px;
  font-size: 12px;
  cursor: pointer;
`;

const BtnPrimary = styled.button`
  background: ${RED};
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 13px;
  cursor: pointer;
`;

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const total = Math.floor(seconds);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return h
    ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
    : `${m}:${String(s).padStart(2, "0")}`;
};

const Player: React.FC<Props> = ({ source }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<any>(null);
  const dashRef = useRef<any>(null);
  const fatalNetworkErrors = useRef(0);
  const hideTimer = useRef<any>(null);
  const [levels, setLevels] = useState<{ index: number; label: string }[]>([]);
  const [currentLevel, setCurrentLevel] = useState<number>(-1);
  const [playing, setPlaying] = useState(false);
  const [waiting, setWaiting] = useState(true);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resumeAt, setResumeAt] = useState<number | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [format, setFormat] = useState<string>("");

  const storageKey = `player:pos:${source.id}`;

  const showControls = useCallback(() => {
    setControlsVisible(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setControlsVisible(false), 3000);
  }, []);

  // подключение источника
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let disposed = false;
    setError(null);
    setLevels([]);
    setCurrentLevel(-1);
    setResumeAt(null);
    setWaiting(true);

    const saved = Number(localStorage.getItem(storageKey) || 0);
    const startAt = saved > 15 ? saved : 0;

    const attach = async () => {
      const detected = await detectStreamFormat(source.src, source.type);
      if (disposed) return;
      setFormat(detected);
      fatalNetworkErrors.current = 0;

      // DASH — подключаем dash.js только когда он реально нужен
      if (detected === "dash") {
        // типы dash.js не описывают default-экспорт, поэтому берём модуль как есть
        const dashModule: any = await import("dashjs");
        const dashjs = dashModule.default ?? dashModule;
        if (disposed) return;

        const player = dashjs.MediaPlayer().create();
        dashRef.current = player;

        video.addEventListener(
          "loadedmetadata",
          () => {
            if (startAt) {
              video.currentTime = startAt;
              setResumeAt(startAt);
            }
          },
          { once: true }
        );

        player.initialize(video, source.src, true);
        return;
      }

      const nativeHls = video.canPlayType("application/vnd.apple.mpegurl");

      if (detected === "hls" && !nativeHls) {
        const Hls = (await import("hls.js")).default;
        if (disposed) return;

        if (!Hls.isSupported()) {
          setError("Браузер не поддерживает воспроизведение HLS");
          return;
        }

        const headers = source.headers || {};
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: false,
          // заголовки источника (Referer/User-Agent и т.п.)
          xhrSetup: (xhr: XMLHttpRequest) => {
            Object.entries(headers).forEach(([name, value]) => {
              try {
                xhr.setRequestHeader(name, String(value));
              } catch {
                undefined;
              }
            });
          },
        });
        hlsRef.current = hls;
        hls.loadSource(source.src);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          setLevels(
            (hls.levels || [])
              .map((level: any, index: number) => ({
                index,
                label: level.height ? `${level.height}p` : `${Math.round((level.bitrate || 0) / 1000)} kbps`,
              }))
              .reverse()
          );
          if (startAt) {
            video.currentTime = startAt;
            setResumeAt(startAt);
          }
          video.play().catch(() => undefined);
        });

        hls.on(Hls.Events.LEVEL_SWITCHED, (_event: any, data: any) => {
          setCurrentLevel(hls.autoLevelEnabled ? -1 : data.level);
        });

        hls.on(Hls.Events.ERROR, (_event: any, data: any) => {
          if (!data?.fatal) return;

          if (data.type === "networkError") {
            fatalNetworkErrors.current += 1;
            if (fatalNetworkErrors.current === 1) {
              hls.startLoad();
              return;
            }
            setError(
              "Поток недоступен: сервер не отдаёт CORS-заголовки либо требует Referer/User-Agent. " +
                "Для HLS нужен серверный прокси — укажи headers у варианта или играй MP4."
            );
            return;
          }

          setError(`Ошибка воспроизведения: ${data.details || "неизвестная"}`);
        });
      } else {
        // MP4 или нативный HLS (Safari): заголовки задать нельзя, играет как есть
        video.src = source.src;
        const onMeta = () => {
          if (startAt) {
            video.currentTime = startAt;
            setResumeAt(startAt);
          }
        };
        video.addEventListener("loadedmetadata", onMeta, { once: true });
        video.play().catch(() => undefined);
      }
    };

    attach();

    return () => {
      disposed = true;
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      if (dashRef.current) {
        try {
          dashRef.current.reset();
        } catch {
          undefined;
        }
        dashRef.current = null;
      }
      if (videoRef.current && videoRef.current.currentTime > 15) {
        localStorage.setItem(storageKey, String(Math.floor(videoRef.current.currentTime)));
      }
    };
  }, [source.src, source.id, source.type, source.headers, storageKey, attempt]);

  // сохранение позиции
  useEffect(() => {
    const id = setInterval(() => {
      const video = videoRef.current;
      if (video && !video.paused && video.currentTime > 15) {
        localStorage.setItem(storageKey, String(Math.floor(video.currentTime)));
        // время записи нужно, чтобы при входе выбрать более свежую позицию —
        // свою локальную или серверную
        localStorage.setItem(`${storageKey}:at`, String(Date.now()));
      }
    }, 5000);
    return () => clearInterval(id);
  }, [storageKey]);

  // --- синхронизация с сервером ---

  // при открытии: если на сервере позиция свежее локальной — продолжаем с неё
  useEffect(() => {
    if (!source?.id) return;
    let cancelled = false;

    (async () => {
      const remote = await loadWatchPosition({ filmId: Number(source.id) });
      if (cancelled || !remote?.seconds || remote.seconds <= 15) return;

      const localSeconds = Number(localStorage.getItem(storageKey) || 0);
      const localAt = Number(localStorage.getItem(`${storageKey}:at`) || 0);
      const remoteAt = new Date(remote.updatedAt).getTime();

      // побеждает более свежая запись, а не просто большая: иначе устройство,
      // где смотрели неделю назад, откатило бы просмотр назад
      if (localSeconds > remote.seconds && localAt > remoteAt) return;

      localStorage.setItem(storageKey, String(remote.seconds));
      localStorage.setItem(`${storageKey}:at`, String(remoteAt));

      const video = videoRef.current;
      if (video && Math.abs(video.currentTime - remote.seconds) > 5) {
        try {
          video.currentTime = remote.seconds;
          setResumeAt(remote.seconds);
        } catch {
          undefined;
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [source?.id, storageKey]);

  // во время просмотра отправляем позицию нечасто, при закрытии — сразу
  useEffect(() => {
    if (!source?.id) return;
    const filmId = Number(source.id);

    const send = (beacon: boolean) => {
      const video = videoRef.current;
      if (!video || video.currentTime <= 15) return;
      saveWatchPosition({
        filmId,
        seconds: Math.floor(video.currentTime),
        duration: Number.isFinite(video.duration) ? Math.floor(video.duration) : undefined,
        // позиция из нашего плеера точная — помечаем как player
        source: "player",
        beacon,
      });
    };

    const id = setInterval(() => {
      const video = videoRef.current;
      if (video && !video.paused) send(false);
    }, 25000);

    const onHide = () => send(true);
    window.addEventListener("pagehide", onHide);

    return () => {
      clearInterval(id);
      window.removeEventListener("pagehide", onHide);
      send(true);
    };
  }, [source?.id]);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play().catch(() => undefined);
    else video.pause();
  }, []);

  const seekBy = useCallback((delta: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.min(Math.max(0, video.currentTime + delta), video.duration || 0);
  }, []);

  const toggleFullscreen = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else video.parentElement?.requestFullscreen?.();
  }, []);

  const togglePip = useCallback(async () => {
    const video = videoRef.current as any;
    if (!video) return;
    try {
      if (document.pictureInPictureElement) await document.exitPictureInPicture();
      else await video.requestPictureInPicture();
    } catch {
      undefined;
    }
  }, []);

  // горячие клавиши
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (target && ["INPUT", "SELECT", "TEXTAREA"].includes(target.tagName)) return;
      const video = videoRef.current;
      if (!video) return;

      switch (event.key) {
        case " ":
        case "k":
          event.preventDefault();
          togglePlay();
          break;
        case "ArrowRight":
          seekBy(10);
          break;
        case "ArrowLeft":
          seekBy(-10);
          break;
        case "ArrowUp":
          video.volume = Math.min(1, video.volume + 0.1);
          break;
        case "ArrowDown":
          video.volume = Math.max(0, video.volume - 0.1);
          break;
        case "f":
          toggleFullscreen();
          break;
        case "m":
          video.muted = !video.muted;
          break;
        default:
          return;
      }
      showControls();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [seekBy, showControls, toggleFullscreen, togglePlay]);

  const onTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    setPosition(video.currentTime);
    if (video.buffered.length) {
      setBuffered(video.buffered.end(video.buffered.length - 1));
    }
  };

  const bufferedPercent = duration ? Math.min(100, (buffered / duration) * 100) : 0;

  return (
    <Wrapper
      onMouseMove={showControls}
      data-stream-id={source.id}
      data-stream-url={source.src}
      data-stream-format={format || "определяется"}
    >
      <Video
        ref={videoRef}
        poster={source.poster || undefined}
        playsInline
        onClick={togglePlay}
        onPlay={() => {
          setPlaying(true);
          showControls();
        }}
        onPause={() => {
          setPlaying(false);
          setControlsVisible(true);
        }}
        onWaiting={() => setWaiting(true)}
        onPlaying={() => setWaiting(false)}
        onCanPlay={() => setWaiting(false)}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration || 0)}
        onTimeUpdate={onTimeUpdate}
        onEnded={() => {
          setPlaying(false);
          localStorage.removeItem(storageKey);
        }}
        onVolumeChange={(event) => {
          setVolume(event.currentTarget.volume);
          setMuted(event.currentTarget.muted);
        }}
        onError={() => setError("Не удалось загрузить поток")}
      />

      {waiting && !error && (
        <Center>
          <Spinner />
          <span>Буферизация…</span>
        </Center>
      )}

      {error && (
        <Center>
          <span>{error}</span>
          <BtnPrimary
            onClick={() => {
              setError(null);
              setAttempt((value) => value + 1);
            }}
          >
            Повторить
          </BtnPrimary>
        </Center>
      )}

      {resumeAt && !error && (
        <Center style={{ background: "rgba(0,0,0,0.6)" }}>
          <span>Продолжить с {formatTime(resumeAt)}?</span>
          <div style={{ display: "flex", gap: 10 }}>
            <BtnPrimary
              onClick={() => {
                setResumeAt(null);
                videoRef.current?.play().catch(() => undefined);
              }}
            >
              Продолжить
            </BtnPrimary>
            <BtnPrimary
              style={{ background: "#333" }}
              onClick={() => {
                if (videoRef.current) videoRef.current.currentTime = 0;
                localStorage.removeItem(storageKey);
                setResumeAt(null);
                videoRef.current?.play().catch(() => undefined);
              }}
            >
              С начала
            </BtnPrimary>
          </div>
        </Center>
      )}

      <Controls $visible={controlsVisible || !playing}>
        <div style={{ position: "relative" }}>
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              height: 4,
              width: `${bufferedPercent}%`,
              background: "rgba(255,255,255,0.45)",
              borderRadius: 2,
              pointerEvents: "none",
            }}
          />
          <Progress
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={position}
            onChange={(event) => {
              const video = videoRef.current;
              if (!video) return;
              video.currentTime = Number(event.target.value);
              setPosition(Number(event.target.value));
            }}
          />
        </div>

        <Row>
          <Btn onClick={togglePlay} title="Пробел">
            {playing ? "❚❚" : "▶"}
          </Btn>
          <Btn onClick={() => seekBy(-10)} title="−10 сек">↺10</Btn>
          <Btn onClick={() => seekBy(10)} title="+10 сек">10↻</Btn>
          <Time>
            {formatTime(position)} / {formatTime(duration)}
          </Time>
          <Spacer />
          {levels.length > 0 && (
            <Select
              value={currentLevel}
              onChange={(event) => {
                const level = Number(event.target.value);
                setCurrentLevel(level);
                if (hlsRef.current) hlsRef.current.currentLevel = level;
              }}
              title="Качество"
            >
              <option value={-1}>Авто</option>
              {levels.map((level) => (
                <option key={level.index} value={level.index}>
                  {level.label}
                </option>
              ))}
            </Select>
          )}
          <Select
            value={speed}
            onChange={(event) => {
              const value = Number(event.target.value);
              setSpeed(value);
              if (videoRef.current) videoRef.current.playbackRate = value;
            }}
            title="Скорость"
          >
            {[0.5, 0.75, 1, 1.25, 1.5, 2].map((value) => (
              <option key={value} value={value}>
                {value}×
              </option>
            ))}
          </Select>
          <Btn
            title="Громкость"
            onClick={() => {
              const video = videoRef.current;
              if (video) video.muted = !video.muted;
            }}
          >
            {muted || volume === 0 ? "🔇" : "🔊"}
          </Btn>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={muted ? 0 : volume}
            onChange={(event) => {
              const video = videoRef.current;
              if (!video) return;
              video.volume = Number(event.target.value);
              video.muted = false;
            }}
            style={{ width: 80 }}
          />
          <Btn onClick={togglePip} title="Картинка в картинке">PiP</Btn>
          <Btn onClick={toggleFullscreen} title="Полный экран (F)">⛶</Btn>
        </Row>
      </Controls>
    </Wrapper>
  );
};

export default Player;
