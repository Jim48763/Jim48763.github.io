// game.js

// 游戲狀態
let gameState = {
    playerName: '',
    playerRace: '',
    level: 1,
    hp: 100,
    maxHp: 100,
    mp: 50,
    maxMp: 50,
    exp: 0,
    gold: 0,
    currentLocation: 'town',
    inventory: [],
    equippedItems: {},
    skills: []
};

// 種族列表
const races = ['人類', '精靈', '矮人', '獸人'];


// 地點列表
const locations = ['森林', '山洞', '沙漠', '草原', '雪山'];

// 怪物列表
const monsters = [
    { name: '哥布林', hp: 30, attack: 5, defense: 2, exp: 10, gold: 5 },
    { name: '史萊姆', hp: 20, attack: 3, defense: 1, exp: 5, gold: 3 },
    { name: '狼人', hp: 50, attack: 8, defense: 3, exp: 20, gold: 10 },
    { name: '骷髏戰士', hp: 40, attack: 6, defense: 4, exp: 15, gold: 8 },
    {
        name: '魔族士兵',
        hp: 150,
        attack: 30,
        defense: 20,
        exp: 100,
        goldReward: 50
    },
    {
        name: '魔族法師',
        hp: 120,
        attack: 40,
        defense: 15,
        exp: 120,
        goldReward: 60
    },
    {
        name: '魔族精英',
        hp: 200,
        attack: 45,
        defense: 25,
        exp: 200,
        goldReward: 100
    },
    {
        name: '魔族將領',
        hp: 300,
        attack: 60,
        defense: 30,
        exp: 300,
        goldReward: 150
    },
    {
        name: '魔王',
        hp: 1000,
        attack: 100,
        defense: 50,
        exp: 5000,
        goldReward: 10000,
        isBoss: true
    }
];

// 隨機事件列表
const events = [
    { type: 'battle', message: '你遇到了一個怪物!' },
    { type: 'treasure', message: '你發現了一個寶箱!' },
    { type: 'heal', message: '你找到了一個神奇的泉水,恢復了一些HP!' },
    { type: 'trap', message: '你踩到了陷阱,受到了一些傷害!' }
];

// 添加到游戲狀態
gameState.equipment = {
    weapon: null,
    armor: null
};

// 商店物品列表
const shopItems = [
    { type: 'weapon', name: '鐵劍', attack: 5, price: 50 },
    { type: 'weapon', name: '銀劍', attack: 10, price: 100 },
    { type: 'armor', name: '皮甲', defense: 3, price: 40 },
    { type: 'armor', name: '鎖子甲', defense: 7, price: 80 },
    { type: 'potion', name: '小型治療藥水', heal: 20, price: 10 },
    { type: 'potion', name: '大型治療藥水', heal: 50, price: 25 }
];

// 添加到游戲狀態
gameState.skills = [];
gameState.skillPoints = 0;

// 技能列表
const skillList = [
    { name: '火球術', mpCost: 5, damage: 15, description: '發射一個火球造成傷害' },
    { name: '治療術', mpCost: 8, heal: 20, description: '恢復一定量的HP' },
    { name: '雷擊', mpCost: 7, damage: 20, description: '召喚雷電攻擊敵人' },
    { name: '防禦姿態', mpCost: 3, defense: 5, duration: 3, description: '提高防禦力持續3回合' },
    { name: '連續斬', mpCost: 10, attacks: 3, description: '快速連續攻擊3次' }
];

// 添加到游戲狀態
gameState.currentLocation = '新手村';
gameState.exploredAreas = new Set(['新手村']);

// 修改游戲狀態
gameState.currentQuests = [];
gameState.completedQuests = [];
gameState.defeatedBosses = [];

// 修改地圖系統
const gameMap = {
    '新手村': {
        description: '一個安靜祥和的小村莊,適合新手冒險者。',
        connectedAreas: ['草原', '森林入口'],
        monsters: ['史萊姆', '哥布林'],
        itemChance: 0.3,
        items: ['小型生命藥水', '銅劍', '皮甲'],
        events: [
            {
                name: '村長的請求',
                description: '村長正在尋找勇敢的冒險者幫助清理村莊周圍的史萊姆。',
                type: 'quest',
                requirements: { level: 1 },
                reward: { gold: 50, exp: 100, item: '皮靴' }
            },
            {
                name: '神秘老人',
                description: '一位神秘的老人出現在村子裡,他似乎知道一些關於這個世界的秘密。',
                type: 'event',
                effect: () => {
                    gameState.maxHp += 10;
                    alert('神秘老人教給你一種提升體質的方法,你的最大生命值增加了10點!');
                }
            }
        ]
    },
    '草原': {
        description: '廣闊的草原,偶爾可以看到野生動物。',
        connectedAreas: ['新手村', '森林入口', '山脚下'],
        monsters: ['野狼', '強盜'],
        itemChance: 0.4,
        items: ['中型生命藥水', '鐵劍', '鐵甲'],
        events: [
            {
                name: '迷路的商人',
                description: '你遇到了一個迷路的商人,他需要護送回新手村。',
                type: 'quest',
                requirements: { level: 3 },
                reward: { gold: 100, exp: 150, item: '商人的感謝信' }
            },
            {
                name: '草原遺跡',
                description: '你發現了一處古老的遺跡,裡面可能藏有寶藏。',
                type: 'event',
                effect: () => {
                    const treasureRoll = Math.random();
                    if (treasureRoll < 0.3) {
                        gameState.gold += 200;
                        alert('你在遺跡中發現了一些金幣!獲得200金幣。');
                    } else {
                        alert('遺跡裡似乎已經被搜刮一空了。');
                    }
                }
            }
        ]
    },
    '森林入口': {
        description: '茂密森林的入口,傳聞裡面棲息著神秘生物。',
        connectedAreas: ['新手村', '草原', '深林'],
        monsters: ['狼人', '樹人'],
        itemChance: 0.5,
        items: ['大型生命藥水', '魔法杖', '精靈斗篷']
    },
    '深林': {
        description: '幽暗的森林深處,充滿了危險和機遇。',
        connectedAreas: ['森林入口', '山脚下'],
        monsters: ['暗影豹', '巨型蜘蛛'],
        itemChance: 0.6,
        items: ['超級生命藥水', '精靈之弓', '森林護甲']
    },
    '山脚下': {
        description: '高聳入雲的山脉脚下,是通往更高地區的必經之路。',
        connectedAreas: ['草原', '深林', '山腰'],
        monsters: ['山賊', '岩石巨人'],
        itemChance: 0.5,
        items: ['力量藥水', '巨斧', '重甲']
    },
    '山腰': {
        description: '山的中部地帶,可以俯瞰下方的風景。這裡的空氣開始變得稀薄。',
        connectedAreas: ['山脚下', '山頂'],
        monsters: ['雪怪', '禿鷹'],
        itemChance: 0.7,
        items: ['禦寒斗篷', '登山靴', '魔法護符']
    },
    '山頂': {
        description: '終於到達了山的頂峰,這裡寒冷而危險,但據說隱藏著珍貴的寶藏。',
        connectedAreas: ['山腰'],
        monsters: ['冰龍', '雪山之王'],
        itemChance: 0.8,
        items: ['傳說之劍', '神秘寶箱', '龍鱗護甲']
    },
    '魔王城外': {
        description: '一片荒蕪的土地,遠處聳立著一座巍峨的黑色城堡。',
        connectedAreas: ['山腰', '魔王城'],
        monsters: ['魔族士兵', '魔族法師'],
        itemChance: 0.2,
        items: ['大型生命藥水', '大型魔法藥水', '魔族武器'],
        events: [
            {
                name: '魔族的挑戰',
                description: '一群魔族正在挑釁附近的冒險者,看起來他們在尋找挑戰者。',
                type: 'quest',
                requirements: { level: 15 },
                reward: { gold: 500, exp: 1000, item: '魔族護符' }
            }
        ]
    },
    '魔王城': {
        description: '黑暗籠罩的城堡,充滿了邪惡的氣息。',
        connectedAreas: ['魔王城外'],
        monsters: ['魔族精英', '魔族將領'],
        itemChance: 0.1,
        items: ['魔王之劍', '魔王之甲'],
        events: [
            {
                name: '闖入魔王大殿',
                description: '你來到了魔王的大殿,准備與魔王進行最後的決戰!',
                type: 'event',
                requirements: { level: 20 },
                effect: () => {
                    if (confirm('你确定要挑战魔王吗?這將是一場艱難的戰鬥!')) {
                        startBossBattle(monsters.find(m => m.name === '魔王'));
                    }
                }
            }
        ]
    }
};


// 檢查區域事件
function checkAreaEvents() {
    const currentArea = gameMap[gameState.currentLocation];
    const availableEvents = currentArea.events.filter(event => 
        !gameState.completedQuests.includes(event.name) &&
        (!event.requirements || event.requirements.level <= gameState.level)
    );

    if (availableEvents.length === 0) {
        alert('當前沒有可用的事件或任務。');
        return;
    }

    let eventMenu = '可用的事件或任務:\n';
    availableEvents.forEach((event, index) => {
        eventMenu += `${index + 1}. ${event.name}\n`;
    });

    const choice = prompt(eventMenu + '\n請選擇一個事件或任務的編號,或按取消返回:');
    if (choice === null) return;

    const selectedEvent = availableEvents[parseInt(choice) - 1];
    if (selectedEvent) {
        handleEvent(selectedEvent);
    } else {
        alert('無效的選擇。');
    }
}

// 處理事件
function handleEvent(event) {
    alert(event.description);

    if (event.type === 'quest') {
        const acceptQuest = confirm('你要接受這個任務嗎?');
        if (acceptQuest) {
            gameState.currentQuests.push(event);
            alert('你接受了任務: ' + event.name);
        }
    } else if (event.type === 'event') {
        event.effect();
        gameState.completedQuests.push(event.name);
    }

    updateGameScreen();
}

// 完成任務
function completeQuest(quest) {
    alert(`恭喜你完成了任務: ${quest.name}!`);
    gameState.gold += quest.reward.gold;
    gameState.exp += quest.reward.exp;
    if (quest.reward.item) {
        gameState.inventory.push(quest.reward.item);
        alert(`你獲得了物品: ${quest.reward.item}`);
    }
    gameState.currentQuests = gameState.currentQuests.filter(q => q.name !== quest.name);
    gameState.completedQuests.push(quest.name);
    checkLevelUp();
    updateGameScreen();
}

// 修改探索區域函數
function exploreArea() {
    const currentArea = gameMap[gameState.currentLocation];
    const randomEvent = Math.random();

    if (currentArea.name === '魔王城' && !gameState.defeatedBosses.includes('魔王')) {
        const bossEncounterChance = 0.3; // 10% 機會遇到魔王
        if (randomEvent < bossEncounterChance) {
            startBossBattle(monsters.find(m => m.name === '魔王'));
            return;
        }
    }

    if (randomEvent < 0.6) { // 60% 機會遇到怪物
        const monster = monsters.find(m => currentArea.monsters.includes(m.name));
        startBattle(monster);
    } else if (randomEvent < 0.6 + currentArea.itemChance) { // 機會找到物品
        const item = currentArea.items[Math.floor(Math.random() * currentArea.items.length)];
        gameState.inventory.push(item);
        alert(`你發現了 ${item}!`);
    } else { // 觸發區域特殊事件
        const availableEvents = currentArea.events.filter(event => 
            !gameState.completedQuests.includes(event.name) &&
            (!event.requirements || event.requirements.level <= gameState.level)
        );
        if (availableEvents.length > 0) {
            const randomEvent = availableEvents[Math.floor(Math.random() * availableEvents.length)];
            handleEvent(randomEvent);
        } else {
            alert('你探索了一會兒,但什麼都沒發現。');
        }
    }

    // 檢查是否有可以完成的任務
    gameState.currentQuests.forEach(quest => {
        if (quest.requirements && quest.requirements.level <= gameState.level) {
            const completeQuestChance = Math.random();
            if (completeQuestChance < 0.3) { // 30% 機會完成任務
                completeQuest(quest);
            }
        }
    });

    updateGameScreen();
}

// 探索當前區域
function exploreArea() {
    const currentArea = gameMap[gameState.currentLocation];
    const randomEvent = Math.random();

    if (randomEvent < 0.6) { // 60% 機會遇到怪物
        const monster = monsters.find(m => currentArea.monsters.includes(m.name));
        startBattle(monster);
    } else if (randomEvent < 0.6 + currentArea.itemChance) { // 機會找到物品
        const item = currentArea.items[Math.floor(Math.random() * currentArea.items.length)];
        gameState.inventory.push(item);
        alert(`你發現了 ${item}!`);
    } else { // 什麼都沒發生
        alert('你探索了一會兒,但什麼都沒發現。');
    }

    updateGameScreen();
}

// 打開地圖
function openMap() {
    const gameScreen = document.getElementById('game-screen');
    let mapHtml = '<h2>世界地圖</h2>';
    mapHtml += `<p>當前位置: ${gameState.currentLocation}</p>`;
    mapHtml += '<h3>可前往的地點:</h3>';
    mapHtml += '<ul>';
    
    gameMap[gameState.currentLocation].connectedAreas.forEach(area => {
        mapHtml += `<li>${area} 
            <button onclick="moveToArea('${area}')">移動到此處</button>
            ${gameState.exploredAreas.has(area) ? '(已探索)' : '(未探索)'}
        </li>`;
    });
    
    mapHtml += '</ul>';
    mapHtml += '<button onclick="updateGameScreen()">返回</button>';
    
    gameScreen.innerHTML = mapHtml;
}

// 移動到新區域
function moveToArea(newArea) {
    gameState.currentLocation = newArea;
    gameState.exploredAreas.add(newArea);
    alert(`你已經到達 ${newArea}`);
    updateGameScreen();
}

// 打開技能菜單
function openSkillMenu() {
    const gameScreen = document.getElementById('game-screen');
    let skillHtml = '<h2>技能菜單</h2>';
    skillHtml += `<p>技能點: ${gameState.skillPoints}</p>`;
    skillHtml += '<h3>已學習技能:</h3>';
    skillHtml += '<ul>';
    
    gameState.skills.forEach(skill => {
        skillHtml += `<li>${skill.name} - MP消耗: ${skill.mpCost} - ${skill.description}</li>`;
    });
    
    skillHtml += '</ul>';
    skillHtml += '<h3>可學習技能:</h3>';
    skillHtml += '<ul>';
    
    skillList.forEach((skill, index) => {
        if (!gameState.skills.some(s => s.name === skill.name)) {
            skillHtml += `<li>${skill.name} - MP消耗: ${skill.mpCost} - ${skill.description} 
                <button onclick="learnSkill(${index})">學習</button></li>`;
        }
    });
    
    skillHtml += '</ul>';
    skillHtml += '<button onclick="updateGameScreen()">返回</button>';
    
    gameScreen.innerHTML = skillHtml;
}

// 學習技能
function learnSkill(index) {
    const skill = skillList[index];
    if (gameState.skillPoints > 0) {
        gameState.skills.push(skill);
        gameState.skillPoints--;
        alert(`你學會了 ${skill.name}!`);
        openSkillMenu();  // 更新技能菜單
    } else {
        alert('技能點不足!');
    }
}

// 打開商店
function openShop() {
    const gameScreen = document.getElementById('game-screen');
    let shopHtml = '<h2>商店</h2>';
    shopHtml += `<p>你的金幣: ${gameState.gold}</p>`;
    shopHtml += '<ul>';
    
    shopItems.forEach((item, index) => {
        shopHtml += `<li>${item.name} - ${item.price} 金幣 
            <button onclick="buyItem(${index})">購買</button></li>`;
    });
    
    shopHtml += '</ul>';
    shopHtml += '<button onclick="updateGameScreen()">返回</button>';
    
    gameScreen.innerHTML = shopHtml;
}

// 購買物品
function buyItem(index) {
    const item = shopItems[index];
    if (gameState.gold >= item.price) {
        gameState.gold -= item.price;
        
        switch(item.type) {
            case 'weapon':
            case 'armor':
                equipItem(item);
                break;
            case 'potion':
                addToInventory(item);
                break;
        }
        
        alert(`你購買了 ${item.name}!`);
        openShop();  // 更新商店顯示
    } else {
        alert('金幣不足!');
    }
}

// 裝備物品
function equipItem(item) {
    if (item.type === 'weapon') {
        gameState.equipment.weapon = item;
    } else if (item.type === 'armor') {
        gameState.equipment.armor = item;
    }
}

// 添加到背包
function addToInventory(item) {
    gameState.inventory.push(item);
}

// 打開背包
function openInventory() {
    const gameScreen = document.getElementById('game-screen');
    let inventoryHtml = '<h2>背包</h2>';
    
    if (gameState.inventory.length === 0) {
        inventoryHtml += '<p>背包是空的</p>';
    } else {
        inventoryHtml += '<ul>';
        gameState.inventory.forEach((item, index) => {
            inventoryHtml += `<li>${item.name} 
                <button onclick="useItem(${index})">使用</button></li>`;
        });
        inventoryHtml += '</ul>';
    }
    
    inventoryHtml += '<button onclick="updateGameScreen()">返回</button>';
    
    gameScreen.innerHTML = inventoryHtml;
}

// 使用物品
function useItem(index) {
    const item = gameState.inventory[index];
    if (item.type === 'potion') {
        gameState.hp = Math.min(gameState.maxHp, gameState.hp + item.heal);
        gameState.inventory.splice(index, 1);
        alert(`你使用了 ${item.name}, 恢復了 ${item.heal} 點HP!`);
        openInventory();  // 更新背包顯示
    }
}



// 探索當前位置
function exploreLocation() {
    const event = events[Math.floor(Math.random() * events.length)];
    alert(event.message);

    switch(event.type) {
        case 'battle':
            startBattle();
            break;
        case 'treasure':
            findTreasure();
            break;
        case 'heal':
            healPlayer();
            break;
        case 'trap':
            trapDamage();
            break;
    }

    updateGameScreen();
}

// 更換地點
function changeLocation() {
    const newLocation = locations[Math.floor(Math.random() * locations.length)];
    gameState.currentLocation = newLocation;
    alert(`你來到了${newLocation}`);
    updateGameScreen();
}

// 開始戰鬥
function startBattle(monster) {
    let monsterHp = monster.hp;
    let playerDefenseBonus = 0;
    let playerDefenseDuration = 0;

    alert(`你遇到了${monster.name}!`);

    while (gameState.hp > 0 && monsterHp > 0) {
        // 玩家回合
        const action = chooseBattleAction();
        
        switch(action.type) {
            case 'attack':
                const weaponAttack = gameState.equipment.weapon ? gameState.equipment.weapon.attack : 0;
                const playerDamage = Math.max(0, gameState.level * 2 + weaponAttack - monster.defense);
                monsterHp -= playerDamage;
                alert(`你對${monster.name}造成了${playerDamage}點傷害!`);
                break;
            case 'skill':
                useSkill(action.skill, monster, monsterHp);
                break;
        }

        if (monsterHp <= 0) {
            alert(`你擊敗了${monster.name}!`);
            gameState.exp += monster.exp;
            gameState.gold += monster.gold;
            checkLevelUp();
            return;
        }

        // 怪物回合
        const armorDefense = gameState.equipment.armor ? gameState.equipment.armor.defense : 0;
        const totalDefense = armorDefense + playerDefenseBonus;
        const monsterDamage = Math.max(0, monster.attack - gameState.level - totalDefense);
        gameState.hp -= monsterDamage;
        alert(`${monster.name}對你造成了${monsterDamage}點傷害!`);

        // 更新防禦持續時間
        if (playerDefenseDuration > 0) {
            playerDefenseDuration--;
            if (playerDefenseDuration === 0) {
                playerDefenseBonus = 0;
            }
        }

        if (gameState.hp <= 0) {
            alert('你被打敗了!游戲結束!');
            initGame();
            return;
        }
    }
}

function startBossBattle(boss) {
    let bossHp = boss.hp;
    let playerHp = gameState.hp;
    let battleLog = `你遇到了 ${boss.name}!\n`;

    while (bossHp > 0 && playerHp > 0) {
        // 玩家回合
        const playerDamage = Math.max(gameState.attack - boss.defense, 1);
        bossHp -= playerDamage;
        battleLog += `你對 ${boss.name} 造成了 ${playerDamage} 點傷害。\n`;

        if (bossHp <= 0) {
            battleLog += `你擊敗了 ${boss.name}!\n`;
            break;
        }

        // Boss回合
        const bossDamage = Math.max(boss.attack - gameState.defense, 1);
        playerHp -= bossDamage;
        battleLog += `${boss.name} 對你造成了 ${bossDamage} 點傷害。\n`;
    }

    if (playerHp <= 0) {
        alert(battleLog + '你被擊敗了...');
        gameOver();
    } else {
        gameState.hp = playerHp;
        gameState.exp += boss.exp;
        gameState.gold += boss.goldReward;
        gameState.defeatedBosses.push(boss.name);
        alert(battleLog + `你獲得了 ${boss.exp} 經驗值和 ${boss.goldReward} 金幣!`);
        checkLevelUp();
        if (boss.name === '魔王') {
            endGame();
        }
    }
    updateGameScreen();
}

// 選擇戰鬥動作
function chooseBattleAction() {
    let actionHtml = '<h3>選擇動作:</h3>';
    actionHtml += '<button onclick="return {type: \'attack\'}">普通攻擊</button>';
    
    gameState.skills.forEach((skill, index) => {
        actionHtml += `<button onclick="return {type: 'skill', skill: ${index}}">${skill.name} (MP: ${skill.mpCost})</button>`;
    });
    
    // 這裡我們需要一個方式來等待玩家的選擇
    // 在實際的游戲中,這可能需要使用異步函數或事件監聽器
    // 為了簡化,我們這裡假設玩家選擇了普通攻擊
    return {type: 'attack'};
}

// 使用技能
function useSkill(skillIndex, monster, monsterHp) {
    const skill = gameState.skills[skillIndex];
    if (gameState.mp >= skill.mpCost) {
        gameState.mp -= skill.mpCost;
        
        switch(skill.name) {
            case '火球術':
            case '雷擊':
                monsterHp -= skill.damage;
                alert(`你使用了${skill.name},對${monster.name}造成了${skill.damage}點傷害!`);
                break;
            case '治療術':
                gameState.hp = Math.min(gameState.maxHp, gameState.hp + skill.heal);
                alert(`你使用了${skill.name},恢復了${skill.heal}點HP!`);
                break;
            case '防禦姿態':
                playerDefenseBonus = skill.defense;
                playerDefenseDuration = skill.duration;
                alert(`你使用了${skill.name},提高了防禦力!`);
                break;
            case '連續斬':
                let totalDamage = 0;
                for (let i = 0; i < skill.attacks; i++) {
                    const damage = Math.max(0, gameState.level * 2 - monster.defense);
                    monsterHp -= damage;
                    totalDamage += damage;
                }
                alert(`你使用了${skill.name},連續攻擊造成了${totalDamage}點傷害!`);
                break;
        }
    } else {
        alert('MP不足,無法使用技能!');
    }
}

// 找到寶藏
function findTreasure() {
    const gold = Math.floor(Math.random() * 20) + 10;
    gameState.gold += gold;
    alert(`你找到了${gold}金幣!`);
}

// 治療玩家
function healPlayer() {
    const healAmount = Math.floor(gameState.maxHp * 0.3);
    gameState.hp = Math.min(gameState.maxHp, gameState.hp + healAmount);
    alert(`你恢復了${healAmount}點HP!`);
}

// 陷阱傷害
function trapDamage() {
    const damage = Math.floor(gameState.maxHp * 0.1);
    gameState.hp = Math.max(1, gameState.hp - damage);
    alert(`你受到了${damage}點傷害!`);
}

// 修改升級函數以獲得技能點
function checkLevelUp() {
    const expNeeded = gameState.level * 100;
    if (gameState.exp >= expNeeded) {
        gameState.level++;
        gameState.maxHp += 10;
        gameState.hp = gameState.maxHp;
        gameState.maxMp += 5;
        gameState.mp = gameState.maxMp;
        gameState.exp -= expNeeded;
        gameState.skillPoints++; // 每次升級獲得一個技能點
        alert(`恭喜!你升到了${gameState.level}級!獲得了1個技能點!`);
    }
}

// 初始化游戲
function initGame() {
    const gameScreen = document.getElementById('game-screen');
    gameScreen.innerHTML = `
        <h2>歡迎來到異世界!</h2>
        <p>請輸入你的名字:</p>
        <input type="text" id="player-name" />
        <p>選擇你的種族:</p>
        <select id="player-race">
            ${races.map(race => `<option value="${race}">${race}</option>`).join('')}
        </select>
        <br><br>
        <button onclick="startGame()">開始冒險</button>
    `;
}

// 開始游戲
function startGame() {
    const playerName = document.getElementById('player-name').value;
    const playerRace = document.getElementById('player-race').value;
    
    if (playerName.trim() === '') {
        alert('請輸入你的名字!');
        return;
    }
    
    gameState.playerName = playerName;
    gameState.playerRace = playerRace;
    
    updateGameScreen();
}

// 更新游戲畫面
function updateGameScreen() {
    const gameScreen = document.getElementById('game-screen');
    gameScreen.innerHTML = `
        <h2>冒險者信息</h2>
        <p>名字: ${gameState.playerName}</p>
        <p>種族: ${gameState.playerRace}</p>
        <p>等級: ${gameState.level}</p>
        <p>HP: ${gameState.hp}/${gameState.maxHp}</p>
        <p>MP: ${gameState.mp}/${gameState.maxMp}</p>
        <p>經驗值: ${gameState.exp}</p>
        <p>金幣: ${gameState.gold}</p>
        <p>武器: ${gameState.equipment.weapon ? gameState.equipment.weapon.name : '無'}</p>
        <p>防具: ${gameState.equipment.armor ? gameState.equipment.armor.name : '無'}</p>
        <p>技能點: ${gameState.skillPoints}</p>
        <h3>當前位置: ${gameState.currentLocation}</h3>
        <p>${gameMap[gameState.currentLocation].description}</p>
        <button onclick="exploreArea()">探索當前區域</button>
        <button onclick="openMap()">查看地圖</button>
        <button onclick="checkAreaEvents()">查看區域事件</button>
        <button onclick="openShop()">商店</button>
        <button onclick="openInventory()">背包</button>
        <button onclick="openSkillMenu()">技能</button>
    `;
    gameScreen.innerHTML += `
        <h3>已擊敗的Boss:</h3>
        <ul>
            ${gameState.defeatedBosses.map(boss => `<li>${boss}</li>`).join('')}
        </ul>
    `;
}

// 探索當前位置
function exploreLocation() {
    // 這裡可以添加隨機事件,如遇到怪物,發現寶藏等
    alert('你正在探索' + gameState.currentLocation + '...');
    // 之後可以添加更多邏輯
}

// 打開商店
function openShop() {
    alert('商店系統尚未實現');
    // 之後可以添加商店邏輯
}

// 打開背包
function openInventory() {
    alert('背包系統尚未實現');
    // 之後可以添加背包邏輯
}

function endGame() {
    alert('恭喜你!你成功擊敗了魔王,為這片大陸帶來了和平。你是最偉大的英雄!');
    const playAgain = confirm('你想再玩一次嗎?');
    if (playAgain) {
        resetGame();
    } else {
        // 返回至游戲主菜單或關閉游戲
    }
}

// 重置游戲函數
function resetGame() {
    // 重置所有游戲狀態到初始值
    gameState = {
        playerName: '',
        playerRace: '',
        level: 1,
        hp: 100,
        maxHp: 100,
        mp: 50,
        maxMp: 50,
        attack: 10,
        defense: 5,
        exp: 0,
        gold: 0,
        inventory: [],
        equipment: { weapon: null, armor: null },
        skillPoints: 0,
        currentLocation: '新手村',
        currentQuests: [],
        completedQuests: [],
        defeatedBosses: []
    };
    startGame();
}


// 初始化游戲
initGame();