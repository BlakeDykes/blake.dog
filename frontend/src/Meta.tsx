import { HeadContent } from "@tanstack/react-router";

export const defaultHeadScript = () => ({
  meta: [
    {
      name: "description",
      content: "Blake Dykes' portfolio and blog",
    },
    {
      title: "Blake Dykes",
    },
  ],
  links: [
    {
      rel: "preconnect",
      href: "https://fonts.googleapis.com",
    },
    {
      rel: "preconnect",
      href: "https://fonts.gstatic.com",
    },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Chakra+Petch:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&family=Comic+Neue:ital,wght@0,400;0,700;1,400&family=Jost:wght@400;500;600&family=M+PLUS+Rounded+1c:wght@400;500;700;800&family=Nunito:wght@400;500;700&display=swap",
    },
  ],
});

export const MetaComponent = () => {
  return <HeadContent />;
};
