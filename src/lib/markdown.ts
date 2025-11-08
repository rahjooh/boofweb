const headingClasses = [
  "mt-10 text-3xl font-semibold text-white",
  "mt-8 text-2xl font-semibold text-white",
  "mt-6 text-xl font-semibold text-white",
  "mt-6 text-lg font-semibold text-white",
  "mt-6 text-base font-semibold text-white",
  "mt-6 text-base font-semibold text-white",
];

const paragraphClass = "mt-4 text-base leading-7 text-slate-200";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderInline(value: string): string {
  let output = escapeHtml(value);

  output = output.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
    (_match, label: string, href: string) =>
      `<a href="${href}" class="text-teal-300 underline-offset-4 hover:underline" target="_blank" rel="noopener noreferrer">${label}</a>`,
  );

  output = output.replace(
    /`([^`]+)`/g,
    (_match, code: string) =>
      `<code class="rounded bg-slate-900/80 px-1 py-0.5 text-sm text-teal-200">${code}</code>`,
  );

  output = output.replace(
    /\*\*([^*]+)\*\*/g,
    (_match, text: string) => `<strong>${text}</strong>`,
  );

  output = output.replace(
    /_(.+?)_/g,
    (_match, text: string) => `<em>${text}</em>`,
  );

  output = output.replace(
    /\*(?!\*)([^*]+)\*(?!\*)/g,
    (_match, text: string) => `<em>${text}</em>`,
  );

  return output;
}

export function markdownToHtml(markdown: string): string {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const html: string[] = [];
  let inList = false;
  let inCodeBlock = false;
  let codeLanguage = "";
  const codeBuffer: string[] = [];

  const closeListIfNeeded = () => {
    if (inList) {
      html.push("</ul>");
      inList = false;
    }
  };

  const flushCodeBuffer = () => {
    const codeContent = escapeHtml(codeBuffer.join("\n"));
    const languageClass = codeLanguage
      ? ` language-${escapeHtml(codeLanguage)}`
      : "";
    const codeClassAttribute = languageClass
      ? ` class="${languageClass.trim()}"`
      : "";
    html.push(
      `<pre class="mt-4 overflow-x-auto rounded-2xl bg-slate-900/90 px-4 py-3 text-sm text-slate-100"><code${codeClassAttribute}>${codeContent}</code></pre>`,
    );
    codeBuffer.length = 0;
    inCodeBlock = false;
    codeLanguage = "";
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (inCodeBlock) {
      if (trimmed.startsWith("```") && !trimmed.endsWith("\\``")) {
        flushCodeBuffer();
      } else {
        codeBuffer.push(line);
      }
      continue;
    }

    if (trimmed.startsWith("```") && !trimmed.endsWith("\\``")) {
      closeListIfNeeded();
      inCodeBlock = true;
      codeLanguage = trimmed.replace(/```/, "").trim();
      continue;
    }

    if (trimmed === "") {
      closeListIfNeeded();
      continue;
    }

    if (trimmed.startsWith("- ")) {
      if (!inList) {
        closeListIfNeeded();
        html.push(
          '<ul class="mt-4 list-disc space-y-2 pl-6 text-sm text-slate-200">',
        );
        inList = true;
      }
      const content = trimmed.slice(2);
      html.push(`<li>${renderInline(content)}</li>`);
      continue;
    }

    closeListIfNeeded();

    const headingMatch = trimmed.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const safeLevel = Math.min(level, 6);
      const headingText = headingMatch[2];
      const headingClass = headingClasses[safeLevel - 1] ?? headingClasses[0];
      html.push(
        `<h${safeLevel} class="${headingClass}">${renderInline(headingText)}</h${safeLevel}>`,
      );
      continue;
    }

    const quoteMatch = trimmed.match(/^>\s?(.*)$/);
    if (quoteMatch) {
      html.push(
        `<blockquote class="mt-4 border-l-4 border-teal-500/40 bg-slate-900/70 px-4 py-2 text-sm italic text-slate-200">${renderInline(quoteMatch[1])}</blockquote>`,
      );
      continue;
    }

    html.push(`<p class="${paragraphClass}">${renderInline(trimmed)}</p>`);
  }

  if (inList) {
    html.push("</ul>");
  }
  if (inCodeBlock) {
    flushCodeBuffer();
  }

  return html.join("\n");
}
