var money={};

function init() {
    $.post(
        "core.php",
        {
            "action" : "init"
        },
        showGoods
    );
	loadCart();
}

function showGoods(data) {
    data = JSON.parse(data);
    console.log(data);
    var out='<select>';
    out +='<option data-id="0">Новый товар</option>';
    for (var id in data) {
        out +=`<option data-id="${id}">${data[id].id}</option>`;
    }
    out +='</select>';
    $('.goods-out').html(out);
	$('.goods-out select').on('change', selectGoods);
	$('.moneynull').on('click',setMoneyNull);
}

function selectGoods() {
	var id = $('.goods-out select option:selected').attr('data-id');
	console.log(id);
	$.post(
		"core.php",
		{
			"action":"selectOneGoods",
			"gid": id
		},
		function(data){
			data = JSON.parse(data);
			$('#gname').val(data.name);
			$('#gcost').val(data.cost);
			$('#gdescr').val(data.description);
			$('#gorder').val(data.ord);
			$('#gimg').val(data.img);
			$('#gid').val(data.id)
		}	
	);
}

function saveToDb() {
	//сохраняет обновления базы
	var id = $('#gid').val();
	if (id!=""){
		$.post(
			"core.php",
			{
				"action":"updateGoods",
				"id" : id,
				"gname" : $('#gname').val(),
				"gcost" : $('#gcost').val(),
				"gdescr" : $('#gdescr').val(),
				"gorder" : $('#gorder').val(),
				"gimg" : $('#gimg').val()
			},
			function(data){ 
				if (data == 1) {
					alert('Запись добавлена')
					init();			
			}
				else {
					console.log(data);
				}
			}
		);	
	}
	else {
		//вносит новые позиции в базу данных
		console.log('new');
		$.post(
		"core.php",
		{
			"action":"newGoods",
			"id" : 0,
			"gname" : $('#gname').val(),
			"gcost" : $('#gcost').val(),
			"gdescr" : $('#gdescr').val(),
			"gorder" : $('#gorder').val(),
			"gimg" : $('#gimg').val()
 		},
		function(data){ 
			if (data == 1) {
				alert('Новая запись добавлена')
				init();			
			}
				else {
					console.log(data);
				}
			}
		);
	}
	
}

function showMoney() {
	//показываю деньги
		var out="";
		for (var key in money) {
			out += key+' --- '+ money[key]+' руб'+'<br>';
		}
		$('.money').html(out);
}

function loadCart() {
	//проверяю есть ли записи в корзине
	//если есть, то расшифровываю
	if (localStorage.getItem('money')){
		money = JSON.parse(localStorage.getItem('money'));
		showMoney(); 
	}
	
}

function setMoneyNull() {
	for (var id in money){
		money[id]=0;
	}
	saveCart();
	console.log('Обнулил');
}

function saveCart() {
	//сохраняю корзину в localStorage
	localStorage.setItem('money', JSON.stringify(money));
}

$(document).ready(function() {
   init();
   $('.add-to-db').on('click', saveToDb);
});





