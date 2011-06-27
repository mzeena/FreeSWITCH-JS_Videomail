 // * inc_vmListen.js
   function validateNull(thisString) {
       if ((thisString == null) || (thisString == "")) {
           return "No Data";
       }
       return thisString;
   }
   
   function menu_dtmf(type, digits, arg) {
      if (type == "dtmf") {
          if (digits == "3") {
              return digits;
          }
          if (digits == "1") {
              return digits;
          }
          if (digits == "2") {
              return digits;
          }
          if (digits == "*") {
              return "hangup";
          }
      }
      return(true);
   }
   
   function play_dtmf(type, digits, arg) {
   
      if (type == "dtmf") {
          if (digits == "3") {
              return false;
          }
          if (digits == "1") {
              return "seek:-5000";
          }
          if (digits == "5") {
              return "pause";
          }
          if (digits == "*") {
              return "hangup";
          }
      }
      return(true); // return false to cause playback to stop
   }
   
   function getNumNewMessages(dir) {
       if (dir.isDirectory) {
           var dirContent = dir.list();
           var numMessages = dirContent.length;
   
           fsLogger("",dir.name + " is a directory");
           fsLogger("","number of " + numMessages);
   
           for (i = 0; i < numMessages; i++) {
   
               var contentFile = dirContent[i];
               var fsvFile = contentFile.name;
               var fileName = fsvFile.substring(fsvFile.lastIndexOf("/"));
   
               fsLogger(i +" FSV File ", fsvFile);
               fsLogger(i +" FILE ", fileName);
               fsLogger(i +" DATE ", contentFile.creationTime);
           }
           return numMessages;
       } else {
           fsLogger("", dir.name + " is NOT a directory");
           return 0;
       }
   }
   
   function messageDelete(vmAccount,fileName) {
       var delFile = File(vmMessageDir + "/" + vmAccount + "/" + fileName + ".fsv");
       delFile.remove();
       var delFile = File(vmMessageDir + "/" + vmAccount + "/" + fileName + ".meta");
       delFile.remove();
       session.execute("speak", "this message has been deleted");
   }
   
   function messageHeard(metaObj) {
       var metaFile = new File(vmMessageDir + "/" + vmAccount +"/" + fileName + ".meta");
       if (metaFile.exists) {
           metaFile.remove();
       }
       metaFile.open("write,create");
       metaFile.writeln("callerID="+metaObj.callerID);
       metaFile.writeln("callerName="+metaObj.callerName);
       metaFile.writeln("createdDay="+metaObj.createdDay);
       metaFile.writeln("createdDate="+metaObj.createdDate);
       metaFile.writeln("createdTime="+metaObj.createdTime);
       metaFile.writeln("heard="+"true");
       metaFile.writeln("markForDeletion="+metaObj.markForDeletion);
       metaFile.close;
   }
   
   function messagePlay(vmAccount,fileName) {
       var vmMessageFSV = fileName + ".fsv";
       session.execute("speak", "NowPlaying" + i+1);
       session.execute("play_fsv", vmMessageDir + "/" + vmAccount + "/" +  vmMessageFSV, play_dtmf, "", 0);
       fsLogger(i +" FILE ", fileName);
   }
   
   function metaFileRead(vmAccount,fileName) {
       var metaFile = new File(vmMessageDir + "/" + vmAccount +"/" + fileName + ".meta");
       metaFile.open("read");
       var metaObj = new Object();
       var tmpString = metaFile.readln();
       metaObj.callerID = tmpString.substring(tmpString.lastIndexOf("=") +1);
       tmpString = metaFile.readln();
       metaObj.callerName = tmpString.substring(tmpString.lastIndexOf("=") +1);
       tmpString = metaFile.readln();
       metaObj.createdDay = tmpString.substring(tmpString.lastIndexOf("=") +1);
       tmpString = metaFile.readln();
       metaObj.createdDate = tmpString.substring(tmpString.lastIndexOf("=") +1);
       tmpString = metaFile.readln();
       metaObj.createdTime = tmpString.substring(tmpString.lastIndexOf("=") +1);
       tmpString = metaFile.readln();
       metaObj.heard = tmpString.substring(tmpString.lastIndexOf("=") +1);
       tmpString = metaFile.readln();
       metaObj.markForDeletion = tmpString.substring(tmpString.lastIndexOf("=") +1);
       metaFile.close();
       fsLogger("metaObj",metaObj);
       return metaObj;
   }
   
   function metaFileWrite(vmAccount,fileName,metaObj) {
       var metaFile = new File(vmMessageDir + "/" + vmAccount +"/" + fileName + ".meta");
       if (metaFile.exists) {
           metaFile.remove();
       }
       metaFile.open("write,create");
       metaFile.writeln("callerID="+session.caller_id_num);
       metaFile.writeln("callerName="+session.caller_id_name);
       metaFile.writeln("createdDay="+toDate.getDay());
       metaFile.writeln("createdDate="+toDate.getMonth() + " " + toDate.getDate() + ", " + toDate.getFullYear());
       metaFile.writeln("createdTime="+toDate.getHours() + ":" + toDate.getMinutes() + ":" + toDate.getSeconds());
       metaFile.writeln("heard="+"false");
       metaFile.writeln("markForDeletion="+"false");
       metaFile.close;
   }
   
   function messagePlay(vmAccount,fileName) {
       var vmMessageFSV = fileName + ".fsv";
       session.execute("speak", "NowPlaying" + i+1);
       session.execute("play_fsv", vmMessageDir + "/" + vmAccount + "/" +  vmMessageFSV, play_dtmf, "", 0);
       fsLogger(i +" FILE ", fileName);
   }
   
   function metaFileRead(vmAccount,fileName) {
       var metaFile = new File(vmMessageDir + "/" + vmAccount +"/" + fileName + ".meta");
       metaFile.open("read");
       var metaObj = new Object();
       var tmpString = metaFile.readln();
       metaObj.callerID = tmpString.substring(tmpString.lastIndexOf("=") +1);
       tmpString = metaFile.readln();
       metaObj.callerName = tmpString.substring(tmpString.lastIndexOf("=") +1);
       tmpString = metaFile.readln();
       metaObj.createdDay = tmpString.substring(tmpString.lastIndexOf("=") +1);
       tmpString = metaFile.readln();
       metaObj.createdDate = tmpString.substring(tmpString.lastIndexOf("=") +1);
       tmpString = metaFile.readln();
       metaObj.createdTime = tmpString.substring(tmpString.lastIndexOf("=") +1);
       tmpString = metaFile.readln();
       metaObj.heard = tmpString.substring(tmpString.lastIndexOf("=") +1);
       tmpString = metaFile.readln();
       metaObj.markForDeletion = tmpString.substring(tmpString.lastIndexOf("=") +1);
       metaFile.close();
       fsLogger("metaObj",metaObj);
       return metaObj;
   }
   
   function metaFileWrite(vmAccount,fileName,metaObj) {
       var metaFile = new File(vmMessageDir + "/" + vmAccount +"/" + fileName + ".meta");
       if (metaFile.exists) {
           metaFile.remove();
       }
       metaFile.open("write,create");
       metaFile.writeln("callerID="+session.caller_id_num);
       metaFile.writeln("callerName="+session.caller_id_name);
       metaFile.writeln("createdDay="+toDate.getDay());
       metaFile.writeln("createdDate="+toDate.getMonth() + " " + toDate.getDate() + ", " + toDate.getFullYear());
       metaFile.writeln("createdTime="+toDate.getHours() + ":" + toDate.getMinutes() + ":" + toDate.getSeconds());
       metaFile.writeln("heard="+"false");
       metaFile.writeln("markForDeletion="+"false");
       metaFile.close;
   }
