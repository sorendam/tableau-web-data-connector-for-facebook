var APP_ID = '1028645180580861'; //Facebook APP ID
var LIMIT = 100; //Number of records to bring back at any time - MAX 100
var BASEURL = 'https://www.sorendam.com/tableau/facebook/'; //base url of virtual directory
var CONNECTION_NAME = 'Facebook page insight';
var START_DAY = 1293840000; // 01/01/2011 // note there is a bug with this currently. Need to check up on this...
var today = new Date();
var SINCE_DAY = Math.floor(today.setDate(today.getDate() - 90) / 1000); // TODAY / right now
//var START_DAY = 1449878400 // 12/12/2015
window.fbAsyncInit = function() {
    FB.init({
        appId: APP_ID, // Tableau Facebook APP ID
        channelUrl: BASEURL + 'channel.html', // Channel File
        status: true, // check login status
        cookie: true, // enable cookies to allow the server to access the session
        xfbml: true // parse XFBML
    });
    FB.getLoginStatus(function(response) {
        var loginButton = "<img src='img/log-in-with-facebook.png' alt='log in with Facebook' style='cursor:pointer; height: 46px;'' onclick='login();' />";
        if (response.status === 'connected') {
            getUserInfo();
            document.getElementById("message").innerHTML += "Connected to Facebook";
            //SUCCESS
        } else if (response.status === 'not_authorized') {
            document.getElementById("message").innerHTML += "Failed to Connect";
            document.getElementById("status").innerHTML = loginButton;
            //FAILED
        } else {
            document.getElementById("message").innerHTML += "Logged Out";
            document.getElementById("status").innerHTML = loginButton;
            //UNKNOWN ERROR
        }
    });
};

//Facbook Login on Single Page as Tableau does not allow popups
function login() {
    var uri = window.location.href;
    window.top.location = encodeURI("https://www.facebook.com/dialog/oauth?client_id=" + APP_ID + "&redirect_uri=" + uri + "&response_type=token&scope=business_management,manage_pages,read_insights");
}

function logout() {
    FB.logout(function(response) {
        document.location.reload();
    });
}

function getUserInfo() {
    FB.api('/me', function(response) {
        var str = "Connected to Facebook as " + response.name;
        document.getElementById("message").innerHTML = str;

        str += "<input class='btn' type='button' value='Select All'  onclick='toggle();'/></br></br>";
        document.getElementById("status").innerHTML = "";
        getAccounts(); //get user's accounts i.e. pages that they are authorised for
    });
}
//selects all checkboxes
function toggle() {
    checkboxes = document.getElementsByName('check');
    for (var i = 0, n = checkboxes.length; i < n; i++) {
        checkboxes[i].checked = true;
    }
}
//get user's account information
function getAccounts() {
    FB.api('/me/accounts?fields=name,access_token,id,picture', function(response) {
        // todo chec if this is working
        if (response.data.length === 0) {
            var notAuthorized = "You must be assigned a Page Role for at least one Facebook Page to use this connector" + " " + "</br></br>";
            document.getElementById("status").innerHTML += notAuthorized;
            return;
        }
        for (i = 0; i < response.data.length; i++) {
            var page_id = response.data[i].id;
            var PageImageUrl = response.data[i].picture.data.url;

            var checkbox = "<input type=\"checkbox\" name=\"check\" size value=\"" + page_id + "\" id=\"page-" + page_id + "\"><label for=\"page-" + page_id + "\"><img class=\"fb-image\" src=\"" + PageImageUrl + "\"alt=\"Failed To Retrieve Facebook Image\"><span class=\"fb-name\">" + response.data[i].name  + "</span></label>";
            document.getElementById("status").innerHTML += checkbox + '<br />';
        }
        var str = "<input class='btn btn-primary btn-lg' type='button' value='Get Page Insights' onclick='getData(\"" + response.data[0].access_token + "\",\"" + response.data[0].id + "\");'/>";
        document.getElementById("status").innerHTML += str;
    });
}

function getData(access_token, page_id) {
    //get page ids for selected pages
    var page_ids = [];
    var checkboxes = document.getElementsByName('check');
    for (var i = 0, n = checkboxes.length; i < n; i++) {
        if (checkboxes[i].checked)
            page_ids.push(checkboxes[i].value);
    }
    if (page_ids.length < 1) //if no pages have been selected do nothing
    {
        return;
    }
    var strPage = '/?ids=' + page_ids.join(',') + '&fields=username,fan_count,link,name,new_like_count,talking_about_count'; //get page information for all selected pages
    FB.api(strPage, function(page_response) {
        //pageInfo contains page information and access token to access page data
        var pageInfo = {
            'token': access_token,
            'page_response': page_response
        };
        tableau.connectionName = CONNECTION_NAME; // name the data source. This will be the data source name in Tableau
        tableau.connectionData = JSON.stringify(pageInfo); // set pageInfo as the connection data so we can get to it when we fetch the data
        tableau.submit();
    });
}

(function() {
    //Helper function. Returns property if it exists in data object.
    function ifexists(data, property) {
        var str = property.split('.')[0]; //get top level object
        if (data.hasOwnProperty(str)) {
            var strToRet = data[property.split('.')[0]][property.split('.')[1]]; //return second level object
            return strToRet;
        } else {
            return '';
        }
    }
    //Helper function. Builds url for initail search string for each page.
    function buildUrl(pageCount, page_response) {
        var page_ids = Object.getOwnPropertyNames(page_response);
        var next_page = '/' + page_response[page_ids[pageCount - 1]].id + '/insights/' +
            'page_stories,' +
            'page_impressions,' +
            'page_impressions_unique,' +
            'page_impressions_paid,' +
            'page_impressions_paid_unique,' +
            'page_impressions_organic,' +
            'page_impressions_organic_unique,' +
            'page_impressions_viral,' +
            'page_impressions_viral_unique,' +
            'page_engaged_users,' +
            'page_consumptions,' +
            'page_consumptions_unique,' +
            'page_places_checkin_total,' +
            'page_places_checkin_total_unique,' +
            'page_places_checkin_mobile,' +
            'page_places_checkin_mobile_unique,' +
            'page_negative_feedback,' +
            'page_negative_feedback_unique,' +
            'page_fans_online_per_day,' +
            'page_actions_post_reactions_like_total,' +
            'page_actions_post_reactions_love_total,' +
            'page_actions_post_reactions_wow_total,' +
            'page_actions_post_reactions_haha_total,' +
            'page_actions_post_reactions_sorry_total,' +
            'page_actions_post_reactions_anger_total,' +
            'page_fans,' +
            'page_fan_adds,' +
            'page_fan_adds_unique,' +
            'page_fan_removes,' +
            'page_fan_removes_unique,' +
            'page_views_total,' +
            'page_views_logout,' +
            'page_views_logged_in_total,' +
            'page_views_logged_in_unique,' +
            'page_video_views,' +
            'page_video_views_paid,' +
            'page_video_views_organic,' +
            'page_video_views_autoplayed,' +
            'page_video_views_click_to_play,' +
            'page_video_views_unique,' +
            'page_video_repeat_views,' +
            'page_video_complete_views_30s,' +
            'page_video_complete_views_30s_paid,' +
            'page_video_complete_views_30s_organic,' +
            'page_video_complete_views_30s_autoplayed,' +
            'page_video_complete_views_30s_click_to_play,' +
            'page_video_complete_views_30s_unique,' +
            'page_video_complete_views_30s_repeat_views,' +
            'page_posts_impressions,' +
            'page_posts_impressions_unique,' +
            'page_posts_impressions_paid,' +
            'page_posts_impressions_paid_unique,' +
            'page_posts_impressions_organic,' +
            'page_posts_impressions_organic_unique,' +
            'page_posts_impressions_viral,' +
            'page_posts_impressions_viral_unique,' +
            '?since=' + SINCE_DAY;
        return next_page;
    }
    var myConnector = tableau.makeConnector();
    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
        var cols = [{
                id: "page_name",
                alias: "Page Name",
                dataType: tableau.dataTypeEnum.string
            }, {
                id: "page_username",
                alias: "Page Username",
                dataType: tableau.dataTypeEnum.string
            },
            {
                id: "date",
                alias: "Date",
                description: "The Date as reported by Facebook",
                dataType: tableau.dataTypeEnum.date
            },
            {
                id: "page_stories",
                alias: "Page Stories",
                description: "The number of stories created about your Page (Stories)",
                dataType: tableau.dataTypeEnum.int
            },
            {
                id: "page_impressions",
                alias: "Page Impressions",
                description: "The total number of impressions seen of any content associated with your Page",
                dataType: tableau.dataTypeEnum.int
            }, {
                id: "page_impressions_unique",
                alias: "Page Impressions Unique",
                description: "The number of people who have seen any content associated with your Page",
                dataType: tableau.dataTypeEnum.int
            }, {
                id: "page_impressions_paid",
                alias: "Page Impressions Paid",
                description: "The number of impressions of a Sponsored Story or Ad pointing to your Page",
                dataType: tableau.dataTypeEnum.int
            }, {
                id: "page_impressions_paid_unique",
                alias: "Page Impressions Paid Unique",
                description: "Number of people who saw a sponsored story or Ad about your Page",
                dataType: tableau.dataTypeEnum.int
            }, {
                id: "page_impressions_organic",
                alias: "Page Impressions Organic",
                description: "The number of times your posts were seen in News Feed or Ticker or on visits to your Page. These impressions can be Fans or non-Fans",
                dataType: tableau.dataTypeEnum.int
            }, {
                id: "page_impressions_organic_unique",
                alias: "Page Impressions Organic Unique",
                description: "The number of people who visited your Page, or saw your Page or one of its posts in News Feed or Ticker. These impressions can be Fans or non-Fans",
                dataType: tableau.dataTypeEnum.int
            }, {
                id: "page_impressions_viral",
                alias: "Page Impressions Viral",
                description: "The number of impressions of a story published by a friend about your Page. These stories include liking your Page, posting to your Page's Wall, liking, commenting on or sharing one of your Page posts, answering a Question you posted, RSVPing to one of your events, mentioning your Page, phototagging your Page or checking in at your Place",
                dataType: tableau.dataTypeEnum.int
            }, {
                id: "page_impressions_viral_unique",
                alias: "Page Impressions Viral Unique",
                description: "The number of people who saw your Page or one of its posts from a story published by a friend. These stories include liking your Page, posting to your Page's Wall, liking, commenting on or sharing one of your Page posts, answering a Question you posted, RSVPing to one of your events, mentioning your Page, phototagging your Page or checking in at your Place",
                dataType: tableau.dataTypeEnum.int
            },
            {
                id: "page_engaged_users",
                alias: "Page Engaged Users",
                description: "The number of people who engaged with your Page. Engagement includes any click",
                dataType: tableau.dataTypeEnum.int
            }, {
                id: "page_consumptions",
                alias: "Page Consumptions",
                description: "The number of times people clicked on any of your content",
                dataType: tableau.dataTypeEnum.int
            }, {
                id: "page_consumptions_unique",
                alias: "Page Consumptions Unique",
                description: "The number of people who clicked on any of your content",
                dataType: tableau.dataTypeEnum.int
            }, {
                id: "page_places_checkin_total",
                alias: "Page Places Checkin Total",
                description: "The number of times people checked into a place",
                dataType: tableau.dataTypeEnum.int
            }, {
                id: "page_places_checkin_total_unique",
                alias: "Page Places Checkin Total Unique",
                description: "The number of people who checked into a place",
                dataType: tableau.dataTypeEnum.int
            }, {
                id: "page_places_checkin_mobile",
                alias: "Page Places Checkin Mobile",
                description: "The number of times people checked into a place using mobile phones",
                dataType: tableau.dataTypeEnum.int
            }, {
                id: "page_places_checkin_mobile_unique",
                alias: "Page Places Checkin Mobile Unique",
                description: "The number of people who checked into a place using mobile phones",
                dataType: tableau.dataTypeEnum.int
            }, {
                id: "page_negative_feedback",
                alias: "Page Negative Feedback",
                description: "The number of times people took a negative action (e.g., un-liked or hid a post)",
                dataType: tableau.dataTypeEnum.int
            }, {
                id: "page_negative_feedback_unique",
                alias: "Page Negative Feedback Unique",
                description: "The number of people who took a negative action (e.g., un-liked or hid a post)",
                dataType: tableau.dataTypeEnum.int
            }, {
                id: "page_fans_online_per_day",
                alias: "Page Fans Online Per Day",
                description: "The number of your fans who saw any posts on Facebook on a given day",
                dataType: tableau.dataTypeEnum.int
            },
            {
                id: "page_actions_post_reactions_like_total",
                alias: "Page Actions Post Reactions Like Total",
                description: "Daily total post \"like\" reactions of a page",
                dataType: tableau.dataTypeEnum.int
            }, {
                id: "page_actions_post_reactions_love_total",
                alias: "Page Actions Post Reactions Love Total",
                description: "Daily total post \"love\" reactions of a page",
                dataType: tableau.dataTypeEnum.int
            }, {
                id: "page_actions_post_reactions_wow_total",
                alias: "Page Actions Post Reactions Wow Total",
                description: "Daily total post \"wow\" reactions of a page",
                dataType: tableau.dataTypeEnum.int
            }, {
                id: "page_actions_post_reactions_haha_total",
                alias: "Page Actions Post Reactions Haha Total",
                description: "Daily total post \"haha\" reactions of a page",
                dataType: tableau.dataTypeEnum.int
            }, {
                id: "page_actions_post_reactions_sorry_total",
                alias: "Page Actions Post Reactions Sorry Total",
                description: "Daily total post \"sorry\" reactions of a page",
                dataType: tableau.dataTypeEnum.int
            }, {
                id: "page_actions_post_reactions_anger_total",
                alias: "Page Actions Post Reactions Anger Total",
                description: "Daily total post \"anger\" reactions of a page",
                dataType: tableau.dataTypeEnum.int
            },
            {
                id: "page_fans",
                alias: "Page Fans",
                description: "The total number of people who have liked your Page.",
                dataType: tableau.dataTypeEnum.int
            }, {
                id: "page_fan_adds",
                alias: "Page Fan Adds",
                description: "The number of new people who have liked your Page",
                dataType: tableau.dataTypeEnum.int
            }, {
                id: "page_fan_adds_unique",
                alias: "Page Fan Adds Unique",
                description: "The number of new people who have liked your Page",
                dataType: tableau.dataTypeEnum.int
            }, {
                id: "page_fan_removes",
                alias: "Page Fan Removes",
                description: "Unlikes of your Page",
                dataType: tableau.dataTypeEnum.int
            }, {
                id: "page_fan_removes_unique",
                alias: "Page Fan Removes Unique",
                description: "Unlikes of your Page",
                dataType: tableau.dataTypeEnum.int
            },
            {
                id: "page_views_total",
                alias: "Page Views Total",
                description: "The number of times a Page's profile has been viewed by logged in and logged out people",
                dataType: tableau.dataTypeEnum.int
            }, {
                id: "page_views_logout",
                alias: "Page Views Logout",
                description: "The number of times a Page's profile has been viewed by people not logged into Facebook",
                dataType: tableau.dataTypeEnum.int
            }, {
                id: "page_views_logged_in_total",
                alias: "Page Views Logged In Total",
                description: "The number of times a Page’s profile has been viewed by people logged into Facebook",
                dataType: tableau.dataTypeEnum.int
            }, {
                id: "page_views_logged_in_unique",
                alias: "Page Views Logged In Unique",
                description: "The number of people logged into Facebook who have viewed the Page profile",
                dataType: tableau.dataTypeEnum.int
            },
            {
                id: "page_video_views",
                alias: "Page Video Views",
                description: "Total number of times page's videos have been viewed for more than 3 seconds",
                dataType: tableau.dataTypeEnum.int
            }, {
                id: "page_video_views_paid",
                alias: "Page Video Views Paid",
                description: "Total number of times page's promoted videos have been viewed for more than 3 seconds",
                dataType: tableau.dataTypeEnum.int
            }, {
                id: "page_video_views_organic",
                alias: "Page Video Views Organic",
                description: "Total number of times page's videos have been viewed for more than 3 seconds by organic reach",
                dataType: tableau.dataTypeEnum.int
            }, {
                id: "page_video_views_autoplayed",
                alias: "Page Video Views Autoplayed",
                description: "Total number of times page's autoplayed videos have been viewed for more than 3 seconds",
                dataType: tableau.dataTypeEnum.int
            }, {
                id: "page_video_views_click_to_play",
                alias: "Page Video Views Click To Play",
                description: "Total number of times page's videos have been viewed after the user clicks on play for more than 3 seconds",
                dataType: tableau.dataTypeEnum.int
            }, {
                id: "page_video_views_unique",
                alias: "Page Video Views Unique",
                description: "Total number of times page's videos have been played for unique people for more than 3 seconds",
                dataType: tableau.dataTypeEnum.int
            }, {
                id: "page_video_repeat_views",
                alias: "Page Video Repeat Views",
                description: "Total number of times that people replay a page's videos for more than 3 seconds",
                dataType: tableau.dataTypeEnum.int
            }, {
                id: "page_video_complete_views_30s",
                alias: "Page Video Complete Views 30s",
                description: "Total number of times page's videos have been viewed for more than 30 seconds",
                dataType: tableau.dataTypeEnum.int
            }, {
                id: "page_video_complete_views_30s_paid",
                alias: "Page Video Complete Views 30s Paid",
                description: "Total number of times page's promoted videos have been viewed to the end, or for more than 30 seconds",
                dataType: tableau.dataTypeEnum.int
            }, {
                id: "page_video_complete_views_30s_organic",
                alias: "Page Video Complete Views 30s Organic",
                description: "Total number of times page's videos have been viewed to the end, or viewed for more than 30 seconds by organic reach",
                dataType: tableau.dataTypeEnum.int
            }, {
                id: "page_video_complete_views_30s_autoplayed",
                alias: "Page Video Complete Views 30s Autoplayed",
                description: "Total number of times page's autoplayed videos have been viewed to the end, or viewed for more than 30 seconds",
                dataType: tableau.dataTypeEnum.int
            }, {
                id: "page_video_complete_views_30s_click_to_play",
                alias: "Page Video Complete Views 30s Click To Play",
                description: "Total number of times page's videos have been viewed to the end, or viewed after the user clicks on play for more than 30 seconds",
                dataType: tableau.dataTypeEnum.int
            }, {
                id: "page_video_complete_views_30s_unique",
                alias: "Page Video Complete Views 30s Unique",
                description: "Total number of times page's videos have been played for unique people to the end, or viewed for more than 30 seconds",
                dataType: tableau.dataTypeEnum.int
            }, {
                id: "page_video_complete_views_30s_repeat_views",
                alias: "Page Video Complete Views 30s Repeat Views",
                description: "Total number of times that people replay a page's videos to the end, or for more than 30 seconds",
                dataType: tableau.dataTypeEnum.int
            },
            {
                id: "page_posts_impressions",
                alias: "Page Posts Impressions",
                description: "The number of impressions that came from all of your posts",
                dataType: tableau.dataTypeEnum.int
            }, {
                id: "page_posts_impressions_unique",
                alias: "Page Posts Impressions Unique",
                description: "The number of people who saw any of your Page posts",
                dataType: tableau.dataTypeEnum.int
            }, {
                id: "page_posts_impressions_paid",
                alias: "Page Posts Impressions Paid",
                description: "The number of impressions of your Page posts in an Ad or Sponsored Story",
                dataType: tableau.dataTypeEnum.int
            }, {
                id: "page_posts_impressions_paid_unique",
                alias: "Page Posts Impressions Paid Unique",
                description: "The number of people who saw your Page posts in an Ad or Sponsored Story",
                dataType: tableau.dataTypeEnum.int
            }, {
                id: "page_posts_impressions_organic",
                alias: "Page Posts Impressions Organic",
                description: "The number of impressions of your posts in News Feed or Ticker or on your Page",
                dataType: tableau.dataTypeEnum.int
            }, {
                id: "page_posts_impressions_organic_unique",
                alias: "Page Posts Impressions Organic Unique",
                description: "The number of people who saw your Page posts in News Feed or Ticker, or on your Page's Wall",
                dataType: tableau.dataTypeEnum.int
            }, {
                id: "page_posts_impressions_viral",
                alias: "Page Posts Impressions Viral",
                description: "The number of times users saw your posts via stories published by their friends",
                dataType: tableau.dataTypeEnum.int
            }, {
                id: "page_posts_impressions_viral_unique",
                alias: "Page Posts Impressions Viral Unique",
                description: "The number of people who saw your Page posts via a story from a friend",
                dataType: tableau.dataTypeEnum.int
            }
        ];
        var tableSchema = {
            id: "facebook_page_insights",
            alias: "Facebook page insights",
            columns: cols
        };
        schemaCallback([tableSchema]);
    };
    //gets top level data about page
    myConnector.getData = function getData(table, doneCallback) {
        pageInfo = JSON.parse(tableau.connectionData); //includes page response and access token
        var page_response = pageInfo.page_response;
        var page_ids = Object.getOwnPropertyNames(page_response);
        var toRet = [];
        var pageCount;
        for (var i = 0; i < page_ids.length; i++) {
            pageCount = i + 1;
            var initialUrl = buildUrl(pageCount, page_response);
            getFbFeed(table, doneCallback, initialUrl, pageCount);
        }
    };

    function roundDate(timeStamp) {
        timeStamp -= timeStamp % (24 * 60 * 60 * 1000); //subtract amount of time since midnight
        return new Date(timeStamp);
    }

    function getTableauDataObject(tableData, data) {
        return tableData.filter(function(obj) {
            return obj.unix_date === data[ii].values[jj].end_time;
        })[0];
    }

    function getFbFeed(table, doneCallback, next_page, pageCount) {
        pageInfo = JSON.parse(tableau.connectionData); //includes page response and access token
        var page_response = pageInfo.page_response;
        var page_ids = Object.getOwnPropertyNames(page_response);
        var toRet = [];

        FB.api(next_page,
          'GET',
          {
              access_token: pageInfo.token,
              date_format: 'U', //set time format to unicode so that it works with Tableau
              limit:LIMIT
          },
          function(feed_response) {
            //callback loop
            var data = feed_response.data;

            if (Array.isArray(data) && data.length) {
                var tableData = [];
                var endThisNow = false;
                for (ii = 0; ii < data.length; ++ii) {
                    if (data[ii].period != "day" && data[ii].period != "lifetime") {
                        continue;
                    }
                    var tableArrayTemp = [];
                    var page_ids = Object.getOwnPropertyNames(page_response);
                    var currentPage = page_response[page_ids[pageCount - 1]];

                    for (jj = 0; jj < data[ii].values.length; ++jj) {
                        var date = new Date(data[ii].values[jj].end_time * 1000);

                        var tableauDataObject = getTableauDataObject(tableData, data);

                        if (tableauDataObject) {

                            tableauDataObject[data[ii].name] = data[ii].values[jj].value;
                        } else {
                            var roundedDate = roundDate(data[ii].values[jj].end_time * 1000);
                            if (roundDate(START_DAY * 1000).setHours(0, 0, 0, 0) == roundedDate.setHours(0, 0, 0, 0)) {
                                endThisNow = true;
                                break;
                            }
                            var obj = {};
                            obj.unix_date = data[ii].values[jj].end_time; // used for comparision
                            obj.date = date;
                            obj[data[ii].name] = data[ii].values[jj].value;
                            obj.page_name = currentPage.name;
                            obj.page_username = currentPage.username;
                            tableData.push(obj);
                        }
                    }
                    if (endThisNow === true) {
                        break;
                    }
                }
                if (endThisNow === true) {
                    doneCallback();
                    return;
                } else {
                    table.appendRows(tableData);
                    var paging_next = feed_response.paging.previous; //set next page string
                    getFbFeed(table, doneCallback, paging_next, pageCount);
                }
            } else {
                doneCallback();
                return;
            }
        });
    }
    tableau.registerConnector(myConnector);
})();
