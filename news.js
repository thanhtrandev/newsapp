$(document).ready(function() {
    fetch('https://gnews.io/api/v4/top-headlines?lang=en&topic=breaking-news&token=28cbc6798cfe00a7ecfc365286d8e7ba')
       .then(function (response) {
           return response.json();
       })
       .then(function (data) {
           NewsData(data);
       });

       function NewsData(data) {
        var output = "";
        var content = "";
        if (data.totalArticles > 0) {
            for (var i in data.articles) {
                content = $.trim(data.articles[i].content).substring(0, 250).split(" ").slice(0, -1).join(" ") + "..."
                output +=
                    `<div>
                    <div class="news-box row">
                        <div class="img-box col l-6">
                          <img class="featured-image" src="${data.articles[i].image}" alt="${data.articles[i].title}">
                          </div>
                        <div class="col l-6">
                        <a href="${data.articles[i].url}" target="_blank"><h2>${data.articles[i].title}</h2></a>
                        <p><em>${data.articles[i].publishedAt}</em></p>
                        <p>${content}</p>
                        </div>
                    </div><br><br>
                </div>`;
            }
        } else {
            output += "No data found"
        }
        $("#news-block").append(output);
    }
    // Check the search box
    
    $("#keyword-input").on('blur keyup', function(event) {
        if (!$("#keyword-input").val()) {
            $("#search-btn").addClass('disabled');
        } else {
            $("#search-btn").removeClass('disabled');   
        }
    });

    
    // Greate current Time 
     
    Date.toDateInputValue = (function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10); 
    });
    var currentDate = new Date();

    // Check and return the start date must be smaller than end date 
    $("#start-date").on('change', function(event) {
        /* Act on the event */
        if ($("#start-date").val() > $("#end-date").val() && $("#end-date").val()) {
            $("#start-date").val($("#end-date").val());
        }
    });

    // Check the end date must be smaller than current date 
    $("#end-date").on('change', function(event) {
        
        if ($("#end-date").val() > new Date()) {
            $("#end-date").val(new Date());
        }
        
    });

    // Clear input
    function clearInput() {
        $("#keyword-input").val("");
        $("#start-date").val("");
        $("#end-date").val("");
    }

    // Event search-btn 
    $("#search-btn").on('click', function(event) {
        // Create object
        var searchKey = {
            q: '',
            from: '',
            to: '',
            token: '28cbc6798cfe00a7ecfc365286d8e7ba'
        };

        let searchUrl = 'https://gnews.io/api/v4/search?lang=en&max=8&';
        
        searchKey.q = `"${$("#keyword-input").val()}"`;
        if ($("#start-date").val()) {
            searchKey.from = $("#start-date").val() + 'T:00:01:00Z';
        };
        if ($("#end-date").val()) {
            searchKey.to = $("#end-date").val() + 'T23:59:59Z';
        };
        searchUrl += $.param(searchKey);

        
        /* Clear input and close modal */
        $("#search-val").hide(clearInput());
        console.log(searchUrl);
        $.ajax({
            url: searchUrl,
            type: 'GET',
            dataType: 'json',

            beforeSend: function(){
                $("#news-block").empty();
                $("#preloader").show();
            },
            complete: function(){
                $("#preloader").hide();
                $("#overlay-container").hide();
            },
            success: function(data){
                $("#news-block").parent().prepend(`<h3>Các tin phù hợp với ${searchKey.q}</h3>`);
                NewsData(data);
            },
            error: function(){
                $("#news-block").html("Không tìm thấy kết quả phù hợp!");
            },
        })
        .done(function() {
            console.log("success");
        })
        .fail(function() {
            console.log("error");
        })
        .always(function() {
            console.log("complete");
        });
        
    });

    /* Open search method */
    $("#search-icon").click( function() {
        $("#overlay-container").fadeIn();
        $("#search-val").show();
        $("#keyword-input").focus();
        $("#search-btn").addClass('disabled');
    });

    /* Close search-val */
    $(document).click( function(event) {
        if ($(event.target).closest("#search-val").length === 0 && $(event.target).closest("#search-icon").length === 0) {
            $("#overlay-container").hide(clearInput());
        }
    });

    
    
    

});