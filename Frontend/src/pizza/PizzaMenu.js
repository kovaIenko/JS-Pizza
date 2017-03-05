/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');
var PizzaCart = require('./PizzaCart');
var Pizza_List = require('../Pizza_List');
var quent=$(".quent");
var API_=require("./../API");


API_.getPizzaList(function (err,data) {
    if(err)
        console.log(Error);
    Pizza_List=data;
    initialiseMenu();

});

//HTML едемент куди будуть додаватися піци
var $pizza_list = $("#pizza_list");
 var $pizza_count=$(".pizza_count");
function showPizzaList(list) {
    //Очищаємо старі піци в кошику
    $pizza_list.html(" ");


    $(".all").click(function () {
        initialiseMenu();
    });
    $(".meat").click(function () {
        filterPizza("meat");
    });
    $(".pineapple").click(function () {
        filterPizza("pineapple");
    });
    $(".mushroom").click(function () {
        filterPizza("mushroom");
    });
    $(".sea").click(function () {
        filterPizza("ocean");
    });
    $(".vega").click(function () {
        filterPizza("Вега піца");
    });



    //Онволення однієї піци
    function showOnePizza(pizza) {
        var html_code = Templates.PizzaMenu_OneItem({pizza: pizza});
        var $node = $(html_code);
        $node.find(".buy-big").click(function(){
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Big);
        });
        $node.find(".buy-small").click(function(){
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Small);
        })
        $pizza_list.append($node);
    }

    list.forEach(showOnePizza);
}

function filterPizza(filter) {
    //Масив куди потраплять піци які треба показати
    var pizza_shown = [];
     var count=0;
    Pizza_List.forEach(function(pizza){
        //можливо буде сповільнєватися, але це все через подвійні цикли(мабуть), можна просто розписати, але
        //це буде без "гарного тону"
        for(p in pizza.content)
            if(p==filter) {
                pizza_shown.push(pizza);
                count++;
            }
            if(filter==pizza.type) {
                pizza_shown.push(pizza);
                count++;
            }
        //TODO: зробити фільтри
    });
      $pizza_count.text(count);
    //Показати відфільтровані піци
    showPizzaList(pizza_shown);

}

function initialiseMenu() {
    showPizzaList(Pizza_List)
}

$(".kg").click(function () {  //кнопка замовити
    window.location.href="/toOrder.html";
});

exports.filterPizza = filterPizza;
exports.initialiseMenu = initialiseMenu;