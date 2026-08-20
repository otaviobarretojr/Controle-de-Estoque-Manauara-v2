// Importador robusto de Pré-vendas: aceita CSV do Excel brasileiro (;) e CSV padrão (,), com BOM.
function detectCSVDelimiter(text){
  const first=(String(text||'').replace(/^\uFEFF/,'').split(/\r?\n/).find(l=>l.trim())||'');
  let quoted=false,commas=0,semis=0;
  for(let i=0;i<first.length;i++){
    const c=first[i],n=first[i+1];
    if(c==='"'){if(quoted&&n==='"')i++;else quoted=!quoted;continue;}
    if(!quoted){if(c===',')commas++;else if(c===';')semis++;}
  }
  return semis>commas?';':',';
}
function parseFlexibleCSV(text){
  text=String(text||'').replace(/^\uFEFF/,'');
  const delimiter=detectCSVDelimiter(text);
  let rows=[],row=[],cur='',quoted=false;
  for(let i=0;i<text.length;i++){
    const c=text[i],n=text[i+1];
    if(c==='"'){
      if(quoted&&n==='"'){cur+='"';i++;}else quoted=!quoted;
    }else if(c===delimiter&&!quoted){row.push(cur);cur='';}
    else if((c==='\n'||c==='\r')&&!quoted){
      if(c==='\r'&&n==='\n')i++;
      row.push(cur);cur='';
      if(row.some(v=>String(v).trim()!==''))rows.push(row);
      row=[];
    }else cur+=c;
  }
  if(cur||row.length){row.push(cur);if(row.some(v=>String(v).trim()!==''))rows.push(row);}
  if(!rows.length)return {rows:[],delimiter};
  const headers=rows.shift().map((h,i)=>String(h).replace(/^\uFEFF/,'').trim().toLowerCase()||`coluna_${i+1}`);
  return {delimiter,headers,rows:rows.map(r=>Object.fromEntries(headers.map((h,i)=>[h,String(r[i]??'').trim()]))) };
}
// Mantém compatibilidade com qualquer código que chame parseCSV diretamente.
parseCSV=function(text){return parseFlexibleCSV(text).rows;};

const preFile=document.getElementById('preFile');
if(preFile){
  preFile.onchange=async e=>{
    const f=e.target.files[0];if(!f)return;
    try{
      const parsed=parseFlexibleCSV(await f.text());
      const rows=parsed.rows,headers=parsed.headers||[];
      const required=['produto','capacidade','cor'];
      const missing=required.filter(h=>!headers.includes(h));
      if(!rows.length||missing.length){
        alert(`CSV de pré-vendas não reconhecido.${missing.length?`\nCampos obrigatórios ausentes: ${missing.join(', ')}`:''}`);
        e.target.value='';return;
      }
      const valid=rows.filter(r=>r.produto&&r.capacidade&&r.cor);
      if(!valid.length){alert('O CSV foi lido, mas não há pré-vendas válidas com produto, capacidade e cor.');e.target.value='';return;}
      state.preSales=valid;
      state.preImportDate=new Date().toISOString();
      save();
      const sep=parsed.delimiter===';'?'ponto e vírgula (Excel)':'vírgula';
      const ignored=rows.length-valid.length;
      alert(`${valid.length} pré-vendas importadas com sucesso.\nFormato detectado: ${sep}.${ignored?`\n${ignored} linha(s) incompleta(s) ignorada(s).`:''}\nO inventário não foi alterado.`);
    }catch(err){
      console.error('Falha ao importar CSV de pré-vendas',err);
      alert('Não foi possível ler o CSV de pré-vendas. Verifique se o arquivo foi exportado como CSV do Excel.');
    }finally{e.target.value='';}
  };
}
