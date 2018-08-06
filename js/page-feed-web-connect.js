var CONNECTION_NAME = 'Facebook page feed';

var insightsMetrics = [
    'post_impressions',
    'post_impressions_unique',
    'post_impressions_paid',
    'post_impressions_paid_unique',
    'post_impressions_fan',
    'post_impressions_fan_unique',
    'post_impressions_fan_paid',
    'post_impressions_fan_paid_unique',
    'post_impressions_organic',
    'post_impressions_organic_unique',
    'post_impressions_viral',
    'post_impressions_viral_unique',
    'post_clicks',
    'post_clicks_unique',
    'post_engaged_users',
    'post_negative_feedback',
    'post_negative_feedback_unique',
    'post_engaged_fan',
    'post_video_avg_time_watched',
    'post_video_complete_views_organic',
    'post_video_complete_views_organic_unique',
    'post_video_complete_views_paid',
    'post_video_complete_views_paid_unique',
    'post_video_views_organic',
    'post_video_views_organic_unique',
    'post_video_views_paid',
    'post_video_views_paid_unique',
    'post_video_length',
    'post_video_views',
    'post_video_views_unique',
    'post_video_views_autoplayed',
    'post_video_views_clicked_to_play',
    'post_video_views_10s',
    'post_video_views_10s_unique',
    'post_video_views_10s_autoplayed',
    'post_video_views_10s_clicked_to_play',
    'post_video_views_10s_organic',
    'post_video_views_10s_paid',
    'post_video_views_10s_sound_on',
    'post_video_views_sound_on',
    'post_video_view_time',
    'post_video_view_time_organic'
];
var metrics = [
    'reactions.limit(0).summary(true)',
    'likes.limit(1).summary(true)',
    'comments.limit(1).summary(true).filter(toplevel)',
    'message',
    'admin_creator',
    'caption',
    'created_time',
    'description',
    'icon',
    'id',
    'is_expired',
    'is_hidden',
    'link',
    'name',
    'picture',
    'source',
    'status_type',
    'subscribed',
    'type',
    'updated_time',
    'application',
    'from',
    'shares',
    'insights.metric(' + insightsMetrics.join() + ')'
];

//Helper function. Builds url for initail search string for each page.
function buildUrl(pageCount, page_response) {
    var page_ids = Object.getOwnPropertyNames(page_response);

    var next_page = '/' + page_response[page_ids[pageCount - 1]].id + '/feed?fields=' + metrics.join();
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
    }, {
        id: "page_fan_count",
        alias: "Page Fan Count",
        dataType: tableau.dataTypeEnum.int
    }, {
        id: "page_new_likes",
        alias: "Page New Likes",
        dataType: tableau.dataTypeEnum.int
    }, {
        id: "page_talking_about",
        alias: "Page Talking About",
        dataType: tableau.dataTypeEnum.int
    }, {
        id: "page_id",
        alias: "Page ID",
        dataType: tableau.dataTypeEnum.string
    }, {
        id: "page_link",
        alias: "Page Link",
        dataType: tableau.dataTypeEnum.string
    }, {
        id: "message",
        alias: "Message",
        dataType: tableau.dataTypeEnum.string
    }, {
        id: "caption",
        alias: "Caption",
        dataType: tableau.dataTypeEnum.string
    }, {
        id: "created_date",
        alias: "Created Date",
        dataType: tableau.dataTypeEnum.date
    }, {
        id: "created_time",
        alias: "Created Time",
        dataType: tableau.dataTypeEnum.datetime
    }, {
        id: "description",
        alias: "Description",
        dataType: tableau.dataTypeEnum.string
    }, {
        id: "icon",
        alias: "Icon",
        dataType: tableau.dataTypeEnum.string
    }, {
        id: "post_id",
        alias: "Post ID",
        dataType: tableau.dataTypeEnum.string
    }, {
        id: "is_expired",
        alias: "Is Expired",
        dataType: tableau.dataTypeEnum.bool
    }, {
        id: "is_hidden",
        alias: "Is Hidden",
        dataType: tableau.dataTypeEnum.bool
    }, {
        id: "link",
        alias: "Link",
        dataType: tableau.dataTypeEnum.string
    }, {
        id: "name",
        alias: "Name",
        dataType: tableau.dataTypeEnum.string
    }, {
        id: "picture",
        alias: "Picture",
        dataType: tableau.dataTypeEnum.string
    }, {
        id: "source",
        alias: "Source",
        dataType: tableau.dataTypeEnum.string
    }, {
        id: "status_type",
        alias: "Status Type",
        dataType: tableau.dataTypeEnum.string
    }, {
        id: "subscribed",
        alias: "Subscribed",
        dataType: tableau.dataTypeEnum.bool
    }, {
        id: "type",
        alias: "Type",
        dataType: tableau.dataTypeEnum.string
    }, {
        id: "updated_time",
        alias: "Updated Time",
        dataType: tableau.dataTypeEnum.datetime
    }, {
        id: "application_name",
        alias: "Application Name",
        dataType: tableau.dataTypeEnum.string
    }, {
        id: "application_id",
        alias: "Application ID",
        dataType: tableau.dataTypeEnum.int
    }, {
        id: "from_category",
        alias: "From Category",
        dataType: tableau.dataTypeEnum.string
    }, {
        id: "from_id",
        alias: "From ID",
        dataType: tableau.dataTypeEnum.int
    }, {
        id: "from_name",
        alias: "From Name",
        dataType: tableau.dataTypeEnum.string
    }, {
        id: "post_shares",
        alias: "Post Shares",
        dataType: tableau.dataTypeEnum.int
    }, {
        id: "post_reactions",
        alias: "Post Reactions",
        dataType: tableau.dataTypeEnum.int
    }, {
        id: "post_likes",
        alias: "Post Likes",
        dataType: tableau.dataTypeEnum.int
    }, {
        id: "post_comments",
        alias: "Post Comments",
        dataType: tableau.dataTypeEnum.int
    }, {
        id: "admin_creator",
        alias: "Admin Creator",
        dataType: tableau.dataTypeEnum.string
    },
        {
            id: "post_impressions",
            alias: "Post Impressions",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "post_impressions_unique",
            alias: "Post Impressions Unique",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "post_impressions_paid",
            alias: "Post Impressions Paid",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "post_impressions_paid_unique",
            alias: "Post Impressions Paid Unique",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "post_impressions_fan",
            alias: "Post Impressions Fan",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "post_impressions_fan_unique",
            alias: "Post Impressions Fan Unique",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "post_impressions_fan_paid",
            alias: "Post Impressions Fan Paid",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "post_impressions_fan_paid_unique",
            alias: "Post Impressions Fan Paid Unique",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "post_impressions_organic",
            alias: "Post Impressions Organic",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "post_impressions_organic_unique",
            alias: "Post Impressions Organic Unique",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "post_impressions_viral",
            alias: "Post Impressions Viral",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "post_impressions_viral_unique",
            alias: "Post Impressions Viral Unique",
            dataType: tableau.dataTypeEnum.int
        },
        {
            id: "post_clicks",
            alias: "Post Clicks",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "post_clicks_unique",
            alias: "Post Clicks Unique",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "post_engaged_users",
            alias: "Post Engaged Users",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "post_negative_feedback",
            alias: "Post Negative Feedback",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "post_negative_feedback_unique",
            alias: "Post Negative Feedback Unique",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "post_engaged_fan",
            alias: "Post Engaged Fan",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "post_video_avg_time_watched",
            alias: "Post Video Avg Time Watched",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "post_video_complete_views_organic",
            alias: "Post Video Complete Views Organic",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "post_video_complete_views_organic_unique",
            alias: "Post Video Complete Views Organic Unique",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "post_video_complete_views_paid",
            alias: "Post Video Complete Views Paid",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "post_video_complete_views_paid_unique",
            alias: "Post Video Complete Views Paid Unique",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "post_video_views_organic",
            alias: "Post Video Views Organic",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "post_video_views_organic_unique",
            alias: "Post Video Views Organic Unique",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "post_video_views_paid",
            alias: "Post Video Views Paid",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "post_video_views_paid_unique",
            alias: "Post Video Views Paid Unique",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "post_video_length",
            alias: "Post Video Length",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "post_video_views",
            alias: "Post Video Views",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "post_video_views_unique",
            alias: "Post Video Views Unique",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "post_video_views_autoplayed",
            alias: "Post Video Views Autoplayed",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "post_video_views_clicked_to_play",
            alias: "Post Video Views Clicked To Play",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "post_video_views_10s",
            alias: "Post Video Views 10s",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "post_video_views_10s_unique",
            alias: "Post Video Views 10s Unique",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "post_video_views_10s_autoplayed",
            alias: "Post Video Views 10s Autoplayed",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "post_video_views_10s_clicked_to_play",
            alias: "Post Video Views 10s Clicked To Play",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "post_video_views_10s_organic",
            alias: "Post Video Views 10s Organic",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "post_video_views_10s_paid",
            alias: "Post Video Views 10s Paid",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "post_video_views_10s_sound_on",
            alias: "Post Video Views 10s Sound On",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "post_video_views_sound_on",
            alias: "Post Video Views Sound On",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "post_video_view_time",
            alias: "Post Video View Time",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "post_video_view_time_organic",
            alias: "Post Video View Time Organic",
            dataType: tableau.dataTypeEnum.int
        }
    ];
    var tableSchema = {
        id: "facebook_page_feed",
        alias: "Facebook page feed",
        columns: cols
    };
    schemaCallback([tableSchema]);
};
//gets top level data about page
myConnector.getData = function getData(table, doneCallback) {
    pagesInfo = JSON.parse(tableau.connectionData); //includes page response and access token

    var pagesCount = pagesInfo.length;
    var initialUrl = "";
    getFbFeed(table, doneCallback, initialUrl, pagesCount, pagesInfo, 0);
};
/*
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
*/

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


function getFbFeed(table, doneCallback, next_page, pagesCount, pagesInfo, currentPageLoop) {
    var pageInfo = pagesInfo[currentPageLoop]
    var page_response = pageInfo.page_response;
    if(!next_page) {
        next_page = buildUrl(1, page_response);
    }
    var page_ids = Object.getOwnPropertyNames(page_response);
    var toRet = [];

    FB.api(next_page,
        'GET',
        {
            access_token: pageInfo.token,
            date_format: 'U', //set time format to unicode so that it works with Tableau
            limit:LIMIT
        }, function(feed_response) {
            //callback loop
            var data = feed_response.data;

            //if (data != null && data[0] != null) {
            if (Array.isArray(data) && data.length) {
                var tableData = [];
                for (ii = 0; ii < data.length; ++ii) {
                    //get total comment count
                    var totalComments;
                    if (data[ii].comments) {
                        totalComments = data[ii].comments.summary.total_count;
                    }
                    //get total like count
                    var totalLikes;
                    if (data[ii].likes) {
                        totalLikes = data[ii].likes.summary.total_count;
                    }

                    //get total reactions
                    var totalReactions;
                    if (data[ii].reactions) {
                        totalReactions = data[ii].reactions.summary.total_count;
                    }

                    var page_ids = Object.getOwnPropertyNames(page_response);
                    var currentPage = page_response[page_ids[0]];
                    var postInsightsData = {
                        'page_name': currentPage.name,
                        'page_username': currentPage.username,
                        'page_fan_count': currentPage.fan_count,
                        'page_new_likes': currentPage.new_like_count,
                        'page_talking_about': currentPage.talking_about_count,
                        'page_id': currentPage.id,
                        'page_link': currentPage.link,
                        'message': data[ii].message,
                        'caption': data[ii].caption,
                        'created_date': new Date(data[ii].created_time * 1000),
                        'created_time': new Date(data[ii].created_time * 1000),
                        'description': data[ii].description,
                        'icon': data[ii].icon,
                        'post_id': data[ii].id,
                        'is_expired': data[ii].is_expired,
                        'is_hidden': data[ii].is_hidden,
                        'link': data[ii].link,
                        'name': data[ii].name,
                        'picture': data[ii].picture,
                        'source': data[ii].source,
                        'status_type': data[ii].status_type,
                        'subscribed': data[ii].subscribed,
                        'type': data[ii].type,
                        'updated_time': new Date(data[ii].updated_time * 1000),
                        'application_name': ifexists(data[ii], 'application.name'),
                        'application_id': ifexists(data[ii], 'application.id'),
                        'from_category': ifexists(data[ii], 'from.category'),
                        'from_id': ifexists(data[ii], 'from.id'),
                        'from_name': ifexists(data[ii], 'from.name'),
                        'post_shares': ifexists(data[ii], 'shares.count'),
                        'post_reactions': totalReactions,                        
                        'post_likes': totalLikes,
                        'post_comments': totalComments,
                        'admin_creator': ifexists(data[ii], 'admin_creator.name'),
                    };
                    if (data[ii].insights != null && data[ii].insights.data[0] != null) {
                        for (var iii = 0; iii < data[ii].insights.data.length; iii++) {
                            postInsightsData[data[ii].insights.data[iii].name] = data[ii].insights.data[iii].values[0].value;
                        }
                    }
                    tableData.push(postInsightsData);
                }
                table.appendRows(tableData);
                var paging_next = feed_response.paging.next; //set next page string
                if(!paging_next) {
                    if(currentPageLoop + 1  !== pagesCount) {
                        var paging_next = "";
                        currentPageLoop ++;
                        getFbFeed(table, doneCallback, paging_next, pagesCount, pagesInfo, currentPageLoop);

                    } else {
                        doneCallback();
                        return;
                    }
                } else {
                    getFbFeed(table, doneCallback, paging_next, pagesCount, pagesInfo, currentPageLoop);
                }
            } else {
                if(currentPageLoop + 1  !== pagesCount) {
                    var paging_next = "";
                    currentPageLoop ++;
                    getFbFeed(table, doneCallback, paging_next, pagesCount, pagesInfo, currentPageLoop);

                } else {
                    doneCallback();
                    return;
                }
            }
        });
}
tableau.registerConnector(myConnector);