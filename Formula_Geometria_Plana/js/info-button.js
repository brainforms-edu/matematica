function showInfo(button, message) {
  // Se não vier mensagem explícita, usa o conteúdo do atributo data-info
  message = message || button.dataset.info || "";

  // Remove tooltip anterior
  const existingTooltip = document.querySelector(".info-tooltip");
  if (existingTooltip) existingTooltip.remove();

  // Cria o tooltip
  const tooltip = document.createElement("div");
  tooltip.classList.add("info-tooltip");

  // Suporte a ENTERs (substitui quebras de linha por <br>)
  tooltip.innerHTML = message.replace(/\r?\n/g, "<br>");

  document.body.appendChild(tooltip);

  // Pega posição e dimensões do botão
  const rect = button.getBoundingClientRect();
  const above = rect.top > 80; // se há espaço acima
  const rightSide = rect.left > window.innerWidth / 2; // botão na metade direita da tela?

  // Calcula posição suave (tooltip um pouco sobreposto ao ícone)
  const horizontalOffset = 10; // distância lateral
  const verticalOffset = 5;    // pequena sobreposição vertical

  let leftPosition;
  if (rightSide) {
    // Tooltip aparece um pouco à esquerda do botão
    leftPosition =
      rect.left +
      window.scrollX -
      tooltip.offsetWidth / 1.3 -
      horizontalOffset;
  } else {
    // Tooltip aparece um pouco à direita do botão
    leftPosition =
      rect.right +
      window.scrollX -
      tooltip.offsetWidth / 3 +
      horizontalOffset;
  }

  const topPosition = above
    ? rect.top + window.scrollY - tooltip.offsetHeight - verticalOffset
    : rect.bottom + window.scrollY + verticalOffset;

  tooltip.style.left = leftPosition + "px";
  tooltip.style.top = topPosition + "px";

  // Adiciona animação de entrada
  tooltip.classList.add("fade-in");

  // Fecha ao clicar fora (sem interferir com o próprio botão)
  setTimeout(() => {
    document.addEventListener("click", function handleClickOutside(e) {
      if (!button.contains(e.target) && !tooltip.contains(e.target)) {
        tooltip.remove();
        document.removeEventListener("click", handleClickOutside);
      }
    });
  }, 50); // pequeno atraso para não fechar imediatamente
}

// Estilos dinâmicos (só adiciona se não existir)
if (!document.getElementById('info-button-styles')) {
  const style = document.createElement("style");
  style.id = "info-button-styles";
  style.textContent = `
  .info-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
  }


  .info-tooltip {
    position: absolute;
    background-color: #fafaff; /* branco levemente azulado */
    color: #111;
    font-family: 'Roboto', sans-serif;
    padding: 8px 10px;
    border-radius: 8px;
    font-size: 10px; /* mobile base */
    max-width: 220px;
    z-index: 1000;
    border: 1px solid #8a2be2; /* roxo fino */
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    transition: opacity 0.2s ease, transform 0.2s ease;
    opacity: 0;
    transform: translateY(-5px);
    white-space: normal; /* permite quebra de linha natural */
    line-height: 1.3;
  }

  /* Tooltip cresce conforme o tamanho da tela */
  @media (min-width: 481px) {
    .info-tooltip {
      font-size: 11px; /* tablets/desktop pequeno */
    }
  }

  @media (min-width: 768px) {
    .info-tooltip {
      font-size: 11px; /* desktop médio */
    }
  }

  @media (min-width: 1024px) {
    .info-tooltip {
      font-size: 12px; /* desktop grande */
      max-width: 260px;
      
    }
  }

  @media (min-width: 1440px) {
    .info-tooltip {
      font-size: 13px; /* telas muito grandes */
      max-width: 280px;
    }
  }

  .fade-in {
    opacity: 1 !important;
    transform: translateY(0) !important;
  }

  .esquerda {
    justify-content: flex-start;
    display: flex;
    text-align: left;
    padding-right: 30px;
    margin-bottom: 20px;
  }

  .direita {
    justify-content: flex-end;
    display: flex;
    text-align: right;
    padding-right: 30px;
    margin-bottom: 20px;
  }
`;
  document.head.appendChild(style);
}
