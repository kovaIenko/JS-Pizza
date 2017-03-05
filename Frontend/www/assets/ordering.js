/**
 * Created by Ruslan on 02.03.2017.
 */



var nextConfirm=true;
var name_feedback=$(".name_");
var name_input=$("#inputName");
var phone_feedBack=$(".phoneNumber_");
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

    if(nameArr.charAt(i)<'Є'||nameArr.charAt(i)>'ї')
      {
          name_feedback.css("display","block");
          name_feedback.text("The field cannot have a number or  symbol");
          nextConfirm=false;
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

$("#inputPhone").keyup(function () {
    var phoneArr = $("#inputPhone").val();
   // alert(phoneArr);
    if(phoneArr==""){
        nextConfirm=false;
        phone_feedBack.css("display","block");
        phone_feedBack.text("The phone field cannot be empty");
    }

    for(var i=0;i<phoneArr.length;i++)
    {

        if((phoneArr.charAt(i)<'0'||phoneArr.charAt(i)>'9')&&phoneArr.charAt(i)!='+')
        {
            phone_feedBack.css("display","block");
            phone_feedBack.text("The phone field should be only a number");
            nextConfirm=false;
            break;
        }
        else
        {
            nextConfirm=true;
            phone_feedback.css("display","none");
            //  break;
        }
    }
});

$("#inputAdress").keyup(function () {
    var adressArr = $("#inputAdress").val();
    if(adressArr==""){
        nextConfirm=false;
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
            nextConfirm=false;
            break;
        }
        else
        {
            nextConfirm=true;
            adress_feedback.css("display","none");
            //  break;
        }
    }
});



