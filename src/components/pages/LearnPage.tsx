// Learn: one "listen for" prompt and one question per record. Every answer follows the record's own fixed sound
// rule (src/lib/<record>/sonify.ts, docs/<RECORD>.md) and the facts its tests check. Nothing is saved or sent.
import {useState} from 'react';
import {jukeboxRecords} from '../../data/jukeboxRecords';
import type {JukeboxRecordId} from '../../data/jukeboxRecords';
import {useStudioLanguage} from '../../lib/studioLanguage';

type Question={listen:string;ask:string;options:[string,string,string];answer:0|1|2;why:string};
export const LEARN:Partial<Record<JukeboxRecordId,Question>>={
  spiral:{listen:'Play Side B: twelve Januaries, from 1880 to 2025.',ask:'As the Januaries get closer to today, the notes mostly…',options:['go higher','go lower','stay the same'],answer:0,why:'Each note is one January’s temperature compared with the 1951–1980 average, on a fixed scale: warmer plays higher. Recent Januaries are the warmest, so the notes climb.'},
  nightlights:{listen:'Play Side A: NASA’s map of how night lights changed from 2012 to 2023.',ask:'A place where city lights grew plays a note that…',options:['rises','falls','is silent'],answer:0,why:'TerraJuke reads NASA’s own legend: purple means more light and rises; orange means less light and falls.'},
  air:{listen:'Play Side A and wait until Africa turns under the needle.',ask:'Over Africa, how many of the four aerosol instruments play?',options:['none','only one','all four at once'],answer:2,why:'Smoke, dust, sea salt and sulfate all show over and around Africa in NASA’s picture, so all four tracks sound together. Mute or solo a track to pick one out.'},
  ocean:{listen:'Play Side A: the ocean from pole to pole.',ask:'Travelling from the icy poles toward the equator, the notes…',options:['get higher','get lower','do not change'],answer:0,why:'Each current’s colour is read back to a temperature on NASA’s 0–32 °C colour bar: warmer water plays higher, and the tropics are warmest.'},
  motion:{listen:'Play the record and watch the bright parts of the animation.',ask:'In Moving Earth, a brighter frame means…',options:['Earth got hotter','the picture got brighter','there is more ice'],answer:1,why:'Moving Earth plays the brightness of the animation’s pixels. It is a picture, not a measurement, so a brighter frame says nothing about temperature.'},
  ice:{listen:'Play Side A: one note for each month of 2024.',ask:'In which month is the note lowest?',options:['March','June','September'],answer:2,why:'Less sea ice plays a lower note. Arctic ice is smallest in September, after the summer melt (about 3.9 million km² drawn), and largest in March (about 13.7 million km²).'},
  warming:{listen:'Play Side A for 2024: from the South Pole to the North Pole.',ask:'Which part of the world rings highest?',options:['the tropics','the Arctic','Antarctica'],answer:1,why:'Warmer than the 1951–1980 normal plays higher. The Arctic has warmed far more than the rest of the world; by 2024 it reaches the top of NASA’s scale.'},
  storm:{listen:'Play the storm year and listen to the drums sweep west to east.',ask:'Where a place had more lightning, its drum…',options:['plays louder','plays quieter','plays a higher note'],answer:0,why:'Each drum’s loudness comes from how much lightning NASA drew in that slice of the world; where none was drawn, it rests. Pitch is used only for the month’s first note.'},
};

export default function LearnPage(){
  const {t}=useStudioLanguage();
  const [picked,setPicked]=useState<Partial<Record<JukeboxRecordId,number>>>({});
  const asked=jukeboxRecords.filter(r=>LEARN[r.id]);
  const answered=asked.filter(r=>picked[r.id]!==undefined).length,right=asked.filter(r=>picked[r.id]===LEARN[r.id]!.answer).length;
  return <><header className="sp-page-heading"><p className="ss-kicker">{t('LEARN / LISTEN AND THINK')}</p><h1 tabIndex={-1}>{t('What did you hear?')}</h1><p>{t('One question for each record. Play the record, listen for one thing, then pick an answer to see why. Nothing is saved or sent.')}</p></header>
    <p className="ln-score" role="status">{answered===0?t('Pick any question to start.'):`${t('Answered')} ${answered} ${t('of')} ${asked.length} · ${right} ${t('right')}`}{answered>0&&<button type="button" className="sp-text-button" onClick={()=>setPicked({})}>{t('Start again')}</button>}</p>
    <ol className="ln-grid">{asked.map(record=>{const q=LEARN[record.id]!,choice=picked[record.id],done=choice!==undefined,ok=choice===q.answer;return <li key={record.id} className="ln-card" data-state={done?(ok?'right':'wrong'):'open'}>
      <div className="ln-head"><span className="ln-num">{record.number}</span><h2>{t(record.title)}</h2></div>
      <p className="ln-listen"><b>{t('Listen for')}:</b> {t(q.listen)} <a href={`/listen?record=${record.id}`}>{t('Hear it')} →</a></p>
      <fieldset><legend>{t(q.ask)}</legend>{q.options.map((option,i)=><label key={option} data-answer={done&&i===q.answer?'yes':undefined}><input type="radio" name={`learn-${record.id}`} checked={choice===i} onChange={()=>setPicked(p=>({...p,[record.id]:i}))}/><span>{t(option)}</span></label>)}</fieldset>
      <p className="ln-why" aria-live="polite">{done&&<><b>{t(ok?'Yes!':'Not quite.')}</b> {t(q.why)}</>}</p>
    </li>;})}</ol>
    <p className="sp-bottom-note">{t('These questions are for practice and fun. TerraJuke has not run a study of what people learn from them.')}</p></>;
}
