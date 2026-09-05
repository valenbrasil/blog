#!/bin/bash
# Vigia da densificacao. Sai (e me notifica) quando qualquer um destes acontece:
#
#   1. o primeiro sinal de estrangulamento aparece na saida de um lote
#      -- "hit your session limit" / "hit your monthly spend limit".
#      E o sinal preciso: aparece na PRIMEIRA falha, antes de os outros
#      lotes queimarem em cima.
#   2. a saida acumulada dos subagentes passa do teto abaixo.
#   3. os seis lotes terminaram.
#
# So le arquivo. Nao chama API, nao gasta agente.
TETO=${1:-1200000}
T=/tmp/claude-0/-home-user-blog/ac83eda4-b0e1-54af-8989-1bf15598f7d8/tasks
W=/root/.claude/projects/-home-user-blog/ac83eda4-b0e1-54af-8989-1bf15598f7d8/subagents/workflows
MARCO=/tmp/dens/.marco-vigia
touch "$MARCO"
LOTES="wf_d6e7fbaf-92e wf_8d304b83-4de"

while true; do
  # so saida escrita DEPOIS que o vigia subiu. Sem isso ele le as falhas da
  # rodada de 13:01, que continuam nos arquivos antigos, e dispara na hora.
  RECENTE=$(find $T -name '*.output' -newer "$MARCO" 2>/dev/null)
  if [ -n "$RECENTE" ] && echo "$RECENTE" | xargs grep -l -E "hit your (session|monthly spend) limit" 2>/dev/null | head -1 | grep -q .; then
    echo "ESTRANGULOU: sinal de limite numa saida nova. Pare os agentes e grave o estado."
    exit 0
  fi
  GASTO=$(python3 - <<'PY'
import json, glob
W='/root/.claude/projects/-home-user-blog/ac83eda4-b0e1-54af-8989-1bf15598f7d8/subagents/workflows'
t=0
for f in glob.glob(W+'/*/agent-*.jsonl'):
    for l in open(f, errors='replace'):
        try: u=(json.loads(l).get('message') or {}).get('usage') or {}
        except Exception: continue
        t += u.get('output_tokens') or 0
print(t)
PY
)
  if [ "${GASTO:-0}" -ge "$TETO" ]; then
    echo "TETO: saida acumulada dos subagentes em $GASTO, teto $TETO. Pare e grave."
    exit 0
  fi
  # Atividade se mede pelos transcritos dos agentes, que crescem o tempo todo,
  # nao pelo journal.jsonl, que so recebe linha quando um agente TERMINA -- e
  # cada um leva de 10 a 20 minutos. Medir pelo journal declarava fim no meio
  # do trabalho. Alem disso, 12 minutos de folga no arranque: ao retomar, os
  # arquivos antigos estao parados ha muito tempo e nada escreveu ainda.
  AGORA=$(date +%s)
  if [ $(( AGORA - $(stat -c %Y "$MARCO") )) -lt 720 ]; then
    sleep 60
    continue
  fi
  VIVOS=0
  for w in $LOTES; do
    NOVO=$(find "$W/$w" -name 'agent-*.jsonl' -newermt '-15 minutes' 2>/dev/null | head -1)
    [ -n "$NOVO" ] && VIVOS=$((VIVOS+1))
  done
  if [ "$VIVOS" -eq 0 ]; then
    echo "TERMINOU: nenhum dos seis lotes escreveu nos ultimos 7 minutos. Gasto acumulado: $GASTO."
    exit 0
  fi
  sleep 60
done
