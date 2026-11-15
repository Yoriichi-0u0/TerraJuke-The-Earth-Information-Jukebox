// Learn: one "listen for" prompt and one question per record. Every answer follows the record's own fixed sound
// rule (src/lib/<record>/sonify.ts, docs/<RECORD>.md) and the facts its tests check. Nothing is saved or sent.
import {useState} from 'react';
import {jukeboxRecords} from '../../data/jukeboxRecords';
import type {JukeboxRecordId} from '../../data/jukeboxRecords';
import {LEARN} from '../../data/learnQuestions';
import {useStudioLanguage} from '../../lib/studioLanguage';

export default function LearnPage(){
  const {t}=useStudioLanguage();
  const [picked,setPicked]=useState<Partial<Record<JukeboxRecordId,number>>>({});
  // Arriving from a record's "Test your ears" link (/learn#learn-<id>) highlights that record's card.
  const [arrived]=useState(()=>location.hash.startsWith('#learn-')?location.hash.slice(7):null);
  const asked=jukeboxRecords.filter(r=>LEARN[r.id]);
  const answered=asked.filter(r=>picked[r.id]!==undefined).length,right=asked.filter(r=>picked[r.id]===LEARN[r.id]!.answer).length;
  return <><header className="sp-page-heading"><p className="ss-kicker">{t('LEARN / LISTEN AND THINK')}</p><h1 tabIndex={-1}>{t('What did you hear?')}</h1><p>{t('One question for each record. Play the record, listen for one thing, then pick an answer to see why. Nothing is saved or sent.')}</p></header>
    <p className="ln-score" role="status">{answered===0?t('Pick any question to start.'):`${t('Answered')} ${answered} ${t('of')} ${asked.length} · ${right} ${t('right')}`}{answered>0&&<button type="button" className="sp-text-button" onClick={()=>setPicked({})}>{t('Start again')}</button>}</p>
    <ol className="ln-grid">{asked.map(record=>{const q=LEARN[record.id]!,choice=picked[record.id],done=choice!==undefined,ok=choice===q.answer;return <li key={record.id} id={`learn-${record.id}`} className={`ln-card${arrived===record.id?' is-arrived':''}`} data-state={done?(ok?'right':'wrong'):'open'}>
      <div className="ln-head"><span className="ln-num">{record.number}</span><h2>{t(record.title)}</h2></div>
      <p className="ln-listen"><b>{t('Listen for')}:</b> {t(q.listen)} <a href={`/listen?record=${record.id}`}>{t('Hear it')} →</a></p>
      <fieldset><legend>{t(q.ask)}</legend>{q.options.map((option,i)=><label key={option} data-answer={done&&i===q.answer?'yes':undefined}><input type="radio" name={`learn-${record.id}`} checked={choice===i} onChange={()=>setPicked(p=>({...p,[record.id]:i}))}/><span>{t(option)}</span></label>)}</fieldset>
      <p className="ln-why" aria-live="polite">{done&&<><b>{t(ok?'Yes!':'Not quite.')}</b> {t(q.why)}</>}</p>
    </li>;})}</ol>
    <p className="sp-bottom-note">{t('These questions are for practice and fun. TerraJuke has not run a study of what people learn from them.')}</p></>;
}
