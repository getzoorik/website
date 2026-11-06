import { contactEmail } from "@/config/site";

/**
 * `/status`: every string it prints. One page for both products: the overall line, then each product's console and
 * features with their state.
 *
 * A static page: every word is fixed at build and nothing here is measured, so it prints no uptime, response time or
 * incident count. Whoever changes a state moves `statusUpdated` in the same PR; never the build's date.
 */
export const statusUpdated = "Updated 6 November 2026";

export const statusPage = {
  meta: {
    title: "Status",
    description:
      "Zoorik status: whether Coral and Amoeba are working, with the console and every feature of both products listed.",
  },
  hero: {
    title: "Zoorik status",
    deck: "Whether Coral and Amoeba are working, feature by feature.",
  },
  overall: "All systems operational",
  state: "Operational",
  products: [
    {
      id: "coral",
      name: "Coral",
      kind: "Kubernetes optimization",
      rows: [
        "Console",
        "Cost monitoring",
        "Recommendations",
        "Workload optimization",
        "Node optimization",
        "Rebalancing",
        "Live migration",
      ],
    },
    {
      id: "amoeba",
      name: "Amoeba",
      kind: "Block storage optimization",
      rows: ["Console", "Monitoring", "Savings insights", "Rightsizing"],
    },
  ],
  help: `Something not working? Email ${contactEmail}.`,
} as const;
