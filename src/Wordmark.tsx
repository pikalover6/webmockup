import { useEffect, useState } from "react";

/**
 * "Libuda Lab" with a partner homolog drawn as a chromosome bar beneath it.
 * Plays once on load: a double-strand break opens either side of "uda", then
 * repair off the partner exchanges the segment. Letters sink into the bar and
 * become bar; bar rises into the title and becomes letters.
 */

const TEXT = "Libuda Lab";
const LETTERS = TEXT.split("");
const SEGMENT = [3, 4, 5]; // "uda"
const PRE = 2; // letter before the segment carries the left break mark
const POST = 6; // the space after it carries the right break mark and the centromere

type Phase = "idle" | "broken" | "crossing" | "healed";

export default function Wordmark() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [swapped, setSwapped] = useState(false);

  useEffect(() => {
    const t = [
      window.setTimeout(() => setPhase("broken"), 900),
      window.setTimeout(() => {
        setPhase("crossing");
        setSwapped(true);
      }, 2000),
      window.setTimeout(() => setPhase("healed"), 3000),
      window.setTimeout(() => setPhase("idle"), 3900),
    ];
    return () => t.forEach(clearTimeout);
  }, []);

  const row = (which: "a" | "b") => (
    <span className={"row homolog " + which} aria-hidden={which === "b"}>
      {LETTERS.map((ch, i) => (
        <span key={i} className={"letter" + (SEGMENT.includes(i) ? " seg" : "") + (i === POST ? " centro" : "")}>
          <span className="glyph">{ch === " " ? " " : ch}</span>
          <i className="strand" aria-hidden />
          {which === "a" && i === PRE && <i className="cutmark r" aria-hidden />}
          {which === "a" && i === POST && <i className="cutmark l" aria-hidden />}
        </span>
      ))}
    </span>
  );

  return (
    <h1 className={`wordmark phase-${phase}${swapped ? " swapped" : ""}`}>
      {row("a")}
      {row("b")}
    </h1>
  );
}
