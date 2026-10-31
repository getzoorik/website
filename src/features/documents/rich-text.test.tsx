import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { richText } from "@/features/documents/rich-text";

/**
 * The bold runs, as the mocks' `inline()` finds them: over the whole line, with the code and the links held aside,
 * so a run may hold a link (/coral-works-with-keda's "Rebalancing needs …" bullet); a run that holds none stays
 * where it was, and the runs pair from the left.
 */

const html = (text: string): string => render(<p>{richText(text)}</p>).container.innerHTML;

describe("richText's bold runs", () => {
  it("draws a run that holds links whole, the links inside it", () => {
    expect(
      html(
        "**Rebalancing needs [Karpenter](/coral-works-with-karpenter) or [AKS node auto provisioning (NAP)](/coral-works-with-aks-node-auto-provisioning).** It also needs Node optimization on.",
      ),
    ).toBe(
      '<p><b>Rebalancing needs <a href="/coral-works-with-karpenter">Karpenter</a> or <a href="/coral-works-with-aks-node-auto-provisioning">AKS node auto provisioning (NAP)</a>.</b> It also needs Node optimization on.</p>',
    );
  });

  it("draws a run that holds code whole, the code inside it", () => {
    expect(html("**Run `zoorikctl cluster prepare`.** Then wait.")).toBe(
      "<p><b>Run <code>zoorikctl cluster prepare</code>.</b> Then wait.</p>",
    );
  });

  it("pairs the runs from the left, so a link between two runs is in neither", () => {
    expect(html("**One.** See [the guide](/coral-guide) and **Two.**")).toBe(
      '<p><b>One.</b> See <a href="/coral-guide">the guide</a> and <b>Two.</b></p>',
    );
  });

  it("keeps a run beside a bold run that holds a link, with Coral kept out of translation", () => {
    expect(html("**Coral.** Then **see [the FAQ](/coral-faq).**")).toBe(
      '<p><b><span translate="no">Coral</span>.</b> Then <b>see <a href="/coral-faq">the FAQ</a>.</b></p>',
    );
  });
});
