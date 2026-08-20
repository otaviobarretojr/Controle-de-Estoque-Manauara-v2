// Controles adicionais do Portfólio: exclusão persistente e restauração.
state.portfolioHidden=state.portfolioHidden||{};

const basePortfolioAnalysis=portfolioAnalysis;
portfolioAnalysis=function(){
  return basePortfolioAnalysis().filter(item=>!state.portfolioHidden[item.id]);
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

  document.querySelectorAll('#portfolioTable tbody tr').forEach(tr=>{
    const edit=tr.querySelector('button[onclick^="openPortfolioLink"]');
    if(!edit)return;
    const m=(edit.getAttribute('onclick')||'').match(/openPortfolioLink\('([^']+)'\)/);
    if(!m)return;
    const id=m[1];
    const td=edit.closest('td');
    if(!td||td.querySelector('.portfolio-delete-btn'))return;
    const del=document.createElement('button');
    del.className='btn small danger portfolio-delete-btn';
    del.style.marginLeft='6px';
    del.textContent='Excluir';
    del.onclick=()=>removePortfolioItem(id);
    td.appendChild(del);
  });
};

window.removePortfolioItem=function(id){
  const item=PORTFOLIO.find(x=>x.id===id);
  if(!item)return;
  if(!confirm(`Excluir "${item.name}" do Portfólio?\n\nEle deixará de entrar no cálculo de conformidade e não voltará após importar uma nova planilha.`))return;
  state.portfolioHidden[id]=true;
  save();
};

window.restorePortfolioItems=function(){
  const removed=PORTFOLIO.filter(item=>state.portfolioHidden[item.id]);
  if(!removed.length){alert('Não há itens removidos do Portfólio.');return;}
  const list=removed.map((item,i)=>`${i+1}. ${item.name}`).join('\n');
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
