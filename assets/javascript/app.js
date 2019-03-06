// Initialize Firebase
var config = {
    apiKey: "AIzaSyDNtaAxEQcq6LZ8pNda899G4we-el-mn6k",
    authDomain: "favorite-movies-3575b.firebaseapp.com",
    databaseURL: "https://favorite-movies-3575b.firebaseio.com",
    projectId: "favorite-movies-3575b",
    storageBucket: "favorite-movies-3575b.appspot.com",
    messagingSenderId: "142859031042"
  };
  firebase.initializeApp(config);
  var db = firebase.database();

  






  // Initial array of movies
  var movies = ["The Matrix", "Inception", "Mr. Nobody", "Star Wars", "Lost Highway", "Primer", "Upstream Color", "The Dark Knight", "The Toxic Avenger", "Inland Empire", "Donnie Darko", "American Psycho", "Fight Club", "Pulp Fiction", "In Time"];

  // Make the add movie submit button disabled on load
  $("#add-movie").prop("disabled", true);


  // displayMovieInfo function re-renders the HTML to display the appropriate content
  function displayMovieInfo() {

    var movie = $(this).attr("data-name");
    var queryURL = "https://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";

    // Creating an AJAX call for the specific movie button being clicked
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function (response) {

      console.log(response);

      // Creating a div to hold the movie
      var movieDiv = $("<div class='movie'>");

      // Creating divs to hold the info
      var detailsDiv = $("<div class='info'>");
      var infoDiv = $("<div id='details'>");

      // Storing the rating data
      var rating = response.Rated

      // Storing the director data
      var director = response.Director

      // Storing the Rotten Tomatoes rating
      var tomatoRating = (Object.values(response.Ratings[1]))[1];

      // Storing imdb rating
      var imdbRated = response.imdbRating;

      // Storing the actors data
      var actors = response.Actors;

      // Creating an element to have the title displayed
      var title = $("<h1 class='title'>").html(movie);

      // Creating an element to have the rating displayed
      var pZero = $("<h2>").html("<h2>" + "Rated:" + "</h2>" + "<p>" + rating + "</p>");

      // Creating an element to have the Rotten Tomatoes rating displayed
      var pOne = $("<h2>").html("<h2>" + "Rotten Tomatoes:" + "</h2>" + "<p>" + tomatoRating + "</p>");

      // Creating an element to have the imdb rating displayed 
      var pTwo = $("<h2>").html("<h2>" + "imdb Rating:" + "</h2>" + "<p>" + imdbRated + "/10" + "</p>");
      
      // Creating an element to have the director displayed
      var pThree = $("<h2>").html("<h2>" + "Directed By:" + "</h2>" + "<p>" + director + "</p>");

      // Creating an element to have the actors displayed
      var pFour = $("<h2>").html("<h2>" + "Starring:" + "</h2>" + "<p>" + actors + "</p>");

      // Retrieving the URL for the image
      var imgURL = response.Poster;

      // Creating an element to hold the image
      var image = $("<img class='poster'>").attr("src", imgURL);

      // Appending the image
      detailsDiv.append(image);

      // Appending the title
      detailsDiv.append(title);

      // Displaying the rating
      detailsDiv.append(pZero);

      // Displaying the Rotten Tomatoes rating
      detailsDiv.append(pOne);

      // Displaying the imdb rating
      detailsDiv.append(pTwo);

       // Displaying the director
       detailsDiv.append(pThree);

      // Storing the release year
      var released = response.Released;

      // Creating an element to hold the release date
      var pFive = $("<h2>").html("<h2>" + "Released:" + "</h2>" + "<p>" + moment(released).format("MMMM Do, YYYY") + "</p>");

      // Displaying the actors
      detailsDiv.append(pFour);

      // Storing the studio
      var studio = response.Production;

      // Creating an element to hold the plot
      var pSix = $("<h2>").html("<h2>" + "Studio:" + "</h2>" + "<p>" + studio + "</p>");

      // Storing the plot
      var plot = response.Plot;

      // Creating an element to hold the plot
      var pSeven = $("<h2>").html("<h2>" + "Plot:" + "</h2>" + "<p>" + plot + "</p>");

      // Appending the release date
      detailsDiv.append(pFive);

      // Appending the studio
      detailsDiv.append(pSix);

      // Appending the plot
      detailsDiv.append(pSeven);

      // Appending the details to the info div
      infoDiv.append(detailsDiv);

      // Appending the info to the movie div
      movieDiv.append(infoDiv);


      // Putting the entire movie above the previous movies
      $("#movies-view").prepend(movieDiv);
    });

  }

  // Function for displaying movie data
  function renderButtons() {

    // Deleting the movies prior to adding new movies
    // (this is necessary otherwise you will have repeat buttons)
    $("#buttons-view").empty();

    // Looping through the array of movies
    for (var i = 0; i < movies.length; i++) {

      // Then dynamicaly generating buttons for each movie in the array
      var a = $("<button>");
      // Adding a class of movie-btn to our button
      a.addClass("movie-btn");
      // Adding a data-attribute
      a.attr("data-name", movies[i]);
      // Providing the initial button text
      a.text(movies[i]);
      // Adding the button to the buttons-view div
      $("#buttons-view").append(a);
    }
  }

  // This function handles events where a movie button is clicked
  $("#add-movie").on("click", function (event) {
    event.preventDefault();
    // This line grabs the input from the textbox
    var movie = $("#movie-input").val().trim();

  // Adding movie from the textbox to our database
    db.ref("/new").push({
      movie: movie
    });

    $("#movie-input").val("");
    $("#add-movie").prop("disabled", true);
  });

  $('#movie-input').on('input', function () {
    var input = $(this);
    var re = /^[^\s]+(\s+[^\s]+)*$/;
    var is_movie = re.test(input.val());
    if (is_movie) {
        input.removeClass("invalid").addClass("valid");
        $("#add-movie").prop("disabled", false);
      }
    else {
        input.removeClass("valid").addClass("invalid");
        $("#add-movie").prop("disabled", true);
    
    
}

});


  // Adding a click event listener to all elements with a class of "movie-btn"
  $(document).on("click", ".movie-btn", displayMovieInfo);


  // Adding new movies from database to movies array so that adding a movie button is permanent 
  var initial = db.ref('/new');
  initial.on('child_added', function (snapshot) {
    snapshot.forEach(function (childSnapshot) {
      var childData = childSnapshot.val();
      console.log(childData);
      movies.push(childData);
      console.log(movies);
      renderButtons();
    });

  });