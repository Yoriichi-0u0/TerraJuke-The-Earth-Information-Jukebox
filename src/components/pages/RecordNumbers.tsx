// Explore Data: every shelf record, what kind of number it plays, and (where a series is pinned in the repository)
// a small chart, a plain takeaway and a CSV of the same numbers. Nothing here is computed differently from the decks:
// the series are the committed data files the records themselves play.
import {useEffect,useState} from 'react';
import {jukeboxRecords} from '../../data/jukeboxRecords';
import type {JukeboxRecordId} from '../../data/jukeboxRecords';
import {saveStationFile} from '../../data/earthStations';
import {MONTHS} from '../../lib/climateMapping';
import {useStudioLanguage} from '../../lib/studioLanguage';

type Kind='measured'|'colour'|'counted'|'pixels';
type Series={label:string;unit:string;points:{x:string;v:number}[];takeaway:string;csv:string;file:string;signed?:boolean};
const KIND_TEXT:Record<Kind,string>={measured:'NASA measurements',colour:'Read from NASA’s colour scale',counted:'Counted from NASA’s map',pixels:'Picture brightness only'};
const ABOUT:Partial<Record<JukeboxRecordId,{kind:Kind;what:string}>>={
  spiral:{kind:'measured',what:'How much warmer or cooler each month was than 1951–1980, measured by NASA (GISTEMP). Side A plays the picture’s brightness instead.'},
  nightlights:{kind:'colour',what:'Where city lights grew or faded over ten years, read from NASA’s own legend. Worked out in your browser from NASA’s frames.'},
  air:{kind:'colour',what:'How strongly smoke, dust, sea salt and pollution show in NASA’s model picture. Worked out in your browser.'},
  ocean:{kind:'colour',what:'Model sea temperature (ECCO2) read from NASA’s 0–32 °C colour bar along the currents. Worked out in your browser.'},
  motion:{kind:'pixels',what:'The brightness of an archived NASA animation as it plays. Not a measurement.'},
  ice:{kind:'colour',what:'How much Arctic sea ice NASA drew each month of 2024, measured on NASA’s own globe.'},
  warming:{kind:'colour',what:'The world’s average warming read from NASA’s temperature map, one map per decade.'},
  storm:{kind:'counted',what:'How much lightning NASA drew each month of 2022, from the Space Station’s sensor. Drawn area, not a count of flashes.'},
};
const fmt=(v:number,d=2)=>`${v>0?'+':v<0?'−':''}${Math.abs(v).toFixed(d)}`;
const short=(m:number)=>MONTHS[m].slice(0,3);

async function loadSeries():Promise<Partial<Record<JukeboxRecordId,Series>>>{
  const [spiral,warming,ice,storm]=await Promise.all([import('../../data/climateSpiral.json'),import('../../data/warming5450.json'),import('../../data/arcticIce2024.json'),import('../../data/lightning5011.json')]);
  const full=spiral.default.years.filter(y=>y.months.every(v=>v!==null)).map(y=>({x:String(y.year),v:+((y.months as number[]).reduce((a,b)=>a+b,0)/12).toFixed(3)}));
  const warmest=[...full].sort((a,b)=>b.v-a.v).slice(0,5).map(p=>p.x).sort();
  const wy=warming.default.years.filter(y=>y.globalC!==null).map(y=>({x:String(y.year),v:y.globalC as number}));
  const im=ice.default.months.map((m,i)=>({x:short(i),v:+(m.iceKm2/1e6).toFixed(2)}));
  const imax=im.reduce((a,b)=>b.v>a.v?b:a),imin=im.reduce((a,b)=>b.v<a.v?b:a);
  const sm=storm.default.months.map((m,i)=>({x:short(i),v:Math.round(m.total)}));
  const smax=sm.reduce((a,b)=>b.v>a.v?b:a),smin=sm.reduce((a,b)=>b.v<a.v?b:a);
  return {
    spiral:{label:'Yearly average, 1880–'+full[full.length-1].x,unit:'°C',signed:true,points:full,takeaway:`The five warmest full years: ${warmest.join(', ')}.`,file:'TerraJuke-GISTEMP-yearly-averages.csv',csv:'year,average_anomaly_c_vs_1951_1980\n'+full.map(p=>`${p.x},${p.v}`).join('\n')},
    warming:{label:'Global average read from each map',unit:'°C',signed:true,points:wy,takeaway:`From ${fmt(wy[0].v)} °C in ${wy[0].x} to ${fmt(wy[wy.length-1].v)} °C in ${wy[wy.length-1].x}.`,file:'TerraJuke-Warming-Map-global-average.csv',csv:'map_year,global_anomaly_c_read_from_colour\n'+wy.map(p=>`${p.x},${p.v}`).join('\n')},
    ice:{label:'Arctic sea ice drawn, 15th of each month, 2024',unit:'million km²',points:im,takeaway:`Most ice in ${imax.x} (${imax.v.toFixed(1)}), least in ${imin.x} (${imin.v.toFixed(1)} million km²).`,file:'TerraJuke-Ice-Year-2024.csv',csv:'date,ice_km2_as_drawn\n'+ice.default.months.map(m=>`${m.date},${m.iceKm2}`).join('\n')},
    storm:{label:'Lightning drawn worldwide, 2022',unit:'relative units',points:sm,takeaway:`Busiest month: ${smax.x}. Quietest: ${smin.x}.`,file:'TerraJuke-Storm-Drums-2022.csv',csv:'month,lightning_drawn_relative_units,share_over_land,centre_latitude\n'+storm.default.months.map(m=>`${m.id},${m.total},${m.landShare},${m.centroidLat}`).join('\n')},
  };
}

function Bars({series}:{series:Series}){
  const vs=series.points.map(p=>p.v),min=Math.min(0,...vs),max=Math.max(0,...vs),span=max-min||1,w=300,h=72,bw=w/vs.length;
  const y=(v:number)=>h-(v-min)/span*h,zero=y(0);
  const first=series.points[0],last=series.points[series.points.length-1];
  return <svg className="rn-bars" viewBox={`0 0 ${w} ${h+16}`} role="img" aria-label={`${series.label}: ${first.x} ${series.signed?fmt(first.v):first.v} ${series.unit}, ${last.x} ${series.signed?fmt(last.v):last.v} ${series.unit}. ${series.takeaway}`}>
    <line x1="0" x2={w} y1={zero} y2={zero} className="rn-zero"/>
    {vs.map((v,i)=><rect key={i} x={i*bw+bw*.12} width={Math.max(.8,bw*.76)} y={Math.min(y(v),zero)} height={Math.max(.8,Math.abs(y(v)-zero))} className={series.signed?(v<0?'rn-cool':'rn-warm'):'rn-plain'}/>)}
    <text x="0" y={h+13}>{first.x}</text><text x={w} y={h+13} textAnchor="end">{last.x}</text>
  </svg>;
}

export default function RecordNumbers(){
  const {t}=useStudioLanguage();
  const [series,setSeries]=useState<Partial<Record<JukeboxRecordId,Series>>|null>(null),[failed,setFailed]=useState(false);
  useEffect(()=>{let live=true;loadSeries().then(s=>{if(live)setSeries(s);}).catch(()=>{if(live)setFailed(true);});return()=>{live=false;};},[]);
  return <section className="rn" aria-labelledby="rn-title">
    <p className="ss-kicker">{t('EVERY RECORD / WHERE THE NUMBERS COME FROM')}</p>
    <h2 id="rn-title">{t('All eight records, and what their numbers are.')}</h2>
    <p className="rn-lead">{t('Some records play NASA’s measurements. Some read numbers back from the colours NASA used. One plays only a picture’s brightness. Each card says which.')}</p>
    {failed&&<p role="alert">{t('The charts could not load. Every record still plays on Listen.')}</p>}
    <ol className="rn-grid">{jukeboxRecords.map(record=>{const about=ABOUT[record.id];if(!about)return null;const s=series?.[record.id];return <li key={record.id} className="rn-card" data-kind={about.kind}>
      <div className="rn-head"><span className="rn-num">{record.number}</span><h3>{t(record.title)}</h3></div>
      <p className="rn-kind">{t(KIND_TEXT[about.kind])}</p>
      <p className="rn-what">{t(about.what)}</p>
      {s&&<figure><figcaption>{t(s.label)} ({t(s.unit)})</figcaption><Bars series={s}/><p className="rn-take">{s.takeaway}</p></figure>}
      {!s&&series===null&&['spiral','warming','ice','storm'].includes(record.id)&&<p className="rn-wait" role="status">{t('Loading the numbers…')}</p>}
      <div className="rn-links"><a href={`/listen?record=${record.id}`}>{t('Hear it')} →</a><a href={record.sourceUrl} target="_blank" rel="noreferrer">{t(record.id==='motion'?'Source (archived copy)':'NASA source')} ↗</a>{s&&<button type="button" onClick={()=>saveStationFile(new Blob([s.csv+'\n'],{type:'text/csv'}),s.file)}>{t('Download the numbers (CSV)')}</button>}</div>
    </li>;})}</ol>
  </section>;
}
