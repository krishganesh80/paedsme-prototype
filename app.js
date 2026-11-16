const TODAY='2026-11-12';
/* Parked at the 15 Nov 2026 meeting: the GP referral screen, the Diagnostics hub, Clinic tools and the family Tests tab.
   The code stays; ?parked=1 in the address brings them back. */
const PARKED_ON=/[?&]parked=1/.test(String(location.search||''));
const MON=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], DOW=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const dt=s=>{const[a,b,c]=s.split('-').map(Number);return new Date(Date.UTC(a,b-1,c));};
const fmt=s=>{const x=dt(s);return `${DOW[x.getUTCDay()]} ${x.getUTCDate()} ${MON[x.getUTCMonth()]} ${x.getUTCFullYear()}`;};
const days=(a,b=TODAY)=>Math.round((dt(a)-dt(b))/864e5);
const addDays=(s,n)=>new Date(dt(s).getTime()+n*864e5).toISOString().slice(0,10);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const CONCERNS=[['development','Development or speech'],['behaviour','Behaviour or attention'],['seizures','Possible seizures or blackouts'],['sleep','Sleep'],['heart','Heart: fainting or palpitations'],['growth','Growth or feeding'],['skin','Rashes or skin'],['headache','Headaches']];
const REGIONS=['Gold Coast','Brisbane','Sunshine Coast','Toowoomba','Regional or remote'];
const CULT=['Aboriginal and Torres Strait Islander families','South Asian families','East and South-East Asian families','African families','Pasifika and Māori families','Rural and farming families','Newly arrived families'];
const CLINICIANS=[
 {name:'Dr Amelia Tran',role:'General paediatrician',focus:['development','behaviour','growth','skin'],region:'Gold Coast',tele:true,wait:21,fee:320,gap:150,ages:[0,12],general:true,langs:['Vietnamese'],lived:'parent of a child with ADHD',works:[2],rapid:true},
 {name:'Dr Samuel Okafor',role:'Developmental paediatrician',focus:['development','behaviour'],region:'Brisbane',tele:true,wait:48,fee:380,gap:190,ages:[0,12],langs:['Igbo'],lived:'grew up with dyslexia',works:[3,6],rapid:true},
 {name:'Dr Priya Raman',role:'Paediatric neurologist',focus:['seizures','headache'],region:'Gold Coast',tele:false,wait:35,fee:420,gap:210,ages:[0,18],langs:['Tamil','Hindi'],lived:null,works:[1]},
 {name:'Dr Leo Fitzgerald',role:'General paediatrician',focus:['growth','sleep','behaviour'],region:'Sunshine Coast',tele:true,wait:14,fee:290,gap:95,ages:[0,16],general:true,langs:[],lived:'has ADHD',works:[5,4],holistic:true},
 {name:'Dr Hannah Weiss',role:'Paediatric cardiologist',focus:['heart'],region:'Brisbane',tele:true,wait:28,fee:400,gap:180,ages:[0,18],langs:['German'],lived:'parent of a child with a heart condition',works:[]},
 {name:'Dr Mateo Alvarez',role:'Adolescent paediatrician',focus:['behaviour','headache','sleep'],region:'Gold Coast',tele:true,wait:30,fee:340,gap:160,ages:[10,16],langs:['Spanish'],lived:'has ADHD',works:[6],holistic:true},
 {name:'Dr Grace Liu',role:'Paediatric sleep physician',focus:['sleep'],region:'Australia-wide',tele:true,wait:19,fee:360,gap:170,ages:[1,18],langs:['Mandarin','Cantonese'],lived:null,works:[2]},
 {name:'Dr Noah Bennett',role:'General paediatrician',focus:['development','growth','behaviour'],region:'Toowoomba',tele:true,wait:9,fee:280,gap:90,ages:[0,16],general:true,langs:['Auslan'],lived:'parent of an autistic child',works:[0,5]}];
CLINICIANS.forEach(c=>c.works=c.works.map(i=>CULT[i]));
const LANGS=[...new Set(CLINICIANS.flatMap(c=>c.langs))].sort();
const STEPS=['Received','Triaged','Booked','Seen','Letter back'];
const FLOW=['Referred','Triaged','Booked','Recording','Uploaded','Reporting','Reported'];

const NEURO=['Talking','Moving','Sleep','Behaviour','Funny turn','Eating'],HEART=['Fast heartbeat','Dizzy','Fainted','Chest pain','Short of breath','Tired'],BABY=['Feeding','Sleep','Skin','Moving','Babbling','Unsettled'];
let state={
 child:'mia',
 kids:{
  mia:{name:'Mia',doc:'Dr Tran',age:'4 years',prog:'Funny turns check',cats:NEURO,dcat:'Funny turn',tiles:['note','win','sleep','feed','rash','question'],refUntil:'2027-03-14',refFrom:'2026-03-14',review:'After both tests',
    plan:['Two tests to find out what the blank stares are','Keep adding notes, with a video if you can','Check-in with Dr Tran once both tests are back'],
    team:['Dr Amelia Tran, children\'s doctor','Dr Priya Raman, brain specialist','Dr Hannah Weiss, heart specialist','Sophie Carter, speech','Dr R. Mehta, GP']},
  arjun:{name:'Arjun',doc:'Dr Raman',age:'9 years',prog:'Epilepsy care',cats:NEURO,dcat:'Funny turn',tiles:['note','win','sleep','feed','rash','question'],sos:true,refUntil:'2026-12-20',refFrom:'2025-12-20',review:'Every 3 months',
    plan:['Morning medicine every day','Log every funny turn, with a video if you can','Check-in every 3 months, brain wave test once a year'],
    team:['Dr Priya Raman, brain specialist','Dr R. Mehta, GP','Ms Okoro, class teacher']},
  zoe:{name:'Zoe',doc:'Dr Weiss',age:'13 years',prog:'Heart rhythm check',cats:HEART,dcat:'Fast heartbeat',tiles:['note','win','sleep','feed','rash','question'],refUntil:'2027-10-30',refFrom:'2026-10-30',review:'After the monitor',
    plan:['A 24-hour monitor to see her heart on a normal day','Tap the button whenever she feels something','Check-in with Dr Weiss when the report is back'],
    team:['Dr Hannah Weiss, heart specialist','Dr R. Mehta, GP','Coach Bell, netball']},
  ivy:{name:'Ivy',doc:'Dr Fitzgerald',age:'10 months',prog:'Feeding and growth check',cats:BABY,dcat:'Feeding',tiles:['feed','sleep','rash','note','win','question'],ev:false,refUntil:'2027-09-02',refFrom:'2026-09-02',review:'10 Dec',
    plan:['Log feeds and sleep for two weeks','Add a photo when the rash shows up','Check-in with Dr Fitzgerald on 10 Dec'],
    team:['Dr Leo Fitzgerald, children\'s doctor','Ella Morgan, lactation consultant','Dr R. Mehta, GP','Child health nurse']}},
 appts:[
  {kid:'mia',date:'2026-11-19',time:'9:30 am',what:'Brain wave test (EEG)',who:'PaedsMe Diagnostics, Southport',mode:'In person',prep:['Stay up 2 hours late the night before','Wash hair, no products','Bring a toy and a snack','It takes about an hour']},
  {kid:'mia',date:'2026-12-03',time:'2:15 pm',what:'Check-in with Dr Tran',who:'Dr Amelia Tran',mode:'Video',prep:['Tick off new skills this week','Write down your questions']},
  {kid:'mia',date:'2026-12-10',time:'10:00 am',what:'Speech session',who:'Sophie Carter',mode:'In person',prep:['Bring the home practice sheet']},
  {kid:'arjun',date:'2026-11-26',time:'11:00 am',what:'Check-in with Dr Raman',who:'Dr Priya Raman',mode:'In person',prep:['Add anything new to the diary','Bring his medicines']},
  {kid:'arjun',date:'2027-02-25',time:'9:00 am',what:'Check-in with Dr Raman',who:'Dr Priya Raman',mode:'Video',prep:['Add anything new to the notes']},
  {kid:'zoe',date:'2026-11-27',time:'3:30 pm',what:'Check-in with Dr Weiss',who:'Dr Hannah Weiss',mode:'Video',prep:['Finish the 24-hour monitor','Post it back in the bag','Write down your questions']},
  {kid:'ivy',date:'2026-12-10',time:'11:30 am',what:'Check-in with Dr Fitzgerald',who:'Dr Leo Fitzgerald',mode:'Video',prep:['Log feeds and sleep this week','Add a photo if the rash comes back','Write down your questions']}],
 prepDone:{},
 milestones:[['Speaks in sentences of four or more words',true],['Names four colours',true],['Hops on one foot',false],['Draws a person with three parts',true],['Plays cooperatively with other children',true],['Dresses with little help',false]],
 growth:[[2,86],[2.5,91],[3,95.5],[3.5,99],[4,102.5]],
 events:[{date:'2026-11-02',note:'Staring spell at breakfast, about 20 seconds'},{date:'2026-10-21',note:'Brief episode after sport, tired afterwards'}],
 results:{mia:[{date:'2026-10-06',title:'Care plan, updated',by:'Dr Amelia Tran',note:'Speech sessions every 2 weeks. Brain wave test booked. Check-in in December.'}],
          arjun:[{date:'2026-10-28',title:'Brain wave test report',by:'Dr Priya Raman',note:'Dr Raman will go through it with you on 26 Nov.'},{date:'2026-08-14',title:'Care plan',by:'Dr Priya Raman',note:'Keep the diary going. Check-in every 3 months.'}]},
 renew:{},log:[],chart:{},heights:{mia:[[2,86],[2.5,91],[3,95.5],[3.5,99],[4,102.5]],arjun:[[7,122.5],[8,128],[9,133.5]],zoe:[[11,145],[12,152],[13,157.5]]},
 todo:{mia:[['Speech practice, 10 minutes',false],['Add a note if you see a blank stare',false],['Bed by 7:30 tonight',false]],arjun:[['Morning medicine',false],['Log last night\'s sleep',false],['Pack medicine for school camp',false]],zoe:[['Keep the monitor on',true],['Tap the button when you feel something',true],['No bath or swim today',false]],ivy:[['Log today\'s feeds',false],['Log naps',false],['Photo if the rash shows up',false]]},
 ftab:'today',hubLine:'All',hubSel:'S-1046',drafts:{},jOpen:false,quick:null,jdone:{},sent:{},plan:false,planTaps:0,
 notes:{mia:[{date:'2026-11-08',cat:'Funny turn',text:'Blank stare at kindy pickup. Her teacher saw it too.',video:true},{date:'2026-11-01',cat:'Funny turn',text:'Stared and did not answer for about 10 seconds at dinner.',video:false},{date:'2026-10-20',cat:'Talking',text:'People outside the family find her hard to understand.',video:false}],
        arjun:[{date:'2026-11-02',cat:'Funny turn',text:'Staring spell at breakfast, about 20 seconds.',video:false},{date:'2026-10-21',cat:'Funny turn',text:'Short episode after sport. Tired afterwards.',video:true}]},
 wins:{mia:['Says four-word sentences','Names four colours'],arjun:['Rode his bike to school']},sleep:{mia:10.5,arjun:null},did:{},questions:{mia:['Should we repeat the hearing test?'],arjun:[]},pathAt:{mia:2,arjun:4},
 q:{age:4,concern:'development',region:'Gold Coast',tele:true,ref:false,lang:'Any',lived:false,culture:'Any',approach:'Any',who:'child',said:'',heard:[],listening:false},
 req:{},stats:{feeding:{v:42,p:31,l:58},sleep:{v:57,p:36,l:44},skin:{v:64,p:52,l:27},nd:{v:38,p:29,l:19},unwell:{v:29,p:14,l:0}},
 cm:{band:'u17',complex:false,gp:4,forms:{parent:false,teacher:false}},
 learnOpen:'',playing:null,asked:[],quickCat:null,
 shared:[{id:'SC-118',c:'Child, 8 y',g:'ADHD',paed:'Dr Amelia Tran',gpDue:'2026-11-24',script:'2026-12-01',annual:'2027-05-14',every:90},
  {id:'SC-124',c:'Child, 11 y',g:'ADHD and autism',complex:true,paed:'Dr Samuel Okafor',gpDue:'2026-11-05',script:'2026-11-20',annual:'2027-02-03',every:60},
  {id:'SC-131',c:'Child, 15 y',g:'ADHD',paed:'Dr Mateo Alvarez',gpDue:'2027-01-12',script:'2026-12-18',annual:'2026-12-09',every:90}],
 escal:[{c:'Child, 12 y',g:'ADHD and epilepsy',from:'Dr R. Mehta, GP',date:'2026-11-11',why:'Asked for a review before the yearly date.'}],
 forms:[{c:'Child, 7 y',visit:'2026-11-24',parent:true,teacher:false},{c:'Child, 9 y',visit:'2026-11-30',parent:true,teacher:true},{c:'Child, 6 y',visit:'2026-12-04',parent:false,teacher:false}],
 booked:{},
 gp:{need:'consult',age:6,concern:'seizures',region:'Brisbane',urgency:'Soon',period:'12 months',tele:true},
 refs:[{id:'R-2031',age:3,concern:'development',urgency:'Routine',to:'Dr Amelia Tran',step:4},{id:'R-2038',age:11,concern:'headache',urgency:'Routine',to:'Dr Mateo Alvarez',step:2},{id:'R-2044',age:7,concern:'heart',urgency:'Soon',to:'Dr Hannah Weiss',step:1}],
 studies:[
  {id:'S-1038',age:11,type:'holter',test:'Holter ECG, 24 hours',line:'Cardiology',site:'Home kit, Mackay',ref:'2026-10-19',s:6,ind:'Palpitations at rest',result:{finding:'Normal',mode:'note',plain:'Your child\'s heart rhythm was normal over the 24 hours.',date:'2026-10-27'}},
  {id:'S-1042',age:9,kid:'arjun',type:'aeeg',test:'Ambulatory EEG, 24 hours',line:'Neurology',site:'Home kit, Cairns',ref:'2026-10-12',s:6,ind:'Known epilepsy, yearly review',result:{finding:'Abnormal',mode:'discuss',plain:'',date:'2026-10-28'}},
  {id:'S-1045',age:14,type:'ecg',test:'Resting ECG, 12-lead',line:'Cardiology',site:'Spoke, Toowoomba',ref:'2026-11-03',s:4,ind:'Fainting during sport'},
  {id:'S-1046',age:4,kid:'mia',type:'ecg',test:'Resting ECG, 12-lead',line:'Cardiology',site:'Hub, Southport',ref:'2026-11-05',s:5,done:'2026-11-10',ind:'Blank stares. To rule out a heart cause'},
  {id:'S-1047',age:4,kid:'mia',type:'eeg',test:'Routine EEG, sleep-deprived',line:'Neurology',site:'Hub, Southport',ref:'2026-11-05',s:2,when:'2026-11-19',ind:'Blank stares, seen twice by parent and once by teacher'},
  {id:'S-1051',age:7,type:'eeg',test:'Routine EEG',line:'Neurology',site:'Hub, Southport',ref:'2026-11-09',s:0,ind:'ADHD assessment',flag:'The only reason given is ADHD. Medicare lists this as low value unless discussed with a neurologist.'},
  {id:'S-1054',age:10,type:'eeg',test:'Routine EEG',line:'Neurology',site:'Spoke, Townsville',ref:'2026-11-10',s:0,ind:'Two blackouts at school',needEcg:true},
  {id:'S-1055',age:13,kid:'zoe',type:'holter',test:'Holter ECG, 24 hours',line:'Cardiology',site:'Home kit, Brisbane',ref:'2026-11-06',s:3,when:'2026-11-12',ind:'Fast heartbeat and one faint at netball'},
  {id:'S-1056',age:13,kid:'zoe',type:'ecg',test:'Resting ECG, 12-lead',line:'Cardiology',site:'Spoke, Brisbane',ref:'2026-10-30',s:6,ind:'Fast heartbeat and one faint at netball',result:{finding:'Normal',mode:'note',plain:'Zoe\'s heart trace at rest was normal. The 24-hour monitor shows what happens on a normal day.',date:'2026-11-04'}}],
 clinic:{recalls:[{c:'Child, 6 y',g:'Development',due:'2026-10-30'},{c:'Child, 12 y',g:'Epilepsy',due:'2026-11-06'},{c:'Child, 8 y',g:'ADHD',due:'2026-11-20'},{c:'Child, 3 y',g:'Growth',due:'2026-11-27'}],
   expiring:[{c:'Child, 9 y',g:'Epilepsy',until:'2026-12-20'},{c:'Child, 5 y',g:'Development',until:'2026-12-02'},{c:'Child, 13 y',g:'Headache',until:'2027-01-08'}],
   slots:[{when:'Thu 19 Nov, 2:00 pm',wl:3},{when:'Mon 23 Nov, 9:30 am',wl:5}],sent:{}}
};
state.notes.zoe=[{date:'2026-11-12',cat:'Felt something',text:'Tapped the button at 8:40 am',video:false},{date:'2026-11-03',cat:'Fast heartbeat',text:'Heart racing after the netball warm-up, about 5 minutes.',video:false},{date:'2026-10-24',cat:'Fainted',text:'Fainted at netball training. Awake again within a minute.',video:false}];
state.wins.zoe=[];state.questions.zoe=['Can I keep playing netball?'];state.sleep.zoe=8;state.results.zoe=[];
state.notes.ivy=[{date:'2026-11-09',cat:'Feeding',text:'Refused the bottle at daycare. Fed well at home.',video:false},{date:'2026-10-30',cat:'Sleep',text:'Waking every two hours since Tuesday.',video:false}];
state.wins.ivy=['Pulls up to stand','Waves bye-bye'];state.questions.ivy=['Can we keep one night feed?'];state.sleep.ivy=10.5;state.results.ivy=[];
/* The three home logs: feeding, sleep (naps here, last night in state.sleep) and rashes. Entries are what the family typed; m is minutes after midnight, for ordering. */
state.feeds={mia:[],arjun:[],zoe:[],ivy:[{date:TODAY,m:770,time:'12:50 pm',type:'Solids',detail:'Pumpkin, a few spoons'},{date:TODAY,m:690,time:'11:30 am',type:'Bottle',detail:'120 mL'},{date:TODAY,m:575,time:'9:35 am',type:'Solids',detail:'Porridge and banana'},{date:TODAY,m:400,time:'6:40 am',type:'Breast',detail:'Left side, 14 min'}]};
state.naps={mia:[],arjun:[],zoe:[],ivy:[{date:TODAY,m:590,time:'9:50 am',h:1.5}]};
state.rashes={mia:[],arjun:[],zoe:[],ivy:[{date:'2026-11-10',m:1035,time:'5:15 pm',where:['Face'],text:'Red, dry patches on both cheeks. Worse after the bath.',photo:true},{date:'2026-11-03',m:480,time:'8:00 am',where:['Arms','Legs'],text:'Small bumps in the elbow and knee creases.',photo:true}]};
state.feedType=null;
/* Demand for the app. The website comes first; the app is built only if families ask for it. Counts only: an email typed into the list is never kept. */
state.wait={joined:false,platform:null,visits:1240,taps:{header:96,home:71,talk:45},joins:87,plat:{iPhone:52,Android:35},uses:{'Talking a worry through':63,'Notes for the doctor':57,'Feeding':41,'Sleep':48,'Rashes':33,'Finding care':38,'Videos and guides':22}};
/* Talk it through: the conversation with Pip, the note being built, and the notes the parent has saved. */
/* Urgent video call: the request a parent is filling in. Counts only; nothing typed here is sent anywhere. */
/* Folded sections the visitor has opened. */
state.fold={};
state.urgent={ok:false,age:'',what:'',note:false,sent:false,count:14};
/* Pip presents: which line is showing, whether it is playing, and the viewer's sound and transcript choices. */
state.pres={i:0,on:false,sound:true,text:false,done:false};
state.talk={log:[],step:0,draft:{},saved:[],seq:0,asked:{sleep:38,skin:44,feeding:29,nd:33,unwell:21,none:17}};
const label=k=>CONCERNS.find(c=>c[0]===k)[1];
const opts=(arr,v)=>arr.map(o=>{const[k,t]=Array.isArray(o)?o:[o,o];return `<option value="${esc(k)}"${k==v?' selected':''}>${esc(t)}</option>`;}).join('');
const SEED=JSON.parse(JSON.stringify(state));
/* ADHD shared care, as proposed by the clinical lead (15 Nov 2026). Every figure is indicative: [fee, out of pocket]. */
const CARE={first:[600,350],second:[350,200],gp:[110,40,50],gpOnly:1000};
/* Children only (21 Nov 2026): the 17 to 24 and 25 and over bands, and the two psychiatrists, were removed at the founder's request. */
const BANDS=[['u17','Under 17','Paediatrician','paediatrician',8]];
const money=n=>'$'+n.toLocaleString('en-AU');
const fees=(c,q)=>q.concern==='behaviour'&&/paediatrician/i.test(c.role)?{fee:CARE.first[0],gap:CARE.first[1],adhd:true}:{fee:c.fee,gap:c.gap,adhd:false};
/* Learn: the five topic categories agreed on 15 Nov 2026. Short videos and photo guides, not long text.
   Titles are slots: the clinical team supplies each one and it is a draft until a paediatrician signs it off.
   An item is [v or p, title, minutes or photo count, who]. */
const LEARN=[
 {id:'feeding',title:'Feeding',full:'Feeding and lactation',ico:'bottle',blurb:'Breast, bottle and first foods.',track:['feed','Log a feed'],
  items:[['v','Breastfeeding help: who to call',1,'Ella Morgan, lactation consultant'],['p','Starting solids, in six photos',6,'Ella Morgan, lactation consultant'],['v','Bottle refusal: what to film for your nurse',1,'Dr Leo Fitzgerald'],['v','Fussy eating: what to note before a visit',2,'Jo Castellanos, dietitian']]},
 {id:'sleep',title:'Sleep',full:'Sleep',ico:'moon',blurb:'Nights, naps and bedtime.',track:['sleep','Log sleep'],
  items:[['v','Bedtime: the questions parents send us',2,'Dr Grace Liu'],['v','How to log sleep so your doctor can use it',1,'Dr Grace Liu'],['p','A bedtime routine, in five photos',5,'Dr Grace Liu']]},
 {id:'skin',title:'Rashes',full:'Rashes and skin',ico:'spots',blurb:'Photograph it, log it, and your doctor sees how it changes.',track:['rash','Log a rash'],
  items:[['p','How to photograph a rash',5,'Dr Leo Fitzgerald'],['v','What to write down about a rash',1,'Dr Amelia Tran'],['v','Why a photo each day helps your doctor',2,'Dr Amelia Tran']]},
 {id:'nd',title:'Development',full:'Development and neurodivergence',ico:'eye',blurb:'Talking, playing, moving and attention. Film what you see.',track:['note','Add a note or video'],link:['#adhd-care','How ADHD care works'],
  items:[['v','What to film if you are wondering about talking',2,'Dr Amelia Tran'],['v','Play, pointing and eye contact: how to describe what you see',2,'Dr Samuel Okafor'],['v','ADHD care in three steps',1,'Dr Samuel Okafor']]},
 {id:'unwell',title:'Unwell',full:'When your child is unwell',ico:'thermo',blurb:'Who to call, and what to have ready.',urgent:true,track:['note','Add a note'],
  items:[['v','Who to call, and when they are open',1,'Dr Noah Bennett'],['p','What to have ready before you call',4,'Dr Noah Bennett'],['v','A video visit: how it works',1,'Dr Amelia Tran']]}];
const bump=(c,k)=>{if(state.stats[c])state.stats[c][k]++;};
/* Find care in the family's own words: a keyword pass that fills in the form. No model call, nothing interpreted. */
const NUMW=['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen'];
const CONCERN_RX={behaviour:/adhd|attention|focus|hyperactiv|behaviou?r|concentrat|impulsiv|fidget/,development:/speech|talk|develop|autis|milestone/,seizures:/seizure|blank stare|staring|blackout|epilep|funny turn/,sleep:/sleep|bedtime|waking at night/,heart:/heart|faint|palpitation/,growth:/growth|weight|feeding|eating|breastfe|height/,skin:/rash|eczema|skin|hives|spots/,headache:/headache|migraine/};
const CULT_RX=[[/aboriginal|torres strait|indigenous|first nations/,0],[/south asian|indian|sri lankan|pakistani|bangladeshi|nepal/,1],[/east asian|south-east asian|southeast asian|chinese|korean|filipino|japanese/,2],[/african|nigerian|sudanese|somali|ethiopian/,3],[/pasifika|pacific island|samoan|tongan|fijian|m[aā]ori/,4],[/rural|farm|cattle station|on a property/,5],[/refugee|newly arrived|new to australia|migrant/,6]];
function hear(text){
  const q=state.q,h=[];q.said=String(text).slice(0,400);Object.assign(q,{lang:'Any',lived:false,culture:'Any',approach:'Any'});
  const t=' '+q.said.toLowerCase().replace(/\b[a-z]+\b/g,w=>NUMW.includes(w)?NUMW.indexOf(w):w)+' ';
  if(!t.trim()){toast('Say or type a sentence about your child first');return;}
  if(EMERG.test(t)){q.heard=[];toast('If a child is in danger, call 000 now.');return;}
  const y=t.match(/(\d{1,2})\s*-?\s*(?:years?|yrs?|yo)\b/)||t.match(/\b(?:is|aged?|turning|turned)\s+(\d{1,2})\b(?!\s*-?\s*(?:months?|weeks?))/),mo=t.match(/(\d{1,2})\s*-?\s*months?\b/);
  if(y){q.age=Math.min(30,+y[1]);h.push('Age '+q.age);}else if(mo){q.age=Math.floor(+mo[1]/12);h.push(mo[1]+' months');}
  if(y||mo)q.who=q.age===AGE[state.child]?'child':'other';
  const hit=Object.entries(CONCERN_RX).map(([k,rx])=>[k,t.search(rx)]).filter(x=>x[1]>=0).sort((a,b)=>a[1]-b[1])[0];
  if(hit){q.concern=hit[0];h.push(label(hit[0]));}
  const rg=REGIONS.slice(0,4).find(r=>t.includes(r.toLowerCase()))||(/rural|remote|regional|farm|outback/.test(t)?'Regional or remote':null);
  if(rg){q.region=rg;h.push(rg);}
  const lg=LANGS.find(l=>t.includes(l.toLowerCase()));if(lg){q.lang=lg;h.push(lg);}
  const cu=CULT_RX.find(x=>x[0].test(t));if(cu){q.culture=CULT[cu[1]];h.push(CULT[cu[1]]);}
  if(/lived experience|who (gets|understands) it|been through (it|this)|neurodivergent (doctor|clinician|paediatrician)|(doctor|clinician|someone|paediatrician) (who|that) (has|have) (adhd|autism)/.test(t)){q.lived=true;h.push('Lived experience');}
  if(/holistic|naturopath|integrative/.test(t)){q.approach='Holistic';h.push('Holistic approach');}
  if(/in person|face to face|face-to-face/.test(t)){q.tele=false;h.push('In person');}else if(/video|telehealth|online/.test(t)){q.tele=true;h.push('Video is fine');}
  if(/no referral|without a referral|don'?t have a referral|do not have a referral|haven'?t got a referral/.test(t)){q.ref=false;h.push('No referral yet');}else if(/referral/.test(t)){q.ref=true;h.push('Has a referral');}
  q.heard=h;
  toast(h.length?'Filled in '+plural(h.length,'detail')+'. Check them below.':'Could not pick anything up. Use the form below.');
}
const toResults=()=>{const r=document.getElementById('results');if(r&&state.q.heard.length)r.scrollIntoView({behavior:window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});};
/* The photo or video a parent adds to a note or a rash entry. It stays in this tab as an object URL: nothing is
   uploaded, and it is gone on reload. A real build stores it under the Moments pipeline in the ADHDme app. */
const MEDIA={};let pending=null,mediaSeq=0;
function pickMedia(file){
  if(pending){URL.revokeObjectURL(pending.url);pending=null;}
  if(!file)return;
  if(!/^(video|image)\//.test(file.type)){toast('Choose a photo or a video');return;}
  if(file.size>200*1024*1024){toast('That file is over 200 MB. Trim it and try again.');return;}
  pending={url:URL.createObjectURL(file),kind:file.type.startsWith('video')?'video':'photo',name:file.name};
}
const keepMedia=()=>{if(!pending)return null;const id='m'+(++mediaSeq);MEDIA[id]=pending;pending=null;return id;};
const mediaSlot=(label,accept)=>pending?`<div class="mprev">${pending.kind==='video'?`<video src="${pending.url}" controls playsinline muted></video>`:`<img src="${pending.url}" alt="The photo you chose">`}<button type="button" data-act="media-clear">Remove</button></div>`
  :`<label class="mpick">${I.cam}<span>${label}</span><input type="file" id="media-file" accept="${accept}" class="sr"></label>`;
const mediaBox=(label,accept)=>`<div class="mslot" id="mslot" data-label="${label}" data-accept="${accept}">${mediaSlot(label,accept)}</div><p class="foot">Prototype: it stays on this device. Nothing is uploaded.</p>`;
const mediaView=x=>x.media&&MEDIA[x.media]?(MEDIA[x.media].kind==='video'?`<video class="mthumb" src="${MEDIA[x.media].url}" controls playsinline preload="metadata"></video>`:`<img class="mthumb" src="${MEDIA[x.media].url}" alt="Photo added by the parent">`):'';
let rec=null;
function listen(){
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(rec){rec.stop();return;}
  if(!SR){toast('Voice is not available in this browser. Type it instead.');return;}
  const q=state.q;rec=new SR();rec.lang='en-AU';rec.interimResults=true;rec.continuous=false;let got='';
  rec.onresult=e=>{got=[...e.results].map(r=>r[0].transcript).join(' ');const box=document.getElementById('q-said');if(box)box.value=got;};
  rec.onerror=e=>{toast(e.error==='not-allowed'||e.error==='service-not-allowed'?'The microphone is blocked. Type it instead.':'Could not hear that. Try again, or type it.');};
  rec.onend=()=>{rec=null;q.listening=false;if(got.trim())hear(got);render();if(got.trim())toResults();};
  try{rec.start();q.listening=true;render();}catch(e){rec=null;q.listening=false;toast('Voice did not start. Type it instead.');}
}

function match(q){
  return CLINICIANS.map(c=>{
    if(q.age<c.ages[0]||q.age>c.ages[1])return null;
    if(q.approach&&q.approach!=='Any'&&(c.holistic?'Holistic':'Mainstream')!==q.approach)return null;
    let s=0,why=[];
    if(c.focus.includes(q.concern)){s+=50;why.push('Sees children for '+label(q.concern).toLowerCase());}
    else if(c.general){s+=20;why.push('General paediatrician: can assess and refer on');}
    else return null;
    if(c.region===q.region){s+=25;why.push('In your region');}
    else if(c.tele&&q.tele){s+=15;why.push('Offers video consults');}
    else return null;
    s+=Math.max(0,Math.round(25-(c.rapid?2:c.wait)/2));why.push(c.rapid?'Rapid Access: video visit within 48 hours of the referral':'About '+c.wait+' days to a first visit');
    if(q.lang&&q.lang!=='Any'&&c.langs.includes(q.lang)){s+=12;why.push('Speaks '+q.lang);}
    if(q.lived&&c.lived){s+=8;why.push('Lived experience: '+c.lived);}
    if(q.culture&&q.culture!=='Any'&&c.works.includes(q.culture)){s+=8;why.push('Works with '+q.culture);}
    return{c,s,why};
  }).filter(Boolean).sort((a,b)=>b.s-a.s).slice(0,4);
}

const ICO=p=>`<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
const I={people:ICO('<circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="9" r="2.5"/><path d="M15.5 14.2c3 .3 5.5 2.7 5.5 5.8"/>'),eye:ICO('<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>'),moon:ICO('<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>'),pulse:ICO('<path d="M2 12h4l2-6 4 12 3-9 2 3h5"/>'),flag:ICO('<path d="M5 21V4h11l-2 4 2 4H5"/>'),pill:ICO('<rect x="3" y="8" width="18" height="8" rx="4"/><path d="M12 8v8"/>'),ask:ICO('<path d="M4 5h16v11H9l-5 4z"/>'),tick:ICO('<circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/>'),home:ICO('<path d="M4 11l8-7 8 7v9H4z"/>'),cal:ICO('<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>'),chart:ICO('<path d="M2 20h20M5 20V10M11 20V4M17 20v-7"/>'),folder:ICO('<path d="M3 6h7l2 3h9v10H3z"/>'),book:ICO('<path d="M12 6c-2-1.6-5-2-8-1.5v13c3-.5 6-.1 8 1.5 2-1.6 5-2 8-1.5v-13c-3-.5-6-.1-8 1.5zM12 6v13"/>'),play:ICO('<path d="M8 5l11 7-11 7z" fill="currentColor"/>'),pause:ICO('<path d="M8 5v14M16 5v14"/>'),mic:ICO('<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>'),cam:ICO('<rect x="3" y="7" width="18" height="13" rx="3"/><circle cx="12" cy="13.500" r="3.500"/><path d="M8 7l1.500-3h5L16 7"/>'),photos:ICO('<rect x="3" y="7" width="14" height="13" rx="2"/><path d="M7 4h12a2 2 0 0 1 2 2v10M3 17l4-4 3 3 3-3 4 4"/>'),thermo:ICO('<path d="M10 14V5a2 2 0 0 1 4 0v9a4 4 0 1 1-4 0zM12 9v8"/>'),bowl:ICO('<path d="M3 11h18a9 9 0 0 1-18 0zM12 3v5M8 5v3M16 5v3"/>'),bottle:ICO('<path d="M9 3h6v3l2 3v11a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V9l2-3zM7 13h10"/>'),spots:ICO('<path d="M12 3c4 4.500 6 7.600 6 10.500a6 6 0 0 1-12 0C6 10.600 8 7.500 12 3z"/><circle cx="10" cy="13" r=".9"/><circle cx="14" cy="12" r=".9"/><circle cx="12.500" cy="16" r=".9"/>')};
const PIP_SVG='<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="5" y="7" width="38" height="36" rx="14" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="2"/><path d="M13 18h6l2-4 3 7 2-3h9" fill="none" stroke="var(--sun)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="18" cy="29" r="2.6" fill="var(--ink)"/><circle cx="30" cy="29" r="2.6" fill="var(--ink)"/><path d="M19 35q5 4 10 0" fill="none" stroke="var(--ink)" stroke-width="2" stroke-linecap="round"/></svg>';
const PATH=['Referral','Paediatrician','Tests','Plan','Follow-up'];
const view=()=>{const h=location.hash.slice(1);return VIEWS[h]?h:'home';};

const JOURNEY=[[0,'Birth','First vaccine, given in hospital'],[2,'2 months','Vaccines'],[4,'4 months','Vaccines'],[6,'6 months','Vaccines and growth check'],[12,'12 months','Vaccines and growth check'],[18,'18 months','Vaccines and growth check'],[30,'2½ to 3½ years','Growth check'],[48,'4 years','Vaccines before school'],[48,'4 to 5 years','Growth check before school'],[144,'Year 7','Vaccines at school'],[168,'Year 10','Vaccine at school']];
const MONTHS={mia:50,arjun:108,zoe:156,ivy:10};
function journeyRows(id){
  const m=MONTHS[id],rows=JOURNEY.map((j,i)=>({k:id+'-'+i,mo:j[0],when:j[1],what:j[2]}));
  if(m<60)rows.push({k:id+'-flu',mo:m,when:'Every year until age 5',what:'Flu vaccine'});
  rows.forEach(r=>{r.done=!!state.jdone[r.k]||r.mo<=m-12;});
  return{past:rows.filter(r=>r.done),due:rows.filter(r=>!r.done&&r.mo<=m),next:rows.filter(r=>r.mo>m).slice(0,2),m};
}
function journey(id){
  const k=state.kids[id],{past,due,next,m}=journeyRows(id);
  const away=r=>{const y=Math.round((r.mo-m)/12);return y<1?'Within a year':'In about '+y+' year'+(y===1?'':'s');};
  return `<section class="panel"><div class="row"><h2>Due now</h2><span class="chip ${due.length?'warn':'good'}">${due.length?due.length+' to do':'Up to date'}</span></div>
    ${due.length?`<ul class="list">${due.map(r=>`<li><div class="txt" style="flex-basis:120px"><b>${esc(r.what)}</b><div class="sub">${esc(r.when)}</div></div><button type="button" class="primary" data-act="jbook">Book</button><button type="button" data-act="jdone" data-k="${r.k}">Done</button></li>`).join('')}</ul>`:`<p class="sub">Nothing to do right now. ${k.name} is up to date.</p>`}</section>
  <section class="panel"><h2>Coming up</h2><ul class="list">${next.map(r=>`<li><div class="txt"><b>${esc(r.what)}</b><div class="sub">${esc(r.when)}</div></div><span class="chip quiet">${away(r)}</span></li>`).join('')}</ul></section>
  <details class="panel"><summary>${past.length} earlier steps done</summary><ul class="list">${past.map(r=>`<li><div class="txt"><b>${esc(r.what)}</b><div class="sub">${esc(r.when)}</div></div><span class="chip good">Done</span></li>`).join('')}</ul></details>
  <p class="foot">From Australia's free vaccine program and the Queensland child health book.</p>`;
}

const CATS=['Talking','Moving','Sleep','Behaviour','Funny turn','Eating'];
function record(id){const n=state.notes[id],first=n.length?n.map(x=>x.date).sort()[0]:TODAY;
  return{n,w:state.wins[id],q:state.questions[id],weeks:Math.max(1,Math.ceil(days(TODAY,first)/7)),vids:n.filter(x=>x.video).length};}
const plural=(n,w)=>n+' '+(n===1?w:/[^aeiou]y$/.test(w)?w.slice(0,-1)+'ies':w+(/ch$/.test(w)?'es':'s'));

const TINFO={
  eeg:{name:'Brain wave test',clin:'EEG',what:'Small stickers on the head record brain waves.',feel:'It does not hurt. No needles.',time:'About an hour at the clinic.'},
  aeeg:{name:'Take-home brain wave test',clin:'Ambulatory EEG',what:'The same stickers, worn at home for a day and a night.',feel:'It does not hurt. A soft cap keeps the stickers on.',time:'24 hours at home.'},
  ecg:{name:'Heart trace',clin:'ECG',what:'Stickers on the chest record the heartbeat.',feel:'It does not hurt. No needles.',time:'About 10 minutes.'},
  holter:{name:'24-hour heart monitor',clin:'Holter monitor',what:'A small recorder worn under clothes for a day.',feel:'It does not hurt. No baths or swimming while it is on.',time:'24 hours at home.'}};
const DOCS={Neurology:'Dr Priya Raman',Cardiology:'Dr Hannah Weiss'};
const sdoc=t=>DOCS[t.line].replace(/^Dr \w+ /,'Dr ');
const place=x=>x.startsWith('Home')?'At home':x.replace(/^(Hub|Spoke), /,'')+' clinic';
const tstatus=t=>t.s<2?['Being arranged','quiet']:t.s===2?['Booked','']:t.s===3?['On now','warn']:t.s<6?['Report coming','']:['Result ready','good'];
const kidTests=id=>state.studies.filter(x=>x.kid===id).sort((a,b)=>(a.s===6)-(b.s===6)||(a.ref<b.ref?-1:1));
function twhen(t){return t.s<2?'We are finding a time. You will get a message.':t.s===2?`${fmt(t.when)} · ${place(t.site)}`:t.s===3?'On now. Take it off tomorrow at 4 pm and post it back.':t.s<6?`Done${t.done?' on '+fmt(t.done):''}. The report takes up to 5 working days.`:`Reported ${fmt(t.result.date)}`;}
function monitorCard(t,id){const n=state.notes[id].filter(x=>x.cat==='Felt something').length;
  return `<section class="panel hero"><div class="row"><span class="lab">${TINFO[t.type].name}</span><span class="chip warn">On now</span></div>
    <button type="button" class="primary bigbtn" data-act="felt">I felt something</button>
    <p class="sub">${plural(n,'tap')} so far. ${sdoc(t)} matches each tap to the recording.</p></section>`;}
function testCard(t,id){const i=TINFO[t.type],[st,cl]=tstatus(t);
  const res=t.s===6?(t.result.mode==='note'?`<div class="note"><b>${sdoc(t)} says:</b> ${esc(t.result.plain)}</div>`:`<div class="note">The result is ready. ${sdoc(t)} will go through it with you at the next visit.</div><div><button type="button" data-act="resched" data-what="a call about the result">Ask for an earlier call</button></div>`):'';
  return `<section class="panel"><div class="row"><div><h2>${i.name}</h2><span class="sub">${i.clin} · ${t.line==='Neurology'?'Brain':'Heart'}</span></div><span class="chip ${cl}">${st}</span></div>
    <p>${twhen(t)}</p>${res}
    <details><summary>What is it like?</summary><ul class="plain" style="margin-top:8px"><li>${i.what}</li><li>${i.feel}</li><li>${i.time}</li></ul></details></section>`;}

/* Height lines: CDC stature-for-age, 3rd / 50th / 97th percentile, [age in years, P3, P50, P97] in cm. */
const GROW={mia:{age:4.17,rows:[[2.04,78.8,85.4,91.9],[2.54,83.3,90.3,97.5],[3.04,86.9,94.2,101.8],[3.54,90.0,97.6,105.7],[4.04,93.1,101.0,109.5],[4.54,96.2,104.5,113.4],[5.04,99.4,108.0,117.4],[5.54,102.6,111.5,121.3],[6.04,105.8,115.0,125.3]]},
  arjun:{age:9.1,rows:[[6.04,106.1,115.7,125.1],[7.04,111.9,122.0,132.3],[8.04,117.5,128.1,139.3],[9.04,122.4,133.7,145.7],[10.04,126.7,138.8,151.5],[11.04,130.8,143.7,157.3]]},
  zoe:{age:13,rows:[[10.04,126.0,138.2,151.3],[11.04,130.7,144.3,158.1],[12.04,137.4,151.5,165.2],[13.04,144.2,157.3,170.2],[14.04,148.1,160.5,172.9],[15.04,149.7,161.9,174.2]]}};
const HIST={mia:[0,0,0,0,0,0,0,0],arjun:[3,2,2,1,0,1,0,0],zoe:[0,0,0,0,0,0,0,0],ivy:[0,0,0,0,0,0,0,0]};
const SLEEPH={mia:[10,11,10.5,9.5,10,11],arjun:[9,9.5,8.5,9,10,9.5],zoe:[8,7.5,8.5,7,8,9],ivy:[11,10.5,11.5,10,11,10.5]};
const FEEDH={mia:[0,0,0,0,0,0],arjun:[0,0,0,0,0,0],zoe:[0,0,0,0,0,0],ivy:[7,6,7,8,6,7]};
const baby=id=>AGE[id]<2,ageLab=id=>AGE[id]<1?MONTHS[id]+' mo':AGE[id]+' y';
const FTYPES=id=>baby(id)?['Breast','Bottle','Solids']:['Meal','Snack','Drink'],feedType=id=>FTYPES(id).includes(state.feedType)?state.feedType:FTYPES(id)[0];
const RWHERE=id=>['Face','Chest or tummy','Back','Arms','Legs',AGE[id]<3?'Nappy area':'Hands or feet'];
const todays=a=>a.filter(x=>x.date===TODAY);
function chartFeeds(id){
  const c=FEEDH[id].concat([todays(state.feeds[id]).length]),mx=Math.max(4,...c),x0=34,x1=308,y0=18,y1=128,bw=(x1-x0)/7,Y=v=>y1-v/mx*(y1-y0),ticks=[];
  for(let v=0;v<=mx;v+=mx>5?2:1)ticks.push(v);
  return `<svg viewBox="0 0 320 152" width="100%" style="max-width:460px" role="img" aria-label="${baby(id)?'Feeds':'Meals and snacks'} logged each day for 7 days, oldest first: ${c.join(', ')}">
    ${ticks.map(v=>`<line x1="${x0}" x2="${x1}" y1="${Y(v)}" y2="${Y(v)}" stroke="var(--line)"/><text x="${x0-6}" y="${Y(v)+4}" text-anchor="end">${v}</text>`).join('')}
    ${c.map((v,i)=>`<rect x="${(x0+i*bw+6).toFixed(1)}" y="${Y(v)}" width="${(bw-12).toFixed(1)}" height="${y1-Y(v)}" rx="3" fill="var(--accent)"/>${v?`<text x="${(x0+i*bw+bw/2).toFixed(1)}" y="${Y(v)-4}" text-anchor="middle" style="fill:var(--ink);font-weight:600">${v}</text>`:''}`).join('')}
    ${c.map((_,i)=>`<text x="${(x0+i*bw+bw/2).toFixed(1)}" y="146" text-anchor="middle">${i===6?'Today':DOW[dt(addDays(TODAY,i-6)).getUTCDay()]}</text>`).join('')}</svg>`;
}
/* Today so far: every feed, nap and rash logged today, newest first. A record, in the family's words. */
function dayLog(id){
  const rows=[...todays(state.feeds[id]).map(x=>[x.m,x.time,x.type==='Breast'?'Breastfeed':x.type,x.detail,'a']),...todays(state.naps[id]).map(x=>[x.m,x.time,'Nap',x.h+(x.h===1?' hour':' hours'),'c']),...todays(state.rashes[id]).map(x=>[x.m,x.time,'Rash',x.where.join(', ')+(x.photo?', photo':''),'b'])].sort((a,b)=>b[0]-a[0]);
  if(!rows.length)return '';
  return `<section class="panel"><div class="row"><h2>Today so far</h2><span class="sub">${plural(rows.length,'entry')}</span></div>
    <ul class="daylog">${rows.slice(0,6).map(r=>`<li><time>${esc(r[1])}</time><i class="dl ${r[4]}" aria-hidden="true"></i><div class="txt"><b>${esc(r[2])}</b><span class="sub">${esc(r[3])}</span></div></li>`).join('')}</ul>${rows.length>6?`<p class="sub">And ${rows.length-6} earlier.</p>`:''}</section>`;
}
const MARK={arjun:{i:2,label:'Dose changed'}};
const evName=id=>id==='zoe'?'Heart feelings':'Funny turns';
function weekly(id){const c=HIST[id].slice();state.notes[id].forEach(x=>{if(id==='zoe'||x.cat==='Funny turn'){const w=Math.floor(days(TODAY,x.date)/7);if(w>=0&&w<8)c[7-w]++;}});return c;}
function chartTurns(id){
  const c=weekly(id),mx=Math.max(3,...c),x0=34,x1=308,y0=18,y1=128,bw=(x1-x0)/8,Y=v=>y1-v/mx*(y1-y0),m=MARK[id],ticks=[];
  for(let v=0;v<=mx;v+=mx>5?2:1)ticks.push(v);
  const lab=i=>i===7?'This week':fmt(addDays(TODAY,-(7-i)*7)).slice(4,-5);
  return `<svg viewBox="0 0 320 152" width="100%" style="max-width:460px" role="img" aria-label="${evName(id)} each week for 8 weeks, oldest first: ${c.join(', ')}">
    ${ticks.map(v=>`<line x1="${x0}" x2="${x1}" y1="${Y(v)}" y2="${Y(v)}" stroke="var(--line)"/><text x="${x0-6}" y="${Y(v)+4}" text-anchor="end">${v}</text>`).join('')}
    ${c.map((v,i)=>`<rect x="${(x0+i*bw+5).toFixed(1)}" y="${Y(v)}" width="${(bw-10).toFixed(1)}" height="${y1-Y(v)}" rx="3" fill="var(--accent)"/>${v?`<text x="${(x0+i*bw+bw/2).toFixed(1)}" y="${Y(v)-4}" text-anchor="middle" style="fill:var(--ink);font-weight:600">${v}</text>`:''}`).join('')}
    ${m?`<line x1="${x0+m.i*bw}" x2="${x0+m.i*bw}" y1="6" y2="${y1}" stroke="var(--sun)" stroke-width="1.5" stroke-dasharray="4 3"/><text x="${x0+m.i*bw+5}" y="13" style="fill:var(--sun);font-weight:600">${m.label}</text>`:''}
    ${[0,4,7].map(i=>`<text x="${(x0+i*bw+bw/2).toFixed(1)}" y="146" text-anchor="middle">${lab(i)}</text>`).join('')}</svg>`;
}
function chartSleep(id){
  const v=SLEEPH[id].concat(state.sleep[id]!=null?[state.sleep[id]]:[]),x0=34,x1=296,y0=14,y1=128,X=i=>x0+i*(x1-x0)/6,Y=h=>y1-(Math.min(13,Math.max(5,h))-5)/8*(y1-y0),last=v.length-1;
  return `<svg viewBox="0 0 320 152" width="100%" style="max-width:460px" role="img" aria-label="Hours of sleep for the last ${v.length} nights: ${v.join(', ')}">
    ${[6,8,10,12].map(h=>`<line x1="${x0}" x2="${x1}" y1="${Y(h)}" y2="${Y(h)}" stroke="var(--line)"/><text x="${x0-6}" y="${Y(h)+4}" text-anchor="end">${h}</text>`).join('')}
    <polyline fill="none" stroke="var(--accent)" stroke-width="2.5" points="${v.map((h,i)=>X(i).toFixed(1)+','+Y(h).toFixed(1)).join(' ')}"/>
    ${v.map((h,i)=>`<circle cx="${X(i).toFixed(1)}" cy="${Y(h).toFixed(1)}" r="${i===last?5:3.5}" fill="var(--accent)"/>`).join('')}
    <text x="${X(last).toFixed(1)}" y="${(Y(v[last])-10).toFixed(1)}" text-anchor="middle" style="fill:var(--ink);font-weight:600">${v[last]} h</text>
    ${[0,1,2,3,4,5,6].map(i=>`<text x="${X(i).toFixed(1)}" y="146" text-anchor="middle">${DOW[dt(addDays(TODAY,i-6)).getUTCDay()]}</text>`).join('')}</svg>`;
}
function chartHeight(id){
  const g=GROW[id],pts=state.heights[id],R=g.rows,xa=R[0][0],xb=R[R.length-1][0],lo=Math.floor(R[0][1]/10)*10,hi=Math.ceil(R[R.length-1][3]/10)*10,x0=34,x1=280,y0=12,y1=128;
  const X=a=>x0+(Math.min(xb,Math.max(xa,a))-xa)/(xb-xa)*(x1-x0),Y=h=>y1-(Math.min(hi,Math.max(lo,h))-lo)/(hi-lo)*(y1-y0),ln=k=>R.map(r=>X(r[0]).toFixed(1)+','+Y(r[k]).toFixed(1)).join(' '),lp=pts[pts.length-1],yt=[],xt=[];
  for(let h=lo;h<=hi;h+=hi-lo>50?20:10)yt.push(h);for(let a=Math.ceil(xa);a<=Math.floor(xb);a++)xt.push(a);
  return `<svg viewBox="0 0 320 152" width="100%" style="max-width:460px" role="img" aria-label="Height by age against the CDC growth chart. Latest: ${lp[1]} centimetres at age ${lp[0]}">
    ${yt.map(h=>`<line x1="${x0}" x2="${x1}" y1="${Y(h)}" y2="${Y(h)}" stroke="var(--line)"/><text x="${x0-6}" y="${Y(h)+4}" text-anchor="end">${h}</text>`).join('')}
    ${[[1,'3rd'],[2,'50th'],[3,'97th']].map(([k,l])=>`<polyline fill="none" stroke="var(--muted)" stroke-width="1.25" ${k===2?'':'stroke-dasharray="3 3"'} points="${ln(k)}"/><text x="${x1+5}" y="${(Y(R[R.length-1][k])+4).toFixed(1)}">${l}</text>`).join('')}
    <polyline fill="none" stroke="var(--accent)" stroke-width="2.5" points="${pts.map(q=>X(q[0]).toFixed(1)+','+Y(q[1]).toFixed(1)).join(' ')}"/>
    ${pts.map((q,i)=>`<circle cx="${X(q[0]).toFixed(1)}" cy="${Y(q[1]).toFixed(1)}" r="${i===pts.length-1?5:3.5}" fill="var(--accent)"/>`).join('')}
    <text x="${(X(lp[0])-8).toFixed(1)}" y="${(Y(lp[1])-9).toFixed(1)}" text-anchor="end" style="fill:var(--ink);font-weight:600">${lp[1]} cm</text>
    ${xt.map(a=>`<text x="${X(a).toFixed(1)}" y="146" text-anchor="middle">${a} y</text>`).join('')}</svg>`;
}
function chartsPanel(id){
  const tabs=[];if(state.kids[id].ev!==false)tabs.push(['turns',evName(id)]);tabs.push(['sleep','Sleep'],['feeds',baby(id)?'Feeding':'Eating']);if(GROW[id])tabs.push(['height','Height']);
  const c=tabs.some(t=>t[0]===state.chart[id])?state.chart[id]:tabs[0][0],nf=todays(state.feeds[id]).length;
  const svg={turns:chartTurns,sleep:chartSleep,feeds:chartFeeds,height:chartHeight}[c](id);
  const cap={turns:()=>`${weekly(id).slice(4).reduce((a,b)=>a+b,0)} in the last 4 weeks. Every note you add shows up here.`,sleep:()=>'Hours each night for the last week.',feeds:()=>`${nf} logged today. Each one you log shows up here.`,height:()=>'Grey lines are the CDC growth chart, widely used in Australia from age 2: the 3rd, 50th and 97th lines. Your doctor reads the chart.'}[c]();
  const add=c==='turns'||c==='feeds'?`<div><button type="button" class="primary" data-act="quick-jump" data-kind="${c==='feeds'?'feed':'note'}">Add one</button></div>`
    :`<form id="chart-form" class="rowform"><div class="field" style="flex:1;min-width:0"><label for="chart-val">${c==='sleep'?'Hours last night':'Height today, in cm'}</label><input type="number" id="chart-val" step="0.5" min="0" max="${c==='sleep'?16:210}"></div><button class="primary" type="submit">Plot it</button></form>`;
  return `<section class="panel"><div class="row"><h2>Charts</h2><div class="seg" role="group" aria-label="Chart">${tabs.map(([k,l])=>`<button type="button" data-act="chart" data-c="${k}" aria-pressed="${k===c}">${l}</button>`).join('')}</div></div>
    <div class="scroll">${svg}</div><p class="sub">${cap}</p>${add}</section>`;
}

function family(){
  const id=state.child,k=state.kids[id],tab=(state.ftab==='tests'&&!PARKED_ON)||state.ftab==='learn'?'today':state.ftab,ap=state.appts.filter(a=>a.kid===id).sort((a,b)=>a.date<b.date?-1:1),nx=ap[0],r=record(id),slept=state.sleep[id],sent=!!state.sent[id],did=!!state.did[id],ts=kidTests(id);
  const seg=`<div class="seg" role="group" aria-label="Child">${Object.entries(state.kids).map(([i,c])=>`<button type="button" data-act="kid" data-id="${i}" aria-pressed="${i===id}">${c.name}</button>`).join('')}</div>`;
  const title={family:'Your family',today:k.name+"'s day",notes:'Notes for '+k.doc,tests:k.name+"'s tests",care:k.name+"'s care"}[tab];
  const lead={family:'One record for each child. Choose a child to add to it.',today:'Log a feed, a sleep, a rash or something you noticed. Each one takes a few seconds.',notes:`What you have recorded, as ${k.doc} will see it before the visit.`,tests:'Each test, where it is up to, and what happens next.',care:`The plan, the visits and the people looking after ${k.name}.`}[tab];
  const TABS=[['family','Overview'],['today','Today'],['notes','Notes'],...(PARKED_ON?[['tests','Tests']]:[]),['care','Care']];
  const nudge=`<section class="panel nudge"><div class="txt"><h2>Want this on your phone?</h2><p class="sub">This is the website. The app is not built yet. Tell us you want it and we will build it sooner.</p></div><a class="btn primary cta" href="#get-app" data-cta="family">Get the app ${ARROW}</a></section>`;
  let body='';
  if(tab==='family'){
    body=`<ul class="famlist fam-cards">${Object.entries(state.kids).map(([i,c])=>{const a=state.appts.filter(x=>x.kid===i).sort((x,y)=>x.date<y.date?-1:1)[0],tt=kidTests(i),on=tt.find(x=>x.s===3),td=state.todo[i],dn=td.filter(x=>x[1]).length;
      return `<li><button type="button" class="famrow" data-act="kid-go" data-id="${i}"><span class="ava" aria-hidden="true">${c.name[0]}</span><span class="txt"><b>${c.name}</b><span class="sub">${c.age} · ${a?esc(a.what)+', '+fmt(a.date).slice(4,-5):'No visit booked'}</span></span>${PARKED_ON&&on?'<span class="chip warn">Monitor on</span>':PARKED_ON&&tt.some(x=>x.s===6)?'<span class="chip good">Result ready</span>':'<span class="chev" aria-hidden="true">›</span>'}</button></li>`;}).join('')}</ul>`;
  }else if(tab==='today'){
    const n=nx?nx.prep.length:0,pd=nx?nx.prep.filter((_,i)=>state.prepDone[`${id}-${nx.date}-${i}`]).length:0;
    const td=state.todo[id],stars=td.filter(x=>x[1]).length;
    const star=on=>`<svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path d="M12 3l2.7 5.6 6.1.8-4.5 4.2 1.1 6-5.4-3-5.4 3 1.1-6L3.2 9.4l6.1-.8z" fill="${on?'var(--star)':'var(--line)'}"/></svg>`;
    const live=ts.find(t=>t.s===3);
    const next=nx?`<section class="panel hero"><span class="lab">In ${days(nx.date)} days</span><div class="big">${esc(nx.what)}</div>
      <p>${fmt(nx.date)}, ${nx.time}</p>
      <details id="prep-box"${state.prepOpen?' open':''}><summary>Get ready · ${pd===n?'all set':pd+' of '+n+' done'}</summary><div class="stack" style="gap:8px;margin-top:10px">${nx.prep.map((p,i)=>`<label class="check"><input type="checkbox" id="prep-${id}-${i}" data-prep="${id}-${nx.date}-${i}"${state.prepDone[`${id}-${nx.date}-${i}`]?' checked':''}><span>${esc(p)}</span></label>`).join('')}</div></details></section>`:'';
    const Q=state.quick;
    const qbody={note:`<div class="cpills">${k.cats.map((c,i)=>`<label class="cpill"><input type="radio" name="cat" id="cat-${i}" value="${c}"${c===(k.cats.includes(state.quickCat)?state.quickCat:k.dcat)?' checked':''}>${c}</label>`).join('')}</div>
        <div class="field"><label for="quick-input">${id==='zoe'?'What did you feel?':'What did you notice?'}</label><input type="text" id="quick-input" maxlength="140" placeholder="In your own words"></div>
        ${mediaBox('Add a video or photo','video/*,image/*')}`,
      win:`<div class="field"><label for="quick-input">${id==='zoe'?'What went well today?':'What can '+k.name+' do now?'}</label><input type="text" id="quick-input" maxlength="140"></div>`,
      sleep:`<div class="cpills">${['Last night','Nap'].map((c,i)=>`<label class="cpill"><input type="radio" name="skind" id="sk-${i}" value="${c}"${i===0?' checked':''}>${c}</label>`).join('')}</div>
        <div class="field"><label for="quick-input">Hours slept</label><input type="number" id="quick-input" min="0" max="16" step="0.5"></div>`,
      feed:(ft=>`<div class="cpills">${FTYPES(id).map((c,i)=>`<label class="cpill"><input type="radio" name="ftype" id="ft-${i}" value="${c}"${c===ft?' checked':''}>${c}</label>`).join('')}</div>
        ${ft==='Breast'?`<div class="cpills" role="group" aria-label="Side">${['Left','Right','Both'].map((c,i)=>`<label class="cpill"><input type="radio" name="fside" id="fs-${i}" value="${c}"${i===0?' checked':''}>${c}</label>`).join('')}</div>
          <div class="field"><label for="quick-input">Minutes</label><input type="number" id="quick-input" min="1" max="90"></div>`
        :ft==='Bottle'?`<div class="field"><label for="quick-input">How much, in mL</label><input type="number" id="quick-input" min="5" max="400" step="5"></div>`
        :`<div class="field"><label for="quick-input">What did ${k.name} have?</label><input type="text" id="quick-input" maxlength="140" placeholder="In your own words"></div>`}`)(feedType(id)),
      rash:`<div class="field"><span class="lab" id="rw-lab">Where is it?</span><div class="cpills" role="group" aria-labelledby="rw-lab">${RWHERE(id).map((c,i)=>`<label class="cpill"><input type="checkbox" name="rwhere" id="rw-${i}" value="${c}">${c}</label>`).join('')}</div></div>
        <div class="field"><label for="quick-input">What does it look like?</label><input type="text" id="quick-input" maxlength="140" placeholder="In your own words"></div>
        ${mediaBox('Add a photo','image/*,video/*')}
        <p class="foot">PaedsMe keeps the record for ${k.doc}. It cannot tell you what a rash is. If ${k.name} seems very unwell, call 000. For advice from a nurse in Queensland, call 13 HEALTH (13 43 25 84).</p>`,
      question:`<div class="field"><label for="quick-input">Your question for ${k.doc}</label><input type="text" id="quick-input" maxlength="140"></div>`}[Q];
    const qform=qbody?`<form class="panel" id="quick-form">${qbody}<div class="row" style="justify-content:flex-start"><button class="primary" type="submit">Save</button><button type="button" data-act="quick-open" data-kind="${Q}">Cancel</button></div></form>`:'';
    const tile=(cls,kind,ico,label,sub)=>`<button type="button" class="qt ${cls}" data-act="quick-open" data-kind="${kind}" aria-expanded="${Q===kind}">${ico}<b>${label}</b><span>${sub}</span></button>`;
    const T={note:c=>tile(c,'note',I.eye,id==='zoe'?'I felt it':id==='arjun'?'Funny turn':'I noticed',plural(r.n.length,'note')),
      win:c=>tile(c,'win',I.flag,id==='zoe'?'Good thing':'New skill',plural(r.w.length,'win')),
      med:c=>`<button type="button" class="qt ${c}" data-act="quick-toggle" aria-pressed="${did}">${I.pill}<b>Medicine</b><span>${did?'Given today':'Tap when given'}</span></button>`,
      sleep:c=>tile(c,'sleep',I.moon,'Sleep',slept!=null?(todays(state.naps[id]).length?slept+' h · '+plural(todays(state.naps[id]).length,'nap'):slept+' h last night'):'Tap to log'),
      feed:c=>tile(c,'feed',baby(id)?I.bottle:I.bowl,baby(id)?'Feeding':'Eating',todays(state.feeds[id]).length?todays(state.feeds[id]).length+' today':'Tap to log'),
      rash:c=>tile(c,'rash',I.spots,'Rash',state.rashes[id].length?plural(state.rashes[id].length,'entry'):'Tap to log'),
      question:c=>tile(c,'question',I.ask,'Ask doctor',r.q.length+' saved')};
    body=`<div class="fgrid"><div class="fcol"><div class="quick">${k.tiles.map((t,i)=>T[t](['a','b','c','d','e','f'][i])).join('')}</div>${qform}${dayLog(id)}</div><div class="fcol">${PARKED_ON&&live?monitorCard(live,id):''}${next}
      <section class="panel"><div class="row"><h2>To do today</h2><span class="sub">${stars} of ${td.length} done</span></div>
        <div class="stack" style="gap:10px">${td.map((x,i)=>`<label class="check"><input type="checkbox" id="todo-${id}-${i}" data-todo="${i}"${x[1]?' checked':''}><span>${esc(x[0])}</span></label>`).join('')}</div></section></div></div>`;
  }else if(tab==='notes'){
    body=`<div class="fgrid"><div class="fcol"><section class="panel hero"><div class="row"><span class="lab">What ${k.doc} will see</span><span class="chip ${sent?'good':''}">${sent?'Sent':r.weeks+' weeks of notes'}</span></div>
      <p>${plural(r.n.length,'note')}, ${plural(r.w.length,'win')}${r.vids?', '+plural(r.vids,'video'):''}${slept!=null?', sleep '+slept+' h':''}${todays(state.feeds[id]).length?', '+plural(todays(state.feeds[id]).length,baby(id)?'feed':'meal')+' today':''}${state.rashes[id].length?', '+plural(state.rashes[id].length,'rash entry'):''}, ${plural(r.q.length,'question')}.</p>
      <div><button type="button" class="primary" data-act="send-rec"${sent?' disabled':''}>${sent?'Sent to '+k.doc:'Send to '+k.doc}</button></div></section>
    ${chartsPanel(id)}</div><div class="fcol">
    ${state.rashes[id].length?`<section class="panel"><div class="row"><h2>Rashes</h2><button type="button" data-act="quick-jump" data-kind="rash">Add</button></div>
      <ul class="list">${state.rashes[id].map(x=>`<li><div class="txt"><b>${esc(x.text)}</b><div class="sub">${fmt(x.date)}${x.time?', '+esc(x.time):''} · ${esc(x.where.join(', '))}</div></div>${mediaView(x)}${x.photo?'<span class="chip">Photo</span>':''}</li>`).join('')}</ul>
      <p class="foot">Photos go to ${k.doc} with your notes. PaedsMe does not read them.</p></section>`:''}
    <section class="panel"><div class="row"><h2>What we noticed</h2><button type="button" data-act="quick-jump" data-kind="note">Add</button></div>
      ${r.n.length?`<ul class="list">${r.n.map(x=>`<li><div class="txt"><b>${esc(x.text)}</b><div class="sub">${fmt(x.date)}</div></div>${mediaView(x)}<span class="chip quiet">${esc(x.cat)}</span>${x.video?'<span class="chip">Video</span>':x.photo?'<span class="chip">Photo</span>':''}</li>`).join('')}</ul>`:'<p class="sub">Nothing yet. Tap Add when you notice something.</p>'}</section>
    <section class="panel"><div class="row"><h2>Wins</h2><button type="button" data-act="quick-jump" data-kind="win">Add</button></div>
      ${r.w.length?`<ul class="plain">${r.w.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:'<p class="sub">Add the first one.</p>'}</section>
    <section class="panel"><div class="row"><h2>Questions</h2><button type="button" data-act="quick-jump" data-kind="question">Add</button></div>
      ${r.q.length?`<ul class="plain">${r.q.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:'<p class="sub">None yet.</p>'}</section>
    <p class="foot">You write it. ${k.doc} reads it. Nothing is scored.</p></div></div>`;
  }else if(tab==='tests'){
    const steps=[['Referral',true],['Your notes',r.n.length>=3],...[...ts].sort((a,b)=>a.ref<b.ref?-1:1).map(t=>[TINFO[t.type].name,t.s===6]),['Check-in',false]],at=steps.findIndex(x=>!x[1]);
    body=`<section class="panel"><div class="row"><h2>${k.prog}</h2><span class="chip">${steps.filter(x=>x[1]).length} of ${steps.length} done</span></div>
      <ol class="steps">${steps.map((x,i)=>`<li class="${x[1]?'done':i===at?'now':''}">${x[0]}</li>`).join('')}</ol></section>
      ${ts.map(t=>t.s===3?monitorCard(t,id)+testCard(t,id):testCard(t,id)).join('')}
      <p class="foot">Your doctor explains every result. PaedsMe never guesses.</p>`;
  }else{
    const left=days(k.refUntil),total=days(k.refUntil,k.refFrom),pct=Math.max(4,Math.round(100*left/total)),low=left<60;
    body=`<div class="fgrid"><div class="fcol">${reqCard(id)}<section class="panel hero"><div class="row"><span class="lab">${k.prog}</span><span class="chip">Check-in: ${k.review}</span></div>
      <ul class="plain">${k.plan.map(x=>`<li>${esc(x)}</li>`).join('')}</ul><p class="foot">Set by ${k.doc}. Updated after each visit.</p></section>
    ${k.sos?`<details class="panel"${state.sosOpen?' open':''}><summary>If ${k.name} has a seizure</summary><ol class="plain" style="margin-top:10px"><li>Stay with him and time it.</li><li>Keep him safe. Put something soft under his head.</li><li>Nothing in his mouth. Do not hold him down.</li><li>When it stops, roll him onto his side.</li></ol>
      <div class="note" style="margin-top:10px"><b>Call 000</b> if it lasts 5 minutes or more, a second one follows, he is slow to wake or breathe, he is hurt, or it happens in water.</div>
      <p class="foot" style="margin-top:8px">General first aid from Better Health Channel. ${k.doc} adds ${k.name}'s own steps.</p></details>`:''}
    <section class="panel"><h2>Upcoming</h2><ul class="list">${ap.map(a=>`<li><div class="txt"><b>${esc(a.what)}</b><div class="sub">${fmt(a.date)}, ${a.time} · ${esc(a.who)}</div></div><span class="chip ${a.mode==='Video'?'':'quiet'}">${a.mode}</span><button type="button" data-act="resched" data-what="${esc(a.what)}">Move</button></li>`).join('')}</ul></section>
    <section class="panel"><h2>Your referral</h2><div class="row"><span>Valid until <b>${fmt(k.refUntil)}</b></span><span class="chip ${low?'warn':'good'}">${left} days left</span></div>
      <div class="bar"><i class="${low?'warn':''}" style="width:${pct}%"></i></div>
      ${low?`<p class="sub">No referral means no Medicare money back.</p><div><button type="button" class="primary" data-act="renew"${state.renew[id]?' disabled':''}>${state.renew[id]?'Renewal requested':'Ask the GP to renew'}</button></div>`:''}</section>
    </div><div class="fcol"><section class="panel"><h2>${k.name}'s team</h2><ul class="list">${k.team.map(t=>`<li><div class="txt">${esc(t)}</div></li>`).join('')}</ul></section>
    <section class="panel"><h2>For the family</h2><ul class="list">
      <li><div class="txt"><b>Share the plan</b><div class="sub">A one-page letter for school, kindy or a coach</div></div><button type="button" data-act="share-plan">Share</button></li>
      <li><div class="txt"><b>Support for you</b><div class="sub">Talk to a person about funding, school or how you are going</div></div><button type="button" data-act="family-support">Call me</button></li></ul></section>
    <details class="jwrap"${state.jOpen?' open':''}><summary>Checks and vaccines</summary><div class="stack" style="gap:16px;margin-top:12px">${journey(id)}</div></details>
    <section class="panel"><div class="row"><h2>Navigator</h2><span class="chip">$39 a month</span></div><p class="sub">A real person books visits, chases referrals and helps with funding. The website stays free.</p>
      <div><button type="button" class="primary" data-act="plan"${state.plan?' disabled':''}>${state.plan?'Thanks, noted':'Start plan'}</button></div>${state.plan?'<p class="foot">This is a price test. Nothing was charged.</p>':''}</section></div></div>`;
  }
  return `<section class="band band-s"><div class="wrap"><div class="band-row"><div class="band-text"><span class="eyebrow">My family</span><h1>${title}</h1><p class="lead">${lead}</p></div>${tab==='family'?'':seg}</div>
    <div class="subnav" role="group" aria-label="My family sections">${TABS.map(([t,l])=>`<button type="button" data-act="ftab" data-tab="${t}" aria-pressed="${tab===t}">${l}</button>`).join('')}</div></div>${sparks}</section>
  <section class="dash fam"><div class="wrap"><div class="app fam-web">${body}${nudge}</div></div></section>`;
}
/* Learn is a page of the site, open to anyone. The topic buttons and the sample media are the same ones the Team view counts. */
/* Pip presents (21 Nov 2026). On Learn, Pip is an AI presenter: an animated face that reads a script aloud, one line at a time,
   with the line shown as a caption and the whole script as a transcript. Speech uses the browser's own voice when it has one;
   without it, or with sound off, the captions advance on a timer. Only scripts with no health advice are written here. Every
   other video shows the waiting lines until a paediatrician writes and approves its script. */
const SCRIPTS={
 intro:['Hi, I am Pip. I am an AI presenter, not a doctor.','Learn has short guides on five topics: feeding, sleep, skin, development and being unwell.','A paediatrician approves every health script before I present it.','Under each topic you will find trusted reading from Australian health services.','If something is worrying you, open Talk it through and tell me about it.'],
 'unwell-2':['A video visit is an ordinary appointment, on your phone or computer.','Your GP writes the referral first. PaedsMe cannot book a specialist without one.','The clinic sends you a link and a time by message.','Find a quiet spot with good light, and have your child with you.','Keep your notes, photos and videos open, so you can share what you have noticed.','The clinician sets the plan, and a letter goes back to your GP.','If your child is in danger, do not wait for a visit. Call 000.']};
const WAITING=['This one is not ready yet.','A paediatrician approves every health script before I present it.','Until then, the trusted reading on this page covers the topic.'];
const PIP_TALK='<svg class="pip-talk" viewBox="0 0 48 48" aria-hidden="true"><rect x="5" y="7" width="38" height="36" rx="14" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="2"/><path d="M13 18h6l2-4 3 7 2-3h9" fill="none" stroke="var(--sun)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><g class="eyes"><circle cx="18" cy="29" r="2.6" fill="var(--ink)"/><circle cx="30" cy="29" r="2.6" fill="var(--ink)"/></g><path class="smile" d="M19 35q5 4 10 0" fill="none" stroke="var(--ink)" stroke-width="2" stroke-linecap="round"/><ellipse class="mouth" cx="24" cy="36.5" rx="3.6" ry="2.6" fill="var(--ink)"/></svg>';
const pres={timer:null,token:0};
const presItem=pid=>{const m=/^(.+)-(\d+)$/.exec(String(pid||'')),t=m&&LEARN.find(x=>x.id===m[1]);return t?t.items[+m[2]]:null;};
const presIs=pid=>pid==='intro'||!!(presItem(pid)&&presItem(pid)[0]==='v');
const presLines=pid=>SCRIPTS[pid]||WAITING;
const presMeta=pid=>pid==='intro'?{title:'How Learn works',who:'the PaedsMe team'}:{title:presItem(pid)[1],who:presItem(pid)[3]};
const presVoice=()=>{try{if(!('speechSynthesis' in window)||typeof SpeechSynthesisUtterance==='undefined')return null;const v=speechSynthesis.getVoices();return v.find(x=>/^en[-_]AU/i.test(x.lang))||v.find(x=>/^en[-_]GB/i.test(x.lang))||v.find(x=>/^en/i.test(x.lang))||null;}catch(e){return null;}};
function presStop(){pres.token++;clearTimeout(pres.timer);pres.timer=null;try{if('speechSynthesis' in window)speechSynthesis.cancel();}catch(e){}}
function presPaint(){const P=state.pres,lines=presLines(state.playing),c=$('pres-cap'),b=$('pres-bar'),w=$('pres'),t=$('pres-toggle');
  if(c)c.textContent=lines[P.i];if(b)b.style.width=Math.round(100*(P.i+1)/lines.length)+'%';if(w)w.classList.toggle('on',P.on);if(t)t.textContent=P.done?'Play again':P.on?'Pause':'Play';
  document.querySelectorAll('.pres-script li').forEach((li,i)=>li.classList.toggle('now',i===P.i));}
function presStep(){
  presStop();const P=state.pres,pid=state.playing;if(!presIs(pid)||!P.on)return;
  const lines=presLines(pid),tok=pres.token,line=lines[P.i],ms=Math.max(1800,line.split(/\s+/).length*330+500);
  const next=()=>{if(pres.token!==tok||state.playing!==pid)return;if(P.i>=lines.length-1){P.on=false;P.done=true;presStop();presPaint();return;}P.i++;presPaint();presStep();};
  const v=P.sound?presVoice():null;
  if(v){const u=new SpeechSynthesisUtterance(line.replace(/\b000\b/g,'triple zero'));u.voice=v;u.lang=v.lang;u.rate=.98;u.onend=()=>{if(pres.token!==tok)return;clearTimeout(pres.timer);pres.timer=setTimeout(next,280);};speechSynthesis.speak(u);pres.timer=setTimeout(next,ms*2+1500);}
  else pres.timer=setTimeout(next,ms);
}
function presStage(){
  const pid=state.playing;if(!presIs(pid))return '';const P=state.pres,lines=presLines(pid),m=presMeta(pid),ready=!!SCRIPTS[pid];
  return `<div class="pres${P.on?' on':''}" id="pres"><div class="pres-ava">${PIP_TALK}<span class="chip">AI presenter</span></div>
    <div class="pres-body"><span class="lab">Pip presents</span><b class="pres-title">${esc(m.title)}</b>
     <p class="pres-cap" id="pres-cap" aria-live="polite">${esc(lines[P.i])}</p>
     <div class="bar"><i id="pres-bar" style="width:${Math.round(100*(P.i+1)/lines.length)}%"></i></div>
     <div class="acts"><button type="button" class="primary" id="pres-toggle" data-act="pres-toggle">${P.done?'Play again':P.on?'Pause':'Play'}</button><button type="button" data-act="pres-sound" aria-pressed="${P.sound}">${P.sound?'Sound on':'Sound off'}</button><button type="button" data-act="pres-text" aria-pressed="${P.text}">Transcript</button><button type="button" data-act="pres-close">Close</button></div>
     ${P.text?`<ol class="pres-script">${lines.map((l,i)=>`<li class="${i===P.i?'now':''}">${esc(l)}</li>`).join('')}</ol>`:''}
     <p class="foot">${ready?`Script by ${esc(m.who)}. A sample, with no health advice.`:`Script by ${esc(m.who)}, waiting for a paediatrician's approval.`}</p></div></div>`;
}
function learnView(){
  const id=state.child,k=state.kids[id];
    const cur=LEARN.some(t=>t.id===state.learnOpen)?state.learnOpen:(baby(id)?'feeding':'nd'),t=LEARN.find(x=>x.id===cur),ti=LEARN.indexOf(t);
    const body=`<div class="cats" role="group" aria-label="Topics">${LEARN.map((c,i)=>`<button type="button" data-act="learn-open" data-id="${c.id}" aria-pressed="${c.id===cur}" style="--s:var(--${TINT[i%5]}-soft)"><span class="ci" aria-hidden="true">${I[c.ico]}</span><span>${c.title}</span></button>`).join('')}</div>
      <section class="panel"><h2>${t.full}</h2><p class="sub">${t.blurb}</p>
       ${t.urgent?'<p class="note"><b>If your child is in danger, call 000.</b> For advice from a nurse in Queensland, call 13 HEALTH (13 43 25 84).</p>':''}
       ${presStage()}<ul class="media">${t.items.map((e,i)=>{const pid=t.id+'-'+i,pl=state.playing===pid,vid=e[0]==='v';return `<li><button type="button" class="mcard" data-act="play" data-ep="${pid}" aria-pressed="${pl}" style="--s:var(--${TINT[(ti+i)%5]}-soft)"><span class="mth">${vid?(pl?I.pause:I.play):I.photos}<span class="dur">${vid?e[2]+' min':e[2]+' photos'}</span>${pl&&!vid?'<span class="prog"><i></i></span>':''}</span><b>${esc(e[1])}</b><span class="sub">${pl?(vid?'Pip is presenting':'Showing sample photos'):esc(e[3])}</span></button></li>`;}).join('')}</ul>
       <div class="row" style="justify-content:flex-start"><a class="btn primary" href="#talk">Tell Pip about it</a>${t.link?`<a class="btn" href="${t.link[0]}">${t.link[1]}</a>`:''}</div></section>
      ${INFO.some(x=>x.topic===t.id)?`<section class="panel"><div class="row"><h2>Trusted reading</h2><span class="chip quiet">Opens another site</span></div><div class="reading">${INFO.filter(x=>x.topic===t.id).map(infoCard).join('')}</div><p class="foot">From Australian public health services.</p></section>`:''}
      <form class="panel" id="ask-form"><div class="field"><label for="ask-input">A question for the next Q&amp;A</label><input type="text" id="ask-input" maxlength="140" placeholder="General questions only"></div><div><button class="primary" type="submit">Send</button></div>${state.asked.length?`<p class="sub">${plural(state.asked.length,'question')} sent.</p>`:''}</form>
      <p class="foot">Sample guides. Each one waits for a paediatrician’s approval.</p>`;
  return `<section class="band band-s"><div class="wrap"><div class="band-row"><div class="band-text"><span class="eyebrow">Learn</span><h1>Short videos and photo guides</h1><p class="lead">General information, not advice about your child.</p><div class="cta-row"><button type="button" class="cta" data-act="play" data-ep="intro" aria-pressed="${state.playing==='intro'}">${I.play} Hear Pip explain this page</button></div></div></div></div>${sparks}</section>
  <section class="dash fam learn"><div class="wrap"><div class="app fam-web">${body}</div></div></section>`;
}

/* ---------- Website format (16 Nov 2026, one site from 18 Nov). Every screen is laid out as a web page:
   a band (the hero) on the aqua ground, wide sections, and the site footer. My family was part of the site until it was parked on 19 Nov. Bands animate in once per route change, never on a re-render. ---------- */
const TICK='<svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true"><path d="M4 10.5l4 4 8-9" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const ARROW='<svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><path d="M4 10h12M11 5l5 5-5 5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const SPARK='<svg class="spark" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2c.6 5.2 2.8 7.4 8 8-5.2.6-7.4 2.8-8 8-.6-5.2-2.8-7.4-8-8 5.2-.6 7.4-2.8 8-8z" fill="currentColor"/></svg>';
const sparks=SPARK+SPARK+SPARK;
const TINT=['accent','orange','violet','sun','lime'];
const ini=n=>n.replace(/^Dr /,'').split(' ').map(w=>w[0]).join('').slice(0,2);
const secHead=(kick,h2,p)=>`<div class="sec-head"><span class="kick">${kick}</span><h2>${h2}</h2>${p?`<p>${p}</p>`:''}</div>`;
const kpi=(lab,n,sub)=>`<div class="kpi"><span class="lab">${lab}</span><b>${n}</b>${sub?`<small>${sub}</small>`:''}</div>`;
const SAY=[['ADHD, age 7, Brisbane','My daughter is 7 and we think it might be ADHD. We live in Brisbane and speak Vietnamese at home.'],['Blank stares, age 4','Our 4 year old has blank stares. We are on the Gold Coast and want to see someone in person.'],['A teen who wants lived experience','He is 15 and has ADHD. We want a doctor with lived experience, on the Gold Coast. Video is fine.']];
/* Rapid Access (meeting of 15 Nov 2026). A family cannot book a specialist directly: clinics triage every
   referral by hand. Choosing a clinician creates a referral request the parent takes to their GP. */
const REQ=['Request ready','With your GP','Clinic triage','Visit booked'];
const reqKey=()=>state.q.who==='other'?'other':state.child;
function reqLetter(id){
  const r=state.req[id],c=CLINICIANS.find(x=>x.name===r.name),k=state.kids[id],home=[];
  if(k){const rec=record(id),nf=state.feeds[id].length,nr=state.rashes[id].length;home.push(plural(rec.n.length,'note')+' over '+plural(rec.weeks,'week'));if(rec.vids)home.push(plural(rec.vids,'video'));if(nr)home.push(plural(nr,'rash entry'));if(nf)home.push(plural(nf,'feed')+' logged');}
  return `<div class="letter"><p><b>To:</b> Dr R. Mehta, GP</p><p><b>About:</b> ${k?k.name+', '+k.age:'a child aged '+r.age}</p>
    <p>${k?k.name+"'s parent asks":'A parent asks'} for a referral to ${esc(c.name)}, ${esc(c.role.toLowerCase())}${c.rapid?', through PaedsMe Rapid Access':''}.</p>
    <p><b>Reason, in the parent's words:</b> ${r.said?'"'+esc(r.said)+'"':esc(label(r.concern))}</p>
    <p><b>From home:</b> ${home.length?home.join(', ')+'.':'nothing logged at home yet.'}</p>
    <p>Please address it "Dear Paediatrician". It goes to the clinic's practice manager by secure email, in the same format for every clinic.</p>
    <p class="foot">Drafted by PaedsMe from what the parent entered. The GP decides whether to refer.</p></div>`;
}
function reqCard(id){
  const r=state.req[id];if(!r)return '';
  const c=CLINICIANS.find(x=>x.name===r.name),k=state.kids[id]||{name:'Another child'};
  const msg=['Take this to your GP. PaedsMe has filled in the request, so the visit is quick. Your GP writes the referral.','Your GP has the request. When they send the referral, it reaches the clinic\'s practice manager in one standard format.','The clinic has the referral. A person there triages every referral by hand. PaedsMe does not triage.',r.date?'Booked for '+fmt(r.date)+'.'+(state.kids[id]?' It is in '+k.name+'\'s appointments.':''):'Booked.'][r.step];
  return `<section class="panel req"><div class="row"><span class="lab">Referral request · ${k.name}</span><span class="chip ${r.step===3?'good':''}">${REQ[r.step]}</span></div>
    <div class="big">${esc(c.name)}</div><p class="sub">${esc(c.role)}${c.rapid?' · Rapid Access, a video visit within 48 hours of the referral':''}</p>
    <ol class="steps">${REQ.map((s,i)=>`<li class="${i<r.step?'done':i===r.step?'now':''}">${s}</li>`).join('')}</ol>
    <p>${msg}</p>
    ${r.step===0?`<details><summary>See what your GP gets</summary>${reqLetter(id)}</details>`:''}
    ${r.step<3?`<div class="row" style="justify-content:flex-start">${r.step===0?'<button type="button" class="primary" data-act="req-share" data-id="'+id+'">Send to my GP</button>':''}<button type="button" data-act="req-next" data-id="${id}">Next step (demo)</button></div>`:''}</section>`;
}
/* One website (18 Nov 2026). The team is starting with the website alone, to test demand for the app. Home is the front door,
   Talk it through is the conversation with Pip (My family, the record as web pages, is parked from 19 Nov), and Get the app is the
   list that measures whether families want it on a phone. */
function home(){
  return `<section class="band"><div class="wrap band-2"><div class="band-text">
     <span class="eyebrow">For families in Australia</span>
     <h1>Worried about your child? <em>Talk it through</em></h1>
     <p class="lead">Tell Pip what you’ve noticed, the way you’d tell a friend. Pip writes it down clearly and helps you find the right person. Pip is an AI helper, not a doctor.</p>
     <div class="cta-row"><a class="btn primary cta" href="#talk">Talk it through ${ARROW}</a><a class="btn cta" href="#find-care">Find care</a></div></div>
    <div class="band-side"><div class="preview chatpv"><div class="pv-head">${PIP_SVG}<div><b>Pip</b><span class="sub">A sample conversation</span></div></div>
      <div class="tmsg me">She keeps waking at night and I do not know why.</div>
      <div class="tmsg bot">Thank you for telling me. When did you first notice it?</div>
      <div class="tmsg me">About three weeks ago.</div>
      <div class="tmsg bot">How often does it happen?</div>
      <a class="more" href="#talk">Start your own ${ARROW}</a></div></div></div>${sparks}</section>
  <section class="strip"><div class="wrap"><a class="linkcard urgentlink" href="#urgent"><span><b>Need a paediatrician soon?</b><span class="sub">Video call with ${TELE.doctor}. A fee applies. In danger, call 000.</span></span>${ARROW}</a></div></section>
  <section class="sec"><div class="wrap">${secHead('Start here','What do you need today?')}
   <div class="grid4">
    <a class="feat" href="#talk" style="--s:var(--lime-soft)"><span class="dot">${I.ask}</span><h3>Talk it through</h3><p>Tell Pip what’s worrying you.</p><span class="more" aria-hidden="true">${ARROW}</span></a>
    <a class="feat" href="#find-care" style="--s:var(--accent-soft)"><span class="dot">${I.people}</span><h3>Find care</h3><p>A paediatrician by video, within 48 hours of your GP’s referral.</p><span class="more" aria-hidden="true">${ARROW}</span></a>
    <a class="feat" href="#adhd-care" style="--s:var(--violet-soft)"><span class="dot">${I.chart}</span><h3>ADHD care</h3><p>A clear plan, shared with your GP.</p><span class="more" aria-hidden="true">${ARROW}</span></a>
    <a class="feat" href="#learn" style="--s:var(--sun-soft)"><span class="dot">${I.play}</span><h3>Learn</h3><p>Short guides on feeding, sleep, skin and more.</p><span class="more" aria-hidden="true">${ARROW}</span></a>
   </div></div></section>
  <section class="sec alt"><div class="wrap">${secHead('How it works','You talk. Pip writes it down.')}
   <div class="grid3">
    <div class="feat" style="--s:var(--accent-soft)"><span class="num">1</span><h3>Say it your way</h3><p>Type what you’ve noticed, any time. No need for the right words.</p></div>
    <div class="feat" style="--s:var(--orange-soft)"><span class="num">2</span><h3>Pip writes the note</h3><p>What you saw, since when, and what worries you most.</p></div>
    <div class="feat" style="--s:var(--lime-soft)"><span class="num">3</span><h3>You take it with you</h3><p>Show it to your GP, or use it to find a paediatrician.</p></div>
   </div></div></section>
  <section class="sec"><div class="wrap closer"><span class="kick">The app</span><h2>Want Pip on your phone?</h2><p>The app isn’t built yet. Tell us you want it.</p>
   <div class="cta-row center"><a class="btn primary cta" href="#get-app" data-cta="home">Get the app ${ARROW}</a></div></div></section>`;
}
/* Talk it through (19 Nov 2026). The Family app's job, done as a conversation: a parent says what worries them, Pip asks five
   short questions, and the answer is a note in the parent's own words. Pip records and relays. It never says what something is,
   whether it is normal, or how urgent it is. The replies here are scripted; a live model must be held to the same rules. */
const TALK_Q=[['age','How old is your child?',['Under 1','1 to 2','3 to 5','6 to 11','12 to 17']],['since','When did you first notice it?',['Today','This week','A few weeks ago','Months ago']],['often','How often does it happen?',['All the time','Every day','A few times a week','Now and then','Just once']],['media','Do you have any photos or videos of it?',['Yes','No','I could take one']],['fear','What worries you most about it? There is no wrong answer.',[]]];
const TALK_LAB={what:'What I noticed',age:'Age',since:'First noticed',often:'How often',media:'Photos or videos',fear:'What worries me most'};
const TALK_START=['She keeps waking at night','A rash that keeps coming back','He is not talking much yet','Feeding is a battle'];
const TALK_AGE={'Under 1':0,'1 to 2':1,'3 to 5':4,'6 to 11':8,'12 to 17':14};
const ASKS=/\b(is (this|it|that|she|he) normal|should i (be )?worr|what is it\b|what could it be|what(?:'s| is) wrong|is (it|this|that) serious|do(es)? (she|he|they) have|could (it|this) be|what should i give|how much .*(medicine|give)|is it (adhd|autism|eczema))/i;
const CANNOT='I can’t tell you that, and I don’t want to guess about your child. A nurse can talk with you now on 1800 022 222, and your GP can see them. I can make sure they hear everything you’ve noticed.';
const URGENT='If a child is in danger, call 000 now. For health advice from a nurse, call healthdirect on 1800 022 222, or in Queensland 13 HEALTH on 13 43 25 84. Pip cannot help with urgent medical problems.';
const talkTopic=t=>{t=String(t).toLowerCase();return /sleep|wak|nap|bedtime|night/.test(t)?'sleep':/rash|skin|eczema|spots|itch/.test(t)?'skin':/feed|eat|bottle|breast|solids|food|milk/.test(t)?'feeding':/fever|temperature|sick|vomit|unwell|cough/.test(t)?'unwell':'nd';};
const noteText=d=>Object.keys(TALK_LAB).filter(k=>d[k]).map(k=>TALK_LAB[k]+': '+d[k]).join('\n');
/* Health information (20 Nov 2026). Pip may answer a question with general information, and only by pointing to a page from a
   trusted Australian publisher. Every page below was opened and checked on 15 Nov 2026. `covers` says what the page is about and
   makes no clinical claim. Pip never writes health information itself: an answer in PaedsMe's own words needs a paediatrician to
   write it and sign it off first (docs/09-pip-health-information.md). */
const INFO=[
 {id:"sleep-baby",topic:"sleep",rx:/sleep|wak|night|settl|nap/,by:"The Royal Children's Hospital Melbourne",title:"Sleep problems \u2013 babies and toddlers",url:"https://www.rch.org.au/kidsinfo/fact_sheets/Sleep_problems_babies_and_toddlers/",covers:"Covers how baby and toddler sleep works, differences by age and ways to build sleep habits."},
 {id:"sleep-child",topic:"sleep",rx:/sleep|bedtime|night|nightmare/,by:"The Royal Children's Hospital Melbourne",title:"Sleep problems \u2013 children and teens",url:"https://www.rch.org.au/kidsinfo/fact_sheets/Sleep_problems_children_and_teens/",covers:"Covers sleep needs, bedtime routines, night-time worries and when to get help."},
 {id:"skin-eczema",topic:"skin",rx:/eczema|dry skin|itch/,by:"The Royal Children's Hospital Melbourne",title:"Eczema (atopic dermatitis)",url:"https://www.rch.org.au/kidsinfo/fact_sheets/Eczema/",covers:"Covers what eczema is, how it is managed and when to see a doctor."},
 {id:"skin-rash",topic:"skin",rx:/rash|spots|hives|skin/,by:"The Royal Children's Hospital Melbourne",title:"Rashes",url:"https://www.rch.org.au/kidsinfo/fact_sheets/Rashes/",covers:"Covers what rashes are, how they can look, care at home and when to get medical help."},
 {id:"feeding-breast",topic:"feeding",rx:/breast|latch|feeding|feeds?\b|bottle/,by:"Pregnancy, Birth and Baby",title:"Common breastfeeding problems",url:"https://www.pregnancybirthbaby.org.au/womens-health/postnatal-health/common-breastfeeding-problems",covers:"Covers common breastfeeding problems for parent and baby, and where to get help."},
 {id:"feeding-solids",topic:"feeding",rx:/solids|first foods?|wean/,by:"Pregnancy, Birth and Baby",title:"Introducing solid food",url:"https://www.pregnancybirthbaby.org.au/babies/feeding-and-nutrition/introducing-solid-food",covers:"Covers when and how to start solids, signs of readiness, first foods and textures."},
 {id:"feeding-fussy",topic:"feeding",rx:/fussy|picky|won'?t eat|refus|meals?\b|eating/,by:"Pregnancy, Birth and Baby",title:"Fussy eating in toddlers and children",url:"https://www.pregnancybirthbaby.org.au/children/feeding-and-nutrition/fussy-eaters",covers:"Covers what fussy eating is, ways to respond, new foods and when to get help."},
 {id:"dev-speech",topic:"nd",rx:/talk|speech|words|language|stutter/,by:"healthdirect",title:"Speech development in children",url:"https://www.healthdirect.gov.au/life-stages/babies-and-toddlers-health/speech-development-in-children",covers:"Covers how speech develops, how parents can support it and when to seek help."},
 {id:"dev-adhd",topic:"nd",rx:/adhd|attention|hyperactiv|focus|concentrat/,by:"The Royal Children's Hospital Melbourne",title:"Attention deficit hyperactivity disorder (ADHD)",url:"https://www.rch.org.au/kidsinfo/fact_sheets/Attention_deficit_hyperactivity_disorder_ADHD/",covers:"Covers what ADHD is, its traits, how it is identified and support at home."},
 {id:"dev-milestones",topic:"nd",rx:/milestone|development|crawl|walk|behind/,by:"healthdirect",title:"Developmental milestones in babies and children",url:"https://www.healthdirect.gov.au/life-stages/babies-and-toddlers-health/developmental-milestones",covers:"Covers what developmental milestones are, what they measure and when to see a doctor."},
 {id:"unwell-fever",topic:"unwell",rx:/fever|temperature/,by:"The Royal Children's Hospital Melbourne",title:"Fever in children",url:"https://www.rch.org.au/kidsinfo/fact_sheets/Fever_in_children/",covers:"Covers what fever is, taking a temperature, care at home and when to get help."},
 {id:"unwell-serious",topic:"unwell",rx:/sick|unwell|vomit|cough|lethargic|\bill\b/,by:"healthdirect",title:"Symptoms of serious illness in babies and children",url:"https://www.healthdirect.gov.au/symptoms/symptoms-of-serious-illness-in-babies-and-children",covers:"Covers when to call triple zero, illnesses needing urgent attention and when to see a doctor."}];
const INFO_CHECKED='15 Nov 2026';
const isQ=t=>/\?\s*$/.test(t)||/^\s*(how|what|why|when|should|is|are|can|could|does|do|will|who)\b/i.test(t)||ASKS.test(t);
const infoFor=t=>{t=String(t).toLowerCase();return INFO.filter(x=>x.rx.test(t)).slice(0,2);};
const infoCard=x=>`<a class="tinfo" href="${x.url}" target="_blank" rel="noopener"><span class="lab">${esc(x.by)}</span><b>${esc(x.title)}</b><span class="sub">${esc(x.covers)}</span><span class="more">Read it on ${x.url.split('/')[2].replace(/^www\./,'')} ${ARROW}</span></a>`;
const infoCards=ids=>`<div class="tinfos">${ids.map(id=>INFO.find(x=>x.id===id)).filter(Boolean).map(infoCard).join('')}<p class="foot">General information, not advice about your child. Not yet checked by our doctors.</p></div>`;
function talkSay(text,extra){state.talk.log.push(Object.assign({t:'pip',text},extra||{}));}
function talkAsk(){const T=state.talk,q=TALK_Q[T.step-1];if(q)talkSay(q[1],{chips:q[2],n:T.step});}
function talkSend(text){
  text=String(text||'').trim().slice(0,400);if(!text)return;const T=state.talk;
  T.log.forEach(m=>{delete m.chips;delete m.next;});T.log.push({t:'me',text});
  if(EMERG.test(text)){T.log.push({t:'alert',text:URGENT});return;}
  const mid=T.step>0&&T.step<=TALK_Q.length;
  if(isQ(text)&&(mid||text.length<120)){let hits=infoFor(text);if(!hits.length&&mid)hits=infoFor(T.draft.what||'');const tp=hits.length?hits[0].topic:'none';T.asked[tp]=(T.asked[tp]||0)+1;
    if(hits.length)talkSay('I can’t tell you about your own child. Here’s some general information from a trusted Australian source. A nurse can also talk with you now on 1800 022 222.',{info:hits.map(x=>x.id)});
    else talkSay(CANNOT+(mid?'':' Tell me what you’ve noticed.'));
    if(mid)talkAsk();else if(hits.length)talkSay('If you like, tell me what you’ve noticed and I’ll write it down for your GP.');
    return;}
  if(!mid){T.draft={what:text};T.step=1;talkSay('Thank you for telling me. Five quick questions, then I’ll write it down in your words.');talkAsk();return;}
  T.draft[TALK_Q[T.step-1][0]]=text;T.step++;
  if(T.step<=TALK_Q.length){talkAsk();return;}
  talkSay('Here’s what you told me.');T.log.push({t:'note',d:Object.assign({},T.draft),status:'pending'});
}
function talkSave(i){const T=state.talk,m=T.log[i];if(!m||m.t!=='note'||m.status!=='pending')return;
  m.status='done';const id='n'+(++T.seq);T.saved.unshift({id,date:TODAY,d:m.d});bump(talkTopic(m.d.what),'l');
  talkSay('Saved. Who would you like to take it to?',{next:id});}
function talkView(){
  const T=state.talk;
  if(!T.log.length)talkSay('Hi, I’m Pip. What’s worrying you about your child? Tell me in your own words. I’m not a doctor, so I can’t tell you what it is. I can help you get it down clearly for someone who can.',{chips:TALK_START});
  const lines=d=>Object.keys(TALK_LAB).filter(k=>d[k]).map(k=>`<div><dt>${TALK_LAB[k]}</dt><dd>${esc(d[k])}</dd></div>`).join('');
  const log=T.log.map((m,i)=>m.t==='note'
    ?`<div class="tnote"><span class="lab">Your note</span><dl>${lines(m.d)}</dl>${m.status==='pending'?`<div class="acts"><button type="button" class="primary" data-act="talk-save" data-i="${i}">Save this note</button><button type="button" data-act="talk-new">Start again</button></div>`:'<span class="chip good">Saved</span>'}</div>`
    :`<div class="tmsg ${m.t==='pip'?'bot':m.t}">${m.n?`<span class="tq">Question ${m.n} of ${TALK_Q.length}</span>`:''}${esc(m.text)}</div>${m.info?infoCards(m.info):''}${m.chips&&m.chips.length?`<div class="tchips">${m.chips.map(c=>`<button type="button" data-act="talk-chip">${esc(c)}</button>`).join('')}</div>`:''}${m.next?`<div class="tchips next"><button type="button" data-act="talk-gp" data-id="${m.next}">My GP</button><button type="button" data-act="talk-find" data-id="${m.next}">A paediatrician</button><button type="button" data-act="talk-nurse">A nurse, now</button><button type="button" data-act="talk-urgent" data-id="${m.next}">An urgent video call</button><button type="button" data-act="talk-info" data-id="${m.next}">Read about this</button><button type="button" data-act="talk-learn" data-id="${m.next}">Watch a short guide</button></div>`:''}`).join('');
  const saved=T.saved.length?`<ul class="tsaved">${T.saved.map(n=>`<li><details><summary><b>${esc(n.d.what.length>70?n.d.what.slice(0,67)+'...':n.d.what)}</b><span class="sub">${fmt(n.date)}${n.d.age?' · '+esc(n.d.age):''}</span></summary><dl>${lines(n.d)}</dl></details><div class="acts"><button type="button" data-act="talk-gp" data-id="${n.id}">Copy for my GP</button><button type="button" data-act="talk-find" data-id="${n.id}">Find care with this</button></div></li>`).join('')}</ul>`
    :'<p class="sub">Your saved notes will show here.</p>';
  return `<section class="band band-s"><div class="wrap"><div class="band-row"><div class="band-text"><span class="eyebrow">Pip · AI helper</span><h1>Tell Pip what is worrying you</h1><p class="lead">Pip listens and writes it down for you. Pip isn’t a doctor.</p></div></div></div>${sparks}</section>
  <section class="dash fam"><div class="wrap"><div class="talk">
    <section class="panel chat" aria-label="Conversation with Pip"><div class="chat-head">${PIP_SVG}<div><b>Pip</b><span class="sub">Here any time</span></div><button type="button" data-act="talk-new">New conversation</button></div>
     <div class="tlog" id="talk-log" role="log" aria-live="polite">${log}</div>
     <form class="tform" id="talk-form"><label class="sr" for="talk-input">Your message to Pip</label><input type="text" id="talk-input" maxlength="400" autocomplete="off" placeholder="Type it the way you would say it"><button class="primary" type="submit">Send</button></form></section>
    <div class="fcol">
     <section class="panel"><div class="row"><h2>Your notes</h2><span class="chip quiet">${T.saved.length} saved</span></div>${saved}<p class="foot">Stays on this device.</p></section>
     <section class="panel urgent"><h2>If it is urgent</h2><ul class="plain"><li><b>000</b> if your child is in danger</li><li><b>1800 022 222</b> healthdirect, a nurse at any hour</li><li><b>13 43 25 84</b> 13 HEALTH, in Queensland</li></ul><a class="btn primary" href="#urgent">Speak to a paediatrician by video</a><p class="foot">A fee applies for the video call.</p></section>
    </div></div></div></section>`;
}
function getApp(){
  const w=state.wait;
  const form=w.joined?`<div class="panel"><h2>You are on the list</h2><p>Thanks. We will tell you when the app is ready${w.platform?' for '+esc(w.platform):''}.</p><p class="foot">Demo only. Your email wasn’t saved.</p><div><button type="button" data-act="wait-reset">Add another person</button></div></div>`
   :`<form class="panel" id="wait-form" novalidate><h2>Tell me when it is ready</h2>
     <div class="field"><label for="wait-email">Email</label><input type="email" id="wait-email" autocomplete="email" maxlength="120" placeholder="you@example.com"></div>
     <div class="field"><span class="lab" id="wp-lab">Your phone</span><div class="cpills" role="group" aria-labelledby="wp-lab">${['iPhone','Android'].map((p,i)=>`<label class="cpill"><input type="radio" name="wplat" id="wp-${i}" value="${p}">${p}</label>`).join('')}</div></div>
     <div class="field"><span class="lab" id="wu-lab">What would you use it for most?</span><div class="cpills" role="group" aria-labelledby="wu-lab">${Object.keys(w.uses).map((u,i)=>`<label class="cpill"><input type="checkbox" name="wuse" id="wu-${i}" value="${u}">${u}</label>`).join('')}</div></div>
     <div><button class="primary cta" type="submit">Put me on the list</button></div>
     <p class="foot">Demo only. Nothing you type is saved or sent.</p></form>`;
  return `<section class="band"><div class="wrap band-2"><div class="band-text">
     <span class="eyebrow">The app</span>
     <h1>PaedsMe <em>on your phone</em></h1>
     <p class="lead">The app isn’t built yet. Join the list and we’ll tell you when it’s ready.</p></div>
    <div class="band-side">${form}</div></div>${sparks}</section>
  <section class="sec"><div class="wrap">${secHead('On your phone','What the app could do')}
   <div class="grid3">
    <div class="feat" style="--s:var(--accent-soft)"><span class="dot">${I.bottle}</span><h3>Log with one hand</h3><p>A feed or a nap in two taps, without opening a browser.</p></div>
    <div class="feat" style="--s:var(--orange-soft)"><span class="dot">${I.cam}</span><h3>Straight from your camera</h3><p>Add a photo or a video to a note the moment you take it.</p></div>
    <div class="feat" style="--s:var(--violet-soft)"><span class="dot">${I.cal}</span><h3>A nudge before the visit</h3><p>A reminder to send your notes a few days before each appointment.</p></div>
   </div>
   <div class="cta-row center"><a class="btn cta" href="#talk">Talk to Pip on the website</a></div></div></section>`;
}
/* Urgent video call (22 Nov 2026). When it cannot wait for a referral and it is not an emergency, a parent can ask for a
   paid video call with the clinical lead, who is a real paediatrician and is named at the founder's request. The fee is not
   set, so none is shown. The page leads with 000, the parent must tick that it is not an emergency, and urgent words in the
   description stop the request. Nothing is sent and no payment is taken. All wording is a draft for him to approve. */
const TELE={doctor:'Dr Harry Singh',short:'Dr Singh',role:'Paediatrician',fee:null};
const TELE_AGES=['Under 1','1 to 2','3 to 5','6 to 11','12 to 17'];
function urgentView(){
  const U=state.urgent,has=state.talk.saved.length>0,fee=TELE.fee?'About '+money(TELE.fee):'To be set';
  const card=U.sent?`<div class="panel"><span class="chip good">Request sent</span><h2>${TELE.short}'s team will send your video link</h2>
     <p>Keep your phone nearby, and have your notes, photos and videos open.</p>
     <p class="note"><b>If your child is in danger at any time, call 000.</b></p>
     <p class="foot">Demo only. Nothing was sent and nothing was charged.</p><div><button type="button" data-act="urg-reset">Start again</button></div></div>`
   :`<form class="panel" id="urgent-form" novalidate><h2>Ask for a video call</h2>
     <label class="check"><input type="checkbox" id="urg-ok"${U.ok?' checked':''}><span>This isn’t an emergency. If my child were in danger, I’d call 000.</span></label>
     <div class="field"><label for="urg-age">Your child's age</label><select id="urg-age">${opts([['','Choose'],...TELE_AGES],U.age)}</select></div>
     <div class="field"><label for="urg-what">What is happening, in your own words</label><textarea id="urg-what" maxlength="400" placeholder="Type it the way you would say it">${esc(U.what)}</textarea></div>
     ${has?`<label class="check"><input type="checkbox" id="urg-note"${U.note?' checked':''}><span>Send my latest note from Pip as well</span></label>`:''}
     <div class="feebox"><span class="lab">Fee</span><b>${fee}</b><span class="sub">You’ll see the fee before you pay. Medicare may not cover it without a GP referral.</span></div>
     <div><button class="primary cta" type="submit">Request a video call ${ARROW}</button></div>
     <p class="foot">Demo only. Nothing is sent and no payment is taken.</p></form>`;
  return `<section class="band"><div class="wrap band-2"><div class="band-text">
     <span class="eyebrow">Urgent video call</span>
     <h1>Need a paediatrician soon? <em>Talk by video</em></h1>
     <p class="lead">A video call with ${TELE.doctor}, paediatrician. For when it can’t wait, and it isn’t an emergency.</p>
     <p class="alarm"><b>In danger? Call 000 now.</b> A video call is not for emergencies.</p>
     <div class="docline"><span class="ava2" aria-hidden="true">HS</span><div><b>${TELE.doctor}</b><span class="sub">${TELE.role} · video call · a fee applies</span></div></div></div>
    <div class="band-side">${card}</div></div>${sparks}</section>
  <section class="sec"><div class="wrap">${secHead('How it works','Three steps to a video call')}
   <div class="grid3">
    <div class="feat" style="--s:var(--accent-soft)"><span class="num">1</span><h3>You ask</h3><p>Tell us what’s happening.</p></div>
    <div class="feat" style="--s:var(--orange-soft)"><span class="num">2</span><h3>You get a link</h3><p>${TELE.short}'s team sends a video link to your phone.</p></div>
    <div class="feat" style="--s:var(--lime-soft)"><span class="num">3</span><h3>You talk it through</h3><p>${TELE.short} talks with you and your child and makes a plan.</p></div>
   </div></div></section>
  <section class="sec alt"><div class="wrap">${secHead('Other help','Not sure this is right for you?')}
   <div class="grid3">
    <div class="wcard"><h3>000</h3><p class="sub">If your child is in danger.</p></div>
    <div class="wcard"><h3>1800 022 222</h3><p class="sub">healthdirect. A nurse answers at any hour. In Queensland, 13 HEALTH is 13 43 25 84.</p></div>
    <a class="wcard linkish" href="#talk"><h3>Talk it through</h3><p class="sub">Tell Pip what’s worrying you.</p><span class="more">Talk to Pip ${ARROW}</span></a>
   </div>
   <p class="foot disc">${TELE.doctor} is a real paediatrician. This page is a draft he has not yet approved. Other doctors on this site are made up.</p></div></section>`;
}
function findCare(){
  const q=state.q, m=match(q), id=reqKey(), k=state.kids[id]||{name:'another child'}, rq=state.req[id];
  const hints=[];
  if(!q.ref)hints.push('No referral yet? Pick a doctor and we’ll write the request for your GP.');
  if(q.concern==='behaviour')hints.push(q.age<17?'For ADHD, a paediatrician does the assessment and your GP does the regular visits after that.':'PaedsMe ADHD care is for children under 17.');
  else if(q.age>18)hints.push('For this concern, PaedsMe sees children and young people up to 18.');
  if(q.concern==='development'&&q.age<=8)hints.push('Thriving Kids supports children 8 and under with developmental needs, with no diagnosis required. A navigator can help you apply.');
  if(PARKED_ON&&q.concern==='seizures')hints.push('The paediatrician may order an EEG. It can be booked through PaedsMe Diagnostics at the same time.');
  if(PARKED_ON&&q.concern==='heart')hints.push('An ECG or Holter monitor can be booked through PaedsMe Diagnostics if the doctor orders one.');
  if(m.length&&!m.some(x=>x.c.rapid))hints.push('Rapid Access is not open for this yet. These clinicians have their usual wait.');
  const miss=[];
  if(m.length&&q.lang!=='Any'&&!m.some(x=>x.c.langs.includes(q.lang)))miss.push('speaks '+q.lang);
  if(m.length&&q.culture!=='Any'&&!m.some(x=>x.c.works.includes(q.culture)))miss.push('lists '+q.culture);
  if(miss.length)hints.push('None of these matches '+miss.join(' or ')+'. A navigator can search outside the network.');
  const sum=['Age '+q.age,label(q.concern),q.region];if(q.lang!=='Any')sum.push(q.lang);if(q.culture!=='Any')sum.push(q.culture);if(q.lived)sum.push('Lived experience');if(q.approach!=='Any')sum.push(q.approach==='Holistic'?'Holistic approach':'Mainstream medicine');
  return `<section class="band band-c"><div class="wrap"><div class="band-text">
    <span class="eyebrow">Find care</span>
    <h1>A paediatrician by video, <em>within 48 hours</em></h1>
    <p class="lead">Tell us what’s going on. We’ll match you with a paediatrician and write the request for your GP.</p>
    <div class="ask"><label class="sr" for="q-said">Tell us about your child</label>
     <textarea id="q-said" rows="3" maxlength="400" placeholder="${SAY[0][1]}">${esc(q.said)}</textarea>
     <div class="ask-bar"><button type="button" class="mic" data-act="listen" aria-pressed="${!!q.listening}">${I.mic}<span>${q.listening?'Listening. Tap to stop':'Speak'}</span></button><button type="button" class="primary cta" data-act="hear">Find matches ${ARROW}</button></div></div>
    ${q.heard.length?`<div class="heard"><span>We picked up</span>${q.heard.map(x=>`<span class="chip good">${esc(x)}</span>`).join('')}</div>`
     :`<div class="examples"><span>Try</span>${SAY.map((s,i)=>`<button type="button" class="ex" data-act="say" data-i="${i}">${s[0]}</button>`).join('')}</div>`}
   </div></div>${sparks}</section>
  <section class="sec" id="results"><div class="wrap duo">
   <form class="filter" id="find-form" aria-label="About your child"><details class="f-all" data-fold="find"${(typeof innerWidth==='number'&&innerWidth<=940)&&!state.fold.find?'':' open'}><summary><h2>About your child</h2><span class="sub">Age ${q.age} · ${esc(q.region)}</span></summary>
    <div class="field"><label for="q-who">Who is it for?</label><select id="q-who">${opts([...Object.entries(state.kids).map(([i,c])=>[i,c.name+', '+c.age]),['other','Another child']],id)}</select></div>
    <div class="two"><div class="field"><label for="q-age">Age</label><input type="number" id="q-age" min="0" max="18" value="${q.age}"></div>
    <div class="field"><label for="q-region">Where you live</label><select id="q-region">${opts(REGIONS,q.region)}</select></div></div>
    <div class="field"><label for="q-concern">Main concern</label><select id="q-concern">${opts(CONCERNS,q.concern)}</select></div>
    <details class="more-f" id="f-more"${q.more||q.approach!=='Any'||q.lang!=='Any'||q.culture!=='Any'||q.lived?' open':''}><summary>More choices</summary>
     <div class="field"><label for="q-approach">Approach</label><select id="q-approach">${opts([['Any','Any approach'],['Mainstream','Mainstream medicine'],['Holistic','Holistic approach']],q.approach)}</select></div>
    <div class="field"><label for="q-lang">Language</label><select id="q-lang">${opts([['Any','Any language'],...LANGS],q.lang)}</select></div>
    <div class="field"><label for="q-culture">Cultural fit</label><select id="q-culture">${opts([['Any','No preference'],...CULT],q.culture)}</select></div>
    <label class="check"><input type="checkbox" id="q-lived"${q.lived?' checked':''}><span>A clinician with lived experience</span></label>
    <label class="check"><input type="checkbox" id="q-tele"${q.tele?' checked':''}><span>Video consults are fine</span></label>
    </details>
     <label class="check"><input type="checkbox" id="q-ref"${q.ref?' checked':''}><span>We already have a GP referral</span></label>
     </details>
   </form>
   <div class="res">
    ${reqCard(id)}
    <div class="res-head"><h2>${plural(m.length,'match')}</h2><p class="sub">${sum.map(esc).join(' · ')}</p></div>
    ${hints.map(h=>`<p class="callout">${esc(h)}</p>`).join('')}
    ${m.length?`<ol class="docs">${m.map(({c,why},i)=>{const p=fees(c,q),mine=rq&&rq.name===c.name;return `<li class="doc${i===0?' top':''}" style="--s:var(--${TINT[i%5]}-soft)">
      <span class="ava2" aria-hidden="true">${ini(c.name)}</span>
      <div class="doc-main">${c.rapid?'<span class="tag">Rapid Access</span>':i===0?'<span class="tag alt">Top match</span>':''}<h3>${esc(c.name)}</h3><p class="sub">${esc(c.role)} · ${esc(c.region)} · ${c.holistic?'Holistic approach':'Mainstream medicine'}</p>
       <ul class="why">${why.filter(w=>!/^(About \d+ days|Rapid Access)/.test(w)).map(w=>`<li>${TICK}${esc(w)}</li>`).join('')}</ul></div>
      <div class="doc-side"><div class="wait">${c.rapid?'<b>48</b><span>hours to a video visit<br>after your referral</span>':`<b>${c.wait}</b><span>days to a first visit</span>`}</div>
       <p class="price">${p.adhd?'ADHD assessment visit, about $'+p.fee:'First visit $'+p.fee}<span>about $${p.gap} after Medicare</span></p>
       <button class="primary" data-act="book" data-name="${esc(c.name)}"${mine?' disabled':''}>${mine?'Requested':q.ref?'Send my referral':'Ask for a referral'}</button></div></li>`;}).join('')}</ol>`
     :`<div class="empty"><h3>No clinician in the network fits yet</h3><p>Allow video consults or any approach, or a navigator can search outside the network.</p></div>`}
    ${q.concern==='behaviour'?`<a class="linkcard" href="#adhd-care"><span><b>How ADHD care works, and what it costs</b><span class="sub">Three steps, shared between a paediatrician and your GP</span></span>${ARROW}</a>`:''}
    <p class="foot">Doctors can’t pay to appear higher. This request is for ${esc(k.name)}.</p>
   </div></div></section>
  <section class="sec alt"><div class="wrap">${secHead('How it works','Four steps to a plan','You need a GP referral first. We help you get it.')}
   <div class="grid4">
    <div class="feat" style="--s:var(--accent-soft)"><span class="num">1</span><h3>We match you</h3><p>Tell us about your child and we suggest doctors who fit.</p></div>
    <div class="feat" style="--s:var(--orange-soft)"><span class="num">2</span><h3>Your GP refers</h3><p>We write the request. Your GP writes the referral.</p></div>
    <div class="feat" style="--s:var(--violet-soft)"><span class="num">3</span><h3>Video visit in 48 hours</h3><p>A paediatrician sees you by video within 48 hours of the referral.</p></div>
    <div class="feat" style="--s:var(--lime-soft)"><span class="num">4</span><h3>A plan to follow</h3><p>The paediatrician makes the plan. Your GP looks after the rest, close to home.</p></div>
   </div>
   <div class="cta-row center"><a class="btn primary cta" href="#talk">Talk it through with Pip ${ARROW}</a></div></div></section>`;
}

const dxSite=r=>r==='Gold Coast'?'Hub, Southport':r==='Regional or remote'?'Home kit, posted to the family':'Spoke, '+r;
function gpView(){
  const g=state.gp, m=match({age:g.age,concern:g.concern,region:g.region,tele:g.tele}).slice(0,3), dx=g.need!=='consult';
  const RAIL=['PaedsMe has your open referral.','Matched on clinical fit, location and wait.','The family chooses and books. You are told who with.','The paediatrician reads the family\'s notes first.','The letter comes back to you.'];
  return `<section class="band"><div class="wrap band-2"><div class="band-text">
    <span class="eyebrow">For GPs</span>
    <h1>One open referral. We match, book and <em>write back</em></h1>
    <p class="lead">Send an open paediatric referral. PaedsMe matches the family, books them and sends the letter back to you.</p>
    <ul class="ticks"><li>${TICK}<span>Addressed "Dear Paediatrician". A referral to a private specialist does not need to name the doctor.</span></li>
     <li>${TICK}<span>The family chooses. You are told who they booked with.</span></li>
     <li>${TICK}<span>Urgent referrals are phoned through to the clinician the same day.</span></li></ul>
   </div>
   <div class="band-side"><form class="formcard" id="gp-form"><h2>Refer a child</h2>
    <div class="two"><div class="field"><label for="g-age">Patient age</label><input type="number" id="g-age" min="0" max="18" value="${g.age}"></div>
    <div class="field"><label for="g-region">Patient region</label><select id="g-region">${opts(REGIONS,g.region)}</select></div></div>
    <div class="field"><label for="g-need">What do you need?</label><select id="g-need">${opts([['consult','A paediatrician visit'],['eeg','Brain wave test (EEG)'],['ecg','Heart trace (ECG)']],g.need)}</select></div>
    <div class="field"><label for="g-concern">Reason for referral</label><select id="g-concern">${opts(CONCERNS,g.concern)}</select></div>
    <div class="two"><div class="field"><label for="g-urgency">Urgency</label><select id="g-urgency">${opts(['Routine','Soon','Urgent'],g.urgency)}</select></div>
    <div class="field"><label for="g-period">Referral period</label><select id="g-period">${opts(['12 months','Indefinite'],g.period)}</select></div></div>
    <label class="check"><input type="checkbox" id="g-tele"${g.tele?' checked':''}><span>Family accepts video consults</span></label>
    ${g.urgency==='Urgent'?'<p class="note">Urgent referrals are phoned through to the clinician the same day.</p>':''}
    <button class="primary cta" type="submit">Send open referral ${ARROW}</button>
    <div class="likely"><span class="lab">${dx?'Where it can be done':'Likely matches'}</span>
     ${dx?`<ul class="list"><li><div class="txt"><b>PaedsMe Diagnostics</b><div class="sub">${esc(dxSite(g.region))} · report to you within 5 working days</div></div><span class="chip">${g.need==='eeg'?'Neurology':'Cardiology'}</span></li></ul>${g.need==='eeg'&&g.concern==='seizures'?'<p class="note">For a first blackout, a heart trace is usually added. The hub will check.</p>':''}`
      :m.length?`<ul class="list">${m.map(({c})=>`<li><div class="txt"><b>${esc(c.name)}</b><div class="sub">${esc(c.role)} · ${esc(c.region)}</div></div><span class="chip">${c.wait} days</span></li>`).join('')}</ul>`:'<p class="sub">No network match. A navigator will search further and call your rooms.</p>'}
     <p class="foot">The family chooses. You are told who they booked with.</p></div>
   </form></div></div>${sparks}</section>
  <section class="sec alt"><div class="wrap">${secHead('After you send it','Where your referral goes')}
   <ol class="rail">${STEPS.map((s,i)=>`<li><span class="dot">${i+1}</span><b>${s}</b><p>${RAIL[i]}</p></li>`).join('')}</ol></div></section>
  <section class="sec"><div class="wrap">${secHead('Shared care with you','Children with ADHD who come back to you','The paediatrician\'s plan says what to check and when, and they review once a year. Draft model from the clinical lead. State prescribing rules still apply.')}
   <ul class="rows">${state.shared.map((s,i)=>{const od=days(s.gpDue)<0;return `<li class="rowcard"><span class="ava2" style="--s:var(--${TINT[i%5]}-soft)" aria-hidden="true">${s.c.replace(/\D/g,'')}</span>
     <div class="txt"><h3>${s.c} <span class="sub">${esc(s.g)}</span></h3><p class="sub">Plan by ${esc(s.paed)}${s.complex?' · more specialist visits':''}</p>
      <ul class="why"><li class="${od?'late':''}">${od?'Your review is overdue by '+(-days(s.gpDue))+' days':'Your review is due '+fmt(s.gpDue).slice(4,-5)}</li><li>Repeat script due ${fmt(s.script).slice(4,-5)}</li><li>Yearly review ${fmt(s.annual).slice(4)}</li></ul></div>
     <div class="acts"><button type="button" class="primary" data-act="sc-done" data-i="${i}">Review done</button><button type="button" data-act="sc-esc" data-i="${i}"${s.asked?' disabled':''}>${s.asked?'Video review asked for':'Ask for a video review'}</button></div></li>`;}).join('')}</ul></div></section>
  <section class="sec alt"><div class="wrap">${secHead('Your referrals','Every referral, and where it is up to')}
   <ul class="rows">${state.refs.map((r,i)=>`<li class="rowcard"><div class="txt"><h3>${r.id} <span class="sub">Child, ${r.age} y · ${esc(label(r.concern))} · ${r.urgency}</span></h3><p class="sub">${r.step>=2?'Booked with '+esc(r.to):'Matching in progress'}</p>
      <ol class="steps">${STEPS.map((s,j)=>`<li class="${j<=r.step?'done':''}">${s}</li>`).join('')}</ol></div>
     <div class="acts"><button data-act="ref-next" data-i="${i}"${r.step>=4?' disabled':''}>${r.step>=4?'Complete':'Advance (demo)'}</button></div></li>`).join('')}</ul></div></section>`;
}

function tmpl(t,f){const n=t.kid?state.kids[t.kid].name+"'s":"Your child's",nm=TINFO[t.type].name.toLowerCase();
  if(f==='Normal')return t.line==='Neurology'?`${n} ${nm} was normal. A normal test does not rule everything out, so we will talk about what it means at the next visit.`:`${n} ${nm} was normal.`;
  if(f==='Repeat needed')return 'The recording was not clear enough to read, so we would like to repeat it. This is nobody\'s fault.';
  return '';}
function studyDetail(t){
  const r=t.kid?record(t.kid):null,f=(state.drafts[t.id]||{}).finding||'Normal';
  const fam=r?`<div class="note"><b>From the family record:</b> ${plural(r.n.length,'note')} over ${plural(r.weeks,'week')}${r.vids?', '+plural(r.vids,'video'):''}.<ul class="plain" style="margin-top:6px">${r.n.slice(0,3).map(x=>`<li>${fmt(x.date).slice(4,-5)}, ${esc(x.cat)}: ${esc(x.text)}${x.video?' (video)':''}</li>`).join('')}</ul><div style="margin-top:8px"><b>${evName(t.kid)} each week, logged by the family</b>${chartTurns(t.kid)}</div></div>`:'<p class="sub">No family notes linked yet. The family is invited to the app when the test is booked.</p>';
  const flag=t.s===0&&t.flag?`<div class="note warnbox"><b>Check the reason.</b> ${esc(t.flag)}</div>`:'';
  const ecg=t.needEcg?(t.ecgAdded?'<p class="sub">Heart trace added to this request.</p>':`<div class="note warnbox"><b>No heart trace on file.</b> NICE guidance advises a 12-lead ECG after a first suspected seizure, because some heart conditions look like seizures.<div style="margin-top:8px"><button type="button" class="primary" data-act="add-ecg" data-id="${t.id}">Add a heart trace</button></div></div>`):'';
  let act='';
  if(t.s<5)act=`<div><button type="button" class="primary" data-act="study-next" data-id="${t.id}">Move to ${FLOW[t.s+1].toLowerCase()}</button></div>`;
  else if(t.s===5)act=`<form id="report-form"><div class="field"><label for="rep-finding">Finding</label><select id="rep-finding">${opts(['Normal','Abnormal','Repeat needed'],f)}</select></div>
      ${f==='Abnormal'?'<div class="note">Abnormal results are not sent as text. The family is told the result is ready, and the doctor goes through it with them. The full report goes to the referrer.</div>':`<div class="field"><label for="rep-plain">Note for the family, in plain words</label><textarea id="rep-plain" maxlength="400">${esc(tmpl(t,f))}</textarea></div>`}
      <div><button class="primary" type="submit">Release to family and referrer</button></div></form>`;
  else act=`<div class="note"><b>${esc(t.result.finding)}.</b> ${t.result.mode==='note'?'Family saw: '+esc(t.result.plain):'Held for a conversation with the family.'}</div>`;
  return `<section class="panel hero"><div class="row"><span class="lab">${t.id} · Child, ${t.age} y · ${t.line} · ${DOCS[t.line]}</span><button type="button" data-act="hub-close">Close</button></div>
    <div class="big">${esc(t.test)}</div><p><b>Reason:</b> ${esc(t.ind)} · ${esc(t.site)}</p>
    <ol class="steps">${FLOW.map((x,i)=>`<li class="${i<t.s?'done':i===t.s?'now':''}">${x}</li>`).join('')}</ol>
    ${flag}${ecg}${fam}${act}</section>`;
}
function hub(){
  const L=state.hubLine,st=state.studies.filter(x=>L==='All'||x.line===L),sel=state.studies.find(x=>x.id===state.hubSel);
  const open=st.filter(x=>x.s<6).length,rep=st.filter(x=>x.s===4||x.s===5).length,kits=st.filter(x=>x.site.startsWith('Home')&&x.s>=2&&x.s<5).length,done=st.filter(x=>x.s===6).length;
  const cnt=l=>state.studies.filter(x=>x.line===l&&x.s<6).length;
  const mod=(l,name,what,ico,tint)=>`<button type="button" class="mod" data-act="hub-line" data-l="${L===l?'All':l}" aria-pressed="${L===l}"><span class="ti" style="--s:var(--${tint}-soft)" aria-hidden="true">${ico}</span><span class="txt"><b>${name}</b><span class="sub">${what} · ${cnt(l)} open</span></span></button>`;
  return `<section class="band band-s"><div class="wrap"><div class="band-row"><div class="band-text">
     <span class="eyebrow">Diagnostics hub</span><h1>Electrophysiology hub</h1>
     <p class="lead">Brain and heart tests for children, from request to result. Recorded at a clinic or at home. Reported by specialists.</p></div>
    <div class="seg" role="group" aria-label="Service">${['All','Neurology','Cardiology'].map(x=>`<button type="button" data-act="hub-line" data-l="${x}" aria-pressed="${x===L}">${x}</button>`).join('')}</div></div></div>${sparks}</section>
  <section class="dash"><div class="wrap stack">
   <div class="kpis">${kpi('Open',open,'studies in progress')}${kpi('To report',rep,'recorded, waiting on a specialist')}${kpi('Home kits out',kits,'posted to families')}${kpi('Reported',done,'released to family and referrer')}</div>
   <div class="mods">${mod('Neurology','NeuroMe','Brain wave tests (EEG)',I.pulse,'violet')}${mod('Cardiology','CardiMe','Heart traces (ECG and Holter)',I.pulse,'orange')}</div>
   ${sel?studyDetail(sel):''}
   <section class="panel"><div class="row"><h2>Worklist</h2><span class="sub">${plural(st.length,'study')}${L==='All'?'':' in '+L.toLowerCase()}</span></div><div class="scroll"><table class="tbl"><thead><tr><th>Study</th><th>Patient</th><th>Test</th><th>Where</th><th>Waiting</th><th>Status</th><th aria-label="Open"></th></tr></thead><tbody>
    ${st.map(x=>`<tr class="${sel&&sel.id===x.id?'sel':''}"><td><b>${x.id}</b></td><td>Child, ${x.age} y${x.kid?' <span class="chip">App</span>':''}</td><td>${esc(x.test)}<div class="sub">${esc(x.ind)}</div>${x.s===0&&(x.flag||(x.needEcg&&!x.ecgAdded))?'<span class="chip crit">Needs triage</span>':''}</td><td>${esc(x.site)}</td><td>${days(TODAY,x.ref)} days</td>
     <td><span class="chip ${x.s===6?'good':x.s>=4?'warn':''}">${FLOW[x.s]}</span></td><td><button type="button" data-act="hub-open" data-id="${x.id}">${x.s===5?'Report':'Open'}</button></td></tr>`).join('')}
   </tbody></table></div></section>
   <section class="panel"><div class="row"><h2>Service standards</h2><span class="chip quiet">Draft, for the clinical lead to set</span></div><ul class="plain">
    <li>A specialist checks every request before it is booked.</li>
    <li>A 12-lead heart trace is considered with every first blackout or suspected seizure.</li>
    <li>EEG is not used to rule epilepsy out, and not for ADHD alone.</li>
    <li>Staff trained with children at every recording.</li>
    <li>Reports back within 5 working days.</li>
    <li>Abnormal results are talked through with the family, never sent as text.</li></ul>
    <p class="foot">Clinical points follow NICE guideline NG217 and Medicare guidance on EEG.</p></section>
  </div></section>`;
}

function parentSummary(){
  const r=record('mia'),sent=!!state.sent.mia,sl=state.sleep.mia;
  return `<section class="panel hero"><div class="row"><span class="lab">Parent notes · Child, 4 y · visit 3 Dec</span><span class="chip ${sent?'good':'warn'}">${sent?'Sent by parent':'Not sent yet'}</span></div>
    <div class="big">${plural(r.n.length,'note')} over ${plural(r.weeks,'week')}</div>
    <ul class="plain">${r.n.slice(0,4).map(x=>`<li><b>${esc(x.cat)}</b>, ${fmt(x.date)}: ${esc(x.text)}${x.video?' (video attached)':''}</li>`).join('')}</ul>
    <p class="sub">${plural(r.w.length,'new skill')}${sl!=null?' · sleep '+sl+' h':''} · ${plural(r.q.length,'question')}${r.q.length?': '+esc(r.q.join(' · ')):''}</p>
    <p class="foot">Written by the parent while waiting. Not scored. Read it before the visit.</p></section>`;
}
function carePanel(){
  return `<section class="panel"><h2>Ongoing care</h2><ul class="list">${Object.entries(state.kids).map(([id,k])=>{const r=record(id),ap=state.appts.filter(a=>a.kid===id).sort((a,b)=>a.date<b.date?-1:1)[0],open=state.studies.filter(x=>x.kid===id&&x.s<6).length;
    return `<li><div class="txt"><b>Child, ${ageLab(id)}</b> <span class="sub">${k.prog}</span><div class="sub">${plural(r.n.length,'note')}${todays(state.feeds[id]).length?' · '+plural(todays(state.feeds[id]).length,'feed')+' logged today':''}${state.rashes[id].length?' · '+plural(state.rashes[id].length,'rash entry'):''} · ${open?plural(open,'test')+' open':'all tests reported'}${id==='arjun'?' · medicine '+(state.todo.arjun[0][1]?'logged today':'not logged today'):''}</div></div><span class="chip quiet">${ap?'Next '+fmt(ap.date).slice(4,-5):'No visit booked'}</span></li>`;}).join('')}</ul>
    <p class="foot">Each row updates as the family logs and as tests move.</p></section>`;
}
function clinic(){
  const c=state.clinic, b=(key,txt,done)=>`<button data-act="send" data-key="${key}"${c.sent[key]?' disabled':''}>${c.sent[key]?done:txt}</button>`;
  const wq=state.forms.filter(f=>!(f.parent&&f.teacher)).length,od=c.recalls.filter(r=>days(r.due)<0).length;
  return `<section class="band band-s"><div class="wrap"><div class="band-row"><div class="band-text">
     <span class="eyebrow">For clinics</span><h1>Clinic tools</h1>
     <p class="lead">The parent's notes arrive before the visit. Recalls, referral renewals and freed slots keep follow-up patients on track.</p></div></div></div>${sparks}</section>
  <section class="dash"><div class="wrap stack">
   <div class="kpis">${kpi('Reviews due',c.recalls.length,od?od+' overdue, not booked':'not booked')}${kpi('Referrals expiring',c.expiring.length,'families and GPs to prompt')}${kpi('Freed slots',c.slots.length,'to offer to the waitlist')}${kpi('Questionnaires',wq,'first visits still waiting')}</div>
   <div class="cols" style="grid-template-columns:repeat(2,minmax(0,1fr))">${parentSummary()}${carePanel()}</div>
   <section class="panel"><div class="row"><h2>ADHD shared care</h2><span class="chip quiet">Draft model</span></div>
    <div class="cols3">
     <div><h3>Conners questionnaires before first visits</h3>
      <ul class="list">${state.forms.map((f,i)=>`<li><div class="txt"><b>${f.c}</b> <span class="sub">First visit ${fmt(f.visit).slice(4,-5)}</span><div class="sub">Parent form ${f.parent?'in':'waiting'} · teacher form ${f.teacher?'in':'waiting'}</div></div>${f.parent&&f.teacher?'<span class="chip good">Ready to read</span>':b('fm'+i,'Send a reminder','Reminder sent')}</li>`).join('')}</ul></div>
     <div><h3>Video reviews asked for by GPs</h3>
      ${state.escal.length?`<ul class="list">${state.escal.map((e,i)=>`<li><div class="txt"><b>${e.c}</b> <span class="sub">${esc(e.g)}</span><div class="sub">From ${esc(e.from)}, ${fmt(e.date).slice(4,-5)}. ${esc(e.why)}</div></div>${b('es'+i,'Offer a video time','Time offered')}</li>`).join('')}</ul>`:'<p class="sub">None waiting.</p>'}</div>
     <div><h3>Yearly reviews</h3>
      <ul class="list">${[...state.shared].sort((x,y)=>x.annual<y.annual?-1:1).map(s=>`<li><div class="txt"><b>${s.c}</b> <span class="sub">${esc(s.g)} · ${esc(s.paed)}</span><div class="sub">Due ${fmt(s.annual).slice(4)}, in ${days(s.annual)} days. Regular visits are with the GP.</div></div>${b('an'+s.id,'Send booking link','Link sent')}</li>`).join('')}</ul></div>
    </div>
    <p class="foot">Questionnaire answers arrive unscored. The clinician scores and reads them.</p></section>
   <div class="cols" style="grid-template-columns:repeat(2,minmax(0,1fr))">
    <section class="panel"><div class="row"><h2>Reviews due, not booked</h2><span class="chip warn">${c.recalls.length}</span></div><ul class="list">${c.recalls.map((r,i)=>`<li><div class="txt"><b>${r.c}</b> <span class="sub">${r.g}</span><div class="sub">${days(r.due)<0?'Overdue by '+(-days(r.due))+' days':'Due '+fmt(r.due)}</div></div>${b('rc'+i,'Send booking link','Link sent')}</li>`).join('')}</ul></section>
    <section class="panel"><div class="row"><h2>Referrals expiring</h2><span class="chip warn">${c.expiring.length}</span></div><ul class="list">${c.expiring.map((r,i)=>`<li><div class="txt"><b>${r.c}</b> <span class="sub">${r.g}</span><div class="sub">Expires ${fmt(r.until)}, in ${days(r.until)} days</div></div>${b('ex'+i,'Prompt family and GP','Prompt sent')}</li>`).join('')}</ul></section>
   </div>
   <div class="cols" style="grid-template-columns:repeat(2,minmax(0,1fr))">
    <section class="panel"><h2>Freed slots</h2><ul class="list">${c.slots.map((s,i)=>`<li><div class="txt"><b>${s.when}</b><div class="sub">Cancelled. ${s.wl} waitlist families could take it.</div></div>${b('sl'+i,'Offer to waitlist','Offered')}</li>`).join('')}</ul></section>
    <div class="stack">
     <section class="panel"><div class="row"><h2>Consults, last 90 days</h2><span class="sub">MBS items 110 and 132 against 116 and 133</span></div>
      <div class="split" role="img" aria-label="22 percent new consults, 78 percent reviews"><i style="width:22%"></i><i style="width:78%"></i></div>
      <div class="row"><span><b>22%</b> new · 84 consults</span><span><b>78%</b> reviews · 298 consults</span></div></section>
     <section class="panel"><div class="row"><h2>Price test</h2><span class="chip quiet">${state.planTaps} tap${state.planTaps===1?'':'s'}</span></div><p class="sub">Parents who tapped Start plan on Navigator at $39 a month.</p></section>
    </div></div>
  </div></section>`;
}
function careModel(){
  const m=state.cm,B=BANDS[0],paed=true,lead=B[3],n=m.gp,[f1,g1]=CARE.first,[f2,g2]=CARE.second,[fg,lo,hi]=CARE.gp;
  const total=f1+f2+n*fg,payLo=g1+g2+n*lo,payHi=g1+g2+n*hi,fd=m.forms,nf=(fd.parent?1:0)+(fd.teacher?1:0),pay=n?money(payLo)+' to '+money(payHi):money(payLo),an=/^a/.test(lead)?'an':'a';
  const step=(i,who,title,text,fee,chip)=>`<li style="--c:var(--${TINT[i]});--s:var(--${TINT[i]}-soft)"><span class="dot">${i+1}</span><span class="who">${who}</span><h3>${title}</h3><p>${text}</p>${chip?'<span class="chip">More specialist visits</span>':''}${fee&&paed?`<span class="fee">${fee}</span>`:''}</li>`;
  return `<section class="band"><div class="wrap band-2"><div class="band-text">
    <span class="eyebrow">ADHD care</span>
    <h1>ADHD care for children, shared with <em>your GP</em></h1>
    <p class="lead">A paediatrician does the assessment and makes the plan. Your GP does the regular visits, close to home.</p>
    <div class="ctrl"><span class="chip">For children under 17</span>
     <label class="check"><input type="checkbox" id="cm-complex"${m.complex?' checked':''}><span>Autism, epilepsy or Tourette's as well</span></label></div>
    <div class="cta-row"><button type="button" class="primary cta" data-act="cm-find">Find a paediatrician ${ARROW}</button>${PARKED_ON?'<a class="btn cta" href="#gp-referral">I am a GP</a>':''}</div>
   </div>
   <div class="band-side"><div class="fcard">
    <span class="lab">${B[1]}</span><p class="leads">${an==='an'?'An':'A'} ${lead} leads the care.</p>
    <ol class="mini"><li>Assessment and diagnosis</li><li>Regular visits with your GP</li><li>${m.complex?'Closer review':'Review twice a year'}</li></ol>
    <div class="divide"></div>
    ${paed?`<span class="lab">First year, out of pocket</span><div class="bignum">About ${pay}</div><p class="sub">With ${plural(n,'GP visit')}. A guide, not a quote.</p>`
     :`<p class="sub">Fees for care led by ${an} ${lead} are not set yet.</p>`}
   </div></div></div>${sparks}</section>
  <section class="sec"><div class="wrap">${secHead('How it works','Three steps')}
   <ol class="flow">
    ${step(0,B[2],'Assessment and diagnosis',(paed?'Two visits. You and the teacher fill in a short form first. ':'')+`The ${lead} does the assessment and writes the plan.`,'About '+money(f1)+', then about '+money(f2))}
    ${step(1,'Your GP','Regular visits','Your GP follows the plan: check-ins, repeat scripts and routine checks.','About '+money(fg)+' a visit')}
    ${step(2,B[2],m.complex?'Closer review':'Review twice a year',m.complex?`With autism, epilepsy or Tourette's, the ${lead} is involved more often than twice a year. The steps stay the same.`:`The ${lead} checks in twice a year, and sooner if something changes.`,'',m.complex)}
   </ol></div></section>
  ${paed?`<section class="sec alt"><div class="wrap">${secHead('What it costs','A guide to what you pay','After Medicare, with a GP referral. A guide, not a quote.')}
   <div class="grid2 eq">
    <div class="wcard"><div class="row"><h3 id="cm-gp-lab">GP visits in the first year</h3><div class="stepper" role="group" aria-labelledby="cm-gp-lab"><button type="button" data-act="cm-gp" data-d="-1" aria-label="One fewer GP visit"${n<=0?' disabled':''}>−</button><output aria-live="polite">${n}</output><button type="button" data-act="cm-gp" data-d="1" aria-label="One more GP visit"${n>=12?' disabled':''}>+</button></div></div>
     <div><span class="lab">First year, out of pocket</span><div class="bignum">About ${pay}</div><p class="sub">${money(total)} in fees before Medicare.</p></div>
     ${m.complex?'<p class="note">More specialist visits add to the cost. The paediatrician tells you how many at the first visit.</p>':''}
     <p class="foot">Two paediatrician visits, then ${plural(n,'GP visit')}. Review fees aren’t set yet.</p></div>
    <details class="wcard fold" data-fold="visits"${state.fold.visits?' open':''}><summary><h3>See each visit</h3></summary>
     <table class="cost"><thead><tr><th>Visit</th><th>Fee, about</th><th>You pay, about</th></tr></thead><tbody>
      <tr><td>Paediatrician, first visit</td><td>${money(f1)}</td><td>${money(g1)}</td></tr>
      <tr><td>Paediatrician, second visit</td><td>${money(f2)}</td><td>${money(g2)}</td></tr>
      <tr><td>GP visit, each</td><td>${money(fg)}</td><td>${money(lo)} to ${money(hi)}</td></tr></tbody></table>
     <div class="cmp"><span class="lab">The assessment, compared</span>
      <div class="ln"><span>With a paediatrician, two visits</span><b>about ${money(f1+f2)}</b><div class="bar"><i style="width:${Math.round(100*(f1+f2)/CARE.gpOnly)}%"></i></div></div>
      <div class="ln"><span>With a GP only, one long consult</span><b>about ${money(CARE.gpOnly)}</b><div class="bar"><i class="alt" style="width:100%"></i></div></div></div></details>
   </div></div></section>
  <section class="sec"><div class="wrap grid2 mid"><div>${secHead('Before the first visit','Two short forms','One for you and one for the teacher. The paediatrician reads them before you meet.')}</div>
    <div class="wcard"><div class="row"><h3>Questionnaire</h3><span class="chip ${nf===2?'good':''}">${nf} of 2 in</span></div>
     <ul class="list"><li><div class="txt"><b>Parent form</b><div class="sub">At home, on your phone</div></div><button type="button" data-act="cm-form" data-f="parent"${fd.parent?' disabled':''}>${fd.parent?'Done':'Fill in'}</button></li>
      <li><div class="txt"><b>Teacher form</b><div class="sub">We email a link to the school</div></div><button type="button" data-act="cm-form" data-f="teacher"${fd.teacher?' disabled':''}>${fd.teacher?'Sent':'Send to teacher'}</button></li></ul></div>
   </div></section>`:''}
  <section class="sec alt"><div class="wrap closer"><h2>Start with a GP referral</h2><p>See your GP for a referral, then we’ll match you with ${an} ${lead}.</p>
   <div class="cta-row center"><button type="button" class="primary cta" data-act="cm-find">Find a paediatrician ${ARROW}</button>${PARKED_ON?'<a class="btn cta" href="#gp-referral">I am a GP</a>':''}</div></div></section>`;
}
/* Team view: which of the five topic categories parents use. Counts only; no child or parent is identified. */
function teamView(){
  const rows=LEARN.map(t=>({t,s:state.stats[t.id],n:state.stats[t.id].v+state.stats[t.id].p+state.stats[t.id].l})).sort((a,b)=>b.n-a.n),mx=Math.max(1,...rows.map(r=>r.n)),tot=k=>rows.reduce((a,r)=>a+r.s[k],0);
  const w=state.wait,taps=Object.values(w.taps).reduce((a,b)=>a+b,0),use=Object.entries(w.uses).sort((a,b)=>b[1]-a[1])[0];
  return `<section class="band band-s"><div class="wrap"><div class="band-row"><div class="band-text">
     <span class="eyebrow">Team view</span><h1>What parents use</h1>
     <p class="lead">Five topic categories to start. This page counts opens, plays and logs for each one, so the team can see which parents use most.</p></div></div></div>${sparks}</section>
  <section class="dash"><div class="wrap stack">
   <div class="kpis">${kpi('Most used',rows[0].t.title,rows[0].n+' actions')}${kpi('Opens',tot('v'),'a topic opened')}${kpi('Plays',tot('p'),'a video or photo guide started')}${kpi('Logs',tot('l'),'entries saved by parents')}</div>
   <section class="panel"><div class="row"><h2>Engagement by category</h2><span class="chip quiet">Synthetic baseline, plus this session</span></div>
    <ul class="eng">${rows.map(r=>`<li><span class="ti" style="--s:var(--${TINT[LEARN.indexOf(r.t)%5]}-soft)" aria-hidden="true">${I[r.t.ico]}</span><div class="txt"><div class="row"><b>${r.t.full}</b><span class="sub">${r.s.v} opens · ${r.s.p} plays · ${r.s.l} logs</span></div><div class="bar"><i style="width:${Math.round(100*r.n/mx)}%"></i></div></div></li>`).join('')}</ul>
    <p class="foot">Counts only. No child, parent or note is identified.</p></section>
   <section class="panel"><div class="row"><h2>What parents ask Pip</h2><span class="chip quiet">Synthetic baseline, plus this session</span></div>
    <ul class="eng">${[...LEARN.map(t=>[t.full,state.talk.asked[t.id]||0,I[t.ico]]),['No trusted page yet',state.talk.asked.none||0,I.ask]].map((r,i,all)=>`<li><span class="ti" style="--s:var(--${TINT[i%5]}-soft)" aria-hidden="true">${r[2]}</span><div class="txt"><div class="row"><b>${r[0]}</b><span class="sub">${plural(r[1],'question')}</span></div><div class="bar"><i style="width:${Math.round(100*r[1]/Math.max(1,...all.map(x=>x[1])))}%"></i></div></div></li>`).join('')}</ul>
    <p class="foot">Counts by topic only. The questions themselves are not kept. The last row is where a signed-off answer is most needed.</p></section>
   <section class="panel"><div class="row"><h2>Urgent video calls</h2><span class="chip quiet">Synthetic baseline, plus this session</span></div>
    <div class="kpis flat">${kpi('Requests',state.urgent.count,'asked for a video call')}${kpi('Fee',TELE.fee?money(TELE.fee):'Not set','to be agreed')}${kpi('With',TELE.short,'the only clinician offered')}${kpi('Payments','None','the demo takes no money')}</div>
    <p class="foot">Counts only. What a parent types on the request is not kept. The hours, the wait and the fee need the clinical lead's decision.</p></section>
   <section class="panel"><div class="row"><h2>Demand for the app</h2><span class="chip quiet">Synthetic baseline, plus this session</span></div>
    <div class="kpis flat">${kpi('Site visits',w.visits.toLocaleString('en-AU'),'synthetic')}${kpi('Get the app taps',taps,Math.round(100*taps/w.visits)+'% of visits')}${kpi('Joined the list',w.joins,Math.round(100*w.joins/taps)+'% of taps')}${kpi('Most wanted',use[0],use[1]+' picks')}</div>
    <p class="sub">Taps by place: header ${w.taps.header}, home page ${w.taps.home}, Talk it through ${w.taps.talk}. Phones: iPhone ${w.plat.iPhone}, Android ${w.plat.Android}.</p>
    <p class="foot">The website comes first. The app is built only if these numbers say families want it. The pass mark is not set yet, and no email is kept in this prototype.</p></section>
   <div class="cols" style="grid-template-columns:repeat(2,minmax(0,1fr))">
    <section class="panel"><h2>How a referral moves</h2><ol class="plain"><li>The parent is matched and asks for a referral.</li><li>PaedsMe drafts the request. The GP writes the referral.</li><li>It reaches the clinic's practice manager by email, in one format for every clinic.</li><li>The clinic triages by hand. PaedsMe does not triage.</li><li>Rapid Access: a video visit within 48 hours, or in person if local.</li></ol>
     <p class="foot">One standard workflow. No per-clinic customisation.</p></section>
    <section class="panel"><div class="row"><h2>Parked for now</h2><span class="chip quiet">Can return later</span></div><ul class="plain"><li>GP referral screen</li><li>Diagnostics hub</li><li>Clinic tools</li><li>My family: the home logs, notes and care plan</li></ul>
     <div>${PARKED_ON?'<span class="chip good">Parked screens are showing</span>':'<a class="btn" href="?parked=1#clinic">Open with parked screens</a>'}</div></section>
   </div>
  </div></section>`;
}
/* Hero photos (24 Nov 2026). A page's band takes a photo behind its words once a file is listed here, for example
   {home:'img/hero-home.jpg'}. The list is empty until the photos exist, so nothing is requested and the aqua band shows. */
const HERO={};
const heroOk={};
function paintHero(){const v=view(),b=document.querySelector('#view .band');if(b&&heroOk[v]){b.classList.add('photo');b.style.setProperty('--hero','url("'+HERO[v]+'")');}}
function loadHeroes(){Object.keys(HERO).forEach(k=>{const im=new Image();im.onload=()=>{heroOk[k]=true;paintHero();};im.src=HERO[k];});}
const VIEWS={home,talk:talkView,urgent:urgentView,'find-care':findCare,'adhd-care':careModel,learn:learnView,'get-app':getApp,team:teamView,...(PARKED_ON?{family,'gp-referral':gpView,diagnostics:hub,clinic}:{})};
function render(){
  const v=VIEWS[location.hash.slice(1)]?location.hash.slice(1):'home';
  document.querySelectorAll('.tabs a').forEach(a=>{if(a.getAttribute('href')==='#'+v){a.setAttribute('aria-current','page');const n=a.parentElement;if(n&&n.scrollWidth>n.clientWidth)n.scrollLeft=a.offsetLeft-n.offsetLeft-(n.clientWidth-a.offsetWidth)/2;}else a.removeAttribute('aria-current');});
  if(!state.quick&&pending)pickMedia(null);
  const root=document.getElementById('view');document.body.dataset.view=v;root.classList.toggle('enter',render.last!==v);render.last=v;
  root.innerHTML=VIEWS[v]();
  const fam=v==='family';
  syncFab();paintHero();
  if(v==='talk'){const l=$('talk-log');if(l)l.scrollTop=l.scrollHeight;if(render.focusTalk){render.focusTalk=false;const ti=$('talk-input');if(ti){ti.focus({preventScroll:true});if(ti.scrollIntoView)ti.scrollIntoView({block:'nearest'});}}}
  if(fam&&state.quick){const q=$('quick-input');if(q)q.focus();}
}
function syncFab(){$('pip-open').hidden=!$('pip').hidden;}
let tt;function toast(m){const t=document.getElementById('toast');t.textContent=m;t.hidden=false;clearTimeout(tt);tt=setTimeout(()=>t.hidden=true,3200);}

document.addEventListener('click',e=>{
  if(e.target.closest('a.logo')&&view()==='home')window.scrollTo(0,0);
  const cta=e.target.closest('[data-cta]');if(cta&&state.wait.taps[cta.dataset.cta]!=null)state.wait.taps[cta.dataset.cta]++;
  const b=e.target.closest('[data-act]');if(!b)return;const a=b.dataset.act;
  if(a==='pip-chip'){send(b.textContent);return;}
  if(a==='pip-confirm'||a==='pip-cancel'){const m=pip.log[+b.dataset.i];if(m&&m.status==='pending'){if(a==='pip-confirm'){perform(m.a);m.status='done';}else m.status='cancelled';}renderPip();render();return;}
  if(a==='pip-open'){openPip(true);return;}
  if(a==='kid-go'){state.child=b.dataset.id;state.ftab='today';state.quick=null;window.scrollTo(0,0);render();return;}
  if(a==='chart'){state.chart[state.child]=b.dataset.c;render();return;}
  if(a==='listen'){listen();return;}
  if(a==='media-clear'){pickMedia(null);const s=$('mslot');if(s)s.innerHTML=mediaSlot(s.dataset.label,s.dataset.accept);return;}
  if(a==='cm-find'){const B=BANDS[0];Object.assign(state.q,{concern:'behaviour',age:B[4],heard:[]});location.hash='find-care';return;}
  if(a==='kid'){state.child=b.dataset.id;state.quick=null;state.prepOpen=false;}
  else if(a==='ftab'){state.ftab=b.dataset.tab;state.quick=null;window.scrollTo(0,0);}
  else if(a==='jdone'){state.jdone[b.dataset.k]=true;state.jOpen=true;toast('Marked as done');}
  else if(a==='jbook'){toast('Request sent to your GP or child health nurse');return;}
  else if(a==='hub-line'){state.hubLine=b.dataset.l;}
  else if(a==='hub-open'){state.hubSel=b.dataset.id;window.scrollTo(0,0);}
  else if(a==='hub-close'){state.hubSel=null;}
  else if(a==='add-ecg'){const t=state.studies.find(x=>x.id===b.dataset.id);t.ecgAdded=true;state.studies.push({id:'S-'+(1048+state.studies.length),age:t.age,type:'ecg',test:'Resting ECG, 12-lead',line:'Cardiology',site:t.site,ref:TODAY,s:1,ind:'Added at triage with '+t.id+': '+t.ind});toast('Heart trace added to the worklist');}
  else if(a==='felt'){const id=state.child;state.notes[id].unshift({date:TODAY,cat:'Felt something',text:'Tapped the button at '+new Date().toLocaleTimeString([],{hour:'numeric',minute:'2-digit'}),video:false});state.sent[id]=false;toast('Got it. Saved with the time.');}
  else if(a==='share-plan'){toast('Plan shared as a one-page letter');return;}
  else if(a==='family-support'){toast('A care navigator will call you');return;}
  else if(a==='send-rec'){state.sent[state.child]=true;toast('Sent to '+state.kids[state.child].doc);}
  else if(a==='quick-jump'){state.ftab='today';state.quick=b.dataset.kind;state.quickCat=b.dataset.cat||null;window.scrollTo(0,0);if(view()!=='family'){location.hash='family';return;}}
  else if(a==='plan'){state.plan=true;state.planTaps++;toast('Thanks. This is a price test, nothing was charged.');}
  else if(a==='quick-open'){state.quick=state.quick===b.dataset.kind?null:b.dataset.kind;state.quickCat=null;}
  else if(a==='quick-toggle'){state.did[state.child]=!state.did[state.child];toast(state.did[state.child]?'Nice work!':'Removed');}
  else if(a==='resched'){toast('Reschedule request sent for '+b.dataset.what);return;}
  else if(a==='renew'){state.renew[state.child]=true;toast('Renewal request sent to the GP');}
  else if(a==='hear'||a==='say'){hear(a==='say'?SAY[+b.dataset.i][1]:$('q-said').value);render();toResults();return;}
  else if(a==='learn-open'){presStop();state.learnOpen=b.dataset.id;state.playing=null;bump(b.dataset.id,'v');}
  else if(a==='play'){const pid=b.dataset.ep,on=state.playing===pid;presStop();state.playing=on?null:pid;if(!on)bump(pid.split('-')[0],'p');
    if(!on&&presIs(pid)){Object.assign(state.pres,{i:0,on:true,done:false});render();presStep();const w=$('pres');if(w&&w.scrollIntoView)w.scrollIntoView({block:'nearest',behavior:'smooth'});return;}}
  else if(a==='pres-toggle'){const P=state.pres;if(P.done)Object.assign(P,{i:0,on:true,done:false});else P.on=!P.on;render();if(P.on)presStep();else presStop();return;}
  else if(a==='pres-sound'){state.pres.sound=!state.pres.sound;render();if(state.pres.on)presStep();return;}
  else if(a==='pres-text'){state.pres.text=!state.pres.text;}
  else if(a==='pres-close'){presStop();state.playing=null;}
  else if(a==='learn-chart'){state.chart[state.child]='height';state.ftab='notes';window.scrollTo(0,0);if(view()!=='family'){location.hash='family';return;}}
  else if(a==='cm-gp'){state.cm.gp=Math.min(12,Math.max(0,state.cm.gp+(+b.dataset.d)));}
  else if(a==='cm-form'){state.cm.forms[b.dataset.f]=true;toast(b.dataset.f==='parent'?'Saved. The paediatrician sees your answers before the visit.':'Link sent to the school');}
  else if(a==='sc-done'){const s=state.shared[+b.dataset.i];s.gpDue=addDays(TODAY,s.every);s.script=addDays(TODAY,s.every);toast('Visit summary sent to '+s.paed);}
  else if(a==='sc-esc'){const s=state.shared[+b.dataset.i];s.asked=true;state.escal.push({c:s.c,g:s.g,from:'Dr R. Mehta, GP',date:TODAY,why:'Asked for a review before the yearly date.'});toast('Sent. '+s.paed+' will offer a video time.');}
  else if(a==='talk-chip'){talkSend(b.textContent);render.focusTalk=true;}
  else if(a==='talk-save'){talkSave(+b.dataset.i);}
  else if(a==='talk-new'){Object.assign(state.talk,{log:[],step:0,draft:{}});}
  else if(a==='talk-nurse'){state.talk.log.forEach(m=>{delete m.next;});talkSay('healthdirect is 1800 022 222, at any hour, and a nurse answers. In Queensland you can also call 13 HEALTH on 13 43 25 84. If your child is in danger, call 000.');}
  else if(a==='talk-gp'){const n=state.talk.saved.find(x=>x.id===b.dataset.id);if(!n)return;const t='For my GP, from a parent\n'+noteText(n.d);(navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(()=>toast('Copied. Paste it into a message, or show it at the visit.'),()=>toast('Open the note under Your notes and show it at the visit.'));
    if(state.talk.log.some(m=>m.next)){state.talk.log.forEach(m=>{delete m.next;});talkSay('Copied for your GP. Paste it into a message or show it at the visit. If you would like a paediatrician, your GP writes the referral.');}}
  else if(a==='talk-find'){const n=state.talk.saved.find(x=>x.id===b.dataset.id);if(!n)return;hear(n.d.what+(TALK_AGE[n.d.age]==null&&n.d.age?'. '+n.d.age:''));if(TALK_AGE[n.d.age]!=null)state.q.age=TALK_AGE[n.d.age];state.q.who='other';location.hash='find-care';return;}
  else if(a==='talk-urgent'){const n=state.talk.saved.find(x=>x.id===b.dataset.id);if(n)Object.assign(state.urgent,{what:n.d.what,age:TELE_AGES.includes(n.d.age)?n.d.age:'',note:true,sent:false});location.hash='urgent';return;}
  else if(a==='urg-reset'){Object.assign(state.urgent,{ok:false,age:'',what:'',note:false,sent:false});}
  else if(a==='talk-info'){const n=state.talk.saved.find(x=>x.id===b.dataset.id),hits=n?infoFor(n.d.what):[];state.talk.log.forEach(m=>{delete m.next;});
    if(hits.length)talkSay('Here is general information from a trusted Australian source. It is not about your child, and your GP or a nurse can tell you more.',{info:hits.map(x=>x.id)});else talkSay('I do not have a trusted page on that yet. A nurse can talk it through with you on 1800 022 222.');}
  else if(a==='talk-learn'){const n=state.talk.saved.find(x=>x.id===b.dataset.id);state.learnOpen=talkTopic(n?n.d.what:'');state.playing=null;location.hash='learn';return;}
  else if(a==='wait-reset'){state.wait.joined=false;}
  else if(a==='survey'){toast('The parent survey is not open yet. The link will sit here.');return;}
  else if(a==='book'){book(b.dataset.name);}
  else if(a==='req-share'){const r=state.req[b.dataset.id];if(r&&r.step===0){r.step=1;toast('Sent to Dr R. Mehta, GP');}}
  else if(a==='req-next'){const rid=b.dataset.id,r=state.req[rid];if(r&&r.step<3){r.step++;if(r.step===3){const c=CLINICIANS.find(x=>x.name===r.name),d=addDays(TODAY,c.rapid?2:c.wait);r.date=d;
      if(state.kids[rid])state.appts.push({kid:rid,date:d,time:'10:00 am',what:'First visit, '+c.role.toLowerCase(),who:c.name,mode:c.rapid||c.region!==state.q.region?'Video':'In person',prep:['Add notes, photos and videos this week','Write down your questions']});toast('Visit booked for '+fmt(d));}}}
  else if(a==='ref-next'){const r=state.refs[+b.dataset.i];r.step++;toast(r.id+': '+STEPS[r.step].toLowerCase());}
  else if(a==='study-next'){const t=state.studies.find(x=>x.id===b.dataset.id);if(t&&t.s<5){t.s++;toast(t.id+' moved to '+FLOW[t.s].toLowerCase());}}
  else if(a==='send'){state.clinic.sent[b.dataset.key]=true;toast('Sent');}
  render();
});
document.addEventListener('change',e=>{
  const t=e.target;
  if(t.dataset.todo){const td=state.todo[state.child];td[+t.dataset.todo][1]=t.checked;if(td.every(x=>x[1]))toast('All done. Great day!');render();return;}
  if(t.id==='rep-finding'){state.drafts[state.hubSel]={finding:t.value};render();return;}
  if(t.dataset.prep){state.prepDone[t.dataset.prep]=t.checked;state.prepOpen=true;render();return;}
  if(t.dataset.ms){state.milestones[+t.dataset.ms][1]=t.checked;render();return;}
  if(t.id==='media-file'){pickMedia(t.files[0]);const s=$('mslot');if(s)s.innerHTML=mediaSlot(s.dataset.label,s.dataset.accept);return;}
  if(t.id==='urg-ok'){state.urgent.ok=t.checked;return;}
  if(t.id==='urg-age'){state.urgent.age=t.value;return;}
  if(t.id==='urg-what'){state.urgent.what=t.value.slice(0,400);return;}
  if(t.id==='urg-note'){state.urgent.note=t.checked;return;}
  if(t.id==='cm-complex'){state.cm.complex=t.checked;render();return;}
  if(t.name==='ftype'){state.feedType=t.value;render();return;}
  if(t.id==='q-said'){state.q.said=t.value;return;}
  const num=(v,mx=18)=>Math.min(mx,Math.max(0,parseInt(v,10)||0));
  if(t.id==='q-who'){const q=state.q;if(t.value==='other')q.who='other';else{state.child=t.value;q.who='child';q.age=AGE[t.value];}q.heard=[];render();return;}
  if(t.closest('#find-form')){const q=state.q,g=i=>document.getElementById(i);q.said=g('q-said').value;q.age=num(g('q-age').value);q.region=g('q-region').value;q.concern=g('q-concern').value;q.lang=g('q-lang').value;q.approach=g('q-approach').value;q.culture=g('q-culture').value;q.lived=g('q-lived').checked;q.tele=g('q-tele').checked;q.ref=g('q-ref').checked;if(q.who==='child'&&q.age!==AGE[state.child])q.who='other';q.heard=[];render();}
  if(t.closest('#gp-form')){const g=state.gp;g.age=num(document.getElementById('g-age').value);g.region=document.getElementById('g-region').value;g.concern=document.getElementById('g-concern').value;g.urgency=document.getElementById('g-urgency').value;g.period=document.getElementById('g-period').value;g.tele=document.getElementById('g-tele').checked;g.need=document.getElementById('g-need').value;render();}
});
document.addEventListener('submit',e=>{
  e.preventDefault();
  if(e.target.id==='chart-form'){const id=state.child,c=state.chart[id]==='height'&&GROW[id]?'height':'sleep',v=parseFloat($('chart-val').value);
    if(!(v>0)){toast('Type a number first');return;}
    if(c==='sleep')state.sleep[id]=Math.min(16,v);
    else{if(v<40||v>210){toast('Height is in centimetres, for example 103');return;}const h=state.heights[id],a=GROW[id].age;if(h[h.length-1][0]===a)h[h.length-1][1]=v;else h.push([a,v]);}
    toast('Plotted');render();return;}
  if(e.target.id==='report-form'){const t=state.studies.find(x=>x.id===state.hubSel),f=$('rep-finding').value,mode=f==='Abnormal'?'discuss':'note',pl=mode==='note'?$('rep-plain').value.trim():'';
    if(mode==='note'&&!pl){toast('Write a note for the family first');return;}
    t.result={finding:f,mode,plain:pl,date:TODAY};t.s=6;toast('Released to the family and the referrer');render();return;}
  if(e.target.id==='quick-form'){const v=$('quick-input').value.trim(),id=state.child;if(!v){toast('Add something first');return;}
    const now=new Date(),stamp={date:TODAY,m:now.getHours()*60+now.getMinutes(),time:now.toLocaleTimeString([],{hour:'numeric',minute:'2-digit'}).toLowerCase()},pick=n=>(document.querySelector('input[name="'+n+'"]:checked')||{}).value,doc=state.kids[id].doc;
    if(state.quick==='sleep'){const h=Math.min(16,Math.max(0,parseFloat(v)||0)),nap=pick('skind')==='Nap';if(nap)state.naps[id].unshift({...stamp,h});else state.sleep[id]=h;state.sent[id]=false;bump('sleep','l');toast(nap?'Nap logged':'Sleep logged');}
    else if(state.quick==='feed'){const ft=feedType(id),side=pick('fside')||'Both',n=parseFloat(v)||0;
      if((ft==='Breast'||ft==='Bottle')&&!(n>0)){toast('Type a number first');return;}
      state.feeds[id].unshift({...stamp,type:ft,detail:ft==='Breast'?(side==='Both'?'Both sides':side+' side')+', '+n+' min':ft==='Bottle'?n+' mL':v.slice(0,140)});state.sent[id]=false;bump('feeding','l');toast('Saved for '+doc);}
    else if(state.quick==='rash'){const where=[...document.querySelectorAll('input[name="rwhere"]:checked')].map(x=>x.value);if(!where.length){toast('Tap where it is first');return;}
      const mid=keepMedia();state.rashes[id].unshift({...stamp,where,text:v.slice(0,140),photo:!!mid,media:mid});state.sent[id]=false;bump('skin','l');toast('Saved for '+doc);}
    else if(state.quick==='note'){const c=document.querySelector('input[name="cat"]:checked');const mid=keepMedia(),mk=mid?MEDIA[mid].kind:'';state.notes[id].unshift({date:TODAY,cat:c?c.value:'Behaviour',text:v,video:mk==='video',photo:mk==='photo',media:mid});state.sent[id]=false;bump('nd','l');toast('Saved for '+state.kids[id].doc);}
    else if(state.quick==='win'){state.wins[id].unshift(v);toast('Great!');}
    else{state.questions[id].push(v);toast('Saved for the visit');}
    state.quick=null;render();return;}
  if(e.target.id==='urgent-form'){const U=state.urgent;U.ok=$('urg-ok').checked;U.age=$('urg-age').value;U.what=$('urg-what').value.trim().slice(0,400);const nt=$('urg-note');U.note=!!(nt&&nt.checked);
    if(EMERG.test(U.what)){toast('If your child is in danger, call 000 now. A video call is not for emergencies.');return;}
    if(!U.ok){toast('Tick the first box. This page is not for emergencies.');return;}
    if(!U.age){toast('Choose your child\'s age');return;}
    if(!U.what){toast('Say what is happening first');return;}
    U.sent=true;U.count++;toast('Request sent. This is a demo, so nothing was charged.');window.scrollTo(0,0);render();return;}
  if(e.target.id==='talk-form'){const v=$('talk-input').value;if(!v.trim()){toast('Type a few words first');return;}talkSend(v);render.focusTalk=true;render();return;}
  if(e.target.id==='wait-form'){const em=$('wait-email').value.trim(),w=state.wait;if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)){toast('Type your email first');return;}
    w.joined=true;w.joins++;w.platform=(document.querySelector('input[name="wplat"]:checked')||{}).value||null;if(w.platform)w.plat[w.platform]++;
    document.querySelectorAll('input[name="wuse"]:checked').forEach(x=>{if(w.uses[x.value]!=null)w.uses[x.value]++;});toast('Thanks. You are on the list.');render();return;}
  if(e.target.id==='ask-form'){const v=$('ask-input').value.trim();if(!v){toast('Type a question first');return;}if(EMERG.test(v)){toast('If a child is in danger, call 000 now.');return;}state.asked.push(v.slice(0,140));toast('Sent. The team picks questions for the next Q&A.');render();return;}
  if(e.target.id==='pip-form'){const i=$('pip-input'),v=i.value;i.value='';send(v);return;}
  if(e.target.id==='event-form'){const v=document.getElementById('event-note').value.trim();if(!v){toast('Write what happened first');return;}state.events.unshift({date:TODAY,note:v});toast('Added to the diary');render();}
  if(e.target.id==='gp-form'){const g=state.gp,m=match({age:g.age,concern:g.concern,region:g.region,tele:g.tele})[0],id='R-'+(2042+state.refs.length),dx=g.need!=='consult';
    if(dx)state.studies.push({id:'S-'+(1048+state.studies.length),age:g.age,type:g.need,test:g.need==='eeg'?'Routine EEG':'Resting ECG, 12-lead',line:g.need==='eeg'?'Neurology':'Cardiology',site:dxSite(g.region),ref:TODAY,s:0,ind:label(g.concern)+' (GP referral '+id+')',needEcg:g.need==='eeg'&&g.concern==='seizures'});
    state.refs.unshift({id,age:g.age,concern:g.concern,urgency:g.urgency,to:dx?'PaedsMe Diagnostics':m?m.c.name:'a navigator-found clinician',step:0});toast(id+' received by PaedsMe');render();}
});

/* ---------- Pip: the support agent. It reads app state, calls page tools, and every change waits on a confirm card. ---------- */
const $=id=>document.getElementById(id);
const AGE={mia:4,arjun:9,zoe:13,ivy:0};
const pip={live:false,sample:null,tts:null,voice:false,busy:false,ctl:null,log:[],turns:[],greeted:false};
const role=()=>{const v=location.hash.slice(1);return v==='gp-referral'?'gp':(v==='diagnostics'||v==='clinic')?'staff':'parent';};
const ROLE={
 parent:{who:'Helping a parent or carer',about:'a parent or carer using the PaedsMe website',chips:['Talk it through','Find a specialist','Next visit?','Talk to a person']},
 gp:{who:'Helping a referring GP',about:'a GP using the referral portal',chips:['Where are my referrals up to?','Who is due a review?','Does the referral need a named doctor?','Talk to a person']},
 staff:{who:'Helping clinic and hub staff',about:'clinic or diagnostics hub staff',chips:['Which reviews are overdue?','Prompt families with expiring referrals','What is waiting for a report?']}};
const EMERG=/\b(000|emergency|not breathing|stopped breathing|isn'?t breathing|struggling to breathe|choking|not responding|can'?t breathe|cannot breathe|unconscious|unresponsive|turning blue|won'?t wake|overdose|suicid|seizure (that )?(won'?t|will not|isn'?t|is not) stop)/i;
const KINDS={book:'parent',reschedule:'parent',renew_referral:'parent',note:'parent',send_recalls:'staff',send_renewal_prompts:'staff',navigator_callback:'any'};

function book(name){const c=CLINICIANS.find(x=>x.name===name);if(!c)return;const id=reqKey();
  state.req[id]={name:c.name,step:state.q.ref?2:0,concern:state.q.concern,age:state.q.age,said:state.q.said||''};
  toast(state.q.ref?'Your referral is on its way to the clinic':'Request ready. Next: your GP.');}
const kidAppts=()=>state.appts.filter(a=>a.kid===state.child).sort((a,b)=>a.date<b.date?-1:1);

function describe(a){const k=state.kids[state.child];
  if(a.kind==='book'){const c=CLINICIANS.find(x=>x.name===a.name);const p=fees(c,state.q);return{title:'Ask for a referral to '+c.name,detail:`${c.role}, for ${k.name}. ${c.rapid?'Rapid Access: a video visit within 48 hours of the referral.':'About '+c.wait+' days to a first visit.'} The request goes to your GP first. ${p.adhd?'About $':'$'}${p.fee}, about $${p.gap} out of pocket.`};}
  if(a.kind==='reschedule')return{title:'Ask to reschedule',detail:`${a.what}, currently ${fmt(a.date)}. The clinic replies with new times.`};
  if(a.kind==='renew_referral')return{title:'Ask the GP to renew the referral',detail:`${k.name}'s referral ends ${fmt(k.refUntil)}.`};
  if(a.kind==='note')return{title:'Add a note for '+k.doc,detail:a.note};
  if(a.kind==='send_recalls')return{title:'Send booking links',detail:`${state.clinic.recalls.length} families with a review due.`};
  if(a.kind==='send_renewal_prompts')return{title:'Prompt families and GPs',detail:`${state.clinic.expiring.length} referrals close to expiring.`};
  return{title:'Request a call from a care navigator',detail:a.note||'A person from the PaedsMe team calls back.'};
}
function propose(a){
  const need=KINDS[a.kind];if(!need)throw new Error('Unknown kind of action.');
  if(need!=='any'&&need!==role())throw new Error('That action is not available on this screen.');
  if(a.kind==='book'&&!CLINICIANS.some(c=>c.name===a.name))throw new Error('Unknown clinician. Search the network first and use a returned name.');
  if(a.kind==='reschedule'){const ap=kidAppts(),w=String(a.appointment||'').toLowerCase(),hit=ap.find(x=>w&&x.what.toLowerCase().includes(w))||ap[0];if(!hit)throw new Error('There are no appointments to move.');a.what=hit.what;a.date=hit.date;}
  if(a.kind==='note'){a.note=String(a.note||'').trim().slice(0,140);if(!a.note)throw new Error('A note is needed: what the parent noticed, in their words.');}
  if(a.kind==='navigator_callback')a.note=String(a.note||'').trim().slice(0,140);
  const d=describe(a);pip.log.push({t:'card',a,title:d.title,detail:d.detail,status:'pending'});
  return 'Confirm card shown: "'+d.title+'". Nothing has changed yet. The user must tap Confirm.';
}
function perform(a){
  if(a.kind==='book')book(a.name);
  else if(a.kind==='reschedule')toast('Reschedule request sent for '+a.what);
  else if(a.kind==='renew_referral'){state.renew[state.child]=true;toast('Renewal request sent to the GP');}
  else if(a.kind==='note'){state.notes[state.child].unshift({date:TODAY,cat:state.kids[state.child].dcat,text:a.note,video:false});state.sent[state.child]=false;toast('Saved for '+state.kids[state.child].doc);}
  else if(a.kind==='send_recalls'){state.clinic.recalls.forEach((_,i)=>{state.clinic.sent['rc'+i]=true;});toast('Booking links sent');}
  else if(a.kind==='send_renewal_prompts'){state.clinic.expiring.forEach((_,i)=>{state.clinic.sent['ex'+i]=true;});toast('Prompts sent');}
  else toast('A care navigator will call back');
  state.log.push(describe(a).title+' (confirmed by the user)');
}

function context(){
  const r=role(),id=state.child,k=state.kids[id];let snap;
  if(r==='parent')snap={child:{name:k.name,age:k.age},home_logs:{feeds_today:todays(state.feeds[id]).length,naps_today:todays(state.naps[id]).length,rash_entries:state.rashes[id].length},home_region:state.q.region,appointments:kidAppts().map(a=>({what:a.what,date:fmt(a.date),time:a.time,with:a.who,mode:a.mode,prep:a.prep})),gp_referral:{valid_until:fmt(k.refUntil),days_left:days(k.refUntil),renewal_requested:!!state.renew[id]},care_team:k.team,health_journey_due_now:journeyRows(id).due.map(x=>x.what+' ('+x.when+')'),care_program:k.prog,care_plan:k.plan,tests:kidTests(id).map(t=>({name:TINFO[t.type].name,status:tstatus(t)[0],when:twhen(t),doctors_note_to_family:t.s===6&&t.result.mode==='note'?t.result.plain:null,held_for_conversation:t.s===6&&t.result.mode==='discuss'})),doctor:k.doc,notes_for_doctor:{count:state.notes[id].length,sent:!!state.sent[id]}};
  else if(r==='gp')snap={referrals:state.refs.map(x=>({id:x.id,patient:'Child, '+x.age+' y',reason:label(x.concern),urgency:x.urgency,status:STEPS[x.step],booked_with:x.step>=2?x.to:null}))};
  else snap={reviews_due_not_booked:state.clinic.recalls.map(x=>({patient:x.c,group:x.g,due:fmt(x.due),days_overdue:Math.max(0,-days(x.due))})),referrals_expiring:state.clinic.expiring.map(x=>({patient:x.c,group:x.g,expires:fmt(x.until),days_left:days(x.until)})),freed_slots:state.clinic.slots,studies:state.studies.map(x=>({id:x.id,test:x.test,site:x.site,status:FLOW[x.s],days_since_referral:days(TODAY,x.ref),flag:x.s===0?x.flag||null:null}))};
  if(r==='parent')snap.adhd_shared_care={status:'proposed by the clinical lead, indicative, not a quote',who_leads:'a paediatrician, for children under 17 only',steps:['Paediatrician: assessment over two visits, with a pre-visit questionnaire','GP: regular visits and repeat scripts','Paediatrician: review twice a year, sooner by video if the GP asks'],fees_before_medicare:{paediatrician_first:CARE.first[0],paediatrician_second:CARE.second[0],gp_visit:CARE.gp[0]},out_of_pocket:{paediatrician_first:CARE.first[1],paediatrician_second:CARE.second[1],gp_visit:CARE.gp[1]+' to '+CARE.gp[2]}};
  if(r==='gp')snap.shared_care=state.shared.map(s=>({patient:s.c,group:s.g,plan_by:s.paed,gp_review_due:fmt(s.gpDue),repeat_script_due:fmt(s.script),yearly_review:fmt(s.annual),video_review_asked:!!s.asked}));
  if(r==='staff')snap.adhd_shared_care={questionnaires:state.forms.map(f=>({patient:f.c,first_visit:fmt(f.visit),parent_form_in:f.parent,teacher_form_in:f.teacher})),video_reviews_asked:state.escal.map(e=>({patient:e.c,group:e.g,from:e.from,date:fmt(e.date)})),yearly_reviews:state.shared.map(s=>({patient:s.c,due:fmt(s.annual)}))};
  snap.screen=location.hash.slice(1)||'home';snap.recent_actions=state.log.slice(-5);
  return `You are Pip, the support assistant inside PaedsMe, an Australian service that matches families to paediatric clinicians and books paediatric EEG and ECG tests. This is a prototype on synthetic data. Today is ${fmt(TODAY)}.
You are talking to ${ROLE[r].about}.
Rules:
- Help with navigation and admin only: bookings, rescheduling, referrals, the preparation steps listed for a visit, fees shown, funding programs such as Medicare, Thriving Kids and the NDIS, and where things are in the app.
- Never diagnose, never interpret symptoms, results, milestones or growth, and never advise on medicines or treatment. Say the care team does that, then offer a booking or a navigator call.
- If anything sounds urgent, tell them to call 000 first.
- To change anything, call propose_action. It shows a confirm card and nothing happens until the user taps Confirm. Never say something is booked, sent or done. Say the card is ready to confirm.
- Call find_clinicians before suggesting a clinician, and only name clinicians it returns.
- Families cannot book a specialist directly. Choosing a clinician makes a referral request for their GP. The GP writes the referral, the clinic triages it by hand, and PaedsMe never triages. Rapid Access means a video visit within 48 hours of the referral arriving; say it is a proposed model.
- A referral to a private specialist does not need to name the doctor, and a GP referral usually lasts 12 months from the first specialist visit.
- ADHD shared care fees are proposals from the clinical lead. When you mention them, say they are approximate and not a quote.
- Parents' notes are a record for the clinician. Never say whether something a parent noticed is normal or worrying.
- Feeding, sleep and rash logs are a record too. Never say what a rash is, or whether feeding or sleep is on track. Point to the Talk it through page, where the parent can say it in their own words.
- Test results: only repeat the doctor's note to the family, word for word. Never explain, interpret or guess a result. If a result is held for a conversation, say the doctor will go through it and offer to ask for an earlier call.
- Use only the app state below. If you do not know, say so and offer a navigator call.
- Reply in plain text with no markdown, under 70 words, warm and direct.
App state (JSON): ${JSON.stringify(snap)}`;
}
function tools(){return[
  {name:'find_clinicians',description:'Search the PaedsMe clinician network. Returns up to 4 matches with role, region, days to a first visit, fee, out-of-pocket gap and why each fits. Use before suggesting or booking anyone.',
   inputSchema:{type:'object',properties:{age:{type:'number',description:'Child age in years'},concern:{type:'string',enum:CONCERNS.map(c=>c[0])},region:{type:'string',enum:REGIONS},video_ok:{type:'boolean'}},required:['age','concern']},
   execute(i){const c=String(i.concern);if(!CONCERNS.some(x=>x[0]===c))throw new Error('concern must be one of: '+CONCERNS.map(x=>x[0]).join(', '));
     return match({age:Math.min(30,Math.max(0,Number(i.age)||0)),concern:c,region:REGIONS.includes(i.region)?i.region:state.q.region,tele:i.video_ok!==false}).map(({c,why})=>{const p=fees(c,{concern:String(i.concern)});return{name:c.name,role:c.role,region:c.region,days_to_first_visit:c.rapid?2:c.wait,rapid_access:!!c.rapid,approach:c.holistic?'holistic':'mainstream',fee:p.fee,gap:p.gap,video:c.tele,why};});}},
  {name:'propose_action',description:'Show the user a confirm card for one action; nothing changes until they tap Confirm. Returns whether the card was shown. Kinds: book (needs clinician_name), reschedule (appointment = words from its name), renew_referral, note (needs note: what the parent noticed, in their own words), navigator_callback (note = what they need), and for staff only send_recalls and send_renewal_prompts.',
   inputSchema:{type:'object',properties:{kind:{type:'string',enum:Object.keys(KINDS)},clinician_name:{type:'string'},appointment:{type:'string'},note:{type:'string'}},required:['kind']},
   execute(i){return propose({kind:String(i.kind),name:String(i.clinician_name||''),appointment:String(i.appointment||''),note:String(i.note||'')});}},
  {name:'open_screen',description:'Take the user to another screen of the app. Returns the screen opened.',
   inputSchema:{type:'object',properties:{screen:{type:'string',enum:Object.keys(VIEWS)}},required:['screen']},
   execute(i){const s=String(i.screen);if(!VIEWS[s])throw new Error('Unknown screen.');location.hash=s;return 'Opened '+s;}}];}

function say(text){pip.log.push({t:'pip',text});speak(text);}
function speak(text){if(pip.voice&&pip.tts)pip.tts.speak(String(text).slice(0,1900)).catch(()=>{});}
function scripted(text){
  const q=text.toLowerCase(),r=role(),k=state.kids[state.child],ap=kidAppts(),nx=ap[0];
  const tryP=(a,ok)=>{try{propose(a);const c=pip.log.pop();say(ok);pip.log.push(c);}catch(e){say(e.message);}};
  if(r==='parent'&&/urgent|video call|telehealth|speak to a paediatric|today|right now/.test(q)){location.hash='urgent';return say('If your child is in danger, call 000. To speak to a paediatrician by video, open Urgent video call. It is with '+TELE.doctor+' and a fee applies.');}
  if(r==='parent'&&/talk it through|worried|worry|anxious|scared/.test(q)){location.hash='talk';return say('Open Talk it through and tell me what is worrying you. I will help you get it down clearly.');}
  if(/human|person|navigator|call me|speak to|talk to/.test(q))return tryP({kind:'navigator_callback',note:''},'I can arrange a call from a care navigator. Confirm below and a person calls back.');
  if(r==='parent'&&/adhd|shared care/.test(q))return say(`ADHD care is shared. A paediatrician does the assessment over two visits, about ${money(CARE.first[0])} then ${money(CARE.second[0])} before Medicare. Your GP does the regular visits, about ${money(CARE.gp[0])} each. The paediatrician reviews twice a year. These figures are indicative, not a quote. The ADHD care screen has the detail.`);
  if(r==='staff'){
    if(/shared|questionnaire|conners|video review|yearly/.test(q)){const w=state.forms.filter(f=>!(f.parent&&f.teacher)).length;return say(`ADHD shared care: ${w} of ${state.forms.length} first visits are still waiting on a questionnaire, ${plural(state.escal.length,'GP')} asked for a video review, and ${plural(state.shared.length,'yearly review')} are coming up. The lists are on Clinic tools.`);}
    if(/expir|renew/.test(q))return tryP({kind:'send_renewal_prompts'},`${state.clinic.expiring.length} referrals are close to expiring. I can prompt the families and their GPs.`);
    if(/review|recall|overdue|link/.test(q)){const o=state.clinic.recalls.filter(x=>days(x.due)<0).length;return tryP({kind:'send_recalls'},`${state.clinic.recalls.length} reviews are due and not booked, ${o} of them overdue. I can send booking links.`);}
    if(/report|waiting|worklist|stud|eeg|ecg/.test(q)){const w=state.studies.filter(x=>x.s===4||x.s===5);return say(w.length?`${w.length} studies are waiting for a report: ${w.map(x=>x.id+' ('+x.test+')').join(', ')}.`:'Nothing is waiting for a report.');}
    return say('I can list overdue reviews, expiring referrals and studies waiting for a report, and send prompts once you confirm.');
  }
  if(r==='gp'){
    if(/shared|due|script|review/.test(q))return say(state.shared.map(s=>`${s.c}, ${s.g}: your review ${days(s.gpDue)<0?'is overdue':'is due '+fmt(s.gpDue).slice(4,-5)}, yearly review with ${s.paed} ${fmt(s.annual).slice(4)}`).join('\n'));
    if(/named|name|address|dear/.test(q))return say('No. A referral to a private specialist can be addressed "Dear Paediatrician". PaedsMe then matches the family to a paediatrician.');
    if(/status|referral|up to|where/.test(q))return say(state.refs.map(x=>`${x.id}: ${STEPS[x.step].toLowerCase()}${x.step>=2?', with '+x.to:''}`).join('\n'));
    return say('Fill in the form on this screen and the likely matches update as you go. I can also tell you where your referrals are up to.');
  }
  if(/result|test|eeg|ecg|monitor|brain wave|heart trace/.test(q)){const ts=kidTests(state.child);return say(ts.length?ts.map(t=>TINFO[t.type].name+': '+(t.s===6?(t.result.mode==='note'?sdoc(t)+' says: '+t.result.plain:'result ready. '+sdoc(t)+' will go through it with you.'):tstatus(t)[0].toLowerCase()+'. '+twhen(t))).join('\n\n'):'No tests are booked.');}
  if(/rash|feed|bottle|breast|nap\b|solids/.test(q))return say('Tell me about it on the Talk it through page and I will write it down in your words for your doctor. I cannot say what a rash is, or whether feeding or sleep is on track. Your care team does that.');
  if(/resched|move|change.*(appointment|time|date)|cancel/.test(q))return tryP({kind:'reschedule',appointment:''},'I can ask the clinic for new times. Confirm below.');
  if(/referral|renew|expir/.test(q)){const left=days(k.refUntil);return left<60?tryP({kind:'renew_referral'},`${k.name}'s referral ends ${fmt(k.refUntil)}, in ${left} days. I can ask your GP to renew it.`):say(`${k.name}'s referral is valid until ${fmt(k.refUntil)}, ${left} days from now. Nothing to do yet.`);}
  if(/prep|prepare|bring|ready/.test(q))return say(nx?`For ${nx.what} on ${fmt(nx.date)}:\n- ${nx.prep.join('\n- ')}`:'There is nothing booked to prepare for.');
  if(/next|upcoming|when|appointment/.test(q))return say(nx?`Next is ${nx.what} on ${fmt(nx.date)} at ${nx.time} with ${nx.who}. ${ap.length-1} more after that.`:'Nothing is booked yet.');
  if(/find|book|paediatric|pediatric|clinician|doctor|specialist/.test(q)){const m=match({age:AGE[state.child],concern:state.q.concern,region:state.q.region,tele:true});
    return m.length?tryP({kind:'book',name:m[0].c.name},`For ${label(state.q.concern).toLowerCase()} near ${state.q.region}, ${m[0].c.name} is the best fit${m[0].c.rapid?', through Rapid Access: a video visit within 48 hours of the referral':', about '+m[0].c.wait+' days away'}.${m[1]?' Next is '+m[1].c.name+'.':''} Confirm and I prepare the referral request for your GP. You cannot book a specialist directly.`):say('No one in the network fits yet. A navigator can search further.');}
  if(/thriving|ndis|fund|cost|fee|medicare|rebate/.test(q))return tryP({kind:'navigator_callback',note:'Help with funding options'},'Medicare pays a rebate on specialist visits when you have a GP referral. Thriving Kids supports children 8 and under with developmental needs, and the NDIS covers permanent and significant disability. A navigator can go through which fits.');
  if(/note|notice|log|diary|record/.test(q)){const note=text.replace(/^.*?\b(add a note|note|noticed|log|diary|record)\b\W*/i,'').trim();return note?tryP({kind:'note',note},'I can add that for '+k.doc+'. Confirm below.'):say('Tell me what you noticed. Start with the word "note".');}
  say('I can help with appointments, referrals, visit prep and funding. For questions about symptoms, results or medicines, your care team is the right place. I can arrange a navigator call.');
}

async function send(text){
  text=String(text).trim();if(!text||pip.busy)return;
  pip.log.push({t:'me',text});
  if(EMERG.test(text)){pip.log.push({t:'alert',text:'If a child is in danger, call 000 now. For health advice from a nurse in Queensland, call 13 HEALTH (13 43 25 84). Pip cannot help with urgent medical problems.'});renderPip();return;}
  pip.turns.push({role:'user',content:text});if(pip.turns.length>12)pip.turns.splice(0,pip.turns.length-12);
  if(!pip.live){scripted(text);renderPip();return;}
  const m={t:'pip',text:'Thinking...'};pip.log.push(m);pip.busy=true;pip.ctl=new AbortController();renderPip();
  try{
    const out=await pip.sample([{role:'user',content:context()},...pip.turns],{cache:false,modelTier:'quick',tools:tools(),signal:pip.ctl.signal,onText:({text})=>{m.text=text;renderPip();}});
    m.text=out.text;pip.turns.push({role:'assistant',content:out.text});speak(out.text);
  }catch(e){
    const code=e&&e.code;
    if(code==='cancelled')m.text=(e&&e.text)||'Stopped.';
    else if(['not_granted','sampling_disabled','not_declared','capability_disabled','capability_removed','tools_unavailable'].includes(code)){pip.live=false;pip.log.splice(pip.log.indexOf(m),1);scripted(text);}
    else if(code==='rate_limited')m.text='Pip is busy right now. Try again in a minute.';
    else if(code==='session_expired')m.text='Your Claude session has ended. Sign in again, then resend.';
    else if(code==='refused')m.text='I cannot help with that one. A care navigator can. Ask me to arrange a call.';
    else m.text=((e&&e.text)?e.text+'\n\n':'')+'The connection dropped. Send that again when you are ready.';
  }finally{pip.busy=false;pip.ctl=null;render();renderPip();}
}

function renderPip(){
  const r=ROLE[role()],mode=$('pip-mode'),log=$('pip-log');
  $('pip-role').textContent=r.who;
  mode.textContent=pip.live?'Live AI':'Scripted demo';mode.className='chip '+(pip.live?'good':'quiet');
  $('pip-chips').innerHTML=r.chips.map(c=>`<button type="button" data-act="pip-chip">${esc(c)}</button>`).join('');
  log.innerHTML=pip.log.map((m,i)=>m.t==='card'
    ?`<div class="card"><b>${esc(m.title)}</b><div class="sub">${esc(m.detail)}</div>${m.status==='pending'?`<div class="acts"><button type="button" class="primary" data-act="pip-confirm" data-i="${i}">Confirm</button><button type="button" data-act="pip-cancel" data-i="${i}">Not now</button></div>`:`<span class="chip ${m.status==='done'?'good':'quiet'}">${m.status==='done'?'Done':'Not done'}</span>`}</div>`
    :`<div class="msg ${m.t==='pip'?'bot':m.t}">${esc(m.text)}</div>`).join('');
  log.scrollTop=log.scrollHeight;
  $('pip').classList.toggle('thinking',pip.busy);$('pip-stop').hidden=!pip.busy;$('pip-send').hidden=pip.busy;
}
function openPip(o){
  $('pip').hidden=!o;syncFab();
  if(o){if(!pip.greeted){pip.greeted=true;pip.log.push({t:'pip',text:'Hi, I am Pip. I can add notes for the doctor, prepare a referral request and sort out visits. I always ask first.'});}
    renderPip();$('pip-input').focus();}
}
$('pip-open').addEventListener('click',()=>openPip(true));
$('pip-close').addEventListener('click',()=>openPip(false));
$('pip-stop').addEventListener('click',()=>pip.ctl&&pip.ctl.abort());
$('pip-voice').addEventListener('click',e=>{pip.voice=!pip.voice;e.currentTarget.setAttribute('aria-pressed',String(pip.voice));e.currentTarget.textContent=pip.voice?'Voice on':'Read aloud';if(!pip.voice&&pip.tts)pip.tts.stop();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('pip').hidden)openPip(false);if(e.key==='Enter'&&!e.shiftKey&&e.target.id==='q-said'){e.preventDefault();hear(e.target.value);render();toResults();}});
(async()=>{
  if(!window.claude||!window.claude.use)return;
  try{const s=await window.claude.use('sample');if(s){const lim=await s.limits().catch(()=>null);if(lim&&lim.tools){pip.sample=s;pip.live=true;}}
    const t=await window.claude.use('tts');if(t){pip.tts=t;$('pip-voice').hidden=false;}}catch(e){}
  renderPip();
})();
if(PARKED_ON){const n=document.querySelector('.tabs');if(n)n.insertAdjacentHTML('beforeend','<a href="#family">My family</a><a href="#gp-referral">GP referral</a><a href="#diagnostics">Diagnostics hub</a><a href="#clinic">Clinic tools</a>');}
document.addEventListener('toggle',e=>{const t=e.target;if(t.id==='f-more')state.q.more=t.open;if(t.dataset&&t.dataset.fold)state.fold[t.dataset.fold]=t.open;},true);
/* On a tablet or phone the header tucks away while scrolling down and returns on the way up. */
let lastY=0;window.addEventListener('scroll',()=>{const y=window.scrollY,t=document.querySelector('.top');if(!t)return;if(window.innerWidth<=940&&y>lastY+6&&y>160)t.classList.add('tuck');else if(y<lastY-6||y<=160)t.classList.remove('tuck');lastY=y;},{passive:true});
window.addEventListener('hashchange',()=>{const tp=document.querySelector('.top');if(tp)tp.classList.remove('tuck');presStop();state.pres.on=false;render();renderPip();window.scrollTo(0,0);});
function start(saved){if(saved&&saved.kids&&saved.kids.ivy&&saved.todo&&saved.stats&&saved.req&&saved.wait&&saved.talk&&saved.talk.asked&&saved.urgent)state=saved;for(const k in SEED)if(state[k]===undefined)state[k]=JSON.parse(JSON.stringify(SEED[k]));state.q=Object.assign({},SEED.q,state.q,{listening:false});state.log=state.log||[];state.jdone=state.jdone||{};state.pres.on=false;render();renderPip();}
try{if('speechSynthesis' in window){speechSynthesis.getVoices();}}catch(e){}
try{loadHeroes();}catch(e){}
window.claude?.hot?.snapshot?.(()=>state);
window.claude?.hot?.ready?window.claude.hot.ready(start):start(window.claude?.hot?.data??{});
