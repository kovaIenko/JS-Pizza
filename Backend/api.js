/**
 * Created by chaika on 09.02.16.
 */
var Pizza_List = require('./data/Pizza_List');
var LIQPAY_PUBLIC_KEY = 'i75886741382';
var LIQPAY_PRIVATE_KEY = 'jUg2ifCXdnp2cuuRCeyQeFK6VCx0ynesoVW6DKtG';
exports.getPizzaList = function(req, res) {
    res.send(Pizza_List);
};

function	base64(str)	 {
    return	new	Buffer(str).toString('base64');
};

var crypto	=	require('crypto');
function	sha1(string)	{
    var sha1	=	crypto.createHash('sha1');
    sha1.update(string);
    return	sha1.digest('base64');
};

exports.createOrder = function(req, res) {
    var dataInput	=	req.body;
    var amount=0;
    var allPizzas="";
    for(var i=0;i<dataInput.Cart.length;i++){
        amount += (dataInput.Cart[i].pizza[dataInput.Cart[i].size].price) * dataInput.Cart[i].quantity;
        allPizzas+=dataInput.Cart[i].quantity+"шт. ["+dataInput.Cart[i].size+"] "+dataInput.Cart[i].pizza.title+";\n  "
    }
    var order	=	{
        version:	3,
        public_key:	LIQPAY_PUBLIC_KEY,
        action:	"pay",
        amount:	amount,
        currency:	"UAH",
        description:	"Замовлення піци: "+dataInput.name+
       " Адреса доставки: " +dataInput.address+
    " Телефон: " +dataInput.phone+
    " Замовлення: "+ allPizzas+". Разом "+ amount+".",
        order_id:	Math.random(),
        //!!!Важливо щоб було 1,	бо інакше візьме гроші!!!
        sandbox:	1
    };


    var data	=	base64(JSON.stringify(order));
    var signature	=	sha1(LIQPAY_PRIVATE_KEY	+data+	LIQPAY_PRIVATE_KEY);

    res.send({
        success: true,
        data: data,
        signature: signature
    });
};