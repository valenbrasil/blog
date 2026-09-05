# Procedência — @tysg/firehose-api

Instalado a partir do ClawHub sem usar a CLI `openclaw` nem `npx skills`:
o pacote são dois arquivos Markdown, então os arquivos foram baixados
direto da API do ClawHub e conferidos contra o manifesto publicado.

| item | valor |
|---|---|
| skill | `@tysg/firehose-api` — "Firehose Web Monitor" |
| versão | 2.0.2 |
| licença | MIT-0 |
| publicador | Tianyi Song (`tysg`), conta de pessoa física |
| página | https://clawhub.ai/tysg/skills/firehose-api |

## Integridade conferida

    SKILL.md        12588 b  sha256 a33a2d845dfe4d8e8ad1f78b927b6ef65811586c8c3c9d4eccbacda37a32f86e
    skill-card.md    2601 b  sha256 cedcca7194a0c8ca89605faf3517606ce5619b9ed4f963a957566520d9fe315d

Os dois hashes batem com o manifesto de `/api/v1/skills/firehose-api/versions/2.0.2`.

## Procedência conferida no fornecedor

`SKILL.md` é cópia fiel do artefato que a própria Firehose publica em
<https://docs.firehose.com/skill.md>. O `diff` acusa **uma linha** de
diferença, e é redação de um resumo de link de documentação
("with a public unauthenticated variant" vs "with an unauthenticated public
variant for try-it pages"). Nenhuma instrução, host ou comando a mais.

## Requisitos (do frontmatter, não inventados)

    bins: curl
    env:  FIREHOSE_MANAGEMENT_KEY, FIREHOSE_TAP_TOKEN
    primaryEnv: FIREHOSE_TAP_TOKEN
    os / systems: nenhum

Fica fora do controle de versão o valor das duas variáveis: elas moram em
`.env.local`, que está no `.gitignore`. Este repositório é público.
