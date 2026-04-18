"use client";

export type FaqRow = { question: string; answer: string };

type Props = {
  highlightsText: string;
  onHighlightsTextChange: (v: string) => void;
  packSize: string;
  onPackSizeChange: (v: string) => void;
  promoLine: string;
  onPromoLineChange: (v: string) => void;
  faqs: FaqRow[];
  onFaqsChange: (next: FaqRow[]) => void;
};

export function ProductExtraFields({
  highlightsText,
  onHighlightsTextChange,
  packSize,
  onPackSizeChange,
  promoLine,
  onPromoLineChange,
  faqs,
  onFaqsChange,
}: Props) {
  function updateFaq(index: number, patch: Partial<FaqRow>) {
    const next = faqs.map((row, i) => {
      if (i !== index) return row;
      return {
        question:
          patch.question !== undefined ? String(patch.question) : String(row.question ?? ""),
        answer: patch.answer !== undefined ? String(patch.answer) : String(row.answer ?? ""),
      };
    });
    onFaqsChange(next);
  }

  function removeFaq(index: number) {
    onFaqsChange(faqs.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-4 border-t border-zinc-200 pt-4">
      <p className="text-sm font-semibold text-zinc-800">Storefront details</p>
      <p className="text-xs text-zinc-500">
        Highlights appear as bullets on the product page. FAQs show in the sidebar. Pack size appears
        in the cart.
      </p>

      <div>
        <label className="block text-sm font-medium text-zinc-700">Pack / size label</label>
        <input
          type="text"
          value={packSize ?? ""}
          onChange={(e) => onPackSizeChange(e.target.value)}
          placeholder="e.g. 250g, 500 ml"
          className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700">Promo line (under title)</label>
        <input
          type="text"
          value={promoLine ?? ""}
          onChange={(e) => onPromoLineChange(e.target.value)}
          placeholder="Short line under the product name on the detail page"
          className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700">Highlights (one per line)</label>
        <textarea
          value={highlightsText ?? ""}
          onChange={(e) => onHighlightsTextChange(e.target.value)}
          rows={5}
          placeholder={"100% Pure & Natural\nUnfiltered & unprocessed\n..."}
          className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2 font-mono text-sm"
        />
      </div>

      <div>
        <div className="flex items-center justify-between gap-2">
          <label className="block text-sm font-medium text-zinc-700">FAQs</label>
          <button
            type="button"
            onClick={() => onFaqsChange([...faqs, { question: "", answer: "" }])}
            className="text-sm font-medium text-zinc-700 underline hover:text-zinc-900"
          >
            + Add FAQ
          </button>
        </div>
        <div className="mt-2 space-y-3">
          {faqs.length === 0 ? (
            <p className="text-xs text-zinc-500">No FAQs yet. Use “Add FAQ” to add question and answer pairs.</p>
          ) : (
            faqs.map((row, i) => (
              <div key={i} className="rounded-lg border border-zinc-200 bg-zinc-50/80 p-3">
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeFaq(i)}
                    className="text-xs text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
                <label className="mt-1 block text-xs font-medium text-zinc-600">Question</label>
                <input
                  type="text"
                  value={row.question ?? ""}
                  onChange={(e) => updateFaq(i, { question: e.target.value })}
                  className="mt-1 w-full rounded border border-zinc-300 px-3 py-1.5 text-sm"
                />
                <label className="mt-2 block text-xs font-medium text-zinc-600">Answer</label>
                <textarea
                  value={row.answer ?? ""}
                  onChange={(e) => updateFaq(i, { answer: e.target.value })}
                  rows={2}
                  className="mt-1 w-full rounded border border-zinc-300 px-3 py-1.5 text-sm"
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
