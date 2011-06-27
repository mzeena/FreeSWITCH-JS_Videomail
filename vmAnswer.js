 // * vmAnswer.js
 // * A mod by M. Zeena which is
 // * Based on a script by Joshua Engelbrecht which was
 // * Based on Mike B. Murdock script which was
 // * Based on original samples by Anthony Minessale II
 // * Revision: 06-06-2011
 //
 // * Version: MPL 1.1
 // *
 // * The contents of this file are subject to the Mozilla Public License Version
 // * 1.1 (the "License"); you may not use this file except in compliance with
 // * the License. You may obtain a copy of the License at
 // * http://www.mozilla.org/MPL/
 // *
 // * Software distributed under the License is distributed on an "AS IS" basis,
 // * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 // * for the specific language governing rights and limitations under the
 // * License.
 // *
  
 include("inc_vmAnswer.js");
 include("inc_logger.js");
  
 use("TeleTone");
  
 // Note: this script uses mod_spidermonkey_etpan which must be compiled and loaded.
 // Additionally, it requires sendmail be setup and configured on your server.
  
 // uncomment next two lines if you want email notifications (NOT POSSIBLE FOR VIDEO, SORRY)
 // var eMailFrom = "you@domain.org"; // Where are your emails coming from
 // var eMailTo = "you@domain.org"; // List email addresses to send message to. Separate multiples with comma.
  
 // Caller Name and Number will be attached
 var eMailSubject = "Voicemail from ";
 // Text of email body
 var eMailBody = "New voicemail attached.\n";
  
 // Uncomment next line to send a notification without a file attachment. Usually cell phone notification.
 // var Pager_eMailTo = "123456789@mobile.net";
  
 // location of voicemail files. In a high performance app this might be a ram drive.
 var vmDir = new File("/var/spool/freeswitch"); // should not end in slash
  
 // find account number
 var vmAccount = session.destination;
 // test for account folder;
 var dir = new File(vmDir + "/" + vmAccount);
  
 // make sure that the user has a directory if not create
 if(!dir.isDirectory){
     vmDir.mkdir(vmAccount);
 }
  
 // where the greeting is each user must have their own greeting
 var vMailGreetingFile = dir + "/" + "greeting.fsv";
  
 //var BONG = "v=4000;>=0;+=2;#(60,0);v=2000;d(940,0)";
 var BONG = "v=4000;>=0;+=2;#(400,0);";
  
 // Maximum recording length in seconds (240 = 4 minutes should be enough)
 var maxreclen = 240;
  
 // Energy level audio must fall below to be considered silence (300-500 is good starting point)
 var silencethreshold = 500;
  
 // Amount of time in seconds caller must be silent to trigger detector
 var silencehits = 5; // 3 seconds
  
 var allDigits = "";
  
 // If not answered answer the call
 session.answer();
  
 if (session.ready()) {
     // save the session properties for later use in case caller hangs up and we need the data.
     var sv_uuid = session.uuid;
     var sv_ani = session.ani;
     var sv_ani2 = session.ani2;
     var sv_caller_id_name = session.caller_id_name + " ";
     var sv_caller_id_num = session.caller_id_num + " ";
     var sv_destination = session.destination;
     var sv_dialplan = session.dialplan;
     var sv_name = session.name;
     var sv_network_addr = session.network_addr;
     var sv_state = session.state;

 	  // use flite for quickness
 	  session.execute("set", "tts_engine=flite");
 	  session.execute("set", "tts_voice=kal");
         session.execute("sleep","2000");

     fsLogger("Caller ID = " + sv_caller_id_name + "<" + sv_caller_id_num + ">\n");
  
     allDigits = "";
  
     // Play announcement
     var rtn;
     // session.streamFile(file, callback, callback_args, starting_sample_count);
     var vMGF = new File(vMailGreetingFile);
     if(vMGF.isFile) {
        rtn = session.execute("play_fsv", vMailGreetingFile);
     } else {
        session.execute("speak", "Please leave a message after the tone");
     }
     fsLogger("session.execute rtn=[" + rtn + "]");
  
     // verify that the caller is still here
     if (session.ready()) {
  
        // Pause for 1/10th second
        rtn = session.execute("sleep", "100");
  
        // Play bong
        var tts = new TeleTone(session);
        tts.addTone("d", 350.0, 440.0, 0.0);
        tts.generate(BONG);
  
        // Record message
        fsLogger("","Recording message");
        var tmp_Filename = dir + "/" + sv_uuid + ".fsv";
  
        // Caller still here?
        if (session.ready()) {
           var toDate=new Date();
           rtn = session.execute("record_fsv", tmp_Filename);
           fsLogger("", "session.execute rtn=[" + rtn + "]");
  
           // create meta file
           var fd = new File(dir + "/" + sv_uuid + ".meta");
           fsLogger("Creating META file:","START\n");
           fd.open("write,create");
           fd.writeln("callerID="+session.caller_id_num);
           fd.writeln("callerName="+session.caller_id_name);
           fd.writeln("createdDay="+toDate.getDay());
           fd.writeln("createdDate="+toDate.getMonth() + " " + toDate.getDate() + ", " + toDate.getFullYear());
           fd.writeln("createdTime="+toDate.getHours() + ":" + toDate.getMinutes() + ":" + toDate.getSeconds());
           fd.writeln("heard="+"false");
           fd.writeln("markForDeletion="+"false");
           fd.close;
           fsLogger("Creating META file:", "END\n");
  
           // Caller still here?
           if (session.ready()) {
              session.hangup // Hangup
            }
            else {
              fsLogger("","Caller Hungup during record");
            }
  
            // Send notifications
            // uncomment specific function(s) to send notifications
            // emailNotification();
            // send email pager notification
            // sendPageNotification();
        }
     }
  }
