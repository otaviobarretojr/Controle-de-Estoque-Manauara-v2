// Acabamento da Interface Profissional v3: preserva controles legados e completa filtros.
(function(){
  function ensureLowToolbar(){
    const panel=document.querySelector('#view-low .panel'),table=document.getElementById('lowTable');
    if(!panel||!table||document.getElementById('lowToolbar'))return;
    const wrap=document.createElement('div');wrap.id='lowToolbar';wrap.className='toolbar';
    wrap.innerHTML='<input id="lowSearch" class="input search" placeholder="Buscar produto, SKU ou referência"><select id="lowFilter" class="select"><option value="all">Baixo e zerado</option><option value="zero">Somente zerados</option><option value="positive">Com saldo</option></select><select id="lowSort" class="select sort-select"><option value="stock-asc">Menor saldo</option><option value="stock-desc">Maior saldo</option><option value="name-asc">Produto A–Z</option></select>';
    panel.insertBefore(wrap,table);
    document.getElementById('lowSearch').oninput=()=>renderOverview();
    document.getElementById('lowFilter').onchange=()=>renderOverview();
    document.getElementById('lowSort').onchange=()=>renderOverview();
  }

  const baseOverview=renderOverview;
  renderOverview=function(){
    ensureLowToolbar();baseOverview();
    const q=norm(document.getElementById('lowSearch')?.value||''),filter=document.getElementById('lowFilter')?.value||'all',sort=document.getElementById('lowSort')?.value||'stock-asc';
    const all=activeInventory().filter(p=>p.stock<=state.minStock);
    let list=all.filter(p=>(!q||norm(`${p.name} ${p.code} ${p.ref}`).includes(q))&&(filter==='all'||filter==='zero'&&p.stock<=0||filter==='positive'&&p.stock>0));
    if(sort==='stock-asc')list=puiSort(list,'stock','asc');if(sort==='stock-desc')list=puiSort(list,'stock','desc');if(sort==='name-asc')list=puiSort(list,'name','asc');
    const target=document.getElementById('lowTable');if(!target)return;
    target.innerHTML=list.length?`<table class="mobile-cards"><thead><tr><th>Produto</th><th>Categoria</th><th>Saldo</th><th>Situação</th></tr></thead><tbody>${list.map(p=>`<tr><td data-label="Produto">${puiProductCell(p,p.name,`SKU ${p.code} · ${p.ref||'-'}`)}</td><td data-label="Categoria">${puiCategory(p.name)}</td><td data-label="Saldo" class="qty">${p.stock}</td><td data-label="Situação"><span class="status bad">● ${p.stock<=0?'Sem estoque':'Estoque baixo'}</span></td></tr>`).join('')}</tbody></table>${puiTableSummary('low',list.length,all.length,'produtos críticos')}`:'<div class="empty"><b>Nenhum item neste filtro</b>Altere a pesquisa ou o filtro de estoque.</div>';
  };

  const basePortfolio=renderPortfolio;
  renderPortfolio=function(){
    basePortfolio();
    const toolbar=document.querySelector('#view-portfolio .toolbar');if(!toolbar)return;
    const hidden=Object.keys(state.portfolioHidden||{}).filter(id=>state.portfolioHidden[id]);
    let btn=document.getElementById('restorePortfolioBtn');
    if(!btn){btn=document.createElement('button');btn.id='restorePortfolioBtn';btn.className='btn secondary';btn.type='button';btn.onclick=restorePortfolioItems;toolbar.appendChild(btn)}
    btn.textContent=hidden.length?`Restaurar removidos (${hidden.length})`:'Restaurar removidos';
  };

  ensureLowToolbar();
  renderAll();
})();
