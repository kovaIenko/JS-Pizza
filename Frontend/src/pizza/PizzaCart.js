/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');

//Перелік розмірів піци
var PizzaSize = {
    Big: "big_size",
    Small: "small_size"
};

var Storage	=	require('../storage');
var orders	=	{};
var API = require('../API.js');

//Змінна в якій зберігаються перелік піц в кошику
var Cart = [];

//HTML едемент куди будуть додаватися піци
var $cart = $(".basket");
  var cost=$(".cost");
var quent=$(".quent");

var genCost=parseInt(cost.text());
var genQuent=parseInt(quent.text());
var stPrice=0;
exports.genQuent=genQuent;
function addToCart(pizza, size) {
    genCost+=parseInt(pizza[size].price);
   cost.text(genCost);

    //Додавання однієї піци в кошик покупок

    //Приклад реалізації, можна робити будь-яким іншим способом
    var bool=false;
    for(var g=0;g<Cart.length;g++){
       // alert(Cart[g].pizza.title+" "+pizza.title);
        //alert(Cart[g].size+" "+size);
        if(Cart[g].pizza.title==pizza.title&&Cart[g].size==size){
            Cart[g].quantity+=1;
            bool=true;
        }

    }
     if(bool==false) {
         genQuent++;
         quent.text(genQuent);
         Cart.push({
             pizza: pizza,
             size: size,
             quantity: 1
         });
     }
    bool=false;

    //Оновити вміст кошика на сторінці
    updateCart();
}


function removeFromCart(cart_item) {
    var booked_name=cart_item.pizza.title;
    var booked_size=cart_item.size;
    for(var i=0;i<Cart.length;i++){
        if(Cart[i].pizza.title==booked_name&&booked_size==Cart[i].size){
            Cart.splice(i,1);
        }
    }

    var pr_=0;
    if(cart_item.size=='small_size'){
        pr_=parseInt(cart_item.pizza.small_size.price)*parseInt(cart_item.quantity);
       // quent.text(parseInt(genQuent)-parseInt(cart_item.quantity));
    }
    else{
        pr_=parseInt(cart_item.pizza.big_size.price)*parseInt(cart_item.quantity);
       //
    }

    genCost-=pr_;
    cost.text(genCost);
    updateCart();
}

/**
 * Created by Ruslan on 02.03.2017.
 */



var nextConfirm=false;
var nextConfirm1=false;
var nextConfirm2=false;
var name_feedback=$(".name_");
var name_input=$("#inputName");
var phone_feedback=$(".phoneNumber_");
var phone_input=$("#inputPhone");
var adress_input=$("#inputAdress");
var adress_feedback=$(".adress_");


$("#inputName").keyup(function () {
    var nameArr = $("#inputName").val();
    //  alert(nameArr.charAt(0));
    //  alert(nameArr);
    //alert(nameArr.length);

    if(nameArr==""){
        nextConfirm=false;
        name_feedback.css("display","block");
        name_feedback.text("The name field cannot be empty");
    }
    for(var i=0;i<nameArr.length;i++)
    {

        if((nameArr.charAt(i)<'Є'||nameArr.charAt(i)>'ї')&&nameArr.charAt(i)!='')
        {
            name_feedback.css("display","block");
            name_feedback.text("The field cannot have a number or  symbol");
            break;
        }
        else
        {
            nextConfirm=true;
            name_feedback.css("display","none");
            //  break;
        }
    }
});


$(".next").click(function(){

    var name = name_input.val();
    var phone = phone_input.val();
    var address = adress_input.val();

    var order	=	{
        Cart: Cart,
        name: name,
        phone:phone,
        address: address
    };
    var access=false;
if(nextConfirm&&nextConfirm2&&nextConfirm1) {
    API.createOrder(order, function (err, data) {
        if (err) {
            console.log("err")
        } else {
            LiqPayCheckout.init({
                data: data.data,
                signature: data.signature,
                embedTo: "#liqpay",
                mode: "popup"	//	embed	||	popup
            }).on("liqpay.callback", function (data) {
                  if(data.status=="sandbox"||data.status=="success")
                    alert("Операція успішна");
                 else  alert("Операція не була виконана");


            }).on("liqpay.ready", function (data) {

            }).on("liqpay.close", function (data) {
            });
            alert(signature);
        }
    });
}
else {
    if(!nextConfirm){
        name_feedback.css("display","block");
        name_feedback.text("The name field cannot be empty");
    }
     if(!nextConfirm1){
        phone_feedback.css("display","block");
        phone_feedback.text("The phone field cannot be empty");
    }
     if(!nextConfirm2){
        adress_feedback.css("display","block");
        adress_feedback.text("The phone field cannot be empty");
    }
}
});


$("#inputPhone").keyup(function () {
    var phoneArr = $("#inputPhone").val();
    // alert(phoneArr);
    if(phoneArr==""){
        nextConfirm1=false;
        phone_feedback.css("display","block");
        phone_feedback.text("The phone field cannot be empty");
    }

    for(var i=0;i<phoneArr.length;i++)
    {

        if((phoneArr.charAt(i)<'0'||phoneArr.charAt(i)>'9')&&phoneArr.charAt(i)!='+')
        {
            phone_feedback.css("display","block");
            phone_feedback.text("The phone field should be only a number");
            break;
        }
        else
        {
            nextConfirm1=true;
            phone_feedback.css("display","none");
            //  break;
        }
    }
});






function initialiseCart() {
    //Фукнція віпрацьвуватиме при завантаженні сторінки
    //Тут можна наприклад, зчитати вміст корзини який збережено в Local Storage то показати його
    //TODO: ...
    var saved_orders =Storage.get('cart');

    if(saved_orders){
        Cart=saved_orders;
    }
    var save_genCost=Storage.get('cost');
    if(save_genCost) {
        genCost = save_genCost;
        cost.text(genCost);
    }
    var save_genQuant=Storage.get('quent');
    if(save_genQuant) {
        genQuent = save_genQuant;
        quent.text(genQuent);
    }
    updateCart();
}

function getPizzaInCart() {
    //Повертає піци які зберігаються в кошику
    return Cart;
}



function updateCart() {
    //Функція викликається при зміні вмісту кошика
    //Тут можна наприклад показати оновлений кошик на екрані та зберегти вміт кошика в Local Storage

    //Очищаємо старі піци в кошику
    $cart.html("");

    //Онволення однієї піци

    function showOnePizzaInCart(cart_item) {
        var html_code = Templates.PizzaCart_OneItem(cart_item);
        var $node = $(html_code);

        if(cart_item.size=="small_size")
            stPrice=parseInt(cart_item.pizza.small_size.price);
        if(cart_item.size=="big_size")
            stPrice=parseInt(cart_item.pizza.big_size.price);


        $node.find(".plus").click(function(){
            //Збільшуємо кількість замовлених піц
            genCost+=stPrice;
            cost.text(genCost);
            cart_item.quantity += 1;
            Storage.set("cart",Cart);
            Storage.set('cost',genCost);
            Storage.set('quent',genQuent);
            //Оновлюємо відображення
            updateCart();
        });

        $node.find(".minus").click(function () {

            if(parseInt(cart_item.quantity)<2) {
                removeFromCart(cart_item);
                genQuent--;
                quent.text(genQuent);
            }
            else {

                if(cart_item.size=="small_size") {
                    genCost -= stPrice;
                }
                else{
                    genCost-=stPrice;
                }

                cost.text(genCost);
            }

            Storage.set("cart",Cart);
            Storage.set('cost',genCost);
            Storage.set('quent',genQuent);
            cart_item.quantity -= 1;
            updateCart();
    });

        $node.find(".delete").click(function () {
            removeFromCart(cart_item);
            Storage.set("cart",Cart);
            Storage.set('cost',genCost);
            Storage.set('quent',genQuent);
            genQuent--;
            quent.text(genQuent);
            updateCart();
        });

        //set
       Storage.set("cart",Cart);
        Storage.set('cost',genCost);
        Storage.set('quent',genQuent);

        $cart.append($node);
    }

    Cart.forEach(showOnePizzaInCart);

}

$(".clean_list").click(function () {
    var da=[];
    Cart=da;
    genCost=0;
    genQuent=0;
    cost.text(genCost);
    quent.text(genQuent);
    Storage.set("cart",Cart);
    Storage.set('cost',genCost);
    Storage.set('quent',genQuent);
    updateCart();

});
//лінія між двома пунктами
var directions;

function	initialize() {
    var point;
    var markerHome;
    var latitude = 50.41752522393159;
    var longitude = 30.53748012520373;
    //Тут починаємо працювати з картою
    var mapProp = {
        center: new google.maps.LatLng(latitude, longitude),
        zoom: 13
    };
    var html_element = document.getElementById("googleMap");
    map = new google.maps.Map(html_element, mapProp);

    point = new google.maps.LatLng(latitude, longitude);
    var marker = new google.maps.Marker({
        position: point,
        animation: google.maps.Animation.DROP,
        map: map,
        icon: "assets/images/map-icon.png"
    });

    google.maps.event.addListener(map,
        'click', function (me) {
            if (markerHome) {
                markerHome.setMap(null);
                markerHome = null;
            }
            var coordinates = me.latLng;

            markerHome = new google.maps.Marker({
                position: coordinates,
                animation: google.maps.Animation.DROP,
                map: map,
                icon: "assets/images/home-icon.png"
            });
            nextConfirm2=true;
            adress_feedback.css("display","none");
            geocodeLatLng(coordinates, function (err, adress) {
                if (!err) {
                    $("#inputAdress").val(adress);
                    $(".adressDeliver").text(adress);

                }
            });
            calculateRoute(point, me.latLng, function (err, time) {
                if (!err) {
                    $(".timeDeliver").text(time.duration.text);

                }
            });
        });

    $("#inputAdress").keypress(function(){
        if( $("#inputAdress").val().length>4){
            var coordinates;

            if(markerHome){
                markerHome.setMap(null);
                markerHome = null;
            }
            var adressArr = $("#inputAdress").val();
            geocodeAddress(adressArr, function(err, inputCoordinates){
                if(!err){
                    coordinates	=	inputCoordinates;
                    console.log(coordinates);
                    markerHome	=	new	google.maps.Marker({
                        position:	coordinates,
                        animation: google.maps.Animation.DROP,
                        map:	map,
                        icon:	"assets/images/home-icon.png"
                    });
                    geocodeLatLng(coordinates,	function(err,	adress){
                        if(!err)	{
                            console.log(adressArr);
                            $(".adressDeliver").text(adress);
                        }
                    });
                    calculateRoute(point,	 coordinates,	function(err, time){
                        if(!err){
                            $(".timeDeliver").text(time.duration.text);

                        }
                    });
                }
            });
        }
    });
}






function	geocodeLatLng(latlng,	 callback){
//Модуль за роботу з адресою
    var geocoder	=	new	google.maps.Geocoder();
    geocoder.geocode({'location':	latlng},	function(results,	status)	{
        if	(status	===	google.maps.GeocoderStatus.OK&&	results[1])	{
            var adress =	results[1].formatted_address;
            callback(null,	adress);
        }	else	{
            callback(new	Error("Can't	find	adress"));
        }
    });
}

function	geocodeAddress(address,	 callback)	{
    var geocoder	=	new	google.maps.Geocoder();
    geocoder.geocode({'address':	address},	function(results,	status)	{
        if	(status	===	google.maps.GeocoderStatus.OK&&	results[0])	{
            var coordinates	=	results[0].geometry.location;
            callback(null,	coordinates);
        }	else	{
            callback(new	Error("Can	not	find	the	adress"));
        }
    });
}

function	calculateRoute(A_latlng,	 B_latlng,	callback)	{
    nextConfirm2=true;
    adress_feedback.css("display","none");
    if(directions){
        directions.setMap(null);
        directions=null;
    }
    directions = new google.maps.DirectionsRenderer();
    var directionService =	new	google.maps.DirectionsService();
    directionService.route({
        origin:	A_latlng,
        destination:	B_latlng,
        travelMode:	google.maps.TravelMode["DRIVING"]
    },
        function(response,	status)	{
        if	(status	==	google.maps.DirectionsStatus.OK )	{
            directions.setDirections(response);
            var leg	=	response.routes[0].legs[0];
            callback(null,	{
                duration:	leg.duration
            });
        }	else	{
            callback(new	Error("Can'	not	find	direction"));
        }
    });
    directions.setMap(map);
    directions.setOptions( { suppressMarkers: true } );
}




google.maps.event.addDomListener(window,	 'load',	initialize);
exports.removeFromCart = removeFromCart;
exports.addToCart = addToCart;

exports.getPizzaInCart = getPizzaInCart;
exports.initialiseCart = initialiseCart;

exports.PizzaSize = PizzaSize;