import { ExternalArrow } from "@/components/primitives/external-arrow";
import { ChannelButtons } from "@/components/primitives/install-buttons";
import { NewTabHint } from "@/components/primitives/new-tab-hint";
import { publishedChannels } from "@/config/open-source";
import { openSourcePage, type ProjectLink, type ProjectLinkGroup } from "@/content/open-source";
import { DocRows } from "@/features/doc-rows/doc-rows";
import { DocumentPage } from "@/features/documents/document-page";
import { ArrowGlyph } from "@/features/documents/document-glyphs";
import { named } from "@/features/legal/named";
import { OsText } from "@/features/open-source/os-text";
import { isOffSite, offSiteProps } from "@/lib/links";

/**
 * `/open-source`, in the FAQ's frame: a group's name beside
 * its numbered rows. Over the groups, "Published on": the footer's buttons for
 * every place Zoorik publishes, then the trust sentence. Projects are rows with their licence and links (a row has
 * several, so it is not one link; each Terraform module has its own pair); Contribute's rows are each one link, as on
 * /learn. Under them, muted, what is not open. Then the closing row, on Coral.
 */

const numeral = (n: number): string => String(n).padStart(2, "0");

/** Names a page translator would turn into words: the projects' names. */
const UNTRANSLATED = new Set(["zoorikctl", "kubernetes-scenarios", "assessment"]);

/** A project row's link: off-site ones open a new tab and say so; an on-site one ends in the site's arrow. */
function ProjectAnchor({ link }: { readonly link: ProjectLink }) {
  const offSite = isOffSite(link.href);
  return (
    <a href={link.href} {...offSiteProps(link.href)}>
      {link.who ? <span className="sr-only">{link.who}</span> : null}
      {link.label}
      {offSite ? (
        <>
          <ExternalArrow />
          <NewTabHint href={link.href} />
        </>
      ) : (
        <ArrowGlyph className="op-go" weight={2.2} />
      )}
    </a>
  );
}

/** A link, or a Terraform module's name (muted, hidden from screen readers: each link says it) and its two links. */
function ProjectLinkItem({ item }: { readonly item: ProjectLink | ProjectLinkGroup }) {
  if ("group" in item) {
    return (
      <span className="op-grp">
        <span className="op-k" aria-hidden="true">
          {item.group}
        </span>
        {item.links.map((link) => (
          <ProjectAnchor link={link} key={link.href} />
        ))}
      </span>
    );
  }
  return <ProjectAnchor link={item} />;
}

export function OpenSourcePage(): React.JSX.Element {
  const { hero, trust, projects, contribute, foot } = openSourcePage;
  let n = 0;
  return (
    <DocumentPage hero={{ title: hero.title, deck: named(hero.deck) }} product="coral">
      <DocRows
        frame="rows"
        top={
          <div className="op-pub">
            <ChannelButtons className="op-pb" items={publishedChannels} label="Published on" />
            <p className="op-trust">
              <OsText text={trust} />
            </p>
          </div>
        }
        groups={[
          {
            id: "projects",
            title: projects.title,
            chip: projects.title,
            rows: projects.rows.map((row) => (
              <div className="op-row" key={row.name}>
                <span className="fq-n" aria-hidden="true">
                  {numeral(++n)}
                </span>
                <div>
                  <h3>
                    {UNTRANSLATED.has(row.name) ? <span translate="no">{row.name}</span> : row.name}
                  </h3>
                  <p>{named(row.line)}</p>
                  <div className="op-meta">
                    {row.licence ? <span className="op-lic">{row.licence}</span> : null}
                    {row.links.map((item) => (
                      <ProjectLinkItem item={item} key={"group" in item ? item.group : item.href} />
                    ))}
                  </div>
                </div>
              </div>
            )),
          },
          {
            id: "contribute",
            title: contribute.title,
            chip: contribute.title,
            rows: contribute.rows.map((row) => {
              const offSite = isOffSite(row.href);
              return (
                <a
                  className={offSite ? "ln-row op-x" : "ln-row"}
                  href={row.href}
                  key={row.href}
                  {...offSiteProps(row.href)}
                >
                  <span className="fq-n" aria-hidden="true">
                    {numeral(++n)}
                  </span>
                  <span className="ln-rt">
                    <h3>{row.title}</h3>
                    <span className="ln-rl">{named(row.line)}</span>
                  </span>
                  {offSite ? (
                    <>
                      <ExternalArrow />
                      <NewTabHint href={row.href} />
                    </>
                  ) : (
                    <ArrowGlyph className="ln-go" weight={2.2} />
                  )}
                </a>
              );
            }),
          },
        ]}
        foot={<p className="op-not">{named(foot)}</p>}
      />
    </DocumentPage>
  );
}
