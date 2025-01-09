# DojoDB-client

 A React-based single-page application (SPA), that allows users to browse a curated list of movies, save favourites movies, learn more about directors and actors and manage their user profile.

## Table of Contents

 1. [Project description](#projectDescription)
 2. [Install and Run the Project](#installAndRun)
 3. [How to Use](#howToUse)
 4. [Technologies Used](#technologiesUsed)
 5. [Credits](#credits)
 6. [License](#license)  

## <a name="projectDescription"></a>Project description

**DojoDB-client** is a client-side application for martial art movie enthusiasts. It is built using React and provides a responsive, user-friendly interface (styled via bootstrap). It connects to a RESTful API to provide information about selected movies and allows users to:

* Browse all available movies
* Search for movies by title 
* View detailed information about movies, genres, their directors and actors
* Create, modify or delete their account
* Create and modify a personal favourites list
* Filter movies by release Year, actor, director, genre and/or movie title
* Search the app via searchform in the offcanvas menu

## <a name="installAndRun"></a>Install and Run the Project

### Pre-requisites
**Node.js**
**npm** (Node Package Manager)

### Installation Steps

1. Clone the repository:
`git clone https://github.com/<your-username>/DojoDB-client.git`

2. Navigate into the project directory:
`cd DojoDB-client`

3. Install project dependencies:
`npm install`

4. Start the development server:
`npm start`

5. The app will be available at http://localhost:1234.


## <a name="howToUse"></a>How to Use

1. **Login or Signup:**
    Users must create an account (signup) and log in to access the database

2. **Browse Movies:**
    The main view displays all movies with titles, descriptions, genre and thumbnail images

3. **Filter Movies:**
    On the main view, the movies can be filtered via one or multiple filters including actors, directors, release year and genre (via dropdown) & title (via searchform). THe filters can be cleared individually or through a clear all-button

4. **Search the app:**
    In the offcanvas navigation, one can access a searchform and search the app. The Search results are movieCards.

5. **View Details on a movie:**
    Click on a movie title to see detailed information on that movie

6. **View Details about an actor:**
    Click on an actor name to see role/s and movie/s of the actor

7. **View Details about a director:**
    Click on a director name to see detailed information on the director and movies from that director

8. **View Details about a genre:**
    Click on a genre to see detailed information on the genre and a list of movies from that genre

9. **View List of movies of the same release year**
    Click on a release year to see a list of movies from the same year

10. **Manage Profile:**
    Users can view and edit their profile, see  and remove their favorite movies, and delete their account

## <a name="technologiesUsed"></a>Technologies Used
* **React** 
* **React Router** 
* **Redux** 
* **Parcel** 
* **Bootstrap** 
* **Bootstrap Icons**
* **Prop-Types**
* **JavaScript (ES6+)**
* **Netlify**
* **HTML5/CSS3**
* **SASS**
* **REST API**


## <a name="credits"></a>Credits

This project was developed by Jasmin as part of the CareerFoundry Full-Stack Web Development course 2024/2025.

**Special thanks to:**
* CareerFoundry mentors and tutors
* Online resources and tutorials for React, Parcel, and Bootstrap

## <a name="license"></a>License

This project is licensed under the MIT License. See the LICENSE file for details.