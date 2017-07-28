# Micro Finance API #
## Set up ##
* Download and install Git for Windows
* Open folder you want to copy files to in command prompt
```
cd [folder path]
```
* Download files, use the URL provided by BitBucket
* Open folder that was created by git clone command in Visual Studio Code (2017_ccpd_2017)
* Open the terminal in VS Code, ctrl+`
* To install the dependencies
```
npm install
```
* To run the server in production mode
```
npm start
```
* To run the server in development mode
```
npm run dev
```
* To stop server
```
ctrl+c
```

## Running the automated testing ##
```
npm test
```
### Running for the first time ###
Running the testing for the first time will result in the entire
online database(~250MB) being downloaded to the computer. To avoid
Mocha timing out during the download, increase the timeout for 
Mocha in scripts.test in package.json to at least 15 mins.
Change the line
```
"test": "mocha --timeout 10000"
```
Once the database has been downloaded and the test cases have been
run, revert the changes made to the package.json file.