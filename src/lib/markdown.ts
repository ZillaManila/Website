import { Marked } from 'marked';

const escape = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

// Product descriptions are plain Markdown. Raw HTML is shown as text, never run.
const md = new Marked({
  gfm: true,
  breaks: true,
  renderer: {
    html: ({ text }) => escape(text),
    link({ href, tokens }) {
      const text = this.parser.parseInline(tokens);
      return /^(https?:|mailto:|\/)/.test(href) ? `<a href="${escape(href)}">${text}</a>` : text;
    },
    image: ({ text }) => escape(text),
  },
});

export function renderMarkdown(src: string) {
  return md.parse(src || '') as string;
}
