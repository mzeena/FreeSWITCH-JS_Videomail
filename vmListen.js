 // * vmListen.js
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

  include("inc_logger.js");           // the logging functions
  include("inc_vmListen.js");         // loading functions
  include("inc_settings_test.js");
  
  var result = "";
  
  if (session.ready()) {
      session.answer();
      // use flite for quickness
      session.execute("set", "tts_engine=flite");
      session.execute("set", "tts_voice=kal");

      session.execute("sleep","2000");
      session.execute("speak", "Welcome to the freeswitch videomail demo application");
       
      // OPTIONAL - Prompt for user ID & PIN & Authorize Playback
      // session.execute("speak", "Please enter your 4 digits ID");
      // vmAccount = session.getDigits(4, "", 6000); /* Get 4 digits waiting 6 seconds*/
      // vmpass = apiExecute ("user_data", vmAccount + " param vm-password");
      // session.execute("speak", "Please enter your 4 digits PIN");
      // pin = session.getDigits(4, "", 8000); /* Get 4 digits waiting 8 seconds*/
      // if (pin == vmpass ) { $auth = "1";} else { session.execute("speak", "Wrong PIN"); session.hangup(); exit(); }
  
      var dir = new File(vmMessageDir + "/" + vmAccount);
  
      var numNewMessages = 0;
      var numOldMessages = 0;
      var currentNewNum = 0;
      var currentOldNum = 0;
      var newMessagesArray = new Array();
      var oldMessagesArray = new Array();
  
  // Reads the voicemail directory and sorts messages
  
      if (dir.isDirectory) {
          var dirContent = dir.list();
          var numFiles = dirContent.length;
  
          for (i = 0; i < numFiles; i++) {
              var contentFile = dirContent[i];
              var strThisFile = contentFile.name;
              var fileName = strThisFile.substring(strThisFile.lastIndexOf("/"),strThisFile.lastIndexOf("."));
              var fileSuffix = strThisFile.substring(strThisFile.lastIndexOf("."));
              fsLogger(i +" FILE ", fileName);
              fsLogger(i +" DATE ", contentFile.creationTime);
              fsLogger("fileSuffix", fileSuffix);
              if (fileSuffix == ".meta") {
                  var infoObj = metaFileRead(vmAccount,fileName);
                  fsLogger("infoObj.heard",infoObj.heard);
                  if (infoObj.heard == "true") {
                      oldMessagesArray[numOldMessages] = fileName;
                      numOldMessages++;
                  } else {
                      newMessagesArray[numNewMessages] = fileName;
                      numNewMessages++;
                  }
              }
          }
      } else {
          fsLogger("", dir.name + " is NOT a directory");
          session.execute("speak", "No directory was found for this account ");
      }
  

  // Playback for NEW Messages
  
      if (numNewMessages > 0) {
          session.execute("speak", "You have" + numNewMessages + "New messages");
          while (currentNewNum < numNewMessages) {
              var fileName = newMessagesArray[currentNewNum];
              var vmMessageMeta = fileName + ".meta";
              var infoObj = metaFileRead(vmAccount,fileName);
              currentNewNum++;
              dtmf = session.execute("speak", "Video Message " + currentNewNum + " Recieved on " + infoObj.createdDate + " at " + infoObj.createdTime
                 + " from " + validateNull(infoObj.callerName) + ", press 1 to play,  2 to skip,  3 to delete  ", menu_dtmf, "");
              session.execute("sleep","2000");
              if (dtmf == "1") {
                  messagePlay(vmAccount,fileName);
                  messageHeard(infoObj);
              }
              if (dtmf == "2") {
                  session.execute("speak", "Skipping this message ");
              }
              if (dtmf == "3") {
                  messageDelete(vmAccount,fileName);
              }
          }
          session.execute("speak", "No more New Messages ");
      } else {
          session.execute("speak", "No New Messages ");
      }
  
  // Playback for Old Messages
  
      if (numOldMessages > 0) {
          session.execute("speak", "You have" + numOldMessages + "Old messages");
          while (currentOldNum < numOldMessages) {
              var fileName = oldMessagesArray[currentOldNum];
              var vmMessageMeta = fileName + ".meta";
              var infoObj = metaFileRead(vmAccount,fileName);
  
              currentOldNum++;
              dtmf = session.execute("speak", "Video Message " + currentOldNum + " recieved on " + infoObj.createdDate + " at " + infoObj.createdTime
                 + " from " + validateNull(infoObj.callerName) + " press 1 to play,  2 to skip,  3 to delete  ", menu_dtmf, "");
              session.execute("sleep","2000");
              if (dtmf == "1") {
                  messagePlay(vmAccount,fileName);
              }
              if (dtmf == "2") {
                  session.execute("speak", "Skipping message ");
              }
              if (dtmf == "3") {
                  messageDelete(vmAccount,fileName);
              }
              session.execute("sleep","2000");
          }
          session.execute("speak", "No more old messages ");
      } else {
          session.execute("speak", "No old messages ", "en");
      }
  
      session.execute("sleep","1000");
      session.execute("speak", "Thank You for using FreeSwitch");
      session.execute("sleep","1000");
      session.execute("speak", "Good bye");
      session.hangup;
  }
