// ============================================================
//  Página: textos da loja, links gerais e rodapé.
//  A vitrine (vitrine.js) e a sacola (sacola.js) cuidam do resto.
// ============================================================
(function () {
  const S = window.Samara;
  const L = S.loja;

  document.querySelectorAll("[data-wa]").forEach((a) => {
    a.href = S.linkWhats("Olá! Vim pelo site e quero saber sobre ");
    a.target = "_blank";
    a.rel = "noopener";
  });
  document.querySelectorAll("[data-wa-texto]").forEach((a) => {
    a.href = S.linkWhats(a.dataset.waTexto);
    a.target = "_blank";
    a.rel = "noopener";
  });

  document.querySelector("[data-entrega-resumo]").textContent =
    "Entrega grátis em " + S.listaCidades(L.entregaGratis) + ".";
  document.querySelector("[data-cidades]").innerHTML =
    L.entregaGratis.map((c) => "<li>" + S.escapar(c) + "</li>").join("");

  const dados = ["<p><strong>Loja física:</strong> " + S.escapar(L.cidade) + "</p>"];
  if (L.endereco) dados.push("<p><strong>Endereço:</strong> " + S.escapar(L.endereco) + "</p>");
  if (L.horario) dados.push("<p><strong>Horário:</strong> " + S.escapar(L.horario) + "</p>");
  document.querySelector("[data-loja]").innerHTML = dados.join("");

  document.querySelector("[data-instagram]").href = "https://www.instagram.com/" + L.instagram + "/";
  document.querySelector("[data-ano]").textContent = new Date().getFullYear();

  // Produtos: planilha (se configurada) ou produtos.js. Depois liga sacola e vitrine.
  S.carregarProdutos().then((r) => S.iniciar(r.produtos, r.origem));
})();
