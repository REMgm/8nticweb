"use client";

import { useState } from "react";
import { attentionTokens, attentionWeights, type AttentionEnding } from "@/lib/publications";

const IT_INDEX = 7;

export function AttentionExplorer() {
  const [ending, setEnding] = useState<AttentionEnding>("tired");
  const [focus, setFocus] = useState(IT_INDEX);
  const tokens = attentionTokens(ending);
  const weights = attentionWeights(ending, focus);
  const ranked = tokens
    .map((token, index) => ({ token, index, weight: weights[index] }))
    .filter(({ index }) => index !== focus)
    .sort((a, b) => b.weight - a.weight);
  const top = ranked[0];
  const max = Math.max(...weights);

  return (
    <figure className="attn" aria-labelledby="attn-title">
      <div className="attn-head">
        <p className="pub-eyebrow">TRY IT · AN ILLUSTRATION OF ATTENTION</p>
        <h2 id="attn-title">Change one word.<br /><em>Watch “it” change its mind.</em></h2>
        <p className="attn-context">Pick a word to see where it looks. Then swap the last word of the sentence. The weights are set by hand to show the idea; a trained model spreads its attention across many layers and heads.</p>
      </div>

      <div className="attn-controls" role="group" aria-label="Choose how the sentence ends">
        <span>The sentence ends with</span>
        {(["tired", "wide"] as const).map((option) => (
          <button key={option} type="button" aria-pressed={ending === option} className={ending === option ? "is-on" : undefined} onClick={() => setEnding(option)}>
            too {option}
          </button>
        ))}
      </div>

      <div className="attn-tray" role="group" aria-label="Words in the sentence. Select a word to see where it pays attention.">
        {tokens.map((token, index) => {
          const weight = weights[index];
          const strength = index === focus ? 1 : weight / max;
          return (
            <button
              key={`${index}-${token}`}
              type="button"
              className={`attn-tile${index === focus ? " is-focus" : ""}`}
              aria-pressed={index === focus}
              aria-label={`${token}${index === focus ? ", selected" : `, ${Math.round(weight * 100)} percent of the attention`}`}
              style={{ "--w": strength.toFixed(3) } as React.CSSProperties}
              onClick={() => setFocus(index)}
            >
              <span className="attn-word">{token}</span>
              <span className="attn-bar" aria-hidden="true"><i /></span>
              <span className="attn-pct" aria-hidden="true">{index === focus ? "looking" : `${Math.round(weight * 100)}%`}</span>
            </button>
          );
        })}
      </div>

      <p className="attn-verdict" aria-live="polite">
        “{tokens[focus]}” pays most attention to <strong>“{top.token}”</strong>
        {focus === IT_INDEX ? (ending === "tired" ? ". Tired things are animals, so “it” is the animal." : ". Wide things are streets, so “it” is the street.") : "."}
      </p>

      <figcaption>
        <strong>One word changed, and the meaning moved</strong>
        This is the example Google used when it introduced the Transformer in 2017: the model translated both versions correctly into French, where “it” takes the gender of the noun it refers to. Every word does this at the same time, which is what made the design fast.
        <span>Illustrative weights, set by the author. Not measured from a trained model. <a href="#one-idea-sources">Sources</a>.</span>
      </figcaption>
    </figure>
  );
}
