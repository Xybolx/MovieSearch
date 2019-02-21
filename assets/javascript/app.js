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
  var movies = ["The Matrix", "Inception", "Mr. Nobody", "Star Wars", "Lost Highway", "Primer", "Upstream Color", "The Dark Knight", "Avengers: Infinity War", "The Toxic Avenger", "Inland Empire", "Donnie Darko", "American Psycho", "Fight Club", "Pulp Fiction", "In Time", "The Empire Strikes Back",];


  // displayMovieInfo function re-renders the HTML to display the appropriate content
  function displayMovieInfo() {

    var movie = $(this).attr("data-name");
    var queryURL = "https://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";

    // Creating an AJAX call for the specific movie button being clicked
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function (response) {

      // Creating a div to hold the movie
      var movieDiv = $("<div class='movie'>");

      // Creating divs to hold the info
      var detailsDiv = $("<div class='info'>");
      var infoDiv = $("<div id='details'>");

      // Storing the rating data
      var rating = response.Rated;

      // Creating an element to have the title displayed
      var title = $("<h1 class='title'>").html(movie);

      // Creating an element to have the rating displayed
      var pOne = $("<p>").html("Rated: " + "<br>" + rating);

      // Retrieving the URL for the image
      var imgURL = response.Poster;

      // Creating an element to hold the image
      var image = $("<img class='poster'>").attr("src", imgURL);

      // Appending the image
      movieDiv.append(image);

      // Appending the title
      movieDiv.append(title);

      // Displaying the rating
      detailsDiv.append(pOne);

      // Storing the release year
      var released = response.Released;

      // Creating an element to hold the release year
      var pTwo = $("<p>").html("Released: " + "<br>" + released);

      // Displaying the release year
      detailsDiv.append(pTwo);

      // Storing the plot
      var plot = response.Plot;

      // Creating an element to hold the plot
      var pThree = $("<p>").html("Plot: " + "<br>" + plot);

      // Appending the plot
      detailsDiv.append(pThree);

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


    



    // Calling renderButtons which handles the processing of our movie array
    renderButtons();
    $("#movie-input").val("");
  });

  // Adding a click event listener to all elements with a class of "movie-btn"
  $(document).on("click", ".movie-btn", displayMovieInfo);

  // Calling the renderButtons function to display the intial buttons
  renderButtons();


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