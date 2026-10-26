/* =========================================================
   MONSTER BATTLE ARENA - ENHANCED FRONTEND PROTOTYPE
   HTML/CSS/JavaScript only. Data is temporary until Java/MySQL.
   ========================================================= */

let username = "";
let playerLevel = 1;
let playerXP = 0;
let playerCoins = 100;
let puzzleEnergy = 50;

const monsters = {
    Blazion: {
        type: "FIRE", hp: 100, attack: 25, defense: 20, icon: "🔥", level: 5, xp: 0,
        basic: [
            {name:"Flame Claw", damage:15, desc:"A quick fire-infused strike."},
            {name:"Fire Fang", damage:20, desc:"A powerful close-range bite."},
            {name:"Ember Shot", damage:25, desc:"Launches burning embers."},
            {name:"Blaze Rush", damage:30, desc:"A fast flaming charge."}
        ],
        energy: [
            {name:"Flame Burst", damage:40, cost:20, required:2, desc:"Explodes with concentrated fire."},
            {name:"Inferno Wave", damage:55, cost:35, required:6, desc:"A wide wave of intense flames."},
            {name:"Solar Flare", damage:75, cost:50, required:10, desc:"A high-level burst of solar fire."}
        ],
        defenseMoves: [
            {name:"Fire Guard", damage:8, reduction:60, cost:15, required:1, desc:"Reduces the next incoming damage."},
            {name:"Blazing Counter", damage:18, reduction:50, cost:25, required:7, desc:"Blocks damage and counters the enemy."}
        ],
        oneBlow: {damage:100, cost:80, required:5, desc:"A rare ultimate strike. Usable once per battle."}
    },
    Aquarion: {
        type: "WATER", hp: 110, attack: 22, defense: 23, icon: "💧", level: 1, xp: 0,
        basic: [
            {name:"Water Jab", damage:14, desc:"A fast water-powered hit."},
            {name:"Aqua Tail", damage:19, desc:"A sweeping water attack."},
            {name:"Bubble Shot", damage:24, desc:"Fires compressed bubbles."},
            {name:"Tidal Crash", damage:29, desc:"Crashes into the opponent like a wave."}
        ],
        energy: [
            {name:"Aqua Blast", damage:38, cost:20, required:2, desc:"A concentrated water blast."},
            {name:"Tidal Wave", damage:54, cost:35, required:6, desc:"A huge wave attacks the opponent."},
            {name:"Ocean Fury", damage:74, cost:50, required:10, desc:"A powerful high-level water attack."}
        ],
        defenseMoves: [
            {name:"Water Shield", damage:7, reduction:60, cost:15, required:1, desc:"Forms a protective water barrier."},
            {name:"Healing Guard", damage:12, reduction:50, cost:25, required:7, desc:"Blocks damage and restores a little HP."}
        ],
        oneBlow: {damage:100, cost:80, required:5, desc:"A massive water strike. Usable once per battle."}
    },
    Floragon: {
        type: "GRASS", hp: 105, attack: 24, defense: 22, icon: "🌿", level: 1, xp: 0,
        basic: [
            {name:"Leaf Slash", damage:15, desc:"Cuts the enemy with sharp leaves."},
            {name:"Vine Whip", damage:20, desc:"A fast strike using vines."},
            {name:"Seed Shot", damage:24, desc:"Launches hardened seeds."},
            {name:"Nature Rush", damage:29, desc:"Charges with natural energy."}
        ],
        energy: [
            {name:"Leaf Storm", damage:40, cost:20, required:2, desc:"A storm of sharp leaves."},
            {name:"Root Burst", damage:55, cost:35, required:6, desc:"Roots burst from the ground."},
            {name:"Forest Fury", damage:75, cost:50, required:10, desc:"A powerful attack from nature."}
        ],
        defenseMoves: [
            {name:"Vine Guard", damage:8, reduction:60, cost:15, required:1, desc:"Vines absorb the next attack."},
            {name:"Thorn Counter", damage:18, reduction:50, cost:25, required:7, desc:"Protects and strikes back."}
        ],
        oneBlow: {damage:100, cost:80, required:5, desc:"A devastating nature strike. Usable once per battle."}
    },
    Voltix: {
        type: "ELECTRIC", hp: 95, attack: 28, defense: 18, icon: "⚡", level: 1, xp: 0,
        basic: [
            {name:"Spark Jab", damage:16, desc:"A quick electric punch."},
            {name:"Shock Bite", damage:21, desc:"An electrified close-range attack."},
            {name:"Bolt Shot", damage:26, desc:"Fires a concentrated bolt."},
            {name:"Thunder Rush", damage:31, desc:"A fast electric charge."}
        ],
        energy: [
            {name:"Thunder Bolt", damage:42, cost:20, required:2, desc:"A powerful lightning strike."},
            {name:"Voltage Burst", damage:58, cost:35, required:6, desc:"Releases stored electric energy."},
            {name:"Thunder Storm", damage:78, cost:50, required:10, desc:"A high-level electric storm."}
        ],
        defenseMoves: [
            {name:"Electric Guard", damage:8, reduction:60, cost:15, required:1, desc:"Electrifies the defence barrier."},
            {name:"Static Counter", damage:20, reduction:50, cost:25, required:7, desc:"Blocks and shocks the attacker."}
        ],
        oneBlow: {damage:105, cost:80, required:5, desc:"A devastating lightning strike. Usable once per battle."}
    }
};

const typeChart = {
    FIRE: {strong:"GRASS", weak:"WATER", neutral:"ELECTRIC"},
    WATER: {strong:"FIRE", weak:"ELECTRIC", neutral:"GRASS"},
    GRASS: {strong:"WATER", weak:"FIRE", neutral:"ELECTRIC"},
    ELECTRIC: {strong:"WATER", weak:"GRASS", neutral:"FIRE"}
};

let ownedMonsters = ["Blazion"];
const unlockCost = 50;
const monsterUpgradeCost = 25;

let battleType = "AI";
let selectedMonster = "";
let playerMonster = "";
let enemyMonster = "";
let playerHP = 100;
let enemyHP = 100;
let playerMaxHP = 100;
let enemyMaxHP = 100;
let defenseActive = false;
let defenseReduction = 0;
let oneBlowUsed = false;
let battleOver = false;
let playerTurn = true;
let pvpSelectionStage = 1;
let player1Monster = "";
let player2Monster = "";
let pvpEnergy1 = 50;
let pvpEnergy2 = 50;
let currentPvpPlayer = 1;
let puzzleSolved = false;
let detailsMonster = "";
let battleBusy = false;

function showScreen(screenId) {
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    const target = document.getElementById(screenId);
    if (target) target.classList.add("active");
}


async function login() {

    const u = document.getElementById("usernameInput").value.trim();
    const p = document.getElementById("passwordInput").value;
    const error = document.getElementById("loginError");

    if (!u) {
        error.textContent = "Please enter a username.";
        return;
    }

    if (!p) {
        error.textContent = "Please enter a password.";
        return;
    }

    error.textContent = "Checking login...";

    try {

        // Step 1: Verify password or register new player
        const formData = new URLSearchParams();

        formData.append("action", "login");
        formData.append("username", u);
        formData.append("password", p);

        const loginResponse = await fetch("player", {

            method: "POST",

            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },

            body: formData

        });

        const loginData = await loginResponse.json();

        if (!loginResponse.ok || !loginData.success) {

            error.textContent =
                loginData.message || "Login failed.";

            return;
        }

        // Step 2: Load saved player information
        error.textContent = "Loading player data...";

        const response = await fetch(
            "player?username=" + encodeURIComponent(u)
        );

        const data = await response.json();

        if (!response.ok || !data.success) {

            error.textContent =
                "Unable to load player data.";

            return;
        }

        // Step 3: Load player information
        username = data.username;

        playerCoins = data.coins;
        playerXP = data.xp;
        playerLevel = data.level;
        puzzleEnergy = data.energy;

        ownedMonsters = data.monsters;

        // Step 4: Update username
        document.getElementById("menuUsername").textContent =
            username;

        // Step 5: Update player statistics
        updatePlayerStats();

        // Step 6: Update monster collection
        updateMonsterCollection();

        updateMonsterSelection();

        // Step 7: Open game menu
        error.textContent = "";

        showScreen("menuScreen");

    } catch (e) {

        console.error("Player login error:", e);

        error.textContent =
            "Unable to connect to the server.";

    }
}

function updatePlayerStats() {
    const set = (id, value) => { const e=document.getElementById(id); if(e) e.textContent=value; };
    set("menuLevel", playerLevel); set("menuCoins", playerCoins); set("menuEnergy", puzzleEnergy);
    set("puzzleEnergy", puzzleEnergy); set("collectionEnergy", puzzleEnergy); set("detailsEnergy", puzzleEnergy);
    set("profileUsername", username || "Player"); set("profileLevel", playerLevel); set("profileXP", playerXP);
    set("profileCoins", playerCoins); set("profileEnergy", puzzleEnergy); set("profileMonsters", ownedMonsters.length);
    updateCollectionStats();
}

async function savePlayerProgress() {

    if (!username) {
        console.log("Player not logged in.");
        return false;
    }

    try {

        const formData = new URLSearchParams();

        formData.append("username", username);
        formData.append("coins", playerCoins);
        formData.append("xp", playerXP);
        formData.append("level", playerLevel);
        formData.append("energy", puzzleEnergy);
        formData.append("monsters", ownedMonsters.join(","));

        const response = await fetch("player", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: formData
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            console.error("Player save failed:", data);
            return false;
        }

        console.log("Player progress saved successfully.");

        return true;

    } catch (error) {

        console.error("Error saving player progress:", error);

        return false;
    }
}


function openBattleMode(){ showScreen("battleModeScreen"); }

let puzzles = [];
let currentPuzzleIndex = 0;

// Open Puzzle Mode
async function openPuzzleMode() {

    puzzleSolved = false;
    currentPuzzleIndex = 0;

    document.getElementById("puzzleResult").textContent = "";

    document.getElementById("nextPuzzleBtn").style.display = "none";

    document.getElementById("puzzleQuestion").textContent =
        "Loading puzzles...";

    document.getElementById("puzzleAnswer").value = "";

    document.getElementById("puzzleAnswer").disabled = false;

    document.getElementById("submitPuzzleBtn").disabled = false;

    updatePlayerStats();

    showScreen("puzzleScreen");

    try {

        const response = await fetch("puzzle");

        if (!response.ok) {
            throw new Error("Failed to load puzzles");
        }

        puzzles = await response.json();

        if (puzzles.length === 0) {

            document.getElementById("puzzleQuestion").textContent =
                "No puzzles available.";

            return;
        }

        loadCurrentPuzzle();

    } catch (error) {

        document.getElementById("puzzleQuestion").textContent =
            "Unable to load puzzles.";

        console.error(error);
    }
}


// Display current puzzle
function loadCurrentPuzzle() {

    if (currentPuzzleIndex >= puzzles.length) {

        document.getElementById("puzzleQuestion").textContent =
            "🎉 You completed all puzzles!";

        document.getElementById("puzzleAnswer").style.display = "none";

        document.getElementById("submitPuzzleBtn").style.display = "none";

        document.getElementById("nextPuzzleBtn").style.display = "none";

        return;
    }

    const puzzle = puzzles[currentPuzzleIndex];

    document.getElementById("puzzleQuestion").textContent =
        puzzle.question;

    document.getElementById("puzzleAnswer").value = "";

    document.getElementById("puzzleAnswer").style.display = "inline-block";

    document.getElementById("puzzleAnswer").disabled = false;

    document.getElementById("puzzleResult").textContent = "";

    document.getElementById("nextPuzzleBtn").style.display = "none";

    document.getElementById("submitPuzzleBtn").style.display = "inline-block";

    document.getElementById("submitPuzzleBtn").disabled = false;

    puzzleSolved = false;
}

function openMonsters(){ updateMonsterCollection(); updatePlayerStats(); showScreen("monsterScreen"); }
function openProfile(){ updatePlayerStats(); showScreen("profileScreen"); }
function backToMenu(){ updatePlayerStats(); showScreen("menuScreen"); }

function startAISelection(){
    battleType="AI"; selectedMonster="";
    document.getElementById("selectionTitle").textContent="Choose Your Monster";
    document.getElementById("selectionInstruction").textContent="Select one of your owned monsters.";
    updateMonsterSelection(); showScreen("monsterSelectionScreen");
}

function startPvPSelection(){
    battleType="PVP"; pvpSelectionStage=1; player1Monster=""; player2Monster=""; selectedMonster="";
    document.getElementById("selectionTitle").textContent="Player 1 - Choose Monster";
    document.getElementById("selectionInstruction").textContent="Player 1: select your monster.";
    updateMonsterSelection(); showScreen("monsterSelectionScreen");
}

function updateMonsterSelection(){
    Object.keys(monsters).forEach(name=>{
        const card=document.getElementById("select-"+name), status=document.getElementById(name+"SelectStatus");
        if(!card) return;
        const owned=ownedMonsters.includes(name);
        card.classList.toggle("locked",!owned); card.classList.toggle("selectable",owned);
        if(status) status.textContent=owned ? `✓ OWNED • LV ${monsters[name].level}` : "🔒 LOCKED";
        const info=card.querySelector(".monster-info");
        if(info) info.innerHTML=`<span>❤️ ${monsters[name].hp} HP</span><span>⚔️ ${monsters[name].attack} ATK</span>`;
    });
    const btn=document.getElementById("continueSelectionBtn"); if(btn) btn.disabled=!selectedMonster;
}

function selectMonster(name){
    if(!ownedMonsters.includes(name)){ alert("This monster is locked. Unlock it from My Monsters."); return; }
    selectedMonster=name;
    document.querySelectorAll("#monsterSelectionScreen .monster-card").forEach(c=>c.classList.remove("selected"));
    const c=document.getElementById("select-"+name); if(c)c.classList.add("selected");
    document.getElementById("continueSelectionBtn").disabled=false;
}

function confirmMonster(){
    if(!selectedMonster){ alert("Please select a monster."); return; }
    if(battleType==="AI"){ startAIBattle(); return; }
    if(pvpSelectionStage===1){
        player1Monster=selectedMonster; pvpSelectionStage=2; selectedMonster="";
        document.getElementById("selectionTitle").textContent="Player 2 - Choose Monster";
        document.getElementById("selectionInstruction").textContent="Player 2: select a monster.";
        updateMonsterSelection(); return;
    }
    player2Monster=selectedMonster; startPvPBattle();
}

function startAIBattle(){
    playerMonster=selectedMonster;
    const choices=Object.keys(monsters).filter(n=>n!==playerMonster);
    enemyMonster=choices[Math.floor(Math.random()*choices.length)];
    setupBattle();
}
function startPvPBattle(){
    playerMonster=player1Monster; enemyMonster=player2Monster; currentPvpPlayer=1;
    pvpEnergy1=50; pvpEnergy2=50; setupBattle();
}

function setupBattle(){
    playerMaxHP=getBattleMonster(playerMonster).hp; enemyMaxHP=getBattleMonster(enemyMonster).hp;
    playerHP=playerMaxHP; enemyHP=enemyMaxHP; defenseActive=false; defenseReduction=0; oneBlowUsed=false;
    battleOver=false; playerTurn=true; battleBusy=false; closeAttackMenu(); closeBattleSwitch();
    document.getElementById("battleModeLabel").textContent=battleType==="AI"?"AI Battle":"Local PvP";
    updateBattleUI(); updateBattleEnergy(); updateAttackButtons();
    battleMessage(battleType==="AI"?"Battle started! Your turn.":"Player 1's turn!");
    showScreen("battleScreen");
}

function getBattleMonster(name){ return monsters[name]; }
function getActiveMonsterName(){ return battleType==="PVP" && currentPvpPlayer===2 ? player2Monster : playerMonster; }
function getActiveMonster(){ return monsters[getActiveMonsterName()]; }

function updateBattleUI(){
    const p=getBattleMonster(playerMonster), e=getBattleMonster(enemyMonster);
    const set=(id,v)=>{const el=document.getElementById(id);if(el)el.textContent=v;};
    set("playerName",playerMonster+" • Lv "+p.level); set("enemyName",enemyMonster+" • Lv "+e.level);
    set("playerMonsterDisplay",p.icon); set("enemyMonsterDisplay",e.icon);
    const pp=Math.max(0,playerHP/playerMaxHP*100), ep=Math.max(0,enemyHP/enemyMaxHP*100);
    const pb=document.getElementById("playerHPBar"), eb=document.getElementById("enemyHPBar");
    if(pb)pb.style.width=pp+"%"; if(eb)eb.style.width=ep+"%";
    set("playerHPText",`${Math.max(0,playerHP)} / ${playerMaxHP}`); set("enemyHPText",`${Math.max(0,enemyHP)} / ${enemyMaxHP}`);
    set("battleLevel",p.level);
    const one=document.getElementById("oneBlowInfo"); if(one) one.textContent=`${p.oneBlow.cost} Energy • Lv ${p.oneBlow.required} • Once/Battle`;
}

function getCurrentEnergy(){
    if(battleType==="PVP") return currentPvpPlayer===1?pvpEnergy1:pvpEnergy2;
    return puzzleEnergy;
}
function spendEnergy(amount){
    if(getCurrentEnergy()<amount)return false;
    if(battleType==="PVP"){
        if(currentPvpPlayer===1)pvpEnergy1-=amount; else pvpEnergy2-=amount;
    } else puzzleEnergy-=amount;
    updateBattleEnergy(); updatePlayerStats(); return true;
}
function updateBattleEnergy(){ const e=document.getElementById("battleEnergy"); if(e)e.textContent=getCurrentEnergy(); }
function isCurrentPlayerTurn(){ return !battleOver && !battleBusy && (battleType==="AI" ? playerTurn : true); }

function updateAttackButtons(){
    const turn=isCurrentPlayerTurn(), m=getActiveMonster();
    const n=document.getElementById("normalAttackBtn"), e=document.getElementById("energyAttackBtn"), d=document.getElementById("defenseAttackBtn"), o=document.getElementById("oneBlowBtn"), s=document.getElementById("switchMonsterBtn");
    if(n)n.disabled=!turn; if(s)s.disabled=!turn || ownedMonsters.length<2;
    if(e)e.disabled=!turn || m.level<2;
    if(d)d.disabled=!turn || m.level<1;
    if(o)o.disabled=!turn || m.level<m.oneBlow.required || getCurrentEnergy()<m.oneBlow.cost || oneBlowUsed;
}

function toggleAttackMenu(type){
    if(!isCurrentPlayerTurn())return;
    const panel=document.getElementById("attackChoicePanel"), title=document.getElementById("attackChoiceTitle"), list=document.getElementById("attackChoiceList");
    const m=getActiveMonster(); let moves=[];
    if(type==="normal"){title.textContent="⚔️ Choose Basic Attack";moves=m.basic.map((x,i)=>({...x,kind:"basic",index:i}));}
    if(type==="energy"){title.textContent="⚡ Choose Energy Attack";moves=m.energy.map((x,i)=>({...x,kind:"energy",index:i}));}
    if(type==="defense"){title.textContent="🛡️ Choose Defence Skill";moves=m.defenseMoves.map((x,i)=>({...x,kind:"defense",index:i}));}
    list.innerHTML=moves.map(move=>{
        const locked=move.required!==undefined && m.level<move.required;
        const insufficient=move.cost!==undefined && getCurrentEnergy()<move.cost;
        const disabled=locked||insufficient;
        const meta=move.cost!==undefined?`<span>⚡ ${move.cost} Energy</span>`:"<span>Free</span>";
        return `<button class="move-choice" ${disabled?"disabled":""} onclick="useSelectedMove('${type}',${move.index})"><strong>${move.name}</strong><div class="move-meta"><span>💥 ${move.damage} Damage</span>${meta}</div><div class="move-description">${locked?`🔒 Unlocks at Level ${move.required}`:insufficient?`⚠️ Need ${move.cost} Energy`:move.desc}</div></button>`;
    }).join("");
    panel.style.display="block";
}
function closeAttackMenu(){const p=document.getElementById("attackChoicePanel");if(p)p.style.display="none";}
function useSelectedMove(type,index){
    const m=getActiveMonster();
    if(type==="normal")performMove(m.basic[index],"basic");
    else if(type==="energy")performMove(m.energy[index],"energy");
    else performMove(m.defenseMoves[index],"defense");
}
function performMove(move,kind){
    if(!isCurrentPlayerTurn())return;
    closeAttackMenu(); battleBusy=true;
    if(kind!=="basic" && !spendEnergy(move.cost)){battleBusy=false;alert("Not enough Puzzle Energy.");updateAttackButtons();return;}
    const m=getActiveMonster();
    if(kind==="defense"){
        defenseActive=true; defenseReduction=move.reduction; addShieldEffect();
        battleMessage(`🛡️ ${m.icon} ${move.name} activated! Next damage reduced by ${move.reduction}%.`);
    } else {
        let damage=move.damage + Math.floor(Math.max(0,m.level-1)*1.5);
        damage=applyTypeMultiplier(damage,m.type, getTargetMonster().type);
        battleMessage(`${m.icon} ${m.name||getActiveMonsterName()} used ${move.name}! ${damage} damage.`);
        animateAttack("playerMonsterDisplay");
        setTimeout(()=>attackEnemyTarget(damage),250);
        return;
    }
    setTimeout(()=>afterPlayerAction(),450);
}

function applyTypeMultiplier(damage,attacker,defender){
    if(typeChart[attacker]?.strong===defender)return Math.floor(damage*1.5);
    if(typeChart[attacker]?.weak===defender)return Math.floor(damage*0.7);
    return damage;
}
function getTargetMonster(){ return monsters[battleType==="PVP" && currentPvpPlayer===2 ? player1Monster : enemyMonster]; }

function normalAttack(){toggleAttackMenu("normal");}
function energyAttack(){toggleAttackMenu("energy");}
function defenseAttack(){toggleAttackMenu("defense");}

function oneBlow(){
    if(!isCurrentPlayerTurn())return;
    const m=getActiveMonster();
    if(oneBlowUsed){alert("One Blow can only be used once per battle.");return;}
    if(m.level<m.oneBlow.required){alert(`One Blow unlocks at Monster Level ${m.oneBlow.required}.`);return;}
    if(!spendEnergy(m.oneBlow.cost)){alert(`You need ${m.oneBlow.cost} Puzzle Energy.`);return;}
    oneBlowUsed=true; battleBusy=true; showOneBlowEffect();
    let damage=m.oneBlow.damage + Math.max(0,m.level-m.oneBlow.required)*8;
    damage=applyTypeMultiplier(damage,m.type,getTargetMonster().type);
    battleMessage(`💥 ${getActiveMonsterName()} unleashed ONE BLOW! ${damage} damage!`);
    setTimeout(()=>attackEnemyTarget(damage),500);
}

function attackEnemyTarget(damage){
    enemyHP=Math.max(0,enemyHP-damage); showDamage(damage,"enemyMonsterDisplay"); animateHit("enemyMonsterDisplay"); updateBattleUI();
    if(enemyHP<=0){setTimeout(winBattle,550);return;}
    afterPlayerAction();
}
function afterPlayerAction(){
    if(battleOver)return;
    battleBusy=false;
    if(battleType==="AI") endPlayerTurn(); else switchPvpTurn();
}
function endPlayerTurn(){
    playerTurn=false; updateAttackButtons(); battleMessage("🤖 Enemy's turn...");
    setTimeout(enemyAttack,800);
}
function enemyAttack(){
    if(battleOver)return;
    const enemy=monsters[enemyMonster]; let damage=enemy.basic[Math.floor(Math.random()*enemy.basic.length)].damage + Math.floor(enemy.level*1.5);
    damage=applyTypeMultiplier(damage,enemy.type,getBattleMonster(playerMonster).type);
    animateAttack("enemyMonsterDisplay");
    setTimeout(()=>attackPlayerTarget(damage),300);
}
function attackPlayerTarget(damage){
    if(defenseActive){damage=Math.floor(damage*(1-defenseReduction/100));battleMessage(`🛡️ Defence reduced incoming damage to ${damage}!`);defenseActive=false;defenseReduction=0;removeShieldEffect();}
    playerHP=Math.max(0,playerHP-damage);showDamage(damage,"playerMonsterDisplay");animateHit("playerMonsterDisplay");updateBattleUI();
    if(playerHP<=0){setTimeout(()=>battleType==="PVP"?pvpVictory(2):loseBattle(),600);return;}
    if(battleType==="AI"){playerTurn=true;battleBusy=false;battleMessage("🔥 Your turn! Choose an attack.");updateBattleEnergy();updateAttackButtons();}
    else switchPvpTurn();
}

function openBattleSwitch(){
    if(!isCurrentPlayerTurn())return;
    const panel=document.getElementById("battleSwitchPanel"),list=document.getElementById("battleSwitchList");
    const available=ownedMonsters.filter(n=>n!==getActiveMonsterName());
    list.innerHTML=available.map(name=>{
        const m=monsters[name];
        return `<button class="switch-choice" onclick="switchBattleMonster('${name}')"><strong>${m.icon} ${name}</strong><div class="move-meta"><span>Lv ${m.level}</span><span>❤️ ${m.hp} HP</span></div><div class="move-description">${m.type} • ${typeChart[m.type].strong} advantage</div></button>`;
    }).join("");
    panel.style.display="block"; closeAttackMenu();
}
function closeBattleSwitch(){const p=document.getElementById("battleSwitchPanel");if(p)p.style.display="none";}
function switchBattleMonster(name){
    if(!isCurrentPlayerTurn()||!ownedMonsters.includes(name))return;
    closeBattleSwitch();
    playerMonster=name; playerMaxHP=monsters[name].hp; playerHP=playerMaxHP; defenseActive=false; defenseReduction=0; removeShieldEffect();
    battleBusy=true; updateBattleUI(); updateAttackButtons(); battleMessage(`🔄 You switched to ${name}! The switch uses your turn.`);
    if(battleType==="AI")endPlayerTurn(); else switchPvpTurn();
}

function switchPvpTurn(){
    if(battleOver)return;
    currentPvpPlayer=currentPvpPlayer===1?2:1;
    playerMonster=currentPvpPlayer===1?player1Monster:player2Monster;
    enemyMonster=currentPvpPlayer===1?player2Monster:player1Monster;
    playerMaxHP=monsters[playerMonster].hp;
    enemyMaxHP=monsters[enemyMonster].hp;
    playerHP=Math.min(playerHP,playerMaxHP); enemyHP=Math.min(enemyHP,enemyMaxHP);
    battleBusy=false; battleMessage(`Player ${currentPvpPlayer}'s turn!`);updateBattleUI();updateBattleEnergy();updateAttackButtons();
}


async function pvpVictory(winner){

    battleOver = true;

    updateAttackButtons();

    if(winner === 1){

        playerCoins += 50;

        playerXP += 50;

        checkLevelUp();

        showResult(true, 50, 50);

        // Save PvP rewards
        const saved = await savePlayerProgress();

        if(saved){
            console.log("PvP rewards saved successfully.");
        }else{
            console.error("PvP rewards saving failed.");
        }

    }else{

        showResult(false, 0, 0);

    }
}


async function winBattle(){

    battleOver = true;

    playerCoins += 50;

    playerXP += 50;

    checkLevelUp();

    showResult(true, 50, 50);

    // Save player progress to MySQL
    const saved = await savePlayerProgress();

    if (saved) {
        console.log("Battle rewards saved successfully.");
    } else {
        console.error("Battle rewards saving failed.");
    }
}

function loseBattle(){battleOver=true;showResult(false,0,0);}
function showResult(victory,xp,coins){
    document.getElementById("resultIcon").textContent=victory?"🏆":"💀";
    document.getElementById("resultTitle").textContent=victory?"Victory!":"Defeat";
    document.getElementById("resultMessage").textContent=victory?"Congratulations! You won the battle.":"Your monster was defeated. Train and try again.";
    document.getElementById("resultXP").textContent=xp;document.getElementById("resultCoins").textContent=coins;updatePlayerStats();showScreen("resultScreen");
}
function checkLevelUp(){
    let leveled=false;
    while(playerXP>=playerLevel*100){playerXP-=playerLevel*100;playerLevel++;leveled=true;}
    if(leveled)alert(`🎉 Player Level Up! You are now Level ${playerLevel}.`);
}

function animateAttack(id){const e=document.getElementById(id);if(!e)return;e.classList.remove("attack-animation");void e.offsetWidth;e.classList.add("attack-animation");}
function animateHit(id){const e=document.getElementById(id);if(!e)return;e.classList.remove("hit-animation");void e.offsetWidth;e.classList.add("hit-animation");}
function showDamage(damage,id){const e=document.getElementById(id);if(!e)return;const r=e.getBoundingClientRect();const d=document.createElement("div");d.className="damage-number";d.textContent="-"+damage;d.style.left=r.left+r.width/2+"px";d.style.top=r.top+"px";document.body.appendChild(d);setTimeout(()=>d.remove(),1000);}
function showEnergyEffect(){const e=document.getElementById("playerMonsterDisplay");if(e){e.classList.add("one-blow-effect");setTimeout(()=>e.classList.remove("one-blow-effect"),800);}}
function addShieldEffect(){const e=document.getElementById("playerMonsterDisplay");if(e)e.classList.add("shield-effect");}
function removeShieldEffect(){const e=document.getElementById("playerMonsterDisplay");if(e)e.classList.remove("shield-effect");}
function showOneBlowEffect(){showEnergyEffect();}
function showLevelUpEffect(){const e=document.getElementById("battleLevel");if(e)e.textContent=getActiveMonster().level;}
function battleMessage(message){const e=document.getElementById("battleMessage");if(e)e.textContent=message;}
function exitBattle(){battleOver=true;backToMenu();}

/* ================= PUZZLE ================= */

// Check answer using MySQL through PuzzleServlet

async function checkPuzzle() {

    if (puzzleSolved) {
        return;
    }

    const answerInput = document.getElementById("puzzleAnswer");

    const answer = answerInput.value.trim();

    const result = document.getElementById("puzzleResult");

    const submitButton = document.getElementById("submitPuzzleBtn");

    if (answer === "") {

        result.textContent = "Please enter an answer.";

        result.style.color = "#ff5d6c";

        return;
    }

    const puzzle = puzzles[currentPuzzleIndex];

    submitButton.disabled = true;

    result.textContent = "Checking answer...";

    try {

        const response = await fetch("puzzle", {

            method: "POST",

            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },

            body:
                "puzzle_id=" + encodeURIComponent(puzzle.puzzle_id) +
                "&answer=" + encodeURIComponent(answer)

        });

        if (!response.ok) {

            throw new Error("Answer checking failed");
        }

        const data = await response.json();

        if (data.correct) {

            puzzleSolved = true;

            puzzleEnergy += data.reward_energy;

            result.textContent =
                "✅ Correct! You earned +" +
                data.reward_energy +
                " Puzzle Energy.";

            result.style.color = "#43e58c";

            answerInput.disabled = true;

            document.getElementById("nextPuzzleBtn").style.display =
                "inline-block";

            updatePlayerStats();

            // Save player progress to MySQL
            const saved = await savePlayerProgress();

            if (saved) {
                console.log("Puzzle reward saved successfully.");
            } else {
                console.error("Puzzle reward saving failed.");
            }

        } else {

            result.textContent = "❌ Wrong answer. Try again.";

            result.style.color = "#ff5d6c";

            submitButton.disabled = false;
        }

    } catch (error) {

        result.textContent =
            "Unable to check answer. Please try again.";

        result.style.color = "#ff5d6c";

        submitButton.disabled = false;

        console.error(error);
    }
}



// Load next puzzle
function resetPuzzle() {

    if (!puzzleSolved) {
        return;
    }

    currentPuzzleIndex++;

    puzzleSolved = false;

    document.getElementById("puzzleAnswer").disabled = false;

    loadCurrentPuzzle();
}

/* ================= MONSTER COLLECTION ================= */
function updateCollectionStats(){
    Object.keys(monsters).forEach(name=>{
        const m=monsters[name];
        const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v;};
        set("collectionLevel-"+name,m.level);set("collectionHP-"+name,m.hp);set("collectionATK-"+name,m.attack);
    });
}
function updateMonsterCollection(){
    Object.keys(monsters).forEach(name=>{
        const card=document.getElementById("collection-"+name);if(!card)return;
        const owned=ownedMonsters.includes(name);card.classList.toggle("owned",owned);
        const status=document.getElementById(name+"Status");
        if(!status)return;
        if(owned)status.innerHTML='<span class="owned-label">✓ OWNED • VIEW DETAILS</span>';
        else status.innerHTML=`<button class="unlock-btn" onclick="event.stopPropagation(); unlockMonster('${name}')">🔓 Unlock - ${unlockCost} ⚡</button>`;
    });
    updateCollectionStats();
}


async function unlockMonster(name) {

    if (ownedMonsters.includes(name)) {
        alert(name + " is already unlocked.");
        return;
    }

    if (puzzleEnergy < unlockCost) {
        alert(`You need ${unlockCost} Puzzle Energy to unlock ${name}.`);
        return;
    }

    puzzleEnergy -= unlockCost;

    ownedMonsters.push(name);

    updatePlayerStats();
    updateMonsterCollection();
    updateMonsterSelection();

    const saved = await savePlayerProgress();

    if (saved) {
        alert(`🎉 ${name} has been unlocked and saved!`);
    } else {
        alert(`${name} unlocked, but saving failed.`);
    }
}


/* ================= MONSTER DETAILS / UPGRADES ================= */
function openMonsterDetails(name){
    if(!ownedMonsters.includes(name)){alert("Unlock this monster first.");return;}
    detailsMonster=name;renderMonsterDetails();showScreen("monsterDetailsScreen");
}
function closeMonsterDetails(){detailsMonster="";openMonsters();}
function renderMonsterDetails(){
    const m=monsters[detailsMonster], chart=typeChart[m.type];
    const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v;};
    set("detailsName",detailsMonster);set("detailsIcon",m.icon);set("detailsType",m.type);set("detailsTypeLabel",m.type);set("detailsLevel",m.level);
    set("detailsXP",m.xp);set("detailsXPRequired",m.level*100);set("detailsHP",m.hp);set("detailsATK",m.attack);set("detailsDEF",m.defense);set("detailsMaxEnergy",100+m.level*5);
    const xpBar=document.getElementById("detailsXPBar");if(xpBar)xpBar.style.width=Math.min(100,m.xp/(m.level*100)*100)+"%";
    const typeEl=document.getElementById("detailsType");if(typeEl)typeEl.className="monster-type "+m.type.toLowerCase();
    set("detailsStrongAgainst",chart.strong);set("detailsWeakAgainst",chart.weak);set("detailsNeutralAgainst",chart.neutral);set("detailsEnergy",puzzleEnergy);
    const basic=document.getElementById("detailsBasicAttacks");basic.innerHTML=m.basic.map(a=>`<div class="detail-attack"><strong>⚔️ ${a.name}</strong><p>💥 ${a.damage} Damage</p><p>${a.desc}</p></div>`).join("");
    const energy=document.getElementById("detailsEnergyAttacks");energy.innerHTML=m.energy.map(a=>{const locked=m.level<a.required;return `<div class="detail-attack ${locked?"locked-detail":""}"><strong>⚡ ${a.name}</strong><p>💥 ${a.damage} Damage • ⚡ ${a.cost}</p><p>${locked?`🔒 Unlocks at Level ${a.required}`:a.desc}</p></div>`}).join("");
    const def=document.getElementById("detailsDefenseAttacks");def.innerHTML=m.defenseMoves.map(a=>{const locked=m.level<a.required;return `<div class="detail-attack ${locked?"locked-detail":""}"><strong>🛡️ ${a.name}</strong><p>💥 ${a.damage} Counter • ${a.reduction}% Reduction • ⚡ ${a.cost}</p><p>${locked?`🔒 Unlocks at Level ${a.required}`:a.desc}</p></div>`}).join("");
    const one=document.getElementById("detailsOneBlow");const locked=m.level<m.oneBlow.required;one.innerHTML=`<strong>💥 One Blow</strong><p>💥 ${m.oneBlow.damage+Math.max(0,m.level-m.oneBlow.required)*8} Damage • ⚡ ${m.oneBlow.cost} Energy • Once/Battle</p><p>${locked?`🔒 Unlocks at Level ${m.oneBlow.required}`:m.oneBlow.desc}</p>`;
    const upgrade=document.getElementById("upgradeMonsterBtn"), info=document.getElementById("upgradeMonsterInfo");
    upgrade.disabled=puzzleEnergy<monsterUpgradeCost;info.textContent=`Upgrade cost: ${monsterUpgradeCost} Puzzle Energy • Level ${m.level} → ${m.level+1}`;
}
function upgradeCurrentMonster(){
    if(!detailsMonster)return;
    const m=monsters[detailsMonster];
    if(puzzleEnergy<monsterUpgradeCost){alert(`You need ${monsterUpgradeCost} Puzzle Energy to upgrade ${detailsMonster}.`);return;}
    puzzleEnergy-=monsterUpgradeCost;m.level++;m.xp=0;m.hp+=10;m.attack+=3;m.defense+=2;
    alert(`⬆️ ${detailsMonster} upgraded to Level ${m.level}! Stats and unlocks improved.`);updatePlayerStats();renderMonsterDetails();updateMonsterSelection();updateMonsterCollection();
}

/* ================= INITIALIZE ================= */
updatePlayerStats();
updateMonsterCollection();
updateMonsterSelection();
