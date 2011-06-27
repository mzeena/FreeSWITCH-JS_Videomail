console_log(" >>>>>>>>>>>>>>>>>>> USING INC TEST SETTINGS <<<<<<<<<<<<<<<<<<<<<<<< \n");
   
   // Freeswitch Style
   var vmMessageDir = "/var/spool/freeswitch";
   var vmAccount = session.caller_id_num;
   
   fsLogger("session.caller_ani",session.caller_ani);
   fsLogger("session.caller_ani2",session.caller_ani2);
   fsLogger("session.caller_id_name",session.caller_id_name);
   fsLogger("session.caller_id_num",session.caller_id_num);
   fsLogger("session.destination",session.destination);
   fsLogger("session.name",session.name);
   fsLogger("session.state",session.state);
