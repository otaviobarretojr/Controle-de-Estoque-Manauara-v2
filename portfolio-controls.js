// Controles e auditoria do Portfólio: exclusão, restauração e associação robusta com Produtos.
state.portfolioHidden=state.portfolioHidden||{};
state.portfolioNames=state.portfolioNames||{};

// Um vínculo salvo por SKU/código pode ficar obsoleto após uma nova importação.
// A resolução abaixo usa, em ordem: vínculo atual, nome do produto anteriormente vinculado,
// nome exibido salvo e nome oficial do item. Nome exato normalizado sempre vence.
function portfolioExactNameMatches(name){
  const n=norm(name);
  if(!n)return [];
  return activeInventory().filter(p=>norm(p.name)===n);
}
function portfolioResolveAnchor(item){
  const savedId=state.portfolioLinks[item.id];
  if(savedId){
    const direct=activeInventory().find(p=>invId(p)===savedId);
    if(direct)return direct;
  }
  const remembered=state.portfolioNames[item.id];
  const candidates=[remembered,item.name].filter(Boolean);
  for(const name of candidates){
    const exact=portfolioExactNameMatches(name);
    if(exact.length)return exact[0];
  }
  return null;
}
function portfolioResolvedItems(item){
  const anchor=portfolioResolveAnchor(item);
  if(anchor){
    // Repara automaticamente o ID persistido caso o produto tenha sido reencontrado pelo nome.
    const currentId=invId(anchor);
    if(state.portfolioLinks[item.id]!==currentId)state.portfolioLinks[item.id]=currentId;
    state.portfolioNames[item.id]=anchor.name;
    if(!item.aggregateColors)return [anchor];
    const family=colorlessFamilyName(anchor.name);
    const familyItems=activeInventory().filter(p=>colorlessFamilyName(p.name)===family);
    return familyItems.length?familyItems:[anchor];
  }
  // Sem vínculo manual válido: primeiro tenta nome exato; depois usa as regras oficiais por termos.
  const exact=portfolioExactNameMatches(item.name);
  if(exact.length){
    if(!item.aggregateColors)return exact;
    const family=colorlessFamilyName(exact[0].name);
    return activeInventory().filter(p=>colorlessFamilyName(p.name)===family);
  }
  return portfolioAutoItems(item);
}

const originalPortfolioAnalysis=portfolioAnalysis;
portfolioAnalysis=function(){
  return PORTFOLIO
    .filter(item=>!state.portfolioHidden[item.id])
    .map(item=>{
      const matches=portfolioResolvedItems(item);
      const stock=matches.reduce((sum,p)=>sum+Number(p.stock||0),0);
      const need=Math.max(0,item.min-stock);
      const anchor=matches[0]||null;
      const displayName=anchor?anchor.name:(state.portfolioNames[item.id]||item.name);
      return {...item,name:displayName,matches,stock,need,status:stock>=item.min?'complete':'missing',manual:!!state.portfolioLinks[item.id]};
    });
};

const baseRenderPortfolio=renderPortfolio;
renderPortfolio=function(){
  baseRenderPortfolio();
  const hiddenIds=Object.keys(state.portfolioHidden).filter(id=>state.portfolioHidden[id]);
  const toolbar=document.querySelector('#view-portfolio .toolbar');
  if(toolbar&&!document.getElementById('restorePortfolioBtn')){
    const btn=document.createElement('button');
    btn.id='restorePortfolioBtn';btn.className='btn secondary';btn.type='button';
    btn.onclick=restorePortfolioItems;toolbar.appendChild(btn);
  }
  const restoreBtn=document.getElementById('restorePortfolioBtn');
  if(restoreBtn)restoreBtn.textContent=hiddenIds.length?`Restaurar removidos (${hiddenIds.length})`:'Restaurar removidos';

  // A coluna Vínculo fica oculta; a associação continua ativa internamente.
  const table=document.querySelector('#portfolioTable table');
  if(table){
    const heads=[...table.querySelectorAll('thead th')];
    const linkIndex=heads.findIndex(th=>['vínculo','vinculo'].includes(th.textContent.trim().toLowerCase()));
    if(linkIndex>=0){
      heads[linkIndex].style.display='none';
      table.querySelectorAll('tbody tr').forEach(tr=>{if(tr.children[linkIndex])tr.children[linkIndex].style.display='none'});
    }
  }

  document.querySelectorAll('#portfolioTable tbody tr').forEach(tr=>{
    const edit=tr.querySelector('button[onclick^="openPortfolioLink"]');
    if(!edit)return;
    const m=(edit.getAttribute('onclick')||'').match(/openPortfolioLink\('([^']+)'\)/);
    if(!m)return;
    const id=m[1],td=edit.closest('td');if(!td)return;
    edit.textContent='Editar produto';
    if(!td.querySelector('.portfolio-delete-btn')){
      const del=document.createElement('button');del.className='btn small danger portfolio-delete-btn';
      del.style.marginLeft='6px';del.textContent='Excluir';del.onclick=()=>removePortfolioItem(id);td.appendChild(del);
    }
  });
};

// Editar produto/nome usa a mesma seleção da aba Produtos: nome e associação são uma única informação.
window.editPortfolioName=id=>openPortfolioLink(id);

const saveBtn=document.querySelector('#saveLink');
if(saveBtn){
  saveBtn.onclick=()=>{
    if(linkContext==='portfolio'&&linkKey&&selectedLink){
      const p=state.inventory.find(x=>invId(x)===selectedLink);
      if(!p){alert('Selecione um produto válido da aba Produtos.');return;}
      state.portfolioLinks[linkKey]=invId(p);
      state.portfolioNames[linkKey]=p.name;
      save();closeModal();return;
    }
    if(linkKey&&selectedLink){state.links[linkKey]=selectedLink;save();closeModal();}
  };
}
const unlinkBtn=document.querySelector('#unlinkBtn');
if(unlinkBtn){
  unlinkBtn.onclick=()=>{
    if(linkKey){
      if(linkContext==='portfolio'){delete state.portfolioLinks[linkKey];delete state.portfolioNames[linkKey];}
      else delete state.links[linkKey];
    }
    save();closeModal();
  };
}

window.removePortfolioItem=function(id){
  const item=PORTFOLIO.find(x=>x.id===id);if(!item)return;
  const resolved=portfolioResolveAnchor(item);
  const displayName=resolved?resolved.name:(state.portfolioNames[id]||item.name);
  if(!confirm(`Excluir "${displayName}" do Portfólio?\n\nEle deixará de entrar no cálculo de conformidade e não voltará após importar uma nova planilha.`))return;
  state.portfolioHidden[id]=true;save();
};
window.restorePortfolioItems=function(){
  const removed=PORTFOLIO.filter(item=>state.portfolioHidden[item.id]);
  if(!removed.length){alert('Não há itens removidos do Portfólio.');return;}
  const list=removed.map((item,i)=>`${i+1}. ${state.portfolioNames[item.id]||item.name}`).join('\n');
  const choice=prompt(`Itens removidos:\n\n${list}\n\nDigite o número do item para restaurar ou 0 para restaurar todos:`,'0');
  if(choice===null)return;const n=Number(choice);
  if(n===0){state.portfolioHidden={};save();return;}
  if(Number.isInteger(n)&&n>=1&&n<=removed.length){delete state.portfolioHidden[removed[n-1].id];save();}
  else alert('Opção inválida.');
};

// Auditoria automática após cada importação/renderização: se nome e Produto coincidirem,
// o saldo é considerado mesmo que um ID antigo tenha deixado de existir.
renderPortfolio();
