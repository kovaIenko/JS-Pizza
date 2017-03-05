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
var API_=require("./../API");

//Змінна в якій зберігаються перелік піц в кошику
var Cart = [];


$(".next").click(function () {
    API_.createOrder(Cart,function (err,temp,data) {
        if(err)
            console.log("Error");
        console.log("Success")
    })

});

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
var adress_feedback=$(".adress_");
var adress_input=$("#inputAdress");


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

$(".next").click(function () {
    var name = name_input.val();
    var phone = phone_input.val();
    var address = adress_input.val();
    alert(name);
    var data = {
        Cart: Cart,
        name: name,
        phone: phone,
        address: address
    };

    if (nextConfirm&&nextConfirm1&&nextConfirm2) {
        API_.createOrder(data, function (err, data) {
            if (err)
                console.log("Error")
            else
                console.log("Success");
        });
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

$("#inputAdress").keyup(function () {
    var adressArr = $("#inputAdress").val();
    if(adressArr==""){
        nextConfirm2=false;
        adress_feedback.css("display","block");
        adress_feedback.text("The adress field cannot be empty");
    }
    for(var i=0;i<adressArr.length;i++)
    {

        if((adressArr.charAt(i)!='.'&&adressArr.charAt(i)!=','&&adressArr.charAt(i)!=' ')&&
            (adressArr.charAt(i)<'Є'||adressArr.charAt(i)>'ї')&&(adressArr.charAt(i)<'0'||adressArr.charAt(i)>'9'))
        {
            adress_feedback.css("display","block");
            adress_feedback.text("The adress field cannot have a symbols");

            break;
        }
        else
        {
            nextConfirm2=true;
            adress_feedback.css("display","none");
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







exports.removeFromCart = removeFromCart;
exports.addToCart = addToCart;

exports.getPizzaInCart = getPizzaInCart;
exports.initialiseCart = initialiseCart;

exports.PizzaSize = PizzaSize;