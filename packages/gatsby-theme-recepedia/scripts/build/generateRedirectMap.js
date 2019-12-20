/* eslint-disable no-console */

const fs = require('fs');
const parser = require('xml2json');
const jmespath = require('jmespath');
const keys = require('lodash/keys');
const partition = require('lodash/partition');
const customRedirects = {
  '/search/estrogonofe': '/procurar?searchQuery=estrogonofe',
  '/tipos-de-receita/massas': '/categoria/massas/',
  '/search/pudim': '/procurar?searchQuery=pudim',
  '/panqueca-de-carne/receitas/187204': '/receita/',
  '/receita/197611-tapioca-de-peito-de-peru-e-ricota-com-becel': '/receita/',
  '/search/panqueca': '/procurar?searchQuery=panqueca',
  '/receita/187204-panqueca-de-carne':
    '/receita/panquecas-e-waffles/177590-panqueca-de-carne/',
  '/search/arroz': '/procurar?searchQuery=arroz',
  '/search/salada': '/procurar?searchQuery=salada',
  '/search/Sanduiche': '/procurar?searchQuery=Sanduiche',
  '/pudim-de-leite-condensado/receitas/195555': '/receita/',
  '/bolo-de-cenoura-com-cobertura-de-chantilate/receitas/197624':
    '/categoria/bolos/',
  '/arroz-colorido/receitas/187545': '/arroz/',
  '/receita/187026-carne-moida-cozida-com-quiabo': '/receita/',
  '/receita/197472-bolo-de-chocolate-simples-e-fofinho-com-cobertura-cremosa':
    '/receita/',
  '/search/risoto': '/procurar?searchQuery=risoto',
  '/search/torta de liquidificador':
    '/procurar?searchQuery=torta%20de%20liquidificador',
  '/search/bolo': '/procurar?searchQuery=bolo',
  '/search/pizzaEncontre no Site de Recepedia Deliciosas Receitas de Pizzas.':
    '/procurar?searchQuery=pizzaEncontre%20no%20Site%20de%20Recepedia%20Deliciosas%20Receitas%20de',
  '/search/mousse%20de%20maracuja':
    '/procurar/?searchQuery=mousse%20de%20maracuja',
  '/search/churrasco': '/procurar?searchQuery=churrasco',
  '/search/torta': '/procurar?searchQuery=torta',
  '/search/pizza': '/procurar?searchQuery=pizza',
  '/search/vitamina': '/procurar?searchQuery=vitamina',
  '/search/arroz de forno': '/procurar?searchQuery=arroz de forno',
  '/search': '/procurar?searchQuery=',
  '/search/nhoque': '/procurar?searchQuery=nhoque',
  '/search/salada de macarrao': '/procurar?searchQuery=salada de macarrao',
  '/search/chantibon': '/procurar?searchQuery=chantibon',
  '/search/paste': '/procurar?searchQuery=paste',
  '/receita/197881-bolo-simples-de-cacau': '/receita/',
  '/receita/186943-macarrao': '/receita/',
  '/salpicao-de-frango-e-legumes/receitas/187202': '/receita/',
  '/receita/186942-batata-gratinada-facil': '/receita/',
  '/receita/186086-bolo-de-mandioca': '/receita/',
  '/receita/197624-bolo-de-cenoura-com-cobertura-de-sorvete-e-chocolate':
    '/receita/',
  '/receita/185922-carne-moida-macia-cozida-com-mandioquinha': '/receita/',
  '/receita/184975-frango-assado-suculento-com-batatas-douradas': '/receita/',
  '/receita/197597-baiao-de-dois-tradicional': '/receita/',
  '/receita/185175-arroz-cremoso-com-presunto-queijo-e-tomate': '/receita/',
  '/receita/187030-bife-acebolado-de-file-mignon-com-pimentao-e-tomate':
    '/receita/',
  '/tutu-de-feijao/receitas/186805': '/receita/',
  '/muffins-com-recheio-de-morango/receitas/197637': '/receita/',
  '/receita/185104-arroz-cremoso-e-rapido-com-atum-e-maionese-hellmanns':
    '/receita/',
  '/receita/197653-hamburguer-caseiro-com-molho-especial-de-alho': '/receita/',
  '/arroz-cremoso-com-vegetais/receitas/185204': '/receita/',
  '/receita/197667-bolo-de-fuba-com-maizena': '/receita/',
  '/receita/197804-bolo-de-fuba-fofinho-e-facil': '/receita/',
  '/receita/185574-frigideira-de-frango-pratica-com-pimentao-tomate-e-cebola':
    '/receita/',
  '/sorvete-de-mousse-de-maracuja/receitas/193031': '/receita/',
  '/receita/185889-arroz-com-verduras-rapido': '/receita/',
  '/receita/187201-sopa-creme-de-lentilha-e-legumes-nutritiva': '/receita/',
  '/receita/185763-arroz-nutritivo-incrementado-com-cenoura-e-milho':
    '/receita/',
  '/receita/197805-bolo-de-milho-fofinho': '/receita/',
  '/creme-de-abacate-com-frutas-vermelhas/receitas/197607': '/receita/',
  '/almondegas-ao-forno/receitas/197595': '/receita/',
  '/receita/185226-bolo-recheado-com-sorvete': '/receita/',
  '/receita/197525-creme-de-legumes-saboroso-e-encorpado': '/receita/',
  '/receita/185778-bife-de-file-mignon-grelhado-com-alecrim': '/receita/',
  '/receita/197856-bolinhos-cremosos-de-arroz-e-legumes': '/receita/',
  '/panquecas-americanas-com-frutas-e-mel/receitas/197640': '/receita/',
  '/torta-de-biscoito-com-sorvete-chantibon/receitas/197630': '/receita/',
  '/receita/197845-molho-chimichurri-cremoso-para-churrasco': '/receita/',
  '/mousse-de-maracuja-rapido/receitas/193841': '/receita/',
  '/receita/185782-costela-suculenta-assada-no-forno-e-recheada-com-mandioca':
    '/receita/',
  '/receita/186086-bolo-de-mandioca-fofinho-com-coco-ralado': '/receita/',
  '/receita/186045-macarrao-com-abobrinha-tomate-e-queijo': '/receita/',
  '/receita/187037-salada-pratica-de-macarrao-parafuso-com-kani-kama':
    '/receita/',
  '/receita/186805-tutu-de-feijao-saboroso-com-bacon-e-linguica': '/receita/',
  '/frango-com-quiabo/receitas/197483': '/receita/',
  '/salada-de-batata-com-atum/receitas/187034': '/receita/',
  '/receita/197690-sanduiche-de-file-de-frango-com-queijo-salada-e-maionese':
    '/receita/',
  '/receita/197714-bolo-formigueiro-facil-e-rapido': '/receita/',
  '/receita/197717-bolo-de-leite-simples': '/receita/',
  '/receita/186695-iscas-de-figado-refogadas-com-pimentao': '/receita/',
  '/receita/186900-torta-de-frango-facil-e-cremosa-de-liquidificador-com-ervilha-e-milho':
    '/receita/torta/54507-torta-de-frango-facil-e-cremosa-de-liquidificador-com-ervilha-e-milho/',
  '/receita/186823-receita-simples-de-molho-branco-com-maizena-e-noz-moscada':
    '/receita/molho/54170-receita-simples-de-molho-branco-com-maizena-e-noz-moscada/',
  '/receita/186900-torta-de-frango-de-liquidificador':
    '/receita/torta/149049-torta-de-frango-de-liquidificador/',
  '/receita/186634-feijoada-completa-tradicional-deliciosa':
    '/receita/carne/54349-feijoada-completa-tradicional-deliciosa/',
  '/receita/195555-pudim-de-leite-condensado':
    '/receita/pudins/101178-pudim-de-leite/',
  '/receita/185212-rocambole-facil-de-carne-moida-recheado-com-presunto-e-queijo':
    '/receita/recheio/36779-rocambole-facil-de-carne-moida-recheado-com-presunto-e-queijo/',
  '/receita/185740-pure-de-batata-simples-e-cremoso':
    '/receita/verduras-e-legumes/36144-pure-de-batata-simples-e-cremoso/',
  '/receita/189638-como-montar-hamburguer':
    '/receita/hamburguer/111033-hamburguer-com-maionese-verde/',
  '/receita/197696-bolo-de-banana-de-liquidificador':
    '/receita/197696-bolo-de-banana-de-liquidificador-pratico-e-caseiro',
  '/receita/192219-bolo-de-fuba-de-liquidificador':
    '/receita/bolo/36669-bolo-cremoso-de-fuba/',
  '/receita/185212-rocambole-de-carne-moida-recheado-com-presunto-e-queijo':
    '/receita/recheio/36779-rocambole-facil-de-carne-moida-recheado-com-presunto-e-queijo/',
  '/receita/195413-mousse-de-chocolate':
    '/receita/dish/175453-tortinha-mousse-de-cacau-e-baunilha/',
  '/receita/189378-cachorro-quente-de-forno':
    '/receita/sanduiche/118194-hot-dog-cremoso/',
  '/receita/195379-bolo-cuca': '/receita/bolo/35733-cuca-de-banana/',
  '/receita/189450-mingau-de-aveia':
    '/receita/dish/175668-mingau-de-quinoa-flocos-organica-com-granola-mae-terra/',
  '/receita/188221-cafe-cremoso-especial':
    '/receita/bebidas/36685-shake-de-cappuccino/',
  '/receita/191625-macarrao-com-caldo-knorr':
    '/receita/massa/36050-macarrao-com-molho-de-talos-de-agriao/',
  '/receita/195987-biscoito-de-queijo-assado':
    '/receita/pao/35871-biscoito-de-queijo/',
  '/receita/193590-frango-ao-molho-de-tomate':
    '/receita/aves/35432-file-de-frango-com-molho-de-tomate-e-cebola/',
  '/receita/196576-bolo-de-cenoura':
    '/receita/196633-bolo-de-cenoura-com-cobertura-de-chocolate',
  '/receita/195311-costela-gaucha-ao-forno':
    '/receita/carne/35901-costela-suculenta-assada-no-forno-e-recheada-com-mandioca/',
  '/receita/189779-torta-gelada-de-maracuja':
    '/receita/dish/175434-torta-cremosa-de-maracuja-com-chocolate/',
  '/receita/188395-bolo-de-maca-especial':
    '/receita/bolo/36081-bolo-integral-de-maca/',
  '/receita/193572-croquete-de-carne': '/receita/carne/35600-quibe-no-palito/',
  '/receita/194773-rosca-de-leite-condensado':
    '/receita/sobremesa/152666-rosca-natalina/',
  '/receita/196679-pao-de-forno': '/receita/pao/178690-pao-italiano-caseiro/',
  '/receita/188029-bolo-economico': '/receita/bolo/103854-bolo-simples/',
  '/receita/185740-pure-de-batata-simples':
    '/receita/verduras-e-legumes/36144-pure-de-batata-simples-e-cremoso/',
  '/receita/186823-receita-simples-de-molho-branco':
    '/receita/186823-receita-simples-de-molho-branco-com-maizena-e-noz-moscada',
  '/receita/187204-panqueca-de-carne-moida-pratica-com-molho-de-tomate':
    '/receita/panquecas-e-waffles/177590-panqueca-de-carne/',
  '/receita/197696-bolo-de-banana-de-liquidificador-pratico-e-caseiro':
    '/receita/sobremesa/67407-bolo-de-banana-de-liquidificador-pratico-e-caseiro/',
  '/receita/195312-divino-strogonoff-de-macarrao-e-carne-moida':
    '/receita/macarrao/36051-macarrao-de-panela-de-pressao/',
  '/receita/196445-macarrao-presunto-e-queijo':
    '/receita/macarrao/54530-macarrao-cremoso-incrementado-com-presunto-queijo-e-tomate/',
  '/receita/187202-salpicao-de-frango-pratico-com-cenoura-batata-milho-e-salsao':
    '/receita/aves/54158-salpicao-de-frango-pratico-com-cenoura-batata-milho-e-salsao/',
  '/receita/192969-biscoito-de-polvilho': '/procurar?searchQuery=biscoito',
  '/receita/187375-pudim-de-leite-condensado-no-microondas':
    '/receita/sobremesa/101178-pudim-de-leite/',
  '/receita/189319-files-de-peixe-fritos-crocantes':
    '/receita/peixe/106404-linguado-em-crosta-de-erva-e-molho-agridoce/',
  '/receita/186485-massa-de-salgadinho-para-festa':
    '/procurar?searchQuery=bolinho',
  '/receita/186912-cuscuz-de-sardinha-simples-e-versatil':
    '/receita/peixe/54382-cuscuz-de-sardinha-simples-e-versatil/',
  '/receita/187981-sufle-de-chuchu': '/procurar?searchQuery=sufl%C3%AA',
  '/receita/188243-virado-de-feijao-de-corda':
    '/receita/carne/54411-virado-de-feijao-completo/',
  '/receita/191122-cuscuz-com-queijo': '/receita/peixe/53800-cuscuz-de-atum/',
  '/receita/189524-canjica-cremosa-com-amendoim':
    '/receita/sobremesa/84873-canjica-com-amendoim/',
  '/receita/186897-chocolate-quente':
    '/receita/bebidas/54812-chocolate-quente-cremoso-de-cremogema/',
  '/receita/191167-ovo-frito-no-microondas': '/procurar?searchQuery=ovo',
  '/receita/187033-salada-de-batata-pratica-e-deliciosa-com-ovo-e-maionese':
    '/receita/salada/54426-salada-de-batata-pratica-e-deliciosa-com-ovo-e-maionese/',
  '/receita/188222-torta-salgada-com-pao-de-forma': '/categoria/tortas/',
  '/receita/187307-recheio-de-abacaxi-para-bolo-de-aniversario':
    '/receita/bolo/35811-bolo-diferente-de-abacaxi-e-coco/',
  '/receita/187694-macarrao-cremoso-na-pressao':
    '/receita/macarrao/36051-macarrao-de-panela-de-pressao/',
  '/receita/194693-geladinho-de-coco':
    '/receita/sorvete/93465-bolo-gelado-de-coco-com-sorvete-de-creme-kibon/',
  '/receita/186904-frango-empanado-crocante-ao-forno':
    '/receita/aves/54561-frango-empanado-crocante-ao-forno/',
  '/receita/187669-torta-fria-de-frango-sem-maionese':
    '/receita/torta/54379-torta-fria-de-pure-com-recheio-de-frango/',
  '/receita/186943-macarrao-cremoso-incrementado-com-presunto-queijo-e-tomate':
    '/receita/macarrao/54530-macarrao-cremoso-incrementado-com-presunto-queijo-e-tomate/',
  '/receita/187496-suco-de-acerola':
    '/receita/frutas/36658-shake-da-imunidade-com-morango-acerola-e-abacaxi/',
  '/receita/190714-miojo-especial-de-microondas': '/categoria/massas/',
  '/receita/191298-pao-de-queijo-sem-queijo-sem-gluten-e-sem-lactose':
    '/receita/pao/179559-pao-sem-gluten/',
  '/receita/189656-mousse-rapido-de-tang-danoninho':
    '/receita/bebidas/36585-vitamina-de-morango-e-limao-siciliano/',
  '/receita/195508-figado-de-frango-com-molho':
    '/receita/carne/54465-iscas-de-figado-refogadas-com-pimentao/',
  '/receita/189508-chiclete-de-camarao':
    '/receita/massa/54395-lasanha-de-camarao/',
  '/receita/196343-x-bacon':
    '/receita/hamburguer/99444-hamburguer-caseiro-de-picanha-e-bacon-com-cebolas-caramelizadas/',
  '/receita/187734-bisteca-de-porco-milanesa': '/procurar?searchQuery=bisteca',
  '/receita/190669-coxa-empanada-pratica-economica-e-deliciosa-da-vo-ana':
    '/receita/aves/173812-frango-empanado-beeem-cremoso/',
  '/receita/190771-bolinhos-de-arroz-assados':
    '/receita/arroz/156041-bolinhos-cremosos-de-arroz-e-legumes/',
  '/receita/187775-mousse-de-maracuja-com-2-ingredientes':
    '/receita/dish/175434-torta-cremosa-de-maracuja-com-chocolate/',
  '/receita/190274-carne-de-sol-na-nata':
    '/receita/carne/173870-carne-de-sol-com-macaxeira/',
  '/receita/balas-e-doces/177605-brownie-de-chocolate/':
    '/receita/bolo/177605-brownie-de-chocolate/',
  '/receita/sobremesa-gelada/36433-bolo-de-caneca-com-sorvete-e-calda-de-chocolate/':
    '/receita/sorvete/36433-bolo-de-caneca-com-sorvete-e-calda-de-chocolate/',
  '/receita/salgados/36151-kibe-assado-no-micro-ondas/':
    '/receita/carne/36151-kibe-assado-no-micro-ondas/',
  '/receita/antepasto/173760-bruschettas-de-tomates-cremosas/':
    '/receita/pao/173760-bruschettas-de-tomates-cremosas/',
  '/search/bolinho%20de%20chuva': '/receita/sobremesa/181045-bolinho-de-chuva/',
  '/faq': '/sobre-recepedia/',
  '/receita/bife/36155-file-mignon-com-molho-agridoce-cremoso/':
    '/receita/carne/36155-file-mignon-com-molho-agridoce-cremoso/',
  '/receita/massa/35978-espaguete-com-camarao-acafrao-e-cebolinha/':
    '/receita/molho/35978-espaguete-com-camarao-acafrao-e-cebolinha/',
  '/pais/receita/biscoitinhos-crocantes-sem-gluten-e-sem-leite':
    '/receita/biscoito/152630-biscoito-de-gengibre-e-canela/',
  '/pais/receita/macarrao-com-molho-hellmanns':
    '/receita/macarrao/157113-macarrao-cremoso/',
  '/receita/massa/173758-penne-ao-molho-parisiense/':
    '/receita/macarrao/173758-penne-ao-molho-parisiense/',
  '/receita/calda/36745-manjar-de-coco-com-calda-de-ameixa/':
    '/receita/sobremesa/36745-manjar-de-coco-com-calda-de-ameixa/',
  '/receita/massa/36794-panqueca-de-carne-moida-com-creme-de-cebola/':
    '/receita/panquecas-e-waffles/36794-panqueca-de-carne-moida-com-creme-de-cebola/',
  '/receita/salada/177590-panqueca-de-carne/':
    '/receita/panquecas-e-waffles/177590-panqueca-de-carne/',
  '/receita/salada/36467-salada-de-macarrao-com-molho-de-ricota/':
    '/receita/macarrao/36467-salada-de-macarrao-com-molho-de-ricota/',
  '/receita/sanduiche/36385-salpicao-de-lombo/':
    '/receita/carne/36385-salpicao-de-lombo/',
  '/pais/clubes/arisco': '/procurar/?searchQuery=arisco',
  '/print/receita/188395-bolo-de-maca-especial':
    '/receita/bolo/36081-bolo-integral-de-maca/',
  '/receita/186634-feijoada-completa':
    '/receita/graos/54649-receita-de-feijoada/',
  '/search/lasanha': '/procurar/?searchQuery=lasanha',
  '/search/Porco%20recheado':
    '/receita/carne/35837-lombo-com-gorgonzola-e-pera/',
  '/pizza-de-sardinha/receitas/187644': '/procurar/?searchQuery=pizza',
  '/rosca-de-leite-condensado/receitas/196571':
    '/receita/sobremesa/152666-rosca-natalina/',
  '/pais/receita/arroz-cremoso2': '/procurar/?searchQuery=arroz%20cremoso',
  '/print/receita/188156-torta-de-morango-com-creme-de-chocolate-branco':
    '/receita/torta/36136-torta-de-chocolate-branco-com-morango/',
  '/receita/frutas/36778-lombo-recheado-com-farofa-doce/':
    '/receita/molho/36778-lombo-recheado-com-farofa-doce/',
  '/bolo-de-cenoura-com-laranja/receitas/185090':
    '/receita/sobremesa/35824-bolo-de-cenoura-com-laranja/',
  '/bolo-de-chocolate-recheado-com-damascos-e-nozes/receitas/197600':
    '/receita/sobremesa/36618-bolo-de-chocolate-recheado-com-damascos-e-nozes/',
  '/camarao-abafado/receitas/194618': '/procurar/?searchQuery=camar%C3%A3o',
  '/pais/receita/feijoada-completa2':
    '/receita/graos/54649-receita-de-feijoada/',
  '/pais/receita/lasanha-de-camarao1':
    '/receita/massa/54395-lasanha-de-camarao/',
  '/pais/receita/lombo-assado-com-batatas-e-alecrim':
    '/receita/carne/149044-lombo-assado-com-batatas-e-alecrim/',
  '/receita/186912-cuscuz-de-sardinha':
    '/receita/peixe/54382-cuscuz-de-sardinha-simples-e-versatil/',
  '/receita/197472-bolo-de-chocolate':
    '/receita/bolo/178649-bolo-de-chocolate/',
  '/receita/bebidas/125192-mousse-de-chocolate-70-harmonizado-com-cha-verde-com-frutas-vermelhas/':
    '/receita/sobremesa-gelada/125192-mousse-de-chocolate-70-harmonizado-com-cha-verde-com-frutas-vermelhas/',
  '/receita/massa/35932-fettuccine-verde-ao-molho-de-shitake/':
    '/receita/molho/35932-fettuccine-verde-ao-molho-de-shitake/',
  '/receita/massa/36739-legumes-assados-e-penne-ao-molho-pesto/':
    '/receita/molho/36739-legumes-assados-e-penne-ao-molho-pesto/',
  '/receita/salada/36791-salada-de-quinoa-com-brocolis/':
    '/receita/verduras-e-legumes/36791-salada-de-quinoa-com-brocolis/',
  '/search/bolo%20de%20chocolate': '/receita/bolo/178649-bolo-de-chocolate/',
  '/biscoitinhos-crocantes-sem-gluten-e-sem-leite/receitas/191335':
    '/receita/biscoito/152630-biscoito-de-gengibre-e-canela/',
  '/hamburguer-de-picanha-e-bacon-com-cebolas-caramelizadas/receitas/197446':
    '/receita/hamburguer/99444-hamburguer-caseiro-de-picanha-e-bacon-com-cebolas-caramelizadas/',
  '/mousse-de-chocolate/receitas/195413':
    '/receita/dish/175453-tortinha-mousse-de-cacau-e-baunilha/',
  '/pais/home': '/',
  '/pais/mapa-receitas': '/receita',
  '/pais/receita/batata-gratinada4':
    '/receita/verduras-e-legumes/35868-batata-gratinada-com-alecrim-e-alho/',
};

module.exports = async ({
  newUrls,
  oldSitemapPath,
  oldDomain,
  JMESPathToUrls,
  redirectRules,
  otherwiseRedirectTo,
  redirectCode = 301,
}) => {
  let urls = [];

  oldSitemapPath.forEach(path => {
    const data = fs.readFileSync(path);
    const jsonData = parser.toJson(data, { object: true });

    if (!jsonData) {
      console.log('Old sitemap file is empty.');
      return;
    }

    urls = [...urls, ...jmespath.search(jsonData, JMESPathToUrls)];
  });

  if (!urls || !urls.length) {
    console.log(
      'No URLs found by provided JMESPath. Check if the JMESPath is correct.'
    );
    return;
  }

  const oldUrls = urls.map(url => url.replace(oldDomain, ''));
  let unmappedOldUrls = [...oldUrls];
  let unmappedUrls = [...newUrls];
  let redirects = [];
  for (let url of oldUrls) {
    const equal = newUrls.find(
      newUrl => newUrl === url || newUrl === `${url}/`
    );
    if (equal) {
      unmappedOldUrls.splice(unmappedOldUrls.indexOf(url), 1);
      unmappedUrls.splice(unmappedUrls.indexOf(equal), 1);
      continue;
    }
    const urlRedirects = [];
    for (let rule of redirectRules) {
      const result = url.match(rule.from);
      if (result) {
        let redirectToRule = rule.to;
        if (result.groups) {
          keys(result.groups).forEach(
            key =>
              (redirectToRule = redirectToRule.replace(
                `?<${key}>`,
                result.groups[key]
              ))
          );
        }

        const matchedUrl = newUrls.find(url => url.match(redirectToRule));

        if (matchedUrl) {
          const existRedirect = urlRedirects.find(
            redirect => redirect.from === url
          );
          if (!existRedirect) {
            urlRedirects.push({ from: url, to: matchedUrl });
            if (unmappedOldUrls.indexOf(url) !== -1) {
              unmappedOldUrls.splice(unmappedOldUrls.indexOf(url), 1);
            }
            if (unmappedUrls.indexOf(matchedUrl) !== -1) {
              unmappedUrls.splice(unmappedUrls.indexOf(matchedUrl), 1);
            }
          } else {
            if (existRedirect.to === rule.otherwise) {
              existRedirect.to = matchedUrl;
              if (unmappedOldUrls.indexOf(url) !== -1) {
                unmappedOldUrls.splice(unmappedOldUrls.indexOf(url), 1);
              }
              if (unmappedUrls.indexOf(matchedUrl) !== -1) {
                unmappedUrls.splice(unmappedUrls.indexOf(matchedUrl), 1);
              }
            }
          }
        } else {
          urlRedirects.push({
            from: url,
            to: rule.otherwise,
            ['isOtherwise']: true,
          });
        }
      }
    }

    if (urlRedirects.length) {
      const [otherwiseRedirects, nonOtherwiseRedirects] = partition(
        urlRedirects,
        ['isOtherwise', true]
      );
      const appliedRedirect = nonOtherwiseRedirects.length
        ? nonOtherwiseRedirects[0]
        : otherwiseRedirects[0];
      redirects.push(appliedRedirect);
    } else {
      redirects.push({ from: url, to: otherwiseRedirectTo });
    }
  }

  Object.keys(customRedirects).forEach(fromUrl => {
    const existingRedirect = redirects.find(row => row.from === fromUrl);

    existingRedirect &&
      redirects.splice(redirects.indexOf(existingRedirect), 1);

    redirects.push({
      from: fromUrl,
      to: customRedirects[fromUrl],
    });
  });
  // For debug purposes only
  fs.writeFileSync('unmappedNewUrls.txt', unmappedUrls.join('\n'));
  fs.writeFileSync('oldUrlsMappedToRoot.txt', unmappedOldUrls.join('\n'));

  console.log(`${redirects.length} redirect rules created`);

  const redirectsMap = redirects
    .map(item => `${item.from} ${item.to} ${redirectCode}`)
    .join('\n');

  // use to see log in Netlify
  // console.log(redirectsMap);

  fs.writeFileSync('public/_redirects', redirectsMap);
};
