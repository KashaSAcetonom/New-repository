var cart= {}; //корзина времени, тупо ну и ладно
var money={}; // будет считать количество денег

function init() {
	//вычитываем файл goods.json
	//$.getJSON("goods.json", goodsOut);
	//работаем напрямую с БД
	$.post(
		"admin/core.php",
		{
			"action" : "loadGoods"
		},
		goodsOut
	);
}

function goodsOut(data) {
	// вывод на страницу
	//var goods=JSON.parse(data); конвертировать только когда приходит строка, а не файл
	data = JSON.parse(data);
	console.log(data);
	var out='';
	for (var key in data) {
        out +=`<div class="cart" id="bascet${key}">`; //баскет - для выбора конкретного дива
        out +=`<p class="name">${data[key].id}</p>`;      /* <a href="tubihg.html#${key}"></a> */   //номер ячейки можно сделать ссылкой и перекидывать на отдельную страницу
        out +=`<img src="images/${data[key].img}" alt="">`;
        out +=`<button class="add-to-cart" data-id="${key}">+30мин</button>`;
		out +=`<div class="timer" id="timer${key}"></div>`;				// ${data[key].cost} ссылка на получение стоимости из базы данных
		out +=`<button class="setnull" data-id="${key}">Сбросить</button>`;
        out +='</div>';
	}
	$('.goods-out').html(out);
	$('.add-to-cart').on('click',addToCart);
	$('.setnull').on('click',setNull);
	
	//$('.later').on('click',addToLater);
}

//пока ниженаписанные функции не использую

// function addToLater() {
	// добавляю товар в желания
	// var later={};
	// if (localStorage.getItem('later')){
		// later = JSON.parse(localStorage.getItem('later'));	
	// }
	// alert('Добавлено в желания');
	// var id = $(this).attr('data-id');
	// later[id]=1;
	// localStorage.setItem('later', JSON.stringify(later));
// }

function addToCart() {
	//добавляем товар в корзину
	var id = $(this).attr('data-id');
	console.log(id);
	if (money[id]==undefined) {
		money[id]=0;
	}
		
	if (cart[id]==undefined) {
		cart[id] = 1800; //если в корзине нет товара, делаем = 1
		money[id]=money[id]+150;
		//дописать правило для двойной
	}
	else {
		cart[id]= cart[id]+1800; //если товар есть, увеличиваемга 1
		money[id]=money[id]+100;
	}
	//showMiniCart(); сделал не отображаемым, чтобы не нагружать внешний вид
	saveCart();
}

function setNull() {
	//обнуляем корзину
	var id = $(this).attr('data-id');
	console.log(id);
	console.log(cart[id]);
	cart[id] = undefined; 
	// теперь возвращаем стоимость на место
	
	
	//showMiniCart(); сделал не отображаемым, чтобы не нагружать внешний вид
	saveCart();
}

function cutMinuteTimer() {          //каждую минуту отнимает единицу из корзины
	colorDivByTimer();
	setGoodsTimer();
	for (var key in cart) {
		if (cart[key]>0) {
			cart[key]=cart[key]-1;
		}	
	}
	
	//showMiniCart(); //сделал не отображаемым, чтобы не нагружать внешний вид
	saveCart();
	
}

function setGoodsTimer() {
	for (var key in cart) {   // var key перебирает только существующие значения, undefined 
		var number = '#'+'bascet'+ key;
		var timer = '#'+'timer'+ key;
		var out = "";
		var secunda = cart[key] - Math.floor(cart[key]/60)*60;
		console.log(secunda);
		if (secunda > 9) {
		out = Math.floor(cart[key]/60) + ' : ' + secunda;  //число минут
		}
		else {
			out = Math.floor(cart[key]/60) + ' : 0' + secunda;  //число минут
		}
		$(timer).html(out);
		}  // отображает на каждой плюшке число минут
}

function colorDivByTimer() {
	for (var key in cart) {
		var number = '#'+'bascet'+ key;
		console.log(cart[key]);
		if (cart[key]==undefined) {
				$(number).css('backgroundColor', "silver")
		}
		else {
				if (cart[key]>300){
					$(number).css('backgroundColor', "#06D6A0")
				}
				else {
					if (cart[key]<=300 && cart[key]>0){
					$(number).css('backgroundColor', "#FFD166")
					}
					else {
							if (cart[key]==0){
							$(number).css('backgroundColor', "#EF476F")
							}	
						}

					}
		}
		
	}
}
	

setInterval(
  () => cutMinuteTimer(), //это функция высшего порядка запускает функцию периодически
  1000
);




function saveCart() {
	//сохраняю корзину в localStorage
	localStorage.setItem('cart', JSON.stringify(cart));
	localStorage.setItem('money', JSON.stringify(money));
}

function showMiniCart() {
	//показываю мини корзину
		var out="";
		for (var key in cart) {
			out += key+' --- '+ cart[key]+' сек'+'<br>';
		}
		$('.mini-cart').html(out);
}

function loadCart() {
	//проверяю есть ли записи в корзине
	//если есть, то расшифровываю
	if (localStorage.getItem('cart')){
		cart = JSON.parse(localStorage.getItem('cart'));
		//showMiniCart(); сделал не отображаемым, чтобы не нагружать внешний вид	
	}
	if (localStorage.getItem('money')){
		money = JSON.parse(localStorage.getItem('money'));
		//showMiniCart(); сделал не отображаемым, чтобы не нагружать внешний вид	
	}
}

// function getStartTimer() {}

$(document).ready(function () {
	init();
	loadCart();
})