// Controles adicionais do Portfólio: exclusão persistente, restauração e nome sincronizado com Produtos.
state.portfolioHidden=state.portfolioHidden||{};
state.portfolioNames=state.portfolioNames||{};

const basePortfolioAnalysis=portfolioAnalysis;
portfolioAnalysis=function(){
  return basePortfolioAnalysis()
    .filter(item=>!state.portfolioHidden[item.id])
    .map(item=>{
      const linkedId=state.portfolioLinks[item.id];
      const linkedProduct=linkedId?state.inventory.find(p=>invId(p)===linkedId):null;
      return {...item,name:linkedProduct?linkedProduct.name:item.name};
    });
};

const baseRenderPortfolio=renderPortfolio;
renderPortfolio=function(){
  baseRenderPortfolio();
  const hiddenIds=Object.keys(state.portfolioHidden).filter(id=>state.portfolioHidden[id]);
  const toolbar=document.querySelector('#view-portfolio .toolbar');
  if(toolbar&&!document.getElementById('restorePortfolioBtn')){
    const btn=document.createElement('button');
    btn.id='restorePortfolioBtn';
    btn.className='btn secondary';
    btn.type='button';
    btn.textContent=hiddenIds.length?`Restaurar removidos (${hiddenIds.length})`:'Restaurar removidos';
    btn.onclick=restorePortfolioItems;
    toolbar.appendChild(btn);
  }
  const restoreBtn=document.getElementById('restorePortfolioBtn');
  if(restoreBtn)restoreBtn.textContent=hiddenIds.length?`Restaurar removidos (${hiddenIds.length})`:'Restaurar removidos';

  const table=document.querySelector('#portfolioTable table');
  if(table){
    const headCells=[...table.querySelectorAll('thead th')];
    const linkIndex=headCells.findIndex(th=>['vínculo','vinculo'].includes(th.textContent.trim().toLowerCase()));
    if(linkIndex>=0){
      headCells[linkIndex].style.display='none';
      table.querySelectorAll('tbody tr').forEach(tr=>{
        if(tr.children[linkIndex])tr.children[linkIndex].style.display='none';
      });
    }
  }

  document.querySelectorAll('#portfolioTable tbody tr').forEach(tr=>{
    const edit=tr.querySelector('button[onclick^="openPortfolioLink"]');
    if(!edit)return;
    const m=(edit.getAttribute('onclick')||'').match(/openPortfolioLink\('([^']+)'\)/);
    if(!m)return;
    const id=m[1];
    const td=edit.closest('td');
    if(!td)return;

    if(!td.querySelector('.portfolio-name-btn')){
      const rename=document.createElement('button');
      rename.className='btn small secondary portfolio-name-btn';
      rename.style.marginRight='6px';
      rename.textContent='Editar nome';
      rename.title='Escolher o produto correspondente da aba Produtos';
      rename.onclick=()=>editPortfolioName(id);
      td.insertBefore(rename,edit);
    }

    if(!td.querySelector('.portfolio-delete-btn')){
      const del=document.createElement('button');
      del.className='btn small danger portfolio-delete-btn';
      del.style.marginLeft='6px';
      del.textContent='Excluir';
      del.onclick=()=>removePortfolioItem(id);
      td.appendChild(del);
    }
  });
};

window.editPortfolioName=function(id){
  const item=PORTFOLIO.find(x=>x.id===id);
  if(!item)return;
  openPortfolioLink(id);
  const target=document.querySelector('#linkTarget');
  if(target)target.textContent=`${item.name} · selecione o produto correto da aba Produtos`;
};

const baseSaveLinkHandler=document.querySelector('#saveLink')?.onclick;
if(document.querySelector('#saveLink')){
  document.querySelector('#saveLink').onclick=()=>{
    if(linkContext==='portfolio'&&linkKey&&selectedLink){
      state.portfolioLinks[linkKey]=selectedLink;
      delete state.portfolioNames[linkKey];
      save();
      closeModal();
      return;
    }
    if(typeof baseSaveLinkHandler==='function')baseSaveLinkHandler();
  };
}

const baseUnlinkHandler=document.querySelector('#unlinkBtn')?.onclick;
if(document.querySelector('#unlinkBtn')){
  document.querySelector('#unlinkBtn').onclick=()=>{
    if(linkContext==='portfolio'&&linkKey){
      delete state.portfolioLinks[linkKey];
      delete state.portfolioNames[linkKey];
      save();
      closeModal();
      return;
    }
    if(typeof baseUnlinkHandler==='function')baseUnlinkHandler();
  };
}

window.removePortfolioItem=function(id){
  const item=PORTFOLIO.find(x=>x.id===id);
  if(!item)return;
  const linkedId=state.portfolioLinks[id];
  const linkedProduct=linkedId?state.inventory.find(p=>invId(p)===linkedId):null;
  const displayName=linkedProduct?linkedProduct.name:item.name;
  if(!confirm(`Excluir "${displayName}" do Portfólio?\n\nEle deixará de entrar no cálculo de conformidade e não voltará após importar uma nova planilha.`))return;
  state.portfolioHidden[id]=true;
  save();
};

window.restorePortfolioItems=function(){
  const removed=PORTFOLIO.filter(item=>state.portfolioHidden[item.id]);
  if(!removed.length){alert('Não há itens removidos do Portfólio.');return;}
  const list=removed.map((item,i)=>{
    const linkedId=state.portfolioLinks[item.id];
    const linkedProduct=linkedId?state.inventory.find(p=>invId(p)===linkedId):null;
    return `${i+1}. ${linkedProduct?linkedProduct.name:item.name}`;
  }).join('\n');
  const choice=prompt(`Itens removidos:\n\n${list}\n\nDigite o número do item para restaurar ou 0 para restaurar todos:`,'0');
  if(choice===null)return;
  const n=Number(choice);
  if(n===0){state.portfolioHidden={};save();return;}
  if(Number.isInteger(n)&&n>=1&&n<=removed.length){
    delete state.portfolioHidden[removed[n-1].id];
    save();
  }else alert('Opção inválida.');
};

renderPortfolio();
