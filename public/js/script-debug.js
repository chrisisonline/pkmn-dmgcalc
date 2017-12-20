// input field validation
var bounds = {
	"level": [0, 100],
	"base": [1, 255],
	"evs": [0, 252],
	"ivs": [0, 31],
	"dvs": [0, 15],
	"move-bp": [0, 999]
};
for (var bounded in bounds) {
	attachValidation(bounded, bounds[bounded][0], bounds[bounded][1]);
}
function attachValidation(clazz, min, max) {
	$("." + clazz).keyup(function () {
		validate($(this), min, max);
	});
}
function validate(obj, min, max) {
	obj.val(Math.max(min, Math.min(max, ~~obj.val())));
}

// auto-calc stats and current HP on change
$(".level").keyup(function () {
	var poke = $(this).closest(".poke-info");
	calcHP(poke);
	calcStats(poke);
});
$(".nature").bind("keyup change", function () {
	calcStats($(this).closest(".poke-info"));
});
$(".hp .base, .hp .evs, .hp .ivs").bind("keyup change", function () {
	calcHP($(this).closest(".poke-info"));
});
$(".at .base, .at .evs, .at .ivs").bind("keyup change", function () {
	calcStat($(this).closest(".poke-info"), 'at');
});
$(".df .base, .df .evs, .df .ivs").bind("keyup change", function () {
	calcStat($(this).closest(".poke-info"), 'df');
});
$(".sa .base, .sa .evs, .sa .ivs").bind("keyup change", function () {
	calcStat($(this).closest(".poke-info"), 'sa');
});
$(".sd .base, .sd .evs, .sd .ivs").bind("keyup change", function () {
	calcStat($(this).closest(".poke-info"), 'sd');
});
$(".sp .base, .sp .evs, .sp .ivs").bind("keyup change", function () {
	calcStat($(this).closest(".poke-info"), 'sp');
});
$(".sl .base").keyup(function () {
	calcStat($(this).closest(".poke-info"), 'sl');
});
$(".at .dvs").keyup(function () {
	var poke = $(this).closest(".poke-info");
	calcStat(poke, 'at');
	poke.find(".hp .dvs").val(getHPDVs(poke));
	calcHP(poke);
});
$(".df .dvs").keyup(function () {
	var poke = $(this).closest(".poke-info");
	calcStat(poke, 'df');
	poke.find(".hp .dvs").val(getHPDVs(poke));
	calcHP(poke);
});
$(".sa .dvs").keyup(function () {
	var poke = $(this).closest(".poke-info");
	calcStat(poke, 'sa');
	poke.find(".sd .dvs").val($(this).val());
	calcStat(poke, 'sd');
	poke.find(".hp .dvs").val(getHPDVs(poke));
	calcHP(poke);
});
$(".sp .dvs").keyup(function () {
	var poke = $(this).closest(".poke-info");
	calcStat(poke, 'sp');
	poke.find(".hp .dvs").val(getHPDVs(poke));
	calcHP(poke);
});
$(".sl .dvs").keyup(function () {
	var poke = $(this).closest(".poke-info");
	calcStat(poke, 'sl');
	poke.find(".hp .dvs").val(getHPDVs(poke));
	calcHP(poke);
});

function getHPDVs(poke) {
	return (~~poke.find(".at .dvs").val() % 2) * 8 +
            (~~poke.find(".df .dvs").val() % 2) * 4 +
            (~~poke.find(gen === 1 ? ".sl .dvs" : ".sa .dvs").val() % 2) * 2 +
            (~~poke.find(".sp .dvs").val() % 2);
}

function calcStats(poke) {
	for (var i = 0; i < STATS.length; i++) {
		calcStat(poke, STATS[i]);
	}
}

function calcCurrentHP(poke, max, percent) {
	var current = Math.ceil(percent * max / 100);
	poke.find(".current-hp").val(current);
}
function calcPercentHP(poke, max, current) {
	var percent = Math.floor(100 * current / max);
	poke.find(".percent-hp").val(percent);
}
$(".current-hp").keyup(function () {
	var max = $(this).parent().children(".max-hp").text();
	validate($(this), 0, max);
	var current = $(this).val();
	calcPercentHP($(this).parent(), max, current);
});
$(".percent-hp").keyup(function () {
	var max = $(this).parent().children(".max-hp").text();
	validate($(this), 0, 100);
	var percent = $(this).val();
	calcCurrentHP($(this).parent(), max, percent);
});

$(".ability").bind("keyup change", function () {
	$(this).closest(".poke-info").find(".move-hits").val($(this).val() === 'Skill Link' ? 5 : 3);
});

$("#p1 .ability").bind("keyup change", function () {
	autosetWeather($(this).val(), 0);
	autosetTerrain($(this).val(), 0);
});

var lastManualWeather = "";
var lastAutoWeather = ["", ""];
function autosetWeather(ability, i) {
	var currentWeather = $("input:radio[name='weather']:checked").val();
	if (lastAutoWeather.indexOf(currentWeather) === -1) {
		lastManualWeather = currentWeather;
		lastAutoWeather[1 - i] = "";
	}
	switch (ability) {
	case "Drought":
		lastAutoWeather[i] = "Sun";
		$("#sun").prop("checked", true);
		break;
	case "Drizzle":
		lastAutoWeather[i] = "Rain";
		$("#rain").prop("checked", true);
		break;
	case "Sand Stream":
		lastAutoWeather[i] = "Sand";
		$("#sand").prop("checked", true);
		break;
	case "Snow Warning":
		lastAutoWeather[i] = "Hail";
		$("#hail").prop("checked", true);
		break;
	case "Desolate Land":
		lastAutoWeather[i] = "Harsh Sunshine";
		$("#harsh-sunshine").prop("checked", true);
		break;
	case "Primordial Sea":
		lastAutoWeather[i] = "Heavy Rain";
		$("#heavy-rain").prop("checked", true);
		break;
	case "Delta Stream":
		lastAutoWeather[i] = "Strong Winds";
		$("#strong-winds").prop("checked", true);
		break;
	default:
		lastAutoWeather[i] = "";
		var newWeather = lastAutoWeather[1 - i] !== "" ? lastAutoWeather[1 - i] : "";
		$("input:radio[name='weather'][value='" + newWeather + "']").prop("checked", true);
		break;
	}
}

var lastManualTerrain = "";
var lastAutoTerrain = ["", ""];
function autosetTerrain(ability, i) {
	var currentTerrain = $("input:checkbox[name='terrain']:checked").val() || "No terrain";
	if (lastAutoTerrain.indexOf(currentTerrain) === -1) {
		lastManualTerrain = currentTerrain;
		lastAutoTerrain[1 - i] = "";
	}
	// terrain input uses checkbox instead of radio, need to uncheck all first
	$("input:checkbox[name='terrain']:checked").prop("checked", false);
	switch (ability) {
	case "Electric Surge":
		lastAutoTerrain[i] = "Electric";
		$("#electric").prop("checked", true);
		break;
	case "Grassy Surge":
		lastAutoTerrain[i] = "Grassy";
		$("#grassy").prop("checked", true);
		break;
	case "Misty Surge":
		lastAutoTerrain[i] = "Misty";
		$("#misty").prop("checked", true);
		break;
	case "Psychic Surge":
		lastAutoTerrain[i] = "Psychic";
		$("#psychic").prop("checked", true);
		break;
	default:
		lastAutoTerrain[i] = "";
		var newTerrain = lastAutoTerrain[1 - i] !== "" ? lastAutoTerrain[1 - i] : lastManualTerrain;
		if ("No terrain" !== newTerrain) {
			$("input:checkbox[name='terrain'][value='" + newTerrain + "']").prop("checked", true);
		}
		break;
	}
}

$("#p1 .item").bind("keyup change", function () {
	autosetStatus("#p1", $(this).val());
});

var lastManualStatus = {"#p1": "Healthy"};
var lastAutoStatus = {"#p1": "Healthy"};
function autosetStatus(p, item) {
	var currentStatus = $(p + " .status").val();
	if (currentStatus !== lastAutoStatus[p]) {
		lastManualStatus[p] = currentStatus;
	}
	if (item === "Flame Orb") {
		lastAutoStatus[p] = "Burned";
		$(p + " .status").val("Burned");
		$(p + " .status").change();
	} else if (item === "Toxic Orb") {
		lastAutoStatus[p] = "Badly Poisoned";
		$(p + " .status").val("Badly Poisoned");
		$(p + " .status").change();
	} else {
		lastAutoStatus[p] = "Healthy";
		if (currentStatus !== lastManualStatus[p]) {
			$(p + " .status").val(lastManualStatus[p]);
			$(p + " .status").change();
		}
	}
}

$(".status").bind("keyup change", function () {
	if ($(this).val() === 'Badly Poisoned') {
		$(this).parent().children(".toxic-counter").show();
	} else {
		$(this).parent().children(".toxic-counter").hide();
	}
});

// auto-update move details on select
$(".move-selector").change(function () {
	var moveName = $(this).val();
	var move = moves[moveName] || moves['(No Move)'];
	var moveGroupObj = $(this).parent();
	moveGroupObj.children(".move-bp").val(move.bp);
	moveGroupObj.children(".move-type").val(move.type);
	moveGroupObj.children(".move-cat").val(move.category);
	moveGroupObj.children(".move-crit").prop("checked", move.alwaysCrit === true);
	if (move.isMultiHit) {
		moveGroupObj.children(".move-hits").show();
		moveGroupObj.children(".move-hits").val($(this).closest(".poke-info").find(".ability").val() === 'Skill Link' ? 5 : 3);
		moveGroupObj.children(".move-hits").val($(this).closest(".poke-info").find(".item").val() === 'Grip Claw' ? 5 : 3);
	} else {
		moveGroupObj.children(".move-hits").hide();
	}
	moveGroupObj.children(".move-z").prop("checked", false);
});

// auto-update set details on select
$(".set-selector").change(function () {
	var fullSetName = $(this).val();
	var pokemonName, setName;
	pokemonName = fullSetName.substring(0, fullSetName.indexOf(" ("));
	setName = fullSetName.substring(fullSetName.indexOf("(") + 1, fullSetName.lastIndexOf(")"));
	var pokemon = pokedex[pokemonName];
	if (pokemon) {
		var pokeObj = $(this).closest(".poke-info");
		if (stickyMoves.getSelectedSide() === pokeObj.prop("id")) {
			stickyMoves.clearStickyMove();
		}
		pokeObj.find(".type1").val(pokemon.t1);
		pokeObj.find(".type2").val(pokemon.t2);
		pokeObj.find(".hp .base").val(pokemon.bs.hp);
		var i;
		for (i = 0; i < STATS.length; i++) {
			pokeObj.find("." + STATS[i] + " .base").val(pokemon.bs[STATS[i]]);
		}
		pokeObj.find(".weight").val(pokemon.w);
		pokeObj.find(".boost").val(0);
		pokeObj.find(".percent-hp").val(100);
		pokeObj.find(".status").val("Healthy");
		$(".status").change();
		var moveObj;
		var abilityObj = pokeObj.find(".ability");
		var itemObj = pokeObj.find(".item");
		if (pokemonName in setdex && setName in setdex[pokemonName]) {
			var set = setdex[pokemonName][setName];
			pokeObj.find(".level").val(set.level);
			pokeObj.find(".hp .evs").val((set.evs && typeof set.evs.hp !== "undefined") ? set.evs.hp : 0);
			pokeObj.find(".hp .ivs").val((set.ivs && typeof set.ivs.hp !== "undefined") ? set.ivs.hp : 31);
			pokeObj.find(".hp .dvs").val((set.dvs && typeof set.dvs.hp !== "undefined") ? set.dvs.hp : 15);
			for (i = 0; i < STATS.length; i++) {
				pokeObj.find("." + STATS[i] + " .evs").val((set.evs && typeof set.evs[STATS[i]] !== "undefined") ? set.evs[STATS[i]] : 0);
				pokeObj.find("." + STATS[i] + " .ivs").val((set.ivs && typeof set.ivs[STATS[i]] !== "undefined") ? set.ivs[STATS[i]] : 31);
				pokeObj.find("." + STATS[i] + " .dvs").val((set.dvs && typeof set.dvs[STATS[i]] !== "undefined") ? set.dvs[STATS[i]] : 15);
			}
			setSelectValueIfValid(pokeObj.find(".nature"), set.nature, "Hardy");
			setSelectValueIfValid(abilityObj, pokemon.ab ? pokemon.ab : set.ability, "");
			setSelectValueIfValid(itemObj, set.item, "");
			for (i = 0; i < 4; i++) {
				moveObj = pokeObj.find(".move" + (i + 1) + " select.move-selector");
				setSelectValueIfValid(moveObj, set.moves[i], "(No Move)");
				moveObj.change();
			}
		} else {
			pokeObj.find(".level").val(100);
			pokeObj.find(".hp .evs").val(0);
			pokeObj.find(".hp .ivs").val(31);
			pokeObj.find(".hp .dvs").val(15);
			for (i = 0; i < STATS.length; i++) {
				pokeObj.find("." + STATS[i] + " .evs").val(0);
				pokeObj.find("." + STATS[i] + " .ivs").val(31);
				pokeObj.find("." + STATS[i] + " .dvs").val(15);
			}
			pokeObj.find(".nature").val("Hardy");
			setSelectValueIfValid(abilityObj, pokemon.ab, "");
			itemObj.val("");
			for (i = 0; i < 4; i++) {
				moveObj = pokeObj.find(".move" + (i + 1) + " select.move-selector");
				moveObj.val("(No Move)");
				moveObj.change();
			}
		}
		if (typeof getSelectedTiers === "function") { // doesn't exist when in 1vs1 mode
			var format = getSelectedTiers()[0];
			if (format === "LC") pokeObj.find(".level").val(5);
			if (_.startsWith(format, "VGC")) pokeObj.find(".level").val(50);
		}
		var formeObj = $(this).siblings().find(".forme").parent();
		itemObj.prop("disabled", false);
		if (pokemon.formes) {
			showFormes(formeObj, setName, pokemonName, pokemon);
		} else {
			formeObj.hide();
		}
		calcHP(pokeObj);
		calcStats(pokeObj);
		abilityObj.change();
		itemObj.change();
	}
});

function showFormes(formeObj, setName, pokemonName, pokemon) {
	var defaultForme = 0;

	if (setName !== 'Blank Set') {
		var set = setdex[pokemonName][setName];

		// Repurpose the previous filtering code to provide the "different default" logic
		if ((set.item.indexOf('ite') !== -1 && set.item.indexOf('ite Y') === -1) ||
            (pokemonName === "Groudon" && set.item.indexOf("Red Orb") !== -1) ||
            (pokemonName === "Kyogre" && set.item.indexOf("Blue Orb") !== -1) ||
            (pokemonName === "Meloetta" && set.moves.indexOf("Relic Song") !== -1) ||
            (pokemonName === "Rayquaza" && set.moves.indexOf("Dragon Ascent") !== -1)) {
			defaultForme = 1;
		} else if (set.item.indexOf('ite Y') !== -1) {
			defaultForme = 2;
		}
	}

	var formeOptions = getSelectOptions(pokemon.formes, false, defaultForme);
	formeObj.children("select").find("option").remove().end().append(formeOptions).change();
	formeObj.show();
}

function setSelectValueIfValid(select, value, fallback) {
	select.val(select.children("option[value='" + value + "']").length !== 0 ? value : fallback);
}

$(".forme").change(function () {
	var altForme = pokedex[$(this).val()],
		container = $(this).closest(".info-group").siblings(),
		fullSetName = container.find(".select2-chosen").first().text(),
		pokemonName = fullSetName.substring(0, fullSetName.indexOf(" (")),
		setName = fullSetName.substring(fullSetName.indexOf("(") + 1, fullSetName.lastIndexOf(")"));

	$(this).parent().siblings().find(".type1").val(altForme.t1);
	$(this).parent().siblings().find(".type2").val(typeof altForme.t2 != "undefined" ? altForme.t2 : "");
	$(this).parent().siblings().find(".weight").val(altForme.w);

	for (var i = 0; i < STATS.length; i++) {
		var baseStat = container.find("." + STATS[i]).find(".base");
		baseStat.val(altForme.bs[STATS[i]]);
		baseStat.keyup();
	}

	if (abilities.indexOf(altForme.ab) > -1) {
		container.find(".ability").val(altForme.ab);
	} else {
		container.find(".ability").val("");
	}
	container.find(".ability").keyup();

	if ($(this).val().indexOf("Mega") === 0 && $(this).val() !== "Rayquaza-Mega") {
		container.find(".item").val("").keyup();
	} else {
		container.find(".item").prop("disabled", false);
	}
});


function Pokemon(pokeInfo) {
	if (typeof pokeInfo === "string") { // in this case, pokeInfo is the id of an individual setOptions value whose moveset's tier matches the selected tier(s)
		this.name = pokeInfo.substring(0, pokeInfo.indexOf(" ("));
		var setName = pokeInfo.substring(pokeInfo.indexOf("(") + 1, pokeInfo.lastIndexOf(")"));
		var pokemon = pokedex[this.name];
		this.type1 = pokemon.t1;
		this.type2 = (pokemon.t2 && typeof pokemon.t2 !== "undefined") ? pokemon.t2 : "";
		this.rawStats = [];
		this.boosts = [];
		this.stats = [];
		this.evs = [];

		var set = setdex[this.name][setName];
		this.level = set.level;
		this.HPEVs = (set.evs && typeof set.evs.hp !== "undefined") ? set.evs.hp : 0;
		if (gen < 3) {
			var HPDVs = 15;
			this.maxHP = ~~(((pokemon.bs.hp + HPDVs) * 2 + 63) * this.level / 100) + this.level + 10;
		} else if (pokemon.bs.hp === 1) {
			this.maxHP = 1;
		} else {
			var HPIVs = 31;
			this.maxHP = ~~((pokemon.bs.hp * 2 + HPIVs + ~~(this.HPEVs / 4)) * this.level / 100) + this.level + 10;
		}
		this.curHP = this.maxHP;
		this.nature = set.nature;
		for (var i = 0; i < STATS.length; i++) {
			var stat = STATS[i];
			this.boosts[stat] = 0;
			this.evs[stat] = (set.evs && typeof set.evs[stat] !== "undefined") ? set.evs[stat] : 0;
			if (gen < 3) {
				var dvs = 15;
				this.rawStats[stat] = ~~(((pokemon.bs[stat] + dvs) * 2 + 63) * this.level / 100) + 5;
			} else {
				var ivs = (set.ivs && typeof set.ivs[stat] !== "undefined") ? set.ivs[stat] : 31;
				var natureMods = NATURES[this.nature];
				var nature = natureMods[0] === stat ? 1.1 : natureMods[1] === stat ? 0.9 : 1;
				this.rawStats[stat] = ~~((~~((pokemon.bs[stat] * 2 + ivs + ~~(this.evs[stat] / 4)) * this.level / 100) + 5) * nature);
			}
		}
		this.ability = (set.ability && typeof set.ability !== "undefined") ? set.ability :
			(pokemon.ab && typeof pokemon.ab !== "undefined") ? pokemon.ab : "";
		this.item = (set.item && typeof set.item !== "undefined" && (set.item === "Eviolite" || set.item.indexOf("ite") < 0)) ? set.item : "";
		this.status = "Healthy";
		this.toxicCounter = 0;
		this.moves = [];
		for (var i = 0; i < 4; i++) {
			var moveName = set.moves[i];
			var defaultDetails = moves[moveName] || moves['(No Move)'];
			this.moves.push($.extend({}, defaultDetails, {
				name: (defaultDetails.bp === 0) ? "(No Move)" : moveName,
				bp: defaultDetails.bp,
				type: defaultDetails.type,
				category: defaultDetails.category,
				isCrit: !!defaultDetails.alwaysCrit,
				hits: defaultDetails.isMultiHit ? ((this.ability === "Skill Link" || this.item === "Grip Claw") ? 5 : 3) : defaultDetails.isTwoHit ? 2 : 1
			}));
		}
		this.weight = pokemon.w;
	} else {
		var setName = pokeInfo.find("input.set-selector").val();
		if (setName.indexOf("(") === -1) {
			this.name = setName;
		} else {
			var pokemonName = setName.substring(0, setName.indexOf(" ("));
			this.name = (pokedex[pokemonName].formes) ? pokeInfo.find(".forme").val() : pokemonName;
		}
		this.type1 = pokeInfo.find(".type1").val();
		this.type2 = pokeInfo.find(".type2").val();
		this.level = ~~pokeInfo.find(".level").val();
		this.maxHP = ~~pokeInfo.find(".hp .total").text();
		this.curHP = ~~pokeInfo.find(".current-hp").val();
		this.HPEVs = ~~pokeInfo.find(".hp .evs").val();
		this.rawStats = [];
		this.boosts = [];
		this.stats = [];
		this.evs = [];
		for (var i = 0; i < STATS.length; i++) {
			this.rawStats[STATS[i]] = ~~pokeInfo.find("." + STATS[i] + " .total").text();
			this.boosts[STATS[i]] = ~~pokeInfo.find("." + STATS[i] + " .boost").val();
			this.evs[STATS[i]] = ~~pokeInfo.find("." + STATS[i] + " .evs").val();
		}
		this.nature = pokeInfo.find(".nature").val();
		this.ability = pokeInfo.find(".ability").val();
		this.item = pokeInfo.find(".item").val();
		this.status = pokeInfo.find(".status").val();
		this.toxicCounter = this.status === 'Badly Poisoned' ? ~~pokeInfo.find(".toxic-counter").val() : 0;
		this.moves = [
			getMoveDetails(pokeInfo.find(".move1"), this.item),
			getMoveDetails(pokeInfo.find(".move2"), this.item),
			getMoveDetails(pokeInfo.find(".move3"), this.item),
			getMoveDetails(pokeInfo.find(".move4"), this.item)
		];
		this.weight = +pokeInfo.find(".weight").val();
	}
}

function getMoveDetails(moveInfo, item) {
	var moveName = moveInfo.find("select.move-selector").val();
	var defaultDetails = moves[moveName];
	var isZMove = gen >= 7 && moveInfo.find("input.move-z").prop("checked");

	// If z-move is checked but there isn't a corresponding z-move, use the original move
	if (isZMove && "zp" in defaultDetails) {
		var zMoveName = getZMoveName(moveName, defaultDetails.type, item);
		return $.extend({}, moves[zMoveName], {
			name: zMoveName,
			bp: moves[zMoveName].bp === 1 ? defaultDetails.zp : moves[zMoveName].bp,
			category: defaultDetails.category,
			isCrit: moveInfo.find(".move-crit").prop("checked"),
			hits: 1
		});
	} else {
		return $.extend({}, defaultDetails, {
			name: moveName,
			bp: ~~moveInfo.find(".move-bp").val(),
			type: moveInfo.find(".move-type").val(),
			category: moveInfo.find(".move-cat").val(),
			isCrit: moveInfo.find(".move-crit").prop("checked"),
			hits: defaultDetails.isMultiHit ? ~~moveInfo.find(".move-hits").val() : defaultDetails.isTwoHit ? 2 : 1
		});
	}
}

function getZMoveName(moveName, moveType, item) {
	return moveName.indexOf("Hidden Power") !== -1 ? "Breakneck Blitz" : // Hidden Power will become Breakneck Blitz
		moveName === "Clanging Scales" && item === "Kommonium Z" ? "Clangorous Soulblaze" :
			moveName === "Darkest Lariat" && item === "Incinium Z" ? "Malicious Moonsault" :
				moveName === "Giga Impact" && item === "Snorlium Z" ? "Pulverizing Pancake" :
					moveName === "Moongeist Beam" && item === "Lunalium Z" ? "Menacing Moonraze Maelstrom" :
						moveName === "Photon Geyser" && item === "Ultranecrozium Z" ? "Light That Burns the Sky" :
							moveName === "Play Rough" && item === "Mimikium Z" ? "Let\'s Snuggle Forever" :
								moveName === "Psychic" && item === "Mewnium Z" ? "Genesis Supernova" :
									moveName === "Sparkling Aria" && item === "Primarium Z" ? "Oceanic Operetta" :
										moveName === "Spectral Thief" && item === "Marshadium Z" ? "Soul-Stealing 7-Star Strike" :
											moveName === "Spirit Shackle" && item === "Decidium Z" ? "Sinister Arrow Raid" :
												moveName === "Stone Edge" && item === "Lycanium Z" ? "Splintered Stormshards" :
													moveName === "Sunsteel Strike" && item === "Solganium Z" ? "Searing Sunraze Smash" :
														moveName === "Thunderbolt" && item === "Aloraichium Z" ? "Stoked Sparksurfer" :
															moveName === "Thunderbolt" && item === "Pikashunium Z" ? "10,000,000 Volt Thunderbolt" :
																moveName === "Volt Tackle" && item === "Pikanium Z" ? "Catastropika" :
																	ZMOVES_TYPING[moveType];
}

function Field() {
	var format = $("input:radio[name='format']:checked").val();
	var isGravity = $("#gravity").prop("checked");
	var isSR = [$("#srL").prop("checked"), $("#srR").prop("checked")];
	var weather;
	var spikes;
	if (gen === 2) {
		spikes = [$("#gscSpikesL").prop("checked") ? 1 : 0, $("#gscSpikesR").prop("checked") ? 1 : 0];
		weather = $("input:radio[name='gscWeather']:checked").val();
	} else {
		weather = $("input:radio[name='weather']:checked").val();
		spikes = [~~$("input:radio[name='spikesL']:checked").val(), ~~$("input:radio[name='spikesR']:checked").val()];
	}
	var terrain = ($("input:checkbox[name='terrain']:checked").val()) ? $("input:checkbox[name='terrain']:checked").val() : "";
	var isReflect = [$("#reflectL").prop("checked"), $("#reflectR").prop("checked")];
	var isLightScreen = [$("#lightScreenL").prop("checked"), $("#lightScreenR").prop("checked")];
	var isProtected = [$("#protectL").prop("checked"), $("#protectR").prop("checked")];
	var isSeeded = [$("#leechSeedL").prop("checked"), $("#leechSeedR").prop("checked")];
	var isForesight = [$("#foresightL").prop("checked"), $("#foresightR").prop("checked")];
	var isHelpingHand = [$("#helpingHandR").prop("checked"), $("#helpingHandL").prop("checked")]; // affects attacks against opposite side
	var isFriendGuard = [$("#friendGuardL").prop("checked"), $("#friendGuardR").prop("checked")];
	var isAuroraVeil = [$("#auroraVeilL").prop("checked"), $("#auroraVeilR").prop("checked")];

	this.getWeather = function () {
		return weather;
	};
	this.clearWeather = function () {
		weather = "";
	};
	this.getSide = function (i) {
		return new Side(format, terrain, weather, isGravity, isSR[i], spikes[i], isReflect[i], isLightScreen[i], isProtected[i], isSeeded[1 - i], isSeeded[i], isForesight[i], isHelpingHand[i], isFriendGuard[i], isAuroraVeil[i]);
	};
}

function Side(format, terrain, weather, isGravity, isSR, spikes, isReflect, isLightScreen, isProtected, isAttackerSeeded, isDefenderSeeded, isForesight, isHelpingHand, isFriendGuard, isAuroraVeil) {
	this.format = format;
	this.terrain = terrain;
	this.weather = weather;
	this.isGravity = isGravity;
	this.isSR = isSR;
	this.spikes = spikes;
	this.isReflect = isReflect;
	this.isLightScreen = isLightScreen;
	this.isProtected = isProtected;
	this.isAttackerSeeded = isAttackerSeeded;
	this.isDefenderSeeded = isDefenderSeeded;
	this.isForesight = isForesight;
	this.isHelpingHand = isHelpingHand;
	this.isFriendGuard = isFriendGuard;
	this.isAuroraVeil = isAuroraVeil;
}

var gen, genWasChanged, notation, pokedex, setdex, typeChart, moves, abilities, items, STATS, calcHP, calcStat;

$(".gen").change(function () {
	gen = ~~$(this).val();
	genWasChanged = true;
	switch (gen) {
	case 1:
		pokedex = POKEDEX_RBY;
		setdex = SETDEX_RBY;
		typeChart = TYPE_CHART_RBY;
		moves = MOVES_RBY;
		items = [];
		abilities = [];
		STATS = STATS_RBY;
		calcHP = CALC_HP_RBY;
		calcStat = CALC_STAT_RBY;
		break;
	case 2:
		pokedex = POKEDEX_GSC;
		setdex = SETDEX_GSC;
		typeChart = TYPE_CHART_GSC;
		moves = MOVES_GSC;
		items = ITEMS_GSC;
		abilities = [];
		STATS = STATS_GSC;
		calcHP = CALC_HP_RBY;
		calcStat = CALC_STAT_RBY;
		break;
	case 3:
		pokedex = POKEDEX_ADV;
		setdex = SETDEX_ADV;
		typeChart = TYPE_CHART_GSC;
		moves = MOVES_ADV;
		items = ITEMS_ADV;
		abilities = ABILITIES_ADV;
		STATS = STATS_GSC;
		calcHP = CALC_HP_ADV;
		calcStat = CALC_STAT_ADV;
		break;
	case 4:
		pokedex = POKEDEX_DPP;
		setdex = SETDEX_DPP;
		typeChart = TYPE_CHART_GSC;
		moves = MOVES_DPP;
		items = ITEMS_DPP;
		abilities = ABILITIES_DPP;
		STATS = STATS_GSC;
		calcHP = CALC_HP_ADV;
		calcStat = CALC_STAT_ADV;
		break;
	case 5:
		pokedex = POKEDEX_BW;
		setdex = SETDEX_BW;
		typeChart = TYPE_CHART_GSC;
		moves = MOVES_BW;
		items = ITEMS_BW;
		abilities = ABILITIES_BW;
		STATS = STATS_GSC;
		calcHP = CALC_HP_ADV;
		calcStat = CALC_STAT_ADV;
		break;
	case 6:
		pokedex = POKEDEX_XY;
		setdex = SETDEX_XY;
		typeChart = TYPE_CHART_XY;
		moves = MOVES_XY;
		items = ITEMS_XY;
		abilities = ABILITIES_XY;
		STATS = STATS_GSC;
		calcHP = CALC_HP_ADV;
		calcStat = CALC_STAT_ADV;
		break;
	default:
		pokedex = POKEDEX_SM;
		setdex = SETDEX_SM;
		typeChart = TYPE_CHART_XY;
		moves = MOVES_SM;
		items = ITEMS_SM;
		abilities = ABILITIES_SM;
		STATS = STATS_GSC;
		calcHP = CALC_HP_ADV;
		calcStat = CALC_STAT_ADV;
	}
	clearField();
	$(".gen-specific.g" + gen).show();
	$(".gen-specific").not(".g" + gen).hide();
	var typeOptions = getSelectOptions(Object.keys(typeChart));
	$("select.type1, select.move-type").find("option").remove().end().append(typeOptions);
	$("select.type2").find("option").remove().end().append("<option value=\"\">(none)</option>" + typeOptions);
	var moveOptions = getSelectOptions(Object.keys(moves), true);
	$("select.move-selector").find("option").remove().end().append(moveOptions);
	var abilityOptions = getSelectOptions(abilities, true);
	$("select.ability").find("option").remove().end().append("<option value=\"\">(other)</option>" + abilityOptions);
	var itemOptions = getSelectOptions(items, true);
	$("select.item").find("option").remove().end().append("<option value=\"\">(none)</option>" + itemOptions);

	$(".set-selector").val(getSetOptions()[gen < 3 ? 3 : 1].id);
	$(".set-selector").change();
});

$(".notation").change(function () {
	notation = $(this).val();
});

function clearField() {
	$("#singles-format").prop("checked", true);
	$("#clear").prop("checked", true);
	$("#gscClear").prop("checked", true);
	$("#gravity").prop("checked", false);
	$("#srL").prop("checked", false);
	$("#srR").prop("checked", false);
	$("#spikesL0").prop("checked", true);
	$("#spikesR0").prop("checked", true);
	$("#gscSpikesL").prop("checked", false);
	$("#gscSpikesR").prop("checked", false);
	$("#reflectL").prop("checked", false);
	$("#reflectR").prop("checked", false);
	$("#lightScreenL").prop("checked", false);
	$("#lightScreenR").prop("checked", false);
	$("#protectL").prop("checked", false);
	$("#protectR").prop("checked", false);
	$("#leechSeedL").prop("checked", false);
	$("#leechSeedR").prop("checked", false);
	$("#foresightL").prop("checked", false);
	$("#foresightR").prop("checked", false);
	$("#helpingHandL").prop("checked", false);
	$("#helpingHandR").prop("checked", false);
	$("#friendGuardL").prop("checked", false);
	$("#friendGuardR").prop("checked", false);
	$("#auroraVeilL").prop("checked", false);
	$("#auroraVeilR").prop("checked", false);
	$("input:checkbox[name='terrain']").prop("checked", false);
}

function getSetOptions() {
	var pokeNames = Object.keys(pokedex);
	pokeNames.sort();
	var setOptions = [];
	var idNum = 0;
	for (var i = 0; i < pokeNames.length; i++) {
		var pokeName = pokeNames[i];
		setOptions.push({
			pokemon: pokeName,
			text: pokeName
		});
		if (pokeName in setdex) {
			var setNames = Object.keys(setdex[pokeName]);
			for (var j = 0; j < setNames.length; j++) {
				var setName = setNames[j];
				setOptions.push({
					pokemon: pokeName,
					set: setName,
					text: pokeName + " (" + setName + ")",
					id: pokeName + " (" + setName + ")"
				});
			}
		}
		setOptions.push({
			pokemon: pokeName,
			set: "Blank Set",
			text: pokeName + " (Blank Set)",
			id: pokeName + " (Blank Set)"
		});
	}
	return setOptions;
}

function getSelectOptions(arr, sort) {
	if (sort) {
		arr.sort();
	}
	var r = '';
	for (var i = 0; i < arr.length; i++) {
		r += '<option value="' + arr[i] + '">' + arr[i] + '</option>';
	}
	return r;
}
var stickyMoves = (function () {
	var lastClicked = 'resultMoveL1';
	$(".result-move").click(function () {
		if (this.id === lastClicked) {
			$(this).toggleClass("locked-move");
		} else {
			$('.locked-move').removeClass('locked-move');
		}
		lastClicked = this.id;
	});

	return {
		clearStickyMove: function () {
			lastClicked = null;
			$('.locked-move').removeClass('locked-move');
		},
		setSelectedMove: function (slot) {
			lastClicked = slot;
		},
		getSelectedSide: function () {
			if (lastClicked) {
				if (lastClicked.indexOf('resultMoveL') !== -1) {
					return 'p1';
				} else if (lastClicked.indexOf('resultMoveR') !== -1) {
					return 'p2';
				}
			}
			return null;
		}
	};
})();

function isGrounded(pokeInfo) {
	return $("#gravity").prop("checked") || (
		pokeInfo.find(".type1").val() !== "Flying" &&
        pokeInfo.find(".type2").val() !== "Flying" &&
        pokeInfo.find(".ability").val() !== "Levitate" &&
        pokeInfo.find(".item").val() !== "Air Balloon"
	);
}

function getTerrainEffects() {
	var className = $(this).prop("className");
	className = className.substring(0, className.indexOf(" "));
	switch (className) {
	case "type1":
	case "type2":
	case "item":
		var id = $(this).closest(".poke-info").prop("id");
		var terrainValue = $("input:checkbox[name='terrain']:checked").val();
		if (terrainValue === "Electric") {
			$("#" + id).find("[value='Asleep']").prop("disabled", isGrounded($("#" + id)));
		} else if (terrainValue === "Misty") {
			$("#" + id).find(".status").prop("disabled", isGrounded($("#" + id)));
		}
		break;
	case "ability":
		// with autoset, ability change may cause terrain change, need to consider both sides
		var terrainValue = $("input:checkbox[name='terrain']:checked").val();
		if (terrainValue === "Electric") {
			$("#p1").find(".status").prop("disabled", false);
			$("#p2").find(".status").prop("disabled", false);
			$("#p1").find("[value='Asleep']").prop("disabled", isGrounded($("#p1")));
			$("#p2").find("[value='Asleep']").prop("disabled", isGrounded($("#p2")));
		} else if (terrainValue === "Misty") {
			$("#p1").find(".status").prop("disabled", isGrounded($("#p1")));
			$("#p2").find(".status").prop("disabled", isGrounded($("#p2")));
		} else {
			$("#p1").find("[value='Asleep']").prop("disabled", false);
			$("#p1").find(".status").prop("disabled", false);
			$("#p2").find("[value='Asleep']").prop("disabled", false);
			$("#p2").find(".status").prop("disabled", false);
		}
		break;
	default:
		$("input:checkbox[name='terrain']").not(this).prop("checked", false);
		if ($(this).prop("checked") && $(this).val() === "Electric") {
			// need to enable status because it may be disabled by Misty Terrain before.
			$("#p1").find(".status").prop("disabled", false);
			$("#p2").find(".status").prop("disabled", false);
			$("#p1").find("[value='Asleep']").prop("disabled", isGrounded($("#p1")));
			$("#p2").find("[value='Asleep']").prop("disabled", isGrounded($("#p2")));
		} else if ($(this).prop("checked") && $(this).val() === "Misty") {
			$("#p1").find(".status").prop("disabled", isGrounded($("#p1")));
			$("#p2").find(".status").prop("disabled", isGrounded($("#p2")));
		} else {
			$("#p1").find("[value='Asleep']").prop("disabled", false);
			$("#p1").find(".status").prop("disabled", false);
			$("#p2").find("[value='Asleep']").prop("disabled", false);
			$("#p2").find(".status").prop("disabled", false);
		}
		break;
	}
}

$(document).ready(function () {
	$("#gen7").prop("checked", true);
	$("#gen7").change();
	$("#percentage").prop("checked", true);
	$("#percentage").change();

	$(".set-selector").select2({
		formatResult: function (object) {
			return object.set ? ("&nbsp;&nbsp;&nbsp;" + object.set) : ("<b>" + object.text + "</b>");
		},
		query: function (query) {
			var pageSize = 30;
			var results = _.filter(getSetOptions(), function (option) {
				var pokeName = option.pokemon.toUpperCase();
				return !query.term || query.term.toUpperCase().split(" ").every(function (term) {
					return pokeName.indexOf(term) === 0 || pokeName.indexOf("-" + term) >= 0 || pokeName.indexOf(" " + term) >= 0;
				});
			});
			query.callback({
				results: results.slice((query.page - 1) * pageSize, query.page * pageSize),
				more: results.length >= query.page * pageSize
			});
		},
		initSelection: function (element, callback) {
			var data = getSetOptions()[gen < 3 ? 3 : 1];
			callback(data);
		}
	});
	$(".move-selector").select2({
		dropdownAutoWidth: true,
		matcher: function (term, text) {
			// 2nd condition is for Hidden Power
			return text.toUpperCase().indexOf(term.toUpperCase()) === 0 || text.toUpperCase().indexOf(" " + term.toUpperCase()) >= 0;
		}
	});
	$(".set-selector").val(getSetOptions()[gen < 3 ? 3 : 1].id);
	$(".set-selector").change();

	$(".terrain-trigger").bind("change keyup", getTerrainEffects);
});

$("#p2 .ability").bind("keyup change", function () {
	autosetWeather($(this).val(), 1);
	autosetTerrain($(this).val(), 1);
});

$("#p2 .item").bind("keyup change", function () {
	autosetStatus("#p2", $(this).val());
});

lastManualStatus["#p2"] = "Healthy";
lastAutoStatus["#p1"] = "Healthy";

var resultLocations = [[], []];
for (var i = 0; i < 4; i++) {
	resultLocations[0].push({
		"move": "#resultMoveL" + (i + 1),
		"damage": "#resultDamageL" + (i + 1)
	});
	resultLocations[1].push({
		"move": "#resultMoveR" + (i + 1),
		"damage": "#resultDamageR" + (i + 1)
	});
}

var damageResults;
function calculate() {
	var p1 = new Pokemon($("#p1"));
	var p2 = new Pokemon($("#p2"));
	var battling = [p1, p2];
	p1.maxDamages = [];
	p2.maxDamages = [];
	var field = new Field();
	damageResults = calculateAllMoves(p1, p2, field);
	var fastestSide = p1.stats[SP] > p2.stats[SP] ? 0 : p1.stats[SP] === p2.stats[SP] ? "tie" : 1;
	var result, minDamage, maxDamage, minDisplay, maxDisplay;
	var highestDamage = -1;
	var bestResult;
	for (var i = 0; i < 4; i++) {
		result = damageResults[0][i];
		minDamage = result.damage[0] * p1.moves[i].hits;
		maxDamage = result.damage[result.damage.length - 1] * p1.moves[i].hits;
		p1.maxDamages.push({
			moveOrder : i,
			maxDamage : maxDamage
		});
		p1.maxDamages.sort(function(firstMove, secondMove){
			return firstMove.maxDamage < secondMove.maxDamage;
		});
		minDisplay = notation === '%' ? Math.floor(minDamage * 1000 / p2.maxHP) / 10 : Math.floor(minDamage * 48 / p2.maxHP);
		maxDisplay = notation === '%' ? Math.floor(maxDamage * 1000 / p2.maxHP) / 10 : Math.floor(maxDamage * 48 / p2.maxHP);
		result.damageText = minDamage + "-" + maxDamage + " (" + minDisplay + " - " + maxDisplay + notation + ")";
		result.koChanceText = p1.moves[i].bp === 0 ? 'nice move' :
			getKOChanceText(result.damage, p1, p2, field.getSide(1), p1.moves[i], p1.moves[i].hits, p1.ability === 'Bad Dreams');
		var recoveryText = '';

		// REMOVE 2ND LINE MOVE DATA
		/*if (p1.moves[i].givesHealth) {
			var minHealthRecovered = notation === '%' ? Math.floor(minDamage * p1.moves[i].percentHealed * 1000 / p1.maxHP) /
                10 : Math.floor(minDamage * p1.moves[i].percentHealed * 48 / p1.maxHP);
			var maxHealthRecovered = notation === '%' ? Math.floor(maxDamage * p1.moves[i].percentHealed * 1000 / p1.maxHP) /
                10 : Math.floor(maxDamage * p1.moves[i].percentHealed * 48 / p1.maxHP);
			if (minHealthRecovered > 100 && notation === '%') {
					minHealthRecovered = 100;
					maxHealthRecovered = 100;
				} else if (notation !== '%' && minHealthRecovered > 48) {
					minHealthRecovered = 48;
					maxHealthRecovered = 48;
				}
			recoveryText = ' (' + minHealthRecovered + ' - ' + maxHealthRecovered + notation + ' recovered)';
		}*/
		$(resultLocations[0][i].move + " + label").text(p1.moves[i].name.replace("Hidden Power", "HP"));
		$(resultLocations[0][i].damage).text(minDisplay + " - " + maxDisplay + notation + recoveryText);
		
		result = damageResults[1][i];
		var recoveryText = '';
		minDamage = result.damage[0] * p2.moves[i].hits;
		maxDamage = result.damage[result.damage.length - 1] * p2.moves[i].hits;
		p2.maxDamages.push({
			moveOrder : i,
			maxDamage : maxDamage
		});
		p2.maxDamages.sort(function(firstMove, secondMove){
			return firstMove.maxDamage < secondMove.maxDamage;
		});
		minDisplay = notation === '%' ? Math.floor(minDamage * 1000 / p1.maxHP) / 10 : Math.floor(minDamage * 48 / p1.maxHP);
		maxDisplay = notation === '%' ? Math.floor(maxDamage * 1000 / p1.maxHP) / 10 : Math.floor(maxDamage * 48 / p1.maxHP);
		result.damageText = minDamage + "-" + maxDamage + " (" + minDisplay + " - " + maxDisplay + notation + ")";
		result.koChanceText = p2.moves[i].bp === 0 ? 'nice move' :
			getKOChanceText(result.damage, p2, p1, field.getSide(0), p2.moves[i], p2.moves[i].hits, p2.ability === 'Bad Dreams');
		/*if (p2.moves[i].givesHealth) {
			var minHealthRecovered = notation === '%' ? Math.floor(minDamage * p2.moves[i].percentHealed * 1000 / p2.maxHP) /
                10 : Math.floor(minDamage * p2.moves[i].percentHealed * 48 / p2.maxHP);
			var maxHealthRecovered = notation === '%' ? Math.floor(maxDamage * p2.moves[i].percentHealed * 1000 / p2.maxHP) /
                10 : Math.floor(maxDamage * p2.moves[i].percentHealed * 48 / p2.maxHP);
			if (minHealthRecovered > 100 && notation === '%') {
					minHealthRecovered = 100;
					maxHealthRecovered = 100;
				} else if (notation !== '%' && minHealthRecovered > 48) {
					minHealthRecovered = 48;
					maxHealthRecovered = 48;
				}
			recoveryText = ' (' + minHealthRecovered + ' - ' + maxHealthRecovered + notation + ' recovered)';
		}*/
		$(resultLocations[1][i].move + " + label").text(p2.moves[i].name.replace("Hidden Power", "HP"));
		$(resultLocations[1][i].damage).text(minDisplay + " - " + maxDisplay + notation + recoveryText);
		if (fastestSide === "tie") {
			if (maxDamage > highestDamage) {
				highestDamage = maxDamage;
				bestResult = $(resultLocations[0][i].move);
			}
		}
		else {
			var bestMove = battling[fastestSide].maxDamages[0].moveOrder;
			bestResult = $(resultLocations[fastestSide][bestMove].move);
		}
	}
	if ($('.locked-move').length) {
		bestResult = $('.locked-move');
	} else {
		stickyMoves.setSelectedMove(bestResult.prop("id"));
	}
	bestResult.prop("checked", true);
	bestResult.change();
	$("#resultHeaderL").text(p1.name + "'s Moves (select one to show detailed results)");
	$("#resultHeaderR").text(p2.name + "'s Moves (select one to show detailed results)");
}

$(".result-move").change(function () {
	if (damageResults) {
		var result = findDamageResult($(this));
		// CJ EDITS: Updates hp bars when you switch moves
		var p1 = new Pokemon($("#p1"));
		var p2 = new Pokemon($("#p2"));
		var Pkm = 0;
		if ($(this).parent(".btn-move").hasClass("lmoves")){
			Pkm = 1;
		} else {
			Pkm = 2;
		}
		// alert($(this).parent(".btn-move").hasClass("lmoves"));
		if (result) {
			$("#mainResult").text(result.description + ": " + result.damageText + " -- " + result.koChanceText);
			$("#damageValues").text("Possible damage amounts: (" + result.damage.join(", ") + ")");
			// CJ EDITS
			// Adds simplified text to the main display
			$("#simpleMain").text("Damage: " + result.damageText);
			$("#simpleKO").text("KO Chance: " + result.koChanceText);

			if (Pkm == 1) {
				updateBar(Math.floor(100 - result.damage[7]*100/p1.maxHP),Pkm);
			} else {
				updateBar(Math.floor(100 - result.damage[7]*100/p2.maxHP),Pkm);
			}
		}
	}
});

function updateBar(hp, pkm){
	$("#myBar1").css("width" , 100 + '%'); 
	$("#myBar1").text(100  + '%');
	$("#myBar1").removeClass('ko-d');
	$("#myBar2").css("width" , 100 + '%'); 
	$("#myBar2").text(100  + '%');
	$("#myBar2").removeClass('ko-d');

	if (pkm == 2 && hp <= 0) {
		$("#myBar1").css("width" , 100 + '%');
		$("#myBar1").text("KO'd!");
		$("#myBar1").addClass('ko-d');
	} else if (pkm == 1 && hp <= 0) {
		$("#myBar2").css("width" , 100 + '%');
		$("#myBar2").text("KO'd!");
		$("#myBar2").addClass('ko-d');
	} else if (pkm == 2) {
		$("#myBar1").css("width" , hp + '%'); 
		$("#myBar1").text(hp  + '%');
	} else {
		$("#myBar2").css("width" , hp + '%'); 
		$("#myBar2").text(hp  + '%');
	}
}

function findDamageResult(resultMoveObj) {
	var selector = "#" + resultMoveObj.attr("id");
	for (var i = 0; i < resultLocations.length; i++) {
		for (var j = 0; j < resultLocations[i].length; j++) {
			if (resultLocations[i][j].move === selector) {
				return damageResults[i][j];
			}
		}
	}
}

var calculateAllMoves;

$(".gen").change(function () {
	switch (gen) {
	case 1:
		calculateAllMoves = CALCULATE_ALL_MOVES_RBY;
		break;
	case 2:
		calculateAllMoves = CALCULATE_ALL_MOVES_GSC;
		break;
	case 3:
		calculateAllMoves = CALCULATE_ALL_MOVES_ADV;
		break;
	case 4:
		calculateAllMoves = CALCULATE_ALL_MOVES_DPP;
		break;
	default:
		calculateAllMoves = CALCULATE_ALL_MOVES_BW;
		break;
	}
});

$(".mode").change(function () {
	window.location.replace("honkalculate.html?mode=" + $(this).attr("id"));
});

$(".notation").change(function () {
	calculate();
});

$(document).ready(function () {
	$(".calc-trigger").bind("change keyup", function () {
		setTimeout(calculate, 0);
	});
	calculate();
});

// CJ EDITS

// When moves are selected add class for formatting
$(".result-move").click(function () { 
  $(".btn-move").removeClass("move-selected");
  $(this).parent(".btn-move").addClass("move-selected");
});

// Create a shortened form of the main text


// Making the main results a popup window
$("#show-btn").click(function(){
	$("#show-details").toggle();
});
$("#close-btn").click(function(){
	$("#show-details").toggle();
});

// Field popup buttons
$("#field-open-btn").click(function(){
	$("#field-popup").toggle();
});
$("#field-close-btn").click(function(){
	$("#field-popup").toggle();
});

// Import popup buttons
$("#import-open-btn").click(function(){
	$("#import-popup").toggle();
});
$("#import-close-btn").click(function(){
	$("#import-popup").toggle();
});

// Selecting inputs highlights text
var focusedElement;
$(document).on('focus', 'input', function () {
    if (focusedElement == this) return; //already focused, return so user can now place cursor at specific point in input.
    focusedElement = this;
    setTimeout(function () { focusedElement.select(); }, 50); //select all text in any field on focus for easy re-entry. Delay sightly to allow focus to "stick" before selecting.
});


function CALCULATE_ALL_MOVES_BW(p1, p2, field) {
	checkAirLock(p1, field);
	checkAirLock(p2, field);
	checkForecast(p1, field.getWeather());
	checkForecast(p2, field.getWeather());
	checkKlutz(p1);
	checkKlutz(p2);
	p1.stats[DF] = getModifiedStat(p1.rawStats[DF], p1.boosts[DF]);
	p1.stats[SD] = getModifiedStat(p1.rawStats[SD], p1.boosts[SD]);
	p1.stats[SP] = getFinalSpeed(p1, field.getWeather());
	p2.stats[DF] = getModifiedStat(p2.rawStats[DF], p2.boosts[DF]);
	p2.stats[SD] = getModifiedStat(p2.rawStats[SD], p2.boosts[SD]);
	p2.stats[SP] = getFinalSpeed(p2, field.getWeather());
	checkIntimidate(p1, p2);
	checkIntimidate(p2, p1);
	checkDownload(p1, p2);
	checkDownload(p2, p1);
	p1.stats[AT] = getModifiedStat(p1.rawStats[AT], p1.boosts[AT]);
	p1.stats[SA] = getModifiedStat(p1.rawStats[SA], p1.boosts[SA]);
	p2.stats[AT] = getModifiedStat(p2.rawStats[AT], p2.boosts[AT]);
	p2.stats[SA] = getModifiedStat(p2.rawStats[SA], p2.boosts[SA]);
	var side1 = field.getSide(1);
	var side2 = field.getSide(0);
	checkInfiltrator(p1, side1);
	checkInfiltrator(p2, side2);
	var results = [[], []];
	for (var i = 0; i < 4; i++) {
		results[0][i] = getDamageResult(p1, p2, p1.moves[i], side1);
		results[1][i] = getDamageResult(p2, p1, p2.moves[i], side2);
	}
	return results;
}

function CALCULATE_MOVES_OF_ATTACKER_BW(attacker, defender, field) {
	checkAirLock(attacker, field);
	checkAirLock(defender, field);
	checkForecast(attacker, field.getWeather());
	checkForecast(defender, field.getWeather());
	checkKlutz(attacker);
	checkKlutz(defender);
	attacker.stats[SP] = getFinalSpeed(attacker, field.getWeather());
	defender.stats[DF] = getModifiedStat(defender.rawStats[DF], defender.boosts[DF]);
	defender.stats[SD] = getModifiedStat(defender.rawStats[SD], defender.boosts[SD]);
	defender.stats[SP] = getFinalSpeed(defender, field.getWeather());
	checkIntimidate(attacker, defender);
	checkIntimidate(defender, attacker);
	checkDownload(attacker, defender);
	attacker.stats[AT] = getModifiedStat(attacker.rawStats[AT], attacker.boosts[AT]);
	attacker.stats[SA] = getModifiedStat(attacker.rawStats[SA], attacker.boosts[SA]);
	defender.stats[AT] = getModifiedStat(defender.rawStats[AT], defender.boosts[AT]);
	var defenderSide = field.getSide(~~(mode === "one-vs-all"));
	checkInfiltrator(attacker, defenderSide);
	var results = [];
	for (var i = 0; i < 4; i++) {
		results[i] = getDamageResult(attacker, defender, attacker.moves[i], defenderSide);
	}
	return results;
}

function getDamageResult(attacker, defender, move, field) {
	var description = {
		"attackerName": attacker.name,
		"moveName": move.name,
		"defenderName": defender.name
	};

	if (move.bp === 0) {
		return {"damage": [0], "description": buildDescription(description)};
	}

	if (field.isProtected && !move.bypassesProtect && !move.isZ) {
		description.isProtected = true;
		return {"damage": [0], "description": buildDescription(description)};
	}

	var defAbility = defender.ability;
	if (["Full Metal Body", "Prism Armor", "Shadow Shield"].indexOf(defAbility) === -1) {
		if (["Mold Breaker", "Teravolt", "Turboblaze"].indexOf(attacker.ability) !== -1) {
			defAbility = "";
			description.attackerAbility = attacker.ability;
		}
		if (move.name === "Menacing Moonraze Maelstrom" || move.name === "Moongeist Beam" || move.name === "Searing Sunraze Smash" || move.name === "Sunsteel Strike") {
			defAbility = "";
		}
	}

	var isCritical = move.isCrit && ["Battle Armor", "Shell Armor"].indexOf(defAbility) === -1;

	if (move.name === "Weather Ball") {
		move.type = field.weather.indexOf("Sun") !== -1 ? "Fire" :
			field.weather.indexOf("Rain") !== -1 ? "Water" :
				field.weather === "Sand" ? "Rock" :
					field.weather === "Hail" ? "Ice" :
						"Normal";
		description.weather = field.weather;
		description.moveType = move.type;
	} else if (move.name === "Judgment" && attacker.item.indexOf("Plate") !== -1) {
		move.type = getItemBoostType(attacker.item);
	} else if (move.name === "Techno Blast" && attacker.item.indexOf("Drive") !== -1) {
		move.type = getTechnoBlast(attacker.item);
	} else if (move.name === "Multi-Attack" && attacker.item.indexOf("Memory") !== -1) {
		move.type = getMultiAttack(attacker.item);
	} else if (move.name === "Natural Gift" && attacker.item.indexOf("Berry") !== -1) {
		var gift = getNaturalGift(attacker.item);
		move.type = gift.t;
		move.bp = gift.p;
		description.attackerItem = attacker.item;
		description.moveBP = move.bp;
		description.moveType = move.type;
	} else if (move.name === "Nature Power") {
		move.type = field.terrain === "Electric" ? "Electric" : field.terrain === "Grassy" ? "Grass" : field.terrain === "Misty" ? "Fairy" : field.terrain === "Psychic" ? "Psychic" : "Normal";
	} else if (move.name == "Revelation Dance") {
		move.type = attacker.type1;
	}

	var isAerilate = false;
	var isPixilate = false;
	var isRefrigerate = false;
	var isGalvanize = false;
	var isLiquidVoice = false;

	if (!move.isZ) {
		isAerilate = attacker.ability === "Aerilate" && move.type === "Normal";
		isPixilate = attacker.ability === "Pixilate" && move.type === "Normal";
		isRefrigerate = attacker.ability === "Refrigerate" && move.type === "Normal";
		isGalvanize = attacker.ability === "Galvanize" && move.type === "Normal";
		isLiquidVoice = attacker.ability === "Liquid Voice" && move.isSound;
		if (isAerilate) {
			move.type = "Flying";
		} else if (isGalvanize) {
			move.type = "Electric";
		} else if (isLiquidVoice) {
			move.type = "Water";
		} else if (isPixilate) {
			move.type = "Fairy";
		} else if (isRefrigerate) {
			move.type = "Ice";
		} else if (attacker.ability === "Normalize") {
			move.type = "Normal";
			description.attackerAbility = attacker.ability;
		}
	}

	if ((attacker.ability === "Gale Wings" && move.type === "Flying" && (gen >= 7 ? attacker.curHP === attacker.maxHP : true)) ||
            (attacker.ability === "Triage" && move.givesHealth)) {
		move.hasPriority = true;
		description.attackerAbility = attacker.ability;
	}

	var typeEffect1 = getMoveEffectiveness(move, defender.type1, attacker.ability === "Scrappy" || field.isForesight, field.isGravity);
	var typeEffect2 = defender.type2 ? getMoveEffectiveness(move, defender.type2, attacker.ability === "Scrappy" || field.isForesight, field.isGravity) : 1;
	var typeEffectiveness = typeEffect1 * typeEffect2;
	var resistedKnockOffDamage = (defender.item === "" ||
            (defender.name === "Giratina-Origin" && defender.item === "Griseous Orb") ||
            (defender.name.indexOf("Arceus") !== -1 && defender.item.indexOf("Plate") !== -1) ||
            (defender.name.indexOf("Genesect") !== -1 && defender.item.indexOf("Drive") !== -1) ||
            (defender.ability.indexOf("RKS System") !== -1 && defender.item.indexOf("Memory") !== -1) ||
            (defender.item.indexOf(" Z") !== -1));

	if (typeEffectiveness === 0 && move.name === "Thousand Arrows") {
		typeEffectiveness = 1;
	}
	if (defender.item === "Ring Target" && typeEffectiveness === 0) {
		if (typeChart[move.type][defender.type1] === 0) {
			typeEffectiveness = typeEffect2;
		} else if (typeChart[move.type][defender.type2] === 0) {
			typeEffectiveness = typeEffect1;
		}
	}
	if (typeEffectiveness === 0) {
		return {"damage": [0], "description": buildDescription(description)};
	}
	if (move.name === "Sky Drop" && (defender.type1 === "Flying" || defender.type2 === "Flying" || (gen >= 6 && defender.weight >= 200) || field.isGravity)) {
		return {"damage": [0], "description": buildDescription(description)};
	}
	if (move.name === "Synchronoise" && [defender.type1, defender.type2].indexOf(attacker.type1) === -1 &&
            (!attacker.type2 || [defender.type1, defender.type2].indexOf(attacker.type2) === -1)) {
		return {"damage": [0], "description": buildDescription(description)};
	}
	if (move.name === "Dream Eater" && (defender.status !== 'Asleep' && defender.ability !== 'Comatose')) {
		return {"damage": [0], "description": buildDescription(description)};
	}
	if ((defAbility === "Wonder Guard" && typeEffectiveness <= 1) ||
            (move.type === "Grass" && defAbility === "Sap Sipper") ||
            (move.type === "Fire" && defAbility.indexOf("Flash Fire") !== -1) ||
            (move.type === "Water" && ["Dry Skin", "Storm Drain", "Water Absorb"].indexOf(defAbility) !== -1) ||
            (move.type === "Electric" && ["Lightning Rod", "Motor Drive", "Volt Absorb"].indexOf(defAbility) !== -1) ||
            (move.type === "Ground" && !field.isGravity && move.name !== "Thousand Arrows" && defAbility === "Levitate") ||
            (move.isBullet && defAbility === "Bulletproof") ||
            (move.isSound && defAbility === "Soundproof") ||
            (move.hasPriority && ["Queenly Majesty", "Dazzling"].indexOf(defAbility) !== -1)) {
		description.defenderAbility = defAbility;
		return {"damage": [0], "description": buildDescription(description)};
	}
	if (field.weather === "Strong Winds" && (defender.type1 === "Flying" || defender.type2 === "Flying") && typeChart[move.type]["Flying"] > 1) {
		typeEffectiveness /= 2;
		description.weather = field.weather;
	}
	if (move.type === "Ground" && move.name !== "Thousand Arrows" && !field.isGravity && defender.item === "Air Balloon") {
		description.defenderItem = defender.item;
		return {"damage": [0], "description": buildDescription(description)};
	}
	if (move.hasPriority && field.terrain === "Psychic" && isGroundedForCalc(defender, field)) {
		description.terrain = field.terrain;
		return {"damage": [0], "description": buildDescription(description)};
	}

	description.HPEVs = defender.HPEVs + " HP";

	if (move.name === "Seismic Toss" || move.name === "Night Shade") {
		var lv = attacker.level;
		if (attacker.ability === "Parental Bond") {
			lv *= 2;
		}
		return {"damage": [lv], "description": buildDescription(description)};
	}

	if (move.name === "Final Gambit") {
		var hp = attacker.curHP;
		return {"damage": [hp], "description": buildDescription(description)};
	}

	if (move.hits > 1) {
		description.hits = move.hits;
	}
	var turnOrder = attacker.stats[SP] > defender.stats[SP] ? "FIRST" : "LAST";

	////////////////////////////////
	////////// BASE POWER //////////
	////////////////////////////////
	var basePower;
	switch (move.name) {
	case "Payback":
		basePower = turnOrder === "LAST" ? 100 : 50;
		description.moveBP = basePower;
		break;
	case "Electro Ball":
		var r = Math.floor(attacker.stats[SP] / defender.stats[SP]);
		basePower = r >= 4 ? 150 : r >= 3 ? 120 : r >= 2 ? 80 : 60;
		description.moveBP = basePower;
		break;
	case "Gyro Ball":
		basePower = Math.min(150, Math.floor(25 * defender.stats[SP] / attacker.stats[SP]));
		description.moveBP = basePower;
		break;
	case "Punishment":
		basePower = Math.min(200, 60 + 20 * countBoosts(defender.boosts));
		description.moveBP = basePower;
		break;
	case "Low Kick":
	case "Grass Knot":
		var w = defender.weight;
		basePower = w >= 200 ? 120 : w >= 100 ? 100 : w >= 50 ? 80 : w >= 25 ? 60 : w >= 10 ? 40 : 20;
		description.moveBP = basePower;
		break;
	case "Hex":
		basePower = move.bp * (defender.status !== "Healthy" ? 2 : 1);
		description.moveBP = basePower;
		break;
	case "Heavy Slam":
	case "Heat Crash":
		var wr = attacker.weight / defender.weight;
		basePower = wr >= 5 ? 120 : wr >= 4 ? 100 : wr >= 3 ? 80 : wr >= 2 ? 60 : 40;
		description.moveBP = basePower;
		break;
	case "Stored Power":
	case "Power Trip":
		basePower = 20 + 20 * countBoosts(attacker.boosts);
		description.moveBP = basePower;
		break;
	case "Acrobatics":
		basePower = attacker.item === "Flying Gem" || attacker.item === "" ? 110 : 55;
		description.moveBP = basePower;
		break;
	case "Wake-Up Slap":
		basePower = move.bp * (defender.status === "Asleep" ? 2 : 1);
		description.moveBP = basePower;
		break;
	case "Weather Ball":
		basePower = field.weather !== "" ? 100 : 50;
		description.moveBP = basePower;
		break;
	case "Fling":
		basePower = getFlingPower(attacker.item);
		description.moveBP = basePower;
		description.attackerItem = attacker.item;
		break;
	case "Eruption":
	case "Water Spout":
		basePower = Math.max(1, Math.floor(150 * attacker.curHP / attacker.maxHP));
		description.moveBP = basePower;
		break;
	case "Flail":
	case "Reversal":
		var p = Math.floor(48 * attacker.curHP / attacker.maxHP);
		basePower = p <= 1 ? 200 : p <= 4 ? 150 : p <= 9 ? 100 : p <= 16 ? 80 : p <= 32 ? 40 : 20;
		description.moveBP = basePower;
		break;
	case "Nature Power":
		basePower = (field.terrain === "Electric" || field.terrain === "Grassy" || field.terrain === "Psychic") ? 90 : (field.terrain === "Misty") ? 95 : 80;
		//console.log("A " + field.terrain + " terrain " + move.type + move.name + " with " + move.bp + " base power " + " agaisnt a(n) " + defender.name + " that has " + defender.type1 + " " + defender.type2 + " typing");
		break;
	case "Water Shuriken":
		basePower = (attacker.name === "Greninja-Ash") ? 20 : 15;
		description.moveBP = basePower;
		break;
	case "Wring Out":
		basePower = Math.max(1, Math.ceil(defender.curHP * 120 / defender.maxHP - 0.5));
		description.moveBP = basePower;
		break;
	default:
		basePower = move.bp;
	}

	var bpMods = [];
	if ((attacker.ability === "Technician" && basePower <= 60) ||
            (attacker.ability === "Flare Boost" && attacker.status === "Burned" && move.category === "Special") ||
            (attacker.ability === "Toxic Boost" && (attacker.status === "Poisoned" || attacker.status === "Badly Poisoned") &&
                    move.category === "Physical")) {
		bpMods.push(0x1800);
		description.attackerAbility = attacker.ability;
	} else if (attacker.ability === "Analytic" && turnOrder !== "FIRST") {
		bpMods.push(0x14CD);
		description.attackerAbility = attacker.ability;
	} else if (attacker.ability === "Sand Force" && field.weather === "Sand" && ["Rock", "Ground", "Steel"].indexOf(move.type) !== -1) {
		bpMods.push(0x14CD);
		description.attackerAbility = attacker.ability;
		description.weather = field.weather;
	} else if ((attacker.ability === "Reckless" && move.hasRecoil) ||
            (attacker.ability === "Iron Fist" && move.isPunch)) {
		bpMods.push(0x1333);
		description.attackerAbility = attacker.ability;
	}

	if (defAbility === "Heatproof" && move.type === "Fire") {
		bpMods.push(0x800);
		description.defenderAbility = defAbility;
	} else if (defAbility === "Dry Skin" && move.type === "Fire") {
		bpMods.push(0x1400);
		description.defenderAbility = defAbility;
	} else if (defAbility === "Fluffy" && (!move.makesContact || attacker.ability === "Long Reach") && move.type === "Fire") {
		bpMods.push(0x2000);
		description.defenderAbility = defAbility;
	} else if (defAbility === "Fluffy" && move.makesContact && attacker.ability !== "Long Reach" && move.type !== "Fire") {
		bpMods.push(0x800);
		description.defenderAbility = defAbility;
	}

	if (attacker.ability === "Sheer Force" && move.hasSecondaryEffect) {
		bpMods.push(0x14CD);
		description.attackerAbility = attacker.ability;
	}

	if (getItemBoostType(attacker.item) === move.type) {
		bpMods.push(0x1333);
		description.attackerItem = attacker.item;
	} else if ((attacker.item === "Muscle Band" && move.category === "Physical") ||
            (attacker.item === "Wise Glasses" && move.category === "Special")) {
		bpMods.push(0x1199);
		description.attackerItem = attacker.item;
	} else if (((attacker.item === "Adamant Orb" && attacker.name === "Dialga") ||
            (attacker.item === "Lustrous Orb" && attacker.name === "Palkia") ||
            (attacker.item === "Griseous Orb" && attacker.name === "Giratina-Origin")) &&
            (move.type === attacker.type1 || move.type === attacker.type2)) {
		bpMods.push(0x1333);
		description.attackerItem = attacker.item;
	} else if (attacker.item === move.type + " Gem") {
		bpMods.push(gen >= 6 ? 0x14CD : 0x1800);
		description.attackerItem = attacker.item;
	} else if (((attacker.item === "Soul Dew" && attacker.name === "Latios") ||
        (attacker.item === "Soul Dew" && attacker.name === "Latios-Mega") ||
        (attacker.item === "Soul Dew" && attacker.name === "Latias") ||
        (attacker.item === "Soul Dew" && attacker.name === "Latias-Mega")) &&
        (move.type === attacker.type1 || move.type === attacker.type2)) {
		bpMods.push(gen >= 7 ? 0x1333 : 0x1000);
		description.attackerItem = attacker.item;
	}

	if ((move.name === "Facade" && ["Burned", "Paralyzed", "Poisoned", "Badly Poisoned"].indexOf(attacker.status) !== -1) ||
            (move.name === "Brine" && defender.curHP <= defender.maxHP / 2) ||
            (move.name === "Venoshock" && (defender.status === "Poisoned" || defender.status === "Badly Poisoned"))) {
		bpMods.push(0x2000);
		description.moveBP = move.bp * 2;
	} else if (move.name === "Solar Beam" && ["Rain", "Heavy Rain", "Sand", "Hail"].indexOf(field.weather) !== -1) {
		bpMods.push(0x800);
		description.moveBP = move.bp / 2;
		description.weather = field.weather;
	} else if (gen >= 6 && move.name === "Knock Off" && !resistedKnockOffDamage) {
		bpMods.push(0x1800);
		description.moveBP = move.bp * 1.5;
	} else if (["Breakneck Blitz", "Bloom Doom", "Inferno Overdrive", "Hydro Vortex", "Gigavolt Havoc", "Subzero Slammer", "Supersonic Skystrike",
		"Savage Spin-Out", "Acid Downpour", "Tectonic Rage", "Continental Crush", "All-Out Pummeling", "Shattered Psyche", "Never-Ending Nightmare",
		"Devastating Drake", "Black Hole Eclipse", "Corkscrew Crash", "Twinkle Tackle"].indexOf(move.name) !== -1) {
		// show z-move power in description
		description.moveBP = move.bp;
	}

	if (field.isHelpingHand) {
		bpMods.push(0x1800);
		description.isHelpingHand = true;
	}

	if (isAerilate || isPixilate || isRefrigerate || isGalvanize) {
		bpMods.push(gen >= 7 ? 0x1333 : 0x14CD);
		description.attackerAbility = attacker.ability;
	} else if ((attacker.ability === "Mega Launcher" && move.isPulse) ||
            (attacker.ability === "Strong Jaw" && move.isBite)) {
		bpMods.push(0x1800);
		description.attackerAbility = attacker.ability;
	} else if (attacker.ability === "Tough Claws" && move.makesContact) {
		bpMods.push(0x14CD);
		description.attackerAbility = attacker.ability;
	} else if (attacker.ability === "Neuroforce" && typeEffectiveness > 1) {
		bpMods.push(0x1333);
		description.attackerAbility = attacker.ability;
	}

	var isAttackerAura = attacker.ability === (move.type + " Aura");
	var isDefenderAura = defAbility === (move.type + " Aura");
	if (isAttackerAura || isDefenderAura) {
		if (attacker.ability === "Aura Break" || defAbility === "Aura Break") {
			bpMods.push(0x0C00);
			description.attackerAbility = attacker.ability;
			description.defenderAbility = defAbility;
		} else {
			bpMods.push(0x1547);
			if (isAttackerAura) {
				description.attackerAbility = attacker.ability;
			}
			if (isDefenderAura) {
				description.defenderAbility = defAbility;
			}
		}
	}

	basePower = Math.max(1, pokeRound(basePower * chainMods(bpMods) / 0x1000));

	////////////////////////////////
	////////// (SP)ATTACK //////////
	////////////////////////////////
	var attack;
	var attackSource = move.name === "Foul Play" ? defender : attacker;
	if (move.usesHighestAttackStat) {
		move.category = attackSource.stats[AT] >= attackSource.stats[SA] ? "Physical" : "Special";
	}
	var attackStat = move.category === "Physical" ? AT : SA;
	description.attackEVs = attacker.evs[attackStat] +
            (NATURES[attacker.nature][0] === attackStat ? "+" : NATURES[attacker.nature][1] === attackStat ? "-" : "") + " " +
            toSmogonStat(attackStat);
	if (attackSource.boosts[attackStat] === 0 || (isCritical && attackSource.boosts[attackStat] < 0)) {
		attack = attackSource.rawStats[attackStat];
	} else if (defAbility === "Unaware") {
		attack = attackSource.rawStats[attackStat];
		description.defenderAbility = defAbility;
	} else {
		attack = attackSource.stats[attackStat];
		description.attackBoost = attackSource.boosts[attackStat];
	}

	// unlike all other attack modifiers, Hustle gets applied directly
	if (attacker.ability === "Hustle" && move.category === "Physical") {
		attack = pokeRound(attack * 3 / 2);
		description.attackerAbility = attacker.ability;
	}

	var atMods = [];
	if (defAbility === "Thick Fat" && (move.type === "Fire" || move.type === "Ice") || (defAbility === "Water Bubble" && move.type === "Fire")) {
		atMods.push(0x800);
		description.defenderAbility = defAbility;
	}

	if ((attacker.ability === "Guts" && attacker.status !== "Healthy" && move.category === "Physical") ||
            (attacker.ability === "Overgrow" && attacker.curHP <= attacker.maxHP / 3 && move.type === "Grass") ||
            (attacker.ability === "Blaze" && attacker.curHP <= attacker.maxHP / 3 && move.type === "Fire") ||
            (attacker.ability === "Torrent" && attacker.curHP <= attacker.maxHP / 3 && move.type === "Water") ||
            (attacker.ability === "Swarm" && attacker.curHP <= attacker.maxHP / 3 && move.type === "Bug") || (move.category === "Special" && (attacker.ability === "Plus" || attacker.ability === "Minus"))) {
		atMods.push(0x1800);
		description.attackerAbility = attacker.ability;
	} else if (attacker.ability === "Flash Fire (activated)" && move.type === "Fire") {
		atMods.push(0x1800);
		description.attackerAbility = "Flash Fire";
	} else if ((attacker.ability === "Solar Power" && field.weather.indexOf("Sun") !== -1 && move.category === "Special") ||
            (attacker.ability === "Flower Gift" && field.weather.indexOf("Sun") !== -1 && move.category === "Physical")) {
		atMods.push(0x1800);
		description.attackerAbility = attacker.ability;
		description.weather = field.weather;
	} else if ((attacker.ability === "Defeatist" && attacker.curHP <= attacker.maxHP / 2) ||
            (attacker.ability === "Slow Start" && move.category === "Physical")) {
		atMods.push(0x800);
		description.attackerAbility = attacker.ability;
	} else if ((attacker.ability === "Huge Power" || attacker.ability === "Pure Power") && move.category === "Physical") {
		atMods.push(0x2000);
		description.attackerAbility = attacker.ability;
	}

	if ((attacker.item === "Thick Club" && (attacker.name === "Cubone" || attacker.name === "Marowak" || attacker.name === "Marowak-Alola") && move.category === "Physical") ||
            (attacker.item === "Deep Sea Tooth" && attacker.name === "Clamperl" && move.category === "Special") ||
            (attacker.item === "Light Ball" && attacker.name === "Pikachu") && !move.isZ) {
		atMods.push(0x2000);
		description.attackerItem = attacker.item;
	} else if ((gen < 7 && attacker.item === "Soul Dew" && (attacker.name === "Latios" || attacker.name === "Latias") && move.category === "Special") ||
            (attacker.item === "Choice Band" && move.category === "Physical" && !move.isZ) ||
            (attacker.item === "Choice Specs" && move.category === "Special" && !move.isZ)) {
		atMods.push(0x1800);
		description.attackerItem = attacker.item;
	}

	attack = Math.max(1, pokeRound(attack * chainMods(atMods) / 0x1000));

	////////////////////////////////
	///////// (SP)DEFENSE //////////
	////////////////////////////////
	var defense;
	var hitsPhysical = move.category === "Physical" || move.dealsPhysicalDamage;
	var defenseStat = hitsPhysical ? DF : SD;
	description.defenseEVs = defender.evs[defenseStat] +
            (NATURES[defender.nature][0] === defenseStat ? "+" : NATURES[defender.nature][1] === defenseStat ? "-" : "") + " " +
            toSmogonStat(defenseStat);
	if (defender.boosts[defenseStat] === 0 || (isCritical && defender.boosts[defenseStat] > 0) || move.ignoresDefenseBoosts) {
		defense = defender.rawStats[defenseStat];
	} else if (attacker.ability === "Unaware") {
		defense = defender.rawStats[defenseStat];
		description.attackerAbility = attacker.ability;
	} else {
		defense = defender.stats[defenseStat];
		description.defenseBoost = defender.boosts[defenseStat];
	}

	// unlike all other defense modifiers, Sandstorm SpD boost gets applied directly
	if (field.weather === "Sand" && (defender.type1 === "Rock" || defender.type2 === "Rock") && !hitsPhysical) {
		defense = pokeRound(defense * 3 / 2);
		description.weather = field.weather;
	}

	var dfMods = [];
	if (defAbility === "Marvel Scale" && defender.status !== "Healthy" && hitsPhysical) {
		dfMods.push(0x1800);
		description.defenderAbility = defAbility;
	} else if (defAbility === "Flower Gift" && field.weather.indexOf("Sun") !== -1 && !hitsPhysical) {
		dfMods.push(0x1800);
		description.defenderAbility = defAbility;
		description.weather = field.weather;
	}

	if (field.terrain === "Grassy" && defAbility === "Grass Pelt" && hitsPhysical) {
		dfMods.push(0x1800);
		description.defenderAbility = defAbility;
	}

	if ((gen < 7 && defender.item === "Soul Dew" && (defender.name === "Latios" || defender.name === "Latias") && !hitsPhysical) ||
            (defender.item === "Assault Vest" && !hitsPhysical) || defender.item === "Eviolite") {
		dfMods.push(0x1800);
		description.defenderItem = defender.item;
	}

	if ((defender.item === "Metal Powder" && defender.name === "Ditto" && hitsPhysical) ||
            (defender.item === "Deep Sea Scale" && defender.name === "Clamperl" && !hitsPhysical)) {
		dfMods.push(0x2000);
		description.defenderItem = defender.item;
	}

	if (defAbility === "Fur Coat" && hitsPhysical) {
		dfMods.push(0x2000);
		description.defenderAbility = defAbility;
	}

	defense = Math.max(1, pokeRound(defense * chainMods(dfMods) / 0x1000));

	////////////////////////////////
	//////////// DAMAGE ////////////
	////////////////////////////////
	var baseDamage = Math.floor(Math.floor((Math.floor((2 * attacker.level) / 5 + 2) * basePower * attack) / defense) / 50 + 2);
	if (field.format !== "Singles" && move.isSpread) {
		baseDamage = pokeRound(baseDamage * 0xC00 / 0x1000);
	}
	if ((field.weather.indexOf("Sun") !== -1 && move.type === "Fire") || (field.weather.indexOf("Rain") !== -1 && move.type === "Water")) {
		baseDamage = pokeRound(baseDamage * 0x1800 / 0x1000);
		description.weather = field.weather;
	} else if ((field.weather === "Sun" && move.type === "Water") || (field.weather === "Rain" && move.type === "Fire")) {
		baseDamage = pokeRound(baseDamage * 0x800 / 0x1000);
		description.weather = field.weather;
	} else if ((field.weather === "Harsh Sunshine" && move.type === "Water") || (field.weather === "Heavy Rain" && move.type === "Fire")) {
		return {"damage": [0], "description": buildDescription(description)};
	}
	if (field.isGravity || (attacker.type1 !== "Flying" && attacker.type2 !== "Flying" &&
                attacker.item !== "Air Balloon" && attacker.ability !== "Levitate")) {
		if (field.terrain === "Electric" && move.type === "Electric") {
			baseDamage = pokeRound(baseDamage * 0x1800 / 0x1000);
			description.terrain = field.terrain;
		} else if (field.terrain === "Grassy" && move.type == "Grass") {
			baseDamage = pokeRound(baseDamage * 0x1800 / 0x1000);
			description.terrain = field.terrain;
		} else if (field.terrain === "Psychic" && move.type === "Psychic") {
			baseDamage = pokeRound(baseDamage * 0x1800 / 0x1000);
			description.terrain = field.terrain;
		}
	}
	if (field.isGravity || (defender.type1 !== "Flying" && defender.type2 !== "Flying" &&
            defender.item !== "Air Balloon" && defender.ability !== "Levitate")) {
		if (field.terrain === "Misty" && move.type === "Dragon") {
			baseDamage = pokeRound(baseDamage * 0x800 / 0x1000);
			description.terrain = field.terrain;
		} else if (field.terrain === "Grassy" && (move.name === "Bulldoze" || move.name === "Earthquake")) {
			baseDamage = pokeRound(baseDamage * 0x800 / 0x1000);
			description.terrain = field.terrain;
		}
	}
	if (isCritical) {
		baseDamage = Math.floor(baseDamage * (gen >= 6 ? 1.5 : 2));
		description.isCritical = isCritical;
	}
	// the random factor is applied between the crit mod and the stab mod, so don't apply anything below this until we're inside the loop
	var stabMod = 0x1000;
	if (move.type === attacker.type1 || move.type === attacker.type2) {
		if (attacker.ability === "Adaptability") {
			stabMod = 0x2000;
			description.attackerAbility = attacker.ability;
		} else {
			stabMod = 0x1800;
		}
	} else if (attacker.ability === "Protean") {
		stabMod = 0x1800;
		description.attackerAbility = attacker.ability;
	}
	var applyBurn = (attacker.status === "Burned" && move.category === "Physical" && attacker.ability !== "Guts" && !move.ignoresBurn);
	description.isBurned = applyBurn;
	var finalMods = [];
	if (field.isReflect && move.category === "Physical" && !isCritical) {
		finalMods.push(field.format !== "Singles" ? (gen >= 6 ? 0xAAC : 0xA8F) : 0x800);
		description.isReflect = true;
	} else if (field.isLightScreen && move.category === "Special" && !isCritical) {
		finalMods.push(field.format !== "Singles" ? (gen >= 6 ? 0xAAC : 0xA8F) : 0x800);
		description.isLightScreen = true;
	}
	if ((defAbility === "Multiscale" || defAbility === "Shadow Shield") && defender.curHP === defender.maxHP && !field.isSR && (!field.spikes || defender.type1 === "Flying" || defender.type2 === "Flying")) {
		finalMods.push(0x800);
		description.defenderAbility = defAbility;
	}
	if (attacker.ability === "Tinted Lens" && typeEffectiveness < 1) {
		finalMods.push(0x2000);
		description.attackerAbility = attacker.ability;
	}
	if (attacker.ability === "Water Bubble" && move.type === "Water") {
		finalMods.push(0x2000);
		description.attackerAbility = attacker.ability;
	}
	if (attacker.ability === "Steelworker" && move.type === "Steel") {
		finalMods.push(0x1800);
		description.attackerAbility = attacker.ability;
	}
	if (field.isFriendGuard) {
		finalMods.push(0xC00);
		description.isFriendGuard = true;
	}
	if (field.isAuroraVeil && !isCritical) { //doesn't protect from critical hits
		finalMods.push(field.format !== "Singles" ? 0xAAC : 0x800); // 0.5x damage from physical and special attacks in singles, 0.66x damage in Doubles
		description.isAuroraVeil = true;
	}
	if (attacker.ability === "Sniper" && isCritical) {
		finalMods.push(0x1800);
		description.attackerAbility = attacker.ability;
	}
	if ((defAbility === "Solid Rock" || defAbility === "Filter" || defAbility === "Prism Armor") && typeEffectiveness > 1) {
		finalMods.push(0xC00);
		description.defenderAbility = defAbility;
	}
	if (attacker.item === "Expert Belt" && typeEffectiveness > 1 && !move.isZ) {
		finalMods.push(0x1333);
		description.attackerItem = attacker.item;
	} else if (attacker.item === "Life Orb" && !move.isZ) {
		finalMods.push(0x14CC);
		description.attackerItem = attacker.item;
	}
	if (getBerryResistType(defender.item) === move.type && (typeEffectiveness > 1 || move.type === "Normal") &&
            attacker.ability !== "Unnerve") {
		finalMods.push(0x800);
		description.defenderItem = defender.item;
	}
	if (field.isProtected && move.isZ) {
		finalMods.push(0x400);
		description.isProtected = true;
	}
	var finalMod = chainMods(finalMods);

	var damage = [];
	for (var i = 0; i < 16; i++) {
		damage[i] = Math.floor(baseDamage * (85 + i) / 100);
		damage[i] = pokeRound(damage[i] * stabMod / 0x1000);
		damage[i] = Math.floor(damage[i] * typeEffectiveness);
		if (applyBurn) {
			damage[i] = Math.floor(damage[i] / 2);
		}
		damage[i] = Math.max(1, damage[i]);
		damage[i] = pokeRound(damage[i] * finalMod / 0x1000);

		// is 2nd hit half BP? half attack? half damage range? keeping it as a flat multiplier until I know the specifics
		if (attacker.ability === "Parental Bond" && move.hits === 1 && (field.format === "Singles" || !move.isSpread)) {
			var bondFactor = gen < 7 ? 3 / 2 : 5 / 4; // in gen 7, 2nd hit was reduced from 50% to 25%
			damage[i] = Math.floor(damage[i] * bondFactor);
			description.attackerAbility = attacker.ability;
		}
	}
	return {"damage": damage, "description": buildDescription(description)};
}

function toSmogonStat(stat) {
	return stat === AT ? "Atk" :
		stat === DF ? "Def" :
			stat === SA ? "SpA" :
				stat === SD ? "SpD" :
					stat === SP ? "Spe" :
						"wtf";
}

function chainMods(mods) {
	var M = 0x1000;
	for (var i = 0; i < mods.length; i++) {
		if (mods[i] !== 0x1000) {
			M = ((M * mods[i]) + 0x800) >> 12;
		}
	}
	return M;
}

function getMoveEffectiveness(move, type, isGhostRevealed, isGravity) {
	if (isGhostRevealed && type === "Ghost" && (move.type === "Normal" || move.type === "Fighting")) {
		return 1;
	} else if (isGravity && type === "Flying" && move.type === "Ground") {
		return 1;
	} else if (move.name === "Freeze-Dry" && type === "Water") {
		return 2;
	} else if (move.name === "Flying Press") {
		return typeChart["Fighting"][type] * typeChart["Flying"][type];
	} else {
		return typeChart[move.type][type];
	}
}

function getModifiedStat(stat, mod) {
	return mod > 0 ? Math.floor(stat * (2 + mod) / 2) :
		mod < 0 ? Math.floor(stat * 2 / (2 - mod)) :
			stat;
}

function getFinalSpeed(pokemon, weather) {
	var speed = getModifiedStat(pokemon.rawStats[SP], pokemon.boosts[SP]);
	if (pokemon.item === "Choice Scarf") {
		speed = Math.floor(speed * 1.5);
	} else if (pokemon.item === "Macho Brace" || pokemon.item === "Iron Ball") {
		speed = Math.floor(speed / 2);
	}
	if ((pokemon.ability === "Chlorophyll" && weather.indexOf("Sun") !== -1) ||
            (pokemon.ability === "Sand Rush" && weather === "Sand") ||
            (pokemon.ability === "Swift Swim" && weather.indexOf("Rain") !== -1) ||
            (pokemon.ability === "Slush Rush" && weather.indexOf("Hail") !== -1)) {
		speed *= 2;
	}
	return speed;
}

function checkAirLock(pokemon, field) {
	if (pokemon.ability === "Air Lock" || pokemon.ability === "Cloud Nine") {
		field.clearWeather();
	}
}
function checkForecast(pokemon, weather) {
	if (pokemon.ability === "Forecast" && pokemon.name === "Castform") {
		if (weather.indexOf("Sun") !== -1) {
			pokemon.type1 = "Fire";
		} else if (weather.indexOf("Rain") !== -1) {
			pokemon.type1 = "Water";
		} else if (weather === "Hail") {
			pokemon.type1 = "Ice";
		} else {
			pokemon.type1 = "Normal";
		}
		pokemon.type2 = "";
	}
}
function checkKlutz(pokemon) {
	if (pokemon.ability === "Klutz") {
		pokemon.item = "";
	}
}
function checkIntimidate(source, target) {
	if (source.ability === "Intimidate") {
		if (target.ability === "Contrary" || target.ability === "Defiant") {
			target.boosts[AT] = Math.min(6, target.boosts[AT] + 1);
		} else if (["Clear Body", "White Smoke", "Hyper Cutter", "Full Metal Body"].indexOf(target.ability) !== -1) {
			// no effect
		} else if (target.ability === "Simple") {
			target.boosts[AT] = Math.max(-6, target.boosts[AT] - 2);
		} else {
			target.boosts[AT] = Math.max(-6, target.boosts[AT] - 1);
		}
	}
}
function checkDownload(source, target) {
	if (source.ability === "Download") {
		if (target.stats[SD] <= target.stats[DF]) {
			source.boosts[SA] = Math.min(6, source.boosts[SA] + 1);
		} else {
			source.boosts[AT] = Math.min(6, source.boosts[AT] + 1);
		}
	}
}
function checkInfiltrator(attacker, affectedSide) {
	if (attacker.ability === "Infiltrator") {
		affectedSide.isReflect = false;
		affectedSide.isLightScreen = false;
		affectedSide.isAuroraVeil = false;
	}
}

function countBoosts(boosts) {
	var sum = 0;
	for (var i = 0; i < STATS.length; i++) {
		if (boosts[STATS[i]] > 0) {
			sum += boosts[STATS[i]];
		}
	}
	return sum;
}

function isGroundedForCalc(pokemon, field) {
	return field.isGravity || (
		pokemon.type1 !== "Flying" &&
        pokemon.type2 !== "Flying" &&
        pokemon.ability !== "Levitate" &&
        pokemon.item !== "Air Balloon"
	);
}

// GameFreak rounds DOWN on .5
function pokeRound(num) {
	return (num % 1 > 0.5) ? Math.ceil(num) : Math.floor(num);
}

function CALCULATE_ALL_MOVES_DPP(p1, p2, field) {
	checkAirLock(p1, field);
	checkAirLock(p2, field);
	checkForecast(p1, field.getWeather());
	checkForecast(p2, field.getWeather());
	checkKlutz(p1);
	checkKlutz(p2);
	checkIntimidate(p1, p2);
	checkIntimidate(p2, p1);
	checkDownload(p1, p2);
	checkDownload(p2, p1);
	p1.stats[SP] = getFinalSpeed(p1, field.getWeather());
	p2.stats[SP] = getFinalSpeed(p2, field.getWeather());
	var side1 = field.getSide(1);
	var side2 = field.getSide(0);
	var results = [[], []];
	for (var i = 0; i < 4; i++) {
		results[0][i] = CALCULATE_DAMAGE_DPP(p1, p2, p1.moves[i], side1);
		results[1][i] = CALCULATE_DAMAGE_DPP(p2, p1, p2.moves[i], side2);
	}
	return results;
}

function CALCULATE_MOVES_OF_ATTACKER_DPP(attacker, defender, field) {
	checkAirLock(attacker, field);
	checkAirLock(defender, field);
	checkForecast(attacker, field.getWeather());
	checkForecast(defender, field.getWeather());
	checkKlutz(attacker);
	checkKlutz(defender);
	checkIntimidate(attacker, defender);
	checkIntimidate(defender, attacker);
	checkDownload(attacker, defender);
	attacker.stats[SP] = getFinalSpeed(attacker, field.getWeather());
	defender.stats[SP] = getFinalSpeed(defender, field.getWeather());
	var defenderSide = field.getSide(~~(mode === "one-vs-all"));
	var results = [];
	for (var i = 0; i < 4; i++) {
		results[i] = CALCULATE_DAMAGE_DPP(attacker, defender, attacker.moves[i], defenderSide);
	}
	return results;
}

function CALCULATE_DAMAGE_DPP(attacker, defender, move, field) {
	var description = {
		"attackerName": attacker.name,
		"moveName": move.name,
		"defenderName": defender.name
	};

	if (move.bp === 0) {
		return {"damage": [0], "description": buildDescription(description)};
	}

	if (field.isProtected && !move.bypassesProtect) {
		description.isProtected = true;
		return {"damage": [0], "description": buildDescription(description)};
	}

	var defAbility = defender.ability;
	if (attacker.ability === "Mold Breaker") {
		defAbility = "";
		description.attackerAbility = attacker.ability;
	}

	var isCritical = move.isCrit && ["Battle Armor", "Shell Armor"].indexOf(defAbility) === -1;

	if (move.name === "Weather Ball") {
		if (field.weather === "Sun") {
			move.type = "Fire";
			move.bp *= 2;
		} else if (field.weather === "Rain") {
			move.type = "Water";
			move.bp *= 2;
		} else if (field.weather === "Sand") {
			move.type = "Rock";
			move.bp *= 2;
		} else if (field.weather === "Hail") {
			move.type = "Ice";
			move.bp *= 2;
		} else {
			move.type = "Normal";
		}
		description.weather = field.weather;
		description.moveType = move.type;
		description.moveBP = basePower;
	} else if (move.name === "Judgment" && attacker.item.indexOf("Plate") !== -1) {
		move.type = getItemBoostType(attacker.item);
	} else if (move.name === "Natural Gift" && attacker.item.indexOf("Berry") !== -1) {
		var gift = getNaturalGift(attacker.item);
		move.type = gift.t;
		move.bp = gift.p;
		description.attackerItem = attacker.item;
		description.moveBP = move.bp;
		description.moveType = move.type;
	}

	if (attacker.ability === "Normalize") {
		move.type = "Normal";
		description.attackerAbility = attacker.ability;
	}

	var typeEffect1 = getMoveEffectiveness(move, defender.type1, attacker.ability === "Scrappy" || field.isForesight, field.isGravity);
	var typeEffect2 = defender.type2 ? getMoveEffectiveness(move, defender.type2, attacker.ability === "Scrappy" || field.isForesight, field.isGravity) : 1;
	var typeEffectiveness = typeEffect1 * typeEffect2;

	if (typeEffectiveness === 0) {
		return {"damage": [0], "description": buildDescription(description)};
	}
	if ((defAbility === "Wonder Guard" && typeEffectiveness <= 1) ||
            (move.type === "Fire" && defAbility.indexOf("Flash Fire") !== -1) ||
            (move.type === "Water" && ["Dry Skin", "Water Absorb"].indexOf(defAbility) !== -1) ||
            (move.type === "Electric" && ["Motor Drive", "Volt Absorb"].indexOf(defAbility) !== -1) ||
            (move.type === "Ground" && !field.isGravity && defAbility === "Levitate") ||
            (move.isSound && defAbility === "Soundproof")) {
		description.defenderAbility = defAbility;
		return {"damage": [0], "description": buildDescription(description)};
	}

	description.HPEVs = defender.HPEVs + " HP";

	if (move.name === "Seismic Toss" || move.name === "Night Shade") {
		return {"damage": [attacker.level], "description": buildDescription(description)};
	}

	if (move.hits > 1) {
		description.hits = move.hits;
	}
	var turnOrder = attacker.stats[SP] > defender.stats[SP] ? "FIRST" : "LAST";

	////////////////////////////////
	////////// BASE POWER //////////
	////////////////////////////////
	switch (move.name) {
	case "Brine":
		if (defender.curHP <= (defender.maxHP / 2)) {
			move.bp *= 2;
			description.moveBP = move.bp;
		}
		break;
	case "Eruption":
	case "Water Spout":
		move.bp = Math.max(1, Math.floor(move.bp * attacker.curHP / attacker.maxHP));
		description.moveBP = move.bp;
		break;
	case "Facade":
		if (["Paralyzed", "Poisoned", "Badly Poisoned", "Burned"].indexOf(attacker.status) !== -1) {
			move.bp *= 2;
			description.moveBP = move.bp;
		}
		break;
	case "Flail":
	case "Reversal":
		var p = Math.floor(48 * attacker.curHP / attacker.maxHP);
		move.bp = p <= 1 ? 200 : p <= 4 ? 150 : p <= 9 ? 100 : p <= 16 ? 80 : p <= 32 ? 40 : 20;
		description.moveBP = move.bp;
		break;
	case "Fling":
		move.bp = getFlingPower(attacker.item);
		description.moveBP = move.bp;
		description.attackerItem = attacker.item;
		break;
	case "Grass Knot":
	case "Low Kick":
		var w = defender.weight;
		move.bp = w >= 200 ? 120 : w >= 100 ? 100 : w >= 50 ? 80 : w >= 25 ? 60 : w >= 10 ? 40 : 20;
		description.moveBP = move.bp;
		break;
	case "Gyro Ball":
		move.bp = Math.min(150, Math.floor(25 * defender.stats[SP] / attacker.stats[SP]));
		description.moveBP = move.bp;
		break;
	case "Payback":
		if (turnOrder !== "FIRST") {
			move.bp *= 2;
			description.moveBP = move.bp;
		}
		break;
	case "Punishment":
		var boostCount = countBoosts(defender.boosts);
		if (boostCount > 0) {
			move.bp = Math.min(200, move.bp + 20 * boostCount);
			description.moveBP = move.bp;
		}
		break;
	case "Wake-Up Slap":
		if (defender.status === "Asleep") {
			move.bp *= 2;
			description.moveBP = move.bp;
		}
		break;
	case "Wring Out":
		move.bp = Math.floor(defender.curHP * 120 / defender.maxHP) + 1;
		description.moveBP = move.bp;
		break;
	}

	var basePower = move.bp;

	if (field.isHelpingHand) {
		basePower = Math.floor(basePower * 1.5);
		description.isHelpingHand = true;
	}

	var isPhysical = move.category === "Physical";
	if ((attacker.item === "Muscle Band" && isPhysical) || (attacker.item === "Wise Glasses" && !isPhysical)) {
		basePower = Math.floor(basePower * 1.1);
		description.attackerItem = attacker.item;
	} else if (getItemBoostType(attacker.item) === move.type ||
            (((attacker.item === "Adamant Orb" && attacker.name === "Dialga") ||
            (attacker.item === "Lustrous Orb" && attacker.name === "Palkia") ||
            (attacker.item === "Griseous Orb" && attacker.name === "Giratina-Origin")) &&
            (move.type === attacker.type1 || move.type === attacker.type2))) {
		basePower = Math.floor(basePower * 1.2);
		description.attackerItem = attacker.item;
	}

	if ((attacker.ability === "Reckless" && move.hasRecoil) ||
            (attacker.ability === "Iron Fist" && move.isPunch)) {
		basePower = Math.floor(basePower * 1.2);
		description.attackerAbility = attacker.ability;
	} else if ((attacker.curHP <= attacker.maxHP / 3 &&
            ((attacker.ability === "Overgrow" && move.type === "Grass") ||
            (attacker.ability === "Blaze" && move.type === "Fire") ||
            (attacker.ability === "Torrent" && move.type === "Water") ||
            (attacker.ability === "Swarm" && move.type === "Bug"))) ||
            (attacker.ability === "Technician" && move.bp <= 60)) {
		basePower = Math.floor(basePower * 1.5);
		description.attackerAbility = attacker.ability;
	}

	if ((defAbility === "Thick Fat" && (move.type === "Fire" || move.type === "Ice")) ||
            (defAbility === "Heatproof" && move.type === "Fire")) {
		basePower = Math.floor(basePower * 0.5);
		description.defenderAbility = defAbility;
	} else if (defAbility === "Dry Skin" && move.type === "Fire") {
		basePower = Math.floor(basePower * 1.25);
		description.defenderAbility = defAbility;
	}

	////////////////////////////////
	////////// (SP)ATTACK //////////
	////////////////////////////////
	var attackStat = isPhysical ? AT : SA;
	description.attackEVs = attacker.evs[attackStat] +
            (NATURES[attacker.nature][0] === attackStat ? "+" : NATURES[attacker.nature][1] === attackStat ? "-" : "") + " " +
            toSmogonStat(attackStat);
	var attack;
	var attackBoost = attacker.boosts[attackStat];
	var rawAttack = attacker.rawStats[attackStat];
	if (attackBoost === 0 || (isCritical && attackBoost < 0)) {
		attack = rawAttack;
	} else if (defAbility === "Unaware") {
		attack = rawAttack;
		description.defenderAbility = defAbility;
	} else if (attacker.ability === "Simple") {
		attack = getSimpleModifiedStat(rawAttack, attackBoost);
		description.attackerAbility = attacker.ability;
		description.attackBoost = attackBoost;
	} else {
		attack = getModifiedStat(rawAttack, attackBoost);
		description.attackBoost = attackBoost;
	}

	if (isPhysical && (attacker.ability === "Pure Power" || attacker.ability === "Huge Power")) {
		attack *= 2;
		description.attackerAbility = attacker.ability;
	} else if (field.weather === "Sun" && (isPhysical ? attacker.ability === "Flower Gift" : attacker.ability === "Solar Power")) {
		attack = Math.floor(attack * 1.5);
		description.attackerAbility = attacker.ability;
		description.weather = field.weather;
	} else if (isPhysical && (attacker.ability === "Hustle" || (attacker.ability === "Guts" && attacker.status !== "Healthy")) || (!isPhysical && (attacker.ability === "Plus" || attacker.ability === "Minus"))) {
		attack = Math.floor(attack * 1.5);
		description.attackerAbility = attacker.ability;
	}

	if ((isPhysical ? attacker.item === "Choice Band" : attacker.item === "Choice Specs") ||
            (attacker.item === "Soul Dew" && (attacker.name === "Latios" || attacker.name === "Latias") && !isPhysical)) {
		attack = Math.floor(attack * 1.5);
		description.attackerItem = attacker.item;
	} else if ((attacker.item === "Light Ball" && attacker.name === "Pikachu") ||
            (attacker.item === "Thick Club" && (attacker.name === "Cubone" || attacker.name === "Marowak") && isPhysical) ||
            (attacker.item === "Deep Sea Tooth" && attacker.name === "Clamperl" && !isPhysical)) {
		attack *= 2;
		description.attackerItem = attacker.item;
	}

	////////////////////////////////
	///////// (SP)DEFENSE //////////
	////////////////////////////////
	var defenseStat = isPhysical ? DF : SD;
	description.defenseEVs = defender.evs[defenseStat] +
            (NATURES[defender.nature][0] === defenseStat ? "+" : NATURES[defender.nature][1] === defenseStat ? "-" : "") + " " +
            toSmogonStat(defenseStat);
	var defense;
	var defenseBoost = defender.boosts[defenseStat];
	var rawDefense = defender.rawStats[defenseStat];
	if (defenseBoost === 0 || (isCritical && defenseBoost > 0)) {
		defense = rawDefense;
	} else if (attacker.ability === "Unaware") {
		defense = rawDefense;
		description.attackerAbility = attacker.ability;
	} else if (defAbility === "Simple") {
		defense = getSimpleModifiedStat(rawDefense, defenseBoost);
		description.defenderAbility = defAbility;
		description.defenseBoost = defenseBoost;
	} else {
		defense = getModifiedStat(rawDefense, defenseBoost);
		description.defenseBoost = defenseBoost;
	}

	if (defAbility === "Marvel Scale" && defender.status !== "Healthy" && isPhysical) {
		defense = Math.floor(defense * 1.5);
		description.defenderAbility = defAbility;
	} else if (defAbility === "Flower Gift" && field.weather === "Sun" && !isPhysical) {
		defense = Math.floor(defense * 1.5);
		description.defenderAbility = defAbility;
		description.weather = field.weather;
	}

	if (defender.item === "Soul Dew" && (defender.name === "Latios" || defender.name === "Latias") && !isPhysical) {
		defense = Math.floor(defense * 1.5);
		description.defenderItem = defender.item;
	} else if ((defender.item === "Deep Sea Scale" && defender.name === "Clamperl" && !isPhysical) ||
            (defender.item === "Metal Powder" && defender.name === "Ditto" && isPhysical)) {
		defense *= 2;
		description.defenderItem = defender.item;
	}

	if (field.weather === "Sand" && (defender.type1 === "Rock" || defender.type2 === "Rock") && !isPhysical) {
		defense = Math.floor(defense * 1.5);
		description.weather = field.weather;
	}

	if (move.name === "Explosion" || move.name === "Self-Destruct") {
		defense = Math.floor(defense * 0.5);
	}

	if (defense < 1) {
		defense = 1;
	}

	////////////////////////////////
	//////////// DAMAGE ////////////
	////////////////////////////////
	var baseDamage = Math.floor(Math.floor(Math.floor(2 * attacker.level / 5 + 2) * basePower * attack / 50) / defense);

	if (attacker.status === "Burned" && isPhysical && attacker.ability !== "Guts") {
		baseDamage = Math.floor(baseDamage * 0.5);
		description.isBurned = true;
	}

	if (!isCritical) {
		var screenMultiplier = field.format !== "Singles" ? (2 / 3) : (1 / 2);
		if (isPhysical && field.isReflect) {
			baseDamage = Math.floor(baseDamage * screenMultiplier);
			description.isReflect = true;
		} else if (!isPhysical && field.isLightScreen) {
			baseDamage = Math.floor(baseDamage * screenMultiplier);
			description.isLightScreen = true;
		}
	}

	if (field.format !== "Singles" && move.isSpread) {
		baseDamage = Math.floor(baseDamage * 3 / 4);
	}

	if ((field.weather === "Sun" && move.type === "Fire") || (field.weather === "Rain" && move.type === "Water")) {
		baseDamage = Math.floor(baseDamage * 1.5);
		description.weather = field.weather;
	} else if ((field.weather === "Sun" && move.type === "Water") || (field.weather === "Rain" && move.type === "Fire") ||
            (["Rain", "Sand", "Hail"].indexOf(field.weather) !== -1 && move.name === "Solar Beam")) {
		baseDamage = Math.floor(baseDamage * 0.5);
		description.weather = field.weather;
	}

	if (attacker.ability === "Flash Fire (activated)" && move.type === "Fire") {
		baseDamage = Math.floor(baseDamage * 1.5);
		description.attackerAbility = "Flash Fire";
	}

	baseDamage += 2;

	if (isCritical) {
		if (attacker.ability === "Sniper") {
			baseDamage *= 3;
			description.attackerAbility = attacker.ability;
		} else {
			baseDamage *= 2;
		}
		description.isCritical = isCritical;
	}

	if (attacker.item === "Life Orb") {
		baseDamage = Math.floor(baseDamage * 1.3);
		description.attackerItem = attacker.item;
	}

	// the random factor is applied between the LO mod and the STAB mod, so don't apply anything below this until we're inside the loop
	var stabMod = 1;
	if (move.type === attacker.type1 || move.type === attacker.type2) {
		if (attacker.ability === "Adaptability") {
			stabMod = 2;
			description.attackerAbility = attacker.ability;
		} else {
			stabMod = 1.5;
		}
	}

	var filterMod = 1;
	if ((defAbility === "Filter" || defAbility === "Solid Rock") && typeEffectiveness > 1) {
		filterMod = 0.75;
		description.defenderAbility = defAbility;
	}
	var ebeltMod = 1;
	if (attacker.item === "Expert Belt" && typeEffectiveness > 1) {
		ebeltMod = 1.2;
		description.attackerItem = attacker.item;
	}
	var tintedMod = 1;
	if (attacker.ability === "Tinted Lens" && typeEffectiveness < 1) {
		tintedMod = 2;
		description.attackerAbility = attacker.ability;
	}
	var berryMod = 1;
	if (getBerryResistType(defender.item) === move.type && (typeEffectiveness > 1 || move.type === "Normal")) {
		berryMod = 0.5;
		description.defenderItem = defender.item;
	}

	var damage = [];
	for (var i = 0; i < 16; i++) {
		damage[i] = Math.floor(baseDamage * (85 + i) / 100);
		damage[i] = Math.floor(damage[i] * stabMod);
		damage[i] = Math.floor(damage[i] * typeEffect1);
		damage[i] = Math.floor(damage[i] * typeEffect2);
		damage[i] = Math.floor(damage[i] * filterMod);
		damage[i] = Math.floor(damage[i] * ebeltMod);
		damage[i] = Math.floor(damage[i] * tintedMod);
		damage[i] = Math.floor(damage[i] * berryMod);
		damage[i] = Math.max(1, damage[i]);
	}
	return {"damage": damage, "description": buildDescription(description)};
}

function getSimpleModifiedStat(stat, mod) {
	var simpleMod = Math.min(6, Math.max(-6, mod * 2));
	return simpleMod > 0 ? Math.floor(stat * (2 + simpleMod) / 2) :
		simpleMod < 0 ? Math.floor(stat * 2 / (2 - simpleMod)) :
			stat;
}

function CALCULATE_ALL_MOVES_ADV(p1, p2, field) {
	checkAirLock(p1, field);
	checkAirLock(p2, field);
	checkForecast(p1, field.getWeather());
	checkForecast(p2, field.getWeather());
	checkIntimidate(p1, p2);
	checkIntimidate(p2, p1);
	var side1 = field.getSide(1);
	var side2 = field.getSide(0);
	var results = [[], []];
	for (var i = 0; i < 4; i++) {
		results[0][i] = CALCULATE_DAMAGE_ADV(p1, p2, p1.moves[i], side1);
		results[1][i] = CALCULATE_DAMAGE_ADV(p2, p1, p2.moves[i], side2);
	}
	return results;
}

function CALCULATE_MOVES_OF_ATTACKER_ADV(attacker, defender, field) {
	checkAirLock(attacker, field);
	checkAirLock(defender, field);
	checkForecast(attacker, field.getWeather());
	checkForecast(defender, field.getWeather());
	checkIntimidate(attacker, defender);
	checkIntimidate(defender, attacker);
	var defenderSide = field.getSide(~~(mode === "one-vs-all"));
	var results = [];
	for (var i = 0; i < 4; i++) {
		results[i] = CALCULATE_DAMAGE_ADV(attacker, defender, attacker.moves[i], defenderSide);
	}
	return results;
}

function CALCULATE_DAMAGE_ADV(attacker, defender, move, field) {
	var description = {
		"attackerName": attacker.name,
		"moveName": move.name,
		"defenderName": defender.name
	};

	if (move.bp === 0) {
		return {"damage": [0], "description": buildDescription(description)};
	}

	if (field.isProtected) {
		description.isProtected = true;
		return {"damage": [0], "description": buildDescription(description)};
	}

	if (move.name === "Weather Ball") {
		move.type = field.weather === "Sun" ? "Fire" :
			field.weather === "Rain" ? "Water" :
				field.weather === "Sand" ? "Rock" :
					field.weather === "Hail" ? "Ice" :
						"Normal";
		description.weather = field.weather;
		description.moveType = move.type;
		description.moveBP = move.bp;
	}

	var typeEffect1 = getMoveEffectiveness(move, defender.type1, field.isForesight);
	var typeEffect2 = defender.type2 ? getMoveEffectiveness(move, defender.type2, field.isForesight) : 1;
	var typeEffectiveness = typeEffect1 * typeEffect2;

	if (typeEffectiveness === 0) {
		return {"damage": [0], "description": buildDescription(description)};
	}

	if ((defender.ability.indexOf("Flash Fire") !== -1 && move.type === "Fire") ||
            (defender.ability === "Levitate" && move.type === "Ground") ||
            (defender.ability === "Volt Absorb" && move.type === "Electric") ||
            (defender.ability === "Water Absorb" && move.type === "Water") ||
            (defender.ability === "Wonder Guard" && typeEffectiveness <= 1) ||
            (defender.ability === "Soundproof" && move.isSound)) {
		description.defenderAbility = defender.ability;
		return {"damage": [0], "description": buildDescription(description)};
	}

	description.HPEVs = defender.HPEVs + " HP";

	var lv = attacker.level;
	if (move.name === "Seismic Toss" || move.name === "Night Shade") {
		return {"damage": [lv], "description": buildDescription(description)};
	}

	if (move.hits > 1) {
		description.hits = move.hits;
	}

	var bp;
	switch (move.name) {
	case "Flail":
	case "Reversal":
		var p = Math.floor(48 * attacker.curHP / attacker.maxHP);
		bp = p <= 1 ? 200 : p <= 4 ? 150 : p <= 9 ? 100 : p <= 16 ? 80 : p <= 32 ? 40 : 20;
		description.moveBP = bp;
		break;
	case "Eruption":
	case "Water Spout":
		bp = Math.max(1, Math.floor(150 * attacker.curHP / attacker.maxHP));
		description.moveBP = bp;
		break;
	case "Low Kick":
		var w = defender.weight;
		bp = w >= 200 ? 120 : w >= 100 ? 100 : w >= 50 ? 80 : w >= 25 ? 60 : w >= 10 ? 40 : 20;
		description.moveBP = bp;
		break;
	default:
		bp = move.bp;
	}

	var isPhysical = typeChart[move.type].category === "Physical";
	var attackStat = isPhysical ? AT : SA;
	description.attackEVs = attacker.evs[attackStat] +
            (NATURES[attacker.nature][0] === attackStat ? "+" : NATURES[attacker.nature][1] === attackStat ? "-" : "") + " " +
            toSmogonStat(attackStat);
	var defenseStat = isPhysical ? DF : SD;
	description.defenseEVs = defender.evs[defenseStat] +
            (NATURES[defender.nature][0] === defenseStat ? "+" : NATURES[defender.nature][1] === defenseStat ? "-" : "") + " " +
            toSmogonStat(defenseStat);
	var at = attacker.rawStats[attackStat];
	var df = defender.rawStats[defenseStat];

	if (isPhysical && (attacker.ability === "Huge Power" || attacker.ability === "Pure Power")) {
		at *= 2;
		description.attackerAbility = attacker.ability;
	}

	if (attacker.item !== "Sea Incense" && getItemBoostType(attacker.item) === move.type) {
		at = Math.floor(at * 1.1);
		description.attackerItem = attacker.item;
	} else if (attacker.item === "Sea Incense" && move.type === "Water") {
		at = Math.floor(at * 1.05);
		description.attackerItem = attacker.item;
	} else if ((isPhysical && attacker.item === "Choice Band") ||
            (!isPhysical && attacker.item === "Soul Dew" && (attacker.name === "Latios" || attacker.name === "Latias"))) {
		at = Math.floor(at * 1.5);
		description.attackerItem = attacker.item;
	} else if ((!isPhysical && attacker.item === "Deep Sea Tooth" && attacker.name === "Clamperl") ||
            (!isPhysical && attacker.item === "Light Ball" && attacker.name === "Pikachu") ||
            (isPhysical && attacker.item === "Thick Club" && (attacker.name === "Cubone" || attacker.name === "Marowak"))) {
		at *= 2;
		description.attackerItem = attacker.item;
	}

	if (!isPhysical && defender.item === "Soul Dew" && (defender.name === "Latios" || defender.name === "Latias")) {
		df = Math.floor(df * 1.5);
		description.defenderItem = defender.item;
	} else if ((!isPhysical && defender.item === "Deep Sea Scale" && defender.name === "Clamperl") ||
            (isPhysical && defender.item === "Metal Powder" && defender.name === "Ditto")) {
		df *= 2;
		description.defenderItem = defender.item;
	}

	if (defender.ability === "Thick Fat" && (move.type === "Fire" || move.type === "Ice")) {
		at = Math.floor(at / 2);
		description.defenderAbility = defender.ability;
	} else if (isPhysical && defender.ability === "Marvel Scale" && defender.status !== "Healthy") {
		df = Math.floor(df * 1.5);
		description.defenderAbility = defender.ability;
	}

	if (isPhysical && (attacker.ability === "Hustle" || (attacker.ability === "Guts" && attacker.status !== "Healthy")) || (!isPhysical && (attacker.ability === "Plus" || attacker.ability === "Minus"))) {
		at = Math.floor(at * 1.5);
		description.attackerAbility = attacker.ability;
	} else if (attacker.curHP <= attacker.maxHP / 3 &&
            ((attacker.ability === "Overgrow" && move.type === "Grass") ||
            (attacker.ability === "Blaze" && move.type === "Fire") ||
            (attacker.ability === "Torrent" && move.type === "Water") ||
            (attacker.ability === "Swarm" && move.type === "Bug"))) {
		bp = Math.floor(bp * 1.5);
		description.attackerAbility = attacker.ability;
	}

	if (move.name === "Explosion" || move.name === "Self-Destruct") {
		df = Math.floor(df / 2);
	}

	var isCritical = move.isCrit && ["Battle Armor", "Shell Armor"].indexOf(defender.ability) === -1;

	var attackBoost = attacker.boosts[attackStat];
	var defenseBoost = defender.boosts[defenseStat];
	if (attackBoost > 0 || (!isCritical && attackBoost < 0)) {
		at = getModifiedStat(at, attackBoost);
		description.attackBoost = attackBoost;
	}
	if (defenseBoost < 0 || (!isCritical && defenseBoost > 0)) {
		df = getModifiedStat(df, defenseBoost);
		description.defenseBoost = defenseBoost;
	}

	var baseDamage = Math.floor(Math.floor(Math.floor(2 * lv / 5 + 2) * at * bp / df) / 50);

	if (attacker.status === "Burned" && isPhysical && attacker.ability !== "Guts") {
		baseDamage = Math.floor(baseDamage / 2);
		description.isBurned = true;
	}

	if (!isCritical) {
		var screenMultiplier = field.format !== "Singles" ? (2 / 3) : (1 / 2);
		if (isPhysical && field.isReflect) {
			baseDamage = Math.floor(baseDamage * screenMultiplier);
			description.isReflect = true;
		} else if (!isPhysical && field.isLightScreen) {
			baseDamage = Math.floor(baseDamage * screenMultiplier);
			description.isLightScreen = true;
		}
	}

	if (field.format !== "Singles" && move.isSpread) {
		// some sources say 3/4, some say 2/3, some say 1/2...using 3/4 for now since that's what DPP+ use
		baseDamage = Math.floor(baseDamage * 3 / 4);
	}

	if ((field.weather === "Sun" && move.type === "Fire") || (field.weather === "Rain" && move.type === "Water")) {
		baseDamage = Math.floor(baseDamage * 1.5);
		description.weather = field.weather;
	} else if ((field.weather === "Sun" && move.type === "Water") || (field.weather === "Rain" && move.type === "Fire") ||
            (move.name === "Solar Beam" && ["Rain", "Sand", "Hail"].indexOf(field.weather) !== -1)) {
		baseDamage = Math.floor(baseDamage / 2);
		description.weather = field.weather;
	}

	if (attacker.ability === "Flash Fire (activated)" && move.type === "Fire") {
		baseDamage = Math.floor(baseDamage * 1.5);
		description.attackerAbility = "Flash Fire";
	}

	baseDamage = Math.max(1, baseDamage) + 2;

	if (isCritical) {
		baseDamage *= 2;
		description.isCritical = true;
	}

	if (move.name === "Weather Ball" && field.weather !== "") {
		baseDamage *= 2;
		description.moveBP = move.bp * 2;
	}

	if (field.isHelpingHand) {
		baseDamage = Math.floor(baseDamage * 1.5);
		description.isHelpingHand = true;
	}

	if (move.type === attacker.type1 || move.type === attacker.type2) {
		baseDamage = Math.floor(baseDamage * 1.5);
	}

	baseDamage = Math.floor(baseDamage * typeEffectiveness);

	var damage = [];
	for (var i = 85; i <= 100; i++) {
		damage[i - 85] = Math.max(1, Math.floor(baseDamage * i / 100));
	}
	return {"damage": damage, "description": buildDescription(description)};
}

function CALCULATE_ALL_MOVES_GSC(p1, p2, field) {
	p1.stats[AT] = Math.min(999, Math.max(1, getModifiedStat(p1.rawStats[AT], p1.boosts[AT])));
	p1.stats[DF] = Math.min(999, Math.max(1, getModifiedStat(p1.rawStats[DF], p1.boosts[DF])));
	p1.stats[SA] = Math.min(999, Math.max(1, getModifiedStat(p1.rawStats[SA], p1.boosts[SA])));
	p1.stats[SD] = Math.min(999, Math.max(1, getModifiedStat(p1.rawStats[SD], p1.boosts[SD])));
	p2.stats[AT] = Math.min(999, Math.max(1, getModifiedStat(p2.rawStats[AT], p2.boosts[AT])));
	p2.stats[DF] = Math.min(999, Math.max(1, getModifiedStat(p2.rawStats[DF], p2.boosts[DF])));
	p2.stats[SA] = Math.min(999, Math.max(1, getModifiedStat(p2.rawStats[SA], p2.boosts[SA])));
	p2.stats[SD] = Math.min(999, Math.max(1, getModifiedStat(p2.rawStats[SD], p2.boosts[SD])));
	var side1 = field.getSide(1);
	var side2 = field.getSide(0);
	var results = [[], []];
	for (var i = 0; i < 4; i++) {
		results[0][i] = CALCULATE_DAMAGE_GSC(p1, p2, p1.moves[i], side1);
		results[1][i] = CALCULATE_DAMAGE_GSC(p2, p1, p2.moves[i], side2);
	}
	return results;
}

function CALCULATE_MOVES_OF_ATTACKER_GSC(attacker, defender, field) {
	attacker.stats[AT] = Math.min(999, Math.max(1, getModifiedStat(attacker.rawStats[AT], attacker.boosts[AT])));
	attacker.stats[SA] = Math.min(999, Math.max(1, getModifiedStat(attacker.rawStats[SA], attacker.boosts[SA])));
	defender.stats[DF] = Math.min(999, Math.max(1, getModifiedStat(defender.rawStats[DF], defender.boosts[DF])));
	defender.stats[SD] = Math.min(999, Math.max(1, getModifiedStat(defender.rawStats[SD], defender.boosts[SD])));
	var defenderSide = field.getSide(~~(mode === "one-vs-all"));
	var results = [];
	for (var i = 0; i < 4; i++) {
		results[i] = CALCULATE_DAMAGE_GSC(attacker, defender, attacker.moves[i], defenderSide);
	}
	return results;
}

function CALCULATE_DAMAGE_GSC(attacker, defender, move, field) {
	var description = {
		"attackerName": attacker.name,
		"moveName": move.name,
		"defenderName": defender.name
	};

	if (move.bp === 0) {
		return {"damage": [0], "description": buildDescription(description)};
	}

	if (field.isProtected) {
		description.isProtected = true;
		return {"damage": [0], "description": buildDescription(description)};
	}

	var typeEffect1 = getMoveEffectiveness(move, defender.type1, field.isForesight);
	var typeEffect2 = defender.type2 ? getMoveEffectiveness(move, defender.type2, field.isForesight) : 1;
	var typeEffectiveness = typeEffect1 * typeEffect2;

	if (typeEffectiveness === 0) {
		return {"damage": [0], "description": buildDescription(description)};
	}

	var lv = attacker.level;
	if (move.name === "Seismic Toss" || move.name === "Night Shade") {
		return {"damage": [lv], "description": buildDescription(description)};
	}

	if (move.hits > 1) {
		description.hits = move.hits;
	}

	// Flail and Reversal are variable BP and never crit
	if (move.name === "Flail" || move.name === "Reversal") {
		move.isCrit = false;
		var p = Math.floor(48 * attacker.curHP / attacker.maxHP);
		move.bp = p <= 1 ? 200 : p <= 4 ? 150 : p <= 9 ? 100 : p <= 16 ? 80 : p <= 32 ? 40 : 20;
		description.moveBP = move.bp;
	}

	var isPhysical = typeChart[move.type].category === "Physical";
	var attackStat = isPhysical ? AT : SA;
	var defenseStat = isPhysical ? DF : SD;
	var at = attacker.stats[attackStat];
	var df = defender.stats[defenseStat];

	// ignore Reflect, Light Screen, stat stages, and burns if attack is a crit and attacker does not have stat stage advantage
	var ignoreMods = move.isCrit && attacker.boosts[attackStat] <= defender.boosts[defenseStat];

	if (ignoreMods) {
		at = attacker.rawStats[attackStat];
		df = defender.rawStats[defenseStat];
	} else {
		if (attacker.boosts[attackStat] !== 0) {
			description.attackBoost = attacker.boosts[attackStat];
		}
		if (defender.boosts[defenseStat] !== 0) {
			description.defenseBoost = defender.boosts[defenseStat];
		}
		if (isPhysical && attacker.status === "Burned") {
			at = Math.floor(at / 2);
			description.isBurned = true;
		}
	}

	if (move.name === "Explosion" || move.name === "Self-Destruct") {
		df = Math.floor(df / 2);
	}

	if (!ignoreMods) {
		if (isPhysical && field.isReflect) {
			df *= 2;
			description.isReflect = true;
		} else if (!isPhysical && field.isLightScreen) {
			df *= 2;
			description.isLightScreen = true;
		}
	}

	if ((attacker.name === "Pikachu" && attacker.item === "Light Ball" && !isPhysical) ||
            ((attacker.name === "Cubone" || attacker.name === "Marowak") && attacker.item === "Thick Club" && isPhysical)) {
		at *= 2;
		description.attackerItem = attacker.item;
	}

	if (at > 255 || df > 255) {
		at = Math.floor(at / 4) % 256;
		df = Math.floor(df / 4) % 256;
	}

	if (defender.name === "Ditto" && defender.item === "Metal Powder") {
		df = Math.floor(df * 1.5);
		description.defenderItem = defender.item;
	}

	var baseDamage = Math.floor(Math.floor(Math.floor(2 * lv / 5 + 2) * Math.max(1, at) * move.bp / Math.max(1, df)) / 50);

	if (move.isCrit) {
		baseDamage *= 2;
		description.isCritical = true;
	}

	if (getItemBoostType(attacker.item) === move.type) {
		baseDamage = Math.floor(baseDamage * 1.1);
		description.attackerItem = attacker.item;
	}

	baseDamage = Math.min(997, baseDamage) + 2;

	if ((field.weather === "Sun" && move.type === "Fire") || (field.weather === "Rain" && move.type === "Water")) {
		baseDamage = Math.floor(baseDamage * 1.5);
		description.weather = field.weather;
	} else if ((field.weather === "Sun" && move.type === "Water") || (field.weather === "Rain" && (move.type === "Fire" || move.name === "Solar Beam"))) {
		baseDamage = Math.floor(baseDamage / 2);
		description.weather = field.weather;
	}

	if (move.type === attacker.type1 || move.type === attacker.type2) {
		baseDamage = Math.floor(baseDamage * 1.5);
	}

	baseDamage = Math.floor(baseDamage * typeEffectiveness);

	// Flail and Reversal don't use random factor
	if (move.name === "Flail" || move.name === "Reversal") {
		return {"damage": [baseDamage], "description": buildDescription(description)};
	}

	var damage = [];
	for (var i = 217; i <= 255; i++) {
		damage[i - 217] = Math.floor(baseDamage * i / 255);
	}
	return {"damage": damage, "description": buildDescription(description)};
}

function CALCULATE_ALL_MOVES_RBY(p1, p2, field) {
	p1.stats[AT] = Math.min(999, Math.max(1, getModifiedStat(p1.rawStats[AT], p1.boosts[AT])));
	p1.stats[DF] = Math.min(999, Math.max(1, getModifiedStat(p1.rawStats[DF], p1.boosts[DF])));
	p1.stats[SL] = Math.min(999, Math.max(1, getModifiedStat(p1.rawStats[SL], p1.boosts[SL])));
	p2.stats[AT] = Math.min(999, Math.max(1, getModifiedStat(p2.rawStats[AT], p2.boosts[AT])));
	p2.stats[DF] = Math.min(999, Math.max(1, getModifiedStat(p2.rawStats[DF], p2.boosts[DF])));
	p2.stats[SL] = Math.min(999, Math.max(1, getModifiedStat(p2.rawStats[SL], p2.boosts[SL])));
	var side1 = field.getSide(1);
	var side2 = field.getSide(0);
	var results = [[], []];
	for (var i = 0; i < 4; i++) {
		results[0][i] = CALCULATE_DAMAGE_RBY(p1, p2, p1.moves[i], side1);
		results[1][i] = CALCULATE_DAMAGE_RBY(p2, p1, p2.moves[i], side2);
	}
	return results;
}

function CALCULATE_MOVES_OF_ATTACKER_RBY(attacker, defender, field) {
	attacker.stats[AT] = Math.min(999, Math.max(1, getModifiedStat(attacker.rawStats[AT], attacker.boosts[AT])));
	attacker.stats[SL] = Math.min(999, Math.max(1, getModifiedStat(attacker.rawStats[SL], attacker.boosts[SL])));
	defender.stats[DF] = Math.min(999, Math.max(1, getModifiedStat(defender.rawStats[DF], defender.boosts[DF])));
	defender.stats[SL] = Math.min(999, Math.max(1, getModifiedStat(defender.rawStats[SL], defender.boosts[SL])));
	var defenderSide = field.getSide(~~(mode === "one-vs-all"));
	var results = [];
	for (var i = 0; i < 4; i++) {
		results[i] = CALCULATE_DAMAGE_RBY(attacker, defender, attacker.moves[i], defenderSide);
	}
	return results;
}

function CALCULATE_DAMAGE_RBY(attacker, defender, move, field) {
	var description = {
		"attackerName": attacker.name,
		"moveName": move.name,
		"defenderName": defender.name
	};

	if (move.bp === 0) {
		return {"damage": [0], "description": buildDescription(description)};
	}

	var lv = attacker.level;
	if (move.name === "Seismic Toss" || move.name === "Night Shade") {
		return {"damage": [lv], "description": buildDescription(description)};
	}

	var typeEffect1 = typeChart[move.type][defender.type1];
	var typeEffect2 = defender.type2 ? typeChart[move.type][defender.type2] : 1;
	var typeEffectiveness = typeEffect1 * typeEffect2;

	if (typeEffectiveness === 0) {
		return {"damage": [0], "description": buildDescription(description)};
	}

	if (move.hits > 1) {
		description.hits = move.hits;
	}

	var isPhysical = typeChart[move.type].category === "Physical";
	var attackStat = isPhysical ? AT : SL;
	var defenseStat = isPhysical ? DF : SL;
	var at = attacker.stats[attackStat];
	var df = defender.stats[defenseStat];

	if (move.isCrit) {
		lv *= 2;
		at = attacker.rawStats[attackStat];
		df = defender.rawStats[defenseStat];
		description.isCritical = true;
	} else {
		if (attacker.boosts[attackStat] !== 0) {
			description.attackBoost = attacker.boosts[attackStat];
		}
		if (defender.boosts[defenseStat] !== 0) {
			description.defenseBoost = defender.boosts[defenseStat];
		}
		if (isPhysical && attacker.status === "Burned") {
			at = Math.floor(at / 2);
			description.isBurned = true;
		}
	}

	if (move.name === "Explosion" || move.name === "Self-Destruct") {
		df = Math.floor(df / 2);
	}

	if (!move.isCrit) {
		if (isPhysical && field.isReflect) {
			df *= 2;
			description.isReflect = true;
		} else if (!isPhysical && field.isLightScreen) {
			df *= 2;
			description.isLightScreen = true;
		}
	}

	if (at > 255 || df > 255) {
		at = Math.floor(at / 4) % 256;
		df = Math.floor(df / 4) % 256;
	}

	var baseDamage = Math.min(997, Math.floor(Math.floor(Math.floor(2 * lv / 5 + 2) * Math.max(1, at) * move.bp / Math.max(1, df)) / 50)) + 2;
	if (move.type === attacker.type1 || move.type === attacker.type2) {
		baseDamage = Math.floor(baseDamage * 1.5);
	}
	baseDamage = Math.floor(baseDamage * typeEffectiveness);
	// If baseDamage >= 768, don't apply random factor? upokecenter says this, but nobody else does
	var damage = [];
	for (var i = 217; i <= 255; i++) {
		damage[i - 217] = Math.floor(baseDamage * i / 255);
	}
	return {"damage": damage, "description": buildDescription(description)};
}

function buildDescription(description) {
	var output = "";
	if (description.attackBoost) {
		if (description.attackBoost > 0) {
			output += "+";
		}
		output += description.attackBoost + " ";
	}
	output = appendIfSet(output, description.attackEVs);
	output = appendIfSet(output, description.attackerItem);
	output = appendIfSet(output, description.attackerAbility);
	if (description.isBurned) {
		output += "burned ";
	}
	output += description.attackerName + " ";
	if (description.isHelpingHand) {
		output += "Helping Hand ";
	}
	output += description.moveName + " ";
	if (description.moveBP && description.moveType) {
		output += "(" + description.moveBP + " BP " + description.moveType + ") ";
	} else if (description.moveBP) {
		output += "(" + description.moveBP + " BP) ";
	} else if (description.moveType) {
		output += "(" + description.moveType + ") ";
	}
	if (description.hits) {
		output += "(" + description.hits + " hits) ";
	}
	output += "vs. ";
	if (description.defenseBoost) {
		if (description.defenseBoost > 0) {
			output += "+";
		}
		output += description.defenseBoost + " ";
	}
	output = appendIfSet(output, description.HPEVs);
	if (description.defenseEVs) {
		output += " / " + description.defenseEVs + " ";
	}
	output = appendIfSet(output, description.defenderItem);
	output = appendIfSet(output, description.defenderAbility);
	if (description.isProtected) {
		output += "protected ";
	}
	output += description.defenderName;
	if (description.weather && description.terrain) {
		// do nothing
	} else if (description.weather) {
		output += " in " + description.weather;
	} else if (description.terrain) {
		output += " in " + description.terrain + " Terrain";
	}
	if (description.isReflect) {
		output += " through Reflect";
	} else if (description.isLightScreen) {
		output += " through Light Screen";
	}
	if (description.isFriendGuard) {
		output += " with an ally's Friend Guard";
	}
	if (description.isAuroraVeil) {
		output += " with an ally's Aurora Veil";
	}
	if (description.isCritical) {
		output += " on a critical hit";
	}
	return output;
}

function appendIfSet(str, toAppend) {
	if (toAppend) {
		return str + toAppend + " ";
	}
	return str;
}

function getKOChanceText(damage, attacker, defender, field, move, hits, isBadDreams) {
	if (isNaN(damage[0])) {
		return 'something broke; please tell Austin or Marty';
	}
	if (damage[damage.length - 1] === 0) {
		return 'aim for the horn next time';
	}
	if (damage[0] >= defender.maxHP) {
		return 'guaranteed OHKO';
	}

	var hazards = 0;
	var hazardText = [];
	if (field.isSR && ['Magic Guard', 'Mountaineer'].indexOf(defender.ability) === -1) {
		var effectiveness = typeChart['Rock'][defender.type1] * (defender.type2 ? typeChart['Rock'][defender.type2] : 1);
		hazards += Math.floor(effectiveness * defender.maxHP / 8);
		hazardText.push('Stealth Rock');
	}
	if ([defender.type1, defender.type2].indexOf('Flying') === -1 &&
            ['Magic Guard', 'Levitate'].indexOf(defender.ability) === -1 && defender.item !== 'Air Balloon') {
		if (field.spikes === 1) {
			hazards += Math.floor(defender.maxHP / 8);
			if (gen === 2) {
				hazardText.push('Spikes');
			} else {
				hazardText.push('1 layer of Spikes');
			}
		} else if (field.spikes === 2) {
			hazards += Math.floor(defender.maxHP / 6);
			hazardText.push('2 layers of Spikes');
		} else if (field.spikes === 3) {
			hazards += Math.floor(defender.maxHP / 4);
			hazardText.push('3 layers of Spikes');
		}
	}
	if (isNaN(hazards)) {
		hazards = 0;
	}

	var eot = 0;
	var eotText = [];
	if (field.weather === 'Sun' || field.weather === "Harsh Sunshine") {
		if (defender.ability === 'Dry Skin' || defender.ability === 'Solar Power') {
			eot -= Math.floor(defender.maxHP / 8);
			eotText.push(defender.ability + ' damage');
		}
	} else if (field.weather === 'Rain' || field.weather === "Heavy Rain") {
		if (defender.ability === 'Dry Skin') {
			eot += Math.floor(defender.maxHP / 8);
			eotText.push('Dry Skin recovery');
		} else if (defender.ability === 'Rain Dish') {
			eot += Math.floor(defender.maxHP / 16);
			eotText.push('Rain Dish recovery');
		}
	} else if (field.weather === 'Sand') {
		if (['Rock', 'Ground', 'Steel'].indexOf(defender.type1) === -1 &&
                ['Rock', 'Ground', 'Steel'].indexOf(defender.type2) === -1 &&
                ['Magic Guard', 'Overcoat', 'Sand Force', 'Sand Rush', 'Sand Veil'].indexOf(defender.ability) === -1 &&
                defender.item !== 'Safety Goggles') {
			eot -= Math.floor(defender.maxHP / 16);
			eotText.push('sandstorm damage');
		}
	} else if (field.weather === 'Hail') {
		if (defender.ability === 'Ice Body') {
			eot += Math.floor(defender.maxHP / 16);
			eotText.push('Ice Body recovery');
		} else if (defender.type1 !== 'Ice' && defender.type2 !== 'Ice' &&
                ['Magic Guard', 'Overcoat', 'Snow Cloak'].indexOf(defender.ability) === -1 &&
                defender.item !== 'Safety Goggles') {
			eot -= Math.floor(defender.maxHP / 16);
			eotText.push('hail damage');
		}
	}
	if (defender.item === 'Leftovers') {
		eot += Math.floor(defender.maxHP / 16);
		eotText.push('Leftovers recovery');
	} else if (defender.item === 'Black Sludge') {
		if (defender.type1 === 'Poison' || defender.type2 === 'Poison') {
			eot += Math.floor(defender.maxHP / 16);
			eotText.push('Black Sludge recovery');
		} else if (defender.ability !== 'Magic Guard' && defender.ability !== 'Klutz') {
			eot -= Math.floor(defender.maxHP / 8);
			eotText.push('Black Sludge damage');
		}
	} else if (defender.item === 'Sticky Barb') {
		eot -= Math.floor(defender.maxHP / 8);
		eotText.push('Sticky Barb damage');
	}
	if (field.isDefenderSeeded) {
		if (defender.ability !== 'Magic Guard') {
			eot -= gen >= 2 ? Math.floor(defender.maxHP / 8) : Math.floor(defender.maxHP / 16); // 1/16 in gen 1, 1/8 in gen 2 onwards
			eotText.push('Leech Seed damage');
		}
	}
	if (field.isAttackerSeeded) {
		if (attacker.ability === "Magic Guard") {
			// No effect
		} else if (attacker.ability === "Liquid Ooze") {
			eot -= gen >= 2 ? Math.floor(attacker.maxHP / 8) : Math.floor(attacker.maxHP / 16);
			eotText.push("Liquid Ooze damage");
		} else {
			eot += gen >= 2 ? Math.floor(attacker.maxHP / 8) : Math.floor(attacker.maxHP / 16);
			eotText.push("Leech Seed recovery");
		}
	}
	if (field.terrain === "Grassy") {
		if (field.isGravity || (defender.type1 !== "Flying" && defender.type2 !== "Flying" &&
                defender.item !== "Air Balloon" && defender.ability !== "Levitate")) {
			eot += Math.floor(defender.maxHP / 16);
			eotText.push('Grassy Terrain recovery');
		}
	}
	var toxicCounter = 0;
	if (defender.status === 'Poisoned') {
		if (defender.ability === 'Poison Heal') {
			eot += Math.floor(defender.maxHP / 8);
			eotText.push('Poison Heal');
		} else if (defender.ability !== 'Magic Guard') {
			eot -= Math.floor(defender.maxHP / 8);
			eotText.push('poison damage');
		}
	} else if (defender.status === 'Badly Poisoned') {
		if (defender.ability === 'Poison Heal') {
			eot += Math.floor(defender.maxHP / 8);
			eotText.push('Poison Heal');
		} else if (defender.ability !== 'Magic Guard') {
			eotText.push('toxic damage');
			toxicCounter = defender.toxicCounter;
		}
	} else if (defender.status === 'Burned') {
		if (defender.ability === 'Heatproof') {
			eot -= gen > 6 ? Math.floor(defender.maxHP / 32) : Math.floor(defender.maxHP / 16);
			eotText.push('reduced burn damage');
		} else if (defender.ability !== 'Magic Guard') {
			eot -= gen > 6 ? Math.floor(defender.maxHP / 16) : Math.floor(defender.maxHP / 8);
			eotText.push('burn damage');
		}
	} else if ((defender.status === 'Asleep' || defender.ability === 'Comatose') && isBadDreams && defender.ability !== 'Magic Guard') {
		eot -= Math.floor(defender.maxHP / 8);
		eotText.push('Bad Dreams');
	}
	if (move.name === 'Bind' || move.name === 'Clamp' || move.name === 'Fire Spin' || move.name === 'Infestation' || move.name === 'Magma Storm' || move.name === 'Sand Tomb' || move.name === 'Whirlpool' || move.name === 'Wrap') {
		if (attacker.item === "Binding Band") {
			eot -= gen > 5 ? Math.floor(defender.maxHP / 6) : Math.floor(defender.maxHP / 8);
			eotText.push('trapping damage');
		} else {
			eot -= gen > 5 ? Math.floor(defender.maxHP / 8) : Math.floor(defender.maxHP / 16);
			eotText.push('trapping damage');
		}
	}
	if ((move.name === 'Fire Pledge (Grass Pledge Boosted)' || move.name === 'Grass Pledge (Fire Pledge Boosted)') && (defender.type1 !== "Fire" && defender.type2 !== "Fire")) {
		eot -= Math.floor(defender.maxHP / 8);
		eotText.push('Sea of Fire damage');
	}
	// multi-hit moves have too many possibilities for brute-forcing to work, so reduce it to an approximate distribution
	var qualifier = '';
	if (hits > 1) {
		qualifier = 'approx. ';
		damage = squashMultihit(damage, hits);
	}

	var c = getKOChance(damage, defender.maxHP - hazards, 0, 1, defender.maxHP, toxicCounter);
	var afterText = hazardText.length > 0 ? ' after ' + serializeText(hazardText) : '';
	if (c === 1) {
		return 'guaranteed OHKO' + afterText;
	} else if (c > 0) {
		return qualifier + Math.round(c * 1000) / 10 + '% chance to OHKO' + afterText;
	}

	afterText = hazardText.length > 0 || eotText.length > 0 ? ' after ' + serializeText(hazardText.concat(eotText)) : '';
	var i;
	for (i = 2; i <= 4; i++) {
		c = getKOChance(damage, defender.maxHP - hazards, eot, i, defender.maxHP, toxicCounter);
		if (c === 1) {
			return 'guaranteed ' + i + 'HKO' + afterText;
		} else if (c > 0) {
			return qualifier + Math.round(c * 1000) / 10 + '% chance to ' + i + 'HKO' + afterText;
		}
	}

	for (i = 5; i <= 9; i++) {
		if (predictTotal(damage[0], eot, i, toxicCounter, defender.maxHP) >= defender.maxHP - hazards) {
			return 'guaranteed ' + i + 'HKO' + afterText;
		} else if (predictTotal(damage[damage.length - 1], eot, i, toxicCounter, defender.maxHP) >= defender.maxHP - hazards) {
			return 'possible ' + i + 'HKO' + afterText;
		}
	}

	return 'possibly the worst move ever';
}

function getKOChance(damage, hp, eot, hits, maxHP, toxicCounter) {
	var n = damage.length;
	var minDamage = damage[0];
	var maxDamage = damage[n - 1];
	var i;
	if (hits === 1) {
		if (maxDamage < hp) {
			return 0;
		}
		for (i = 0; i < n; i++) {
			if (damage[i] >= hp) {
				return (n - i) / n;
			}
		}
	}
	if (predictTotal(maxDamage, eot, hits, toxicCounter, maxHP) < hp) {
		return 0;
	} else if (predictTotal(minDamage, eot, hits, toxicCounter, maxHP) >= hp) {
		return 1;
	}
	var toxicDamage = 0;
	if (toxicCounter > 0) {
		toxicDamage = Math.floor(toxicCounter * maxHP / 16);
		toxicCounter++;
	}
	var sum = 0;
	for (i = 0; i < n; i++) {
		var c = getKOChance(damage, hp - damage[i] + eot - toxicDamage, eot, hits - 1, maxHP, toxicCounter);
		if (c === 1) {
			sum += (n - i);
			break;
		} else {
			sum += c;
		}
	}
	return sum / n;
}

function predictTotal(damage, eot, hits, toxicCounter, maxHP) {
	var toxicDamage = 0;
	if (toxicCounter > 0) {
		for (var i = 0; i < hits - 1; i++) {
			toxicDamage += Math.floor((toxicCounter + i) * maxHP / 16);
		}
	}
	var total = (damage * hits) - (eot * (hits - 1)) + toxicDamage;
	return total;
}

function squashMultihit(d, hits) {
	if (d.length === 1) {
		return [d[0] * hits];
	} else if (gen === 1) {
		var r = [];
		for (var i = 0; i < d.length; i++) {
			r[i] = d[i] * hits;
		}
		return r;
	} else if (d.length === 16) {
		switch (hits) {
		case 2:
			return [
				2 * d[0], d[2] + d[3], d[4] + d[4], d[4] + d[5],
				d[5] + d[6], d[6] + d[6], d[6] + d[7], d[7] + d[7],
				d[8] + d[8], d[8] + d[9], d[9] + d[9], d[9] + d[10],
				d[10] + d[11], d[11] + d[11], d[12] + d[13], 2 * d[15]
			];
		case 3:
			return [
				3 * d[0], d[3] + d[3] + d[4], d[4] + d[4] + d[5], d[5] + d[5] + d[6],
				d[5] + d[6] + d[6], d[6] + d[6] + d[7], d[6] + d[7] + d[7], d[7] + d[7] + d[8],
				d[7] + d[8] + d[8], d[8] + d[8] + d[9], d[8] + d[9] + d[9], d[9] + d[9] + d[10],
				d[9] + d[10] + d[10], d[10] + d[11] + d[11], d[11] + d[12] + d[12], 3 * d[15]
			];
		case 4:
			return [
				4 * d[0], 4 * d[4], d[4] + d[5] + d[5] + d[5], d[5] + d[5] + d[6] + d[6],
				4 * d[6], d[6] + d[6] + d[7] + d[7], 4 * d[7], d[7] + d[7] + d[7] + d[8],
				d[7] + d[8] + d[8] + d[8], 4 * d[8], d[8] + d[8] + d[9] + d[9], 4 * d[9],
				d[9] + d[9] + d[10] + d[10], d[10] + d[10] + d[10] + d[11], 4 * d[11], 4 * d[15]
			];
		case 5:
			return [
				5 * d[0], d[4] + d[4] + d[4] + d[5] + d[5], d[5] + d[5] + d[5] + d[5] + d[6], d[5] + d[6] + d[6] + d[6] + d[6],
				d[6] + d[6] + d[6] + d[6] + d[7], d[6] + d[6] + d[7] + d[7] + d[7], 5 * d[7], d[7] + d[7] + d[7] + d[8] + d[8],
				d[7] + d[7] + d[8] + d[8] + d[8], 5 * d[8], d[8] + d[8] + d[8] + d[9] + d[9], d[8] + d[9] + d[9] + d[9] + d[9],
				d[9] + d[9] + d[9] + d[9] + d[10], d[9] + d[10] + d[10] + d[10] + d[10], d[10] + d[10] + d[11] + d[11] + d[11], 5 * d[15]
			];
		default:
			console.log("Unexpected # of hits: " + hits);
			return d;
		}
	} else if (d.length === 39) {
		switch (hits) {
		case 2:
			return [
				2 * d[0], 2 * d[7], 2 * d[10], 2 * d[12],
				2 * d[14], d[15] + d[16], 2 * d[17], d[18] + d[19],
				d[19] + d[20], 2 * d[21], d[22] + d[23], 2 * d[24],
				2 * d[26], 2 * d[28], 2 * d[31], 2 * d[38]
			];
		case 3:
			return [
				3 * d[0], 3 * d[9], 3 * d[12], 3 * d[13],
				3 * d[15], 3 * d[16], 3 * d[17], 3 * d[18],
				3 * d[20], 3 * d[21], 3 * d[22], 3 * d[23],
				3 * d[25], 3 * d[26], 3 * d[29], 3 * d[38]
			];
		case 4:
			return [
				4 * d[0], 2 * d[10] + 2 * d[11], 4 * d[13], 4 * d[14],
				2 * d[15] + 2 * d[16], 2 * d[16] + 2 * d[17], 2 * d[17] + 2 * d[18], 2 * d[18] + 2 * d[19],
				2 * d[19] + 2 * d[20], 2 * d[20] + 2 * d[21], 2 * d[21] + 2 * d[22], 2 * d[22] + 2 * d[23],
				4 * d[24], 4 * d[25], 2 * d[27] + 2 * d[28], 4 * d[38]
			];
		case 5:
			return [
				5 * d[0], 5 * d[11], 5 * d[13], 5 * d[15],
				5 * d[16], 5 * d[17], 5 * d[18], 5 * d[19],
				5 * d[19], 5 * d[20], 5 * d[21], 5 * d[22],
				5 * d[23], 5 * d[25], 5 * d[27], 5 * d[38]
			];
		default:
			console.log("Unexpected # of hits: " + hits);
			return d;
		}
	} else {
		console.log("Unexpected # of possible damage values: " + d.length);
		return d;
	}
}

function serializeText(arr) {
	if (arr.length === 0) {
		return '';
	} else if (arr.length === 1) {
		return arr[0];
	} else if (arr.length === 2) {
		return arr[0] + " and " + arr[1];
	} else {
		var text = '';
		for (var i = 0; i < arr.length - 1; i++) {
			text += arr[i] + ', ';
		}
		return text + 'and ' + arr[arr.length - 1];
	}
}

function placeBsBtn() {
	var importBtn = "<button class='bs-btn bs-btn-default'>Import</button>";
	$("#import-1_wrapper").append(importBtn);
	$(".bs-btn").click(function () {
		var pokes = document.getElementsByClassName("import-team-text")[0].value;
		addSets(pokes);
	});


}
function getAbility(row) {
	ability = row[1] ? row[1].trim() : '';
	if (ABILITIES_SM.indexOf(ability) != -1) {
		return (ability);

	} else {
		return;

	}

}

function statConverter(stat) {
	switch (stat) {
	case 'hp':
		return "hp";
	case 'atk':
		return "at";
	case 'def':
		return "df";
	case 'spa':
		return "sa";
	case 'spd':
		return "sd";
	case 'spe':
		return "sp";

	}


}

function getStats(currentPoke, rows, offset) {
	currentPoke.nature = "Serious";
	var currentEV;
	var currentIV;
	var currentNature;
	currentPoke.level = 100;
	for (var x = offset; x < offset + 7; x++) {
		var currentRow = rows[x] ? rows[x].split(/[/:]/) : '';
		var evs = {};
		var ivs = {};
		var ev;

		switch (currentRow[0]) {
		case 'Level':
			currentPoke.level = parseInt(currentRow[1].trim());
			break;
		case 'EVs':

			for (j = 1; j < currentRow.length; j++) {
				currentEV = currentRow[j].trim().split(" ");
				currentEV[1] = statConverter(currentEV[1].toLowerCase());
				evs[currentEV[1]] = parseInt(currentEV[0]);

			}
			currentPoke.evs = evs;
			break;
		case 'IVs':
			for (j = 1; j < currentRow.length; j++) {
				currentIV = currentRow[j].trim().split(" ");
				currentIV[1] = statConverter(currentIV[1].toLowerCase());
				ivs[currentIV[1]] = parseInt(currentIV[0]);
			}
			currentPoke.ivs = ivs;
			break;

		}
		currentNature = rows[x] ? rows[x].trim().split(" ") : '';
		if (currentNature[1] == "Nature") {
			currentPoke.nature = currentNature[0];

		}
	}
	return currentPoke;


}

function getItem(currentRow, j) {
	for (;j < currentRow.length; j++) {
		var item = currentRow[j].trim();
		if (ITEMS_SM.indexOf(item) != -1) {
			return item;

		}
	}
	return;

}

function getMoves(currentPoke, rows, offset) {
	var movesFound = false;
	var moves = [];
	for (var x = offset; x < offset + 12; x++) {

		if (rows[x]) {
			if (rows[x][0] == "-") {
				movesFound = true;

				var move = rows[x].substr(2, rows[x].length - 2).replace("[", "").replace("]", "").replace("  ", "");
				moves.push(move);

			} else {
				if (movesFound == true) {
					break;

				}

			}
		}
	}
	currentPoke.moves = moves;
	return currentPoke;


}

function addToDex(poke) {
	var dexObject = {};
	if (SETDEX_SM[poke.name] == undefined) SETDEX_SM[poke.name] = {};
	if (SETDEX_XY[poke.name] == undefined) SETDEX_XY[poke.name] = {};
	if (SETDEX_BW[poke.name] == undefined) SETDEX_BW[poke.name] = {};
	if (SETDEX_DPP[poke.name] == undefined) SETDEX_DPP[poke.name] = {};
	if (SETDEX_ADV[poke.name] == undefined) SETDEX_ADV[poke.name] = {};
	if (SETDEX_GSC[poke.name] == undefined) SETDEX_GSC[poke.name] = {};
	if (SETDEX_RBY[poke.name] == undefined) SETDEX_RBY[poke.name] = {};

	if (poke.ability !== undefined) {
		dexObject.ability = poke.ability;

	}
	dexObject.level = poke.level;
	dexObject.evs = poke.evs;
	dexObject.ivs = poke.ivs;
	dexObject.moves = poke.moves;
	dexObject.nature = poke.nature;
	dexObject.item = poke.item;
	if (localStorage.customsets) {
		customsets = JSON.parse(localStorage.customsets);
	} else {
		customsets = {};
	}
	if (!customsets[poke.name]) {
		customsets[poke.name] = {};
	}
	customsets[poke.name][poke.nameProp] = dexObject;
	if (poke.name == "Aegislash-Blade") {
		if (!customsets["Aegislash-Shield"]) {
			customsets["Aegislash-Shield"] = {};
		}
		customsets["Aegislash-Shield"][poke.nameProp] = dexObject;
	}
	updateDex(customsets);
}

function updateDex(customsets) {
	for (pokemon in customsets) {
		for (moveset in customsets[pokemon]) {
			if (!SETDEX_SM[pokemon]) SETDEX_SM[pokemon] = {};
			SETDEX_SM[pokemon][moveset] = customsets[pokemon][moveset];
			if (!SETDEX_XY[pokemon]) SETDEX_XY[pokemon] = {};
			SETDEX_XY[pokemon][moveset] = customsets[pokemon][moveset];
			if (!SETDEX_BW[pokemon]) SETDEX_BW[pokemon] = {};
			SETDEX_BW[pokemon][moveset] = customsets[pokemon][moveset];
			if (!SETDEX_DPP[pokemon]) SETDEX_DPP[pokemon] = {};
			SETDEX_DPP[pokemon][moveset] = customsets[pokemon][moveset];
			if (!SETDEX_ADV[pokemon]) SETDEX_ADV[pokemon] = {};
			SETDEX_ADV[pokemon][moveset] = customsets[pokemon][moveset];
			if (!SETDEX_GSC[pokemon]) SETDEX_GSC[pokemon] = {};
			SETDEX_GSC[pokemon][moveset] = customsets[pokemon][moveset];
			if (!SETDEX_RBY[pokemon]) SETDEX_RBY[pokemon] = {};
			SETDEX_RBY[pokemon][moveset] = customsets[pokemon][moveset];
		}
	}
	localStorage.customsets = JSON.stringify(customsets);
}

function addSets(pokes) {
	var rows = pokes.split("\n");
	var currentRow;
	var currentPoke;
	var addedpokes = 0;
	for (i = 0; i < rows.length; i++) {
		currentRow = rows[i].split(/[\(\)@]/);
		for (j = 0; j < currentRow.length; j++) {
			currentRow[j] = checkExeptions(currentRow[j].trim());
			if (POKEDEX_SM[currentRow[j].trim()] !== undefined) {
				currentPoke = POKEDEX_SM[currentRow[j].trim()];
				currentPoke.name = currentRow[j].trim();
				currentPoke.item = getItem(currentRow, j + 1);
				if (j === 1) {
					currentPoke.nameProp = currentRow[j - 1].trim();

				} else {
					currentPoke.nameProp = "Custom Set";

				}
				currentPoke.ability = getAbility(rows[i + 1].split(":"));
				currentPoke = getStats(currentPoke, rows, i + 1);
				currentPoke = getMoves(currentPoke, rows, i);
				addToDex(currentPoke);
				addedpokes++;

			}
		}
	}
	if (addedpokes > 0) {
		alert("Successfully imported " + addedpokes + " set(s)");
		$("#clearSets").css("display","inline");
	} else {
		alert("No sets imported, please check your syntax and try again");
	}
}

function checkExeptions(poke) {
	switch (poke) {
	case 'Aegislash':
		poke = "Aegislash-Blade";
		break;
	case 'Araquanid-Totem':
		poke = "Araquanid";
		break;
	case 'Basculin-Blue-Striped':
		poke = "Basculin";
		break;
	case 'Gumshoos-Totem':
		poke = "Gumshoos";
		break;
	case 'Keldeo-Resolute':
		poke = "Keldeo";
		break;
	case 'Kommo-o-Totem':
		poke = "Kommo-o";
		break;
	case 'Lurantis-Totem':
		poke = "Lurantis";
		break;
	case 'Marowak-Alola-Totem':
		poke = "Marowak-Alola";
		break;
	case 'Mimikyu-Totem':
	case 'Mimikyu-Busted':
		poke = "Mimikyu";
		break;
	case 'Pikachu-Alola':
	case 'Pikachu-Belle':
	case 'Pikachu-Cosplay':
	case 'Pikachu-Hoenn':
	case 'Pikachu-Kalos':
	case 'Pikachu-Libre':
	case 'Pikachu-Original':
	case 'Pikachu-Partner':
	case 'Pikachu-PhD':
	case 'Pikachu-Pop-Star':
	case 'Pikachu-Rock-Star':
	case 'Pikachu-Sinnoh':
	case 'Pikachu-Unova':
		poke = "Pikachu";
		break;
	case 'Raticate-Alola-Totem':
		poke = "Raticate-Alola";
		break;
	case 'Ribombee-Totem':
		poke = "Ribombee";
		break;
	case 'Salazzle-Totem':
		poke = "Salazzle";
		break;
	case 'Vikavolt-Totem':
		poke = "Vikavolt";
		break;
	case 'Vivillon-Fancy':
	case 'Vivillon-Pokeball':
		poke = "Vivillon";
		break;
	}
	return poke;

}

$("#clearSets").click(function(){
	localStorage.removeItem("customsets");
	alert("Custom Sets successfully cleared. Please refresh the page.");
	$("#clearSets").css("display","none");
});

$(document).ready(function () {
	placeBsBtn();
	if (localStorage.customsets) {
		updateDex(JSON.parse(localStorage.customsets));
		$("#clearSets").css("display","inline");
	}
});
