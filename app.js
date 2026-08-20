const KEY='estoque-manauara-v2';
const state=JSON.parse(localStorage.getItem(KEY)||'null')||{inventory:[],preSales:[],disabled:{},links:{},portfolioLinks:{},requests:[],minStock:3,inventoryDate:null,preImportDate:null};
state.portfolioLinks=state.portfolioLinks||{};

const PORTFOLIO=[
{id:'acc-battery-45w',category:'Acessórios',name:'Bateria 20000mAh - 45W',min:2,terms:['bateria','20000','45w']},
{id:'acc-charger-15w-cable',category:'Acessórios',name:'Carregador 15W (Com cabo)',min:2,terms:['carregador','15w','cabo'],exclude:['sem fio']},
{id:'acc-charger-25w-cable',category:'Acessórios',name:'Carregador 25W (Com cabo)',min:2,terms:['carregador','25w','cabo'],exclude:['sem fio','bateria']},
{id:'acc-charger-66w-cable',category:'Acessórios',name:'Carregador 66W (Com cabo)',min:2,terms:['carregador','66w','cabo'],exclude:['sem fio']},
{id:'acc-wireless-15w-duo',category:'Acessórios',name:'Carregador Sem Fio 15W Duo Pad',min:2,terms:['carregador','sem fio','15w','duo']},
{id:'acc-wireless-magnetic-25w',category:'Acessórios',name:'Carregador Sem Fio Magnético 25W (Cabo USB-C)',min:2,terms:['carregador','sem fio','magnetico','25w']},
{id:'acc-car-40w',category:'Acessórios',name:'Carregador Veicular 40W USB dupla',min:2,terms:['carregador','veicular','40w','usb']},
{id:'acc-wired-earphone-usbc',category:'Acessórios',name:'Fone de Ouvido com fio USB tipo-C',min:2,terms:['fone','usb','tipo c','fio']},
{id:'acc-smarttag2-white',category:'Acessórios',name:'Galaxy SmartTag2 - Branco',min:2,terms:['smarttag2','branco'],exclude:['4 unidades','pacote com 4']},
{id:'acc-smarttag2-black',category:'Acessórios',name:'Galaxy SmartTag2 - Preto',min:2,terms:['smarttag2','preto'],exclude:['4 unidades','pacote com 4']},
{id:'acc-smarttag2-kit4',category:'Acessórios',name:'Galaxy SmartTag2 - Kit 4 unidades',min:2,terms:['smarttag2','4 unidades']},
{id:'phone-flip7-256',category:'Smartphones',name:'Galaxy Z Flip7 256GB',min:2,terms:['flip7','256gb'],aggregateColors:true,exclude:['capa','case','fe']},
{id:'phone-a07-128',category:'Smartphones',name:'Galaxy A07 128GB',min:2,terms:['a07','128gb'],aggregateColors:true},
{id:'phone-a17-4g-128',category:'Smartphones',name:'Galaxy A17 4G 128GB',min:2,terms:['a17','128gb'],aggregateColors:true,exclude:['5g']},
{id:'phone-a17-4g-256',category:'Smartphones',name:'Galaxy A17 4G 256GB',min:2,terms:['a17','256gb'],aggregateColors:true,exclude:['5g']},
{id:'phone-a17-5g-128',category:'Smartphones',name:'Galaxy A17 5G 128GB',min:2,terms:['a17','5g','128gb'],aggregateColors:true},
{id:'phone-a17-5g-256',category:'Smartphones',name:'Galaxy A17 5G 256GB',min:2,terms:['a17','5g','256gb'],aggregateColors:true},
{id:'phone-a37-5g-128',category:'Smartphones',name:'Galaxy A37 5G 128GB',min:2,terms:['a37','128gb'],aggregateColors:true},
{id:'phone-a37-5g-256',category:'Smartphones',name:'Galaxy A37 5G 256GB',min:2,terms:['a37','256gb'],aggregateColors:true},
{id:'phone-a57-5g-128',category:'Smartphones',name:'Galaxy A57 5G 128GB',min:2,terms:['a57','128gb'],aggregateColors:true},
{id:'phone-a57-5g-256',category:'Smartphones',name:'Galaxy A57 5G 256GB',min:2,terms:['a57','256gb'],aggregateColors:true},
{id:'phone-s26-256',category:'Smartphones',name:'Galaxy S26 256GB',min:2,terms:['s26','256gb'],aggregateColors:true,exclude:['plus','ultra','capa','case']},
{id:'phone-s26-plus-256',category:'Smartphones',name:'Galaxy S26 Plus 256GB',min:2,terms:['s26','plus','256gb'],aggregateColors:true,exclude:['capa','case']},
{id:'phone-s26-plus-512',category:'Smartphones',name:'Galaxy S26 Plus 512GB',min:2,terms:['s26','plus','512gb'],aggregateColors:true,exclude:['capa','case']},
{id:'phone-s26-ultra-256',category:'Smartphones',name:'Galaxy S26 Ultra 256GB',min:2,terms:['s26','ultra','256gb'],aggregateColors:true,exclude:['capa','case']},
{id:'phone-s26-ultra-512',category:'Smartphones',name:'Galaxy S26 Ultra 512GB',min:2,terms:['s26','ultra','512gb'],aggregateColors:true,exclude:['capa','case']},
{id:'wear-watch-ultra-47-lte',category:'Wearables',name:'Galaxy Watch Ultra 47mm LTE',min:2,terms:['watch','ultra','47mm','lte'],aggregateColors:true,exclude:['ultra2','pulseira']},
{id:'wear-watch8-44-bt',category:'Wearables',name:'Galaxy Watch8 44mm BT',min:2,terms:['watch8','44mm','bt'],aggregateColors:true},
{id:'wear-watch8-40-bt',category:'Wearables',name:'Galaxy Watch8 40mm BT',min:2,terms:['watch8','40mm','bt'],aggregateColors:true},
{id:'wear-buds-core',category:'Wearables',name:'Galaxy Buds Core',min:2,terms:['buds','core'],aggregateColors:true},
{id:'wear-buds4',category:'Wearables',name:'Galaxy Buds4',min:2,terms:['buds4'],aggregateColors:true,exclude:['pro']},
{id:'wear-buds4-pro',category:'Wearables',name:'Galaxy Buds4 Pro',min:2,terms:['buds4','pro'],aggregateColors:true},
{id:'wear-fit3',category:'Wearables',name:'Galaxy Fit3',min:2,terms:['fit3'],aggregateColors:true},
{id:'wear-watch8-classic-46-lte',category:'Wearables',name:'Galaxy Watch8 Classic LTE 46mm',min:2,terms:['watch8','classic','lte','46mm'],aggregateColors:true}
];
function save(){localStorage.setItem(KEY,JSON.stringify(state));renderAll()}
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
function brMoney(v){return new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(Number(v)||0)}
function parseBRNumber(v){if(typeof v==='number')return v; let s=String(v??'').trim(); if(!s)return 0; if(s.includes(',')&&s.includes('.'))s=s.replace(/\./g,'').replace(',','.'); else if(s.includes(','))s=s.replace(',','.'); return Number(s.replace(/[^0-9.-]/g,''))||0}
function norm(s){return String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/galaxy/g,'').replace(/samsung/g,'').replace(/\bgb\b/g,'gb').replace(/\s+/g,' ').replace(/fold\s+(\d)/g,'fold$1').replace(/flip\s+(\d)/g,'flip$1').replace(/roxo escuro/g,'roxo').replace(/grafite/g,'preto').replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim()}
function tokenSet(s){return new Set(norm(s).split(' ').filter(x=>x.length>1))}
function score(a,b){let A=tokenSet(a),B=tokenSet(b); if(!A.size||!B.size)return 0; let inter=[...A].filter(x=>B.has(x)).length; return (2*inter)/(A.size+B.size)}
function preKey(r){return norm(`${r.produto} ${r.capacidade} ${r.cor}`)}
function invId(p){return String(p.code||p.ref||p.name)}
function activeInventory(){return state.inventory.filter(p=>!state.disabled[invId(p)])}
function portfolioAutoItems(item){
 let terms=(item.terms||[]).map(norm),ex=(item.exclude||[]).map(norm);
 return activeInventory().filter(p=>{let n=norm(p.name); return terms.every(t=>n.includes(t))&&!ex.some(t=>n.includes(t))})
}
function colorlessFamilyName(name){
 let n=norm(name),colors=['preto','branco','azul','azul escuro','violeta','lavanda','lilas','cinza','prata','verde','rose','rosa','bege','grafite','roxo','roxo escuro','jetblack','titanio azul','titanio preto','titanio prata'];
 colors.sort((a,b)=>b.length-a.length).forEach(c=>{n=n.replace(new RegExp(`\\b${norm(c).replace(/[-/\\^$*+?.()|[\\]{}]/g,'\\$&')}\\b`,'g'),' ')});
 return n.replace(/\\s+/g,' ').trim()
}
function portfolioItems(item){
 let manual=state.portfolioLinks[item.id];
 if(manual){
   let anchor=state.inventory.find(p=>invId(p)===manual);
   if(!anchor)return [];
   if(!item.aggregateColors)return [anchor];
   let family=colorlessFamilyName(anchor.name);
   return activeInventory().filter(p=>colorlessFamilyName(p.name)===family)
 }
 return portfolioAutoItems(item)
}
function portfolioAnalysis(){
 return PORTFOLIO.map(item=>{let matches=portfolioItems(item),stock=matches.reduce((s,p)=>s+Number(p.stock||0),0),need=Math.max(0,item.min-stock); return {...item,matches,stock,need,status:stock>=item.min?'complete':'missing',manual:!!state.portfolioLinks[item.id]}})
}
function matchInventory(group){let key=group.key; let manual=state.links[key]; if(manual){let p=state.inventory.find(x=>invId(x)===manual); if(p)return {p,score:1,manual:true}}
 let target=`${group.product} ${group.capacity} ${group.color}`; let cap=norm(group.capacity); let model=norm(group.product).split(' ').filter(t=>/fold|flip|ultra|\d/.test(t));
 let candidates=activeInventory().filter(p=>{let n=norm(p.name); if(cap&&!n.includes(cap))return false; return model.filter(t=>t.length>1).every(t=>n.includes(t))});
 let best=null,bs=0; for(const p of candidates){let s=score(target,p.name); if(s>bs){bs=s;best=p}}
 return best&&bs>=0.62?{p:best,score:bs,manual:false}:null}
function parseCSV(text){let rows=[],row=[],cur='',q=false; for(let i=0;i<text.length;i++){let c=text[i],n=text[i+1]; if(c==='"'){if(q&&n==='"'){cur+='"';i++}else q=!q}else if(c===','&&!q){row.push(cur);cur=''}else if((c==='\n'||c==='\r')&&!q){if(c==='\r'&&n==='\n')i++; row.push(cur);cur=''; if(row.some(x=>x!==''))rows.push(row);row=[]}else cur+=c} if(cur||row.length){row.push(cur);rows.push(row)} let h=rows.shift().map(x=>x.trim()); return rows.map(r=>Object.fromEntries(h.map((k,i)=>[k,(r[i]??'').trim()]))) }
function parseInventoryHTML(text){let doc=new DOMParser().parseFromString(text,'text/html'),out=[]; doc.querySelectorAll('tr').forEach(tr=>{let c=[...tr.querySelectorAll('td,th')].map(x=>x.textContent.trim()); if(c.length<9)return; if(!/^\d+$/.test(c[0]))return; if(!c[1]||c[1].toLowerCase()==='total')return; out.push({code:c[0],name:c[1],ref:c[2],company:c[3],unit:c[4],cst:c[5],stock:parseBRNumber(c[6]),unitCost:parseBRNumber(c[7]),subtotal:parseBRNumber(c[8])})}); let seen={}; return out.filter(p=>!seen[invId(p)]&&(seen[invId(p)]=1))}
function groups(){let map={}; for(const r of state.preSales){let key=preKey(r); if(!map[key])map[key]={key,product:r.produto,capacity:r.capacidade,color:r.cor,count:0}; map[key].count++} return Object.values(map).sort((a,b)=>a.product.localeCompare(b.product)||a.capacity.localeCompare(b.capacity)||a.color.localeCompare(b.color))}
function preAnalysis(){return groups().map(g=>{let m=matchInventory(g),stock=m?m.p.stock:0,free=stock-g.count; return {...g,match:m,stock,free,status:!m?'unlinked':free>=0?'good':'partial',deficit:Math.max(0,-free)}})}
function card(label,value,hint,cls=''){return `<div class="card ${cls}"><div class="label">${label}</div><div class="value">${value}</div><div class="hint">${hint}</div></div>`}
function productRow(p,actions=true){let low=p.stock<=state.minStock; return `<tr><td><strong>${p.name}</strong><span class="muted">SKU ${p.code} · ${p.ref}</span></td><td>${p.ref||'-'}</td><td class="qty">${p.stock} <span class="muted">un.</span></td><td>${brMoney(p.unitCost)}</td><td><span class="status ${low?'bad':'good'}">● ${low?'Baixo':'Disponível'}</span></td>${actions?`<td><button class="btn small ${state.disabled[invId(p)]?'secondary':'danger'}" onclick="toggleDisabled('${invId(p)}')">${state.disabled[invId(p)]?'Reativar':'Desativar'}</button></td>`:''}</tr>`}
function inventoryTable(list,actions=false){if(!list.length)return `<div class="empty"><b>Nenhum produto</b>Importe a planilha de inventário para começar.</div>`; return `<table><thead><tr><th>Produto</th><th>Referência</th><th>Estoque</th><th>Custo</th><th>Situação</th>${actions?'<th>Ações</th>':''}</tr></thead><tbody>${list.map(p=>productRow(p,actions)).join('')}</tbody></table>`}
function renderOverview(){let inv=activeInventory(),low=inv.filter(p=>p.stock<=state.minStock),units=inv.reduce((s,p)=>s+p.stock,0),val=inv.reduce((s,p)=>s+p.subtotal,0); $('#overviewCards').innerHTML=card('Produtos ativos',inv.length,'base operacional')+card('Unidades em loja',units.toLocaleString('pt-BR'),'saldo físico')+card('Estoque baixo',low.length,`itens com até ${state.minStock} un.`,'red')+card('Valor em estoque',brMoney(val),'a custo de inventário'); let q=norm($('#overviewSearch').value),st=$('#overviewStatus').value; let list=inv.filter(p=>(!q||norm(`${p.name} ${p.code} ${p.ref}`).includes(q))&&(st==='all'||(st==='low')===(p.stock<=state.minStock))); $('#overviewTable').innerHTML=inventoryTable(list,false); $('#lowTable').innerHTML=inventoryTable(low,false)}
function renderProducts(){let q=norm($('#productSearch').value),fs=$('#productState').value; let list=state.inventory.filter(p=>{let d=!!state.disabled[invId(p)]; return (!q||norm(`${p.name} ${p.code} ${p.ref}`).includes(q))&&(fs==='all'||fs==='disabled'&&d||fs==='active'&&!d)}); $('#productsTable').innerHTML=inventoryTable(list,true)}
function renderPortfolio(){
 let a=portfolioAnalysis(),required=a.reduce((s,x)=>s+x.min,0),covered=a.reduce((s,x)=>s+Math.min(x.stock,x.min),0),complete=a.filter(x=>x.status==='complete').length,missing=a.length-complete,cov=required?Math.round(covered/required*100):0;
 $('#portfolioCards').innerHTML=card('Conformidade',`${cov}%`,`${covered} de ${required} unidades obrigatórias`,cov<100?'amber':'')+card('Itens completos',complete,`de ${a.length} produtos`)+card('Itens em falta',missing,'produtos abaixo de 2 unidades',missing?'red':'')+card('Unidades necessárias',a.reduce((s,x)=>s+x.need,0),'para alcançar 100%',missing?'amber':'');
 $('#portfolioBadge').textContent=missing;
 let q=norm($('#portfolioSearch').value),st=$('#portfolioStatus').value,cat=$('#portfolioCategory').value;
 let list=a.filter(x=>(!q||norm(x.name).includes(q))&&(st==='all'||x.status===st)&&(cat==='all'||x.category===cat));
 if(!list.length){$('#portfolioTable').innerHTML='<div class="empty"><b>Nenhum item neste filtro</b>Altere os filtros para visualizar outros produtos do portfólio.</div>';return}
 $('#portfolioTable').innerHTML=`<table><thead><tr><th>Produto obrigatório</th><th>Categoria</th><th>Mínimo</th><th>Saldo</th><th>Falta</th><th>Situação</th><th>Vínculo</th><th>Ação</th></tr></thead><tbody>${list.map(x=>`<tr><td><strong>${x.name}</strong></td><td>${x.category}</td><td class="qty">${x.min}</td><td class="qty">${x.stock}</td><td class="qty">${x.need}</td><td><span class="status ${x.status==='complete'?'good':'bad'}">● ${x.status==='complete'?'Completo':`Em falta (${x.need})`}</span></td><td>${x.matches.length?`<strong>${x.matches[0].name}</strong><span class="muted">${x.manual?'Vínculo manual':x.matches.length>1?`${x.matches.length} variações somadas`:'Reconhecimento automático'}</span>`:'<span class="muted">Nenhum produto correspondente encontrado</span>'}</td><td><button class="btn small secondary" onclick="openPortfolioLink('${x.id}')">Editar vínculo</button></td></tr>`).join('')}</tbody></table>`
}
function renderPre(){let a=preAnalysis(),total=state.preSales.length,covered=a.reduce((s,x)=>s+Math.min(x.count,x.stock),0),def=a.reduce((s,x)=>s+x.deficit,0),un=a.filter(x=>x.status==='unlinked').length,cov=total?Math.round(covered/total*100):0; $('#preCards').innerHTML=card('Pré-vendas',total,'reservas importadas')+card('Cobertura',`${cov}%`,`${covered} de ${total} unidades cobertas`,cov<100?'amber':'')+card('Unidades faltantes',def,'déficit total','red')+card('Não vinculados',un,'SKUs que precisam de revisão',un?'amber':''); let q=norm($('#preSearch').value),st=$('#preStatus').value; let list=a.filter(x=>(!q||norm(`${x.product} ${x.capacity} ${x.color}`).includes(q))&&(st==='all'||x.status===st)); if(!list.length){$('#preTable').innerHTML=`<div class="empty"><b>${total?'Nenhum item neste filtro':'Nenhuma pré-venda importada'}</b>${total?'Altere os filtros para visualizar outros itens.':'Importe o CSV exportado do projeto de Pré-vendas.'}</div>`;return} $('#preTable').innerHTML=`<table><thead><tr><th>Produto reservado</th><th>Pré-vendas</th><th>Estoque</th><th>Saldo livre</th><th>Situação</th><th>Vínculo</th><th>Ação</th></tr></thead><tbody>${list.map(x=>`<tr><td><strong>${x.product} ${x.capacity}</strong><span class="muted">${x.color}</span></td><td class="qty">${x.count}</td><td class="qty">${x.match?x.stock:'—'}</td><td class="qty">${x.match?x.free:'—'}</td><td><span class="status ${x.status==='good'?'good':x.status==='partial'?'bad':'warn'}">● ${x.status==='good'?'Atende':x.status==='partial'?`Faltam ${x.deficit}`:'Não vinculado'}</span></td><td>${x.match?`<strong>${x.match.p.name}</strong><span class="muted">${x.match.manual?'Vínculo manual':'Reconhecimento automático'}</span>`:'<span class="muted">Selecione um produto da base</span>'}</td><td><button class="btn small secondary" onclick="openLink('${x.key.replace(/'/g,"\\'")}')">Editar vínculo</button>${x.deficit?` <button class="btn small primary" onclick="requestFromPre('${x.key.replace(/'/g,"\\'")}')">Solicitar ${x.deficit}</button>`:''}</td></tr>`).join('')}</tbody></table>`}
function renderRequests(){let r=state.requests; $('#reqBadge').textContent=r.length; if(!r.length){$('#requestsTable').innerHTML='<div class="empty"><b>Nenhuma solicitação</b>Os déficits da Pré-venda podem ser enviados para cá.</div>';return} $('#requestsTable').innerHTML=`<table><thead><tr><th>Produto</th><th>Filial</th><th>Quantidade</th><th>Ações</th></tr></thead><tbody>${r.map((x,i)=>`<tr><td><strong>${x.name}</strong><span class="muted">${x.ref||''}</span></td><td>${x.store}</td><td><div class="req-box"><input class="input" type="number" min="1" value="${x.qty}" onchange="setReqQty(${i},this.value)"></div></td><td><button class="btn small danger" onclick="removeReq(${i})">Remover</button></td></tr>`).join('')}</tbody></table>`}
function renderAll(){state.minStock=Number($('#minStock')?.value??state.minStock)||0; $('#prodBadge').textContent=activeInventory().length; $('#lowBadge').textContent=activeInventory().filter(p=>p.stock<=state.minStock).length; $('#preBadge').textContent=state.preSales.length; $('#baseDate').textContent=state.inventoryDate?`Inventário ${new Date(state.inventoryDate).toLocaleDateString('pt-BR')}`:'Nenhum inventário'; $('#preImportInfo').textContent=state.preImportDate?`${state.preSales.length} registros importados em ${new Date(state.preImportDate).toLocaleString('pt-BR')}`:'Nenhum relatório de pré-vendas importado.'; renderOverview();renderProducts();renderPortfolio();renderPre();renderRequests()}
window.toggleDisabled=id=>{state.disabled[id]=!state.disabled[id];save()};
window.setReqQty=(i,v)=>{state.requests[i].qty=Math.max(1,Number(v)||1);save()};window.removeReq=i=>{state.requests.splice(i,1);save()};
window.requestFromPre=key=>{let x=preAnalysis().find(a=>a.key===key); if(!x||!x.match||!x.deficit)return; let store=prompt('Filial de origem para o abastecimento:','Filial'); if(!store)return; let qty=Number(prompt('Quantidade necessária:',String(x.deficit)))||x.deficit; let id=invId(x.match.p); let ex=state.requests.find(r=>r.inventoryId===id&&norm(r.store)===norm(store)); if(ex)ex.qty=qty; else state.requests.push({inventoryId:id,name:x.match.p.name,ref:x.match.p.ref,store,qty});save(); showView('requests')};
let linkKey=null,selectedLink=null,linkContext='pre'; window.openLink=key=>{linkContext='pre';linkKey=key;selectedLink=state.links[key]||null; let g=groups().find(x=>x.key===key); $('#linkTarget').textContent=g?`${g.product} ${g.capacity} · ${g.color}`:''; $('#linkSearch').value='';renderLinkList();$('#linkModal').classList.remove('hidden')};
window.openPortfolioLink=id=>{linkContext='portfolio';linkKey=id;selectedLink=state.portfolioLinks[id]||null; let item=PORTFOLIO.find(x=>x.id===id); $('#linkTarget').textContent=item?`${item.name} · mínimo ${item.min} unidades`:''; $('#linkSearch').value='';renderLinkList();$('#linkModal').classList.remove('hidden')};
function renderLinkList(){let q=norm($('#linkSearch').value); let items=activeInventory().filter(p=>!q||norm(`${p.name} ${p.code} ${p.ref}`).includes(q)).slice(0,100); $('#linkList').innerHTML=items.map(p=>`<div class="link-item ${selectedLink===invId(p)?'selected':''}" data-id="${invId(p)}"><strong>${p.name}</strong><div class="muted">SKU ${p.code} · ${p.ref} · ${p.stock} un.</div></div>`).join('')||'<div class="empty">Nenhum produto encontrado.</div>'; $$('#linkList .link-item').forEach(el=>el.onclick=()=>{selectedLink=el.dataset.id;renderLinkList()})}
function closeModal(){linkKey=null;selectedLink=null;linkContext='pre';$('#linkModal').classList.add('hidden')}
$('#saveLink').onclick=()=>{if(linkKey&&selectedLink){if(linkContext==='portfolio')state.portfolioLinks[linkKey]=selectedLink;else state.links[linkKey]=selectedLink}save();closeModal()};$('#unlinkBtn').onclick=()=>{if(linkKey){if(linkContext==='portfolio')delete state.portfolioLinks[linkKey];else delete state.links[linkKey]}save();closeModal()};$('#closeLink').onclick=closeModal;$('#linkSearch').oninput=renderLinkList;
function showView(v){$$('.view').forEach(x=>x.classList.add('hidden'));$(`#view-${v}`).classList.remove('hidden');$$('#nav button').forEach(b=>b.classList.toggle('active',b.dataset.view===v)); if(v==='presales')renderPre(); if(v==='portfolio')renderPortfolio()}
$$('#nav button').forEach(b=>b.onclick=()=>showView(b.dataset.view));
$('#globalImportBtn').onclick=()=>$('#inventoryFile').click();$('#inventoryFile').onchange=async e=>{let f=e.target.files[0];if(!f)return;let txt=await f.text(),inv=parseInventoryHTML(txt);if(!inv.length){alert('Não foi possível reconhecer produtos neste arquivo. Use a exportação .xls do Registro de Inventário.');return}state.inventory=inv;state.inventoryDate=new Date().toISOString();save();alert(`${inv.length} produtos importados. A base de Pré-vendas foi preservada e recalculada.`)};
$('#preImportBtn').onclick=()=>$('#preFile').click();$('#preFile').onchange=async e=>{let f=e.target.files[0];if(!f)return;let rows=parseCSV(await f.text());if(!rows.length||!('produto' in rows[0])){alert('CSV de pré-vendas não reconhecido.');return}state.preSales=rows;state.preImportDate=new Date().toISOString();save();alert(`${rows.length} pré-vendas importadas. O inventário não foi alterado.`)};
$('#clearPreBtn').onclick=()=>{if(confirm('Limpar somente a base de Pré-vendas? O inventário será preservado.')){state.preSales=[];state.preImportDate=null;save()}};
$('#minStock').value=state.minStock;$('#minStock').onchange=()=>{state.minStock=Number($('#minStock').value)||0;save()};$('#overviewSearch').oninput=renderOverview;$('#overviewStatus').onchange=renderOverview;$('#productSearch').oninput=renderProducts;$('#productState').onchange=renderProducts;$('#portfolioSearch').oninput=renderPortfolio;$('#portfolioStatus').onchange=renderPortfolio;$('#portfolioCategory').onchange=renderPortfolio;$('#preSearch').oninput=renderPre;$('#preStatus').onchange=renderPre;
renderAll();
