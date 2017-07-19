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
* Run the following commands
```
npm install
npm start
```
* To stop server
```
ctrl+c
```

## Running the automated testing ##
```
npm test -- [reporter]
```
Replace [reporter] with the type of reporter you want to show the 
result of the testing in.
For example,
```
npm test -- spec
```
will show the results as hierarchical view nested just as the test 
cases are, and
```
npm test -- progress
```
will show the results as a progress bar.

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


## Optional ##
### Install Gulp globally ###
```
npm install --global gulp-cli
```