Developer Console Logger For Mobile and other devices
======================================================

Writes the console log and debug information including error that are trapped on developer console in HTML container so that it can be viewed on the devices where developer console is not available like mobile, PDA, iPod, iPad, Apple watch


Query String Parameters

1) doDebug=true  // Required to enable html console logger, expected value should be true

2) maxConsoleLimit=10  // Optional, Default value is 15. 
                       // It limits the number of lines to be shown on the html console.

3) consolePosition=bottom // Optional, Default value is top. 
                          // It configures the position of html console container.

4) consoleMinimized=true // Optional, Default value is false. 
                          // It configures display of html console container.
                          
5) consolePaused=true   // Optional, Default value is false. 
                       // It configures status of html console container.

6) retryDebug=true     // Optional, Default value is false. 
                       // If script tag is in the head tag then script is not able to add html console container in the                              body. So, this flag retries to create the DOM after 100 milliseconds.
