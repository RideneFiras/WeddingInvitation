"use client";

import type { Dict } from "@/content/types";

type Props = { dict: Dict; playing: boolean; onToggle: () => void; inline?: boolean };

/** Small gold circle with equalizer bars that move while the music plays. */
export default function MusicToggle({ dict, playing, onToggle, inline = false }: Props) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={playing}
      aria-label={playing ? dict.ui.music.pause : dict.ui.music.play}
      className={`music-toggle ${inline ? "" : "fixed bottom-5 end-5 z-40"} ${playing ? "is-playing" : ""}`}
    >
      <span className="flex h-3.5 items-end gap-[3px]" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="eq-bar" style={{ animationDelay: `${i * -0.27}s` }} />
        ))}
      </span>
    </button>
  );
}
