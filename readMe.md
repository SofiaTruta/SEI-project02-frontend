# Patient Bookr - description

This project was an assignment part of General Assembly’s Software Engineering Immersive Bootcamp. The goal was to get familiar with Single Page Application development, both backend and frontend, in a MEVN environment (MongoDB, Express.js, Vue.js and Node.js) as well as CRUD data operations and user authentication via OAuth. 

*this is the frontend repo only - please find the backend repo [here](https://github.com/SofiaTruta/SEI-project-02-backend)*

Considering my previous experience in healthcare, the idea of an appointment tracker / portal was very familiar and felt like the right project to showcase ability to manage a database as well as dynamically displaying data using Vue.js and Vuetify.

## Deployment Link

https://patient-bookr.netlify.app/

To be able to experience all the features of this project as a user, you are required to register / sign in using Google OAuth. 

## Timeframe 

This was a solo project with a timeframe for development of 7 days. 

## Technologies Used

**Backend**
- Express.js
- MongoDB
- Google OAuth2

**Frontend**
- Vue.js
- Vuetify
- Node.js

Also used Trello for project management and LucidChart for ERD.

## Getting Started / Code installation

This project is divided into two repositories - backend and frontend. This was done for ease of deployment with Netlify. 

To download the code and get it working on your machine, please clone both repositories into your desired location and run both of them at the same time. 
The dependencies required for this project are listed in the package.json file - when inside the project folders (backend and frontend) just run `npm install` on the terminal to get them ready.  

Additional set up:
- a database with MongoDB - the free version is appropriate for this project. 
- Register your project with Google Cloud Development, in order to obtain a clientID and secret for implementing OAuth2
- A .env file in both backend and frontend projects for storing information securely (please see the .env.example document)

## MVP requirements
- Have at least 2 data entities (data resources) in addition to the User Model. 
- Use OAuth authentication.
- Have full-CRUD data operations somewhere within the app's feature
- Implement basic authorisation that restricts access to features that need a logged in user in order to work (typically CUD data operations)
- have a consistent and polished user interface

## Planning

Planning involved creating wireframes to visualize the frontend design and layout, as well as an entity relationship diagram (ERD) to plan relationships between database collections.

While my initial project idea was to grant different access to professionals and patients, I realised that this might be difficult to achieve within the provided timeframe. So, I changed the focus to an app for professionals only to deliver a more consistent product.

ERD
![ERD for project](https://i.imgur.com/OaElpze.png)

A couple of the initial wireframes
![wireframe for main view](https://i.imgur.com/xAyztjv.png)

![wireframe for creating a new appointment](https://i.imgur.com/c7ZxqY7.png)


## Build Process

I kept a daily log of goals achieved each day to track the project's evolution. 

### Day 1
- Completed project preparation, including the Trello board, the start of the ReadMe, and the last wireframes.

Started coding the backend:
- Established a connection to the database
- Created the models
- Set up endpoints to get, delete, and update data.

Began coding the frontend:
- Set up main.js with imports and mounted the Vue app
- Created the main components for the project
- Set up the router and routes

### Day 2
- Chose an official brand name for the App to register it with Google OAuth
- Set up google OAuth on front end and backend
- Set up cookies
- Implemented redirecting to the home page after signing in
- Started fetching data onto home page

Obstacles:
- realised that my Professional Model did have an email as a required field, which is needed for google authentication. 

### Day 3
- With help from the instructional team, worked out logic to populate the models and improved the referencing between them. 
- Created the main page view, which dynamically accesses information from the database. 
- Added delete functionality for appointments
- Added edit functionality for existing appointments

Here is a code snippet for my Appointment Schema:

```
const appointmentSchema = new Schema({
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['upcoming', 'missed', 'completed'],
        required: true,
        default: 'upcoming'
    },
    patientDetails: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient'
    },
    professionalDetails: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Professional'
    }
})

```

Here is a code snippet for one of the backend's GET requests:
```
//gets both professionals and appointments
app.get('/professionals', async (request, response) => {
    try {
        const allAppointments = await Appointment.find({}).populate('patientDetails')

        const allProfessionals = await Professional.find({}).populate('appointments')
        response.json({ allProfessionals, allAppointments }
        )
    } catch (error) {
        console.log('backend problems getting professionals', error)
    }
})

```

### Day 4
- Started styling using the Vuetify library
- Gained more in-depth knowledge of Vue.js capabilities with props and custom events
- Adapted current code to work  with the styling
- Set up the navigation bar

### Day 5
- Styled the landing page
- Fixed bugs with the help of the instructional team (e.g., landing page not redirecting to the home automatically, unable to close the dialog box when clicking buttons)
- Made small adjustments to styling and recreated the functionality of the main page in other views (e.g., the ability to create a new appointment from a single appointment view)

### Day 6
- Fixed a date-related bug: the edit functionality not pre-populating due to date formatting.
- Harmonised the style between different views
- Created a “My Patients view”
- Fixed a bug related to page (state) refreshing that occurred throughout the application
- Created new functionality: appointment status (upcoming, missed, completed)

### Day 7
- Added a single patient view 
- Changed appointment status based on date
- Created a missed appointments view
- Tested functionality with different new users and fixed bugs related to route protection
- Further styled for mobile responsiveness

## Challenges

I did not visualise the frontend in enough detail to understand exactly what data I’d need to get in each component. As a result, my code (both in backend and frontend) is not as efficient as it could be. Going forward, I intend to do more planning and try to anticipate what data each component will need to access before working on the backend.

I could not successfully get an endpoint that retrieves all the appointments for a single patient. This means that my frontend methods are bulkier than I hoped for. 

Dealing with timings between API calls to the database and updating/re-rendering Vue.js components often caused problems with accessing the data. I feel like I have a much better understanding of this now and will be aware of it for future projects. 

## Wins

It was very rewarding when I was able to understand and feel comfortable in dealing in the full stack operations and CRUD operations with the database. 

I also really enjoyed learning how to use a CSS library (Vuetify), it was a very relaxing part of the project!

## Key Learnings

A big learning point from this project was understanding that really visualising the frontend and what data you’ll need to access at what point is really helpful to setup a more efficient backend and good database Models that reference each other well. 

I feel quite comfortable working with Vue.js and Vuetify at this point, and I would like to come back to them after the project to keep learning. I have also realised that choosing if/which frontend library is going to be used can be helpful in laying out the skeleton of the web app and create a more uniform look from the beginning.

## Known Bugs

Logout bug: application currently not refreshing access tokens after a few minutes. Token from google OAuth expires after the default 1 hour, so if the page is not refreshed before then, the logout button does not work

Creating New Appointment: I have been unable to identify why, but when a new User creates an appointment for the first time, it does not register - but after refreshing the page, all the functionalities work fine. 
This was only identified after after deployment. 

## Future Improvements

I would like to fix the bug around creating an appointment for the first time. 

I also intend on refactoring the backend using routers and controllers for a more efficient and clean layout.
