(()=>{
  const themeButton=document.querySelector('[data-theme-toggle]');
  const themeQuery=matchMedia('(prefers-color-scheme: dark)');
  const syncThemeLabel=()=>{if(themeButton){const label=document.documentElement.dataset.theme==='dark'?'밝은 화면으로 전환':'어두운 화면으로 전환';themeButton.setAttribute('aria-label',label);themeButton.title=label;}};
  syncThemeLabel();
  themeButton?.addEventListener('click',()=>{const theme=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=theme;try{localStorage.setItem('geulsup-blog-theme',theme);}catch{}syncThemeLabel();});
  themeQuery.addEventListener?.('change',event=>{try{if(localStorage.getItem('geulsup-blog-theme'))return;}catch{}document.documentElement.dataset.theme=event.matches?'dark':'light';syncThemeLabel();});

  document.querySelector('[data-copy-link]')?.addEventListener('click',async event=>{
    const button=event.currentTarget,label=button.querySelector('[data-copy-label]');
    try{await navigator.clipboard.writeText(button.dataset.copyLink);label.textContent='복사됨';button.classList.add('is-copied');setTimeout(()=>{label.textContent='링크 복사';button.classList.remove('is-copied');},2000);}
    catch{let input=button.parentElement.querySelector('.share-url');if(!input){input=document.createElement('input');input.className='share-url';input.readOnly=true;input.setAttribute('aria-label','이 글의 주소');button.parentElement.append(input);}input.value=button.dataset.copyLink;input.focus();input.select();}
  });
  const tocLinks=[...document.querySelectorAll('.article-toc a')];
  if(tocLinks.length&&'IntersectionObserver'in window){const visible=new Set();const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>entry.isIntersecting?visible.add(entry.target.id):visible.delete(entry.target.id));const current=tocLinks.find(link=>visible.has(link.hash.slice(1)));if(current)tocLinks.forEach(link=>{const active=link===current;link.classList.toggle('active',active);if(active)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});},{rootMargin:'-90px 0px -55% 0px',threshold:0});tocLinks.forEach(link=>{const heading=document.getElementById(link.hash.slice(1));if(heading)observer.observe(heading);});}

  const root=document.querySelector('[data-archive]');if(!root)return;
  const input=root.querySelector('[data-search]');if(!input)return;
  const rows=[...root.querySelectorAll('[data-post]')],filters=[...root.querySelectorAll('[data-category]')],more=root.querySelector('[data-more]'),empty=root.querySelector('[data-search-empty]'),counter=root.querySelector('[data-count]'),title=root.querySelector('[data-archive-title]'),clear=root.querySelector('[data-clear-search]');
  let category=new URLSearchParams(location.search).get('category')||'',limit=12;
  function apply(){
    const query=input.value.trim().toLocaleLowerCase();let count=0;
    for(const row of rows){const matched=(!category||row.dataset.categoryValue===category)&&(!query||row.dataset.search.includes(query));count+=Number(matched);row.hidden=!matched||count>limit;}
    filters.forEach(button=>{const active=button.dataset.category===category;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));});
    if(counter)counter.textContent=count;if(title)title.textContent=category||'모든 글';if(empty)empty.hidden=count!==0;if(more)more.hidden=count<=limit;if(clear)clear.hidden=!input.value;
  }
  function setCategory(value){category=value;limit=12;const url=new URL(location.href);if(category)url.searchParams.set('category',category);else url.searchParams.delete('category');history.replaceState(null,'',url);apply();}
  input.addEventListener('input',()=>{limit=12;apply();});
  filters.forEach(button=>button.addEventListener('click',()=>setCategory(button.dataset.category)));
  clear?.addEventListener('click',()=>{input.value='';limit=12;apply();input.focus();});
  root.querySelector('[data-reset-search]')?.addEventListener('click',()=>{input.value='';setCategory('');input.focus();});
  more?.addEventListener('click',()=>{limit+=12;apply();});apply();
})();
