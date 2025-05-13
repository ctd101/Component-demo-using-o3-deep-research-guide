# Building a What3Words AutoSuggest Front-End
## on Replit

In this guide, we'll walk through creating a proof-of-concept React app on Replit that integrates the
What3Words AutoSuggest component. The app will let users type into a search box, pick a three-word
address suggestion, and display the selected address (and optionally its coordinates) below. We’ll cover
setting up a React Replit project, installing the What3Words component, managing the API key, and
testing and deploying your app.

## Starting a React Project on Replit

To get started, create a new React project on Replit:

## Create a New Repl: Log in to Replit and click the Create Repl button. In the Template

```
       dropdown, choose React. This will set up a new Repl with a basic React app environment.
    2. Name Your Project: Give your Repl a name (e.g., w3w-react-demo ) and click Create Repl.
       Replit will generate a project with the standard React structure (including an src folder with
        App.js and other files).
    3. Run the Default App: Hit the Run button to verify the starter app works. You should see a
       default React welcome page in the preview. This confirms your React environment is set up.

```

**Tip:** The default template may include boilerplate content (like a logo and some text in App.js ). You

can remove or replace this content, as we'll be writing our own app UI next.

## Installing the What3Words AutoSuggest Component

Next, add the What3Words React component library to your project. The library @what3words/react-
components provides a ready-made AutoSuggest input for React

  • Using Replit's Package Manager: In the Replit sidebar, click the Packages icon (cube shape).
```
       Search for "@what3words/react-components" . Select the package and click + to install it.
       This will add the library to your package.json .
     • Using npm: Alternatively, open the Replit Shell (click the >_ icon) and run:

         npm install @what3words/react-components

       This achieves the same result, installing the What3Words React components package.

```

After installation, you should see @what3words/react-components listed in your dependencies.
Now you're ready to use the AutoSuggest component in your code.

## Adding Your What3Words API Key on Replit

To use the AutoSuggest component and the What3Words API, you need an API key:

## Obtain an API Key: If you don't have one, sign up for a free developer API key on the

```
       What3Words developer site. Copy your API key string.
    2. Store the Key in Replit Secrets: In your Replit project, click the Lock icon (Secrets) in the
       sidebar. This is where you can add environment variables securely (it functions like a hidden
        .env file). Add a new secret:
    3. Key: for example, REACT_APP_W3W_API_KEY (the REACT_APP_ prefix ensures it will be
       available in the React app).
    4. Value: your What3Words API key string.
    5. Use the Key in Code: Replit will inject this as an environment variable. In your React code, you
       can access it via process.env.REACT_APP_W3W_API_KEY . We will use this variable so we
         don't expose the raw key in our code.

```

Now the API key is set up and ready to be referenced in our React app.

## Creating the AutoSuggest Search Component (App.js)

With the library installed and API key ready, let's build the search component. We will use a single React
component (the existing `App.js` ) to keep things simple. The What3Words AutoSuggest is provided as
a React component that wraps a regular <input> field.

Steps:

  • Open the App.js file in the Replit editor.
  • Import the What3Words component and React's state hook.
  • Use useState to manage the selected address (and later coordinates).
  • In the JSX, wrap an <input> with <What3wordsAutosuggest> and pass in your API key. This
```
       turns the input into an AutoSuggest field that calls What3Words API for suggestions as you type

     • Handle the selection event to get the chosen three-word address.
     • Display the selected address in a confirmation box below the input.

```

Replace the contents of App.js with the following code:

```javascript

  import React, { useState } from 'react';
  import { What3wordsAutosuggest } from '@what3words/react-components';

  function App() {
    // State to hold the selected what3words address and (optionally) its
  coordinates
    const [selectedAddress, setSelectedAddress] = useState('');
    const [coordinates, setCoordinates] = useState(null); // optional: will
  hold { lat, lng }

    // Your What3Words API key from the environment variables
    const apiKey = process.env.REACT_APP_W3W_API_KEY;

  // Handler when a suggestion is selected from the dropdown
  const handleSelection = ({ detail }) => {
    if (!detail || !detail.suggestion) return;
    const words = detail.suggestion.words;       // the three-word address
```

selected
setSelectedAddress(words);                     // update state with the
selected address

// (Optional) Fetch coordinates for the selected address using What3Words
API
fetch(`https://api.what3words.com/v3/convert-to-coordinates?words=$
{words}&key=${apiKey}`)
```
       .then(res => res.json())
       .then(data => {
          if (data.coordinates) {
            setCoordinates(data.coordinates);     // save { lat, lng } from
```

API response
```
          }
       })
       .catch(err => console.error('Error fetching coordinates:', err));
  };

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '2rem' }}>
      <h2>What3Words Address Search</h2>
      {/* AutoSuggest input field */}
      <What3wordsAutosuggest
        api_key={apiKey}
        onSelected_suggestion={handleSelection}
      >
        <input
           type="text"
           placeholder="Search for a what3words address (e.g.
```

filled.count.soap)"
```
           autoComplete="off"
           style={{ width: '100%', maxWidth: '400px' }}
        />
        </What3wordsAutosuggest>

      {/* Confirmation box showing the selected address */}
      {selectedAddress && (
         <div style={{ marginTop: '1rem', padding: '1rem', border: '1px solid
#ccc', borderRadius: '4px' }}>
           <p>You selected: <strong>{selectedAddress}</strong></p>
           {/* If coordinates were fetched, display them */}
           {coordinates && (
              <p>Coordinates: {coordinates.lat}, {coordinates.lng}</p>
           )}
         </div>
      )}
    </div>

      );
  }

  export default App;

```

Let's break down what this code does:

    • We import What3wordsAutosuggest from the package and use useState to manage state.
    • We define selectedAddress state to store the chosen 3-word address, and coordinates
```
       state to store latitude/longitude (initially null ).
      • We retrieve our What3Words API key via process.env.REACT_APP_W3W_API_KEY and store it
       in apiKey .
      • In the JSX, <What3wordsAutosuggest api_key={apiKey}> wraps an <input> element.
       This turns the input into an auto-suggest field powered by What3Words. The api_key prop
        provides authentication for the suggestions 3 .
      • We set autoComplete="off" on the input to disable the browser's autocomplete, so it
        doesn't interfere with the W3W suggestions.
      • The onSelected_suggestion={handleSelection} prop listens for the event when the user
       selects one of the suggestions from the dropdown. The component will call our
        handleSelection function with details about the chosen suggestion 4 5 .
      • In handleSelection , we extract the words (the three-word address) from
           detail.suggestion and update selectedAddress . This will trigger a re-render to display
        the confirmation box.
      • We also make an optional fetch call to the What3Words Convert-to-Coordinates API to get the
        latitude and longitude for the selected 3-word address. The request is sent to the endpoint v3/
       convert-to-coordinates with the words and our key as query parameters               6   . On
       success, we update coordinates state with the returned lat and lng .
      • Finally, below the input we conditionally render a confirmation box: when selectedAddress is
       non-empty, a <div> appears showing "You selected: \<the three words>". If coordinates
        were retrieved, we also display the coordinates inside the box.
      • Some inline CSS styling (margins, padding, border) is applied to the confirmation <div> to
       make it stand out as a box.

```

This single component ( App ) encompasses the entire functionality: a search field, selection handling,
and display of results.

## Displaying the Selected Address in a Confirmation Box

When a user picks a suggestion, our stateful component will show a confirmation message. In the code
above, notice the JSX fragment:

```
  {selectedAddress && (
     <div style={{ ... }}>
       <p>You selected: <strong>{selectedAddress}</strong></p>
       {coordinates && <p>Coordinates: {coordinates.lat}, {coordinates.lng}</p>}
     </div>
  )}

```

This uses conditional rendering: the <div> (our confirmation box) only renders if selectedAddress
is not an empty string. Inside, we display the selected three-word address in bold. We also included an
optional paragraph for coordinates – it appears only if coordinates state is set (after a successful API
call).

You can customize the appearance of this box as needed. For example, we added a light border and
padding for clarity. The goal is to clearly confirm which address the user selected.

## (Optional) Converting the Address to GPS Coordinates

The above implementation already includes an optional enhancement: retrieving coordinates using the
What3Words API. If you have included the fetch call in handleSelection , then selecting an address
will automatically fetch its latitude and longitude. These coordinates are then displayed under the
address.

A few notes on this enhancement:

      • The fetch uses the Convert-to-Coordinates endpoint ( /v3/convert-to-coordinates ) with
```
          the selected words and your API key       6   . For example, if the user selected
           "filled.count.soap" , the request URL will look like:

            https://api.what3words.com/v3/convert-to-coordinates?
            words=filled.count.soap&key=YOUR_API_KEY

         • The API will return a JSON containing the coordinates. We update the state coordinates with
           data.coordinates (which includes lat and lng ).
         • We wrap the fetch call in a .catch to log errors (in case the API call fails or the key is wrong). In
           a production app, you might handle errors more gracefully (e.g., show a message to the user),
           but for this proof-of-concept logging to console is sufficient.
         • If you prefer not to use the API call, you can omit the fetch portion. The app will still work — it
           will just display the selected 3-word address without coordinates.

```

Make sure your API key is correct and has permissions for the convert-to-coordinates API (the key from
What3Words should enable standard API functions by default).

## Testing Your What3Words AutoSuggest Feature

With the coding done, it's time to test the functionality:

      • Run the App: Click the Run button in Replit to start the development server. The preview pane
```
           (on the right) will load your React app. You should see your search input and a heading.
         • Try the AutoSuggest: Start typing in the input field. For example, type filled.count . You
          should see a dropdown of suggested addresses that start with those words (like
           filled.count.soap , filled.count.soapy , etc.). This indicates the AutoSuggest
           component is correctly calling the What3Words API and retrieving suggestions as you type.
         • Select an Address: Click on one of the suggestions in the dropdown (or use arrow keys + Enter).
           The input field will populate with the selected three-word address. Immediately below the field,
           the confirmation box should appear, displaying "You selected: filled.count.soap" (with your

       chosen words). This confirms our onSelected_suggestion handler ran and updated the
       state.
     • Verify Coordinates (if enabled): If you implemented the coordinate fetch, the confirmation box
       will also show Coordinates (latitude, longitude). For instance, for filled.count.soap you
       might see something like Coordinates: 51.520847, -0.195521 (the coordinates for that
       what3words address). These should match the location of the address.
     • Try Other Addresses: Test with other inputs. For example, try typing a random three-word
       combination or parts of it. The autosuggest should only show valid combinations or corrections.
       You can also try typing a full valid what3words address (e.g., "index.home.raft" ) and
       pressing Enter – the component should recognize it as valid and trigger the selection handler.
     • Troubleshooting: If you don't see suggestions:
     • Open the Console (below the editor) for error messages. A common issue is an invalid API key.
       Ensure the key is correct and that you included it via api_key prop.
     • Ensure you installed the @what3words/react-components package and imported it correctly.
       If the component isn't recognized, double-check the import line.
     • Check that your input has autoComplete="off" (browser autocompletion can sometimes
       cover the suggestions dropdown).
     • Make sure you're typing at least two words and a part of the third for suggestions to appear (the
       What3Words API requires at least the first two whole words and some of the third to start
       suggesting 7 ).

```

Testing in Replit's live preview should quickly show whether everything is working. Once you're satisfied
that selecting an address displays the correct info, you're ready to deploy or share your project.

## Deploying Your App on Replit

Replit makes it easy to share or deploy your React app:

  • Sharing the Development Version: While your Repl is running, you can click the Open in new
```
       tab button (usually appears above the preview). This will open the app at a URL like https://
       <your-repl-name>.<your-username>.repl.co . You can share this URL with others for
       testing. Keep in mind, if you stop the Repl (or if it times out due to inactivity), this link will go
       down.
     • Using Replit Deployments: For a more permanent solution, Replit offers a Deploy feature to
       host your app. Click the rocket icon (Deploy) in the Replit interface (or the Deploy button) and
       follow the prompts to deploy your React app as a static site. Replit will bundle your app and host
       it on a stable URL. This deployed version will run even when you're not actively editing the Repl.
     • When deploying, ensure that your environment variable (the W3W API key) is included. Replit
       usually carries over the secret, but double-check in the deployment settings if available.
     • Once deployed, you can choose a custom domain or use the provided .replit.app domain to
       share your project.
     • Final Checks: After deployment, visit the live site and test the search box again. Everything
       should work similarly to the development preview. If the suggestions or API calls aren't working
       in production, verify that the API key was properly configured for the deployed environment as
       well.

```

Congratulations! You have built and deployed a simple React application on Replit that integrates the
What3Words AutoSuggest component. You can now quickly search for any three-word address and see
its details. This proof-of-concept can be expanded further (for example, integrating a map or using
more of the What3Words API), but you have a solid starting point.

Happy coding!

1   2   @what3words/react-components - npm
https://www.npmjs.com/package/@what3words/react-components

3   4   5   Using the JavaScript AutoSuggest Component | what3words
https://developer.what3words.com/tutorial/javascript-autosuggest-component-v4

6   7   API Reference Docs | what3words
https://developer.what3words.com/public-api/docs