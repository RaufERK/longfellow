/* 
	Функция записи cookie.
	setCookie(name, value[, expires date, path, domain, secure])
*/
function setCookie(name, value)
{
	var args = setCookie.arguments;
	var expires = args[2] ? '; expires=' +  args[2].toGMTString() : '';
	//expires = '; expires=' +cookieDate.toGMTString();
	var path = args[3] ? '; path=' + args[3] : '';
	var domain = args[4] ? '; domain=' + args[4] : '';
	var secure = args[5] ? '; secure' : '';
	document.cookie = name + '=' + escape(value) + expires + path + domain + secure;
}
		
/* Функция чтения cookie */
function getCookie(name)
{
	name += '=';
	with(document)
	{
		var beg = cookie.indexOf(name);
		if(beg == -1) return false;
		else beg += name.length;
		var end = cookie.indexOf(';', beg);
		if(end == -1) end = cookie.length;
		return unescape(cookie.substring(beg, end));
	}
}
		
/* Функция удаления cookie */
function deleteCookie(name)
{
	var expDate = new Date();
	expDate.setTime(expDate.getTime() - 10);
	setCookie(name, getCookie(name), expDate);
	//document.cookie = "cart=;";
	//alert(document.cookie);
}

/* Функция выдает объек по его ID*/
function getIt(id){
	return document.getElementById(id)
}

function testit(id,price){
		if(getCookie("cart"))
		{
			val=getCookie("cart")+"="+id+"-"+document.getElementById("select"+id).value+"-"+price;
		}else{
			val=id+"-"+document.getElementById("select"+id).value+"-"+price;
		}

		setCookie("cart", val,"","/");
		tmp_arr=parse_cart();

		sum=0;
		for(var i=0; i < tmp_arr.length; i++)
		{

			subs=tmp_arr[i].substring(tmp_str.indexOf("-")+1, tmp_arr[i].length);
			sum = sum+subs.substring(0, subs.indexOf("*")) * subs.substring(subs.indexOf("*")+1,subs.length);
		}
		window.alert("В корзине наименований: "+tmp_arr.length);
}

function parse_cart(){
	if(getCookie("cart")){
		tmp_str=getCookie("cart");
		i=0;
		var arr = new Array();
		while(tmp_str.indexOf("=")!=-1){
			arr[i]=tmp_str.substring(0,tmp_str.indexOf("="));
			tmp_str=tmp_str.substring(tmp_str.indexOf("=")+1,tmp_str.length);
			i=i+1;
		}
		arr[i]=tmp_str;
		return arr; //*/
	}else{
		deleteCookie("cart");	
	}
}

function submit_cart(){
	if(getCookie("cart"))
		{

			tmp_str=getCookie("cart");
			document.getElementById('carta').value=tmp_str;
			//alert (document.all.carta.value);
			document.getElementById('cart_form').submit();
		}else{
			window.alert("Корзина пуста!\nВыберите интересующий вас товар.\nУкажите количество и нажмите \"Заказать\"\nЗатем перейдите к вашему заказу."); 
		}
}

function recountw(){
	i1=0; // Общее количество товаров (нафига?)
	i2=0; // Общая сумма
	i3=0; // Общий вес
	// Переделаем зависимость не от amount а от кол-ва строк в таблице
	strok = document.getElementById("order_table").rows.length; //кол-во строк в таблице
	
	// Алгоритм один и не зависит от кол-ва строк!
		
	for(var i=1; i<strok -1; i++){
		//alert (document.getElementById("summ"+i).value);
		document.getElementById("summ"+i).value = document.getElementById("price"+i).value*document.getElementById("amount"+i).value;
		document.getElementById("sweight"+i).value = document.getElementById("weight"+i).value*document.getElementById("amount"+i).value;
		i1=i1+ parseInt(document.getElementById("amount"+i).value)
		i2=i2+ parseInt(document.getElementById("summ"+i).value)
		i3=i3+ parseInt(document.getElementById("sweight"+i).value)
	}

	document.getElementById('iamount').value=i1;
	document.getElementById('isumm').value=i2;
	if(	document.getElementById('na_summu')){
		document.getElementById('na_summu').value=document.getElementById('isumm').value + ' руб.';
	}
	document.getElementById('iweight').value=i3;

	tmp_x=(document.getElementById('iweight').value - (document.getElementById('iweight').value % 3000))/3000;
	if((document.getElementById('iweight').value % 3000)>0){
		tmp_x= tmp_x+1;
	}
	if(document.getElementById('dsumm')){
		if(tmp_x<3){
			if(tmp_x==1){
				document.getElementById('dsumm').value = 200;
			}else{
				document.getElementById('dsumm').value = 300;
			}
			
		}else{
			document.getElementById('dsumm').value = 600;
		}
	}
	if(document.getElementById('fsumm')){
		document.getElementById('fsumm').value = parseInt(document.getElementById('dsumm').value) + parseInt(document.getElementById('isumm').value)
	}
	//window.alert(tmp_x);
	if(document.getElementById('td_err')){
		document.getElementById('td_err').style.display="none";
	}
	if(document.getElementById('region'))count_nal();
}

function del_one(it){
	
	var the_cookie="";
	for(var i=0; i<getIt('summ').length; i++){
		if(i!=it-1){
			the_cookie=the_cookie+document.all.id[i].value+"-"+document.all.amount[i].value+"*"+document.all.price[i].value+"=";
		}
	}
	the_cookie=the_cookie.substring(0,the_cookie.length-1);
	setCookie("cart", the_cookie,"","/");
	//submit_cart();
	document.location="index.php?carta="+the_cookie;

}

function steps(num){
	
	strok = document.getElementById("order_table").rows.length;
	
	if(num==1){ // Шаг 1
		var the_cookie="";	
		for(var i=1; i<strok-1; i++){
			the_cookie=the_cookie+getIt("id"+i).value+"-"+getIt("amount"+i).value+"*"+getIt("price"+i).value+"=";
		}
		
		the_cookie=the_cookie.substring(0,the_cookie.length-1);
		setCookie("cart", the_cookie,"","/");

		getIt("carta").value=the_cookie;
		//window.alert(getIt("delivery2").checked);

		if(getIt("delivery1").checked){
			getIt("deliv").value=getIt("delivery1").value;
		}else{
			getIt("deliv").value=getIt("delivery2").value;
		}
		getIt("dsum").value=getIt("dsumm").value;
		//loc=loc + "&kol=" + document.all.dsumm.value/100 + "&dsumm=" + document.all.dsumm.value
		//window.alert("NEN")//document.all.price[document.all.price.length-1].value);
		document.getElementById('cart_form').submit();
	}
	
	if(num==2){
		var the_cookie="";
		for(var i=1; i<strok-1; i++){
		//if(document.all.id.length){
		//	for(var i=0; i<document.all.id.length; i++){
					the_cookie=the_cookie+getIt("id"+i).value+"-"+getIt("amount"+i).value+"*"+getIt("price"+i).value+"=";
				
		}
		
		/*}else{
			if(document.all.amount.length){
				the_cookie=the_cookie+document.all.id.value+"-"+document.all.amount[0].value+"*"+document.all.price[0].value+"=";
			}else{
				the_cookie=the_cookie+document.all.id.value+"-"+document.all.amount.value+"*"+document.all.price.value+"=";
			}
		}//*/
		the_cookie=the_cookie.substring(0,the_cookie.length-1);

		//var loc="";
		//loc=loc+"index.php?carta="+the_cookie+"&delivery=";
		//loc=loc+document.all.delivery.value;

		getIt("carta").value=the_cookie;
		if(getIt("carta2")){
			getIt("carta2").value=the_cookie
		}
		if(getIt("dsumm")){
			getIt("dsumm").value=getIt("summ"+(strok-2)).value;
		}
		//document.carta_form.carta.
		getIt("sity").disabled=false;
		if(getIt("nal")){
			getIt("nal").disabled=false;
		}
		deleteCookie("cart");

		//if(getIt("dsum"))getIt("dsum").value;//=document.all.price[document.all.price.length-1].value;
		//if(document.step2.dsumm)document.step2.dsumm.value=document.all.price[document.all.price.length-1].value;
		//window.alert(document.all.price[document.all.price.length-1].value);
		//window.alert(document.all.price[document.all.price.length-1].value);
		//document.all.delivery.value
		if(getIt("fsumm")){
			getIt("fsumm").value=getIt("isumm").value;
		}
		//alert("NEN");
		getIt("step2").submit();		
	}
}

function oformit(){
	disable_some(false); 
	document.all.step2.dsumm.value = document.all.price[document.all.price.length-1].value;
	document.all.step2.submit();
	//window.alert(document.all.price[document.all.price.length-1].value);
	//window.alert(document.all.step2.dsumm.value);
}

function block_some(){

	strok = document.getElementById("order_table").rows.length;
	for(var i=1; i<strok-1; i++){
		//for(var i=0; i<document.all.amount.length; i++){
			getIt("amount"+i).disabled=true;
			getIt("amount"+i).className="buttonflat";
			getIt("delbutton"+i).style.display="none";
	}
}


function disable_some(yes){

	for (var i=0;i<document.all.step2.elements.length; i++ )
	{
		document.all.step2.elements[i].disabled=yes;
	}
}

function count_nal(){
	// Подсчет наложенного платежа

	if (getIt("region").value=="")
	{
			getIt("nal").value="[нет]";
			//getIt("dsumm").value="???"; 
	}
	else{
		//window.alert("region"+getIt("region").value);
		if(getIt("region"+getIt("region").value)){
			poias=getIt("region"+getIt("region").value).value;
			//window.alert(poias);
			tmp_x=(getIt("iweight").value - (getIt("iweight").value % 500))/500;
			if((getIt("iweight").value % 500)>0){
				tmp_x= tmp_x+1;
			}
			var kolvo; //количество бандеролей
			kolvo = 1;
			var tmp_weight=0;
			

			if(true){// Для тестирования document.all.weight.length){
				strok = document.getElementById("order_table").rows.length;
				//alert(strok);
				for(var i=1; i<strok-3; i++){
				//for(var i=0; i<document.all.weight.length; i++){
					//alert(i);
					if((tmp_weight+getIt("we_"+i).value*getIt("am_"+i).value)> 1900)
						{
						for (var k=0; k<getIt("am_"+i).value ; k++ )
						{	
							//alert("Вес сейчас: " +(tmp_weight + parseInt(document.all.weight[i].value)));
							if(tmp_weight + parseInt(getIt("we_"+i).value) < 1900){
								tmp_weight = tmp_weight+parseInt(getIt("we_"+i).value);
							}else{
								//alert("Кол-во " + kolvo + " Вес:" + tmp_weight)
								kolvo++;
								tmp_weight = parseInt(getIt("we_"+i).value);
							}
						}
						
					}else{
						tmp_weight = tmp_weight+getIt("we_"+i).value*getIt("am_"+i).value;
					}
				}
				//alert("Кол-во " + kolvo);
				
			}
			
			vel=parseFloat(getIt("poias"+poias).value)
			getIt("nal").value=((tmp_x*vel + 40)*1.15+getIt("isumm").value*0.15+10*kolvo);

			
			// округляем до рублей в большую сторону
			tmp_x=getIt("nal").value - (getIt("nal").value % 1);
			if((getIt("nal").value % 1)>0){
				tmp_x= tmp_x+1;
			}
			getIt("nal").value=tmp_x; //tmp_str.substring(0, tmp_str.indexOf(".")+3)		
			getIt("dsumm").value=tmp_x; 
		}
	}

}


function checkit2(){
	// ???
	var ok = true
	if (getIt("fname").value==""){
		getIt("td_fname").className="err";
		ok=false;
	}else{
		getIt("td_fname").className="text";
	}
	if (getIt("indeks").value==""||getIt("indeks").value.length<6){
		getIt("td_indeks").className="err";
		ok=false;
	}else{
		getIt("td_indeks").className="text";
	}
	if (getIt("adres").value==""){
		getIt("td_adres").className="err";
		ok=false;
	}else{
		getIt("td_adres").className="text";
	}
	if (getIt("region").value==""){
		getIt("td_region").className="err";
		ok=false;
	}else{
		getIt("td_region").className="text";
	}


	if (getIt("sity").value==""){
		getIt("td_sity").className="err";
		ok=false;
	}else{
		getIt("td_sity").className="text";
	}
	if(ok){
		steps(2);
	}else{
		getIt("td_err").style.display="block";
	}
}

function recall(){
	//проверка правильности положения во фрейме
	if(self.parent.document==self.document){
		document.location="..";
	}
}

// ============================================================= //
// Функции модернизации заказа
// ============================================================= //

goods = new Array();
position = 0;
tmp_books = new Array();
ordered = false;
if (/MSIE (5\.5|6|7|8)/.test(navigator.userAgent) ){
	//window.alert("IE - Нашел! " + navigator.userAgent);
	IE = true;
}else{
	IE = false;
}



// handles the response received from the server
function handleServerResponse()
{
  // read the message from the server
  //var xmlResponse = xmlHttp.responseXML;
  var txtResponse = xmlHttp.responseText;
	//window.alert (txtResponse );
	//alert(txtResponse);
   var jsonData = eval ('('+txtResponse+')');
  //jsonData.books.forEach( function(item){ alert(item); } ); 
//  myArray
//    .filter( function(item){ return item > 5; } )
//    .forEach( function(item){ alert(item); } );
  goods=jsonData.books;
//  tmp_books
//	.filter( function(item){ return item['id'] == '3'; } )
//	.forEach( function(item){ alert(item['name']); } );
}

function AddGood(id, amount, price){
	newGood = new Object();
	newGood.index = goods.length;
	newGood.id = id;
	newGood.name = "";
	newGood.price = price;
	newGood.amount = amount;
	newGood.weight = 0;
	goods[goods.length]=newGood;
}

function redrawGoods(table){
	theTable = document.getElementById(table);
	
	//Очищаем таблицу 
	
	var GetRem = document.getElementById(table);
   	if(cloneGetRem = document.getElementById("order_remover")){
		GetRem.removeChild(cloneGetRem);
	}
	
	if(goods != null && goods.length>0){
		//Добавим tbody
		tbody = document.createElement("tbody");
    	tbody.id = "order_remover";
		theTable.appendChild(tbody);
		
		row = document.createElement("tr");
		row.className = "buttonflat";

		nameCol = document.createElement("td");
		nameCol.width=30;
		nameCol.className = "lu";
		nameCol.appendChild(document.createTextNode("№№"));
		row.appendChild(nameCol);

		nameCol = document.createElement("td");
		nameCol.width=400;
		nameCol.className = "lu";
		nameCol.appendChild(document.createTextNode("Наименование"));
		row.appendChild(nameCol);
		
		nameCol = document.createElement("td");
		nameCol.width=75;
		nameCol.className = "lu";
		nameCol.appendChild(document.createTextNode("Цена"));
		row.appendChild(nameCol);

		nameCol = document.createElement("td");
		nameCol.width=75;
		nameCol.className = "lu";
		nameCol.appendChild(document.createTextNode("Количество"));
		row.appendChild(nameCol);

		nameCol = document.createElement("td");
		nameCol.width=75;
		nameCol.className = "lu";
		nameCol.appendChild(document.createTextNode("Сумма"));
		row.appendChild(nameCol);

		nameCol = document.createElement("td");
		nameCol.width=75;
		nameCol.className = "lu";
		nameCol.appendChild(document.createTextNode("Вес"));
		row.appendChild(nameCol);

		nameCol = document.createElement("td");
		nameCol.width=12;
		nameCol.className = "lur";
		nameCol.appendChild(document.createTextNode("X"));
		row.appendChild(nameCol);

		tbody.appendChild(row);
		first=0;
		for(index=first; index < goods.length-position; index++){
			good = goods[index];
				if(good != null){
					row = document.createElement("tr");

						
					nameCol = document.createElement("td");
					nameCol.className = "lu";
						hBox = document.createElement("input");
						hBox.type='hidden';
						hBox.id	='id_'+index;
						hBox.value=good.id;
					nameCol.appendChild(hBox);
					nameCol.appendChild(document.createTextNode(index+1));
					row.appendChild(nameCol);

					nameCol = document.createElement("td");
					nameCol.width=400;
					nameCol.className = "lu";
					nameCol.innerHTML="<div align=left>"+good.name+"</div>";
					row.appendChild(nameCol);
					
					nameCol = document.createElement("td");
					nameCol.className = "lu";
						hBox = document.createElement("input");
						hBox.type='text';
						hBox.id='cost_'+index;
						hBox.size=6;
						hBox.disabled=true;
						hBox.value=good.price;
						hBox.className="smallt";
					nameCol.appendChild(hBox);
					row.appendChild(nameCol);
					
					nameCol = document.createElement("td");
					nameCol.className = "lu";
						hBox = document.createElement("input");
						hBox.type='text';
						hBox.id='am_'+index;
						hBox.size=6;
						hBox.value=good.amount;
						hBox.className="smallt";
						hBox.onchange=CheckAmount;
					nameCol.appendChild(hBox);
					row.appendChild(nameCol);
					nameCol = document.createElement("td");
					
					nameCol.className = "lu";
						hBox = document.createElement("input");
						hBox.type='text';
						hBox.id='sum_'+index;
						hBox.size=6;
						hBox.disabled=true;
						hBox.className="smallt";
					nameCol.appendChild(hBox);
					row.appendChild(nameCol);

					nameCol = document.createElement("td");
					nameCol.className = "lu";
						hBox = document.createElement("input");
						hBox.type='text';
						hBox.id='we_'+index;
						hBox.size=6;
						hBox.disabled=true;
						hBox.value=good.weight;
						hBox.className="smallt";
					nameCol.appendChild(hBox);
					row.appendChild(nameCol);

					nameCol = document.createElement("td");
					nameCol.className = "lur";
					nameCol.width=1;
					ButtonCol=document.createElement("input");
					ButtonCol.type="button";
					ButtonCol.value="-";
					ButtonCol.className = "buttons";
					//ButtonCol.onclick=function(){'javascript:window.alert('+index+')'};
					ButtonCol.id="but"+index;
					ButtonCol.tmp=index;
					nameCol.setAttribute("align", "center");
					nameCol.appendChild(ButtonCol)
					row.appendChild(nameCol);

					tbody.appendChild(row);

					document.getElementById('but'+index).onclick=function(){
						DelItem(this.tmp);
					}

				}
		
		}
		row = document.createElement("tr");
		//row.className = "buttonflat";

		nameCol = document.createElement("td");
		nameCol.className = "lu";
		//nameCol.setAttribute("colSpan", 2);
		nameCol.setAttribute("colSpan", 2);
		nameCol.innerHTML="<div align=right>ИТОГО:</div>";
		row.appendChild(nameCol);
		
		nameCol = document.createElement("td");
		nameCol.className = "lu";
		nameCol.innerHTML="&nbsp;";
		row.appendChild(nameCol);

		nameCol = document.createElement("td");
					nameCol.className = "lu";
						hBox = document.createElement("input");
						hBox.type='text';
						hBox.id='iamount';
						hBox.size=6;
						hBox.disabled=true;
						//hBox.value=good.weight;
						hBox.className="smallt";
					nameCol.appendChild(hBox);
					row.appendChild(nameCol);

		nameCol = document.createElement("td");
					nameCol.className = "lu";
						hBox = document.createElement("input");
						hBox.type='text';
						hBox.id='isumm';
						hBox.size=6;
						hBox.disabled=true;
						//hBox.value=good.weight;
						hBox.className="smallt";
					nameCol.appendChild(hBox);
					row.appendChild(nameCol);

		nameCol = document.createElement("td");
					nameCol.className = "lu";
						hBox = document.createElement("input");
						hBox.type='text';
						hBox.id='iweight';
						hBox.size=6;
						hBox.disabled=true;
						hBox.className="smallt";
					nameCol.appendChild(hBox);
					row.appendChild(nameCol);

		

		nameCol = document.createElement("td");
		nameCol.width=12;
		nameCol.className = "lur";
		nameCol.innerHTML="&nbsp;";
		row.appendChild(nameCol);

		tbody.appendChild(row);

		row = document.createElement("tr");
		//row.className = "buttonflat";

		nameCol = document.createElement("td");
		nameCol.className = "lub";
		nameCol.setAttribute("colSpan", 2);
		nameCol.innerHTML="<div align=right>Стоимость доставки:</div>";
		row.appendChild(nameCol);

		nameCol = document.createElement("td");
		nameCol.className = "lub";
		nameCol.innerHTML="Рассчитает менеджер";
		nameCol.setAttribute("colSpan", 2);
		row.appendChild(nameCol);

		nameCol = document.createElement("td");
		nameCol.className = "lub";
			hBox = document.createElement("input");
			hBox.type='hidden';
			hBox.id='dsumm';
			hBox.size=6;
			hBox.disabled=true;
			hBox.className="smallt";
		nameCol.appendChild(hBox);
		row.appendChild(nameCol);

		nameCol = document.createElement("td");
		nameCol.className = "lub";
		nameCol.innerHTML="&nbsp;";
		row.appendChild(nameCol);

		nameCol = document.createElement("td");
		nameCol.width=12;
		nameCol.className = "lubr";
		nameCol.innerHTML="&nbsp;";
			//appendChild(document.createTextNode(" "));
		row.appendChild(nameCol);

		tbody.appendChild(row);

	}else{
		//Добавим tbody
		tbody = document.createElement("tbody");
    	tbody.id = "testremover";
		theTable.appendChild(tbody);
		
		row = document.createElement("tr");
		checkBoxCol = document.createElement("td");
		checkBoxCol.width=10;
		row.appendChild(checkBoxCol);

		nameCol = document.createElement("td");
		nameCol.id = "empty";
		if(ordered){
			tmstr="";
		}else{
			tmstr="Корзина пуста";
		}

		nameCol.appendChild(document.createTextNode(tmstr));
		row.appendChild(nameCol);
		
		nameCol = document.createElement("td");
		nameCol.width=10;
		row.appendChild(nameCol);
		
		tbody.appendChild(row);
		document.getElementById('deliver').style.display="none";
		document.getElementById('curier').style.display="none";
		document.getElementById('pochta').style.display="none";
	}
	//RecountSum();
	//setOrder();
}


function getOrder(){
	//deleteCookie("cart");
	if(!ordered){
		var tmp = getCookie("cart");

		//if(getCookie("fnamep")){
			//alert(document.getElementById("emailp")+"NEN "+getCookie("emailp"));
			if(getCookie("emailp"))document.getElementById("emailp").value=getCookie("emailp");
			if(getCookie("fnamep"))document.getElementById("fnamep").value=getCookie("fnamep");
			if(getCookie("cityp"))document.getElementById("cityp").value=getCookie("cityp");
			if(getCookie("adresp"))document.getElementById("adresp").value=getCookie("adresp");
			if(getCookie("phonep"))document.getElementById("phonep").value=getCookie("phonep");
			if(getCookie("phone2p"))document.getElementById("phone2p").value=getCookie("phone2p");
			if(getCookie("primp"))document.getElementById("primp").value=getCookie("primp");
			if(getCookie("indeks"))document.getElementById("indeks").value=getCookie("indeks");
			if(getCookie("region"))document.getElementById("region").value=getCookie("region");

			if(getCookie("email"))document.getElementById("email").value=getCookie("email");
			if(getCookie("fname"))document.getElementById("fname").value=getCookie("fname");
			if(getCookie("adres"))document.getElementById("adres").value=getCookie("adres");
			if(getCookie("phone"))document.getElementById("phone").value=getCookie("phone");
			if(getCookie("phone2"))document.getElementById("phone2").value=getCookie("phone2");
			if(getCookie("prim"))document.getElementById("prim").value=getCookie("prim");
		//}
		if(tmp!=null&&tmp!=''){
			//window.alert("Кука ="+tmp);
			id='';
			tmp_goods= tmp.split('=');
			for (var i = 0; i < tmp_goods.length; i++) {
				tmp_good=tmp_goods[i].split('-');
				if(tmp_good[0]!=""){
					if(i>0)id+=",";
					id+=tmp_good[0]+"-"+tmp_good[1];
					//AddGood(tmp_good[0], tmp_good[1], tmp_good[2]);
				}
			}
			process(id);

			resortGoods();
			document.getElementById("deliver").style.display="block";
				//document.getElementById("deliver").style="display:block";
			
		}else{
			//window.alert("Кука пустая!");
		}

		redrawGoods('order_table');
		RecountSum();
	}
}

function RecountSum(){
		theTable=document.getElementById("order_table");
		theSum=document.getElementById("isumm");
		theSum.value=0;
		amo=0;
		wes=0;
		for(index = 0; index <= theTable.rows.length; index++){
			
			per = document.getElementById("sum_"+index);
			cost = document.getElementById("cost_"+index);
			amount = document.getElementById("am_"+index);
			weight = document.getElementById("we_"+index);
			if(per!=null){
				per.value=parseFloat(cost.value*amount.value);
				theSum.value=parseFloat(theSum.value)+parseFloat(per.value);
				amo+=parseInt(amount.value);
				wes+=parseInt(weight.value)*parseInt(amount.value);
			}else{
				//window.alert("Тут! " + index);
			}

		}
		document.getElementById("iamount").value=amo	;
		document.getElementById("iweight").value=wes;
		tmp=theSum.value;
		if(tmp.indexOf(".")!=-1){
			theSum.value=tmp.substring(0,tmp.indexOf(".")+3);
		}

		tmp_x=(document.getElementById('iweight').value - (document.getElementById('iweight').value % 3000))/3000;
		if((document.getElementById('iweight').value % 3000)>0){
			tmp_x= tmp_x+1;
		}
		
		if(document.getElementById('dsumm')&&document.getElementById('delivery1').checked==true){
			
			if(tmp_x<3){
				if(tmp_x==1){
					document.getElementById('dsumm').value = "200";
				}else{
					document.getElementById('dsumm').value = "300";
				}
				
			}else{
				
				document.getElementById('dsumm').value = "600";
			}
		}else{
				document.getElementById('dsumm').value = "???";
		}
		
		if(getIt("region"+getIt("region").value)&&document.getElementById('delivery2').checked==true){ //считаем как наложку
			count_nal();
		}

		if(document.getElementById('fsumm')){
			document.getElementById('fsumm').value = parseInt(document.getElementById('dsumm').value) + parseInt(document.getElementById('isumm').value)
		}
		if(document.getElementById('dsumm2')){
			document.getElementById('dsumm2').value = parseInt(document.getElementById('dsumm').value)
		}
}


function CheckAmount(){
	field=this;
	if(field.value!=parseInt(field.value)){
		window.alert("Введите правильное количество! ");
		field.select();
	}else{
		RecountSum();
	}
}

function goforit(num){
	if(num==0){
			document.getElementById('deliver').style.display="block";
			document.getElementById('curier').style.display="none";
			document.getElementById('pochta').style.display="none";
	}
	if(num==1){
		if(document.getElementById('delivery1').checked==true){ //доставка курьером
			//alert("1");
			document.getElementById('deliver').style.display="none";
			document.getElementById('curier').style.display="block";
			document.getElementById('pochta').style.display="none";
			
		}else{ // доставка почтой
			//alert("2");
			document.getElementById('deliver').style.display="none";
			document.getElementById('curier').style.display="none";
			document.getElementById('pochta').style.display="block";
		}
	}
	if(num==2){
		//alert("3");
		setcart();
		setCookie("emailp", document.getElementById("emailp").value,cookieDate,"/");
		//alert (getCookie("region"));
		
		setCookie("fnamep", document.getElementById("fnamep").value,cookieDate,"/");
		setCookie("indeks", document.getElementById("indeks").value,cookieDate,"/");
		setCookie("region", document.getElementById("region").value,cookieDate,"/");
		setCookie("cityp", document.getElementById("cityp").value,cookieDate,"/");
		setCookie("adresp", document.getElementById("adresp").value,cookieDate,"/");
		setCookie("phonep", document.getElementById("phonep").value,cookieDate,"/");
		setCookie("phone2p", document.getElementById("phone2p").value,cookieDate,"/");
		setCookie("primp", document.getElementById("primp").value,cookieDate,"/");

		setCookie("email", document.getElementById("email").value,cookieDate,"/");
		setCookie("fname", document.getElementById("fname").value,cookieDate,"/");
		setCookie("adres", document.getElementById("adres").value,cookieDate,"/");
		setCookie("phone", document.getElementById("phone").value,cookieDate,"/");
		setCookie("phone2", document.getElementById("phone2").value,cookieDate,"/");
		setCookie("prim", document.getElementById("prim").value,cookieDate,"/");
		deleteCookie("cart");
		document.getElementById('order_form').submit();
	}
}

function setcart(){ //устанавливает значение cart2=содержимому обновленной корзины
	var tmp_cart="";

	theTable=document.getElementById("order_table");
	for(index = 0; index <= theTable.rows.length; index++){
		
		id = document.getElementById("id_"+index);
		cost = document.getElementById("cost_"+index);
		amount = document.getElementById("am_"+index);
		if(id!=null){
			if(tmp_cart!="")tmp_cart+="=";
			tmp_cart+=id.value+"-"+amount.value+"-"+cost.value;
		}else{
			//window.alert("Тут! " + index);
		}

	}
	document.getElementById('carta2').value=tmp_cart;
}

function checkit(num){
	var ok = true
	if(num==1){
		
		if (getIt("fname").value==""){
			getIt("td_fname").className="err";
			ok=false;
		}else{
			getIt("td_fname").className="text";
		}
		
		if (getIt("adres").value==""){
			getIt("td_adres").className="err";
			ok=false;
		}else{
			getIt("td_adres").className="text";
		}
		
		if (getIt("phone").value==""){
			getIt("td_phone").className="err";
			ok=false;
		}else{
			getIt("td_phone").className="text";
		}
		
		if(ok){
			//alert(1);
			goforit(2);
			getIt("td_err").style.display="none";
		}else{
			getIt("td_err").style.display="block";
		}
	}else{
		//Проверим имя
		if (getIt("fnamep").value==""){
			getIt("td_fnamep").className="err";
			ok=false;
		}else{
			getIt("td_fnamep").className="text";
		}

		// Проверим регион
		if (getIt("region").value==""){
			getIt("td_region").className="err";
			ok=false;
		}else{
			getIt("td_region").className="text";
		}
		// Проверим индекс
		if (getIt("indeks").value==""||getIt("indeks").value.length<6){
			getIt("td_indeks").className="err";
			ok=false;
		}else{
			getIt("td_indeks").className="text";
		}
		// Проверим населенный пункт
		if (getIt("cityp").value==""){
			getIt("td_cityp").className="err";
			ok=false;
		}else{
			getIt("td_cityp").className="text";
		}
		// Проверим адрес
		if (getIt("adresp").value==""){
			getIt("td_adresp").className="err";
			ok=false;
		}else{
			getIt("td_adresp").className="text";
		}
		
		if(ok){
			//alert(1);
			goforit(2);
			getIt("td_errp").style.display="none";
		}else{
			getIt("td_errp").style.display="block";
		}
	}
}

function resortGoods(){
	b=[];
	for(index=0; index < goods.length; index++){
		c=goods[index];
		if (b[c.id] == null) {
			b[c.id] = [c.id, c.name, c.price, c.amount, c.weight];
			//b[c.id][3] = c.amount;//1;//parseInt(b[c.id][3])+1;
		}else{
			b[c.id][3] = parseInt(c.amount)+parseInt(b[c.id][3]);
		}
	}

		tgoods = new Array();
		for (k in b) {
			newGood = new Object();
			newGood.index = tgoods.length;
			newGood.id = b[k][0];//id;
			newGood.name = b[k][1];//name;
			newGood.price = b[k][2];//price;
			newGood.amount = b[k][3]; //amount;
			newGood.weight=b[k][4];
			tgoods[tgoods.length]=newGood;
			}
		goods=tgoods;
}

function DelItem(index){
	goods.splice(index,1);
	redrawGoods('order_table');
	if(goods.length>0)RecountSum();
	setCartCokie();
}

function setCartCokie(){ //устанавливает значение cookie("cart")=содержимому обновленной корзины
	var tmp_cart="";

	theTable=document.getElementById("order_table");
	for(index = 0; index <= theTable.rows.length; index++){
		
		id = document.getElementById("id_"+index);
		cost = document.getElementById("cost_"+index);
		amount = document.getElementById("am_"+index);
		if(id!=null){
			if(tmp_cart!="")tmp_cart+="=";
			tmp_cart+=id.value+"-"+amount.value+"-"+cost.value;
		}else{
			//window.alert("Тут! " + index);
		}

	}
	//alert(tmp_cart);
	setCookie("cart", tmp_cart,cookieDate,"/");
	//document.getElementById('carta2').value=tmp_cart;
}

function addDays(date, n) { // добавляет n дней к указанной дате
	// может отличаться на час, если произошло событие перевода времени
	var d = new Date();	
	d.setTime(date.getTime() + n * 24 * 60 * 60 * 1000);
	return d;
}
cookieDate = new Date();
cookieDate = addDays(cookieDate, 100);