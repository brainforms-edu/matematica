const dropdownButton = document.getElementById('dropdownButton');
const dropdownContent = document.getElementById('dropdownContent');
const arrowIcon = document.getElementById('arrowIcon');
const forms = document.querySelectorAll('.calculo-form');
const resultadoDiv = document.getElementById('resultado');
const saidaResultado = document.getElementById('saidaResultado');
const explicacaoDiv = document.getElementById('explicacaoTexto');

const definicoes = {
  perimetroForm: `
    <strong>Perímetro de Polígono Regular</strong>
    <p>Some todos os lados. Em polígonos regulares, basta multiplicar a medida de um lado pelo número de lados.</p>
    <p><span class="label-colon">Fórmula:</span> <span class="formula">P = n × a</span></p>
    <p><span class="label-colon">Variáveis:</span> n = número de lados (inteiro ≥ 3); a = medida de cada lado.</p>
    <p><span class="label-colon">Dica:</span> use a mesma unidade para todos os lados.</p>
  `,
  areaQuadradoForm: `
    <strong>Área do Quadrado</strong>
    <p>Quadrados têm quatro lados iguais e ângulos retos. A área depende apenas do lado.</p>
    <p><span class="label-colon">Fórmula:</span> <span class="formula">A = lado²</span></p>
    <p><span class="label-colon">Variáveis:</span> lado = comprimento de qualquer lado.</p>
    <p><span class="label-colon">Dica:</span> se precisar do perímetro, use 4 × lado.</p>
  `,
  areaRetanguloForm: `
    <strong>Área do Retângulo</strong>
    <p>Multiplique base pela altura.</p>
    <p><span class="label-colon">Fórmula:</span> <span class="formula">A = b × h</span></p>
    <p><span class="label-colon">Variáveis:</span> b = base, h = altura.</p>
    <p><span class="label-colon">Exemplo:</span> b = 4 e h = 3 → A = 12.</p>
  `,
  perimetroRetanguloForm: `
    <strong>Perímetro do Retângulo</strong>
    <p>O contorno do retângulo é a soma dos lados opostos em pares.</p>
    <p><span class="label-colon">Fórmula:</span> <span class="formula">P = 2 × (b + h)</span></p>
    <p><span class="label-colon">Variáveis:</span> b = base, h = altura.</p>
    <p><span class="label-colon">Dica:</span> mantenha base e altura na mesma unidade.</p>
  `,
  areaCirculoForm: `
    <strong>Área do Círculo</strong>
    <p>A área cresce com o quadrado do raio.</p>
    <p><span class="label-colon">Fórmula:</span> <span class="formula">A = π × r²</span></p>
    <p><span class="label-colon">Variáveis:</span> r = raio.</p>
    <p><span class="label-colon">Dica:</span> use π ≈ 3,14 e mantenha unidades consistentes.</p>
  `,
  perimetroCirculoForm: `
    <strong>Perímetro do Círculo</strong>
    <p>O perímetro de um círculo é a sua circunferência.</p>
    <p><span class="label-colon">Fórmula:</span> <span class="formula">P = 2 × π × r</span></p>
    <p><span class="label-colon">Variáveis:</span> r = raio.</p>
    <p><span class="label-colon">Dica:</span> use a mesma unidade para raio e resultado.</p>
  `,
  areaTrianguloForm: `
    <strong>Área do Triângulo</strong>
    <p>Metade do retângulo formado por base e altura.</p>
    <p><span class="label-colon">Fórmula:</span> <span class="formula">A = (b × h)/2</span></p>
    <p><span class="label-colon">Variáveis:</span> b = base, h = altura (perpendicular).</p>
    <p><span class="label-colon">Dica:</span> base e altura devem estar na mesma unidade.</p>
  `,
  semelhancaForm: `
    <strong>Semelhança de Triângulos</strong>
    <p>Triângulos semelhantes têm a mesma forma e ângulos iguais. Os lados correspondentes são proporcionais.</p>
    <p><span class="label-colon">Razão linear:</span> k = lado_2 ÷ lado_1.</p>
    <p><span class="label-colon">Razão de áreas:</span> k² (área cresce com o quadrado da razão).</p>
    <p><span class="label-colon">Uso:</span> se souber a área do triângulo de referência, multiplique-a por k² para achar a área do semelhante.</p>
  `,
  pitagorasForm: `
    <strong>Teorema de Pitágoras</strong>
    <p>Em qualquer triângulo retângulo, a soma dos quadrados dos catetos é igual ao quadrado da hipotenusa.</p>
    <p><span class="label-colon">Fórmula:</span> <span class="formula">c² = a² + b²</span></p>
    <p><span class="label-colon">Variáveis:</span> a e b = catetos, c = hipotenusa.</p>
    <p><span class="label-colon">Dica:</span> resultado em mesma unidade dos catetos.</p>
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
});

async function calcularPerimetro() {
  const n = parseInt(document.getElementById('ladosPerimetro').value, 10);
  const lado = parseFloat(document.getElementById('medidaLado').value);
  if (isNaN(n) || n < 3 || isNaN(lado) || lado <= 0) {
    alert('Informe n ≥ 3 e um lado maior que zero.');
    return;
  }
  const perimetro = n * lado;
  resultadoDiv.style.display = 'block';
  const passos = `
    <p><strong>Passo 1:</strong> Fórmula P = n × a.</p>
    <p><strong>Passo 2:</strong> Substitua: P = ${n} × ${lado.toFixed(2)}.</p>
    <p><strong>Passo 3:</strong> Multiplique: P = ${perimetro.toFixed(4)}.</p>
    <p><strong>Resultado:</strong> P ≈ ${perimetro.toFixed(2)} (mesma unidade do lado).</p>
  `;
  saidaResultado.innerHTML = `<p><strong>Perímetro:</strong> ${perimetro.toFixed(2)}</p>${passos}`;
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
  resultadoDiv.style.display = 'block';
  const passos = `
    <p><strong>Passo 1:</strong> Fórmula A = lado².</p>
    <p><strong>Passo 2:</strong> Substitua: A = ${lado.toFixed(2)}².</p>
    <p><strong>Passo 3:</strong> Eleve ao quadrado: A = ${area.toFixed(4)}.</p>
    <p><strong>Resultado:</strong> A ≈ ${area.toFixed(2)} unidades².</p>
  `;
  saidaResultado.innerHTML = `<p><strong>Área do quadrado:</strong> ${area.toFixed(2)} unidades².</p>${passos}`;
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
  resultadoDiv.style.display = 'block';
  const passos = `
    <p><strong>Passo 1:</strong> Fórmula A = π × r².</p>
    <p><strong>Passo 2:</strong> Substitua: A = π × ${r.toFixed(2)}².</p>
    <p><strong>Passo 3:</strong> Eleve ao quadrado: r² = ${ (r*r).toFixed(4) }.</p>
    <p><strong>Passo 4:</strong> Multiplique por π: A = π × ${ (r*r).toFixed(4) } ≈ ${area.toFixed(4)}.</p>
    <p><strong>Resultado:</strong> A ≈ ${area.toFixed(2)} unidades².</p>
  `;
  saidaResultado.innerHTML = `<p><strong>Área do círculo:</strong> ${area.toFixed(2)} unidades².</p>${passos}`;
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
  resultadoDiv.style.display = 'block';
  const passos = `
    <p><strong>Passo 1:</strong> Fórmula P = 2 × π × r.</p>
    <p><strong>Passo 2:</strong> Substitua: P = 2 × π × ${r.toFixed(2)}.</p>
    <p><strong>Passo 3:</strong> Multiplique: P ≈ ${perimetro.toFixed(4)}.</p>
    <p><strong>Resultado:</strong> P ≈ ${perimetro.toFixed(2)} (mesma unidade do raio).</p>
  `;
  saidaResultado.innerHTML = `<p><strong>Perímetro do círculo:</strong> ${perimetro.toFixed(2)}</p>${passos}`;
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
  resultadoDiv.style.display = 'block';
  const passos = `
    <p><strong>Passo 1:</strong> Fórmula A = (b × h) / 2.</p>
    <p><strong>Passo 2:</strong> Substitua: A = (${b.toFixed(2)} × ${h.toFixed(2)}) / 2.</p>
    <p><strong>Passo 3:</strong> Multiplique: b × h = ${(b*h).toFixed(4)}.</p>
    <p><strong>Passo 4:</strong> Divida por 2: A = ${area.toFixed(4)}.</p>
    <p><strong>Resultado:</strong> A ≈ ${area.toFixed(2)} unidades².</p>
  `;
  saidaResultado.innerHTML = `<p><strong>Área do triângulo:</strong> ${area.toFixed(2)} unidades².</p>${passos}`;
  try {
    const resp = await enviarHistorico(26, { b, h }, { area });
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
  resultadoDiv.style.display = 'block';
  const passos = `
    <p><strong>Passo 1:</strong> Fórmula A = b × h.</p>
    <p><strong>Passo 2:</strong> Substitua: A = ${base.toFixed(2)} × ${altura.toFixed(2)}.</p>
    <p><strong>Passo 3:</strong> Multiplique: A = ${area.toFixed(4)}.</p>
    <p><strong>Resultado:</strong> A ≈ ${area.toFixed(2)} unidades².</p>
  `;
  saidaResultado.innerHTML = `<p><strong>Área:</strong> ${area.toFixed(2)} unidades².</p>${passos}`;
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
  resultadoDiv.style.display = 'block';
  const passos = `
    <p><strong>Passo 1:</strong> Fórmula P = 2 × (b + h).</p>
    <p><strong>Passo 2:</strong> Substitua: P = 2 × (${base.toFixed(2)} + ${altura.toFixed(2)}).</p>
    <p><strong>Passo 3:</strong> Some: b + h = ${(base + altura).toFixed(4)}.</p>
    <p><strong>Passo 4:</strong> Multiplique por 2: P = ${perimetro.toFixed(4)}.</p>
    <p><strong>Resultado:</strong> P ≈ ${perimetro.toFixed(2)} (mesma unidade dos lados).</p>
  `;
  saidaResultado.innerHTML = `<p><strong>Perímetro do retângulo:</strong> ${perimetro.toFixed(2)}</p>${passos}`;
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
  const k = ladoComp / ladoRef;
  const razaoArea = k * k;
  const areaProj = !isNaN(areaRef) && areaRef > 0 ? areaRef * razaoArea : null;
  resultadoDiv.style.display = 'block';
  const passos = `
    <p><strong>Passo 1:</strong> Razão linear k = lado correspondente ÷ lado de referência = ${ladoComp.toFixed(2)} ÷ ${ladoRef.toFixed(2)} = ${k.toFixed(4)}.</p>
    <p><strong>Passo 2:</strong> Razão de áreas = k² = ${k.toFixed(4)}² = ${razaoArea.toFixed(4)}.</p>
    ${areaProj ? `<p><strong>Passo 3:</strong> Área projetada = área referência × k² = ${areaRef.toFixed(2)} × ${razaoArea.toFixed(4)} = ${areaProj.toFixed(4)}.</p>` : '<p><strong>Passo 3:</strong> Multiplique qualquer medida de área pelo fator k² para encontrar a correspondente.</p>'}
  `;
  const resultadoArea = areaProj ? `<p><strong>Área do triângulo semelhante:</strong> ${areaProj.toFixed(2)} unidades².</p>` : '';
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
  const a = parseFloat(document.getElementById('catetoA').value);
  const b = parseFloat(document.getElementById('catetoB').value);
  if (isNaN(a) || a <= 0 || isNaN(b) || b <= 0) { alert('Informe catetos maiores que zero.'); return; }
  const c2 = a * a + b * b;
  const c = Math.sqrt(c2);
  resultadoDiv.style.display = 'block';
  const passos = `
    <p><strong>Passo 1:</strong> Fórmula: c² = a² + b².</p>
    <p><strong>Passo 2:</strong> Substitua: c² = ${a.toFixed(2)}² + ${b.toFixed(2)}².</p>
    <p><strong>Passo 3:</strong> Calcule: c² = ${c2.toFixed(4)}.</p>
    <p><strong>Passo 4:</strong> Raiz quadrada: c = √${c2.toFixed(4)} ≈ ${c.toFixed(4)}.</p>
  `;
  saidaResultado.innerHTML = `<p><strong>Hipotenusa:</strong> ${c.toFixed(2)}</p>${passos}`;
  try {
    const resp = await enviarHistorico(24, { a, b }, { c });
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
    semelhanca: definicoes.semelhancaForm,
    pitagoras: definicoes.pitagorasForm
  };
  if (tipo && definicoesDesktop[tipo]) {
    explicacaoDesktop.innerHTML = definicoesDesktop[tipo];
  }
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
  mensagem.innerHTML = `<strong>Perímetro:</strong> ${perimetro.toFixed(2)} (mesma unidade do lado).`;
  passoAPasso.innerHTML = `
    <p><strong>Passo 1:</strong> P = n × a.</p>
    <p><strong>Passo 2:</strong> P = ${n} × ${lado.toFixed(2)}.</p>
    <p><strong>Passo 3:</strong> P = ${perimetro.toFixed(4)}.</p>
    <p><strong>Resultado:</strong> P ≈ ${perimetro.toFixed(2)}.</p>
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

async function calcularAreaQuadradoDesktop() {
  const lado = parseFloat(document.getElementById('ladoQuadradoDesktop').value);
  if (isNaN(lado) || lado <= 0) { alert('Informe lado maior que zero.'); return; }
  const area = lado * lado;
  const resultadoDivDesk = document.getElementById('resultado-desktop');
  const mensagem = document.getElementById('mensagemResultadoDesktop');
  const passoAPasso = document.getElementById('passoAPassoDesktop');
  mensagem.innerHTML = `<strong>Área do quadrado:</strong> ${area.toFixed(2)} unidades².`;
  passoAPasso.innerHTML = `
    <p><strong>Passo 1:</strong> A = lado².</p>
    <p><strong>Passo 2:</strong> A = ${lado.toFixed(2)}².</p>
    <p><strong>Passo 3:</strong> A = ${area.toFixed(4)}.</p>
    <p><strong>Resultado:</strong> A ≈ ${area.toFixed(2)} unidades².</p>
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
  mensagem.innerHTML = `<strong>Área:</strong> ${area.toFixed(2)} unidades².`;
  passoAPasso.innerHTML = `
    <p><strong>Passo 1:</strong> A = b × h.</p>
    <p><strong>Passo 2:</strong> A = ${base.toFixed(2)} × ${altura.toFixed(2)}.</p>
    <p><strong>Passo 3:</strong> A = ${area.toFixed(4)}.</p>
    <p><strong>Resultado:</strong> A ≈ ${area.toFixed(2)} unidades².</p>
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
  mensagem.innerHTML = `<strong>Perímetro do retângulo:</strong> ${perimetro.toFixed(2)} (mesma unidade dos lados).`;
  passoAPasso.innerHTML = `
    <p><strong>Passo 1:</strong> P = 2 × (b + h).</p>
    <p><strong>Passo 2:</strong> P = 2 × (${base.toFixed(2)} + ${altura.toFixed(2)}).</p>
    <p><strong>Passo 3:</strong> b + h = ${(base + altura).toFixed(4)}.</p>
    <p><strong>Passo 4:</strong> P = ${perimetro.toFixed(4)}.</p>
    <p><strong>Resultado:</strong> P ≈ ${perimetro.toFixed(2)}.</p>
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
  mensagem.innerHTML = `<strong>Área do círculo:</strong> ${area.toFixed(2)} unidades².`;
  passoAPasso.innerHTML = `
    <p><strong>Passo 1:</strong> A = π × r².</p>
    <p><strong>Passo 2:</strong> A = π × ${r.toFixed(2)}².</p>
    <p><strong>Passo 3:</strong> r² = ${(r*r).toFixed(4)}.</p>
    <p><strong>Passo 4:</strong> A ≈ ${area.toFixed(4)}.</p>
    <p><strong>Resultado:</strong> A ≈ ${area.toFixed(2)} unidades².</p>
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
  mensagem.innerHTML = `<strong>Perímetro do círculo:</strong> ${perimetro.toFixed(2)} (mesma unidade do raio).`;
  passoAPasso.innerHTML = `
    <p><strong>Passo 1:</strong> P = 2 × π × r.</p>
    <p><strong>Passo 2:</strong> P = 2 × π × ${r.toFixed(2)}.</p>
    <p><strong>Passo 3:</strong> P ≈ ${perimetro.toFixed(4)}.</p>
    <p><strong>Resultado:</strong> P ≈ ${perimetro.toFixed(2)}.</p>
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
  mensagem.innerHTML = `<strong>Área do triângulo:</strong> ${area.toFixed(2)} unidades².`;
  passoAPasso.innerHTML = `
    <p><strong>Passo 1:</strong> A = (b × h) / 2.</p>
    <p><strong>Passo 2:</strong> A = (${b.toFixed(2)} × ${h.toFixed(2)}) / 2.</p>
    <p><strong>Passo 3:</strong> b × h = ${(b*h).toFixed(4)}.</p>
    <p><strong>Passo 4:</strong> A = ${area.toFixed(4)}.</p>
    <p><strong>Resultado:</strong> A ≈ ${area.toFixed(2)} unidades².</p>
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
  const a = parseFloat(document.getElementById('catetoADesktop').value);
  const b = parseFloat(document.getElementById('catetoBDesktop').value);
  if (isNaN(a) || a <= 0 || isNaN(b) || b <= 0) { alert('Informe catetos maiores que zero.'); return; }
  const c2 = a * a + b * b;
  const c = Math.sqrt(c2);
  const resultadoDivDesk = document.getElementById('resultado-desktop');
  const mensagem = document.getElementById('mensagemResultadoDesktop');
  const passoAPasso = document.getElementById('passoAPassoDesktop');
  mensagem.innerHTML = `<strong>Hipotenusa:</strong> ${c.toFixed(2)} (mesma unidade dos catetos).`;
  passoAPasso.innerHTML = `
    <p><strong>Passo 1:</strong> c² = a² + b².</p>
    <p><strong>Passo 2:</strong> c² = ${a.toFixed(2)}² + ${b.toFixed(2)}².</p>
    <p><strong>Passo 3:</strong> c² = ${c2.toFixed(4)}.</p>
    <p><strong>Passo 4:</strong> c = √${c2.toFixed(4)} ≈ ${c.toFixed(4)}.</p>
  `;
  resultadoDivDesk.style.display = 'block';
  try {
    const resp = await enviarHistorico(24, { a, b }, { c });
    if (resp && resp.novas_conquistas?.length) {
      const conquistas = await window.carregarConquistasAPI?.() ?? [];
      window.mostrarNovasConquistasLocal?.(conquistas, false, resp.novas_conquistas);
    }
  } catch(e){ console.error(e); }
}

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
