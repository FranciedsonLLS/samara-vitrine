// ============================================================
//  Vitrine: seletor de cheiro, categorias, busca e rótulos.
// ============================================================
(function () {
  const S = window.Samara;
  const $ = (sel) => document.querySelector(sel);

  const grade = $("[data-grade]");
  const vazio = $("[data-vazio]");
  const status = $("[data-status]");
  const busca = $("[data-busca]");
  const cheiros = $("[data-cheiros]");
  const categorias = $("[data-categorias]");

  const filtro = { familia: null, categoria: "todos", termo: "" };

  // --- seletor de cheiro ---
  const familiasUsadas = new Set(S.produtos.map((p) => p.familia).filter(Boolean));
  cheiros.innerHTML = S.familias
    .filter((f) => familiasUsadas.has(f.id))
    .map((f) =>
      '<button type="button" class="cheiro" aria-pressed="false" data-familia="' + f.id + '" style="--familia:' + f.cor + '">' +
        "<strong>" + S.escapar(f.nome) + "</strong><span>" + S.escapar(f.dica) + "</span>" +
      "</button>"
    ).join("");
  cheiros.addEventListener("click", (e) => {
    const b = e.target.closest("[data-familia]");
    if (!b) return;
    filtro.familia = filtro.familia === b.dataset.familia ? null : b.dataset.familia;
    render();
    if (filtro.familia) document.getElementById("vitrine").scrollIntoView({ block: "start" });
  });

  // --- categorias ---
  const categoriasUsadas = new Set(S.produtos.map((p) => p.categoria));
  const abas = [{ id: "todos", nome: "Tudo" }].concat(S.categorias.filter((c) => categoriasUsadas.has(c.id)));
  categorias.innerHTML = abas
    .map((c) => '<button type="button" role="tab" class="categoria" data-categoria="' + c.id + '">' + S.escapar(c.nome) + "</button>")
    .join("");
  categorias.addEventListener("click", (e) => {
    const b = e.target.closest("[data-categoria]");
    if (!b) return;
    filtro.categoria = b.dataset.categoria;
    render();
  });

  busca.addEventListener("input", () => { filtro.termo = busca.value.trim(); render(); });

  status.addEventListener("click", (e) => {
    if (!e.target.matches("[data-limpar]")) return;
    filtro.familia = null; filtro.categoria = "todos"; filtro.termo = ""; busca.value = "";
    render();
  });

  // --- cliques nos rótulos (delegados) ---
  grade.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    if (b.dataset.adicionar) S.sacola.adicionar(b.dataset.adicionar);
    else if (b.dataset.mais) S.sacola.alterar(b.dataset.mais, 1);
    else if (b.dataset.menos) S.sacola.alterar(b.dataset.menos, -1);
  });
  S.ouvir("sacola", () => grade.querySelectorAll("[data-acoes]").forEach((el) => {
    el.innerHTML = acoes(S.produto(el.dataset.acoes));
  }));

  function preco(p) {
    if (!p.preco) return '<span class="preco-consulte">Consulte o valor</span>';
    const off = p.precoDe && p.precoDe > p.preco ? Math.round((1 - p.preco / p.precoDe) * 100) : 0;
    return (
      (off ? '<span class="preco-de">' + S.brl(p.precoDe) + "</span>" : "") +
      '<span class="preco-por">' + S.brl(p.preco) + "</span>" +
      (off ? '<span class="preco-off">−' + off + "%</span>" : "")
    );
  }

  function acoes(p) {
    if (p.esgotado) {
      return '<a class="acao acao-secundaria" target="_blank" rel="noopener" href="' +
        S.linkWhats("Olá! Vim pelo site. Quando o " + p.nome + " voltar, me avisa?") + '">Avise-me</a>';
    }
    const qtd = S.sacola.quantidade(p.id);
    const id = S.escapar(p.id);
    const principal = qtd
      ? '<div class="qtd" style="justify-content:space-between;width:100%">' +
          '<button type="button" data-menos="' + id + '" aria-label="Tirar um">−</button>' +
          "<output>" + qtd + " na sacola</output>" +
          '<button type="button" data-mais="' + id + '" aria-label="Pôr mais um">+</button>' +
        "</div>"
      : '<button type="button" class="acao acao-principal" data-adicionar="' + id + '">Adicionar</button>';
    const perguntar = '<a class="rotulo-perguntar" target="_blank" rel="noopener" href="' +
      S.linkWhats("Olá! Vim pelo site e tenho uma dúvida sobre o " + p.nome + ".") + '">Tirar dúvida no WhatsApp</a>';
    return principal + perguntar;
  }

  function rotulo(p) {
    const fam = S.familia(p.familia);
    const ficha = [];
    if (p.ml) ficha.push(p.ml + " ml");
    if (fam) ficha.push('<span class="familia-nome">' + S.escapar(fam.nome.toLowerCase()) + "</span>");
    if (p.detalhe) ficha.push(S.escapar(p.detalhe));

    const foto = p.foto
      ? '<img src="' + S.escapar(p.foto) + '" alt="' + S.escapar(p.nome) + '" loading="lazy">'
      : '<div class="rotulo-inicial" aria-hidden="true">' + S.escapar(p.nome.charAt(0)) + "</div>";

    const classes = ["rotulo", p.destaque ? "destaque" : "", p.esgotado ? "esgotado" : ""].join(" ").trim();
    return (
      '<article class="' + classes + '"' + (fam ? ' style="--familia:' + fam.cor + '"' : "") + ">" +
        '<div class="rotulo-faixa" aria-hidden="true"></div>' +
        '<div class="rotulo-miolo">' +
          '<div class="rotulo-foto">' + foto +
            (p.esgotado ? '<span class="rotulo-selo">Esgotado</span>' : p.precoDe && p.preco ? '<span class="rotulo-selo">Oferta</span>' : "") +
          "</div>" +
          '<div class="rotulo-corpo">' +
            (p.marca ? '<p class="rotulo-marca">' + S.escapar(p.marca) + "</p>" : "") +
            "<h3>" + S.escapar(p.nome) + "</h3>" +
            (ficha.length ? '<p class="rotulo-ficha">' + ficha.join(", ") + "</p>" : "") +
            (p.notas ? '<p class="rotulo-notas">' + S.escapar(p.notas) + "</p>" : "") +
            '<div class="rotulo-preco">' + preco(p) + "</div>" +
            '<div class="rotulo-acoes" data-acoes="' + S.escapar(p.id) + '">' + acoes(p) + "</div>" +
          "</div>" +
        "</div>" +
      "</article>"
    );
  }

  function render() {
    cheiros.querySelectorAll("[data-familia]").forEach((b) =>
      b.setAttribute("aria-pressed", String(b.dataset.familia === filtro.familia)));
    categorias.querySelectorAll("[data-categoria]").forEach((b) =>
      b.setAttribute("aria-selected", String(b.dataset.categoria === filtro.categoria)));

    const termo = S.normalizar(filtro.termo);
    const lista = S.produtos
      .filter((p) => !filtro.familia || p.familia === filtro.familia)
      .filter((p) => filtro.categoria === "todos" || p.categoria === filtro.categoria)
      .filter((p) => !termo || S.normalizar([p.nome, p.marca, p.detalhe, p.notas].join(" ")).includes(termo))
      .sort((a, b) => (b.destaque === true) - (a.destaque === true) || (a.esgotado === true) - (b.esgotado === true));

    grade.innerHTML = lista.map(rotulo).join("");
    vazio.hidden = lista.length > 0;

    const ativos = [];
    if (filtro.familia) ativos.push("cheiro " + S.familia(filtro.familia).nome.toLowerCase());
    if (filtro.categoria !== "todos") ativos.push(S.categoria(filtro.categoria).nome);
    if (filtro.termo) ativos.push('"' + S.escapar(filtro.termo) + '"');
    status.innerHTML = ativos.length
      ? lista.length + (lista.length === 1 ? " produto" : " produtos") + " com " + ativos.join(", ") +
        '. <button type="button" data-limpar>Limpar filtros</button>'
      : "";
  }

  render();
})();
