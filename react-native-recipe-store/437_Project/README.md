# 437_Project



The React Native app is in 437scratchApp.  
To run it you have to install Node.JS on your pc, install npx expo in the directory.  
I used these 2 tutorials for that (in order):
https://reactnative.dev/docs/environment-setup
https://reactnative.dev/docs/getting-started

Following those should get you to having an app on your phone, with a blue text button saying "firstButton".
Clicking that sends the fetch to my aws instance, so change the ip on 23 and 30 if you try on yours.
You know it works if you see "Hello World" in the console.



For hosting on aws just follow these tutorials to set up ExpressJS on aws, use the index.js from 437_Project/serverside/, and change security groups on AWS to have a Custom TCP rule for port 3000.  
I did push the whole repo I initialized ExpressJS in, so the server works when I pull it and execute "node index.js" inside of the "serverside" directory from a terminal, so it should work as is, but the tutorials are likely still helpful (and environment setup is still needed I'm sure).

Express JS Installation
https://expressjs.com/en/starter/installing.html

Express JS Hello World
https://expressjs.com/en/starter/hello-world.html
