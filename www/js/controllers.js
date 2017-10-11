angular.module('app.controllers', ['ionic', 'ngCordova'])

  .controller('graphCtrl', ['$scope', '$stateParams',
    function ($scope, $stateParams) {


    }])

  .controller('flashCardsCtrl', ['$scope', '$stateParams',
    function ($scope, user, $stateParams) {

      //the following function was used to try and implemented auto random generated questions for the cards
      //we were unable to figure out how to concatenate the string result to the existing label in our 
      //flash cards.html page.
      $scope.multiQuiz = function () {
        
        var a, b, c, d, answers, question;
        $scope.test = 0;
        var eduLevel = user.getEducation;
        var a1 = document.getElementById("answer1");
        var a2 = document.getElementById("answer2");
        var a3 = document.getElementById("answer3");
        var a4 = document.getElementById("answer4");

        var q1 = document.getElementById("question1");
        var q2 = document.getElementById("question2");
        var q3 = document.getElementById("question3");
        var q4 = document.getElementById("question4");

        function DivProblem() {

          if (eduLevel === "Elementary") {
            a = (1 + 9 * Math.random());
            b = (1 + 9 * Math.random());
            answer = Math.round(a / b);
            question = "" + a + "/" + b + "";
          }
          else {
            a = (1 + 9 * Math.random());
            b = (1 + 9 * Math.random());
            c = (1 + 9 * Math.random());
            d = (1 + 9 * Math.random());
            answer = Math.round((a / b) / (c / d));
            question = "(" + a + "/" + b + ")" + " / " + "(" + c + "/" + d + ")";
          }
        }

        function MultProblem() {
          if (eduLevel === "Elementary") {
            a = (1 + 9 * Math.random());
            b = (1 + 9 * Math.random());
            question = "" + a + " * " + b + "";
            answer = Math.round(a * b);
          } else {
            a = (1 + 9 * Math.random());
            b = (1 + 9 * Math.random());
            c = (1 + 9 * Math.random());
            d = (1 + 9 * Math.random());
            answer = Math.round((a / b) * (c / d));
            question = "(" + a + "/" + b + ")" + " * " + "(" + c + "/" + d + ")";
          }
        }

        function AddProblem() {
          if (eduLevel === "Elementary") {
            a = (1 + 9 * Math.random());
            b = (1 + 9 * Math.random());
            question = "" + a + " + " + b + "";
            answer = Math.round(a + b);
          } else {
            a = (1 + 9 * Math.random());
            b = (1 + 9 * Math.random());
            c = (1 + 9 * Math.random());
            d = (1 + 9 * Math.random());
            answer = Math.round((a / b) + (c / d));
            question = "(" + a + "/" + b + ")" + " + " + "(" + c + "/" + d + ")";
          }
        }

        function SubProblem() {
          if (eduLevel === "Elementary") {
            a = (1 + 9 * Math.random());
            b = (1 + 9 * Math.random());
            question = "" + a + " - " + b + "";
            answer = Math.round(a - b);
          } else {
            a = (1 + 9 * Math.random());
            b = (1 + 9 * Math.random());
            c = (1 + 9 * Math.random());
            d = (1 + 9 * Math.random());
            answer = Math.round((a / b) - (c / d));
            question = "(" + a + "/" + b + ")" + " - " + "(" + c + "/" + d + ")";
          }
        }
        
        var i = 0;
        var questions = [];
        while (i < 3) {
          i++;
          var num = (1 + 4 * Math.random());
          questions.push(num);
        }

        for (i=0; i<3; i++){
            if (questions[i] === 1) {
            DivProblem();
            q1.innerHTML = question;
            console.log(q1.value);
            a1.innerHTML = answer;
            console.log(a1.value);
          }
           if (questions[i]  === 2) {
            MultProblem();
            q2.innerHTML = question;
            a2.innerHTML = answer;
          }
          if (questions[i]  === 3) {
            AddProblem();
            q3.innerHTML = question;
            a3.innerHTML = answer;
          }
          if (questions[i]  === 4) {
            SubProblem();
            q4.innerHTML = question;
            a4.innerHTML = answer;
          }
        }
        
      }

    }])

    //controller to change user information
  .controller('settingsCtrl',
  function ($scope, user, $stateParams, $cordovaSQLite, $state, $ionicPopup) {

    $scope.updateInfo = function (update) {
      var password = document.getElementById("settings-password").value;
      var id = user.getId;

      if (password.length >= 6) {
        var query = 'UPDATE users SET firstName = (?), lastName = (?), age = (?), country = (?), education = (?), password = (?) WHERE id="'+id+'"';
        $cordovaSQLite.execute(db, query, [update.firstName, update.lastName, update.age, update.country, update.education, update.password]).then(function (res) {
          var alertPopup = $ionicPopup.alert({
            title: 'User Info Updated!'
          });
          $state.go('login')
        });
      }
      else {
        var alertPopup = $ionicPopup.alert({
          title: 'Information Not Updated'
        });
      }

    }
  })

  //menu contoller to load auto stored contact before launching the screen, and then displaying the result in the input boxes
  .controller('menuCtrl', function ($scope, user, $cordovaSQLite, $ionicActionSheet, $state) {

    $scope.recall = function () {

      var username = user.getUserName;

      var query = 'SELECT * FROM users WHERE userName LIKE "' + username + '"';
      $cordovaSQLite.execute(db, query, []).then(function (res) {

        document.getElementById("settings-first").value = res.rows.item(0).firstName;
        document.getElementById("settings-last").value = res.rows.item(0).lastName;
        document.getElementById("settings-age").value = res.rows.item(0).age;
        document.getElementById("settings-country").value = res.rows.item(0).country;

        user.getId = res.rows.item(0).id;
        user.getFirstName = res.rows.item(0).firstName;
        user.getLastName = res.rows.item(0).lastName;
        user.getAge = res.rows.item(0).age;
        user.getCountry = res.rows.item(0).country;
        user.getEducation = res.rows.item(0).education;
      })

    }

    //Action sheet for when user decides to logout
    $scope.presentActionSheet = function () {


      var showActionSheet = $ionicActionSheet.show({


        destructiveText: 'Log Out',
        titleText: 'Are You Sure?',
        cancelText: 'Cancel',

        cancel: function () {

        },

        destructiveButtonClicked: function () {
          $state.go('login');
        }
      });
    };
  })

  //login in control that checks if user exists and goes to graph html page if they do
  //if not then an aler will show displaying loging failed
  .controller("loginCtrl", function ($scope, user, $cordovaSQLite, $ionicPopup, $state) {

    $scope.checkUser = function (login) {
      user.getUserName = login.userName;

      var query = "SELECT userName, password FROM users WHERE (userName = ?) and (password = ?)";
      $cordovaSQLite.execute(db, query, [login.userName, login.password]).then(function (res) {
        if (res.rows.length > 0) {
          user.getId = res.rows.item(0).id;
          $state.go('menu.graph')
        }
        else {
          console.log("No Results Found");
          var alertPopup = $ionicPopup.alert({
            title: 'Login failed!',
            template: 'Please check your credentials!'
          });
        }
      });
    }
  })

  //sign up controller to register new users
  .controller('signupCtrl', function ($scope, $cordovaSQLite, $ionicPopup, $state) {
    $scope.add = function (user) {
      var query = "INSERT INTO users (firstName, lastName, age, country, education, userName, password) VALUES(?,?,?,?,?,?,?)";
      $cordovaSQLite.execute(db, query, [user.firstName, user.lastName, user.age, user.country, user.education, user.name, user.password]);
      var alertPopup = $ionicPopup.alert({
        title: 'User Saved!'
      });
      $state.go('login')
    }

  })

  //graphing controller that takes are inputed value and then sendsit to a cdn math link 
  // to make our input turn into a string and then display the outcome of the graph.
  .controller('graphCtrl', ['$scope', '$stateParams',
    function ($scope, $stateParams) {
      var width = window.innerWidth;

      function draw() {
        try {
          functionPlot({
            target: '#plot',
            width: width,
            height: 375,
            grid: true,
            data: [{
              fn: document.getElementById('eq').value, color: "red",
              derivative: {
                fn: math.derivative(document.getElementById('eq').value, 'x').toString(),
                updateOnMouseMove: true
              },
              sampler: 'builtIn',
              graphType: 'polyline'
            }]
          });
        }
        catch (err) {
          console.log(err);
          alert(err);
        }
      }

      document.getElementById('form').onsubmit = function (event) {
        event.preventDefault();
        draw();
      };

      draw();
    }])
