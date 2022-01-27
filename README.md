# Superflow

Stack Overflow tag dashboard and scorecard for open source projects.

Developers ask questions on Stack Overflow but it's not easy to get a picture of how well they're being served for a given project.

Superflow is a dashboard for maintainers, developer advocates and community managers to see how "healthy" their projects are on Stack Overflow by analyzing a given tag.

## User Stories

As a user:

* I want to follow multiple tags on Stack Overflow through a website
* I want to enter a tag to "subscribe" to it
* When I open the page it remembers my tags and shows me updated information

For each tag, I want to see a TODO section:

* A list of unanswered questions, with ability to sort by how long ago they were asked
* A list of questions with answers that have not been accepted

For each tag, I want to see metrics that tell me the overall health of the tag:

* Total number of questions
* % of questions with accepted answers
* % of questions with answers that have not been accepted
* Length of time since first ever tagged question (overall project age, kinda)
* Question volume over time (growing? shrinking?)
* Median time for a question to be answered
* Top users with accepted answers

## Implementation

* No login required, unless StackOverflow oauth login to get API access
* All application state to be stored client-side instead of on a server-side database
* All API calls either run client side if possible, or through a proxy API


## Running locally
In order to run Superflow locally, please follow the instructions :

- Clone the repository into your local system.
  ```git clone https://github.com/autonome/superflow.git```

- Install all the required dependencies by running the below command,
  ```npm install```
  
- Start the local development server,
  ```npm start```
