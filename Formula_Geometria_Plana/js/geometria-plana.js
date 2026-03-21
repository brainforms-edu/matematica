const forms = document.querySelectorAll('.calculo-form');
const resultadoDiv = document.getElementById('resultado');
const saidaResultado = document.getElementById('saidaResultado');
const explicacaoDiv = document.getElementById('explicacaoTexto');

const formatEq = (value, decimals = 2) => {
  if (!Number.isFinite(value)) return '—';
  const fixed = value.toFixed(decimals);
  if (fixed.match(/\.0+$/)) return `= ${parseFloat(fixed)}`;
  return `≈ ${fixed}`;
};

const getRawField = (id) => document.getElementById(id)?.value?.trim() ?? '';

function addStaticLabels(selector) {
  document.querySelectorAll(selector).forEach(input => {
    const labelText = input.getAttribute('placeholder') || input.getAttribute('aria-label');
    if (!labelText) return;
    const existing = input.previousElementSibling;
    if (existing && existing.classList?.contains('input-label')) {
      existing.textContent = labelText;
      return;
    }
    const label = document.createElement('label');
    label.className = 'input-label';
    label.textContent = labelText;
    if (input.id) label.setAttribute('for', input.id);
    input.parentNode.insertBefore(label, input);
  });
}

function exibirValoresDigitados(targetId, pares) {
  const el = document.getElementById(targetId);
  if (el) { el.textContent = ''; el.style.display = 'none'; }
}

function posicionarResumoNoFormulario(targetId, ativo) {
  if (targetId !== 'valores-digitados-mobile') return;
  const resumo = document.getElementById(targetId);
  if (!resumo || !ativo) return;
  const header = ativo.querySelector('.input-header');
  if (!header) return;
  const jaPosicionado = resumo.previousElementSibling === header;
  if (!jaPosicionado) {
    header.insertAdjacentElement('afterend', resumo);
  }
}

const resumoMapMobile = {
  perimetroForm: [ ['n', 'ladosPerimetro'], ['lado', 'medidaLado'] ],
  areaQuadradoForm: [ ['lado', 'ladoQuadrado'] ],
  areaRetanguloForm: [ ['base', 'baseRetangulo'], ['altura', 'alturaRetangulo'] ],
  perimetroRetanguloForm: [ ['base', 'basePerimetroRetangulo'], ['altura', 'alturaPerimetroRetangulo'] ],
  areaCirculoForm: [ ['raio', 'raioCirculo'] ],
  perimetroCirculoForm: [ ['raio', 'raioPerimetroCirculo'] ],
  areaTrianguloForm: [ ['base', 'baseTriangulo'], ['altura', 'alturaTriangulo'] ],
  areaParalelogramoForm: [ ['base', 'baseParalelogramo'], ['altura', 'alturaParalelogramo'] ],
  areaLosangoForm: [ ['D', 'diagonalMaiorLosango'], ['d', 'diagonalMenorLosango'] ],
  areaTrapezioForm: [ ['B', 'baseMaiorTrapezio'], ['b', 'baseMenorTrapezio'], ['h', 'alturaTrapezio'] ],
  semelhancaForm: [ ['lado ref', 'ladoMenor'], ['lado correspondente', 'ladoMaior'], ['área ref (opcional)', 'areaReferencial'] ],
  pitagorasForm: [ ['b', 'catetoA'], ['c', 'catetoB'], ['a', 'hipotenusa'] ]
};

const resumoMapDesktop = {
  perimetroFormDesktop: [ ['n', 'ladosPerimetroDesktop'], ['lado', 'medidaLadoDesktop'] ],
  areaQuadradoFormDesktop: [ ['lado', 'ladoQuadradoDesktop'] ],
  areaRetanguloFormDesktop: [ ['base', 'baseRetanguloDesktop'], ['altura', 'alturaRetanguloDesktop'] ],
  perimetroRetanguloFormDesktop: [ ['base', 'basePerimetroRetanguloDesktop'], ['altura', 'alturaPerimetroRetanguloDesktop'] ],
  areaCirculoFormDesktop: [ ['raio', 'raioCirculoDesktop'] ],
  perimetroCirculoFormDesktop: [ ['raio', 'raioPerimetroCirculoDesktop'] ],
  areaTrianguloFormDesktop: [ ['base', 'baseTrianguloDesktop'], ['altura', 'alturaTrianguloDesktop'] ],
  areaParalelogramoFormDesktop: [ ['base', 'baseParalelogramoDesktop'], ['altura', 'alturaParalelogramoDesktop'] ],
  areaLosangoFormDesktop: [ ['D', 'diagonalMaiorLosangoDesktop'], ['d', 'diagonalMenorLosangoDesktop'] ],
  areaTrapezioFormDesktop: [ ['B', 'baseMaiorTrapezioDesktop'], ['b', 'baseMenorTrapezioDesktop'], ['h', 'alturaTrapezioDesktop'] ],
  semelhancaFormDesktop: [ ['lado ref', 'ladoMenorDesktop'], ['lado correspondente', 'ladoMaiorDesktop'], ['área ref (opcional)', 'areaReferencialDesktop'] ],
  pitagorasFormDesktop: [ ['b', 'catetoADesktop'], ['c', 'catetoBDesktop'], ['a', 'hipotenusaDesktop'] ]
};

function atualizarResumoAtivo(targetId, mapa, seletorAtivo) {
  const ativo = document.querySelector(seletorAtivo);
  posicionarResumoNoFormulario(targetId, ativo);
  if (!ativo) return;
  const cfg = mapa[ativo.id];
  if (!cfg) {
    exibirValoresDigitados(targetId, []);
    return;
  }
  const pares = cfg.map(([, campo]) => [campo, getRawField(campo)]);
  exibirValoresDigitados(targetId, pares);
}

const atualizarResumoMobile = () => atualizarResumoAtivo('valores-digitados-mobile', resumoMapMobile, '.calculo-form.active');
const atualizarResumoDesktop = () => atualizarResumoAtivo('valores-digitados-desktop', resumoMapDesktop, '.calculo-form-desktop.active');

function registrarResumoInputs(selector, handler) {
  document.querySelectorAll(selector).forEach(input => {
    input.addEventListener('input', handler);
  });
}

const definicoes = {
  perimetroForm: `
    <strong>Perímetro de Polígonos</strong>
    <p>Polígonos são figuras planas fechadas formadas por segmentos (lados). O perímetro é a soma de todos os lados; em polígonos regulares, todos os lados têm a mesma medida.</p>
    <p><span class="label-colon">Fórmula (regular):</span> <span class="formula">P = n × a</span></p>
    <p><span class="label-colon">Variáveis:</span> n = número de lados (n ≥ 3); a = medida de cada lado.</p>
    <p><span class="label-colon">Dica:</span> confirme unidades e use n inteiro; quadrados/retângulos são casos particulares.</p>
  `,
  areaQuadradoForm: `
    <strong>Área do Quadrado</strong>
    <p>Figura com 4 lados iguais e ângulos retos. A área depende apenas do lado.</p>
    <p><span class="label-colon">Fórmula:</span> <span class="formula">A = lado²</span></p>
    <p><span class="label-colon">Variáveis:</span> lado = comprimento de qualquer lado.</p>
    <p><span class="label-colon">Dica:</span> perímetro usa 4 × lado; mantenha a mesma unidade.</p>
  `,
  areaRetanguloForm: `
    <strong>Área do Retângulo</strong>
    <p>Paralelogramo especial com ângulos retos e lados opostos paralelos. Área é base × altura.</p>
    <p><span class="label-colon">Fórmula:</span> <span class="formula">A = b × h</span></p>
    <p><span class="label-colon">Variáveis:</span> b = base, h = altura (perpendicular).</p>
    <p><span class="label-colon">Dica:</span> base e altura na mesma unidade.</p>
  `,
  perimetroRetanguloForm: `
    <strong>Perímetro do Retângulo</strong>
    <p>Soma das quatro arestas: dois pares de lados iguais.</p>
    <p><span class="label-colon">Fórmula:</span> <span class="formula">P = 2 × (b + h)</span></p>
    <p><span class="label-colon">Variáveis:</span> b = base, h = altura.</p>
    <p><span class="label-colon">Dica:</span> serve para qualquer paralelogramo retângulo.</p>
  `,
  areaCirculoForm: `
    <strong>Área do Círculo</strong>
    <p>Disco delimitado por uma circunferência. A área cresce com o quadrado do raio.</p>
    <p><span class="label-colon">Fórmula:</span> <span class="formula">A = π × r²</span></p>
    <p><span class="label-colon">Variáveis:</span> r = raio.</p>
    <p><span class="label-colon">Dica:</span> use π ≈ 3,14; mantenha unidades.</p>
  `,
  perimetroCirculoForm: `
    <strong>Perímetro do Círculo (Circunferência)</strong>
    <p>Medida do contorno do círculo.</p>
    <p><span class="label-colon">Fórmula:</span> <span class="formula">P = 2 × π × r</span></p>
    <p><span class="label-colon">Variáveis:</span> r = raio.</p>
    <p><span class="label-colon">Dica:</span> use mesma unidade do raio.</p>
  `,
  areaTrianguloForm: `
    <strong>Área do Triângulo</strong>
    <p>Metade do retângulo formado por base e altura (altura é perpendicular à base).</p>
    <p><span class="label-colon">Fórmula:</span> <span class="formula">A = <span class="frac"><span class="top">b × h</span><span class="bottom">2</span></span></span></p>
    <p><span class="label-colon">Variáveis:</span> b = base, h = altura.</p>
    <p><span class="label-colon">Dica:</span> em triângulos retângulos, um cateto pode ser a altura da base adjacente.</p>
  `,
  areaParalelogramoForm: `
    <strong>Área do Paralelogramo</strong>
    <p>Quadrilátero com lados opostos paralelos. A área depende da base e da altura perpendicular entre as bases.</p>
    <p><span class="label-colon">Fórmula:</span> <span class="formula">A = b × h</span></p>
    <p><span class="label-colon">Variáveis:</span> b = base, h = altura (distância entre bases).</p>
    <p><span class="label-colon">Dica:</span> retângulo e losango são casos especiais.</p>
  `,
  areaLosangoForm: `
    <strong>Área do Losango</strong>
    <p>Paralelogramo com quatro lados iguais. A área é metade do produto das diagonais.</p>
    <p><span class="label-colon">Fórmula:</span> <span class="formula">A = <span class="frac"><span class="top">D × d</span><span class="bottom">2</span></span></span></p>
    <p><span class="label-colon">Variáveis:</span> D = diagonal maior, d = diagonal menor.</p>
    <p><span class="label-colon">Dica:</span> diagonais são perpendiculares; medindo-as obtém a área rapidamente.</p>
  `,
  areaTrapezioForm: `
    <strong>Área do Trapézio</strong>
    <p>Quadrilátero com um par de lados paralelos (bases). A área é a média das bases vezes a altura.</p>
    <p><span class="label-colon">Fórmula:</span> <span class="formula">A = <span class="frac"><span class="top">(B + b) × h</span><span class="bottom">2</span></span></span></p>
    <p><span class="label-colon">Variáveis:</span> B = base maior, b = base menor, h = altura (perpendicular às bases).</p>
    <p><span class="label-colon">Dica:</span> se for isósceles, os lados não paralelos são iguais.</p>
  `,
  semelhancaForm: `
    <strong>Semelhança de Triângulos</strong>
    <p>Triângulos são semelhantes quando têm a mesma forma (ângulos iguais). Os lados correspondentes mantêm uma razão constante k.</p>
    <p><span class="label-colon">Razão linear:</span> k = lado_correspondente ÷ lado_referência.</p>
    <p><span class="label-colon">Razão de áreas:</span> k² (área cresce com o quadrado da razão).</p>
    <p><span class="label-colon">Uso:</span> para escalar comprimentos, multiplique por k; para áreas, multiplique por k².</p>
  `,
  pitagorasForm: `
    <strong>Teorema de Pitágoras</strong>
    <p>Em triângulos retângulos, a hipotenusa (a) satisfaz: a² = b² + c². Conhecendo dois lados, encontre o terceiro.</p>
    <p><span class="label-colon">Fórmula padrão:</span> <span class="formula">a² = b² + c²</span></p>
    <p><span class="label-colon">Para achar cateto:</span> b = √(a² − c²) ou c = √(a² − b²).</p>
    <p><span class="label-colon">Dica:</span> use unidades iguais; só vale para triângulos retângulos.</p>
  `
};

function atualizarDefinicao(formId) {
  explicacaoDiv.innerHTML = definicoes[formId] || '';
}

dropdownButton.addEventListener('click', () => {
  const expanded = dropdownButton.getAttribute('aria-expanded') === 'true';
  dropdownContent.classList.toggle('show', !expanded);
  dropdownButton.setAttribute('aria-expanded', !expanded);
  arrowIcon.classList.toggle('open', !expanded);
});

dropdownContent.querySelectorAll('button').forEach(btn => {
  btn.addEventListener('click', () => {
    const formId = btn.getAttribute('data-form');
    forms.forEach(f => f.classList.remove('active'));
    document.getElementById(formId).classList.add('active');
    resultadoDiv.style.display = 'none';
    saidaResultado.textContent = '';
    exibirValoresDigitados('valores-digitados-mobile', []);
    atualizarResumoMobile();
    dropdownContent.classList.remove('show');
    dropdownButton.setAttribute('aria-expanded', false);
    arrowIcon.classList.remove('open');
    dropdownButton.textContent = btn.textContent;
    dropdownButton.appendChild(arrowIcon);
    atualizarDefinicao(formId);
  });
});

window.addEventListener('load', () => {
  atualizarDefinicao('perimetroForm');
  atualizarResumoMobile();
  atualizarResumoDesktop();
  registrarResumoInputs('.calculo-form input', atualizarResumoMobile);
  registrarResumoInputs('.calculo-form-desktop input', atualizarResumoDesktop);
});

async function calcularPerimetro() {
  const n = parseInt(document.getElementById('ladosPerimetro').value, 10);
  const lado = parseFloat(document.getElementById('medidaLado').value);
  if (isNaN(n) || n < 3 || isNaN(lado) || lado <= 0) { alert('Informe n ≥ 3 e lado maior que zero.'); return; }
  const perimetro = n * lado;
  exibirValoresDigitados('valores-digitados-mobile', [
    ['n', getRawField('ladosPerimetro')],
    ['lado', getRawField('medidaLado')]
  ]);
  resultadoDiv.style.display = 'block';
  const passos = `
    <p><strong>Passo 1:</strong> Fórmula P = n × a.</p>
    <p><strong>Passo 2:</strong> Substitua: P = ${n} × ${lado.toFixed(2)}.</p>
    <p><strong>Passo 3:</strong> Multiplique: P = ${perimetro.toFixed(4)}.</p>
    <p><strong>Resultado:</strong> P ${formatEq(perimetro)} (mesma unidade do lado).</p>
  `;
  saidaResultado.innerHTML = `<p><strong>Perímetro:</strong> ${formatEq(perimetro)}</p>${passos}`;
  try {
    const resp = await enviarHistorico(21, { n, lado }, { perimetro });
    if (resp && resp.novas_conquistas?.length) {
      const conquistas = await window.carregarConquistasAPI?.() ?? [];
      window.mostrarNovasConquistasLocal?.(conquistas, false, resp.novas_conquistas);
    }
  } catch(e){ console.error(e); }
}

async function calcularAreaQuadrado() {
  const lado = parseFloat(document.getElementById('ladoQuadrado').value);
  if (isNaN(lado) || lado <= 0) { alert('Informe um lado maior que zero.'); return; }
  const area = lado * lado;
  exibirValoresDigitados('valores-digitados-mobile', [
    ['lado', getRawField('ladoQuadrado')]
  ]);
  resultadoDiv.style.display = 'block';
  const passos = `
    <p><strong>Passo 1:</strong> Fórmula A = lado².</p>
    <p><strong>Passo 2:</strong> Substitua: A = ${lado.toFixed(2)}².</p>
    <p><strong>Passo 3:</strong> Eleve ao quadrado: A = ${area.toFixed(4)}.</p>
    <p><strong>Resultado:</strong> A ${formatEq(area)} unidades².</p>
  `;
  saidaResultado.innerHTML = `<p><strong>Área do quadrado:</strong> ${formatEq(area)} unidades².</p>${passos}`;
  try {
    const resp = await enviarHistorico(27, { lado }, { area });
    if (resp && resp.novas_conquistas?.length) {
      const conquistas = await window.carregarConquistasAPI?.() ?? [];
      window.mostrarNovasConquistasLocal?.(conquistas, false, resp.novas_conquistas);
    }
  } catch(e){ console.error(e); }
}

async function calcularAreaCirculo() {
  const r = parseFloat(document.getElementById('raioCirculo').value);
  if (isNaN(r) || r <= 0) { alert('Informe raio maior que zero.'); return; }
  const pi = Math.PI;
  const area = pi * r * r;
  exibirValoresDigitados('valores-digitados-mobile', [
    ['raio', getRawField('raioCirculo')]
  ]);
  resultadoDiv.style.display = 'block';
  const passos = `
    <p><strong>Passo 1:</strong> Fórmula A = π × r².</p>
    <p><strong>Passo 2:</strong> Substitua: A = π × ${r.toFixed(2)}².</p>
    <p><strong>Passo 3:</strong> Eleve ao quadrado: r² = ${ (r*r).toFixed(4) }.</p>
    <p><strong>Passo 4:</strong> Multiplique por π: A = π × ${ (r*r).toFixed(4) } ≈ ${area.toFixed(4)}.</p>
    <p><strong>Resultado:</strong> A ${formatEq(area)} unidades².</p>
  `;
  saidaResultado.innerHTML = `<p><strong>Área do círculo:</strong> ${formatEq(area)} unidades².</p>${passos}`;
  try {
    const resp = await enviarHistorico(25, { r }, { area });
    if (resp && resp.novas_conquistas?.length) {
      const conquistas = await window.carregarConquistasAPI?.() ?? [];
      window.mostrarNovasConquistasLocal?.(conquistas, false, resp.novas_conquistas);
    }
  } catch(e){ console.error(e); }
}


async function calcularPerimetroCirculo() {
  const r = parseFloat(document.getElementById('raioPerimetroCirculo').value);
  if (isNaN(r) || r <= 0) { alert('Informe raio maior que zero.'); return; }
  const perimetro = 2 * Math.PI * r;
  exibirValoresDigitados('valores-digitados-mobile', [
    ['raio', getRawField('raioPerimetroCirculo')]
  ]);
  resultadoDiv.style.display = 'block';
  const passos = `
    <p><strong>Passo 1:</strong> Fórmula P = 2 × π × r.</p>
    <p><strong>Passo 2:</strong> Substitua: P = 2 × π × ${r.toFixed(2)}.</p>
    <p><strong>Passo 3:</strong> Multiplique: P ≈ ${perimetro.toFixed(4)}.</p>
    <p><strong>Resultado:</strong> P ${formatEq(perimetro)} (mesma unidade do raio).</p>
  `;
  saidaResultado.innerHTML = `<p><strong>Perímetro do círculo:</strong> ${formatEq(perimetro)}</p>${passos}`;
  try {
    const resp = await enviarHistorico(29, { r }, { perimetro });
    if (resp && resp.novas_conquistas?.length) {
      const conquistas = await window.carregarConquistasAPI?.() ?? [];
      window.mostrarNovasConquistasLocal?.(conquistas, false, resp.novas_conquistas);
    }
  } catch(e){ console.error(e); }
}

async function calcularAreaTriangulo() {
  const b = parseFloat(document.getElementById('baseTriangulo').value);
  const h = parseFloat(document.getElementById('alturaTriangulo').value);
  if (isNaN(b) || b <= 0 || isNaN(h) || h <= 0) { alert('Informe base e altura maiores que zero.'); return; }
  const area = (b * h) / 2;
  exibirValoresDigitados('valores-digitados-mobile', [
    ['base', getRawField('baseTriangulo')],
    ['altura', getRawField('alturaTriangulo')]
  ]);
  resultadoDiv.style.display = 'block';
  const passos = `
    <p><strong>Passo 1:</strong> Fórmula A = <span class="frac"><span class="top">b × h</span><span class="bottom">2</span></span>.</p>
    <p><strong>Passo 2:</strong> Substitua: A = <span class="frac"><span class="top">${b.toFixed(2)} × ${h.toFixed(2)}</span><span class="bottom">2</span></span>.</p>
    <p><strong>Passo 3:</strong> Multiplique: b × h = ${(b*h).toFixed(4)}.</p>
    <p><strong>Passo 4:</strong> Divida por 2: A = ${area.toFixed(4)}.</p>
    <p><strong>Resultado:</strong> A ${formatEq(area)} unidades².</p>
  `;
  saidaResultado.innerHTML = `<p><strong>Área do triângulo:</strong> ${formatEq(area)} unidades².</p>${passos}`;
  try {
    const resp = await enviarHistorico(26, { b, h }, { area });
    if (resp && resp.novas_conquistas?.length) {
      const conquistas = await window.carregarConquistasAPI?.() ?? [];
      window.mostrarNovasConquistasLocal?.(conquistas, false, resp.novas_conquistas);
    }
  } catch(e){ console.error(e); }
}

async function calcularAreaParalelogramo() {
  const b = parseFloat(document.getElementById('baseParalelogramo').value);
  const h = parseFloat(document.getElementById('alturaParalelogramo').value);
  if (isNaN(b) || b <= 0 || isNaN(h) || h <= 0) { alert('Informe base e altura maiores que zero.'); return; }
  const area = b * h;
  exibirValoresDigitados('valores-digitados-mobile', [
    ['base', getRawField('baseParalelogramo')],
    ['altura', getRawField('alturaParalelogramo')]
  ]);
  resultadoDiv.style.display = 'block';
  const passos = `
    <p><strong>Passo 1:</strong> Fórmula A = b × h.</p>
    <p><strong>Passo 2:</strong> Substitua: A = ${b.toFixed(2)} × ${h.toFixed(2)}.</p>
    <p><strong>Passo 3:</strong> Multiplique: A = ${area.toFixed(4)}.</p>
    <p><strong>Resultado:</strong> A ${formatEq(area)} unidades².</p>
  `;
  saidaResultado.innerHTML = `<p><strong>Área do paralelogramo:</strong> ${formatEq(area)} unidades².</p>${passos}`;
  try {
    const resp = await enviarHistorico(30, { b, h }, { area });
    if (resp && resp.novas_conquistas?.length) {
      const conquistas = await window.carregarConquistasAPI?.() ?? [];
      window.mostrarNovasConquistasLocal?.(conquistas, false, resp.novas_conquistas);
    }
  } catch(e){ console.error(e); }
}

async function calcularAreaLosango() {
  const D = parseFloat(document.getElementById('diagonalMaiorLosango').value);
  const d = parseFloat(document.getElementById('diagonalMenorLosango').value);
  if (isNaN(D) || D <= 0 || isNaN(d) || d <= 0) { alert('Informe diagonais maiores que zero.'); return; }
  const area = (D * d) / 2;
  exibirValoresDigitados('valores-digitados-mobile', [
    ['D', getRawField('diagonalMaiorLosango')],
    ['d', getRawField('diagonalMenorLosango')]
  ]);
  resultadoDiv.style.display = 'block';
  const passos = `
    <p><strong>Passo 1:</strong> Fórmula A = <span class="frac"><span class="top">D × d</span><span class="bottom">2</span></span>.</p>
    <p><strong>Passo 2:</strong> Substitua: A = <span class="frac"><span class="top">${D.toFixed(2)} × ${d.toFixed(2)}</span><span class="bottom">2</span></span>.</p>
    <p><strong>Passo 3:</strong> Produto das diagonais: ${(D * d).toFixed(4)}.</p>
    <p><strong>Passo 4:</strong> Divida por 2: A = ${area.toFixed(4)}.</p>
    <p><strong>Resultado:</strong> A ${formatEq(area)} unidades².</p>
  `;
  saidaResultado.innerHTML = `<p><strong>Área do losango:</strong> ${formatEq(area)} unidades².</p>${passos}`;
  try {
    const resp = await enviarHistorico(31, { D, d }, { area });
    if (resp && resp.novas_conquistas?.length) {
      const conquistas = await window.carregarConquistasAPI?.() ?? [];
      window.mostrarNovasConquistasLocal?.(conquistas, false, resp.novas_conquistas);
    }
  } catch(e){ console.error(e); }
}

async function calcularAreaTrapezio() {
  const B = parseFloat(document.getElementById('baseMaiorTrapezio').value);
  const b = parseFloat(document.getElementById('baseMenorTrapezio').value);
  const h = parseFloat(document.getElementById('alturaTrapezio').value);
  if (isNaN(B) || B <= 0 || isNaN(b) || b <= 0 || isNaN(h) || h <= 0) { alert('Informe bases e altura maiores que zero.'); return; }
  const area = ((B + b) * h) / 2;
  exibirValoresDigitados('valores-digitados-mobile', [
    ['B', getRawField('baseMaiorTrapezio')],
    ['b', getRawField('baseMenorTrapezio')],
    ['h', getRawField('alturaTrapezio')]
  ]);
  resultadoDiv.style.display = 'block';
  const passos = `
    <p><strong>Passo 1:</strong> Fórmula A = <span class="frac"><span class="top">(B + b) × h</span><span class="bottom">2</span></span>.</p>
    <p><strong>Passo 2:</strong> Some bases: B + b = ${(B + b).toFixed(4)}.</p>
    <p><strong>Passo 3:</strong> Multiplique pela altura: ${(B + b).toFixed(4)} × ${h.toFixed(2)} = ${((B + b) * h).toFixed(4)}.</p>
    <p><strong>Passo 4:</strong> Divida por 2: A = ${area.toFixed(4)}.</p>
    <p><strong>Resultado:</strong> A ${formatEq(area)} unidades².</p>
  `;
  saidaResultado.innerHTML = `<p><strong>Área do trapézio:</strong> ${formatEq(area)} unidades².</p>${passos}`;
  try {
    const resp = await enviarHistorico(32, { B, b, h }, { area });
    if (resp && resp.novas_conquistas?.length) {
      const conquistas = await window.carregarConquistasAPI?.() ?? [];
      window.mostrarNovasConquistasLocal?.(conquistas, false, resp.novas_conquistas);
    }
  } catch(e){ console.error(e); }
}

async function calcularAreaRetangulo() {
  const base = parseFloat(document.getElementById('baseRetangulo').value);
  const altura = parseFloat(document.getElementById('alturaRetangulo').value);
  if (isNaN(base) || base <= 0 || isNaN(altura) || altura <= 0) { alert('Informe base e altura maiores que zero.'); return; }
  const area = base * altura;
  exibirValoresDigitados('valores-digitados-mobile', [
    ['base', getRawField('baseRetangulo')],
    ['altura', getRawField('alturaRetangulo')]
  ]);
  resultadoDiv.style.display = 'block';
  const passos = `
    <p><strong>Passo 1:</strong> Fórmula A = b × h.</p>
    <p><strong>Passo 2:</strong> Substitua: A = ${base.toFixed(2)} × ${altura.toFixed(2)}.</p>
    <p><strong>Passo 3:</strong> Multiplique: A = ${area.toFixed(4)}.</p>
    <p><strong>Resultado:</strong> A ${formatEq(area)} unidades².</p>
  `;
  saidaResultado.innerHTML = `<p><strong>Área:</strong> ${formatEq(area)} unidades².</p>${passos}`;
  try {
    const resp = await enviarHistorico(22, { base, altura }, { area });
    if (resp && resp.novas_conquistas?.length) {
      const conquistas = await window.carregarConquistasAPI?.() ?? [];
      window.mostrarNovasConquistasLocal?.(conquistas, false, resp.novas_conquistas);
    }
  } catch(e){ console.error(e); }
}

async function calcularPerimetroRetangulo() {
  const base = parseFloat(document.getElementById('basePerimetroRetangulo').value);
  const altura = parseFloat(document.getElementById('alturaPerimetroRetangulo').value);
  if (isNaN(base) || base <= 0 || isNaN(altura) || altura <= 0) { alert('Informe base e altura maiores que zero.'); return; }
  const perimetro = 2 * (base + altura);
  exibirValoresDigitados('valores-digitados-mobile', [
    ['base', getRawField('basePerimetroRetangulo')],
    ['altura', getRawField('alturaPerimetroRetangulo')]
  ]);
  resultadoDiv.style.display = 'block';
  const passos = `
    <p><strong>Passo 1:</strong> Fórmula P = 2 × (b + h).</p>
    <p><strong>Passo 2:</strong> Substitua: P = 2 × (${base.toFixed(2)} + ${altura.toFixed(2)}).</p>
    <p><strong>Passo 3:</strong> Some: b + h = ${(base + altura).toFixed(4)}.</p>
    <p><strong>Passo 4:</strong> Multiplique por 2: P = ${perimetro.toFixed(4)}.</p>
    <p><strong>Resultado:</strong> P ${formatEq(perimetro)} (mesma unidade dos lados).</p>
  `;
  saidaResultado.innerHTML = `<p><strong>Perímetro do retângulo:</strong> ${formatEq(perimetro)}</p>${passos}`;
  try {
    const resp = await enviarHistorico(28, { base, altura }, { perimetro });
    if (resp && resp.novas_conquistas?.length) {
      const conquistas = await window.carregarConquistasAPI?.() ?? [];
      window.mostrarNovasConquistasLocal?.(conquistas, false, resp.novas_conquistas);
    }
  } catch(e){ console.error(e); }
}

async function calcularSemelhanca() {
  const ladoRef = parseFloat(document.getElementById('ladoMenor').value);
  const ladoComp = parseFloat(document.getElementById('ladoMaior').value);
  const areaRef = parseFloat(document.getElementById('areaReferencial').value);
  if (isNaN(ladoRef) || ladoRef <= 0 || isNaN(ladoComp) || ladoComp <= 0) {
    alert('Informe lados correspondentes maiores que zero.');
    return;
  }
  exibirValoresDigitados('valores-digitados-mobile', [
    ['lado ref', getRawField('ladoMenor')],
    ['lado correspondente', getRawField('ladoMaior')],
    ['área ref (opcional)', getRawField('areaReferencial')]
  ]);
  const k = ladoComp / ladoRef;
  const razaoArea = k * k;
  const areaProj = !isNaN(areaRef) && areaRef > 0 ? areaRef * razaoArea : null;
  resultadoDiv.style.display = 'block';
  const passos = `
    <p><strong>Passo 1:</strong> Razão linear k = lado correspondente ÷ lado de referência = ${ladoComp.toFixed(2)} ÷ ${ladoRef.toFixed(2)} = ${k.toFixed(4)}.</p>
    <p><strong>Passo 2:</strong> Razão de áreas = k² = ${k.toFixed(4)}² = ${razaoArea.toFixed(4)}.</p>
    ${areaProj ? `<p><strong>Passo 3:</strong> Área projetada = área referência × k² = ${areaRef.toFixed(2)} × ${razaoArea.toFixed(4)} = ${areaProj.toFixed(4)}.</p>` : '<p><strong>Passo 3:</strong> Multiplique qualquer medida de área pelo fator k² para encontrar a correspondente.</p>'}
  `;
  const resultadoArea = areaProj ? `<p><strong>Área do triângulo semelhante:</strong> ${formatEq(areaProj)} unidades².</p>` : '';
  saidaResultado.innerHTML = `<p><strong>Razão linear (k):</strong> ${k.toFixed(4)}</p><p><strong>Razão de áreas (k²):</strong> ${razaoArea.toFixed(4)}</p>${resultadoArea}${passos}`;
  try {
    const resp = await enviarHistorico(23, { ladoRef, ladoComp, areaRef }, { k, razaoArea, areaProj });
    if (resp && resp.novas_conquistas?.length) {
      const conquistas = await window.carregarConquistasAPI?.() ?? [];
      window.mostrarNovasConquistasLocal?.(conquistas, false, resp.novas_conquistas);
    }
  } catch(e){ console.error(e); }
}

async function calcularPitagoras() {
  const bRaw = getRawField('catetoA'); // cateto b
  const cRaw = getRawField('catetoB'); // cateto c
  const aRaw = getRawField('hipotenusa'); // hipotenusa a
  const b = parseFloat(bRaw);
  const c = parseFloat(cRaw);
  const a = parseFloat(aRaw);

  const conhecidos = [a, b, c].filter(v => Number.isFinite(v) && v > 0).length;
  if (conhecidos < 2) { alert('Informe pelo menos dois valores positivos (dois catetos ou a hipotenusa).'); return; }

  let achou = '';
  let calculado = null;
  let passos = '';

  if (!Number.isFinite(a) && Number.isFinite(b) && Number.isFinite(c)) {
    const a2 = b * b + c * c;
    const hip = Math.sqrt(a2);
    calculado = hip;
    achou = 'hipotenusa a';
    passos = `
      <p><strong>Passo 1:</strong> a² = b² + c².</p>
      <p><strong>Passo 2:</strong> a² = ${b.toFixed(2)}² + ${c.toFixed(2)}² = ${a2.toFixed(4)}.</p>
      <p><strong>Passo 3:</strong> a = √${a2.toFixed(4)} ${formatEq(hip)}</p>
    `;
    saidaResultado.innerHTML = `<p><strong>Hipotenusa (a):</strong> ${formatEq(hip)}</p>${passos}`;
  } else if (!Number.isFinite(b) && Number.isFinite(c) && Number.isFinite(a)) {
    if (a <= c) { alert('Para calcular cateto b: hipotenusa (a) deve ser maior que o outro cateto.'); return; }
    const b2 = a * a - c * c;
    const cat = Math.sqrt(b2);
    calculado = cat;
    achou = 'cateto b';
    passos = `
      <p><strong>Passo 1:</strong> b² = a² − c².</p>
      <p><strong>Passo 2:</strong> b² = ${a.toFixed(2)}² − ${c.toFixed(2)}² = ${b2.toFixed(4)}.</p>
      <p><strong>Passo 3:</strong> b = √${b2.toFixed(4)} ${formatEq(cat)}</p>
    `;
    saidaResultado.innerHTML = `<p><strong>Cateto b:</strong> ${formatEq(cat)}</p>${passos}`;
  } else if (!Number.isFinite(c) && Number.isFinite(b) && Number.isFinite(a)) {
    if (a <= b) { alert('Para calcular cateto c: hipotenusa (a) deve ser maior que o outro cateto.'); return; }
    const c2 = a * a - b * b;
    const cat = Math.sqrt(c2);
    calculado = cat;
    achou = 'cateto c';
    passos = `
      <p><strong>Passo 1:</strong> c² = a² − b².</p>
      <p><strong>Passo 2:</strong> c² = ${a.toFixed(2)}² − ${b.toFixed(2)}² = ${c2.toFixed(4)}.</p>
      <p><strong>Passo 3:</strong> c = √${c2.toFixed(4)} ${formatEq(cat)}</p>
    `;
    saidaResultado.innerHTML = `<p><strong>Cateto c:</strong> ${formatEq(cat)}</p>${passos}`;
  } else {
    alert('Preencha somente dois valores para calcular o terceiro (valores positivos).');
    return;
  }

  exibirValoresDigitados('valores-digitados-mobile', [
    ['b', bRaw],
    ['c', cRaw],
    ['a', aRaw]
  ]);

  resultadoDiv.style.display = 'block';
  try {
    const resp = await enviarHistorico(24, { a, b, c }, { achou, valor: calculado });
    if (resp && resp.novas_conquistas?.length) {
      const conquistas = await window.carregarConquistasAPI?.() ?? [];
      window.mostrarNovasConquistasLocal?.(conquistas, false, resp.novas_conquistas);
    }
  } catch(e){ console.error(e); }
}

/* Desktop controls */
function toggleDropdownDesktop(event) {
  if (event) event.stopPropagation();
  const dropdownContent = document.getElementById('dropdownContentDesktop');
  const dropdownButton = document.getElementById('dropdownButtonDesktop');
  dropdownContent.classList.toggle('show');
  dropdownButton.classList.toggle('active');
}

window.addEventListener('click', function(e) {
  if (!e.target.closest('.dropdown-desktop')) {
    const dropdownContent = document.getElementById('dropdownContentDesktop');
    const dropdownButton = document.getElementById('dropdownButtonDesktop');
    if (dropdownContent && dropdownContent.classList.contains('show')) {
      dropdownContent.classList.remove('show');
      dropdownButton.classList.remove('active');
    }
  }
});

function mostrarFormularioDesktop(tipo) {
  const forms = document.querySelectorAll('.calculo-form-desktop');
  forms.forEach(form => form.classList.remove('active'));
  document.getElementById('resultado-desktop').style.display = 'none';
  const formId = tipo + 'FormDesktop';
  const form = document.getElementById(formId);
  if (form) form.classList.add('active');

  const dropdownContent = document.getElementById('dropdownContentDesktop');
  const dropdownButton = document.getElementById('dropdownButtonDesktop');
  dropdownContent.classList.remove('show');
  dropdownButton.classList.remove('active');

  const tituloFormula = document.getElementById('tituloFormulaDesktop');
  const textos = {
    perimetro: 'Perímetro de Polígono Regular',
    areaQuadrado: 'Área do Quadrado',
    areaRetangulo: 'Área do Retângulo',
    perimetroRetangulo: 'Perímetro do Retângulo',
    areaCirculo: 'Área do Círculo',
    perimetroCirculo: 'Perímetro do Círculo',
    areaTriangulo: 'Área do Triângulo',
    areaParalelogramo: 'Área do Paralelogramo',
    areaLosango: 'Área do Losango',
    areaTrapezio: 'Área do Trapézio',
    semelhanca: 'Semelhança de Triângulos',
    pitagoras: 'Teorema de Pitágoras'
  };
  if (tituloFormula && textos[tipo]) tituloFormula.textContent = textos[tipo];
  if (dropdownButton && textos[tipo]) {
    dropdownButton.childNodes[0].textContent = textos[tipo] + ' ';
  }

  const explicacaoDesktop = document.getElementById('explicacaoTextoDesktop');
  const definicoesDesktop = {
    perimetro: definicoes.perimetroForm,
    areaQuadrado: definicoes.areaQuadradoForm,
    areaRetangulo: definicoes.areaRetanguloForm,
    perimetroRetangulo: definicoes.perimetroRetanguloForm,
    areaCirculo: definicoes.areaCirculoForm,
    perimetroCirculo: definicoes.perimetroCirculoForm,
    areaTriangulo: definicoes.areaTrianguloForm,
    areaParalelogramo: definicoes.areaParalelogramoForm,
    areaLosango: definicoes.areaLosangoForm,
    areaTrapezio: definicoes.areaTrapezioForm,
    semelhanca: definicoes.semelhancaForm,
    pitagoras: definicoes.pitagorasForm
  };
  if (tipo && definicoesDesktop[tipo]) {
    explicacaoDesktop.innerHTML = definicoesDesktop[tipo];
  }

  exibirValoresDigitados('valores-digitados-desktop', []);
  atualizarResumoDesktop();
}

/* Cálculos Desktop */
async function calcularPerimetroDesktop() {
  const n = parseInt(document.getElementById('ladosPerimetroDesktop').value, 10);
  const lado = parseFloat(document.getElementById('medidaLadoDesktop').value);
  if (isNaN(n) || n < 3 || isNaN(lado) || lado <= 0) { alert('Informe n ≥ 3 e lado maior que zero.'); return; }
  const perimetro = n * lado;
  const resultadoDivDesk = document.getElementById('resultado-desktop');
  const mensagem = document.getElementById('mensagemResultadoDesktop');
  const passoAPasso = document.getElementById('passoAPassoDesktop');
  exibirValoresDigitados('valores-digitados-desktop', [
    ['n', getRawField('ladosPerimetroDesktop')],
    ['lado', getRawField('medidaLadoDesktop')]
  ]);
  mensagem.innerHTML = `<strong>Perímetro:</strong> ${formatEq(perimetro)} (mesma unidade do lado).`;
  passoAPasso.innerHTML = `
    <p><strong>Passo 1:</strong> P = n × a.</p>
    <p><strong>Passo 2:</strong> P = ${n} × ${lado.toFixed(2)}.</p>
    <p><strong>Passo 3:</strong> P = ${perimetro.toFixed(4)}.</p>
    <p><strong>Resultado:</strong> P ${formatEq(perimetro)}.</p>
  `;
  resultadoDivDesk.style.display = 'block';
  try {
    const resp = await enviarHistorico(21, { n, lado }, { perimetro });
    if (resp && resp.novas_conquistas?.length) {
      const conquistas = await window.carregarConquistasAPI?.() ?? [];
      window.mostrarNovasConquistasLocal?.(conquistas, false, resp.novas_conquistas);
    }
  } catch(e){ console.error(e); }
}

async function calcularAreaParalelogramoDesktop() {
  const b = parseFloat(document.getElementById('baseParalelogramoDesktop').value);
  const h = parseFloat(document.getElementById('alturaParalelogramoDesktop').value);
  if (isNaN(b) || b <= 0 || isNaN(h) || h <= 0) { alert('Informe base e altura maiores que zero.'); return; }
  const area = b * h;
  const resultadoDivDesk = document.getElementById('resultado-desktop');
  const mensagem = document.getElementById('mensagemResultadoDesktop');
  const passoAPasso = document.getElementById('passoAPassoDesktop');
  exibirValoresDigitados('valores-digitados-desktop', [
    ['base', getRawField('baseParalelogramoDesktop')],
    ['altura', getRawField('alturaParalelogramoDesktop')]
  ]);
  mensagem.innerHTML = `<strong>Área do paralelogramo:</strong> ${formatEq(area)} unidades².`;
  passoAPasso.innerHTML = `
    <p><strong>Passo 1:</strong> A = b × h.</p>
    <p><strong>Passo 2:</strong> A = ${b.toFixed(2)} × ${h.toFixed(2)}.</p>
    <p><strong>Passo 3:</strong> A = ${area.toFixed(4)}.</p>
    <p><strong>Resultado:</strong> A ${formatEq(area)} unidades².</p>
  `;
  resultadoDivDesk.style.display = 'block';
  try {
    const resp = await enviarHistorico(30, { b, h }, { area });
    if (resp && resp.novas_conquistas?.length) {
      const conquistas = await window.carregarConquistasAPI?.() ?? [];
      window.mostrarNovasConquistasLocal?.(conquistas, false, resp.novas_conquistas);
    }
  } catch(e){ console.error(e); }
}

async function calcularAreaLosangoDesktop() {
  const D = parseFloat(document.getElementById('diagonalMaiorLosangoDesktop').value);
  const d = parseFloat(document.getElementById('diagonalMenorLosangoDesktop').value);
  if (isNaN(D) || D <= 0 || isNaN(d) || d <= 0) { alert('Informe diagonais maiores que zero.'); return; }
  const area = (D * d) / 2;
  const resultadoDivDesk = document.getElementById('resultado-desktop');
  const mensagem = document.getElementById('mensagemResultadoDesktop');
  const passoAPasso = document.getElementById('passoAPassoDesktop');
  exibirValoresDigitados('valores-digitados-desktop', [
    ['D', getRawField('diagonalMaiorLosangoDesktop')],
    ['d', getRawField('diagonalMenorLosangoDesktop')]
  ]);
  mensagem.innerHTML = `<strong>Área do losango:</strong> ${formatEq(area)} unidades².`;
  passoAPasso.innerHTML = `
    <p><strong>Passo 1:</strong> A = <span class="frac"><span class="top">D × d</span><span class="bottom">2</span></span>.</p>
    <p><strong>Passo 2:</strong> A = <span class="frac"><span class="top">${D.toFixed(2)} × ${d.toFixed(2)}</span><span class="bottom">2</span></span>.</p>
    <p><strong>Passo 3:</strong> Produto das diagonais: ${(D * d).toFixed(4)}.</p>
    <p><strong>Passo 4:</strong> A = ${area.toFixed(4)}.</p>
    <p><strong>Resultado:</strong> A ${formatEq(area)} unidades².</p>
  `;
  resultadoDivDesk.style.display = 'block';
  try {
    const resp = await enviarHistorico(31, { D, d }, { area });
    if (resp && resp.novas_conquistas?.length) {
      const conquistas = await window.carregarConquistasAPI?.() ?? [];
      window.mostrarNovasConquistasLocal?.(conquistas, false, resp.novas_conquistas);
    }
  } catch(e){ console.error(e); }
}

async function calcularAreaTrapezioDesktop() {
  const B = parseFloat(document.getElementById('baseMaiorTrapezioDesktop').value);
  const b = parseFloat(document.getElementById('baseMenorTrapezioDesktop').value);
  const h = parseFloat(document.getElementById('alturaTrapezioDesktop').value);
  if (isNaN(B) || B <= 0 || isNaN(b) || b <= 0 || isNaN(h) || h <= 0) { alert('Informe bases e altura maiores que zero.'); return; }
  const area = ((B + b) * h) / 2;
  const resultadoDivDesk = document.getElementById('resultado-desktop');
  const mensagem = document.getElementById('mensagemResultadoDesktop');
  const passoAPasso = document.getElementById('passoAPassoDesktop');
  exibirValoresDigitados('valores-digitados-desktop', [
    ['B', getRawField('baseMaiorTrapezioDesktop')],
    ['b', getRawField('baseMenorTrapezioDesktop')],
    ['h', getRawField('alturaTrapezioDesktop')]
  ]);
  mensagem.innerHTML = `<strong>Área do trapézio:</strong> ${formatEq(area)} unidades².`;
  passoAPasso.innerHTML = `
    <p><strong>Passo 1:</strong> A = <span class="frac"><span class="top">(B + b) × h</span><span class="bottom">2</span></span>.</p>
    <p><strong>Passo 2:</strong> B + b = ${(B + b).toFixed(4)}.</p>
    <p><strong>Passo 3:</strong> (B + b) × h = ${((B + b) * h).toFixed(4)}.</p>
    <p><strong>Passo 4:</strong> A = ${area.toFixed(4)}.</p>
    <p><strong>Resultado:</strong> A ${formatEq(area)} unidades².</p>
  `;
  resultadoDivDesk.style.display = 'block';
  try {
    const resp = await enviarHistorico(32, { B, b, h }, { area });
    if (resp && resp.novas_conquistas?.length) {
      const conquistas = await window.carregarConquistasAPI?.() ?? [];
      window.mostrarNovasConquistasLocal?.(conquistas, false, resp.novas_conquistas);
    }
  } catch(e){ console.error(e); }
}

async function calcularAreaQuadradoDesktop() {
  const lado = parseFloat(document.getElementById('ladoQuadradoDesktop').value);
  if (isNaN(lado) || lado <= 0) { alert('Informe lado maior que zero.'); return; }
  const area = lado * lado;
  const resultadoDivDesk = document.getElementById('resultado-desktop');
  const mensagem = document.getElementById('mensagemResultadoDesktop');
  const passoAPasso = document.getElementById('passoAPassoDesktop');
  exibirValoresDigitados('valores-digitados-desktop', [
    ['lado', getRawField('ladoQuadradoDesktop')]
  ]);
  mensagem.innerHTML = `<strong>Área do quadrado:</strong> ${formatEq(area)} unidades².`;
  passoAPasso.innerHTML = `
    <p><strong>Passo 1:</strong> A = lado².</p>
    <p><strong>Passo 2:</strong> A = ${lado.toFixed(2)}².</p>
    <p><strong>Passo 3:</strong> A = ${area.toFixed(4)}.</p>
    <p><strong>Resultado:</strong> A ${formatEq(area)} unidades².</p>
  `;
  resultadoDivDesk.style.display = 'block';
  try {
    const resp = await enviarHistorico(27, { lado }, { area });
    if (resp && resp.novas_conquistas?.length) {
      const conquistas = await window.carregarConquistasAPI?.() ?? [];
      window.mostrarNovasConquistasLocal?.(conquistas, false, resp.novas_conquistas);
    }
  } catch(e){ console.error(e); }
}

async function calcularAreaRetanguloDesktop() {
  const base = parseFloat(document.getElementById('baseRetanguloDesktop').value);
  const altura = parseFloat(document.getElementById('alturaRetanguloDesktop').value);
  if (isNaN(base) || base <= 0 || isNaN(altura) || altura <= 0) { alert('Informe base e altura maiores que zero.'); return; }
  const area = base * altura;
  const resultadoDivDesk = document.getElementById('resultado-desktop');
  const mensagem = document.getElementById('mensagemResultadoDesktop');
  const passoAPasso = document.getElementById('passoAPassoDesktop');
  exibirValoresDigitados('valores-digitados-desktop', [
    ['base', getRawField('baseRetanguloDesktop')],
    ['altura', getRawField('alturaRetanguloDesktop')]
  ]);
  mensagem.innerHTML = `<strong>Área:</strong> ${formatEq(area)} unidades².`;
  passoAPasso.innerHTML = `
    <p><strong>Passo 1:</strong> A = b × h.</p>
    <p><strong>Passo 2:</strong> A = ${base.toFixed(2)} × ${altura.toFixed(2)}.</p>
    <p><strong>Passo 3:</strong> A = ${area.toFixed(4)}.</p>
    <p><strong>Resultado:</strong> A ${formatEq(area)} unidades².</p>
  `;
  resultadoDivDesk.style.display = 'block';
  try {
    const resp = await enviarHistorico(22, { base, altura }, { area });
    if (resp && resp.novas_conquistas?.length) {
      const conquistas = await window.carregarConquistasAPI?.() ?? [];
      window.mostrarNovasConquistasLocal?.(conquistas, false, resp.novas_conquistas);
    }
  } catch(e){ console.error(e); }
}

async function calcularPerimetroRetanguloDesktop() {
  const base = parseFloat(document.getElementById('basePerimetroRetanguloDesktop').value);
  const altura = parseFloat(document.getElementById('alturaPerimetroRetanguloDesktop').value);
  if (isNaN(base) || base <= 0 || isNaN(altura) || altura <= 0) { alert('Informe base e altura maiores que zero.'); return; }
  const perimetro = 2 * (base + altura);
  const resultadoDivDesk = document.getElementById('resultado-desktop');
  const mensagem = document.getElementById('mensagemResultadoDesktop');
  const passoAPasso = document.getElementById('passoAPassoDesktop');
  exibirValoresDigitados('valores-digitados-desktop', [
    ['base', getRawField('basePerimetroRetanguloDesktop')],
    ['altura', getRawField('alturaPerimetroRetanguloDesktop')]
  ]);
  mensagem.innerHTML = `<strong>Perímetro do retângulo:</strong> ${formatEq(perimetro)} (mesma unidade dos lados).`;
  passoAPasso.innerHTML = `
    <p><strong>Passo 1:</strong> P = 2 × (b + h).</p>
    <p><strong>Passo 2:</strong> P = 2 × (${base.toFixed(2)} + ${altura.toFixed(2)}).</p>
    <p><strong>Passo 3:</strong> b + h = ${(base + altura).toFixed(4)}.</p>
    <p><strong>Passo 4:</strong> P = ${perimetro.toFixed(4)}.</p>
    <p><strong>Resultado:</strong> P ${formatEq(perimetro)}.</p>
  `;
  resultadoDivDesk.style.display = 'block';
  try {
    const resp = await enviarHistorico(28, { base, altura }, { perimetro });
    if (resp && resp.novas_conquistas?.length) {
      const conquistas = await window.carregarConquistasAPI?.() ?? [];
      window.mostrarNovasConquistasLocal?.(conquistas, false, resp.novas_conquistas);
    }
  } catch(e){ console.error(e); }
}

async function calcularAreaCirculoDesktop() {
  const r = parseFloat(document.getElementById('raioCirculoDesktop').value);
  if (isNaN(r) || r <= 0) { alert('Informe raio maior que zero.'); return; }
  const pi = Math.PI;
  const area = pi * r * r;
  const resultadoDivDesk = document.getElementById('resultado-desktop');
  const mensagem = document.getElementById('mensagemResultadoDesktop');
  const passoAPasso = document.getElementById('passoAPassoDesktop');
  exibirValoresDigitados('valores-digitados-desktop', [
    ['raio', getRawField('raioCirculoDesktop')]
  ]);
  mensagem.innerHTML = `<strong>Área do círculo:</strong> ${formatEq(area)} unidades².`;
  passoAPasso.innerHTML = `
    <p><strong>Passo 1:</strong> A = π × r².</p>
    <p><strong>Passo 2:</strong> A = π × ${r.toFixed(2)}².</p>
    <p><strong>Passo 3:</strong> r² = ${(r*r).toFixed(4)}.</p>
    <p><strong>Passo 4:</strong> A ≈ ${area.toFixed(4)}.</p>
    <p><strong>Resultado:</strong> A ${formatEq(area)} unidades².</p>
  `;
  resultadoDivDesk.style.display = 'block';
  try {
    const resp = await enviarHistorico(25, { r }, { area });
    if (resp && resp.novas_conquistas?.length) {
      const conquistas = await window.carregarConquistasAPI?.() ?? [];
      window.mostrarNovasConquistasLocal?.(conquistas, false, resp.novas_conquistas);
    }
  } catch(e){ console.error(e); }
}

async function calcularPerimetroCirculoDesktop() {
  const r = parseFloat(document.getElementById('raioPerimetroCirculoDesktop').value);
  if (isNaN(r) || r <= 0) { alert('Informe raio maior que zero.'); return; }
  const perimetro = 2 * Math.PI * r;
  const resultadoDivDesk = document.getElementById('resultado-desktop');
  const mensagem = document.getElementById('mensagemResultadoDesktop');
  const passoAPasso = document.getElementById('passoAPassoDesktop');
  exibirValoresDigitados('valores-digitados-desktop', [
    ['raio', getRawField('raioPerimetroCirculoDesktop')]
  ]);
  mensagem.innerHTML = `<strong>Perímetro do círculo:</strong> ${formatEq(perimetro)} (mesma unidade do raio).`;
  passoAPasso.innerHTML = `
    <p><strong>Passo 1:</strong> P = 2 × π × r.</p>
    <p><strong>Passo 2:</strong> P = 2 × π × ${r.toFixed(2)}.</p>
    <p><strong>Passo 3:</strong> P ≈ ${perimetro.toFixed(4)}.</p>
    <p><strong>Resultado:</strong> P ${formatEq(perimetro)}.</p>
  `;
  resultadoDivDesk.style.display = 'block';
  try {
    const resp = await enviarHistorico(29, { r }, { perimetro });
    if (resp && resp.novas_conquistas?.length) {
      const conquistas = await window.carregarConquistasAPI?.() ?? [];
      window.mostrarNovasConquistasLocal?.(conquistas, false, resp.novas_conquistas);
    }
  } catch(e){ console.error(e); }
}

async function calcularAreaTrianguloDesktop() {
  const b = parseFloat(document.getElementById('baseTrianguloDesktop').value);
  const h = parseFloat(document.getElementById('alturaTrianguloDesktop').value);
  if (isNaN(b) || b <= 0 || isNaN(h) || h <= 0) { alert('Informe base e altura maiores que zero.'); return; }
  const area = (b * h) / 2;
  const resultadoDivDesk = document.getElementById('resultado-desktop');
  const mensagem = document.getElementById('mensagemResultadoDesktop');
  const passoAPasso = document.getElementById('passoAPassoDesktop');
  exibirValoresDigitados('valores-digitados-desktop', [
    ['base', getRawField('baseTrianguloDesktop')],
    ['altura', getRawField('alturaTrianguloDesktop')]
  ]);
  mensagem.innerHTML = `<strong>Área do triângulo:</strong> ${formatEq(area)} unidades².`;
  passoAPasso.innerHTML = `
    <p><strong>Passo 1:</strong> A = <span class="frac"><span class="top">b × h</span><span class="bottom">2</span></span>.</p>
    <p><strong>Passo 2:</strong> A = <span class="frac"><span class="top">${b.toFixed(2)} × ${h.toFixed(2)}</span><span class="bottom">2</span></span>.</p>
    <p><strong>Passo 3:</strong> b × h = ${(b*h).toFixed(4)}.</p>
    <p><strong>Passo 4:</strong> A = ${area.toFixed(4)}.</p>
    <p><strong>Resultado:</strong> A ${formatEq(area)} unidades².</p>
  `;
  resultadoDivDesk.style.display = 'block';
  try {
    const resp = await enviarHistorico(26, { b, h }, { area });
    if (resp && resp.novas_conquistas?.length) {
      const conquistas = await window.carregarConquistasAPI?.() ?? [];
      window.mostrarNovasConquistasLocal?.(conquistas, false, resp.novas_conquistas);
    }
  } catch(e){ console.error(e); }
}

async function calcularSemelhancaDesktop() {
  const ladoRef = parseFloat(document.getElementById('ladoMenorDesktop').value);
  const ladoComp = parseFloat(document.getElementById('ladoMaiorDesktop').value);
  const areaRef = parseFloat(document.getElementById('areaReferencialDesktop').value);
  if (isNaN(ladoRef) || ladoRef <= 0 || isNaN(ladoComp) || ladoComp <= 0) { alert('Informe lados correspondentes maiores que zero.'); return; }
  const k = ladoComp / ladoRef;
  const razaoArea = k * k;
  const areaProj = !isNaN(areaRef) && areaRef > 0 ? areaRef * razaoArea : null;
  const resultadoDivDesk = document.getElementById('resultado-desktop');
  const mensagem = document.getElementById('mensagemResultadoDesktop');
  const passoAPasso = document.getElementById('passoAPassoDesktop');
  exibirValoresDigitados('valores-digitados-desktop', [
    ['lado ref', getRawField('ladoMenorDesktop')],
    ['lado correspondente', getRawField('ladoMaiorDesktop')],
    ['área ref (opcional)', getRawField('areaReferencialDesktop')]
  ]);
  mensagem.innerHTML = `<strong>Razão linear (k):</strong> ${k.toFixed(4)} | <strong>Razão de áreas (k²):</strong> ${razaoArea.toFixed(4)}`;
  passoAPasso.innerHTML = `
    <p><strong>Passo 1:</strong> k = ${ladoComp.toFixed(2)} ÷ ${ladoRef.toFixed(2)} = ${k.toFixed(4)}.</p>
    <p><strong>Passo 2:</strong> k² = ${k.toFixed(4)}² = ${razaoArea.toFixed(4)}.</p>
    ${areaProj ? `<p><strong>Passo 3:</strong> Área semelhante = ${areaRef.toFixed(2)} × ${razaoArea.toFixed(4)} = ${areaProj.toFixed(4)}.</p>` : '<p><strong>Passo 3:</strong> Multiplique qualquer área conhecida por k² para obter a correspondente.</p>'}
  `;
  resultadoDivDesk.style.display = 'block';
  try {
    const resp = await enviarHistorico(23, { ladoRef, ladoComp, areaRef }, { k, razaoArea, areaProj });
    if (resp && resp.novas_conquistas?.length) {
      const conquistas = await window.carregarConquistasAPI?.() ?? [];
      window.mostrarNovasConquistasLocal?.(conquistas, false, resp.novas_conquistas);
    }
  } catch(e){ console.error(e); }
}

async function calcularPitagorasDesktop() {
  const bRaw = getRawField('catetoADesktop'); // cateto b
  const cRaw = getRawField('catetoBDesktop'); // cateto c
  const aRaw = getRawField('hipotenusaDesktop'); // hipotenusa a
  const b = parseFloat(bRaw);
  const c = parseFloat(cRaw);
  const a = parseFloat(aRaw);

  const conhecidos = [a, b, c].filter(v => Number.isFinite(v) && v > 0).length;
  if (conhecidos < 2) { alert('Informe pelo menos dois valores positivos (dois catetos ou a hipotenusa).'); return; }

  const resultadoDivDesk = document.getElementById('resultado-desktop');
  const mensagem = document.getElementById('mensagemResultadoDesktop');
  const passoAPasso = document.getElementById('passoAPassoDesktop');
  let achou = '';
  let calculado = null;
  let passos = '';

  if (!Number.isFinite(a) && Number.isFinite(b) && Number.isFinite(c)) {
    const a2 = b * b + c * c;
    const hip = Math.sqrt(a2);
    calculado = hip;
    achou = 'hipotenusa a';
    passos = `
      <p><strong>Passo 1:</strong> a² = b² + c².</p>
      <p><strong>Passo 2:</strong> a² = ${b.toFixed(2)}² + ${c.toFixed(2)}² = ${a2.toFixed(4)}.</p>
      <p><strong>Passo 3:</strong> a = √${a2.toFixed(4)} ${formatEq(hip)}</p>
    `;
    mensagem.innerHTML = `<strong>Hipotenusa (a):</strong> ${formatEq(hip)}.`;
  } else if (!Number.isFinite(b) && Number.isFinite(c) && Number.isFinite(a)) {
    if (a <= c) { alert('Para calcular cateto b: hipotenusa (a) deve ser maior que o outro cateto.'); return; }
    const b2 = a * a - c * c;
    const cat = Math.sqrt(b2);
    calculado = cat;
    achou = 'cateto b';
    passos = `
      <p><strong>Passo 1:</strong> b² = a² − c².</p>
      <p><strong>Passo 2:</strong> b² = ${a.toFixed(2)}² − ${c.toFixed(2)}² = ${b2.toFixed(4)}.</p>
      <p><strong>Passo 3:</strong> b = √${b2.toFixed(4)} ${formatEq(cat)}</p>
    `;
    mensagem.innerHTML = `<strong>Cateto b:</strong> ${formatEq(cat)}.`;
  } else if (!Number.isFinite(c) && Number.isFinite(b) && Number.isFinite(a)) {
    if (a <= b) { alert('Para calcular cateto c: hipotenusa (a) deve ser maior que o outro cateto.'); return; }
    const c2 = a * a - b * b;
    const cat = Math.sqrt(c2);
    calculado = cat;
    achou = 'cateto c';
    passos = `
      <p><strong>Passo 1:</strong> c² = a² − b².</p>
      <p><strong>Passo 2:</strong> c² = ${a.toFixed(2)}² − ${b.toFixed(2)}² = ${c2.toFixed(4)}.</p>
      <p><strong>Passo 3:</strong> c = √${c2.toFixed(4)} ${formatEq(cat)}</p>
    `;
    mensagem.innerHTML = `<strong>Cateto c:</strong> ${formatEq(cat)}.`;
  } else {
    alert('Preencha somente dois valores para calcular o terceiro (valores positivos).');
    return;
  }

  exibirValoresDigitados('valores-digitados-desktop', [
    ['b', bRaw],
    ['c', cRaw],
    ['a', aRaw]
  ]);
  passoAPasso.innerHTML = passos;
  resultadoDivDesk.style.display = 'block';
  try {
    const resp = await enviarHistorico(24, { a, b, c }, { achou, valor: calculado });
    if (resp && resp.novas_conquistas?.length) {
      const conquistas = await window.carregarConquistasAPI?.() ?? [];
      window.mostrarNovasConquistasLocal?.(conquistas, false, resp.novas_conquistas);
    }
  } catch(e){ console.error(e); }
}

/* Dropdown Perfil */
function toggleDropdown(event) {
  if (event) event.stopPropagation();
  const dropdown = document.getElementById('dropdown-menu');
  const profile = document.querySelector('.navbar-profile');
  dropdown.classList.toggle('show');
  profile.classList.toggle('active');
}

window.addEventListener('click', function(e) {
  if (!e.target.closest('.navbar-profile')) {
    const dropdown = document.getElementById('dropdown-menu');
    const profile = document.querySelector('.navbar-profile');
    if (dropdown && dropdown.classList.contains('show')) {
      dropdown.classList.remove('show');
      profile.classList.remove('active');
    }
  }
});

(function(){
  function ajustarTopo(){
    const nav = document.querySelector('.navbar');
    const bc = document.querySelector('.breadcrumb');
    const section = document.querySelector('.section');
    if(!nav || !bc || !section) return;
    const navRect = nav.getBoundingClientRect();
    bc.style.top = Math.ceil(navRect.bottom) + 'px';
    const bcH = bc.getBoundingClientRect().height || 0;
    const novoMT = Math.max(navRect.height + bcH + 24, 120);
    section.style.marginTop = novoMT + 'px';
  }
  document.addEventListener('DOMContentLoaded', ajustarTopo);
  window.addEventListener('resize', ajustarTopo);
  if (window.ResizeObserver) {
    new ResizeObserver(ajustarTopo).observe(document.querySelector('.navbar'));
  }
})();