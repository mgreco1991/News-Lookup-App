$(document).ready(function(){

//set up variables
//==============================================================================

//API Key
var authKey = "51f7997f5c824e6088c80956efb4744c";

//search parameters
var queryTerm   = "";
var numResults  = 0;
var startYear   = 0;
var endYear     = 0;

//URL base
var queryURLBase = "https://api.nytimes.com/svc/search/v2/articlesearch.json?" + "api-key=" + authKey;

//var to track number of articles
var articleCounter = 0;

//functions
//==============================================================================

//takes two params - the number of articles, and the query URL 
function runQuery(numArticles, queryURL){

    //AJAX function
    $.ajax({url: queryURL, method: "GET"})
        .done(function(NYTData){

            //so that divs don't keep on appending with every click of search.
            $("#wellSection").empty();
            for (i = 0; i < numArticles; i++){
                console.log("====================================");
                console.log(NYTData.response.docs[i].headline.main);
                console.log(NYTData.response.docs[i].section_name);
                console.log(NYTData.response.docs[i].pub_date);
                console.log(NYTData.response.docs[i].byline.original);
                console.log(NYTData.response.docs[i].web_url);
                console.log("====================================");

                //create a wellSection div dynamically. Give it bootstrap class "well"
                //give each index a unique ID as it loops through
                //tack on this dynamically created div to the hardcoded div in the
                //HTML document with the same name (confusing)
                var wellSection = $("<div>");
                wellSection.addClass("well");
                wellSection.attr("id", "articleWell-" + i);
                $("#wellSection").append(wellSection);

                //create conditionals so that this info only displays if it exists
                if(NYTData.response.docs[i].headline.main !== null){
                    $("#articleWell-" + i).append("<h3>" + NYTData.response.docs[i].headline.main + "</h3>");
                }

                if(NYTData.response.docs[i].byline && NYTData.response.docs[i].byline.hasOwnProperty("original")){
                    $("#articleWell-" + i).append("<h5>" + NYTData.response.docs[i].byline.original + "</h5>");
                }

                if(NYTData.response.docs[i].hasOwnProperty("section_name")){
                    $("#articleWell-" + i).append("<h5>" + NYTData.response.docs[i].section_name + "</h5>");
                }

                //for every well index generated in the loop, put in the info
                //all of the info comes from digging through the response object
            
                $("#articleWell-" + i).append("<h5>" + NYTData.response.docs[i].pub_date + "</h5>");
                $("#articleWell-" + i).append("<a href=" + NYTData.response.docs[i].web_url + ">" + NYTData.response.docs[i].web_url + "</a>");
            }
            
        })        
}
//main processes
//==============================================================================

//function for what happens when you click submit on the search form
$("#search-btn").on("click", function(){

    //captures the value of what is in the search bar
    queryTerm = $("#search").val().trim();

    //creates the whole URL using the user's input and the base URL with the
    //web address and API key
    var newURL = queryURLBase + "&q=" + queryTerm; 

    //number of records to retrieve
    //because the NYT API does not have a parameter for this search 
    //filter, we need to create our own for loops. We cannot use the 
    //API to make this easier for us 
    numResults = $("#numRecords").val();

    //start and end year values
    startYear = $("#startYear").val().trim();
    endYear = $("#endYear").val().trim();

    //constuct the newURL with the added search parameters
    //because the start and end date params are optional, we
    //use an if parseInt if there is in fact a numerical val
    //in the text input field
    if(parseInt(startYear)){
        //we don't initialize with the 0101 concatenated because
        //it needs to check if it is in fact a number first! 
        //otherwise, it is always a number and this statement is always 
        //true and this field will always be required! 
        startYear = startYear + "0101";
        newURL = newURL + "&facet_field=source" + "&begin_date=" + startYear;
    }

    if(parseInt(endYear)){
        endYear = endYear + "0101";
        newURL = newURL + "&facet_field=source" + "&end_date=" + endYear;
    }
    // newURL = newURL + "&facet_field=source" + "&begin_date=" + startYear + "&end_date=" + endYear;
    // console.log(newURL);

    //expects the two parameters of numResults and newURL  
    //send the AJAX call the newly assembled URL 
    runQuery(numResults, newURL);

    // return false to prevent button type "submit" from going to a new page
    return false;
})

$("#clear-btn").on("click", function(){
    $("#wellSection").empty();
})

// 1. Retrieve user input and convert to variables
// 2. Use the variables to run an AJAX call to NYT
// 3. Break down the NYT JSON object returned from the AJAX call into useable fields
// 4. Dynamically generate the HTML content that is going to provide the information
// 5. Dealing with "edge cases" or bugs
});
//PW robm7626
//UN 903011257
//angelist 