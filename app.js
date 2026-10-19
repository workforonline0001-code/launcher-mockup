// Interactive mockup logic
document.addEventListener('DOMContentLoaded', () => {
  const screens = document.querySelectorAll('.screen');
  const navItems = document.querySelectorAll('.nav-item');
  const screenTitle = document.getElementById('screen-title');

  // Sample data
  const templates = [
    {id:'tpl-1', name:'Recruitment — India', tags:['JOB','Traffic'], default:true},
    {id:'tpl-2', name:'Lead Gen — Metro', tags:['LEAD','CBO']},
    {id:'tpl-3', name:'E-commerce — Fashion', tags:['SALES']}
  ];
  const creatives = [
    {id:'cr-1', name:'Hero Image 1', type:'image', status:'approved', thumbColor:'#2b84ff'},
    {id:'cr-2', name:'Video 01', type:'video', status:'fallback', thumbColor:'#ff9c64'},
    {id:'cr-3', name:'Safe Variant', type:'image', status:'policy-safe', thumbColor:'#3ad3a3'}
  ];
  const problems = [
    {id:'p-1', title:'Landing page mismatch', body:'Ad #12 copy mismatch with landing page. Consider editing landing page or ad text.', severity:'warn'},
    {id:'p-2', title:'API rate-limit', body:'Writes throttled; queued automatically with backoff.', severity:'info'},
    {id:'p-3', title:'Payment failed', body:'Ad account 456 payment failed', severity:'critical'}
  ];

  // init templates list
  const templatesList = document.getElementById('templatesList');
  const templatesGrid = document.getElementById('templatesGrid');
  const selectTemplate = document.getElementById('selectTemplate');
  templates.forEach(t => {
    const el = document.createElement('div'); el.className='template-item';
    el.innerHTML = `<div class="meta"><div style="font-weight:800">${t.name}</div><div class="tags">${t.tags.map(tag=>`<span class="tag">${tag}</span>`).join(' ')}</div></div>
      <div><button class="text-btn" onclick="editTemplate('${t.id}')">Edit</button> <button class="text-btn" onclick="startTemplateLaunch('${t.id}')">Launch</button></div>`;
    templatesList.appendChild(el);

    const card = document.createElement('div'); card.className='template-item';
    card.innerHTML = `<div class="meta"><div style="font-weight:800">${t.name}</div><div class="tags">${t.tags.map(tag=>`<span class="tag">${tag}</span>`).join(' ')}</div></div>
      <div><button class="text-btn" onclick="editTemplate('${t.id}')">Edit</button> <button class="text-btn" onclick="startTemplateLaunch('${t.id}')">Launch</button></div>`;
    templatesGrid.appendChild(card);

    const opt = document.createElement('option'); opt.value = t.id; opt.textContent = t.name;
    selectTemplate.appendChild(opt);
  });

  // init creatives grid
  const libraryGrid = document.getElementById('libraryGrid');
  creatives.forEach(c => {
    const div = document.createElement('div'); div.className='creative-card';
    div.innerHTML = `<div class="creative-thumb" style="background:${c.thumbColor}"></div><div style="display:flex;justify-content:space-between;align-items:center"><div><strong>${c.name}</strong><div class="small muted">${c.status}</div></div><button class="btn ghost" onclick="selectCreative('${c.id}')">Use</button></div>`;
    libraryGrid.appendChild(div);
  });

  // init problems
  const problemsList = document.getElementById('problemsList');
  problems.forEach(p=>{
    const d = document.createElement('div'); d.className='problem';
    d.innerHTML = `<div class="meta"><strong>${p.title}</strong><div class="small muted">${p.body}</div></div><div class="actions"><button class="btn" onclick="resolveProblem('${p.id}')">Resolve</button><button class="btn ghost" onclick="viewProblem('${p.id}')">Details</button></div>`;
    problemsList.appendChild(d);
  });

  // init recent launches (mock)
  const recentLaunches = document.getElementById('recentLaunches');
  recentLaunches.innerHTML = `<div class="small muted">No recent launches in mock environment — real app will show history here.</div>`;

  // Navigation
  navItems.forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      const screen = btn.getAttribute('data-screen');
      goToScreen(screen);
    });
  });

  // quick helpers
  window.goToScreen = (screen)=>{
    screens.forEach(s=>s.classList.remove('active'));
    document.getElementById(screen).classList.add('active');
    navItems.forEach(n=>n.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n=>{
      if(n.getAttribute('data-screen') === screen) n.classList.add('active');
    });
    screenTitle.textContent = {dashboard:'Dashboard',templates:'Templates',launch:'New Launch',creative:'Library',problems:'Problems',settings:'Settings'}[screen] || 'Launcher';
    window.scrollTo(0,0);
  }

  // Wizard logic
  let currentStep = 1;
  const maxStep = 5;
  const stepElems = document.querySelectorAll('.step');
  const panes = document.querySelectorAll('.step-pane');
  const nextBtn = document.getElementById('wizardNext');
  const backBtn = document.getElementById('wizardBack');

  function setStep(n){
    currentStep = n;
    stepElems.forEach(s=>s.classList.remove('active'));
    panes.forEach(p=>p.classList.remove('active'));
    document.querySelector(`.step[data-step="${n}"]`).classList.add('active');
    document.querySelector(`.step-pane[data-step="${n}"]`).classList.add('active');
    backBtn.disabled = n===1;
    nextBtn.textContent = n===maxStep ? 'Finish' : 'Next';
  }
  window.goToStep = (n) => setStep(n);
  setStep(1);

  nextBtn.addEventListener('click', ()=>{
    if(currentStep < maxStep){
      if(currentStep===1){
        const url = document.getElementById('inputUrl').value.trim();
        if(!url){
          alert('Please enter Landing URL before proceeding.');
          return;
        }
      }
      setStep(currentStep+1);
    } else {
      buildSnapshot();
      setStep(maxStep);
    }
  });
  backBtn.addEventListener('click', ()=>{ if(currentStep>1) setStep(currentStep-1) });

  // File upload preview (mock)
  const fileInput = document.getElementById('fileInput');
  const uploadedPreview = document.getElementById('uploadedPreview');
  fileInput.addEventListener('change', (ev)=>{
    const files = Array.from(ev.target.files);
    files.forEach(f=>{
      const div = document.createElement('div'); div.className='preview-item'; div.textContent = f.name;
      uploadedPreview.appendChild(div);
    });
    renderMapping();
  });

  window.openLibrary = ()=>{ goToScreen('creative'); }

  function renderMapping(){
    const mappingArea = document.getElementById('mappingArea');
    mappingArea.innerHTML = '';
    for(let i=1;i<=3;i++){
      const row = document.createElement('div'); row.className='mapping-row';
      row.innerHTML = `<div class="slot">Ad slot #${i}</div><div><button class="btn ghost" onclick="pickForSlot(${i})">Pick creative</button></div>`;
      mappingArea.appendChild(row);
    }
  }
  window.pickForSlot = (i)=>{ alert('Pick creative from Library (demo).'); goToScreen('creative'); }

  window.selectCreative = (id)=>{ alert('Creative '+id+' selected for next available slot (demo).'); goToScreen('launch'); renderMapping(); }

  document.getElementById('helpBtn').addEventListener('click', openAIModal);
  window.openAIExplain = (ctx)=>{
    openAIModal();
    const content = document.getElementById('aiContent');
    if(ctx==='creatives') content.innerHTML = `<p><strong>Creative rules (plain):</strong> Use clear images, avoid misleading claims like "Guaranteed job". Recommended size 1200×628. For videos under 60s, keep aspect 16:9.</p>`;
    else if(ctx==='special') content.innerHTML = `<p>If your ad is about hiring, loans, or housing, choose the appropriate Special Ad Category. This will lock some targeting options (age, gender, ZIP) as required by platforms.</p>`;
    else content.innerHTML = `<p>AI help will explain the selected option and suggest fixes. This is a demo helper.</p>`;
  };
  function openAIModal(){ document.getElementById('aiModal').classList.remove('hidden') }
  window.openAIModal = openAIModal;
  window.closeAIModal = ()=>{ document.getElementById('aiModal').classList.add('hidden') };

  window.openUploadModal = ()=>{ document.getElementById('uploadModal').classList.remove('hidden'); }
  window.closeUploadModal = ()=>{ document.getElementById('uploadModal').classList.add('hidden'); }
  window.doUpload = ()=>{
    const input = document.getElementById('uploadInput');
    if(!input.files.length){ alert('Choose files to upload'); return; }
    Array.from(input.files).forEach(f=>{
      const el = document.createElement('div'); el.className='creative-card';
      el.innerHTML = `<div class="creative-thumb" style="background:linear-gradient(135deg,#e0e6ff,#bfe0ff)"></div><div style="display:flex;justify-content:space-between;align-items:center"><div><strong>${f.name}</strong><div class="small muted">uploaded</div></div><button class="btn ghost" onclick="selectCreative('${f.name}')">Use</button></div>`;
      document.getElementById('libraryGrid').prepend(el);
    });
    closeUploadModal();
    alert('Files uploaded (demo).');
  }

  document.getElementById('submitLaunchBtn').addEventListener('click', ()=>{
    const launchId = 'LCH-'+Math.floor(Math.random()*9000+1000);
    document.getElementById('launchResultText').textContent = `Your launch has been queued (ID: ${launchId}). Worker will process and show progress in Launches.`;
    document.getElementById('launchResult').classList.remove('hidden');
    recentLaunches.innerHTML = `<div class="small muted">No recent launches in mock environment — real app will show history here.</div>`;
  });

  window.closeLaunchResult = ()=>{ document.getElementById('launchResult').classList.add('hidden'); goToScreen('dashboard') }

  window.editTemplate = (id)=>{ alert('Open template editor (demo): '+id); goToScreen('templates') }
  window.startTemplateLaunch = (id)=>{ document.getElementById('selectTemplate').value = id; goToScreen('launch'); }
  window.startTemplateLaunch = startTemplateLaunch;
  window.resolveProblem = (id)=>{ alert('Resolve problem (demo): '+id); }
  window.viewProblem = (id)=>{ alert('Problem details (demo): '+id); }

  document.getElementById('runScan').addEventListener('click', ()=>{
    alert('Compliance scan complete: 1 warning (landing page). See Review step for details.');
    goToScreen('launch');
    setStep(5);
    buildSnapshot();
  });

  document.getElementById('printSpec').addEventListener('click', ()=>{ window.print(); });
  window.saveSettings = ()=>{ alert('Settings saved (demo).'); }

  function buildSnapshot(){
    const snap = document.getElementById('snapshot');
    snap.innerHTML = '';
    const tpl = document.getElementById('selectTemplate').value || '—';
    const url = document.getElementById('inputUrl').value || '—';
    const geos = Array.from(document.getElementById('selectGeos').selectedOptions).map(o=>o.value).join(', ') || '—';
    const acct = document.getElementById('adAccountSelect').value;
    snap.innerHTML = `<div><strong>Template:</strong> ${tpl}</div><div><strong>URL:</strong> ${url}</div><div><strong>Geos:</strong> ${geos}</div><div><strong>Account:</strong> ${acct}</div>`;
  }

  window.aiSuggestTemplate = ()=>{
    document.getElementById('selectTemplate').value = 'tpl-1';
    alert('AI suggests: Recruitment — India (demo)');
  }

  window.renderMapping = renderMapping;
});
