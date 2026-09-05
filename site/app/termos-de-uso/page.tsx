import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description:
    "As condições de uso do blog da Valen Brasil: o que você pode fazer com o conteúdo publicado, os limites de responsabilidade e a lei aplicável.",
  alternates: { canonical: "/termos-de-uso/" },
};

const html = fs.readFileSync(
  path.join(process.cwd(), "content", "termos.html"),
  "utf8",
);

export default function TermosPage() {
  return (
    <div className="mx-auto max-w-[760px] px-6 py-16">
      <div
        className="prose prose-valen texto-justificado max-w-none"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
