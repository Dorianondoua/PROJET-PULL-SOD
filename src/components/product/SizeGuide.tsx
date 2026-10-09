import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SIZE_GUIDE } from "@/data/products";

type Unit = "cm" | "in";

/* "80–84" (cm) -> "31.5–33" (in) */
const toInches = (cell: string) =>
  cell.replace(/\d+/g, (n) => String(Math.round((Number(n) / 2.54) * 2) / 2));

const HOW_TO = [
  { title: "Chest", text: "Around the fullest part, under the arms, tape level." },
  { title: "Waist", text: "Around the narrowest part, where the crop sits." },
  { title: "Sleeve", text: "From the shoulder seam to the wrist bone, arm relaxed." },
];

/* Native modal <dialog>: top layer, focus trap, Escape and inert page come
   for free. A click on the backdrop closes it too. */
export function SizeGuide({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [unit, setUnit] = useState<Unit>("cm");

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="jm-dialog"
      aria-labelledby="jm-sizeguide-title"
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="jm-dialog__inner">
        <div className="jm-dialog__head">
          <h2 className="jm-dialog__title" id="jm-sizeguide-title">
            Size guide
          </h2>
          <button type="button" className="jm-icon-btn" aria-label="Close size guide" onClick={onClose}>
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>
        <p className="jm-dialog__lead">
          Body measurements. Between two sizes? Take the larger one to layer a hoodie underneath, the smaller one for a
          sharper crop.
        </p>

        <div className="jm-seg" role="radiogroup" aria-label="Units">
          {(["cm", "in"] as Unit[]).map((u) => (
            <button key={u} type="button" role="radio" aria-checked={unit === u} className="jm-seg__opt" onClick={() => setUnit(u)}>
              {u === "cm" ? "Centimetres" : "Inches"}
            </button>
          ))}
        </div>

        <div className="jm-table-wrap">
          <table className="jm-table">
            <caption className="jm-sr-only">Body measurements per size, in {unit === "cm" ? "centimetres" : "inches"}</caption>
            <thead>
              <tr>
                {SIZE_GUIDE.headers.map((h) => (
                  <th key={h} scope="col">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SIZE_GUIDE.rows.map(([size, ...cells]) => (
                <tr key={size}>
                  <th scope="row">{size}</th>
                  {cells.map((c, i) => (
                    <td key={i}>{unit === "cm" ? c : toInches(c)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ol className="jm-howto">
          {HOW_TO.map((h, i) => (
            <li key={h.title}>
              <span className="jm-howto__n">{i + 1}</span>
              <span>
                <strong>{h.title}</strong>
                {h.text}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </dialog>
  );
}
