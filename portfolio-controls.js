// Controles adicionais do Portfólio: exclusão persistente, restauração e edição do nome exibido.
state.portfolioHidden=state.portfolioHidden||{};
state.portfolioNames=state.portfolioNames||{};

const basePortfolioAnalysis=portfolioAnalysis;
portfolioAnalysis=function(){
  return basePortfolioAnalysis()
    .filter(item=>!state.portfolioHidden[item.id])
    .map(item=>({...item,name:state.portfolioNames[item.id]||item.name}));
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

  // Oculta a coluna visual de Vínculo, mantendo toda a lógica de associação ativa em segundo plano.
  const table=document.querySelector('#portfolioTable table');
  if(table){
    const headCells=[...table.querySelectorAll('thead th')];
    const linkIndex=headCells.findIndex(th=>th.textContent.trim().toLowerCase()==='vínculo'||th.textContent.trim().toLowerCase()==='vinculo');
    if(linkIndex>=0){
      headCells[linkIndex].style.display='none';
      table.querySelectorAll('tbody tr').forEach(tr=>{
        const cells=tr.children;
        if(cells[linkIndex])cells[linkIndex].style.display='none';
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
  const current=state.portfolioNames[id]||item.name;
  const next=prompt('Nome exibido no Portfólio:',current);
  if(next===null)return;
  const clean=next.trim();
  if(!clean){alert('O nome não pode ficar vazio.');return;}
  if(clean===item.name)delete state.portfolioNames[id];
  else state.portfolioNames[id]=clean;
  save();
};

window.removePortfolioItem=function(id){
  const item=PORTFOLIO.find(x=>x.id===id);
  if(!item)return;
  const displayName=state.portfolioNames[id]||item.name;
  if(!confirm(`Excluir "${displayName}" do Portfólio?\n\nEle deixará de entrar no cálculo de conformidade e não voltará após importar uma nova planilha.`))return;
  state.portfolioHidden[id]=true;
  save();
};

window.restorePortfolioItems=function(){
  const removed=PORTFOLIO.filter(item=>state.portfolioHidden[item.id]);
  if(!removed.length){alert('Não há itens removidos do Portfólio.');return;}
  const list=removed.map((item,i)=>`${i+1}. ${state.portfolioNames[item.id]||item.name}`).join('\n');
  const choice=prompt(`Itens removidos:\n\n${list}\n\nDigite o número do item para restaurar ou 0 para restaurar todos:`,'0');
  if(choice===null)return;
  const n=Number(choice);
  if(n===0){state.portfolioHidden={};save();return;}
  if(Number.isInteger(n)&&n>=1&&n<=removed.length){
    delete state.portfolioHidden[removed[n-1].id];
    save();
  }else alert('Opção inválida.');
};

// Recalcula a aba após carregar este complemento.
renderPortfolio();
