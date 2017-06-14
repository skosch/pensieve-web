# Installation

1. Download all the required npm packages
2. Create a file `lib/credentials.json` with the contents
```
{
  "server": "https://pensieve.your_server.com/thoughts",
  "name": "your_user_name",
  "password": "your_password"
}
```
3. Set up a pouchdb-server on your server, and forward
   `pensieve.your_server.com` to `localhost:5798`.
4. Use the web interface at `pensieve.your_server.com/_utils` to set up an admin
   account with your name and the password above, and create a database named
   `thoughts`.
5. Run this with `yarn start`.


