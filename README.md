# Metas PGD 2026 — Horas Presenciais

Calculadora de apoio para o **Programa de Gestão e Desempenho (PGD) 2026** do IBGE.
Estima a meta mensal de horas presenciais de forma proporcional aos dias efetivamente
trabalhados, descontando férias, licenças, recessos e o crédito dos feriados do mês.

## Recursos

- Calendário de 2026 pré-carregado (dias úteis e feriados por mês).
- Dois métodos de cálculo lado a lado:
  - **Por dias úteis** — base recomendada tecnicamente.
  - **Por dias corridos** — alternativa proporcional ao total de dias do mês.
- Memória de cálculo detalhada em cada cartão.
- Exportação: copiar para a área de transferência, gerar PDF (Imprimir) e compartilhar no WhatsApp.
- Tema claro/escuro com preferência persistida.
- Interface responsiva.

## Uso

Aplicação estática de página única. Basta abrir o `index.html` no navegador — sem build
nem dependências de servidor.

> Ferramenta de apoio ao planejamento. Confirme sempre os valores no SECAF antes de registrar.

## Hospedagem

Publicada via **Firebase Hosting**. Para implantar:

```bash
firebase deploy
```

## Desenvolvimento

Para rodar localmente:

```bash
python -m http.server 8000
# abra http://127.0.0.1:8000
```

---

Desenvolvido por Adriel.
