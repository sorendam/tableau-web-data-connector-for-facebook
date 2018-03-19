var APP_ID = '1028645180580861'; //Facebook APP ID
var LIMIT = 100; //Number of records to bring back at any time - MAX 100
var BASEURL = 'https://www.sorendam.com/tableau/facebook/'; //base url of virtual directory

/**
 * 1. login with Facebook
 */
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

/**
 * 1.1. Actual login if not logged in
 */
//Facbook Login on Single Page as Tableau does not allow popups
function login() {
    var uri = window.location.href;
    window.top.location = encodeURI("https://www.facebook.com/dialog/oauth?client_id=" + APP_ID + "&redirect_uri=" + uri + "&response_type=token&scope=business_management,manage_pages,read_insights");
}

/**
 * 1.1. Actual logut - not implemented currently
 */
function logout() {
    FB.logout(function(response) {
        document.location.reload();
    });
}


/**
 * 2. If logged in get user info
 */
function getUserInfo() {
    FB.api('/me', function(response) {
        var str = "Connected to Facebook as " + response.name;
        document.getElementById("message").innerHTML = str;

        str += "<input class='btn' type='button' value='Select All'  onclick='toggle();'/></br></br>";
        document.getElementById("status").innerHTML = "";
        getAccounts(); //get user's accounts i.e. pages that they are authorised for
    });
}


/**
 * Helper
 */
//selects all checkboxes
function toggle() {
    checkboxes = document.getElementsByName('check');
    for (var i = 0, n = checkboxes.length; i < n; i++) {
        checkboxes[i].checked = true;
    }
}

/**
 * 3. List pages that the current user has access to.
 * [response_fb description]
 * @type {String}
 */
var response_fb = ''
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

        //var str = "<input class='btn btn-primary btn-lg' type='button' value='Get Page Insights' onclick='getData(\"" + response.data[3].access_token + "\",\"" + response.data[3].id + "\");'/>";
        response_fb = response;
        var str = "<input class='btn btn-primary btn-lg' type='button' value='Get Page Insights' onclick='getData();'/>";

        document.getElementById("status").innerHTML += str;
    });
}


/**
 * 4. Get data from selected accounts
 * @return {[type]}
 */
function getData() {
    //get page ids for selected pages
    var page_ids = [];
    var checkboxes = document.getElementsByName('check');

    var access_tokens = []

    for (var i = 0, n = checkboxes.length; i < n; i++) {
        if (checkboxes[i].checked) {
            page_ids.push(checkboxes[i].value);
            for (var ii = 0, nn = response_fb.data.length; ii < nn; ii++) {

                // get page token if checked
                if(checkboxes[i].value == response_fb.data[ii].id) {
                    access_tokens.push(response_fb.data[ii].access_token)
                }

            }
        }
    }
    if (page_ids.length < 1) //if no pages have been selected do nothing
    {
        return;
    }


    var pageInfoComplete = []

    for (var pid = 0; pid < page_ids.length; pid++) {
        var strPage = '/?ids=' + page_ids[pid] + '&fields=username,fan_count,link,name,new_like_count,talking_about_count'; //get page information for all selected pages

        FB.api(strPage, function(page_response) {
            var page_id_string = Object.keys( page_response );
            var page_id_index = page_ids.indexOf(page_id_string[0]);
            var access_token_for_page = access_tokens[page_id_index]
            //pageInfo contains page information and access token to access page data
            var pageInfo = {
                'token': access_token_for_page,
                'page_response': page_response
            };

            pageInfoComplete.push(pageInfo)
        });
    }
    // as there can be multiple pages slected wait for all and repeat this until all have given a response
    var intervalID = setInterval(function(){
        if(pageInfoComplete.length == page_ids.length) {
            // this code clears your interval (myInterval)
            tableau.connectionName = CONNECTION_NAME; // name the data source. This will be the data source name in Tableau
            tableau.connectionData = JSON.stringify(pageInfoComplete); // set pageInfo as the connection data so we can get to it when we fetch the data
            tableau.submit();
        }
    }, 500);
}

