# Full Stack Guestbook Week04 Project

## Requirements

### 🎯 Ensure your HTML form is working and submitting data into the database as expected.

Database updates as expected - schema image provided on moodle.


### 🎯 Confirm that your project is functional on multiple screen sizes using either media queries or dynamic CSS styling.

Styling uses a single-column design with max/min-width to provide appropriate visual design for all screen sizes. For small screen a media query is included to make sure the user edit form isn't spaced awkwardly.

### 🎯 Create a working GET API route in your server.

GET route fetches chat messages and updates clients through websocket.

### 🎯 Create a working POST API route in your client.

POST route allows users to submit messages to the chat, which then updates on each client through websockets.

### 🎯 Seed your database with realistic-looking ‘dummy’ data through the Supabase query editor or a seed file in your server. Ensure that this is saved and submitted (in a screenshot or seed file form) so it can be marked and tested efficiently.

See seed.js inside server. Dummy data for chat messages uses different users, text content and emojis.

## Stretch Requirments

### 🏹 Provide additional functionality on the form, for example, by adding form validation or other options.
Chat form will not submit if nothing is entered, using the standard HTML `required` attribute. The user edit form is allowed to have a blank user (which will default to "👤 anon" when sending messages). The color also has a default value in case a user finds a way to submit it blank.

### 🏹 Style the page excellently, for example, by adding extra UX considerations or animations.
css transitions used for user edit form and button hovers. Hovering over chat messages provides highlighted relevant timestamp as well as buttons for "Like" and "Delete" features.

### 🏹 Add a delete button to each message and a DELETE route in the server.
All messages can be deleted by hovering over them and clicking the trash button that appears next to the message.

### 🏹 Create an option for users to like others’ posts.
All messages can be like by hovering over them and clicking the thumbs up button that appears next to the message. A user can only like each message once and may revoke their like by clicking the button again. A total amounts of likes is displayed next to any message that has more than 0 likes. Like tracking for each user is stored using local storage.

### 🏹 Implement client to client websockets to allow performant real time updating when another users actions make changes to the database.
I chose to implement websockets as a stretch goal because a static webpage that would only update when refreshed didn't seem appropriate for a chat app. The websocket will refresh all data whenever another client adds, deletes, or likes a message. Previously to implementing websockets I was using a `setInterval` that ran every 0.5 seconds. This didn't seem like a good solution as it meant the server would be bombarded by a new request every 0.5 seconds for each client connected. It also made debugging (watching source in dev tools) and css transitions awkward because of the constant updating of content. Websockets provide a way to only update the client when there is a change which is much more performant and doesn't get in the way of css transitions or debugging in dev tools.

## Reflections
Given more time I would have liked to flesh out the UI/UX more: 
 - more detailed media queries to better support various screen resolutions.
 - subtle sound effects on new messages and like button clicks.
 - settings menu with more options than the user edit form.
 - statistics for user tracked inside local storage and displayed in a menu (time spent chatting, total chat messages sent/liked/deleted).

 I would also have liked to implement more detailed error handling but unfortunately don't have a great understanding of this yet. For the moment I just implemented try catch error handling and researched to find the most relevant error codes to return.

The UI is very simple, I like this a lot, but I would like to provide some further customization (dark/light mode, themes, custom background image, user profile pictures).

I would have liked to implement built in emoji menus to the username and message forms. Everything currently works fine with emojis but a menu next to text fields to insert emojis from a grid of choices would be quicker and more convenient for the user.

There were no significant bugs encountered in develop, mostly trouble derived from further developing understanding of how to implement postgres databases and websockets, as well as the occasional flexbox misunderstanding.

I'm happy with the functionality I have achieved in exploring databases, monorepos and websockets. A login system would be the next step and open up a lot of options for further functionality. Using local storage is obviously exploitable, and allowing every user to delete any message is far from ideal.

