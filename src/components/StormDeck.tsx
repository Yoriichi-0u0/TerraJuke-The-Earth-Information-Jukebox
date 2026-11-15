// Storm Drums: NASA SVS 5011 (ISS Lightning Imaging Sensor), the 15th of each month of 2022.
// Side A plays the storm year: each month opens with a low note for the world's lightning, then drums sweep west to
// east, louder where NASA drew more lightning. Side B: touch a place to hear its lightning month by month.
import {useEffect,useRef,useState} from 'react';
import type {CSSProperties,KeyboardEvent as ReactKeyboardEvent,PointerEvent as ReactPointerEvent} from 'react';
import {AudioLines} from 'lucide-react';
import DeckConsole from './DeckConsole';
import AirTurntable from './AirTurntable';
import type {GlobeTarget} from './AirTurntable';
import type {JukeboxRecord} from '../data/jukeboxRecords';
import type {RecordSide,RecordSignal} from '../lib/recordSignal';
import {useStudioLanguage} from '../lib/studioLanguage';
import data from '../data/lightning5011.json';
import type {LightningAnalysis} from '../lib/lightning/analyze';
import {CELL,CELL_COLS,CELL_ROWS,FRAME_IDS,LAT_LIMIT,MONTHS,SECTORS,SECTOR_DEG,cellCentre,cellIndex} from '../lib/lightning/analyze';
import {DEFAULT_BPM,MAPPING_TABLE,placeScore,stepSeconds,yearScore} from '../lib/lightning/sonify';
import type {Hit} from '../lib/lightning/sonify';
import {latLabel,lonLabel,monthCaption,placeCaption,regionName,sectorLabel,strength} from '../lib/lightning/describe';
import {DrumEngine} from '../lib/lightning/audio';
import './NightLightsDeck.css';
import './AirDeck.css';
import './OceanDeck.css';
import './WarmingDeck.css';
import './StormDeck.css';

const storms=data as LightningAnalysis;
const mapUrl=(m:number)=>`/nasa/svs5011/${FRAME_IDS[m]}.webp`;
const score=yearScore(storms);
const maxTotal=Math.max(...storms.months.map(m=>m.total));
type Current={serial:number;at:number;index:number;hit:Hit;caption:string;lat:number;lon:number};
declare global{interface Window{terrajukeStorm?:{events:{kind:string;month:number;sector:number;value:number}[]}}}

export default function StormDeck({record,motion,volume,onVolume}:{record:JukeboxRecord;motion:boolean;volume:number;onVolume:(value:number)=>void}){
  const {t}=useStudioLanguage();
  const [side,setSide]=useState<RecordSide>('a');
  const [month,setMonth]=useState(7),[place,setPlace]=useState(()=>cellIndex(-2,22)!);
  const [playing,setPlaying]=useState(false),[completed,setCompleted]=useState(false),[requestAt,setRequestAt]=useState(0);
  const [current,setCurrent]=useState<Current|null>(null),[message,setMessage]=useState('');
  const [bpm,setBpm]=useState(DEFAULT_BPM);const bpmRef=useRef(DEFAULT_BPM);
  const audio=useRef<DrumEngine|null>(null),serial=useRef(0);
  useEffect(()=>{audio.current=new DrumEngine();window.terrajukeStorm={events:[]};return()=>audio.current?.dispose();},[]);
  useEffect(()=>{audio.current?.setVolume(volume);},[volume]);
  useEffect(()=>{const img=new Image();img.src=mapUrl((month+1)%12);},[month]);

  const placeKey=place.row*CELL_COLS+place.col,placeAt=cellCentre(place.row,place.col);
  const placeValues=FRAME_IDS.map(id=>storms.cells[id][placeKey]);
  function show(index:number,hit:Hit,caption:string,lat:number,lon:number){
    const id=++serial.current;setCurrent({serial:id,at:performance.now(),index,hit,caption,lat,lon});setMonth(hit.month);
    const log=window.terrajukeStorm;if(log){log.events.push({kind:hit.kind,month:hit.month,sector:hit.sector,value:hit.value});if(log.events.length>400)log.events.splice(0,log.events.length-400);}
  }
  const yearCaption=(h:Hit)=>{const m=storms.months[h.month];return h.kind==='month'?monthCaption(h.month,m.total,m.landShare,m.centroidLat):`${MONTHS[h.month]}, ${sectorLabel(h.sector,SECTOR_DEG)}: ${strength(h.value)}`;};
  function stop(say=true){const was=playing;audio.current?.stop();setPlaying(false);if(say&&was)setMessage(t('Stopped.'));}
  function playYear(){
    stop(false);setSide('a');setPlaying(true);setCompleted(false);setRequestAt(performance.now());
    setMessage(t('The storm year, 2022: each month opens with a low note for the world’s lightning, then the drums sweep west to east. Escape stops.'));
    audio.current?.play(score,{getStepSeconds:()=>stepSeconds(bpmRef.current),onStep:i=>{const h=score[i];show(i,h,yearCaption(h),storms.months[h.month].centroidLat,h.sector<0?20:-180+(h.sector+.5)*SECTOR_DEG);},onEnd:()=>{setPlaying(false);setCompleted(true);setMessage(t('The storm year is complete: the lightning followed the sun north and back.'));}});
  }
  function hearMonth(m:number){stop(false);setSide('a');const i=m*(SECTORS+1),h=score[i];audio.current?.playOne(h,stepSeconds(bpmRef.current));show(i,h,yearCaption(h),storms.months[m].centroidLat,20);setMessage(yearCaption(h));}
  function playPlace(row:number,col:number){
    stop(false);setSide('b');setPlace({row,col});
    const key=row*CELL_COLS+col,{lat,lon}=cellCentre(row,col),values=FRAME_IDS.map(id=>storms.cells[id][key]),caption=placeCaption(lat,lon,values),hits=placeScore(values);
    setPlaying(true);setCompleted(false);setRequestAt(performance.now());setMessage(caption);
    audio.current?.play(hits,{getStepSeconds:()=>stepSeconds(bpmRef.current)*3,onStep:i=>show(i,hits[i],`${caption}. ${MONTHS[i]}: ${t(strength(values[i]))}`,lat,lon),onEnd:()=>{setPlaying(false);setCompleted(true);}});
  }
  function changeSide(next:RecordSide){if(next===side)return;stop(false);setSide(next);setCompleted(false);setCurrent(null);setMessage('');}
  function onKey(e:ReactKeyboardEvent<HTMLDivElement>){
    const k=e.key;
    if(k==='Escape'){e.preventDefault();stop();return;}
    if(side==='a'){
      if(k==='ArrowRight'||k==='ArrowLeft'){e.preventDefault();hearMonth((month+(k==='ArrowRight'?1:11))%12);}
      else if(k==='Home'||k==='End'){e.preventDefault();hearMonth(k==='Home'?0:11);}
      else if(k==='Enter'||k===' '){e.preventDefault();playing?stop():playYear();}
    }else{
      const moves:Record<string,[number,number]>={ArrowLeft:[0,-1],ArrowRight:[0,1],ArrowUp:[-1,0],ArrowDown:[1,0]};
      if(k in moves){e.preventDefault();const [dr,dc]=moves[k];playPlace(Math.max(0,Math.min(CELL_ROWS-1,place.row+dr)),(place.col+dc+CELL_COLS)%CELL_COLS);}
      else if(k==='Enter'||k===' '){e.preventDefault();playPlace(place.row,place.col);}
    }
  }
  function onPointer(e:ReactPointerEvent<HTMLDivElement>){
    if(side==='a')return;
    const box=e.currentTarget.getBoundingClientRect(),fx=(e.clientX-box.left)/box.width,fy=(e.clientY-box.top)/box.height;
    const c=cellIndex(90-fy*180,-180+fx*360);if(c)playPlace(c.row,c.col);
  }

  const sector=side==='a'&&current&&current.hit.kind==='drum'?current.hit.sector:null;
  const sweepBox=sector!==null?{left:`${sector*SECTOR_DEG/360*100}%`,width:`${SECTOR_DEG/360*100}%`}:null;
  const cellBox=side==='b'?{left:`${place.col*CELL/360*100}%`,top:`${(90-LAT_LIMIT+place.row*CELL)/180*100}%`,width:`${CELL/360*100}%`,height:`${CELL/180*100}%`}:null;
  const target:GlobeTarget=current?{lon:current.lon,lat:current.lat,at:current.at,dur:stepSeconds(bpm),glide:false}:{lon:20,lat:10,at:0,dur:1,glide:false};
  const signal:RecordSignal={playing,note:current?(current.hit.name):'—',frequency:current?.hit.hz??null,event:current?{serial:current.serial,at:current.at,index:current.index}:null};
  const bars=side==='b'?placeValues.map(v=>v/450):storms.months.map(m=>m.total/maxTotal);
  const caption=current?.caption??t(side==='a'?'Press Play to hear 2022’s storms sweep around the world, or choose a month.':'Tap a place, or use the arrow keys, to hear its lightning month by month.');

  const sideControls=<>
    <div className="jb-side-selector" role="group" aria-label={t('Choose a side of Storm Drums')}>
      <button type="button" aria-label={t('Side A: the storm year')} aria-pressed={side==='a'} onClick={()=>changeSide('a')}><b>A</b><span>{t('The storm year')}<small>{t('12 months · 18 drums each')}</small></span></button>
      <button type="button" aria-label={t('Side B: touch a place')} aria-pressed={side==='b'} onClick={()=>changeSide('b')}><b>B</b><span>{t('Touch a place')}<small>{t('Its lightning, month by month')}</small></span></button>
    </div>
    <div className="air-tempo"><label htmlFor="storm-bpm">{t('Tempo')}</label><input id="storm-bpm" type="range" min={80} max={180} step={4} value={bpm} aria-valuetext={`${bpm} ${t('beats per minute')}`} onChange={e=>{bpmRef.current=Number(e.target.value);setBpm(Number(e.target.value));}}/><output htmlFor="storm-bpm">{bpm} BPM</output></div>
  </>;

  const artwork=<div className="jb-media warming-media storm-media" aria-label={t('NASA lightning map, explorable by touch, mouse or keyboard')}>
    <div className="jb-art-label"><span>{t('ISS lightning')} · 15 {t(MONTHS[month])} 2022</span><span>NASA / SVS 5011</span></div>
    <div className="warming-map storm-map" tabIndex={0} role="application" aria-roledescription={t('sound map')} data-side={side}
      aria-label={t(side==='a'?'Lightning map, the storm year. Left and right arrows move between months and play each month’s note; Home and End jump to January and December; Enter plays the year; Escape stops.':'Lightning map. Arrow keys move around the world and play each place’s lightning, month by month; Enter plays it again; Escape stops.')}
      onKeyDown={onKey} onPointerDown={onPointer}>
      {MONTHS.map((_,m)=><img key={m} src={mapUrl(m)} width={2048} height={1024} alt={m===month?`${t('NASA world map of lightning detected from the International Space Station in the ten days around')} 15 ${t(MONTHS[m])} 2022: ${t('yellow dots mark lightning; most fall over land, centred near')} ${latLabel(storms.months[m].centroidLat)}.`:''} aria-hidden={m!==month} className={m===month?'is-shown':''} loading={m===month||m===(month+1)%12?'eager':'lazy'} decoding="async" draggable={false}/>)}
      {sweepBox&&<span className={`storm-sweep${playing?' is-playing':''}`} style={sweepBox} aria-hidden="true"/>}
      {cellBox&&<span className="ocean-cell" style={cellBox} aria-hidden="true"/>}
    </div>
    <ol className="warming-decades storm-months" aria-label={t(side==='b'?'This place, month by month':'Lightning worldwide, month by month')}>
      {MONTHS.map((name,m)=><li key={name}><button type="button" aria-pressed={m===month} aria-label={`${t(name)}: ${side==='b'?t(strength(placeValues[m])):`${Math.round(bars[m]*100)}% ${t('of the year’s busiest month')}`}`} onClick={()=>side==='a'?hearMonth(m):setMonth(m)} style={{'--h':`${Math.round(Math.min(1,bars[m])*100)}%`} as CSSProperties}><i aria-hidden="true"/><span aria-hidden="true">{name.slice(0,1)}</span></button></li>)}
    </ol>
    <p className="air-caption" data-testid="storm-caption">{caption}</p>
    <div className="jb-art-footer"><span>{t(playing?'SOUND GENERATED IN YOUR BROWSER':side==='a'?'PRESS PLAY OR CHOOSE A MONTH':'TAP A PLACE OR USE THE ARROW KEYS')}</span><AudioLines size={16}/></div>
  </div>;

  const notes=<details className="nl-notes storm-notes">
    <summary>{t('Liner notes: listening to lightning seen from space')}</summary>
    <p>{t('The Lightning Imaging Sensor on the International Space Station recorded every flash it saw between about 55°N and 55°S from 2017 to 2023. NASA’s Scientific Visualization Studio drew each event of a 10-day roving window as a yellow dot. TerraJuke reads the dots on the frames nearest the 15th of each month of 2022 and adds up how much of each place NASA painted with lightning.')}</p>
    <table className="nl-mapping"><tbody>{MAPPING_TABLE.map(([a,b])=><tr key={a}><td>{t(a)}</td><td>{t(b)}</td></tr>)}</tbody></table>
    <h3>{t('Does it hear the storms sensibly?')}</h3>
    <div className="nl-table-scroll" tabIndex={0} role="region" aria-label={t('Lightning read from NASA’s 2022 frames')}><table className="nl-compare"><caption>{t('Lightning NASA drew, the 15th of each month of 2022')}</caption><thead><tr><th scope="col">{t('Month')}</th><th scope="col">{t('Over land')}</th><th scope="col">{t('Centred near')}</th></tr></thead>
      <tbody>{storms.months.map((m,i)=><tr key={m.id}><th scope="row">{t(MONTHS[i])}</th><td>{Math.round(m.landShare*100)}%</td><td>{latLabel(m.centroidLat)}</td></tr>)}</tbody></table></div>
    <p>{t('About three quarters of the lightning falls over land every month, as satellite records have long shown, and the storm belt follows the sun: centred south of the equator in January, far north in August. The Congo basin storms all year, Lake Maracaibo in Venezuela too, while the Sahara and the open Pacific stay almost silent. Automated tests pin all of these.')}</p>
    <h3>{t('Limits')}</h3>
    <ul><li>{t('These are drawn dots, not a count of lightning strokes: bigger or overlapping dots change the total.')}</li><li>{t('The sensor only sees between about 55°N and 55°S, and only when the station passes over; each frame is a 10-day window.')}</li><li>{t('One frame per month of one year (2022) stands for that month.')}</li><li>{t('Places are 10° by 10°; land and sea come from a coarse 1:110m outline.')}</li></ul>
    <p className="nl-credit">{t('NASA’s Scientific Visualization Studio, SVS 5011. Visualizer: Michala Garrison. Data: ISS Lightning Imaging Sensor quality-controlled science dataset (NASA Marshall Space Flight Center).')}</p>
  </details>;

  const pos=current?(side==='b'?`${latLabel(placeAt.lat)} ${lonLabel(placeAt.lon)} · ${t(MONTHS[current.hit.month].slice(0,3))}`:current.hit.kind==='month'?`15 ${t(MONTHS[current.hit.month])}`:`${t(MONTHS[current.hit.month].slice(0,3))} · ${sectorLabel(current.hit.sector,SECTOR_DEG)}`):'—';
  return <>
    <DeckConsole record={record} labels={{input:'LIGHTNING',position:side==='a'?'MONTH · LONGITUDE':'PLACE · MONTH',count:side==='a'?'12 months of 2022':'Any place, 55°S to 55°N',duration:side==='a'?`~${Math.round(score.length*stepSeconds(bpm))} s`:t('Your pace')}}
      playing={playing} starting={false} ready completed={completed} progress={current?(current.index+1)/(side==='a'?score.length:12):0}
      note={signal.note} frequency={current?.hit.hz?`${current.hit.hz.toFixed(2)} Hz`:'—'} position={pos}
      input={current?(current.hit.kind==='month'?t('The world, this month'):t(strength(current.hit.value))):side==='b'?regionName(placeAt.lat,placeAt.lon):'—'}
      onPlay={()=>playing?stop():side==='a'?playYear():playPlace(place.row,place.col)} playLabel={side==='a'?'Play the storm year':'Play this place'}
      signal={signal} requestAt={requestAt} sideControls={sideControls}
      recordObject={<AirTurntable target={target} texture={mapUrl(month)} playing={playing} pulse={current?.serial??0} motion={motion} accent={record.accent} caption={t(playing?'The globe turns to the storms you hear':'Earth is the record. Press Play.')}/>}
      artwork={artwork} volume={volume} onVolume={onVolume} extra={notes}/>
    <p className="sr-only" aria-live="polite" data-testid="storm-announcer">{message}</p>
  </>;
}
