
# javascript_utils
Contains useful utils functions for javascript projects
# Table of content
1. parameter
- Validating functions' parameters
2. json_api 
- Format data to JSONAPI 
3. folktale 
- folktale utils function s
4. lodash 
-  More supports for function programming
 - Add folktale/result to some lodash functions
6. ramda 
-  Add some resuable lens
 - Add folktale/result to some ramda functions
7. general_utils
- useful uncategorized utils functions
# Installation
## Local
1. Create personal github access token \
Go to [https://github.com/settings/tokens](https://github.com/settings/tokens) and create an access token with `repo` scope . Save the token in a secure place.
2.  Setup url rewrite in ~/.gitconfig \
```
git config --global url."https://GITHUB_TOKEN:x-oauth-basic@github.com/".insteadOf https://x-oauth-basic@github.com/
```
3. Install private repository \
Verbose log level for debugging access errors.\
```
npm install --loglevel verbose --save git+https://x-oauth-basic@github.com/<USERNAME>/<REPOSITORY>.git
```
## Heroku
In the project where this repo installed on
1. Set config var
```
heroku config:set GITHUB_TOKEN=<token_value>
```
2. Configure `package.json`
Set heroku-prebuild
```
...
"scripts": {
  heroku-prebuild: "npm install --loglevel verbose --save git+https://x-oauth-basic@github.com/<USERNAME>/<REPOSITORY>.git"
  }, 
...
  ```

# Development
```
npm install
npm test
```
