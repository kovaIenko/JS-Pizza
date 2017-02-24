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