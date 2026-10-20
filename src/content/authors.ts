/* Written by scripts/gen-authors.mjs from the author list; run it again to change an author. */

/**
 * The people a Learn article can be published under, by the key an article names (`Article.author`). The byline
 * reads "By <name>, <role>", the name a link to their LinkedIn profile when there is one; the structured data makes
 * them the article's author. A guest works outside Zoorik, so their structured data names no employer.
 */
export interface Author {
  readonly name: string;
  readonly role: string;
  /** Their LinkedIn profile, or "" when there is none to link. */
  readonly linkedin: "" | `https://www.linkedin.com/in/${string}/`;
  readonly guest: boolean;
}

export const authors = {
  sourabh: {
    name: "Sourabh Singh",
    role: "Senior software engineer, Zoorik",
    linkedin: "https://www.linkedin.com/in/sourabh0/",
    guest: false,
  },
  vineet: {
    name: "Vineet",
    role: "Infrastructure engineer, Zoorik",
    linkedin: "https://www.linkedin.com/in/yadavvineet/",
    guest: false,
  },
  sonia: {
    name: "Sonia",
    role: "Developer relations, Zoorik",
    linkedin: "https://www.linkedin.com/in/soniasinglas/",
    guest: false,
  },
  anuragee: {
    name: "Anuragee",
    role: "Guest author · Data engineer",
    linkedin: "https://www.linkedin.com/in/vijay-kumar-ray/",
    guest: true,
  },
  saurav: {
    name: "Saurav",
    role: "Backend engineer, Zoorik",
    linkedin: "https://www.linkedin.com/in/srv9211/",
    guest: false,
  },
  shreya: {
    name: "Shreya Shukla",
    role: "Backend engineer, Zoorik",
    linkedin: "https://www.linkedin.com/in/shreya-shukla-74737b178/",
    guest: false,
  },
  swati: {
    name: "Swati Bhatia",
    role: "Backend engineer, Zoorik",
    linkedin: "https://www.linkedin.com/in/swati-bhatia-01a407154/",
    guest: false,
  },
  adil: {
    name: "Adil Rana",
    role: "Frontend engineer, Zoorik",
    linkedin: "https://www.linkedin.com/in/mohd-aadil-rana/",
    guest: false,
  },
  sujal: {
    name: "Sujal Agrawal",
    role: "Guest author · Senior software engineer at Fivetran",
    linkedin: "https://www.linkedin.com/in/agrawalsujal/",
    guest: true,
  },
  iqbal: { name: "Iqbal", role: "Guest author · SDE II", linkedin: "", guest: true },
  udit: {
    name: "Udit Sharma",
    role: "Sales engineer, Zoorik",
    linkedin: "https://www.linkedin.com/in/uditsharmadevops/",
    guest: false,
  },
  sheldon: {
    name: "Sheldon Julius",
    role: "Sales engineer, Zoorik",
    linkedin: "https://www.linkedin.com/in/sheldon-julius-293643241/",
    guest: false,
  },
  rupeshankar: {
    name: "Rupeshankar",
    role: "Marketing, Zoorik",
    linkedin: "https://www.linkedin.com/in/rupshankermishra/",
    guest: false,
  },
  pulkit: {
    name: "Pulkit Gaur",
    role: "Data engineer, Zoorik",
    linkedin: "https://www.linkedin.com/in/pulkit-gaur-4598711b1/",
    guest: false,
  },
  shubankar: {
    name: "Shubhankar Sharma",
    role: "Guest author · Associate manager (data engineering) at MSD",
    linkedin: "https://www.linkedin.com/in/sharmashubhankar/",
    guest: true,
  },
  aditya: {
    name: "Aditya Keshari",
    role: "Guest author · Full stack engineer at ZS",
    linkedin: "",
    guest: true,
  },
  sonu: {
    name: "Sonu Kumar",
    role: "Data engineer, Zoorik",
    linkedin: "https://www.linkedin.com/in/sonu-kumar-95224b168/",
    guest: false,
  },
  swapna: {
    name: "Swapna Nanda",
    role: "Guest author · Infrastructure engineer at Salesforce",
    linkedin: "https://www.linkedin.com/in/swapna8249/",
    guest: true,
  },
  ajay: {
    name: "Ajay Roy",
    role: "Guest author · Infrastructure engineer at HCL",
    linkedin: "",
    guest: true,
  },
  harsh: {
    name: "Harsh",
    role: "Guest author · Network engineer at Palo Alto Networks",
    linkedin: "",
    guest: true,
  },
  ravi: {
    name: "Ravi Kumar",
    role: "Guest author · SDE II at Expedia",
    linkedin: "https://www.linkedin.com/in/ravi-kumar-a54249157/",
    guest: true,
  },
  somay: {
    name: "Somay Chauhan",
    role: "Guest author · Full stack engineer at Cal.com",
    linkedin: "https://www.linkedin.com/in/somay-chauhan/",
    guest: true,
  },
  shashank: {
    name: "Shashank Varanasi",
    role: "Guest author · Backend engineer at Accenture",
    linkedin: "https://www.linkedin.com/in/shashankvaranasi/",
    guest: true,
  },
  rishika: {
    name: "Rishika Rai",
    role: "Guest author · AI safety and alignment research fellow, Technical Alignment Research Accelerator",
    linkedin: "https://www.linkedin.com/in/rishika-rai-058520149/",
    guest: true,
  },
  sushant: {
    name: "Sushant Phulsundar",
    role: "Guest author · Software developer II",
    linkedin: "https://www.linkedin.com/in/sushant-phulsundar-sp/",
    guest: true,
  },
  prashant: {
    name: "Prashant Soni",
    role: "Guest author · SDE at SITA",
    linkedin: "https://www.linkedin.com/in/prashant-soni-2246a8196/",
    guest: true,
  },
  swapnil: {
    name: "Swapnil Srivastav",
    role: "Software development manager, Zoorik · 11 years' experience",
    linkedin: "https://www.linkedin.com/in/swapnil-srivastav/",
    guest: false,
  },
  soumya: {
    name: "Saumya Shukla",
    role: "Guest author · Software engineer at Samsung",
    linkedin: "https://www.linkedin.com/in/saumya-shukla-1865aa178/",
    guest: true,
  },
  rupesh: { name: "Rupesh", role: "Guest author · SDE II", linkedin: "", guest: true },
} as const satisfies Readonly<Record<string, Author>>;

export type AuthorKey = keyof typeof authors;
