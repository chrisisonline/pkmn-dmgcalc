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
		var moveNum = this.id.match(/\d+/) - 1;
		var minDamage, maxDamage;
		
		if (result) {
			$("#mainResult").text(result.description + ": " + result.damageText + " -- " + result.koChanceText);
			$("#damageValues").text("Possible damage amounts: (" + result.damage.join(", ") + ")");
			// CJ EDITS
			// Adds simplified text to the main display
			$("#simpleMain").text("Damage: " + result.damageText);
			$("#simpleKO").text("KO Chance: " + result.koChanceText);

			if (this.id.match(/L/)) {
				minDamage = result.damage[0] * p1.moves[moveNum].hits;
				maxDamage = result.damage[result.damage.length - 1] * p1.moves[moveNum].hits;
				updateBar(
					100 - Math.floor(minDamage * 1000 / p2.maxHP) / 10,
					100 - Math.floor(maxDamage * 1000 / p2.maxHP) / 10,
					1);
			} else {
				minDamage = result.damage[0] * p2.moves[moveNum].hits;
				maxDamage = result.damage[result.damage.length - 1] * p2.moves[moveNum].hits;
				updateBar(
					100 - Math.floor(minDamage * 1000 / p1.maxHP) / 10,
					100 - Math.floor(maxDamage * 1000 / p1.maxHP) / 10,
					2);
			}

			changeSprite(p1.name,1);
			changeSprite(p2.name,2);
			updateLabels(p1.name, p1.level, 1);
			updateLabels(p2.name, p2.level, 2);
		}
	}
});

function updateLabels(pkm_name, pkm_lvl, pkm_no){
	var lvl_label = "Lvl. " + pkm_lvl;

	if ($("#pkm" + pkm_no + "-name").html() != pkm_name)
		$("#pkm" + pkm_no + "-name").html(pkm_name)

	if ($("#pkm" + pkm_no + "-lvl").html() != lvl_label)
		$("#pkm" + pkm_no + "-lvl").html(lvl_label)
}
function changeSprite(pkm_name, pkm_no) {
	var sprite_src = "./pkm-sprites/" + pkm_name.toLowerCase() + ".png";

	if ($("#sprite" + pkm_no).attr("src") != sprite_src)
		$("#sprite" + pkm_no).attr("src", sprite_src);
}

function updateBar(hp, hpMin, pkm){
	// Reset all values
	$("#myBar1").css("width" , 100 + '%');
	$("#myBar1-max").css("width" , 100 + '%');
	$("#myBar1").removeClass('ko-d');
	$("#myBar1").html("&nbsp");

	$("#myBar2").css("width" , 100 + '%');
	$("#myBar2-max").css("width" , 100 + '%');
	$("#myBar2").removeClass('ko-d');
	$("#myBar2").html("&nbsp");

	// alert(hp + " " + hpMin + " " + pkm);

	if (pkm == 1){
		if(hpMin <= 0 && hp <= 0) {
			$("#myBar2").css("width" , 100 + '%');
			$("#myBar2-max").css("width" , 0 + '%');
			$("#myBar2").text("KO'd!");
			$("#myBar2").addClass('ko-d');
		} else if (hpMin <= 0) {
			$("#myBar2").css("width" , hp + '%');
			$("#myBar2-max").css("width" , 0 + '%');
		} else {
			$("#myBar2").css("width" , hp + '%');
			$("#myBar2-max").css("width" , hpMin + '%');
		}
	} else {
		if(hpMin <= 0 && hp <= 0) {
			$("#myBar1").css("width" , 100 + '%');
			$("#myBar1-max").css("width" , 0 + '%');
			$("#myBar1").text("KO'd!");
			$("#myBar1").addClass('ko-d');
		} else if (hpMin <= 0) {
			$("#myBar1").css("width" , hp + '%');
			$("#myBar1-max").css("width" , 0 + '%');
		} else {
			$("#myBar1").css("width" , hp + '%');
			$("#myBar1-max").css("width" , hpMin + '%');
		}
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

// Mobile App initialization
if (screen.width <= 600) {
	$('.pkm-2-move').hide();
	$('.pkm-2').hide();
}
$(window).resize(function(){
    if (screen.width <= 600) {
		document.location = "mobile.html";
	} else {
		document.location = "index.html";
	}
});

function swapPkm() {
	$('.pkm-2-move').toggle();
	$('.pkm-1-move').toggle();
	$('.pkm-2').toggle();
	$('.pkm-1').toggle();
}
$('.pkm-swap1').click(function() {
	if (!($('.pkm-1').is(":visible"))){
		swapPkm();
	}
});
$('.pkm-swap2').click(function() {
	if (!($('.pkm-2').is(":visible"))){
		swapPkm();
	}
});
