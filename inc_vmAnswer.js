// * inc_vmAnswer.js
   function on_dtmf(type, digits, arg)
   {
       if (digits == "#") {
           return allDigits;
       }
   
       if (digits == "*") {
           return "hangup";
       }
   
       console_log("digit: " + digits + "\n");
       allDigits += digits;
       return(allDigits);
   }
   
   function emailNotification() {
      if (eMailTo != "") {
         console_log(">>>>>>>>>>>>>>>>>>>>>>>>>>>> Sending Email\n");
         var tmp_eMailSubject = eMailSubject + sv_caller_id_name + " (" + sv_caller_id_num + ")";
         email(eMailFrom, eMailTo, "Subject: " + tmp_eMailSubject, eMailBody, tmp_Filename);
   
         // construct the email notification to cell phone gateway - no file attached
         if (Pager_eMailTo != "") {
            email(eMailFrom, Pager_eMailTo, "Subject: " + tmp_eMailSubject, tmp_eMailSubject);
         }
      }
   }
   
   function sendPageNotification() {
      if (Pager_eMailTo != "") {
         console_log(">>>>>>>>>>>>>>>>>>>>>>>>>>>> Sending Page\n");
         email(eMailFrom, Pager_eMailTo, "Subject: " + tmp_eMailSubject, tmp_eMailSubject);
      }
   }
