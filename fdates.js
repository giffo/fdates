/**
 * FriendlyDates by giffo, written back in 2009 or 2010
 *
 * take in timestamp or formatted date - produces friendly readable dates (aimed for the following):
 * 22:12pm (5 minutes ago)
 * 5:32pm (4 hours ago)
 * 3:10am (An hour ago)
 * Monday 11th June 2:01pm (Yesterday)
 * Thursday 7th June 6:23am (5 days ago)
 * 22nd March (3 months ago)
 * 2011 25th Dec (7 months ago)
 * 2004 1st March (8 years ago)
 *
 *
 * does not take into account if a date is in the future, maybe i'll write future dates in the future
 *
 *
 * friendlyDate($(".timestamp").html())
 * and
 * friendlyDate($(".timestamp").html(),false)
 */

/**
 * dateString is the time,
 * ago:boolean is the "(2 minutes ago)" part
 * compareDate: Date object, something to anchor it to, is not defined then use Now.
 */

var friendlyDate, fDate = friendlyDate = function(dateString, ago /* default true */, compareDate /* Date object */){


    ago = ago || true;

    // parse/validate Date

    if(dateString === "undefined") {
        return "Date Unknown";
    }

    // if in milliseconds convert to "long"
    var rENum = new RegExp("^[0-9]*$");
    if(rENum.exec(dateString)) {
        dateString = parseInt(dateString, 10);
    }


    var fTime = new Date(dateString);

    if(fTime.toString() === "Invalid Date")
        return dateString || "Date Invalid";

    var nowTime = compareDate || new Date();
	
	
    

    var months = ["Jan","Feb","March","April", "May", "June", "July", "Aug", "Sept","Oct","Nov","Dec"];
    var days = ["Sunday","Monday","Tuesday", "Wednesday","Thursday","Friday","Saturday"];

    function padZeros(o) {return o<10?'0'+o:o;};
    function ampm(h) {return h<12?'am':'pm';}; // determines am or pm
    function pmHours(h){return h>12?(h-12):h}; // converts 24 hours to 12 hours, am or pm

    var dateArr = [fTime.getFullYear(), fTime.getMonth(), fTime.getDate(), fTime.getHours(), fTime.getMinutes()];
    var thisYear = nowTime.getFullYear();


	// returns the ordinal suffix of any number, useful for dates
	// taken from my old jquery-my-functions.js
	function numberSuffix(n) {
		n=""+n;
		if(endsWith(n,"1") && !endsWith(n,"11")) {return "st";}
		if(endsWith(n,"2") && !endsWith(n,"12")) {return "nd";}
		if(endsWith(n,"3") && !endsWith(n,"13")) {return "rd";}
		return "th";
	}

	function endsWith(n, s) {
		return (n.match(s+"$")==s);
	}


    var fString = "";
    if(thisYear !== dateArr[0]) {
        fString = dateArr[0]+" ";
    } else if(nowTime.getMonth() === dateArr[1]) {
        fString = days[fTime.getDay()];
    }


    // is current day
    if((nowTime.getTime()-fTime.getTime())<86400000) {
        fString = ""+pmHours(dateArr[3])+":"+padZeros(dateArr[4])+ampm(dateArr[3]);
    } else {
        fString+=" "+dateArr[2]+numberSuffix(dateArr[2]);
        fString+=" "+months[dateArr[1]];


        //is current week
        if((nowTime.getTime()-fTime.getTime())<604800000) {
            fString+=" "+pmHours(dateArr[3])+":"+padZeros(dateArr[4])+ampm(dateArr[3]);
        }

    }

    function howLongAgo(dArr) {
        var inSecs = {
            s:1,
            m:60,
            h:60*60,
            d:60*60*24,
            w:60*60*24*7,
            mo:60*60*24*31,
            y:364*60*60*24
        };

        // 2015 change
        inSecs = {
            s:1,
            m:60,
            h:3600,
            d:86400,
            w:604800,
            mo:2678400, /* using 31 days */
            y:31449600
        }

        // [Friendly Time Message,lessThanThisTime,number to divide by to get number of units to unit in message]
        // [message, limit, unit divide]
        var longAgo = [['Just now',inSecs.m,inSecs.s],
            ['A minute ago',inSecs.m*2,1],
            ['{x} minutes ago',inSecs.h,inSecs.m],
            ['An hour ago',inSecs.h*2,1],
            ['{x} hours ago',inSecs.d,inSecs.h],
            ['Yesterday',inSecs.d*2,inSecs.d],
            ['{x} days ago',inSecs.w,inSecs.d],
            ['Last week',inSecs.w*2,1],
            ['{x} weeks ago',inSecs.mo,inSecs.w],
			['Last month',inSecs.mo*2,1],
            ['{x} months ago',inSecs.y,inSecs.mo],
            ['Last year',inSecs.y,1],
            ['{x} years ago',inSecs.y*100,inSecs.y]];


        var nowSeconds = nowTime.getTime()/1000;
        var thisTime = fTime.getTime()/1000;
        var timeDiff = Math.round(nowSeconds - thisTime);

        var xTime = "";
		//console.log(timeDiff);

		if(timeDiff < 0)
			return " (Future Date)";

        for(var i=0;i<longAgo.length;i++) {
            if(timeDiff > longAgo[i][1]) {
                    // to the fooooture!
            } else {
                xTime = ""+longAgo[i][0];
                if(longAgo[i][2] != 1)
                    xTime = xTime.replace("{x}", Math.round(timeDiff/longAgo[i][2]));
                    break;
            }
        }
        return (xTime.trim().length === 0)?"":" ("+xTime+")";
    }

    return fString+((!ago)?"":howLongAgo(dateArr));
};
