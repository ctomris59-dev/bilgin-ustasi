import { useEffect, useState } from "react";
import AppShell from "./components/shell/AppShell";
import HeroHub from "./components/v47/HeroHub";
import ShopHub from "./components/v47/ShopHub";
import LessonsHub from "./components/v47/LessonsHub";
import TasksHub from "./components/v47/TasksHub";
import CompanionHub from "./components/v47/CompanionHub";
import BaseHub from "./components/v47/BaseHub";
import LeaderboardHub from "./components/v47/LeaderboardHub";
import TestSolver from "./components/TestSolver";
import ResultScreen from "./components/ResultScreen";
import { createDefaultProfile, getLocalProfile, saveLocalProfile, normalizeProfile } from "./lib/storage";
import { fetchCloudData, pushProfile } from "./lib/github";
import { calcTestRewards, updateStreak } from "./lib/gamification";
import { generatePracticeTest } from "./lib/practiceGenerator";
import { getWorldById } from "./data/worlds";
import { getLevelInfo } from "./data/levels";
import { playCoin, playPop } from "./lib/sound";
import { SETS, getSetItemIds, makeAvatarForSet } from "./data/avatarParts";

export default function V47App() {
  const [profile,setProfile]=useState(null); const [tests,setTests]=useState([]); const [tab,setTab]=useState("wardrobe");
  const [loading,setLoading]=useState(true); const [syncStatus,setSyncStatus]=useState("loading");
  const [activeTest,setActiveTest]=useState(null); const [pendingResult,setPendingResult]=useState(null); const [toast,setToast]=useState(null);
  useEffect(()=>{init();},[]);
  async function init(){const local=getLocalProfile();try{const cloud=await fetchCloudData();const cloudProfile=normalizeProfile(cloud.profile);const next=cloudProfile||local||createDefaultProfile();setProfile(next);setTests(cloud.tests||[]);saveLocalProfile(next);setSyncStatus("synced");}catch{setProfile(local||createDefaultProfile());setSyncStatus("offline");}finally{setLoading(false);}}
  async function persist(next){setProfile(next);saveLocalProfile(next);try{await pushProfile(next);setSyncStatus("synced");}catch{setSyncStatus("offline");}}
  function notify(message){setToast(message);window.setTimeout(()=>setToast(null),2400);}
  function startTest(test){if(!test)return;playPop();setActiveTest({test,isRetryTest:false});}
  function generatePractice(subject){const test=generatePracticeTest(subject,tests);if(!test){notify("Bu ders için soru havuzu hazırlanıyor.");return;}startTest(test);}
  function finishTest(result){const rewards=calcTestRewards({correctCount:result.correctCount,totalCount:result.totalCount,isRetryTest:false});const gemsEarned=result.correctCount===result.totalCount?1:0;const next={...profile,xp:(profile.xp||0)+rewards.xp,coins:(profile.coins||0)+rewards.coins,gems:(profile.gems||0)+gemsEarned,history:[...(profile.history||[]),{id:`h${Date.now()}`,testId:result.testId,subject:result.subject,date:new Date().toISOString(),correctCount:result.correctCount,totalCount:result.totalCount,xpEarned:rewards.xp,coinsEarned:rewards.coins,isRetry:false}],mistakeBox:[...(profile.mistakeBox||[]),...(result.wrongQuestions||[]).map((q)=>({id:`m${Date.now()}-${q.id}`,testId:result.testId,subject:result.subject,question:q,addedAt:new Date().toISOString(),resolved:false}))],stats:{...(profile.stats||{}),testsBySubject:{...(profile.stats?.testsBySubject||{}),[result.subject]:(profile.stats?.testsBySubject?.[result.subject]||0)+1},fullScoreBySubject:{...(profile.stats?.fullScoreBySubject||{}),...(result.correctCount===result.totalCount?{[result.subject]:(profile.stats?.fullScoreBySubject?.[result.subject]||0)+1}:{})}}};next.streak=updateStreak(next,new Date().toISOString());persist(next);setActiveTest(null);setPendingResult({result:{...result,fullScore:result.correctCount===result.totalCount},xpEarned:rewards.xp,coinsEarned:rewards.coins,speedBonus:0,newBadges:[],newLegendaryItems:[],newSticker:null,boostActive:false,gemsEarned});}
  function changeAvatar(avatar){persist({...profile,avatar});}
  function changePet(pet){persist({...profile,pet});}
  function buyItem(item){if(!item?.set||!SETS[item.set])return;const setMeta=SETS[item.set];const setIds=getSetItemIds(item.set);const alreadyOwned=setIds.every((id)=>(profile.unlockedItems||[]).includes(id));if(alreadyOwned){persist({...profile,avatar:makeAvatarForSet(item.set,profile.avatar)});notify(`${setMeta.label} kuşanıldı.`);return;}const requiredLevel=getWorldById(item.world)?.unlockLevel||1;if(getLevelInfo(profile.xp||0).current.level<requiredLevel){notify(`Bu set için Seviye ${requiredLevel} gerekiyor.`);return;}if((profile.coins||0)<setMeta.setPrice){notify("Yeterli coin yok.");return;}playCoin();const unlocked=[...new Set([...(profile.unlockedItems||[]),...setIds])];persist({...profile,coins:(profile.coins||0)-setMeta.setPrice,unlockedItems:unlocked,avatar:makeAvatarForSet(item.set,profile.avatar)});notify(`${setMeta.label} açıldı ve kuşanıldı!`);}
  if(loading||!profile)return <div className="v47-loading"><span>✦</span><h1>Bilgin Kaşif Üssü hazırlanıyor...</h1></div>;
  const focusMode=Boolean(activeTest||pendingResult); const activeSection=activeTest?"test":pendingResult?"result":tab;
  let content;
  if(activeTest) content=<div className="v493-test-fit"><TestSolver test={activeTest.test} isRetryTest={false} onFinish={finishTest} onCancel={()=>setActiveTest(null)} onPause={()=>setActiveTest(null)}/></div>;
  else if(pendingResult) content=<div className="v493-result-fit"><ResultScreen {...pendingResult} onClose={()=>{setPendingResult(null);setTab("lessons");}}/></div>;
  else if(tab==="wardrobe") content=<HeroHub profile={profile} onChangeAvatar={changeAvatar} onOpenLessons={()=>setTab("lessons")} onOpenShop={()=>setTab("shop")}/>;
  else if(tab==="shop") content=<ShopHub profile={profile} onBuyItem={buyItem} onOpenHero={()=>setTab("wardrobe")}/>;
  else if(tab==="lessons") content=<LessonsHub profile={profile} tests={tests} onStartTest={startTest} onGeneratePractice={generatePractice}/>;
  else if(tab==="dashboard") content=<TasksHub profile={profile} tests={tests} onStartTest={startTest} onOpenLessons={()=>setTab("lessons")}/>;
  else if(tab==="pets") content=<CompanionHub profile={profile} onChangePet={changePet}/>;
  else if(tab==="base") content=<BaseHub profile={profile}/>;
  else if(tab==="leaderboard") content=<LeaderboardHub profile={profile}/>;
  else content=<HeroHub profile={profile} onChangeAvatar={changeAvatar} onOpenLessons={()=>setTab("lessons")} onOpenShop={()=>setTab("shop")}/>;
  return <><AppShell profile={profile} tests={tests} syncStatus={syncStatus} activeSection={activeSection} tab={tab} onChangeTab={setTab} focusMode={focusMode}>{content}</AppShell>{toast&&<div className="v47-toast">{toast}</div>}</>;
}
