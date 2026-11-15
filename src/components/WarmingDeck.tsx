// The Warming Map: NASA SVS 5450 (GISTEMP v4 anomalies, 1951–1980 baseline), one map per decade, 1890–2024.
// Side A plays a decade pole to pole: each 5° band's anomaly, read from NASA's numeric colour bar, sets the pitch.
// Side B: touch any place to hear its anomaly decade by decade, from 1890 to 2024.
import {useEffect,useRef,useState} from 'react';
import type {CSSProperties,KeyboardEvent as ReactKeyboardEvent,PointerEvent as ReactPointerEvent} from 'react';
import {AudioLines} from 'lucide-react';
import DeckConsole from './DeckConsole';
import AirTurntable from './AirTurntable';
import type {GlobeTarget} from './AirTurntable';
import type {JukeboxRecord} from '../data/jukeboxRecords';
import type {RecordSide,RecordSignal} from '../lib/recordSignal';
import {useStudioLanguage} from '../lib/studioLanguage';
import data from '../data/warming5450.json';
import type {WarmingAnalysis} from '../lib/warming/analyze';
import {BANDS,BAND_DEG,CELL,CELL_COLS,CELL_ROWS,LAT_LIMIT,YEARS,cellCentre,cellIndex} from '../lib/warming/analyze';
import {DEFAULT_BPM,MAPPING_TABLE,noteFor,stepSeconds} from '../lib/warming/sonify';
import {anomaly,bandCaption,feel,latLabel,lonLabel,placeCaption,regionName} from '../lib/warming/describe';
import {OceanEngine} from '../lib/ocean/audio';
import type {OceanNote} from '../lib/ocean/sonify';
import './NightLightsDeck.css';
import './AirDeck.css';
import './OceanDeck.css';
import './WarmingDeck.css';

const warming=data as WarmingAnalysis;
const mapUrl=(year:number)=>`/nasa/svs5450/${year}.webp`;
const LAST=YEARS.length-1;
type Current={serial:number;at:number;kind:'band'|'decade';index:number;year:number;temp:number|null;note:OceanNote;caption:string;lat:number;lon:number};
declare global{interface Window{terrajukeWarming?:{events:{kind:string;index:number;year:number;temp:number|null}[]}}}

export default function WarmingDeck({record,motion,volume,onVolume}:{record:JukeboxRecord;motion:boolean;volume:number;onVolume:(value:number)=>void}){
  const {t}=useStudioLanguage();
  const [side,setSide]=useState<RecordSide>('a');
  const [yearIndex,setYearIndex]=useState(LAST),[place,setPlace]=useState(()=>cellIndex(52,10)!);
  const [playing,setPlaying]=useState(false),[completed,setCompleted]=useState(false),[requestAt,setRequestAt]=useState(0);
  const [current,setCurrent]=useState<Current|null>(null),[message,setMessage]=useState('');
  const [bpm,setBpm]=useState(DEFAULT_BPM);const bpmRef=useRef(DEFAULT_BPM);
  const audio=useRef<OceanEngine|null>(null),serial=useRef(0);
  useEffect(()=>{audio.current=new OceanEngine();window.terrajukeWarming={events:[]};return()=>audio.current?.dispose();},[]);
  useEffect(()=>{audio.current?.setVolume(volume);},[volume]);
  useEffect(()=>{const img=new Image();img.src=mapUrl(YEARS[(yearIndex+1)%YEARS.length]);},[yearIndex]);

  const year=YEARS[yearIndex],summary=warming.years[yearIndex];
  const placeAt=cellCentre(place.row,place.col),placeKey=place.row*CELL_COLS+place.col;
  const placeSeries=YEARS.map(y=>({year:y,t:warming.cells[String(y)][placeKey]}));
  function show(next:Omit<Current,'serial'|'at'>){
    const id=++serial.current;setCurrent({...next,serial:id,at:performance.now()});
    const log=window.terrajukeWarming;if(log){log.events.push({kind:next.kind,index:next.index,year:next.year,temp:next.temp});if(log.events.length>300)log.events.splice(0,log.events.length-300);}
  }
  const bandNote=(i:number)=>noteFor(summary.bands[i]);
  function showBand(i:number){const south=-LAT_LIMIT+i*BAND_DEG,t0=summary.bands[i];show({kind:'band',index:i,year,temp:t0,note:bandNote(i),caption:bandCaption(south,year,t0),lat:south+BAND_DEG/2,lon:10});}
  function stop(say=true){const was=playing;audio.current?.stop();setPlaying(false);if(say&&was)setMessage(t('Stopped.'));}
  function playBands(){
    stop(false);setSide('a');setPlaying(true);setCompleted(false);setRequestAt(performance.now());
    setMessage(`${t('Pole to pole in')} ${year}: ${t('from Antarctica to the Arctic; warmer than normal plays higher. Escape stops.')}`);
    audio.current?.play(Array.from({length:BANDS},(_,i)=>bandNote(i)),{getStepSeconds:()=>stepSeconds(bpmRef.current),onStep:showBand,onEnd:()=>{setPlaying(false);setCompleted(true);setMessage(`${t('Pole to pole is complete for')} ${year}.`);}});
  }
  function hearBand(i:number){stop(false);audio.current?.playOne(bandNote(i),stepSeconds(bpmRef.current));showBand(i);setMessage(bandCaption(-LAT_LIMIT+i*BAND_DEG,year,summary.bands[i]));}
  function playPlace(row:number,col:number){
    stop(false);setSide('b');setPlace({row,col});
    const key=row*CELL_COLS+col,{lat,lon}=cellCentre(row,col),series=YEARS.map(y=>({year:y,t:warming.cells[String(y)][key]})),caption=placeCaption(lat,lon,series),pan=lon/180*0.6;
    const score=series.map(p=>noteFor(p.t,pan));
    setPlaying(true);setCompleted(false);setRequestAt(performance.now());setMessage(caption);
    audio.current?.play(score,{getStepSeconds:()=>stepSeconds(bpmRef.current)*1.6,onStep:i=>{setYearIndex(i);show({kind:'decade',index:i,year:YEARS[i],temp:series[i].t,note:score[i],caption:`${caption}. ${YEARS[i]}: ${series[i].t===null?t('nothing to read'):anomaly(series[i].t!)}`,lat,lon});},onEnd:()=>{setPlaying(false);setCompleted(true);}});
  }
  function chooseYear(i:number){stop(false);setYearIndex(i);setCurrent(null);setMessage(`${YEARS[i]}: ${t('global average read from NASA’s map')} ${anomaly(warming.years[i].globalC??0)}.`);}
  function changeSide(next:RecordSide){if(next===side)return;stop(false);setSide(next);setCompleted(false);setCurrent(null);setMessage('');}
  function onKey(e:ReactKeyboardEvent<HTMLDivElement>){
    const k=e.key;
    if(k==='Escape'){e.preventDefault();stop();return;}
    if(side==='a'){
      const i=current?.kind==='band'?current.index:BANDS-1;
      if(k==='ArrowUp'||k==='ArrowDown'){e.preventDefault();hearBand(Math.max(0,Math.min(BANDS-1,i+(k==='ArrowUp'?1:-1))));}
      else if(k==='ArrowLeft'||k==='ArrowRight'){e.preventDefault();chooseYear(Math.max(0,Math.min(LAST,yearIndex+(k==='ArrowRight'?1:-1))));}
      else if(k==='Enter'||k===' '){e.preventDefault();playing?stop():playBands();}
    }else{
      const moves:Record<string,[number,number]>={ArrowLeft:[0,-1],ArrowRight:[0,1],ArrowUp:[-1,0],ArrowDown:[1,0]};
      if(k in moves){e.preventDefault();const [dr,dc]=moves[k];playPlace(Math.max(0,Math.min(CELL_ROWS-1,place.row+dr)),(place.col+dc+CELL_COLS)%CELL_COLS);}
      else if(k==='Enter'||k===' '){e.preventDefault();playPlace(place.row,place.col);}
    }
  }
  function onPointer(e:ReactPointerEvent<HTMLDivElement>){
    const box=e.currentTarget.getBoundingClientRect(),fx=(e.clientX-box.left)/box.width,fy=(e.clientY-box.top)/box.height;
    if(fx<0||fx>1||fy<0||fy>1)return;
    const lat=90-fy*180,lon=-180+fx*360;
    if(side==='a'){if(Math.abs(lat)<LAT_LIMIT)hearBand(Math.min(BANDS-1,Math.floor((lat+LAT_LIMIT)/BAND_DEG)));return;}
    const c=cellIndex(lat,lon);if(c)playPlace(c.row,c.col);
  }

  const band=side==='a'&&current?.kind==='band'?current.index:null;
  const bandBox=band!==null?{top:`${(90-(-LAT_LIMIT+(band+1)*BAND_DEG))/180*100}%`,height:`${BAND_DEG/180*100}%`}:null;
  const cellBox=side==='b'?{left:`${place.col*CELL.lon/360*100}%`,top:`${(90-LAT_LIMIT+place.row*CELL.lat)/180*100}%`,width:`${CELL.lon/360*100}%`,height:`${CELL.lat/180*100}%`}:null;
  const target:GlobeTarget=current?{lon:current.lon,lat:current.lat,at:current.at,dur:stepSeconds(bpm),glide:false}:{lon:10,lat:40,at:0,dur:1,glide:false};
  const signal:RecordSignal={playing,note:current?.note?.name??'—',frequency:current?.note?.hz??null,event:current?{serial:current.serial,at:current.at,index:current.index}:null};
  const caption=current?.caption??(side==='a'?`${year}: ${t('global average read from NASA’s map')} ${anomaly(summary.globalC??0)}. ${t('Press Play to travel pole to pole, or choose a decade.')}`:t('Tap a place, or use the arrow keys, to hear its warming from 1890 to 2024.'));
  const bars=side==='b'?placeSeries.map(p=>p.t):warming.years.map(y=>y.globalC);

  const sideControls=<>
    <div className="jb-side-selector" role="group" aria-label={t('Choose a side of The Warming Map')}>
      <button type="button" aria-label={t('Side A: pole to pole')} aria-pressed={side==='a'} onClick={()=>changeSide('a')}><b>A</b><span>{t('Pole to pole')}<small>{t('South Pole to North Pole')}</small></span></button>
      <button type="button" aria-label={t('Side B: touch a place')} aria-pressed={side==='b'} onClick={()=>changeSide('b')}><b>B</b><span>{t('Touch a place')}<small>{t('Tap a place to hear it warm')}</small></span></button>
    </div>
    <div className="air-tempo"><label htmlFor="warming-bpm">{t('Tempo')}</label><input id="warming-bpm" type="range" min={60} max={160} step={4} value={bpm} aria-valuetext={`${bpm} ${t('beats per minute')}`} onChange={e=>{bpmRef.current=Number(e.target.value);setBpm(Number(e.target.value));}}/><output htmlFor="warming-bpm">{bpm} BPM</output></div>
  </>;

  const artwork=<div className="jb-media warming-media" aria-label={t('NASA temperature anomaly map, explorable by touch, mouse or keyboard')}>
    <div className="jb-art-label"><span>{t('GISTEMP anomalies')} · {year===2024?'2023–2024':`${year-1}–${year}`}</span><span>NASA / SVS 5450</span></div>
    <div className="warming-map" tabIndex={0} role="application" aria-roledescription={t('sound map')} data-side={side}
      aria-label={t(side==='a'?'Temperature map. Up and down arrows move between bands of latitude and play each one; left and right arrows change the decade; Enter plays pole to pole; Escape stops.':'Temperature map. Arrow keys move around the world and play each place’s warming from 1890 to 2024; Enter plays it again; Escape stops.')}
      onKeyDown={onKey} onPointerDown={onPointer}>
      {YEARS.map((y,i)=><img key={y} src={mapUrl(y)} width={2048} height={1024} alt={i===yearIndex?`${t('NASA world map of temperature anomalies for the 24 months to')} ${y}, ${t('against the 1951–1980 normal: blue is cooler than normal, white normal, yellow to dark red warmer. The global average read from it is')} ${anomaly(warming.years[i].globalC??0)}.`:''} aria-hidden={i!==yearIndex} className={i===yearIndex?'is-shown':''} loading={i===yearIndex||i===LAST?'eager':'lazy'} decoding="async" draggable={false}/>)}
      {bandBox&&<span className={`ocean-band${playing?' is-playing':''}`} style={bandBox} aria-hidden="true"/>}
      {cellBox&&<span className="ocean-cell" style={cellBox} aria-hidden="true"/>}
    </div>
    <ol className="warming-decades" aria-label={t(side==='b'?'This place, decade by decade':'Global average, decade by decade')}>
      {YEARS.map((y,i)=>{const v=bars[i];return <li key={y}><button type="button" aria-pressed={i===yearIndex} aria-label={`${y}: ${v===null?t('nothing to read'):anomaly(v)}`} onClick={()=>chooseYear(i)} style={{'--v':String(v??0)} as CSSProperties} data-sign={v===null?'none':v>=0?'warm':'cool'}><i aria-hidden="true"/><span aria-hidden="true">{String(y).slice(2)}</span></button></li>;})}
    </ol>
    <img className="warming-cbar" src="/nasa/svs5450/svs5450_cbar.png" width={1000} height={346} alt={t('NASA’s colour bar, Temperature Change: from −2 °C (dark blue) through 0 (white) to +2 °C (dark red), also marked from −3 to +3 °F.')}/>
    <p className="air-caption" data-testid="warming-caption">{caption}</p>
    <div className="jb-art-footer"><span>{t(playing?'SOUND GENERATED IN YOUR BROWSER':side==='a'?'PRESS PLAY, TAP A LATITUDE OR CHOOSE A DECADE':'TAP A PLACE OR USE THE ARROW KEYS')}</span><AudioLines size={16}/></div>
  </div>;

  const notes=<details className="nl-notes warming-notes">
    <summary>{t('Liner notes: reading a warming world from NASA’s colours')}</summary>
    <p>{t('NASA’s Goddard Institute for Space Studies combines thermometer readings from weather stations, ships and buoys into GISTEMP, a record of how far each place’s temperature is from its 1951–1980 normal. NASA’s Scientific Visualization Studio drew those anomalies as a world map, averaged over a running 24-month window, with a numeric colour bar from −2 to +2 °C. TerraJuke reads each colour back to a temperature on that bar, at one map per decade from 1890 to 2024.')}</p>
    <table className="nl-mapping"><tbody>{MAPPING_TABLE.map(([a,b])=><tr key={a}><td>{t(a)}</td><td>{t(b)}</td></tr>)}</tbody></table>
    <h3>{t('Does it read the planet sensibly?')}</h3>
    <div className="nl-table-scroll" tabIndex={0} role="region" aria-label={t('Global averages read from NASA’s maps')}><table className="nl-compare"><caption>{t('Global average read from each map (area-weighted, 85°S–85°N)')}</caption><thead><tr><th scope="col">{t('Map')}</th><th scope="col">{t('Read from colour')}</th><th scope="col">{t('Feels')}</th></tr></thead>
      <tbody>{warming.years.map(y=><tr key={y.year}><th scope="row">{y.year}</th><td>{anomaly(y.globalC??0)}</td><td>{t(feel(y.globalC??0))}</td></tr>)}</tbody></table></div>
    <p>{t('These averages, read only from colour, agree with NASA’s published GISTEMP global means for the same two-year windows to within 0.06 °C on average (at most 0.14 °C); an automated test checks this against TerraJuke’s pinned copy of NASA’s GISTEMP file. The Arctic warms far more than the globe, as scientists expect: by 2024 it reaches the top of NASA’s scale.')}</p>
    <h3>{t('Limits')}</h3>
    <ul><li>{t('Temperatures are read from rendered colour, so they are only as precise as NASA’s colour bar, about 0.1 °C, and stop at its ends: the warmest places read “2 °C or more”.')}</li><li>{t('NASA’s map draws normal temperatures and places without data in the same pale grey, so early decades read about 0 °C where there were no thermometers.')}</li><li>{t('Each map is a 24-month average ending in that year, not a single year; latitudes beyond 85° are left out.')}</li><li>{t('Places are 5° of latitude by 10° of longitude; coastlines on the map are skipped.')}</li></ul>
    <p className="nl-credit">{t('NASA’s Scientific Visualization Studio, SVS 5450. Visualizer: Mark SubbaRao; scientific consulting: Gavin A. Schmidt. Data: NASA GISS GISTEMP v4.')}</p>
  </details>;

  const pos=current?(current.kind==='band'?`${latLabel(current.lat-2.5)}–${latLabel(current.lat+2.5)} · ${current.year}`:`${latLabel(placeAt.lat)} ${lonLabel(placeAt.lon)} · ${current.year}`):'—';
  return <>
    <DeckConsole record={record} labels={{input:'ANOMALY',position:side==='a'?'LATITUDE':'PLACE · YEAR',count:side==='a'?`34 bands, ${year}`:'15 decades, 1890 to 2024',duration:side==='a'?`~${Math.round(BANDS*stepSeconds(bpm))} s`:t('Your pace')}}
      playing={playing} starting={false} ready completed={completed} progress={current?(current.index+1)/(current.kind==='band'?BANDS:YEARS.length):0}
      note={signal.note} frequency={current?.note?`${current.note.hz.toFixed(2)} Hz`:'—'} position={pos}
      input={current?(current.temp===null?t('Nothing to read'):`${anomaly(current.temp)} · ${t(feel(current.temp))}`):side==='b'?`${regionName(placeAt.lat,placeAt.lon)}`:'—'}
      onPlay={()=>playing?stop():side==='a'?playBands():playPlace(place.row,place.col)} playLabel={side==='a'?'Play pole to pole':'Play this place'}
      signal={signal} requestAt={requestAt} sideControls={sideControls}
      recordObject={<AirTurntable target={target} texture={mapUrl(year)} playing={playing} pulse={current?.serial??0} motion={motion} accent={record.accent} caption={t(playing?'The globe turns to what you hear':'Earth is the record. Press Play.')}/>}
      artwork={artwork} volume={volume} onVolume={onVolume} extra={notes}/>
    <p className="sr-only" aria-live="polite" data-testid="warming-announcer">{message}</p>
  </>;
}
