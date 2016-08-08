/**
 * Created by naveen sai kiran on 01-08-2016.
 */
$(document).ready(function(){
   $("#register_form").submit(function(e){
       e.preventDefault();
       $("#name-warning").hide();
       $("#email-warning").hide();
       $("#password-warning").hide();
       if(document.forms["register_form"]["name"].value == '')
       {
           $("#name-warning").show();
           return;
       }
       if(document.forms["register_form"]["email"].value=='')
       {
           $("#email-warning").show();
           return;
       }
       if(document.forms["register_form"]["password"].value=='')
       {
           $("#password-warning").show();
           return;
       }
       $.post("/quiz/create/",
           {
               name : document.forms["register_form"]["name"].value,
               email : document.forms["register_form"]["email"].value,
               password : document.forms["register_form"]["password"].value,
               csrfmiddlewaretoken :document.forms["register_form"]["csrfmiddlewaretoken"].value
           },
           function(data,status)
           {
               if (status == "success")
               {
                   $("#modal1").modal('hide');
                   $("#register-success").show();
               }
           }
       );
   }) ;
   $("#login_form").submit(function(e){
      // alert("hello");
       e.preventDefault();
       $.post("/quiz/validate_login/",
           {
               username : document.forms["login_form"]["username"].value,
               password : document.forms["login_form"]["password"].value,
               csrfmiddlewaretoken : document.forms["login_form"]["csrfmiddlewaretoken"].value
           },
           function(data,status)
           {
                   window.location.href="/quiz/test";
           }
       );
   });
    $(".add_exam").click(function(){
       $(".glyphicon-plus").toggle();
        $(".glyphicon-arrow-down").toggle();
        $("#show-exam-form").slideToggle();
        });
    function add_questions(exam_id,i)
    {
        $("#exam_list").hide();
        $("#add_questions").show();
        $("#num-question-btn").click(function(){
           $("#add_questions").hide();
           $("#read-questions").show();
            count = $("#question-no").val();
            //alert(count);
                $("#question-form").submit(function (e) {
                    e.preventDefault();
                    $("#icon-span").attr("class","glyphicon glyphicon-ok");
                    $.post("/quiz/add_question/",
                        {
                            question : document.forms["question-form"]["question"].value,
                            option1 : document.forms["question-form"]["option1"].value,
                            option2 : document.forms["question-form"]["option2"].value,
                            option3 : document.forms["question-form"]["option3"].value,
                            option4 : document.forms["question-form"]["option4"].value,
                            answer : document.forms["question-form"]["answer"].value,
                            exam : exam_id,
                            csrfmiddlewaretoken : document.forms["question-form"]["csrfmiddlewaretoken"].value
                        },
                        function(data,success)
                        {
                            document.forms["question-form"]["question"].value = "";
                            document.forms["question-form"]["option1"].value = "";
                            document.forms["question-form"]["option2"].value = "";
                            document.forms["question-form"]["option3"].value = "";
                            document.forms["question-form"]["option4"].value = "";
                            document.forms["question-form"]["answer"].value = "";
                            $("#icon-span").attr("class","glyphicon glyphicon-forward");
                        }
                    );
                    i++;
                    if(i>=count) {
                        $("#read-questions").hide();
                        window.location.reload();
                    }
                });
        });
    }
    $("#exam-form").submit(function(e){
           // alert("helo");
           e.preventDefault();
           $.post("/quiz/add_exam/",
               {
                   exam_name : document.forms["exam-form"]["exam_name"].value,
                   user : document.forms["exam-form"]["user"].value,
                   csrfmiddlewaretoken :document.forms["exam-form"]["csrfmiddlewaretoken"].value
               },
               function(data,status)
               {
                   //alert(data);
                    $("#exam_list").append(template(document.forms["exam-form"]["user"].value,document.forms["exam-form"]["exam_name"].value));
                   $(".add_exam").click();
                   document.forms["exam-form"]["exam_name"].value = "";
                   add_questions(data,0);
               }
           );
    });
    function show_result(count,total)
    {
        $("#count").text(count);
        $("#total").text(total);
        $("#score").slideDown();
    }
    $(".exit-btn").click(function(){
        window.location.reload();
    });
    function test(data,count)
    {
        j = 1;
        $(".select-option").click(function(){
			$(".glyphicon-ok").attr("class","glyphicon glyphicon-unchecked col-sm-offset-1");
			$(this).find(".glyphicon").attr("class","glyphicon glyphicon-ok col-sm-offset-1");
            $("#option-answer").val($(this).find(".option").text());
		});
        $("#verify").click(function(){
           $(".before").hide();
            $(".after").show();
            if($("#option-answer").val() == data[j-1].answer)
            {
                $(".after-ok").show();
            }
            else{
                $(".after-not-ok").show();
            }
        });
        $("#after").click(function(){
            if($("#option-answer").val() == data[j-1].answer)
                count++;
            if(j >= data.length)
            {
                $(".after").hide();
                $(".after-ok").hide();
                $(".after-not-ok").hide();
                $(".glyphicon-ok").attr("class","glyphicon glyphicon-unchecked col-sm-offset-1");
            $   (".before").show();
                $("#question-display").hide();
                show_result(count,data.length);
                return;
            }
            $(".question-place").html(data[j].question);
            $(".option1-place").html(data[j].option1);
            $(".option2-place").html(data[j].option2);
            $(".option3-place").html(data[j].option3);
            $(".option4-place").html(data[j].option4);
            $(".after").hide();
            $(".after-ok").hide();
            $(".after-not-ok").hide();
            $(".glyphicon-ok").attr("class","glyphicon glyphicon-unchecked col-sm-offset-1");
            $(".before").show();
            j++;
        });
    }
    $("#exam_list").on('click','.exam-panel',function(){
            $("#exam_list").hide();
            exam_id = $(this).find(".exam_template").attr('id');
            $.get("/quiz/api/question/",function(data,status){
                var i;
               // alert("hello");
                data2 = [];
               for(i=0;i<data.length;i++)
               {
                   if(data[i].exam == exam_id)
                   {
                       //console.log(data[i].exam+' '+exam_id);
                       data2.push(data[i]);
                   }
               }
                i=0;
                //alert(data);
                data = data2;
                //console.log(data.length);
                if (data.length == 0 ) {
                    $("#no-questions").show();
                    return;
                }
                $("#question-display").show();
                //alert(questions);
                $(".question-place").html(data[i].question);
                $(".option1-place").html(data[i].option1);
                $(".option2-place").html(data[i].option2);
                $(".option3-place").html(data[i].option3);
                $(".option4-place").html(data[i].option4);
                test(data,0);
            });
    });
        
    
});
