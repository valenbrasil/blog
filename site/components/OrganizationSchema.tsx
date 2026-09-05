import { EMPRESA, INSTITUTIONAL_URL, SITE_URL } from "@/lib/site-config";
import { StructuredData } from "./StructuredData";

/*
  Identidade da empresa em schema.org, uma vez por página.

  Antes existia só `publisher: { '@type': 'Organization', name: 'Valen Brasil' }`
  dentro do BlogPosting de cada artigo — um nome solto, sem endereço, sem
  registro, sem nada que ligue o blog à pessoa jurídica que responde por ele.

  O `@id` é o que costura tudo: o BlogPosting de cada artigo aponta o publisher
  para este mesmo identificador, então os 206 artigos passam a ter um editor com
  CNPJ, registro profissional, endereço e telefone, em vez de 206 organizações
  homônimas.

  CAU e CRECI entram como `identifier`, que é onde schema.org acomoda registro
  emitido por terceiro; `taxID` recebe o CNPJ e `foundingDate` o ano.
*/
export const ORGANIZATION_ID = `${INSTITUTIONAL_URL}/#organizacao`;

export function OrganizationSchema() {
  const {
    razaoSocial,
    nome,
    cnpj,
    cau,
    creci,
    fundacao,
    endereco,
    telefone,
    email,
  } = EMPRESA;

  return (
    <StructuredData
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": ORGANIZATION_ID,
        name: nome,
        legalName: razaoSocial,
        url: INSTITUTIONAL_URL,
        foundingDate: fundacao,
        taxID: cnpj,
        email,
        telephone: telefone,
        address: {
          "@type": "PostalAddress",
          streetAddress: endereco.logradouro,
          addressLocality: endereco.cidade,
          addressRegion: endereco.estado,
          addressCountry: endereco.pais,
        },
        identifier: [
          { "@type": "PropertyValue", propertyID: "CNPJ", value: cnpj },
          {
            "@type": "PropertyValue",
            propertyID: "CAU",
            name: "Conselho de Arquitetura e Urbanismo",
            value: cau,
          },
          {
            "@type": "PropertyValue",
            propertyID: "CRECI",
            name: "Conselho Regional de Corretores de Imóveis",
            value: creci,
          },
        ],
        subOrganization: {
          "@type": "Blog",
          "@id": `${SITE_URL}/#blog`,
          name: "Valen Brasil — Blog",
          url: `${SITE_URL}/`,
          inLanguage: "pt-BR",
        },
      }}
    />
  );
}
