// ============================================================
//  Sacola: guarda os itens escolhidos e monta UMA mensagem
//  de pedido para o WhatsApp.
// ============================================================
(function () {
  const S = window.Samara;
  const CHAVE = "samara-sacola-v1";
  const RETIRADA = "Retirar na loja";

  // { [idProduto]: quantidade }
  let itens = S.ler(CHAVE, {});
  // descarta produtos que saíram do catálogo ou esgotaram
  Object.keys(itens).forEach((id) => {
    const p = S.produto(id);
    if (!p || p.esgotado || !(itens[id] > 0)) delete itens[id];
  });

  const $ = (sel) => document.querySelector(sel);
  const gaveta = $("[data-gaveta]");
  const lista = $("[data-itens]");
  const totais = $("[data-totais]");
  const vazia = $("[data-sacola-vazia]");
  const campos = $("[data-campos]");
  const rodape = $("[data-gaveta-rodape]");
  const enviar = $("[data-enviar-pedido]");
  const nome = $("[data-cliente-nome]");
  const entrega = $("[data-cliente-entrega]");
  const barra = $("[data-barra-sacola]");
  const barraResumo = $("[data-barra-resumo]");
  const contadores = document.querySelectorAll("[data-contador]");

  function linhas() {
    return Object.keys(itens).map((id) => ({ produto: S.produto(id), qtd: itens[id] }));
  }

  function resumo() {
    let quantidade = 0, total = 0, aConsultar = 0;
    linhas().forEach(({ produto, qtd }) => {
      quantidade += qtd;
      if (produto.preco) total += produto.preco * qtd;
      else aConsultar += qtd;
    });
    return { quantidade, total, aConsultar };
  }

  function salvar() {
    S.guardar(CHAVE, itens);
    render();
    S.avisar("sacola", api);
  }

  const api = {
    quantidade(id) { return itens[id] || 0; },
    resumo,
    adicionar(id) {
      itens[id] = (itens[id] || 0) + 1;
      salvar();
      contadores.forEach((c) => { c.classList.remove("pulso"); void c.offsetWidth; c.classList.add("pulso"); });
    },
    alterar(id, delta) {
      const nova = (itens[id] || 0) + delta;
      if (nova <= 0) delete itens[id]; else itens[id] = nova;
      salvar();
    },
    remover(id) { delete itens[id]; salvar(); },
    esvaziar() { itens = {}; salvar(); },
    abrir() {
      if (typeof gaveta.showModal === "function") gaveta.showModal(); else gaveta.setAttribute("open", "");
      document.body.classList.add("travado");
    },
    fechar() { gaveta.close ? gaveta.close() : gaveta.removeAttribute("open"); },
  };

  function mensagem() {
    const r = resumo();
    const partes = ["Olá! Vim pelo site e quero fazer um pedido:", ""];
    linhas().forEach(({ produto, qtd }) => {
      const valor = produto.preco ? S.brl(produto.preco * qtd) : "a consultar";
      partes.push("• " + qtd + "x " + produto.nome + (produto.ml ? " " + produto.ml + " ml" : "") + ": " + valor);
    });
    partes.push("");
    if (r.total > 0) partes.push("Total: " + S.brl(r.total) + (r.aConsultar ? " + itens a consultar" : ""));
    else partes.push("Total: a consultar");
    if (nome.value.trim()) partes.push("Nome: " + nome.value.trim());
    partes.push((entrega.value === RETIRADA ? "Retirada: " : "Entrega em: ") + entrega.value);
    partes.push("", "Tem tudo disponível?");
    return partes.join("\n");
  }

  function render() {
    const r = resumo();
    const tem = r.quantidade > 0;

    contadores.forEach((c) => { c.hidden = !tem; c.textContent = r.quantidade; });

    vazia.hidden = tem;
    campos.hidden = !tem;
    rodape.hidden = !tem;
    totais.hidden = !tem;

    lista.innerHTML = linhas().map(({ produto, qtd }) => {
      const id = S.escapar(produto.id);
      const unit = produto.preco ? S.brl(produto.preco) + " cada" : "Valor a consultar";
      const subtotal = produto.preco ? S.brl(produto.preco * qtd) : "";
      return (
        '<li class="item">' +
          '<div><div class="item-nome">' + S.escapar(produto.nome) + '</div><div class="item-preco">' + unit + "</div></div>" +
          '<div class="item-total">' + subtotal + "</div>" +
          '<div class="qtd">' +
            '<button type="button" data-menos="' + id + '" aria-label="Tirar um ' + S.escapar(produto.nome) + '">−</button>' +
            "<output>" + qtd + "</output>" +
            '<button type="button" data-mais="' + id + '" aria-label="Pôr mais um ' + S.escapar(produto.nome) + '">+</button>' +
          "</div>" +
          '<button class="item-remover" type="button" data-remover="' + id + '">Remover</button>' +
        "</li>"
      );
    }).join("");

    totais.innerHTML =
      '<p class="total"><span>Total</span><span>' + (r.total > 0 ? S.brl(r.total) : "A consultar") + "</span></p>" +
      (r.aConsultar ? '<span class="aviso">' + r.aConsultar + (r.aConsultar > 1 ? " itens sem preço no site. A loja informa o valor." : " item sem preço no site. A loja informa o valor.") + "</span>" : "");

    enviar.href = tem ? S.linkWhats(mensagem()) : "#";

    barra.classList.toggle("visivel", tem);
    barra.setAttribute("aria-hidden", String(!tem));
    barra.querySelector("button").tabIndex = tem ? 0 : -1;
    barraResumo.innerHTML = tem
      ? r.quantidade + (r.quantidade > 1 ? " itens" : " item") + " na sacola<strong>" + (r.total > 0 ? S.brl(r.total) : "Valor a consultar") + (r.total > 0 && r.aConsultar ? " + a consultar" : "") + "</strong>"
      : "";
  }

  // opções de entrega
  entrega.innerHTML = S.loja.entregaGratis
    .map((c) => '<option value="' + S.escapar(c) + '">Entrega em ' + S.escapar(c) + "</option>")
    .concat('<option value="' + RETIRADA + '">' + RETIRADA + "</option>")
    .join("");
  const preferencias = S.ler("samara-cliente-v1", {});
  if (preferencias.nome) nome.value = preferencias.nome;
  if (preferencias.entrega) entrega.value = preferencias.entrega;
  [nome, entrega].forEach((el) => el.addEventListener("change", () => {
    S.guardar("samara-cliente-v1", { nome: nome.value.trim(), entrega: entrega.value });
    render();
  }));
  nome.addEventListener("input", () => { enviar.href = S.linkWhats(mensagem()); });

  // cliques dentro da sacola
  lista.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    if (b.dataset.mais) api.alterar(b.dataset.mais, 1);
    else if (b.dataset.menos) api.alterar(b.dataset.menos, -1);
    else if (b.dataset.remover) api.remover(b.dataset.remover);
  });
  $("[data-esvaziar]").addEventListener("click", () => api.esvaziar());
  $("[data-fechar-sacola]").addEventListener("click", () => api.fechar());
  document.querySelectorAll("[data-abrir-sacola]").forEach((b) => b.addEventListener("click", () => api.abrir()));
  gaveta.addEventListener("close", () => document.body.classList.remove("travado"));
  // tocar fora da gaveta fecha
  gaveta.addEventListener("click", (e) => { if (e.target === gaveta) api.fechar(); });

  S.sacola = api;
  render();
})();
