// --- CONFIGURAÇÃO E DADOS ---

const diasSemana = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

// Feriados Fixos (Sempre a mesma data)
const feriadosFixos = [
    { d: 1, m: 0, nome: "Confraternização Universal", tipo: "Feriado Nacional" },
    { d: 21, m: 3, nome: "Tiradentes", tipo: "Feriado Nacional" },
    { d: 1, m: 4, nome: "Dia do Trabalho", tipo: "Feriado Nacional" },
    { d: 7, m: 8, nome: "Independência do Brasil", tipo: "Feriado Nacional" },
    { d: 12, m: 9, nome: "Nossa Sra. Aparecida", tipo: "Feriado Nacional" },
    { d: 28, m: 9, nome: "Dia do Servidor Público", tipo: "Ponto Facultativo" },
    { d: 2, m: 10, nome: "Finados", tipo: "Feriado Nacional" },
    { d: 15, m: 10, nome: "Proclamação da República", tipo: "Feriado Nacional" },
    { d: 20, m: 10, nome: "Consciência Negra", tipo: "Feriado Nacional" },
    { d: 24, m: 11, nome: "Véspera de Natal (após 14h)", tipo: "Ponto Facultativo" },
    { d: 25, m: 11, nome: "Natal", tipo: "Feriado Nacional" },
    { d: 31, m: 11, nome: "Véspera de Ano Novo (após 14h)", tipo: "Ponto Facultativo" }
];

// --- FUNÇÃO DE PÁSCOA (Algoritmo de Meeus/Jones/Butcher) ---
function getEasterDate(year) {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);

    // Mês (3=Março, 4=Abril) e Dia
    const monthIndex = Math.floor((h + l - 7 * m + 114) / 31) - 1;
    const day = ((h + l - 7 * m + 114) % 31) + 1;

    return new Date(year, monthIndex, day);
}

// --- GERAÇÃO DE DATAS MÓVEIS ---
function getFeriadosMoveis(year) {
    const pascoa = getEasterDate(year);

    // Carnaval (Segunda): -48 dias (Domingo é -49, Seg é -48)
    // Carnaval (Terça): -47 dias
    // Quarta de Cinzas: -46 dias
    // Sexta Santa: -2 dias
    // Corpus Christi: +60 dias

    const addDays = (date, days) => {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    const carnavalSeg = addDays(pascoa, -48);
    const carnavalTer = addDays(pascoa, -47);
    const cinzas = addDays(pascoa, -46);
    const sextaSanta = addDays(pascoa, -2);
    const corpusChristi = addDays(pascoa, 60);

    return [
        { d: carnavalSeg.getDate(), m: carnavalSeg.getMonth(), nome: "Carnaval (Segunda)", tipo: "Ponto Facultativo" },
        { d: carnavalTer.getDate(), m: carnavalTer.getMonth(), nome: "Carnaval (Terça)", tipo: "Ponto Facultativo" },
        { d: cinzas.getDate(), m: cinzas.getMonth(), nome: "Quarta de Cinzas (até 14h)", tipo: "Ponto Facultativo" },
        { d: sextaSanta.getDate(), m: sextaSanta.getMonth(), nome: "Paixão de Cristo", tipo: "Feriado Nacional" },
        { d: corpusChristi.getDate(), m: corpusChristi.getMonth(), nome: "Corpus Christi", tipo: "Ponto Facultativo" }
    ];
}

function init() {
    const elMes = document.getElementById('mes');
    const elAno = document.getElementById('ano');

    elMes.addEventListener('change', atualizarInterface);
    elAno.addEventListener('change', atualizarInterface);

    // Inicializa
    atualizarInterface();
}

function atualizarInterface() {
    const mes = parseInt(document.getElementById('mes').value);
    const ano = parseInt(document.getElementById('ano').value);

    // 1. Atualizar Total de Dias (Select)
    const totalDias = new Date(ano, mes + 1, 0).getDate();
    const selectDias = document.getElementById('totalDiasMes');
    selectDias.innerHTML = '';

    [28, 29, 30, 31].forEach(d => {
        let opt = document.createElement('option');
        opt.value = d;
        opt.innerText = d + " Dias";
        if (d === totalDias) opt.selected = true;
        selectDias.appendChild(opt);
    });

    // 2. Gerar Lista Combinada de Feriados para o Ano
    const moveis = getFeriadosMoveis(ano);
    const todosFeriados = [...feriadosFixos, ...moveis];

    // Filtrar pelo mês atual
    const feriadosDoMes = todosFeriados.filter(f => f.m === mes);

    // Ordenar por dia
    feriadosDoMes.sort((a, b) => a.d - b.d);

    // Renderizar Card
    const listaEl = document.getElementById('listaFeriados');
    listaEl.innerHTML = '';

    if (feriadosDoMes.length === 0) {
        listaEl.innerHTML = '<li><i>Nenhum feriado nacional previsto neste mês.</i></li>';
    } else {
        feriadosDoMes.forEach(f => {
            const dataObj = new Date(ano, f.m, f.d);
            const diaSemana = diasSemana[dataObj.getDay()];

            let li = document.createElement('li');
            li.innerHTML = `<b>${pad(f.d)}/${pad(f.m + 1)}</b> - ${f.nome} <br> <small>(${diaSemana}) - ${f.tipo}</small>`;
            listaEl.appendChild(li);
        });
    }
}

function calcular() {
    // Inputs
    const metaPadrao = parseInt(document.getElementById('metaPadrao').value);
    const jornada = parseInt(document.getElementById('jornada').value);
    const totalDias = parseInt(document.getElementById('totalDiasMes').value);
    const diasFerias = parseInt(document.getElementById('diasFerias').value) || 0;
    const feriadosUteis = parseInt(document.getElementById('feriadosUteis').value) || 0;

    if (diasFerias > totalDias) {
        alert("Dias de férias não podem ser maiores que dias do mês.");
        return;
    }

    // Cálculo
    const metaBase = (metaPadrao * jornada) / 8;
    const diasAtivos = totalDias - diasFerias;
    const metaPosFerias = metaBase * (diasAtivos / totalDias); // Proporcionalidade

    // Desconto dos Feriados Presenciais (Abatimento de Meta)
    // HorasFeriados = Qtd * Jornada
    const horasAbatidasFeriados = feriadosUteis * jornada;

    let resultado = metaPosFerias - horasAbatidasFeriados;
    if (resultado < 0) resultado = 0;

    // Display
    const horas = Math.floor(resultado);
    const minutos = Math.round((resultado - horas) * 60);
    const textoResultado = `${horas}h ${minutos > 0 ? minutos + 'm' : ''}`;

    document.getElementById('metaFinal').innerText = textoResultado;
    document.getElementById('resultado').style.display = 'block';
    document.getElementById('resultado').scrollIntoView({ behavior: 'smooth' });
}

function copiarResumo() {
    const metaFinal = document.getElementById('metaFinal').innerText;
    const mesIdx = parseInt(document.getElementById('mes').value);
    const ano = document.getElementById('ano').value;
    const nomesMeses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    // Dados para o texto
    const metaPadrao = parseInt(document.getElementById('metaPadrao').value);
    const jornada = parseInt(document.getElementById('jornada').value);
    const metaBase = (metaPadrao * jornada) / 8;

    const diasFerias = parseInt(document.getElementById('diasFerias').value) || 0;
    const feriadosUteis = parseInt(document.getElementById('feriadosUteis').value) || 0;

    // Calcular abatimentos em horas para o resumo
    const totalDias = parseInt(document.getElementById('totalDiasMes').value);
    const metaPosFerias = metaBase * ((totalDias - diasFerias) / totalDias);
    const horasAbatidasFerias = (metaBase - metaPosFerias).toFixed(1);

    const horasAbatidasFeriados = feriadosUteis * jornada;

    const texto = `Cálculo de Meta Presencial - [${nomesMeses[mesIdx]}/${ano}]
📅 Dias no Mês: ${totalDias}
⏱️ Meta Original: ${metaBase}h
🏖️ Abatimento (Férias): -${horasAbatidasFerias}h
📆 Abatimento (Feriados/Facultativos): -${horasAbatidasFeriados}h
----------------------------------
🏢 META PRESENCIAL FINAL: ${metaFinal}
*(Horas líquidas a comparecer)*`;

    navigator.clipboard.writeText(texto).then(() => {
        const btn = document.getElementById('btnCopiar');
        const original = btn.innerText;
        btn.innerText = "Copiado! ✅";
        setTimeout(() => btn.innerText = original, 2000);
    });
}

function pad(n) {
    return n < 10 ? '0' + n : n;
}

window.onload = init;
