
http://v1k45.com/blog/modern-django-part-1-setting-up-django-and-react/

https://www.valentinog.com/blog/drf/#Django_REST_with_React_Django_and_React_together

# Django_React_Redux_tutorial
### pipenv shell
Creating a virtualenv for this project...

### pipenv install django

### django-admin startproject backend

### cd backend

### python manage.py startapp [appname]
### python manage.py startapp backend
Check line 299 first .

# Database 
By default database is sqllite3 if u wanna attack any else just go to settings.py in the backend folder and gice proper credentials to attach any db its on Django docs

https://docs.djangoproject.com/en/4.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}



first step add the newly made app todo in the list of installed apps in the sttings.py folder of the project(Backend).

# Create a model (authentication later)
Then we create a model class called Leads where we make the model what will be the input from the user.

    from django.db import models
    class Lead(models.Model):
        name = models.CharField(max_length=100)
        email = models.EmailField(max_length=100, unique=True)
        message = models.CharField(max_length=500, blank=True)
        created_at = models.DateTimeField(auto_now_add=True)
    
## adding an image and use of "choices" in djnago model

    name = models.CharField(max_length=100)
    email = models.EmailField(max_length=100, unique=True)
    message = models.CharField(max_length=500, blank=True)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES)
    image = models.ImageField(upload_to='leads_images/')  # Specify the upload directory
    
    owner = models.ForeignKey(
        User, related_name="leads", on_delete=models.CASCADE, null=True)
    created_at = models.DateTimeField(auto_now_add=True)    

Lemme tell you what these are

    ### name = models.CharField(max_length=100):
    This field represents the name of a user or entity. It's a character field (string) that can store up to 100 characters. It's commonly used to store names or titles.
    
    ### email = models.EmailField(max_length=100, unique=True):
    This field stores an email address. It's an EmailField, which is a specialized CharField that performs email validation. The unique=True parameter ensures that each email address is unique within the database, preventing duplicate email entries.
    
    ### message = models.CharField(max_length=500, blank=True):
    This field represents a message or text input. It's a character field that can store up to 500 characters. The blank=True parameter allows the field to be left empty (i.e., not required).
    
    ### gender = models.CharField(max_length=1, choices=GENDER_CHOICES):
    This field represents a person's gender. It's a character field that can store a single character (e.g., 'M' for Male). The choices attribute restricts the possible values to a predefined set of options (e.g., 'M', 'F', 'O' for Male, Female, Other). The actual value stored in the database corresponds to the chosen option.
    
    ### image = models.ImageField(upload_to='leads_images/'):
    This field is used to store an image file. It's an ImageField that allows users to upload image files. The upload_to parameter specifies the directory where uploaded images will be stored relative to your media storage.
    
    ### owner = models.ForeignKey(User, related_name="leads", on_delete=models.CASCADE, null=True):
    This field represents a foreign key relationship to the User model. It establishes a connection between this model and the User model. The related_name parameter allows you to access related Lead instances from a User instance using the leads attribute. The on_delete=models.CASCADE parameter specifies that when a related User is deleted, the associated Lead instances are also deleted. The null=True parameter allows the field to be null if no user is associated.
    
    ### created_at = models.DateTimeField(auto_now_add=True):
    This field stores the date and time when a record is created. It's a DateTimeField that is automatically set to the current date and time when a new record is added to the database. The auto_now_add=True parameter ensures automatic timestamping at creation.   

##Pillow
### python -m pip install Pillow 
run this command if you want to add image fireld in database

migrate these changes(models) using:
### python manage.py migrate       

After creating the model just write 
### python manage.py makemigrations [appname]

It will register the mdoel in the DBand it will write sql code (CRUD operations) for us we dont have to wwrite it by self
then,

Operations to perform:
  Apply all migrations: admin, auth, contenttypes, sessions, leads
  

Inorder to see the CRUD operations that we were auto made we need to make an admin site interface. Django got that covered
So register the model in admin.py  file of newly made app leads 


# Create SuperUser for admin things
open the admin.py of the backend folder and write:

    from django.contrib import admin
    from .models import Lead
    # Register your models here.
    class LeadAdmin(admin.ModelAdmin):  # add this
        list_display = ('name', 'email', 'message', 'gender', 'image')  # add this
    
    admin.site.register(Lead, LeadAdmin)  # add this    
    

python manage.py createsuperuser
give the credentials

Goto http://127.0.0.1:8000/admin and see the magic

## Serialziers
Now inorder to make API's we need to install Serializers from Django Rest Framework and 
we also need Django Cors headers in order to whitelist port 3000 for React frontend
##Attention!
### Since we are creating the react app inside the Django admin so we donot need a cors header
### pipenv install djangorestframework django-cors-headers

add these in the installed apps of backend settings
    'corsheaders',
    'rest_framework',
add this in middleware []    
    'corsheader.middleware.CorsMiddleware',

## Create Serializers for model (leads)

The job of serializers is to convert models into JSON format so frontend can easily work with the data
So we create serializers.py file in the leads folder
the code will look like this

    from rest_framework import serializers
    from leads.models import Lead     
    # Lead Serializer
    class LeadSerializer(serializers.ModelSerializer):
      class Meta:
        model = Lead 
        fields = '__all__'
        
## creatiing a viewset for this serializer
open api.py file in leads folder to add a view set in the 

    from leads.models import Lead
    from rest_framework import viewsets, permissions
    from .serializers import LeadSerializer
    
    # Lead Viewset
    
    class LeadViewSet(viewsets.ModelViewSet):
        
        queryset = Lead.objects.all()    # that will get all leads object (no auth until now)
        
        permission_classes = [
            permissions.AllowAny,
        ]
        serializer_class = LeadSerializer

        
    
## Creating URL's
open urls.py file in backend and create routes that we will lead to our resouce app (leads)
update the code in the url.py 

    from django.contrib import admin
    from django.urls import path,include
    
    urlpatterns = [
        path('admin/', admin.site.urls),
        path('', include('lead.url'))
        
    ]
notice we dont mention path beacuse any api request that will have 'leads' init is auromatically handeled by (leads.url) file
lets implement this url file in the urls.py file in the [leads] folder. (you  have to make it )
write this code:

    from rest_framework import routers
    from .api import LeadViewSet
    
    router = routers.DefaultRouter()
    router.register('api/leads', LeadViewSet, 'leads')
    
    urlpatterns = router.urls


later on we will add authentication


also write 
### CORS_ORIGIN_WHITELIST = ('http://localhostl:3000')




## Creating Front-end

make new folder frontend using 

### python manage.py startapp frontend

run this command where your manage.py and backend is present (check via 'ls' command)
Add this startapp(frontend) in the settings.py file of the backend file




lets make couple folders where react can live in. We wont use npx create-react-app becoz we are integrating react into django not a separate server. all components cnnected with a single index.html file

things needed -> babel , webpack , presets , babel loader.

        frontend
        ├───src
        │   └───components ()
        ├───static
        │   └───frontend (to connect with django)
        └───templates
            └───frontend (gonna handle html file)

Now come back to folder where your pip file  pip lock file is rpessent (check with ls)
make package.json file with command
### npm init -y
-y cuz it doesntn ask us much questions

## Installing webpack as dev dependency
### npm i -D webpack webpack-cli

## installing babel
transpiling javascript es6 or 7 feattures present transpiles  older versions of javascript

### npm i -D @babel/core babel-loader @babel/preset-env @babel/preset-react babel-plugin-transform-class-properties
In summary, these dependencies are part of the Babel ecosystem and are commonly used when setting up a JavaScript development environment, especially for projects that use modern JavaScript features (ES6+) and frameworks like React. They enable you to write code using the latest language features while ensuring compatibility with a wide range of browsers and environments through transpilation and transformation.

### npm i react react-dom prop-types
installing react necessary for this project

your package.json should look like this 

    {
      "name": "react-redux-django",
      "version": "1.0.0",
      "description": "",
      "main": "index.js",
      "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1"
      },
      "keywords": [],
      "author": "",
      "license": "ISC",
      "devDependencies": {
        "@babel/core": "^7.22.10",
        "@babel/preset-env": "^7.22.10",
        "@babel/preset-react": "^7.22.5",
        "babel-loader": "^9.1.3",
        "babel-plugin-transform-class-properties": "^6.24.1",
        "webpack": "^5.88.2",
        "webpack-cli": "^5.1.4"
      },
      "dependencies": {
        "prop-types": "^15.8.1",
        "react": "^18.2.0",
        "react-dom": "^18.2.0"
      }
    }

make a bable.rc file in this directory add these plugins:

    {
        "presets": ["@babel/preset-env", "@babel/preset-react"],
        "plugins": ["transform-class-properties"]
    }
lets make webpack.config.js file add this in it :
basically uding it to load babel loader it will transpile our code.

    module.exports = {
        module: {
          rules: [
            {
              test: /\.js$/,
              exclude: /node_modules/,
              use: {
                loader: "babel-loader"
              }
            }
          ]
        }
      }

## Few changes in package.json file

change from test to dev in scripts

    "scripts": {
        "dev": webpack --mode devlopmnt --watch ./backend/backend/frontend/src/index.js --output-path ./backend/backend/frontend/static/frontend/main.js,
        "build": webpack --mode production --watch ./backend/backend/frontend/src/index.js --output-path ./backend/backend/frontend/static/frontend/main.js
      },
The tutorial i watched had only --output as syntax which gave an error so i check stack over flow and got my solution.
# MUST SEE -> 
You may be wondering why the ./backend/backend i did mistake .... i made the name of djanngo project backend and as well startapp name backend you can avoid it :)
This will run webpack it will dev mode it will be entry point of react which will index.js file in the source folder and then output it to staic folder    
When working in project npm run dev
When you want to deploy use npm run build

now lets make these dependencies
1. make src->index.js file

        import App from './components/App';

2. src->components-> App.js file

        import React, { Component } from 'react';
        import { createRoot } from 'react-dom/client';
        import Header from './Header';
        
        class App extends Component {
            render() {
                return (
                    <Header />
                );
            }
        }
        
        const root = document.getElementById('app');
        if (root) {
            const reactRoot = createRoot(root);
            reactRoot.render(<App />);
        }
        
3. templates->frontend->index.html file

        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="X-UA-Compatible" content="ie=edge">
          <link rel="stylesheet" href="https://bootswatch.com/4/cosmo/bootstrap.min.css">
          <title>Lead Manager</title>
        </head>
        <body>
          <div id="app"></div>
          {% load static %}
          <script src="{% static "frontend/main.js" %}"></script>
          <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.6/umd/popper.min.js" integrity="sha384-wHAiFfRlMFy6i5SRaxvfOCifBUQy1xHdJ/yoi7FRNXMRBu5WHdZYu1hA6ZOblgut" crossorigin="anonymous"></script>
          <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/js/bootstrap.min.js" integrity="sha384-B0UglyR+jN6CkvvICOB2joaf5I4l3gm9GU6Hc1og6Ls7i6U/mkkaduKaBhlAXv9k" crossorigin="anonymous"></script>
        </body>
        </html>
    look at the code <script src="{% static "frontend/main.js" %}"></script>
    next we upload bootswatch  that has react UI
    some regular bootstrap
4. In the views.py file of the frontend startapp you have to to link it with template folder index.html file  

        from django.shortcuts import render
        
        def index(request):
          return render(request, 'frontend/index.html')
    Worried too many frontend directories ??? dont worry the framework will take care of it.(I hope so!)

5. Create URls.py file in the startapp frontend to connect it  with main url.py that is present in the backend.
    code will go like this in the urls.py of frontend
            
        from django.urls import path
        from . import views
        
        urlpatterns = [
            path('', views.index), 
        ]
   Now to connect urls.py file of frontend(startapp) and main backend(project)  urls.py file we update the urls.py file of the backend.

        urlpatterns = [
            path('admin/', admin.site.urls),
            path('', include('frontend.urls')), # front end loads beofre the leads
            path('', include('leads.urls')),    
        ]

## Now we wanna check the npm run dev

so goto root ... where you have files like pipfile package.json (check by ls)
When the npmrun dev hits you will a file is created in sttaic -> front-> directory as main.js folder.
this is our compiled APP in javascript.
Now rumn python manage.py runserver to check  if its working.

It means when we use npm run build main.js file will be uploaded in the static->frontend directory
## Add bootstrap and reactstrap in front end

## Error
If react-dom.development.js:86 Warning: You are importing createRoot from "react-dom" which is not supported. You should instead import it from "react-dom/client".
Get this error its rasy to get rid of it just google it.
But main thing is that Please clear the cache of your  browser.Sometimes, old JavaScript code might be cached, causing unexpected behavior.

Now Create the Structure of your front end-> src -> components like this

    Components
        |___App.js
        ├───layout
        |        |__Header.js
        |        
        └───leads
               |__Dashboard.js Include the form and leads compomnents in the dashboard.js use rfce and just write <div> this is [component_name] component</div>
               |__Form.js
               |__Leads.js
Your App.js file should look like this.

    import React, { Component, Fragment } from 'react';
    import { createRoot } from 'react-dom/client';
    import Header from './layout/Header';
    import Dashboard from './leads/Dashboard';
    
    class App extends Component {
        render() {
            return (
                <Fragment>
                    <Header/>
                    <div className='container'>
                        <Dashboard />
                    </div>
                </Fragment>            
            );
        }
    }
    
    const root = document.getElementById('app');
    if (root) {
        const reactRoot = createRoot(root);
        reactRoot.render(<App />);
    }
# Apllying Redux and HTTP protocol
## what is a reducer ?
1. Its best u install redux webtools in extensions of your browser.
   # npm i redux react-redux redux-thunk  redux-devtools-extension
        redux: Manages the global state of your application using a predictable state container.
        react-redux: Integrates Redux with React by providing components and hooks to connect components to the Redux store.
        redux-thunk: Middleware that enables you to write asynchronous action creators.
        redux-devtools-extension: Browser extension for enhanced Redux debugging.
2. With redux we need to create a store,js file in src folder of frontend. Write the following the code init.

        import { createStore, applyMiddleware } from 'redux'; 
        import { composeWithDevTools } from 'redux-devtools-extension';
        import thunk from 'redux-thunk';
        import rootReducer from './reducers';
        
        const initialState = {};    //our store will have an eempty state which is null
        
        const middleware = [thunk];
        
        const store = createStore(
          rootReducer,
          initialState,
          composeWithDevTools(applyMiddleware(...middleware)),    //since we using devtools
        );
        
        export default store;

3. lets make a root reducer which is just a meeting place for all ither reducers. Make a reducers folder in src and make a index.js file init. Add follwoing code.

       import { combineReducers } from 'redux';
        
        export default combineReducers({
        });
        //What u wanna bring in this combine reducers?? store, auth ,....

4. How to connect redux with react in App.js file
    use provider and it will take store as a prop

        import React, { Component, Fragment } from 'react';
        import { createRoot } from 'react-dom/client';
        import Header from './layout/Header';
        import Dashboard from './leads/Dashboard';
        import { Provider } from 'react-redux';
        import store from '../store';
   
        class App extends Component {
            render() {
                return (
                    <Provider store = {store}>
                    <Fragment>
                        <Header/>
                        <div className='container'>
                            <Dashboard />
                        </div>
                    </Fragment> 
                    </Provider>
                );
            }
        }
        
        const root = document.getElementById('app');
        if (root) {
            const reactRoot = createRoot(root);
            reactRoot.render(<App />);
        }
   You might get nothing in inspect element => redux since there is no reducer in store. Lets make them. Reducer folder will have following files each is a rediucer
   
       auth.js    
       errors.js
       index.js
       leads.js
       messages.js
   
  Your index.js file in the reducer will be updated as:

    import { combineReducers } from 'redux';
    import leads from './leads';
    import errors from './errors';
    import messages from './messages';
    import auth from './auth';
    
    export default combineReducers({
        leads,
        errors,
        messages,
        auth,    
    });
  Now we will implement all (./leads ./errors ./messages ./auth)step by step.
  
5. Leads Reducer.
    
    Q. What is a reducer...
    Reducer is basically takes in an action and evaluates the action (CRUD operations) and send some state that what action does. We define it with types means create delete 
    update read. All these types are defined in the types.js file of action folder.
    So we need to setup actions folers in src and create a types.js file init.
    src->actions->types.js types are basciallly instance variables.
    Define all of them at once we will be using in this project

        export const GET_LEADS = 'GET_LEADS';
        export const DELETE_LEAD = 'DELETE_LEAD';
        export const ADD_LEAD = 'ADD_LEAD';
        export const GET_ERRORS = 'GET_ERRORS';
        export const CREATE_MESSAGE = 'CREATE_MESSAGE';
        export const USER_LOADING = 'USER_LOADING';
        export const USER_LOADED = 'USER_LOADED';
        export const AUTH_ERROR = 'AUTH_ERROR';
        export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
        export const LOGIN_FAIL = 'LOGIN_FAIL';
        export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
        export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
        export const REGISTER_FAIL = 'REGISTER_FAIL';
        export const CLEAR_LEADS = 'CLEAR_LEADS';

    Our leads.js in the reducers folder will look like this 

        import { GET_LEADS, DELETE_LEAD, ADD_LEAD, CLEAR_LEADS } from '../actions/types.js';
    
        const initialState = {
          leads: [],
        };
        
        export default function (state = initialState, action) {
            switch (action.type) {
              case GET_LEADS:
                return {
                  ...state, // we using ... cuz we wanna
                  leads: action.payload,
                };
            //   case DELETE_LEAD:
            //     return {
            //       ...state,
            //       leads: state.leads.filter((lead) => lead.id !== action.payload),
            //     };
            //   case ADD_LEAD:
            //     return {
            //       ...state,
            //       leads: [...state.leads, action.payload],
            //     };
            //   case CLEAR_LEADS:
            //     return {
            //       ...state,
            //       leads: [],
            //     };
            //   default:
            //     return state;
            }
          }   
   We have the case GET_LEADS, DELETE_LEADS now we need to implement these cases ... we need leads.js action file in the actions folder lets create it.
   src->actions->leads.js.
   Any actions we gonna fire off wil go here. This is where our http requests go. So install axios.
### npm i axios
   Lets define our actions 

    //any actions  that we fire off will come here.
    // out http requests come here.
    
    import axios from 'axios';
    import { GET_LEADS } from './types';
    
    
    import { GET_LEADS, DELETE_LEAD, ADD_LEAD } from './types';
    
    export const getLeads = () => (dispatch) => {
      axios
        .get('/api/leads/')
        .then((res) => {
          dispatch({
            type: GET_LEADS,
            payload: res.data,
          });
        })
        .catch((err) => console.log(err));
    };
        
    ///DELETE LEAD
    //export const deleteLead = (id) => (dispatch, getState) => {
    
    export const deleteLead = (id) => (dispatch, getState) => {
      axios
      .delete(`/api/leads/${id}/`)    //.delete(`/api/leads/${id}/`, tokenConfig(getState))
      .then((res) => {
          //dispatch(createMessage({ deleteLead: 'Lead Deleted' }));
          dispatch({
            type: DELETE_LEAD,
            payload: id,
          });
        })
        .catch((err) => console.log(err));
    };
    
    // ADD LEAD
    //export const addLead = (lead) => (dispatch, getState) => {
    
    export const addLead = (lead) => (dispatch) => {
      axios
      .post('/api/leads/', lead)    //.post('/api/leads/', lead, tokenConfig(getState))
      .then((res) => {
        //dispatch(createMessage({ addLead: 'Lead Added' }));
        dispatch({
            type: ADD_LEAD,
            payload: res.data,
          });
        })
        .catch((err) => console.log(err));    
        // .catch((err) => dispatch(returnErrors(err.response.data, err.response.status)));
    };
    
  Commented the rest code just look at GET_LEADS fucntion it will get the leads list from api url -> http://localhost:8000/api/leads although we dont have to add this cuz 
  we on the same server.

6. Now where do wanna call this action ? In the component which is rendering our leads list.
   So goto components->leads->leads.js. You will need connect from react-redux and prop-types
   components->leads->leads.js code will be updated as:-

        import React, { Component, Fragment } from 'react';
        import { connect } from 'react-redux';
        import PropTypes from 'prop-types';
        import { getLeads } from '../../actions/leads';
        
        function Leads() {
          return (
            <div>Leads List</div>
          )
        }
        
        //map state of redux initial state what we defined in reducers(leads.js) to props of this component.
        const mapStateToProps = (state) => ({
          leads: state.leads.leads, //first lead is reducer name and 2nd lead is state name.
        });
        
        
        export default connect(mapStateToProps)(Leads);

     open the redux dev tool and u might not see any lists data coming from the api. leads[] in the state would be empty. It is beacuse we heavent really called the get_ 
     leads() function (src->actions->leads.js_actions) to fetch the data from the API.
     SO the export default code into and above the render() function add the componentDidmount() function which tells when this component loads fire the get_leads() 

       componentDidMount() {
            this.props.getLeads();
       }

       export default connect(mapStateToProps)(Leads);                   
    ALso we need to make our component ClassComponents to use these methods:
    The updated code will be:

        //src->components->leads.js
        import React, { Component } from 'react';
        import { connect } from 'react-redux';
        import PropTypes from 'prop-types';
        import { getLeads } from '../../actions/leads';
        
        class Leads extends Component {
          static propTypes = {
            leads: PropTypes.array.isRequired,
            getLeads: PropTypes.func.isRequired,
          };
        
          componentDidMount() {
            this.props.getLeads();
          }
        
          render() {
            return (
              <div>
                <h2>Leads List</h2>
                {/* Render your leads data here */}
              </div>
            );
          }
        }
        
        const mapStateToProps = (state) => ({
          leads: state.leads.leads,
        });
        
        export default connect(mapStateToProps, { getLeads })(Leads);
   
   The code runs perfectly (if u dont have errors lol) now we need to create UI for this api data to render in the component.
   Update the return() of the component with the following code.

          <Fragment>
            <h2>Leads</h2>
    
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Message</th>
                  <th>Gender</th>
                  <th>Image</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {this.props.leads.map((lead) => (
                  <tr key={lead.id}>
                    <td>{lead.id}</td>
                    <td>{lead.name}</td>
                    <td>{lead.email}</td>
                    <td>{lead.message}</td>
                    <td>{lead.gender}</td>
                    <td>
                      {/* Render the image using the <img> element */}
                      <img src={lead.image} alt={`Image for ${lead.name}`} />
                    </td>
                    {/* <td>
                      <button
                        onClick={this.props.deleteLead.bind(this, lead.id)}
                        className="btn btn-danger btn-sm"
                      >
                        {' '}
                        Delete
                      </button>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </Fragment>
    This above already contains the delete button to delete certain data from api. Now You just need to implement Delete_Leads function to make it work which has 
    already been provided with the get_leads (in commented form). However there is still some funcitonalities commented within them that means they are expected       to be used later on.       
&. Delete_Leads and Add_Leads

       Source is already given in commented form (src->componets->actions->leads.js)
9. Remaining Cases in the reducers folder.    
# Authentication in Django

### pipenv install django-rest-knox


    
