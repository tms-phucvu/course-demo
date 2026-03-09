import { docsNavigation, type NavItem } from "./navigation";

export interface SearchItem {
  title: string;
  href: string;
  section: string;
  keywords?: string[];
}

/**
 * Flatten navigation structure into searchable items
 */
function flattenNavigation(
  sections: typeof docsNavigation,
): SearchItem[] {
  const items: SearchItem[] = [];

  sections.forEach((section) => {
    const flattenItems = (navItems: NavItem[], sectionTitle: string) => {
      navItems.forEach((item) => {
        if (item.href) {
          items.push({
            title: item.title,
            href: item.href,
            section: sectionTitle,
          });
        }
        if (item.children) {
          flattenItems(item.children, sectionTitle);
        }
      });
    };

    flattenItems(section.items, section.title);
  });

  return items;
}

/**
 * Get search index for documentation
 */
export function getSearchIndex(): SearchItem[] {
  return flattenNavigation(docsNavigation);
}
