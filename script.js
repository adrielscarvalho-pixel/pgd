// --- DADOS FIXOS 2026 (Base IBGE/RJ + Nacional) ---
const calendario2026 = [
    { uteis: 20, feriados: 2, total: 31, obs: "01 (Conf. Univ), 20 (S. Sebastião)" }, // Jan
    { uteis: 18, feriados: 2, total: 28, obs: "16 e 17 (Carnaval)" }, // Fev
    { uteis: 22, feriados: 0, total: 31, obs: "Sem feriados em dias úteis" }, // Mar
    { uteis: 19, feriados: 3, total: 30, obs: "03 (Paixão), 21 (Tiradentes), 23 (S. Jorge)" }, // Abr
    { uteis: 20, feriados: 1, total: 31, obs: "01 (Dia do Trabalho)" }, // Mai
    { uteis: 21, feriados: 1, total: 30, obs: "04 (Corpus Christi)" }, // Jun
    { uteis: 23, feriados: 0, total: 31, obs: "Sem feriados em dias úteis" }, // Jul
    { uteis: 21, feriados: 0, total: 31, obs: "Sem feriados em dias úteis" }, // Ago
    { uteis: 21, feriados: 1, total: 30, obs: "07 (Independência)" }, // Set
    { uteis: 21, feriados: 1, total: 31, obs: "12 (N. Sra. Aparecida)" }, // Out
    { uteis: 19, feriados: 3, total: 30, obs: "02 (Finados), 15 (Proclamação), 20 (Zumbi)" }, // Nov
    { uteis: 22, feriados: 1, total: 31, obs: "25 (Natal)" }  // Dez
];

const nomesMeses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

function init() {
    document.getElementById('mes').addEventListener('change', carregarDadosMes);
    carregarDadosMes(); 
}

function carregarDadosMes() {
    const mesIndex = parseInt(document.getElementById('mes').value);
    const dados = calendario2026[mesIndex];

    document.getElementById('totalDiasUteis').value = dados.uteis;
    document.getElementById('totalFeriados').value = dados.feriados;
    
    const divAviso = document.getElementById('avisoFeriados');
    if (dados.feriados > 0) {
        divAviso.innerHTML = `📅 <strong>Previsão:</strong> Este mês tem ${dados.uteis} dias úteis e ${dados.feriados} feriado(s): <br><em>${dados.obs}</em>`;
        divAviso.style.display = 'block';
    } else {
        divAviso.innerHTML = `📅 Mês "cheio": ${dados.uteis} dias úteis previstos.`;
    }
}

function formatarHoras(valor) {
    if (valor < 0) valor = 0;
    const h = Math.floor(valor);
    const m = Math.round((valor - h) * 60);
    return `${h}h ${m < 10 ? '0'+m : m}m`;
}

function calcular() {
    const mesIndex = parseInt(document.getElementById('mes').value);
    const dadosBase = calendario2026[mesIndex];
    const metaPadrao = parseInt(document.getElementById('metaPadrao').value);

    const feriasCorridos = parseInt(document.getElementById('feriasCorridos').value) || 0;
    const feriasUteis = parseInt(document.getElementById('feriasUteis').value) || 0;
    
    const totalDiasUteis = parseInt(document.getElementById('totalDiasUteis').value);
    const totalFeriados = parseInt(document.getElementById('totalFeriados').value);

    // CÁLCULO 1: TÉCNICO
    const diasTrabalhaveis = totalDiasUteis - feriasUteis;
    let propTecnica = 0;
    if (totalDiasUteis > 0) propTecnica = diasTrabalhaveis / totalDiasUteis;
    
    let metaTecnicaBruta = propTecnica * metaPadrao;
    let creditoFeriados = totalFeriados * 8;
    let metaTecnicaLiquida = metaTecnicaBruta - creditoFeriados;

    // CÁLCULO 2: PRÁTICO
    const diasAtivos = dadosBase.total - feriasCorridos;
    let propPratica = diasAtivos / dadosBase.total;
    let metaPraticaBruta = propPratica * metaPadrao;
    let metaPraticaLiquida = metaPraticaBruta - creditoFeriados;

    // EXIBIÇÃO
    document.getElementById('resTecnico').innerText = formatarHoras(metaTecnicaLiquida);
    document.getElementById('detalheTecnico').innerText = `Base: ${diasTrabalhaveis} de ${totalDiasUteis} dias úteis trabalhados.`;
    document.getElementById('formulaTecnicaDisplay').innerHTML = `<code>((${totalDiasUteis} - ${feriasUteis}) ÷ ${totalDiasUteis}) × ${metaPadrao} - ${creditoFeriados} = <strong>${metaTecnicaLiquida.toFixed(2)}h</strong></code>`;

    document.getElementById('resPratico').innerText = formatarHoras(metaPraticaLiquida);
    document.getElementById('detalhePratico').innerText = `Base: ${diasAtivos} de ${dadosBase.total} dias corridos ativos.`;
    document.getElementById('formulaPraticaDisplay').innerHTML = `<code>((${dadosBase.total} - ${feriasCorridos}) ÷ ${dadosBase.total}) × ${metaPadrao} - ${creditoFeriados} = <strong>${metaPraticaLiquida.toFixed(2)}h</strong></code>`;

    document.getElementById('resultado').style.display = 'block';
    document.getElementById('resultado').scrollIntoView({ behavior: 'smooth' });
}

// --- FUNÇÕES DE COMPARTILHAMENTO ---

function gerarTextoResumo() {
    const mesTexto = nomesMeses[parseInt(document.getElementById('mes').value)];
    const resTecnico = document.getElementById('resTecnico').innerText;
    const resPratico = document.getElementById('resPratico').innerText;
    const feriasCorridos = document.getElementById('feriasCorridos').value;
    
    return `*Cálculo de Metas PGD 2026*
🗓️ Mês: ${mesTexto}
🏖️ Afastamentos: ${feriasCorridos} dias
-------------------------
*🎯 Meta (Dias Úteis): ${resTecnico}*
📅 Meta (Calendário): ${resPratico}
-------------------------
_Gerado pela Calculadora V5.0_`;
}

function copiarResumo() {
    const texto = gerarTextoResumo().replace(/\*/g, '').replace(/_/g, ''); // Remove formatação MD para area de transf. simples
    navigator.clipboard.writeText(texto).then(() => {
        const btn = document.getElementById('btnCopiar');
        const original = btn.innerText;
        btn.innerText = "Copiado! ✅";
        setTimeout(() => btn.innerText = original, 2000);
    });
}

function compartilharWhatsapp() {
    const texto = gerarTextoResumo();
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank');
}

function imprimirPagina() {
    window.print();
}

window.onload = init;
