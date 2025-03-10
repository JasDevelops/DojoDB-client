# DojoDB-client

*DojoDB-client* is a client-side **single-page application (SPA)** for martial art movie enthusiasts. It is built using **React** and provides a responsive, user-friendly interface (styled via **Bootstrap**). It connects to a **RESTful API** to provide information about selected movies.

This project was generated using [Create React App](https://reactjs.org/docs/create-a-new-react-app.html).

---

## Table of Contents

- [Features](#features)
- [How to Use](#how-to-use)
- [Setup](#setup)
- [Development](#development)
- [Technology Used](#technology-used)
- [Additional Resources](#additional-resources)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

---

## <a name="features"></a>Features:

- **Browse Movies**: View a list of martial art movies with detailed information.
- **Search Movies**: Search for movies by title or filter by genre, director, release year, and actors.
- **Detailed Information**: View information about movies, genres, directors, and actors.
- **Manage Profile**: Create, modify, or delete your account. Manage your favorite movies.
- **Responsive UI**: Designed using **Bootstrap** for a responsive and smooth user experience.
- **Movie Filters**: Filter movies by title, genre, director, release year, and actors.
- **Search Form**: Access a search form in the offcanvas menu to find movies and other details.

---

## <a name="how-to-use"></a>How to Use:

- **Login or Signup**: Create an account to access the database and log in to manage your favorites.
- **Browse Movies**: The main view displays a grid of movies, including titles, descriptions, genres, and thumbnail images.
- **Filter Movies**: Use dropdown filters for genre, director, release year, and title. You can clear filters individually or using the "Clear All" button.
- **Search Movies**: Use the search form in the offcanvas menu to find movies based on keywords.
- **View Movie Details**: Click on any movie to see more detailed information, including cast and crew.
- **View Actor Details**: Click on an actor's name to view their roles and the movies they've appeared in.
- **View Director Details**: Click on a director's name to learn more about them and see movies directed by them.
- **View Genre Details**: Click on a genre to view detailed information about that genre and a list of movies in that genre.
- **View Movies from the Same Release Year**: Click on a release year to view a list of movies from that year.
- **Manage Profile**: Edit your profile, remove favorite movies, and delete your account.

---

## <a name="setup"></a>Setup:

### Pre-requisites

**Node.js**
**npm** (Node Package Manager)

### Installation

1. **Clone the Repository**
   `git clone https://github.com/JasDevelops/DojoDB-client.git`

2. **Navigate to Project Folder**
   `cd DojoDB-client`

3. **Install Dependencies**
   With npm: `npm install`  
   With yarn: `yarn install`

---

## <a name="development"></a>Development

### Development Server

1. **To start a local development server, run:**
   `npm start`

2. **Access in Browser**
   Go to `http://localhost:1234/`
   The application will automatically reload whenever you modify any of the source files.

---

## <a name="technology-used"></a>Technology Used:

- **React**: JavaScript library for building user interfaces.
- **React Router**: Routing library for React apps to handle navigation.
- **Redux**: State management for the app.
- **Bootstrap**: CSS framework for responsive design.
- **Prop-Types**: Typechecking for props in React components.
- **Node.js**: JavaScript runtime environment.
- **npm**: Package manager for managing dependencies.
- **REST API**: Backend API to handle data for the app.

---
## <a name="additional-resources"></a>Additional Resources:

For more information on using React and related technologies, visit the following resources:

- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [React Router Documentation](https://reactrouter.com/)
- [Redux Documentation](https://redux.js.org/)
- [Bootstrap Documentation](https://getbootstrap.com/)

---

## <a name="contributing"></a>Contributing:

You are very welcome to contribute!

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature-branch`.
3. Commit your changes: `git commit -m 'Add new feature'`.
4. Push the branch: `git push origin feature-branch`.
5. Submit a pull request.

Please follow the code formatting guidelines and include tests for new features where applicable.

---

## <a name="license"></a> License:

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

---

## <a name="acknowledgments"></a> Acknowledgments:

- **React Team** for the framework.
- **Bootstrap** for providing a great UI component library.
- **CareerFoundry Mentors and Tutors** for guidance and support.
- **GitHub Pages** for hosting the frontend.
